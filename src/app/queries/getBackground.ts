import { Game } from "@/app/games/types"
import { createLlamaPrompt } from "@/lib/createLlamaPrompt"

import { getBase } from "./getBase"
import { predict } from "./predict"

export const getBackground = async ({
  game,
  situation = "",
  lastEvent = "",
  newActionnables = [],
}: {
  game: Game;
  situation: string;
  lastEvent: string;
  newActionnables: string[],
}) => {

  const {
    currentPrompt,
    initialPrompt,
    userSituationPrompt
  } = getBase({
    game,
    situation,
    lastEvent
  })

  const basePrompt = initialPrompt !== currentPrompt
    ? `You must imagine a very short caption for a background photo image, based on current and past situation.
Here is the original scene in which the user was located at first, which will inform you about the general game mood to follow (you must respect this): "${initialPrompt}".`
    : ""

  let result = ""
  try {
    result = await predict({
      systemPrompt: [
        `You are a photo director.`,
        basePrompt,
        `You are going to receive new information about the current activity of the player.`,
        `Please write in a single sentence a photo caption for the next plausible scene, using a few words for each of those categories: the environment, era, characters, objects, textures, lighting.`,
        `Separate each of those category descriptions using a comma.`,
        `You MUST mention the following important objects that the user can click on: ${newActionnables}.`,
        `Be brief in your caption don't add your own comments. Be straight to the point, and never reply things like "As the player approaches.." or "As the player clicks.." or "the scene shifts to.." (the best is not not mention the player at all)`
      ].filter(item => item).join("\n"),
      userPrompt: userSituationPrompt,
      nbMaxNewTokens: 200
    })
    if (!result.trim().length) {
      throw new Error("empty result from the LLM provider")
    }
  } catch (err) {
    console.error(`prediction of the background failed`)
    throw new Error(`failed to generate the background ${err}`)
  }

  const tmp = result.split("Caption:").pop() || result
  return tmp.replaceAll("\n", ", ")
}