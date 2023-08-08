import { Game } from "@/app/games/types"
import { createLlamaPrompt } from "@/lib/createLlamaPrompt"

import { getBase } from "./getBase"
import { predict } from "./predict"


export const getSound = async ({
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
    ? `Here is the original scene in which the user was located at first, which will inform you about the general settings to follow (you must respect this): "${initialPrompt}".`
    : ""

  const prompt = createLlamaPrompt([
    {
      role: "system",
      content: [
        `You are the AI game master of a role video game.`,
        `You are going to receive new information about the current whereabouts and action of the player.`,
        basePrompt,
        `You must imagine a sound effect in reaction to the player action.`,
        `Here are some examples, but don't copy them verbatim:\n`,
        `- "An excited crowd cheering at a sports game"\n`,
        `- "A cat is meowing for attention"\n`,
        `- "Birds singing sweetly in a blooming garden"\n`,
        `- "A modern synthesizer creating futuristic soundscapes"\n`,
        `- "The vibrant beat of Brazilian samba drums"\n`,
        `Here are some more instructions, to enhance the Qqality of your generated audio:`,
        `1. Try to use more adjectives to describe your sound. For example: "A man is speaking clearly and slowly in a large room" is better than "A man is speaking".\n`,
        `2. It's better to use general terms like 'man' or 'woman' instead of specific names for individuals or abstract objects that humans may not be familiar with, such as 'mummy'.\n`
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
