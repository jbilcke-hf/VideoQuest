import { Game } from "@/app/games/types"

export const getBase = ({
  game,
  situation = "",
  lastEvent = "",
}: {
  game: Game;
  situation: string;
  lastEvent: string;
}) => {
  const initialPrompt = [...game.getScenePrompt()].join(", ")

  const currentPrompt = situation
    ? [...game.getScenePrompt(situation)].join(", ")
    : initialPrompt

  const userSituationPrompt = [
    `Player is currently in "${currentPrompt}".`,
    lastEvent
  ].join(" ")

  return { initialPrompt, currentPrompt, userSituationPrompt }
}