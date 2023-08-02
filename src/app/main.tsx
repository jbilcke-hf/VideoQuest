"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"


import { Renderer } from "@/components/business/renderer"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { newRender, getRender } from "./render"

import { RenderedScene } from "./types"
import { Game, GameType } from "./games/types"
import { defaultGame, games, getGame } from "./games"
import { getBackground } from "@/app/queries/getBackground"
import { getDialogue } from "@/app/queries/getDialogue"
import { getActionnables } from "@/app/queries/getActionnables"
import { Engine, EngineType, defaultEngine, engines, getEngine } from "./engines"

const getInitialRenderedScene = (): RenderedScene => ({
  renderId: "",
  status: "pending",
  assetUrl: "", 
  error: "",
  maskUrl: "",
  segments: []
})
export default function Main() {
  const [isPending, startTransition] = useTransition()
  const [rendered, setRendered] = useState<RenderedScene>(getInitialRenderedScene())
  const renderedRef = useRef<RenderedScene>()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
 
  const requestedGame = (searchParams.get('game') as GameType) || defaultGame
  const gameRef = useRef<GameType>(requestedGame)
  const [game, setGame] = useState<Game>(getGame(gameRef.current))

  const requestedEngine = (searchParams.get('engine') as EngineType) || defaultEngine
  const [engine, setEngine] = useState<Engine>(getEngine(requestedEngine))

  const debug = (searchParams.get('debug') === "true")

  const [situation, setSituation] = useState("")
  const [scene, setScene] = useState("")
  const [dialogue, setDialogue] = useState("")
  const [hoveredActionnable, setHoveredActionnable] = useState("")

  const loopRef = useRef<any>(null)

  const loadNextScene = async (nextSituation?: string, nextActionnables?: string[]) => {
    
    await startTransition(async () => {
      console.log("Rendering a scene for " + game.type)

      // console.log(`rendering scene..`)
      renderedRef.current = await newRender({
        engine,

        // SCENE PROMPT
        prompt: game.getScenePrompt(nextSituation).join(", "),

        // ACTIONNABLES
        actionnables: (Array.isArray(nextActionnables) && nextActionnables.length
          ? nextActionnables
          : game.initialActionnables
        ).slice(0, 6) // too many can slow us down it seems
      })

      console.log("got the first version of our scene!", renderedRef.current)

      // detect if type game type changed while we were busy
      if (game?.type !== gameRef?.current) {
        console.log("game type changed! aborting..")
        return
      }

      setScene(scene)

      setRendered(renderedRef.current)
    })
  }

  const checkRenderedLoop = async () => {
    // console.log("checkRenderedLoop! rendered:", renderedRef.current)
    clearTimeout(loopRef.current)
    if (!renderedRef.current?.renderId || renderedRef.current?.status !== "pending") {
      // console.log("let's try again in a moments")
      loopRef.current = setTimeout(() => checkRenderedLoop(), 200)
      return
    } 

    // console.log("checking rendering..")
    await startTransition(async () => {
      // console.log(`getting latest updated scene..`)
      try {
        if (!renderedRef.current?.renderId) {
          throw new Error(`missing renderId`)
        }

      
        // console.log(`calling getRender(${renderedRef.current.renderId})`)
        const newRendered = await getRender(renderedRef.current.renderId)
        // console.log(`got latest updated scene:`, renderedRef.current)

        // detect if type game type changed while we were busy
        if (game?.type !== gameRef?.current) {
          console.log("game type changed! aborting..")
          return
        }

    
        const before = JSON.stringify(renderedRef.current)
        const after = JSON.stringify(newRendered)

        if (after !== before) {
          console.log("updating scene..")
          renderedRef.current = newRendered
          setRendered(renderedRef.current)
        }
      } catch (err) {
        console.error(err)
      }

      clearTimeout(loopRef.current)
      loopRef.current = setTimeout(() => checkRenderedLoop(), 1000)
    })
  }
    
  useEffect(() => {
    loadNextScene()
    checkRenderedLoop()
  }, [])

  const handleUserAction = async (actionnable: string) => {
    console.log("user actionnable:", actionnable)
  

    // TODO: ask Llama2 what to do about it
    // we need a frame and some actionnables,
    // perhaps even some music or sound effects

    await startTransition(async () => {

      const game = getGame(gameRef.current)

      let newDialogue = ""
      try {
        newDialogue = await getDialogue({ game, situation, actionnable })
        console.log(`newDialogue:`, newDialogue)
        setDialogue(newDialogue)
      } catch (err) {
        console.log(`failed to generate dialogue (but it's only a nice to have, so..)`)
        setDialogue("")
      }

      try {
        const newActionnables = await getActionnables({ game, situation, actionnable, newDialogue })
        console.log(`newActionnables:`, newActionnables)

        const newBackground = await getBackground({ game, situation, actionnable, newDialogue, newActionnables })
        console.log(`newBackground:`, newBackground)
        setSituation(newBackground)

        console.log("loading next scene..")
        await loadNextScene(newBackground, newActionnables)

          // todo we could also use useEffect
      } catch (err) {
        console.error(`failed to get one of the mandatory entites: ${err}`)
      }
    })
  }

  const clickables = Array.from(new Set(rendered.segments.map(s => s.label)).values())

  const handleSelectGame = (newGameType: GameType) => {
    gameRef.current = newGameType
    setGame(getGame(newGameType))
    /*
    setRendered({
      renderId: "",
      status: "pending",
      assetUrl: "", 
      error: "",
      maskUrl: "",
      segments:[]
    })
    */

    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set("game", newGameType)
    const search = current.toString()
    const query = search ? `?${search}` : ""

    // for some reason, this doesn't work?!
    router.replace(`${pathname}${query}`, { })
    
    // workaround.. but it is strange that router.replace doesn't work..
    //let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + search.toString()
    //window.history.pushState({path: newurl}, '', newurl)

    // actually we don't handle partial reload very well, so let's reload the whole page
    window.location = `${window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + search.toString()}` as any
  }


  const handleSelectEngine = (newEngine: EngineType) => {
    setEngine(getEngine(newEngine))

    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set("engine", newEngine)
    const search = current.toString()
    const query = search ? `?${search}` : ""

    // for some reason, this doesn't work?!
    router.replace(`${pathname}${query}`, { })
    
    // workaround.. but it is strange that router.replace doesn't work..
    // let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + search.toString()
    // window.history.pushState({path: newurl}, '', newurl)

    // actually we don't handle partial reload very well, so let's reload the whole page
    window.location = `${window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + search.toString()}` as any
  }

  return (
    <div
      className="flex flex-col w-full max-w-5xl"
    >
      <div className="flex flex-row w-full justify-between items-center px-2 py-2 border-b-1 border-gray-50 dark:border-gray-50 bg-gray-800 dark:bg-gray-800">
        <div className="flex flex-row items-center space-x-3 font-mono">
          <label className="flex text-sm">Select a story:</label>
          <Select
            defaultValue={gameRef.current}
            onValueChange={(value) => { handleSelectGame(value as GameType) }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue className="text-sm" placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(games).map(([key, game]) =>
              <SelectItem key={key} value={key}>{game.title}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row items-center space-x-3 font-mono">
          <label className="flex text-sm">Rendering engine:</label>
          <Select
            defaultValue={engine.type}
            onValueChange={(value) => { handleSelectEngine(value as EngineType) }}>
            <SelectTrigger className="w-[300px]">
              <SelectValue className="text-sm" placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(engines)
                .filter(([_, engine]) => engine.visible)
                .map(([key, engine]) =>
              <SelectItem key={key} value={key} disabled={!engine.enabled}>{engine.label} ({engine.modelName})</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={[
        "flex flex-col w-full pt-4 space-y-3 px-2 text-gray-50 dark:text-gray-50",
        getGame(gameRef.current).className // apply the game theme
      ].join(" ")}>
        <div className="flex flex-row">
          <div className="text-xl mr-2">
            {rendered.segments.length
              ? <span>🔎 Try to click on:</span>
              : <span>⌛ Searching in the scene..</span>
            }
          </div>
          {clickables.map((clickable, i) => 
          <div key={i} className="flex flex-row text-xl mr-2">
            <div className="">{clickable}</div>
            {i < (clickables.length - 1) ? <div>,</div> : null}
          </div>)}
        </div>
        <div className="text-xl p-3 rounded-xl backdrop-blur-sm bg-white/30">
          You are looking at: <span className="font-bold">{hoveredActionnable || "nothing"}</span>
        </div>
        <Renderer
          rendered={rendered}
          onUserAction={handleUserAction}
          onUserHover={setHoveredActionnable}
          isLoading={rendered.status === "pending"}
          game={game}
          engine={engine}
          debug={debug}
        />
        <div className="text-xl rounded-xl backdrop-blur-sm bg-white/30">{dialogue}</div>
      </div>
    </div>
  )
}