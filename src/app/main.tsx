"use client"

import { ReactNode, useEffect, useRef, useState, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { SceneRenderer } from "@/app/interface/renderer"

import { newRender, getRender } from "@/app/engine/render"
import { Engine, EngineType, defaultEngine, getEngine } from "@/app/engine/engines"

import { OnInventoryEvent, RenderedScene, SceneEvent } from "@/types"
import { Game, GameType } from "./games/types"
import { defaultGame, getGame } from "./games"
import { getBackground } from "@/app/queries/getBackground"
import { getDialogue } from "@/app/queries/getDialogue"
import { getActionnables } from "@/app/queries/getActionnables"

import { normalizeActionnables } from "@/lib/normalizeActionnables"
import { Inventory } from "@/app/interface/inventory"
import { store } from "./store"
import { defaultActionnables } from "@/lib/defaultActionnables"
import { TopMenu } from "./interface/top-menu"
import { LastEvent } from "./interface/last-event"
import { Help } from "./interface/help"
import { Dialogue } from "./interface/dialogue"
import { Progress } from "./interface/progress"
import { cn } from "@/lib/utils"

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
  const historyRef = useRef<RenderedScene[]>([])
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
 
  const requestedGame = (searchParams.get('game') as GameType) || defaultGame
  const gameRef = useRef<GameType>(requestedGame)
  const [game, setGame] = useState<Game>(getGame(gameRef.current))

  const requestedEngine = (searchParams.get('engine') as EngineType) || defaultEngine
  const usableEngine = game.engines.includes(requestedEngine) ? requestedEngine : game.engines[0]
  const [engine, setEngine] = useState<Engine>(getEngine(usableEngine))

  const requestedDebug = (searchParams.get('debug') === "true")
  const [debug, setDebug] = useState<boolean>(requestedDebug)

  const requestedClearCache = (searchParams.get('clearCache') ? (searchParams.get('clearCache') === "true") : false)
  const [clearCache, setClearCache] = useState<boolean>(requestedClearCache)

  const [situation, setSituation] = useState("")

  const [dialogue, setDialogue] = useState("")
  const [isLoadingDialogue, setLoadingDialogue] = useState(false)

  /*
  const [grabbedItem, setGrabbedItem] = useState<InventoryItem>()
  const grabbedItemRef = useRef<InventoryItem | undefined>()
  grabbedItemRef.current = grabbedItem
  */

  const [isBusy, setBusy] = useState<boolean>(true)
  const busyRef = useRef(true)

  const loopRef = useRef<any>(null)

  const [lastEventString, setLastEventString] = useState<string>("")
  const [lastEvent, setLastEvent] = useState<ReactNode>(null)

  const loadNextScene = async (nextSituation?: string, nextActionnables?: string[]) => {
    
    await startTransition(async () => {
      console.log("Rendering a scene for " + game.type)

      // console.log(`rendering scene..`)
      const newRendered = await newRender({
        engine,

        // SCENE PROMPT
        prompt: game.getScenePrompt(nextSituation).join(", "),

        // ACTIONNABLES
        actionnables: normalizeActionnables(
          Array.isArray(nextActionnables) && nextActionnables.length
          ? nextActionnables
          : game.initialActionnables
        ),

        clearCache
      })

      // detect if type game type changed while we were busy
      // note that currently we reload the whol page when tha happens,
      // so this code isn't that useful
      if (game?.type !== gameRef?.current) {
        console.log("game type changed! aborting..")
        return
      }

      console.log("got the first version of our scene!", newRendered)

      // in cache we didn't hit the cache and the request is still pending
        // we cheat a bit by displaying the previous image as a placeholder
      if (!newRendered.assetUrl && rendered.assetUrl && rendered.maskUrl) {
        console.log("image is not in cache, using previous image as a placeholder..")
        // this is better than displaying a blank image, no?
        newRendered.assetUrl = rendered.assetUrl
        newRendered.maskUrl = rendered.maskUrl
      }

      historyRef.current.unshift(newRendered)
      setRendered(newRendered)

      if (newRendered.status === "completed") {
        setBusy(busyRef.current = false)
      }
    })
  }

  const checkRenderedLoop = async () => {
    // console.log("checkRenderedLoop! rendered:", renderedRef.current)
    clearTimeout(loopRef.current)
  
    if (!historyRef.current[0]?.renderId || historyRef.current[0]?.status !== "pending") {

      // console.log("let's try again in a moments")
      loopRef.current = setTimeout(() => checkRenderedLoop(), 1000)
      return
    } 

    // console.log("checking rendering..")
    await startTransition(async () => {
      // console.log(`getting latest updated scene..`)
      try {
        if (!historyRef.current[0]?.renderId) {
          throw new Error(`missing renderId`)
        }

      
        // console.log(`calling getRender(${renderedRef.current.renderId})`)
        const newRendered = await getRender(historyRef.current[0]?.renderId)
        // console.log(`got latest updated scene:`, renderedRef.current)

        // detect if type game type changed while we were busy
        if (game?.type !== gameRef?.current) {
          console.log("game type changed! aborting..")
          return
        }

    
        const before = JSON.stringify(historyRef.current[0])
        const after = JSON.stringify(newRendered)

        if (after !== before) {
          console.log("updating scene..")
          historyRef.current[0] = newRendered
          setRendered(historyRef.current[0])

          if (newRendered.status === "completed") {
            setBusy(busyRef.current = false)
          }
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


  const askGameMasterForEpicDialogue = async (lastEvent: string) => {
    await startTransition(async () => {
      setLoadingDialogue(true)
      // const game = getGame(gameRef.current)
      let newDialogue = ""
      try {
        newDialogue = await getDialogue({ game, situation, lastEvent })
      } catch (err) {
        console.log(`failed to generate dialogue, let's try again maybe`)
        try {
          newDialogue = await getDialogue({ game, situation, lastEvent: `${lastEvent}.` })
        } catch (err) {
          console.log(`failed to generate dialogue.. again (but it's only a nice to have, so..)`)
          setDialogue("")
          setLoadingDialogue(false)
          return
        }
      }

      // try to remove whatever hallucination might come up next
      newDialogue = newDialogue.split("As the player")[0]
      newDialogue = newDialogue.split("As they use")[0]
      setDialogue(newDialogue)
      setLoadingDialogue(false)
    })
  }

  const askGameMasterForEpicBackground = async (lastEvent: string = "") => {

    await startTransition(async () => {

      setBusy(busyRef.current = true) // this will be set to false once the scene finish loading

      // const game = getGame(gameRef.current)

      let newActionnables = [...defaultActionnables]

      try {
        newActionnables = await getActionnables({ game, situation, lastEvent })
        console.log(`newActionnables:`, newActionnables)
      } catch (err) {
        console.log(`failed to generate actionnables, using default value`)
      }

      try {

        // todo rename this background/situation mess
        // it should be only one word
        const newBackground = await getBackground({ game, situation, lastEvent, newActionnables })
        console.log(`newBackground:`, newBackground)
        setSituation(newBackground)

        console.log("loading next scene..")
        await loadNextScene(newBackground, newActionnables)

          // todo we could also use useEffect
      } catch (err) {
        console.error(`failed to get the scene: ${err}`)
      }
    })
  }


  const clickables = Array.from(new Set(rendered.segments.map(s => s.label)).values())

  // console.log("segments:", rendered.segments)

  const handleToggleDebug = (isToggledOn: boolean) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set("debug", `${isToggledOn}`)
    const search = current.toString()
    const query = search ? `?${search}` : ""

    // for some reason, this doesn't work?!
    router.replace(`${pathname}${query}`, { })
    
    // workaround.. but it is strange that router.replace doesn't work..
    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + search.toString()
    window.history.pushState({path: newurl}, '', newurl)

    setDebug(isToggledOn)
  }

  const handleToggleClearCache = (shouldClearCache: boolean) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set("clearCache", `${shouldClearCache}`)
    const search = current.toString()
    const query = search ? `?${search}` : ""

    // for some reason, this doesn't work?!
    router.replace(`${pathname}${query}`, { })
    
    // workaround.. but it is strange that router.replace doesn't work..
    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + search.toString()
    window.history.pushState({path: newurl}, '', newurl)

    setClearCache(shouldClearCache)
  }


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
    //const query = search ? `?${search}` : ""

    // for some reason, this doesn't work?!
    //router.replace(`${pathname}${query}`, { })
    
    // workaround.. but it is strange that router.replace doesn't work..
    //let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + search.toString()
    //window.history.pushState({path: newurl}, '', newurl)

    // actually we don't handle partial reload very well, so let's reload the whole page
    window.location = `${window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + search.toString()}` as any
  }

  const handleSceneEvent = (event: SceneEvent, actionnable?: string) => {
    // TODO use Zustand
    const item = store.currentlyDraggedItem

    const actionnableName = actionnable || "nothing"
    let newEvent = null
    let newEventString = ""
    if (event === "HoveringNothing") {
      if (item) {
        newEvent = <>🔎 You are holding <span className="font-bold">&quot;{item.name}&quot;</span> and looking around, wondering how to use it.</>
        newEventString = `User is holding "${item.name}" from their inventory and wonder how they can use it.`
      } else {
        newEvent = <>🔎 You are looking at the scene, searching for clues.</>
        newEventString = `User is looking at the scene, searching for clues.`
      }
    } else if (event === "HoveringActionnable") {
      if (item) {
        newEvent = <>🔎 You are holding <span className="font-bold">&quot;{item.name}&quot;</span>, waving it over <span className="font-bold">&quot;{actionnableName}&quot;</span></>
        newEventString = `User is holding "${item.name}" from their inventory and wonder if they can use it on "${actionnableName}"`
      } else {
        newEvent = <>🔎 You are looking at <span className="font-bold">&quot;{actionnableName}&quot;</span></>
        newEventString = `User is looking at "${actionnableName}"`
      }
    } else if (event === "ClickOnNothing") {
      newEvent = <>🔎 There is nothing here.</>
      newEventString = `User clicked on nothing.` 
    } else if (event === "ClickOnActionnable") {
      newEvent = <>🔎 You have clicked on <span className="font-bold">{actionnableName}</span></>
      newEventString = `User has clicked on "${actionnableName}"`
    }

    if (newEventString && newEventString !== lastEventString) {
      console.log(newEventString)
      setLastEventString(newEventString)
      setLastEvent(newEvent)
    }

    if (event === "ClickOnActionnable" || event === "ClickOnNothing") {
      setBusy(busyRef.current = true) // this will be set to false once the scene finish loading

      const dialogue = askGameMasterForEpicDialogue(newEventString)
      askGameMasterForEpicBackground(newEventString)
    }
  }

  const handleInventoryEvent: OnInventoryEvent = async (event, item, target) => {
    let newEvent = null
    let newEventString = ""
    if (newEvent === "Grabbing") {
      newEventString = `Player just grabbed "${item.name}".`
      newEvent = <>You just grabbed <span className="font-bold">&quot;{item.name}&quot;</span></>
    } else if (event === "DroppedOnActionnable") {
      newEventString = [
        `Player is trying to use`,
        `"${item.name}"`,
        item.description ? `(described as: "${item.description}")` : "",
        `from their inventory on "${target?.title}"`,
        target?.description ? `(described as: "${target?.description}")` : "",
        `within the scene.`,
        `What do you think should be the outcome?`
      ].filter(i => i).join(" ")
      newEvent = <>You try to use <span className="font-bold">&quot;{item.name}&quot;</span> on <span className="font-bold">&quot;{target?.title}&quot;</span></>
    } else if (event === "DroppedOnAnotherItem") {
      newEventString = [
        `Player is trying to use`,
        `"${item.name}"`,
        item.description ? `(described as: "${item.description}")` : "",
        `on "${target?.name}"`,
        target?.description ? `(described as: "${target?.description}")` : "",
        `What do you think could the use or combination of ${item.name} and ${target?.name} lead to?`,
        `Invent a funny outcome!`
      ].filter(i => i).join(" ")
      newEvent = <>You try to combine <span className="font-bold">&quot;{item.name}&quot;</span> with <span className="font-bold">&quot;{target?.title}&quot;</span></>
    } else if (event === "ClickOnItem") {
      newEventString = `Player is inspecting "${item.name}" from their inventory, which has the following description: "${item.description}". Can you invent a funny back story?`
      newEvent = <>🔎 You are inspecting <span className="font-bold">&quot;{item.name}&quot;.</span> {item.description}</>
    }

    if (newEventString && newEventString !== lastEventString) {
      console.log(newEventString)
      setLastEventString(newEventString)
      setLastEvent(newEvent)
    }

    if (event === "DroppedOnAnotherItem" || event === "ClickOnItem" || event === "DroppedOnActionnable") {
      askGameMasterForEpicDialogue(newEventString)
    }

    if (event === "DroppedOnActionnable") {
      setBusy(busyRef.current = true) // this will be set to false once the scene finish loading

      askGameMasterForEpicBackground(newEventString)
    }
  }
  const isLoadingScene = isBusy || rendered.status === "pending"
  const isLoadingSegments = !rendered.segments.length
  const isLoading = isLoadingScene || isLoadingSegments || isLoadingDialogue

  const addBottomMarginForPhotoSphereMenu = engine.type.startsWith("spherical")
  return (
    <div
      className="flex flex-col w-full max-w-5xl"
    >
      <TopMenu
        engine={engine}
        game={game}
        defaultGame={gameRef.current}
        debug={debug}
        clearCache={clearCache}
        onToggleDebug={handleToggleDebug}
        onChangeGame={handleSelectGame}
        onChangeEngine={handleSelectEngine}
        onToggleClearCache={handleToggleClearCache}
      />

      <DndProvider backend={HTML5Backend}>
        <div className={cn(
          "flex flex-col w-full pt-4 space-y-3 text-gray-50 dark:text-gray-50",
          getGame(gameRef.current).className // apply the game theme
        )}
        >
          <SceneRenderer
            rendered={rendered}
            onEvent={handleSceneEvent}
            isLoading={isLoadingScene}
            game={game}
            engine={engine}
            debug={debug}
          />
          <LastEvent>{lastEvent}</LastEvent>
          <Inventory game={game} isLoading={!rendered.segments.length} onEvent={handleInventoryEvent} />
          {/*
          <Help
            clickables={clickables}
            isLoading={!rendered.segments.length}
          />
      */}
          <Dialogue
            className={
              addBottomMarginForPhotoSphereMenu ? `bottom-16`: `bottom-6`
            }
            isLoading={isLoadingDialogue}>{
            dialogue
              ? dialogue
              : <Help clickables={clickables} isLoading={isLoadingSegments} />
            }</Dialogue>
          <Progress
            isLoading={isLoading}
            resetKey={[
              rendered?.segments?.length,
              rendered?.assetUrl,
            ].join("&&")}
          />
        </div>
      </DndProvider>
    </div>
  )
}