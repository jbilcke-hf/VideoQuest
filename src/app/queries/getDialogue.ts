import sbd from "sbd"

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

  let result = ""
  try {
    result = await predict({
      systemPrompt: [
        `You are an AI game master.`,
        `You are going to receive new information about the current whereabouts and action of the player.`,
        basePrompt,
        `You must imagine a funny response to speak in reaction to what the player did`,
        `Please only write between 2 to 3 short sentences, please.`,
        `Please add a few funny puns and jokes.`,
        `But please don't say things like "Well, well, well" or "Ah, the classic combination of" it is annoying.`
      ].filter(item => item).join("\n"),
      userPrompt: userSituationPrompt,
      nbMaxNewTokens: 200
    })
    if (!result.trim().length) {
      throw new Error("empty dialogue!")
    }
  } catch (err) {
    console.error(`prediction of the dialogue failed`)
    throw new Error(`failed to generate the dialogue ${err}`)
  }

  const tmp = result.split("game master:").pop() || result

  // llama-2 is too chatty, let's keep 3 sentences at most
  const sentences = sbd.sentences(tmp).slice(0, 3).join(" ").trim()

  return sentences
}
