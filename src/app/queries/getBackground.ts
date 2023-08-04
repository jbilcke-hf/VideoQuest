import { Game } from "@/app/games/types"
import { createLlamaPrompt } from "@/lib/createLlamaPrompt"

import { getBase } from "./getBase"
import { predict } from "./predict"

export const getBackground = async ({
  game,
  situation = "",
  userAction = "",
  newActionnables = [],
}: {
  game: Game;
  situation: string;
  userAction: string;
  newActionnables: string[],
}) => {

  const {
    currentPrompt,
    initialPrompt,
    userSituationPrompt
  } = getBase({
    game,
    situation,
    userAction
  })

  const basePrompt = initialPrompt !== currentPrompt
    ? `You must imagine the most plausible next scene, based on where the player was located before and is now, and also what the player did before and are doing now.
Here is the original scene in which the user was located at first, which will inform you about the general settings to follow (you must respect this): "${initialPrompt}".`
    : ""

  const prompt = createLlamaPrompt([
    {
      role: "system",
      content: [
        `You are the AI game master of a role video game.`,
        basePrompt,
        `You are going to receive new information about the current whereabouts of the player.`,
        `Please write a caption for the next plausible scene to display in intricate details: the environment, lights, era, characters, objects, textures, light etc.`,
        `You MUST include the following important objects that the user can click on: ${newActionnables}.`,
        `Be straight to the point, and do not say things like "As the player clicks on.." or "the scene shifts to" (the best is not not mention the player at all)`
      ].filter(item => item).join("\n")
    },
    {
      role: "user",
      content: userSituationPrompt
    }
  ])


  let result = ""
  try {
    result = await predict(prompt)
  } catch (err) {
    console.log(`prediction of the background failed, trying again..`)
    try {
      result = await predict(prompt)
    } catch (err) {
      console.error(`prediction of the background failed again!`)
      throw new Error(`failed to generate the background ${err}`)
    }
  }

  return result
}