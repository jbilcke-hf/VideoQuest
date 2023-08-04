import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { Game } from "@/app/games/types"
import { DraggableItem } from "./draggable-item"
import { InventoryEvent, InventoryItem } from "@/app/types"

export function Inventory({
  game,
  onEvent
}: {
  game: Game;
  onEvent: (event: InventoryEvent, item: InventoryItem, target?: InventoryItem) => void
}) {  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-4 w-full bg-stone-500 p-4 rounded-xl">
        {game.inventory.map(item => (
          <DraggableItem
            key={item.name}
            game={game}
            item={item}
            onEvent={onEvent}
          />
        ))}
      </div>
    </DndProvider>
  )
}