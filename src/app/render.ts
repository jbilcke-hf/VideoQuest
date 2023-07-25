"use server"

// note: there is no / at the end in the variable
// so we have to add it ourselves if needed
const apiUrl = process.env.RENDERING_ENGINE_API

export async function render(prompt: string) {
  try {
    console.log(`calling ${apiUrl}/render with prompt: ${prompt}`)
    const res = await fetch(`${apiUrl}/render`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // Authorization: `Bearer ${process.env.VC_SECRET_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ prompt }),
       cache: 'no-store',
     // we can also use this (see https://vercel.com/blog/vercel-cache-api-nextjs-cache)
     // next: { revalidate: 1 }
    })

    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
    
    // Recommendation: handle errors
    if (res.status !== 200) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data')
    }
    
    const { url } = await res.json()

    return url
  } catch (err) {
    console.error(err)
    return ""
  }
}
