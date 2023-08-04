import { Game } from "@/app/games/types"

export const getBase = ({
  game,
  situation = "",
  userAction = "",
}: {
  game: Game;
  situation: string;
  userAction: string;
}) => {
  const initialPrompt = [...game.getScenePrompt()].join(", ")

  const currentPrompt = situation
    ? [...game.getScenePrompt(situation)].join(", ")
    : initialPrompt

  const userSituationPrompt = [
    `Player is currently in "${currentPrompt}".`,
    userAction
  ].join(" ")

  return { initialPrompt, currentPrompt, userSituationPrompt }
}