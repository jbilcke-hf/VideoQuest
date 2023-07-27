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
 
    // TODO: ask Llama2 what to do about it
    // we need a frame and some actionnables,
    // perhaps even some music or sound effects

    await startTransition(async () => {
 
      setLoading(true)

      const game = getGame(ref.current)
      const initialPrompt = [...game.getScenePrompt()].join(", ")

      const currentPrompt = situation
        ? [...game.getScenePrompt(situation)].join(", ")
        : initialPrompt

      try {
        const basePrompt = [
          `QUESTION: You are the AI game master of a role video game.`,
          initialPrompt !== currentPrompt ? `The initial scene of the game was this: "${initialPrompt}".` : '',
          `The player is currently in this scene: "${currentPrompt}".`,
          `The player has just clicked on "${actionnable}".`
        ]

        console.log("ask the LLM to invent next steps..")

        const rawSituation = await predict([
          ...basePrompt,
          `Please describe the new scene to display in intricate details: the environment, lights, era, characters, objects, textures, light etc. You must include important objects, that the user can click on (eg. characters, doors, vehicles, useful objects).\nANSWER:`
        ].join(" "))

        console.log(`rawSituation: `, rawSituation)

        if (!rawSituation) {
          throw new Error("failed to generate the situation")
        }
        const newSituation = `${rawSituation.split("QUESTION:")[0] || ""}`
        if (!newSituation) {
          throw new Error("failed to parse the situation")
        }

        console.log(`newSituation: `, newSituation)

        const rawActionnables = await predict([
          ...basePrompt,
          `Here are the 4 most important objects visible in this scene, that the user can click on. The list is in JSON (list of strings). You must list basic name of things (eg. "parrot", "chest", "spaceship", "glass", "door", "person", "window", "light", "knob", "button" etc..) \nJSON = [`
        ].join(" "))
        console.log(`rawActionnables: `, rawActionnables)

 
        if (!rawActionnables) {
          throw new Error("failed to generate the actionnables")
        }

        let newActionnables = []
        try {
          newActionnables = (JSON.parse(
            `[${rawActionnables.split("]")[0] || ""}]`
          ) as string[]).map(item =>
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

 
        const rawDialogue = await predict([
          ...basePrompt,
          `As a game master, what should you say next? (Only reply with 2 sentences, please).\nANSWER:`
        ].join(" "))
        console.log(`rawDialogue: `, rawDialogue)

        if (!rawDialogue) {
          throw new Error("failed to generate the dialogue")
        }
        const newDialogue = `${rawDialogue.split("QUESTION:")[0] || ""}`
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