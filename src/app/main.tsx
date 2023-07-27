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
import { AgentType, Scene } from "./agents/types"
import { agents, defaultAgent, getAgent } from "./agents"
import { RenderedScene } from "./types"

export default function Main() {
  const [isPending, startTransition] = useTransition()
  const [scene, setScene] = useState<Scene>()
  const [rendered, setRendered] = useState<RenderedScene>({
    assetUrl: "", 
    error: "",
    maskBase64: "",
    segments:[]
  })
  const ref = useRef<AgentType>(defaultAgent)
   

  const loadNextScene = async () => {
    // console.log(`update view..`)

    await startTransition(async () => {

      // console.log(`getting agent..`)
      const type = ref?.current
      const agent = getAgent(type)

      // console.log(`asking agent to determine things..`)
      const scene = agent.simulate()

      // console.log(`rendering scene..`)
      const newRendered = await render(
        scene.prompt,
        scene.actionnables.slice(0, 5) // too many can slow us down it seems
      )

      if (type !== ref?.current) {
        console.log("agent type changed! reloading scene")
        setTimeout(() => { loadNextScene() }, 0)
        return
      } 

      if (newRendered.assetUrl) {
        setRendered(newRendered)
        // console.log(`got a new url: ${newUrl}`)
        setScene(scene)
      }
    })
  }

  useEffect(() => {
    loadNextScene()
  }, [])

  const handleUserAction = (action: string) => {
    console.log("user action:", action)

    // TODO: ask Llama2 what to do about it
    // we need a frame and some actionnables,
    // perhaps even some music or sound effects

    console.log("we don't know what to do, so we just load the next frame!")
    loadNextScene()
  }

  return (
    <div className="flex flex-col w-full pt-4">
      <div className="flex flex-col space-y-3 px-2">
        <div className="flex flex-row items-center space-x-3">
          <label className="flex">Select a story:</label>
          <Select
            defaultValue={defaultAgent}
            onValueChange={(value) => {
              ref.current = value as AgentType
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
              {Object.entries(agents).map(([key, agent]) =>
              <SelectItem key={key} value={key}>{agent.title}</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <p>Note: it takes about 1 minute to generate a new game panel</p>
          
        {(scene) ? <div>
          <p>Action: {scene.action}</p>
          <p>Position: {scene.position}</p>
          <p>Light: {scene.light}</p>
        </div> : null}
        <div className="flex flex-col">
        {rendered.segments.map((segment, i) => 
          <div key={i}>
            {segment.label} ({segment.score})
          </div>)}
        </div>
      </div>
      <ImageRenderer rendered={rendered} onUserAction={handleUserAction} />
    </div>
  )
}