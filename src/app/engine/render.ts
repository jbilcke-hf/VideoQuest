"use server"



import { RenderRequest, RenderedScene } from "@/types"
import { Engine, EngineType } from "./engines"

// note: there is no / at the end in the variable
// so we have to add it ourselves if needed
const apiUrl = process.env.RENDERING_ENGINE_API

const cacheDurationInSec = 30 * 60 // 30 minutes

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

  // return await Gorgon.get(cacheKey, async () => {

    let defaulResult: RenderedScene = {
      renderId: "",
      status: "error",
      assetUrl: "",
      maskUrl: "",
      error: "failed to fetch the data",
      segments: []
    }

    try {
      // console.log(`calling POST ${apiUrl}/render with prompt: ${prompt}`)

      const isForVideo = nbFrames > 1

    const request = {
      prompt,
      // nbFrames: 8 and nbSteps: 15 --> ~10 sec generation
      nbFrames, // when nbFrames is 1, we will only generate static images
      nbSteps: isForVideo ? 30 : 35, // 20 = fast, 30 = better, 50 = best
      actionnables,
      segmentation: "firstframe", // one day we will remove this param, to make it automatic
      width: isForVideo ? 576 : 1024,
      height: isForVideo ? 320 : 768,

      // on VideoQuest we use an aggressive setting: 4X upscaling
      // this generates images that can be slow to load, but that's
      // not too much of an issue since we use async loading
      upscalingFactor: 4,

      // note that we never disable the cache completely for VideoQuest
      // that's because in the feedbacks people prefer speed to avoid frustration
      cache: clearCache ? "renew" : "use",

    } as Partial<RenderRequest>

    console.table(request)

      const res = await fetch(`${apiUrl}/render`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // Authorization: `Bearer ${process.env.VC_SECRET_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(request),
        cache: 'no-store',
      // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
      // next: { revalidate: 1 }
      })

      // console.log("res:", res)
      // The return value is *not* serialized
      // You can return Date, Map, Set, etc.
      
      // Recommendation: handle errors
      if (res.status !== 200) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
      }
      
      const response = (await res.json()) as RenderedScene
      // console.log("response:", response)
      return response
    } catch (err) {
      console.error(err)
      // Gorgon.clear(cacheKey)
      return defaulResult
    }

  // }, cacheDurationInSec * 1000)
}

export async function getRender(renderId: string) {
  if (!renderId) {
    console.error(`cannot call the rendering API without a renderId, aborting..`)
    throw new Error(`cannot call the rendering API without a renderId, aborting..`)
  }

  let defaulResult: RenderedScene = {
    renderId: "",
    status: "error",
    assetUrl: "",
    maskUrl: "",
    error: "failed to fetch the data",
    segments: []
  }

  try {
    // console.log(`calling GET ${apiUrl}/render with renderId: ${renderId}`)
    const res = await fetch(`${apiUrl}/render/${renderId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // Authorization: `Bearer ${process.env.VC_SECRET_ACCESS_TOKEN}`,
      },
      cache: 'no-store',
    // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
    // next: { revalidate: 1 }
    })

    // console.log("res:", res)
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    
    // Recommendation: handle errors
    if (res.status !== 200) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    
    const response = (await res.json()) as RenderedScene
    // console.log("response:", response)
    return response
  } catch (err) {
    console.error(err)
    // Gorgon.clear(cacheKey)
    return defaulResult
  }

  // }, cacheDurationInSec * 1000)
}