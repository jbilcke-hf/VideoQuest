import { pick } from "./pick"
import { Agent, Scene } from "./types"

const actions = [
  "idling",
  "making bubbles",
  "making circles",
  "opening and closing its mouth",
  // "with an octopus",
  "playing with another fish",
  "eating fishfood",
  "eating a crab",
  "attacked by a jellyfish"
]

const positions = [
  "at the top of the coral",
  "at the bottom of the coral",
  "centered in the middle",
  "burrowing in the sand",
  "hiding in the coral"
]

const lights = [
  "during the day",
]

const actionnables = [
  "chest",
  // "door",
  // "window",
  // "sail",
  // "capstan",
  // "ship's wheel",
  // "hat",
  // "barrel",
  "cannon",
  // "rope",
  // "bucket",
  "skull",
  "parrot",
  "lock",
  "ship",
  // "wooden leg"
]

export const agent: Agent = {
  title: "Pirates",
  type: "pirates",
  simulate: (): Scene => {
    const action = pick(actions)
    const position = pick(positions)
    const light = pick(lights)

    // this prompt is beautiful:
    // screenshot from an adventure videogame, inside the hold of a pirate ship, with a pirate chest in the center, at sunset, beautiful, award winning, unreal engine, intricate details
    const prompt = [
      `screenshot from an adventure videogame`,
      `inside the hold of a pirate ship`,
      `a pirate chest in the center with a large lock`,
      `a parrot on top of it`,
      `at sunset`,
      `unreal engine`,
    ].join(", ")

    return {
      action,
      position,
      light,
      actionnables,
      prompt
    }
  }
}