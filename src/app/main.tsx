"use client"

import { useEffect, useRef, useState, useTransition } from "react"

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
import { predict } from "./predict"
import { GameType } from "./games/types"
import { defaultGame, games, getGame } from "./games"
import { getPrompts } from "./prompts"

export default function Main() {
  const [isPending, startTransition] = useTransition()
  const [rendered, setRendered] = useState<RenderedScene>({
    assetUrl: "", 
    error: "",
    maskBase64: "",
    segments:[]
  })
  const ref = useRef<GameType>(defaultGame)
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
      const type = ref?.current
      const game = getGame(type)

      // console.log(`rendering scene..`)
      const newRendered = await render(
        // SCENE PROMPT
        [...game.getScenePrompt(nextSituation)].join(", "),

        // ACTIONNABLES
        (Array.isArray(nextActionnables) && nextActionnables.length
          ? nextActionnables
          : game.initialActionnables
        ).slice(0, 6) // too many can slow us down it seems
      )

      // detect if something changed in the background
      if (type !== ref?.current) {
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

      const game = getGame(ref.current)

      const prompts = getPrompts(game, situation, actionnable)

      console.log("prompts:", prompts)

      try {

        console.log("ask the LLM to invent next steps..")

        const rawSituation = await predict(prompts.situationPrompt)

        console.log(`rawSituation: `, rawSituation)

        if (!rawSituation) {
          throw new Error("failed to generate the situation")
        }
        const newSituation = `${rawSituation || ""}`
        if (!newSituation) {
          throw new Error("failed to parse the situation")
        }

        console.log(`newSituation: `, newSituation)

        const rawActionnables = await predict(prompts.actionnablesPrompt)
        console.log(`rawActionnables: `, rawActionnables)

        if (!rawActionnables) {
          throw new Error("failed to generate the actionnables")
        }

        let newActionnables = []
        try {
          // we remove all [ or ]
          const sanitized = rawActionnables.replaceAll("[", "").replaceAll("]", "")
          newActionnables = (JSON.parse(`[${sanitized}]`) as string[]).map(item =>
            // clean the words to remove any punctuation
            item.replace(/\W/g, '').trim()
          )

          if (!newActionnables.length) {
            throw new Error("no actionnables")
          }
        } catch (err) {
          throw new Error("failed to parse the actionnables")
        }
 
        console.log(`newActionnables: `, newActionnables)

        const rawDialogue = await predict(prompts.dialoguePrompt)
        console.log(`rawDialogue: `, rawDialogue)

        if (!rawDialogue) {
          throw new Error("failed to generate the dialogue")
        }
        const newDialogue = `${rawDialogue || ""}`
        if (!newDialogue) {
            throw new Error("failed to parse the dialogue")
        }
        console.log(`newDialogue: `, newDialogue)


        setDialogue(newDialogue)
        setSituation(newSituation)

        console.log("loading next scene..")
        await loadNextScene(newSituation, newActionnables)

        // todo we could also use useEffect
      } catch (err) {
       console.error(err)
      }
    })
  }

  return (
    <div className="flex flex-col w-full pt-4">
      <div className="flex flex-col space-y-3 px-2">
        <div className="flex flex-row items-center space-x-3">
          <label className="flex">Select a story:</label>
          <Select
            defaultValue={defaultGame}
            onValueChange={(value) => {
              ref.current = value as GameType
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
        <p className="text-xl">The server is blowing up! Loading a panel may take a few minutes.</p>
        <p className="text-xl">{dialogue}</p>
        <div className="flex flex-row">
          <div className="text-xl mr-2">🔎 Possible items:</div>
          {rendered.segments.map((segment, i) => 
          <div key={i} className="flex flex-row text-xl mr-2">
            <div className="">{segment.label}</div>
            {i < (rendered.segments.length - 1) ? <div>,</div> : null}
          </div>)}
        </div>
        <p className="text-xl font-normal">You may be looking at.. <span className="font-bold">{hoveredActionnable || "nothing"}</span></p>
      </div>
      <ImageRenderer
        rendered={rendered}
        onUserAction={handleUserAction}
        onUserHover={setHoveredActionnable}
        isLoading={isLoading}
      />
    </div>
  )
}