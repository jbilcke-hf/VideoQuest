"use client"

import { InventoryItem } from "../types"

// could also be Zustand or something
export const store: {
  currentlyDraggedItem?: InventoryItem
} = {
  currentlyDraggedItem: undefined
}
