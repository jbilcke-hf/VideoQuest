import { lightSourceNames } from "./lightSourceNames"

export function normalizeActionnables(rawActionnables: string[]) {

  const tmp = rawActionnables.map(item =>
    // clean the words to remove any punctuation
    item.replace(/\W/g, '').trim()
  )

  const deduplicated = new Set<string>([
    ...tmp,
    // in case result is too small, we add a reserve of useful words here
    "door",
    "rock",
    "window",
    "table",
    "ground",
    "sky",
    "object",
    "tree",
    "wall",
    "floor"
    // but we still only want 10 here
    ].slice(0, 10)
  )

  console.log("deduplicated:", deduplicated)

  let actionnables = Array.from(deduplicated.values())

  // if we are missing a light source, we add one (the generic "light")
  if (!actionnables.some(actionnable => lightSourceNames.includes(actionnable))) {
    actionnables.push("light")
  }

  // if ground surfaces aren't in the list, we add at least one (the most generic)
  // if (!actionnables.includes("floor") || !actionnables.includes("ground")) {
  //   actionnables.push("floor")
  // }

  return actionnables
}