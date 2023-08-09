import { Game } from "@/app/games/types"
import { DraggableItem } from "./draggable-item"
import { OnInventoryEvent } from "@/types"
import { cn } from "@/lib/utils";

export function Inventory({
  className = "",
  game,
  isLoading,
  onEvent
}: {
  className?: string;
  game: Game;
  isLoading: boolean;
  onEvent: OnInventoryEvent;
}) {  
  return (
    <div className={cn(
      `fixed z-20 top-28 left-0 p-6 w-28`,
      // `w-full bg-stone-500 rounded-xl backdrop-blur-md bg-white/10`
      className,
    )}>
      <div className={cn(
        `flex flex-col space-y-2`
        //  `w-full grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-4`,
      )}>
        {game.inventory.map(item => (
          <DraggableItem
            key={item.name}
            game={game}
            item={item}
            isLoading={isLoading}
            onEvent={onEvent}
          />
        ))}
      </div>
    </div>
  )
}