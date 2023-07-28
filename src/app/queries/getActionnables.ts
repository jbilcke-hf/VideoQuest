import { Game } from "@/app/games/types"
import { createLlamaPrompt } from "@/lib/createLlamaPrompt"
import { parseJsonList } from "@/lib/parseJsonList"

import { getBase } from "./getBase"
import { predict } from "./predict"

export const getActionnables = async ({
  game,
  situation = "",
  actionnable = "",
  newDialogue = "",
  // newActionnables = [],
}: {
  game: Game;
  situation: string;
  actionnable: string;
  newDialogue: string;
  // newActionnables: string[];
}) => {

  const { currentPrompt, initialPrompt, userSituationPrompt } = getBase(game, situation, actionnable)

  const basePrompt = initialPrompt !== currentPrompt
    ? `Here is some context information about the initial scene: ${initialPrompt}`
    : ""

  const prompt = createLlamaPrompt([
    {
      role: "system",
      content: [
        `You are an API endpoint that can return a list of objects visible in the background image of a role playing game.`,
        basePrompt,
        `You must list basic name of characters or visible objects (eg. "parrot", "chest", "spaceship", "glass", "door", "person", "window", "light", "knob", "button" etc) but don't list any word from abstract concepts (ig. don't say things like "secret", "danger", "next move" etc)`,
        `The answer must be a JSON array, ie. a list of quoted strings.`
      ].filter(item => item).join("\n")
    },
    {
      role: "user",
      content: userSituationPrompt
    }
  ])

  let rawStringOutput = ""
  
  try {
    rawStringOutput = await predict(prompt)
  } catch (err) {
    console.log(`prediction of the actionnables failed, trying again..`)
    try {
      rawStringOutput = await predict(prompt)
    } catch (err) {
      console.error(`prediction of the actionnables failed again!`)
      throw new Error(`failed to generate the actionnables ${err}`)
    }
  }
  
  let result = []

  try {
    result = parseJsonList(rawStringOutput)

    if (!result.length) {
      throw new Error("no actionnables")
    }
  } catch (err) {
    console.log("failed to find a valid JSON! attempting method 2..")

    try {
      const sanitized = rawStringOutput.replaceAll("[", "").replaceAll("]", "")
      result = (JSON.parse(`[${sanitized}]`) as string[]).map(item =>
        // clean the words to remove any punctuation
        item.replace(/\W/g, '').trim()
      )

      if (!result.length) {
        throw new Error("no actionnables")
      }
    } catch (err) {
      console.log("failed to repair and recover a valid JSON!")
      throw new Error("failed to parse the actionnables")
    }
  }

  return  result
}