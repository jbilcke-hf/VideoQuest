"use server"

import { RenderedScene } from "./types"

// note: there is no / at the end in the variable
// so we have to add it ourselves if needed
const apiUrl = process.env.RENDERING_ENGINE_API

export async function render(prompt: string, actionnables: string[] = []) {
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
        nbFrames: 1, // when nbFrames is 1, we will only generate static images
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
    return defaulResult
  }
}
