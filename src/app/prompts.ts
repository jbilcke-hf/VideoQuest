import { Game } from "./games/types"
import { createLlamaPrompt } from "@/lib/createLlamaPrompt"

export const getPrompts = (game: Game, situation: string = "", actionnable: string = "") => {

  const initialPrompt = [...game.getScenePrompt()].join(", ")

  const currentPrompt = situation
    ? [...game.getScenePrompt(situation)].join(", ")
    : initialPrompt
  
  const userSituationPrompt = `Player is currently in "${currentPrompt}". Player clicked on the "${actionnable}".`

  const baseSituationPromptIfWeHaveHistory = initialPrompt !== currentPrompt
    ? ` You must imagine the most plausible next scene, based on where the player was located before and is now, and also what the player did before and are doing now.
Here is the original scene in which the user was located at first, which will inform you about the general settings to follow (you must respect this): "${initialPrompt}".`
    : ""

  const situationPrompt = createLlamaPrompt([
    {
      role: "system",
      content: [
        `You are the AI game master of a role video game.`,
        baseSituationPromptIfWeHaveHistory,
        `You are going to receive new information about the current whereabouts of the player.`,
        `Please write a caption for the next plausible scene to display in intricate details: the environment, lights, era, characters, objects, textures, light etc. You must include important objects, that the user can click on (eg. characters, doors, vehicles, useful objects).`
      ].filter(item => item).join("\n")
    },
    {
      role: "user",
      content: userSituationPrompt
    }
  ])

  const actionnablesPrompt = createLlamaPrompt([
    {
      role: "system",
      content: [
        `You are an API endpoint that can return a list of objects thare are in a scene.`,
        `You must list basic name of things (eg. "parrot", "chest", "spaceship", "glass", "door", "person", "window", "light", "knob", "button" etc)`,
        `The answer must be a JSON array, ie. a list of quoted strings.`
      ].filter(item => item).join("\n")
    },
    {
      role: "user",
      content: userSituationPrompt
    }
  ])

  const baseDialoguePromptIfWeHaveHistory = initialPrompt !== currentPrompt
  ? `for your information, the initial game panel and scene was: "${initialPrompt}".`
  : ""

  const dialoguePrompt = createLlamaPrompt([
    {
      role: "system",
      content: [
        `You are the AI game master of a role video game.`,
        `You are going to receive new information about the current whereabouts and action of the player.`,
        baseDialoguePromptIfWeHaveHistory,
        `You must imagine a funny response to speak in reaction to what the player did, like in some old point and click video games.`,
        `Please limit yourself to only a 1 or 2 sentences, please.`,
      ].filter(item => item).join("\n")
    },
    {
      role: "user",
      content: userSituationPrompt
    }
  ])


  const prompts = {
    initialPrompt,
    currentPrompt,
    userSituationPrompt,
    baseSituationPromptIfWeHaveHistory,
    situationPrompt,
    actionnablesPrompt,
    baseDialoguePromptIfWeHaveHistory,
    dialoguePrompt,
  }

  return prompts
}


