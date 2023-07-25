import { pick } from "./pick"
import { Agent, Scene } from "./types"

const actions = [
  "waiting",
  "jumping",
  "eating a mouse",
  "looking at camera",
  "touch a rock",
  "touching grass",
  "drinking from a water hole"
]

const positions = [
  "in the forest",
  "in a plain",
  "in front of a fox hole",
  "in front of a bush"
]


export const agent: Agent = {
  title: "Fox",
  type: "fox",
  simulate: (): Scene => {
    const action = pick(actions)
    const position = pick(positions)

    const prompt = [
      `medium shot of a fox`,
      action,
      position,
      `high res`,
      `documentary`,
    ].join(", ")

    return {
      action,
      position,
      prompt
    }
  }
}