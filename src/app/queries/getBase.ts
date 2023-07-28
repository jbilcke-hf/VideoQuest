import { Game } from "@/app/games/types"

export const getBase = (game: Game, situation: string = "", actionnable: string = "") => {
  const initialPrompt = [...game.getScenePrompt()].join(", ")

  const currentPrompt = situation
    ? [...game.getScenePrompt(situation)].join(", ")
    : initialPrompt

  const userSituationPrompt = `Player is currently in "${currentPrompt}". Player clicked on the "${actionnable}".`

  return { initialPrompt, currentPrompt, userSituationPrompt }
}