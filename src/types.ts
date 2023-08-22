export type ProjectionMode = 'cartesian' | 'spherical'

export type CacheMode = "use" | "renew" | "ignore"

export interface RenderRequest {
  prompt: string

  // whether to use video segmentation
  // disabled (default)
  // firstframe: we only analyze the first frame
  // allframes: we analyze all the frames
  segmentation: 'disabled' | 'firstframe' | 'allframes'

  // segmentation will only be executed if we have a non-empty list of actionnables
  // actionnables are names of things like "chest", "key", "tree", "chair" etc
  actionnables: string[]

  // note: this is the number of frames for Zeroscope,
  // which is currently configured to only output 3 seconds, so:
  // nbFrames=8 -> 1 sec
  // nbFrames=16 -> 2 sec
  // nbFrames=24 -> 3 sec
  nbFrames: number // min: 1, max: 24

  nbSteps: number // min: 1, max: 50

  seed: number

  width: number // fixed at 1024 for now
  height: number // fixed at 512 for now

  projection: ProjectionMode

  cache: CacheMode
}

export interface ImageSegment {
  id: number
  box: number[]
  color: number[]
  label: string
  score: number 
}

export type RenderedSceneStatus =
  | "pending"
  | "completed"
  | "error"

export type SceneEvent =
  | "HoveringNothing"
  | "HoveringActionnable"
  // | "ItemIsOverActionnable"
  | "ClickOnNothing"
  | "ClickOnActionnable"

  
export interface RenderedScene {
  renderId: string
  status: RenderedSceneStatus
  assetUrl: string 
  error: string
  maskUrl: string
  segments: ImageSegment[]
}

export type InventoryEvent =
  | "Grabbing" // grabbed from the inventory, the item is flying over nothing
  | "HoverAnItem" // hover an item, without dragging it
  | "ClickOnItem" // click on an item, without dragging it
  | "HoveringTheScene" // the item is hover the scene, but not on an actionnable
  | "HoveringActionnable" // the item is hover a scene actionnable, ready to be dropped
  | "DroppedOnActionnable" // the item has been dropped on a scene actionnable
  | "HoveringAnotherItem" // the item is hover another inventory item, ready to be dropped
  | "DroppedOnAnotherItem" // the item has been dropped on another inventory item
  | "DroppedBackToInventory" // the drag & drop is cancelled, the item is back in the inventory

  export interface InventoryItem {
    name: string
    title: string
    caption: string
    description: string
  }

  export interface DropZoneTarget {
    type: "InventoryItem" | "Actionnable"
    name: string
    title?: string
    caption?: string
    description?: string
  }

export type OnInventoryEvent = (event: InventoryEvent, item: InventoryItem, target?: {
  name: string
  title?: string
  description?: string
 }) => void