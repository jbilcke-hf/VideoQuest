import { Game } from "@/app/games/types"
import { createLlamaPrompt } from "@/lib/createLlamaPrompt"
import { parseJsonList } from "@/lib/parseJsonList"

import { getBase } from "./getBase"
import { predict } from "./predict"
import { normalizeActionnables } from "@/lib/normalizeActionnables"

const parseActionnablesOrThrow = (input: string) => {
  let result: string[] = []
  try {
    result = parseJsonList(input)

    if (!result.length) {
      throw new Error("no actionnables")
    }
  } catch (err) {
    console.log("failed to find a valid JSON! attempting method 2..")

    const sanitized = input.replaceAll("[", "").replaceAll("]", "")
    result = (JSON.parse(`[${sanitized}]`) as string[])

    if (!result.length) {
      throw new Error("no actionnables")
    }
  }
  return result
}

export const getActionnables = async ({
  game,
  situation = "",
  lastEvent = "",
}: {
  game: Game;
  situation: string;
  lastEvent: string;
}) => {

  const { currentPrompt, initialPrompt, userSituationPrompt } = getBase({ game, situation, lastEvent })

  const basePrompt = initialPrompt !== currentPrompt
    ? `Here is some context information about the initial scene: ${initialPrompt}`
    : ""

  let rawStringOutput = ""
  let result: string[] = []

  try {
    rawStringOutput = await predict({
      systemPrompt: [
        `You are an API endpoint that can return a list of objects visible in the background image of a game.`,
        basePrompt,
        `You must list twelve (12) basic names of visible objects (eg. "door", "person", "window", "light", "floor", "knob", "button", "rock", "tree", "box", "glass".. etc) but don't list any word from abstract or immaterial concepts (ig. don't list words like "secret", "danger", "next move", "game" etc)`,
        `The answer must be a JSON array, ie. a list of 12 quoted strings.`
      ].filter(item => item).join("\n"),
      userPrompt: userSituationPrompt,
      nbMaxNewTokens: 200,
    })
    result = parseActionnablesOrThrow(rawStringOutput)
  } catch (err) {
    console.error(`prediction of the actionnables failed, going to use default value`)
    console.log("for reference, rawStringOutput was: ", rawStringOutput)
  }
  
  return normalizeActionnables(result)
}