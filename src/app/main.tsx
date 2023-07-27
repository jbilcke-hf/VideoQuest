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
import { Agent, AgentType, Scene } from "./agents/types"
import { agents, defaultAgent, getAgent } from "./agents"
import { ImageSegment, RenderedScene } from "./types"

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
   
  useEffect(() => {
    
    const updateView = async () => {
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
          setTimeout(() => { updateView() }, 0)
          return
        } 


        if (newRendered.assetUrl) {
          setRendered(newRendered)
          // console.log(`got a new url: ${newUrl}`)
          setScene(scene)
          setTimeout(() => { updateView()}, 1000)
        } else {
          // console.log(`going to wait a bit more: ${newUrl}`)
          setTimeout(() => { updateView()}, newRendered.error ? 6000 : 3000)
        }
      })
    }

    updateView()

  }, [])

  return (
    <div className="flex flex-col w-full pt-4">
      <div className="flex flex-col space-y-3 px-2">
        <div className="flex flex-row items-center space-x-3">
          <label className="flex">Select a game:</label>
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
        <p>Note: changing the model might take up to 1 minute</p>
          
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
      <ImageRenderer rendered={rendered} />
    </div>
  )
}