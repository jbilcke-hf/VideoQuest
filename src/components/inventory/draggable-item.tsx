
import Image from "next/image"
import { useDrag, useDrop } from "react-dnd"

import { Game } from "@/app/games/types"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { InventoryEvent, InventoryItem } from "@/app/types"
import { useEffect } from "react"

type DropResult = InventoryItem

export function DraggableItem({ game, item, onEvent }: {
  game: Game;
  item: InventoryItem;
  onEvent: (event: InventoryEvent, item: InventoryItem, target?: InventoryItem) => void
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "item",
    item,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<InventoryItem>()
      if (item && dropResult) {
        onEvent("DroppedOnAnotherItem", item, dropResult)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }))

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "item",
    drop: () => (item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  useEffect(() => {
    if (isDragging) {
      onEvent("Grabbing", item)
    } else {
      onEvent("DroppedBackToInventory", item)
    }
  }, [isDragging])

  return (
    <Tooltip key={item.name}>
      <TooltipTrigger asChild>
        <div
          ref={drag}
          key={item.name}
          onClick={() => onEvent("ClickOnItem", item)}
          className={[
          "bg-gray-100 rounded-2xl overflow-hidden",
          "transition-all duration-200",
          isDragging
            ? "brightness-100 scale-125 border border-stone-300 shadow-2xl cursor-grabbing"
            : "brightness-90 border-2 shadow-md cursor-grab",
          isOver && canDrop
            ? "border-stone-100"
            : "border-stone-600",
          "hover:brightness-100 hover:scale-125 hover:border hover:border-stone-300 hover:shadow-2xl",
          ].join(" ")}>
        <div ref={drop}>
          <Image
            src={`/inventories/${game.type}/${item.name}.jpeg`}
            width={1024}
            height={1024}
            alt={item.title}
          />
        </div>
      </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xl">{item.title}</p>
      </TooltipContent>
    </Tooltip>
  )
}