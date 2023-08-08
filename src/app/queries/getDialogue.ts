import { Game } from "@/app/games/types"
import { createLlamaPrompt } from "@/lib/createLlamaPrompt"

import { getBase } from "./getBase"
import { predict } from "./predict"


export const getDialogue = async ({
  game,
  situation = "",
  lastEvent = "",
}: {
  game: Game;
  situation: string;
  lastEvent: string;
}) => {

  const { currentPrompt, initialPrompt, userSituationPrompt } = getBase({ game, situation, lastEvent })

  console.log("DEBUG", {
    game, situation, lastEvent,
    currentPrompt,
    initialPrompt,
    userSituationPrompt,

  })
  /*
      const basePrompt = initialPrompt !== currentPrompt
  ? `for your information, the initial game panel and scene was: ${initialPrompt}`
  : ""
  */

  const basePrompt = initialPrompt !== currentPrompt
    ? `You must imagine the most plausible next dialogue line from the game master, based on current and past situation.
Here is the original situation, which will inform you about the general game mood to follow (you must respect this): "${initialPrompt}".`
    : ""

  const prompt = createLlamaPrompt([
    {
      role: "system",
      content: [
        `You are the AI game master of a role video game.`,
        `You are going to receive new information about the current whereabouts and action of the player.`,
        basePrompt,
        `You must imagine a funny response to speak in reaction to what the player did, like in some old point and click video games.`,
        `Please only write between 2 to 3 short sentences, please.`,
        `Please add a few funny puns and jokes.`,
        `But please don't say things like "Well, well, well" or "Ah, the classic combination of" it is annoying.`
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
    if (!result.trim().length) {
      throw new Error("empty dialogue!")
    }
  } catch (err) {
    console.log(`prediction of the dialogue failed, trying again..`)
    try {
      result = await predict(prompt+".")
    } catch (err) {
      console.error(`prediction of the dialogue failed again!`)
      throw new Error(`failed to generate the dialogue ${err}`)
    }
  }

  return result
}
