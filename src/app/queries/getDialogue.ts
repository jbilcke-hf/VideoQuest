import { Game } from "@/app/games/types"
import { createLlamaPrompt } from "@/lib/createLlamaPrompt"

import { getBase } from "./getBase"
import { predict } from "./predict"


export const getDialogue = async ({
  game,
  situation = "",
  actionnable = "",
  // newDialogue = "",
  // newActionnables = [],
}: {
  game: Game;
  situation: string;
  actionnable: string;
  // newDialogue: string;
  // newActionnables: string[];
}) => {

  const { currentPrompt, initialPrompt, userSituationPrompt } = getBase(game, situation, actionnable)

  /*
      const basePrompt = initialPrompt !== currentPrompt
  ? `for your information, the initial game panel and scene was: ${initialPrompt}`
  : ""
  */

  const basePrompt = initialPrompt !== currentPrompt
    ? ` You must imagine the most plausible next dialogue line from the game master, based on where the player was located before and is now, and also what the player did before and are doing now.
Here is the original scene in which the user was located at first, which will inform you about the general settings to follow (you must respect this): "${initialPrompt}".`
    : ""

  const prompt = createLlamaPrompt([
    {
      role: "system",
      content: [
        `You are the AI game master of a role video game.`,
        `You are going to receive new information about the current whereabouts and action of the player.`,
        basePrompt,
        `You must imagine a funny response to speak in reaction to what the player did, like in some old point and click video games.`,
        `Please limit yourself to only a 1 or 2 sentences, please.`,
        `Also please don't say things like "Well, well, well", it is annoying.`
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
    console.log(`prediction of the dialogue failed, trying again..`)
    try {
      result = await predict(prompt)
    } catch (err) {
      console.error(`prediction of the dialogue failed again!`)
      throw new Error(`failed to generate the dialogue ${err}`)
    }
  }

  return result
}
