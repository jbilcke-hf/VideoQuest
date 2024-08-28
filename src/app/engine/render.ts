"use server"

import { RenderRequest, RenderedScene } from "@/types"

import { Engine } from "./engines"
import { getPanoramaFlux } from "./getPanoramaFlux"

export async function newRender({
  prompt,
  actionnables = [],
  engine,
  clearCache,
}: {
  prompt: string
  actionnables: string[]
  engine: Engine
  clearCache: boolean
}) {
  if (!prompt) {
    console.error(`cannot call the rendering API without a prompt, aborting..`)
    throw new Error(`cannot call the rendering API without a prompt, aborting..`)
  }
  if (!Array.isArray(actionnables) || !actionnables.length) {
    console.error(`cannot call the rendering API without actionnables, aborting..`)
    throw new Error(`cannot call the rendering API without actionnables, aborting..`)
  }

  const nbFrames = engine.type.includes("video") ? 8 : 1
  const isForVideo = nbFrames > 1
  const nbSteps = isForVideo ? 30 : engine.type === "cartesian_image_turbo" ? 8 : 35

  const request = {
    prompt,
    // nbFrames: 8 and nbSteps: 15 --> ~10 sec generation
    nbFrames, // when nbFrames is 1, we will only generate static images
    nbSteps,
    actionnables,
    segmentation: "firstframe", // one day we will remove this param, to make it automatic
    width: isForVideo ? 576 : 1024,
    height: isForVideo ? 320 : 512,
    upscalingFactor: 2,

    turbo: false,
  } as Partial<RenderRequest>

  try {
    const assetUrl = await getPanoramaFlux({
      prompt,
      width: 1024,
      height: 512
    })

    let result: RenderedScene = {
      renderId: "",
      status: "completed",
      assetUrl,
      alt: prompt || "",
      maskUrl: "",
      error: "",
      segments: []
    }
    
    return result
  } catch (err) {
    console.error(err)

    let defaulResult: RenderedScene = {
      renderId: "",
      status: "error",
      assetUrl: "",
      alt: prompt || "",
      maskUrl: "",
      error: "failed to fetch the data",
      segments: []
    }

    return defaulResult
  }
}