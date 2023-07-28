import { Game } from "@/app/games/types"
import { createLlamaPrompt } from "@/lib/createLlamaPrompt"

import { getBase } from "./getBase"
import { predict } from "./predict"

export const getSoundTrack = async ({
  game,
  situation = "",
  actionnable = "",
  newDialogue = "",
  newActionnables = [],
}: {
  game: Game;
  situation: string;
  actionnable: string;
  newDialogue: string;
  newActionnables: string[];
}) => {

  return ""
}