"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { useSearchParams } from 'next/navigation'

import { ImageRenderer } from "@/components/business/image-renderer"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { render } from "./render"

import { RenderedScene } from "./types"
import { GameType } from "./games/types"
import { defaultGame, games, getGame } from "./games"
import { getBackground } from "@/app/queries/getBackground"
import { getDialogue } from "@/app/queries/getDialogue"
import { getActionnables } from "@/app/queries/getActionnables"

export default function Main() {
  const [isPending, startTransition] = useTransition()
  const [rendered, setRendered] = useState<RenderedScene>({
    assetUrl: "", 
    error: "",
    maskBase64: "",
    segments:[]
  })
  const searchParams = useSearchParams()
 
  const requestedGame = (searchParams.get('game') as GameType) || defaultGame
  console.log("requestedGame:", requestedGame)
  const gameRef = useRef<GameType>(requestedGame)
  const [situation, setSituation] = useState("")
  const [scene, setScene] = useState("")
  const [dialogue, setDialogue] = useState("")
  const [hoveredActionnable, setHoveredActionnable] = useState("")
  const [isLoading, setLoading] = useState(true)

  const loadNextScene = async (nextSituation?: string, nextActionnables?: string[]) => {
    // console.log(`update view..`)
    setLoading(true)

    await startTransition(async () => {

      // console.log(`getting agent..`)
      // note: we use a ref so that it can be changed in the background
      const type = gameRef?.current
      console.log("type:", type)
      const game = getGame(type)

      // console.log(`rendering scene..`)
      const newRendered = await render(
        // SCENE PROMPT
        game.getScenePrompt(nextSituation).join(", "),

        // ACTIONNABLES
        (Array.isArray(nextActionnables) && nextActionnables.length
          ? nextActionnables
          : game.initialActionnables
        ).slice(0, 6) // too many can slow us down it seems
      )

      // detect if something changed in the background
      if (type !== gameRef?.current) {
        console.log("agent type changed! reloading scene")
        setTimeout(() => { loadNextScene() }, 0)
        return
      } 

      if (newRendered.assetUrl) {
        // console.log(`got a new url: ${newRendered.assetUrl}`)
        setScene(scene)

        setRendered(newRendered)
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    loadNextScene()
  }, [])

  const handleUserAction = async (actionnable: string) => {
    console.log("user actionnable:", actionnable)
  
    setLoading(true)

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
        setLoading(false)
      }
    })
  }

  const clickables = Array.from(new Set(rendered.segments.map(s => s.label)).values())

  return (
    <div className="flex flex-col w-full pt-4">
      <div className="flex flex-col space-y-3 px-2">
        <div className="flex flex-row items-center space-x-3">
          <label className="flex">Select a story:</label>
          <Select
            defaultValue={gameRef.current}
            onValueChange={(value) => {
              gameRef.current = value as GameType
              setRendered({
                assetUrl: "", 
                error: "",
                maskBase64: "",
                segments:[]
              })
            }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(games).map(([key, game]) =>
              <SelectItem key={key} value={key}>{game.title}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xl">This experimental demo uses shared ressources: each scene may take more than 45s to load.</p>
        <div className="flex flex-row">
          <div className="text-xl mr-2">🔎 Clickable items:</div>
          {clickables.map((clickable, i) => 
          <div key={i} className="flex flex-row text-xl mr-2">
            <div className="">{clickable}</div>
            {i < (rendered.segments.length - 1) ? <div>,</div> : null}
          </div>)}
        </div>
        <p className="text-xl font-normal">You are looking at: <span className="font-bold">{hoveredActionnable || "nothing"}</span></p>
      </div>
      <ImageRenderer
        rendered={rendered}
        onUserAction={handleUserAction}
        onUserHover={setHoveredActionnable}
        isLoading={isLoading}
      />
      <p className="text-xl">{dialogue}</p>
    </div>
  )
}