"use server"

import Gorgon from "@gorgonjs/gorgon"

import { RenderedScene } from "./types"
import { Engine, EngineType } from "./engines"

// note: there is no / at the end in the variable
// so we have to add it ourselves if needed
const apiUrl = process.env.RENDERING_ENGINE_API


const cacheDurationInSec = 30 * 60 // 30 minutes

export async function render({
  prompt,
  actionnables = [],
  engine,
}: {
  prompt: string
  actionnables: string[]
  engine: Engine
}) {
  if (!prompt) {
    console.error(`cannot call the rendering API without a prompt, aborting..`)
    throw new Error(`cannot call the rendering API without a prompt, aborting..`)
  }
  if (!Array.isArray(actionnables) || !actionnables.length) {
    console.error(`cannot call the rendering API without actionnables, aborting..`)
    throw new Error(`cannot call the rendering API without actionnables, aborting..`)
  }

  const nbFrames = engine.type === "video" ? 8 : 1

  const cacheKey = `render/${JSON.stringify({ prompt, actionnables, nbFrames, type: engine.type })}`

  return await Gorgon.get(cacheKey, async () => {
    let defaulResult: RenderedScene = {
      assetUrl: "",
      maskBase64: "",
      error: "",
      segments: []
    }

    try {
      console.log(`calling ${apiUrl}/render with prompt: ${prompt}`)
      const res = await fetch(`${apiUrl}/render`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          // Authorization: `Bearer ${process.env.VC_SECRET_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          prompt,
          // nbFrames: 8 and nbSteps: 15 --> ~10 sec generation
          nbFrames, // when nbFrames is 1, we will only generate static images
          nbSteps: 20,
          actionnables,
          segmentation: "firstframe", // one day we will remove this param, to make it automatic
        }),
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
      Gorgon.clear(cacheKey)
      return defaulResult
    }
  }, cacheDurationInSec * 1000)
}