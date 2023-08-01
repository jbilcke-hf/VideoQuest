export type ProjectionMode = 'cartesian' | 'spherical'

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
}

export interface ImageSegment {
  id: number
  box: number[]
  color: number[]
  label: string
  score: number 
}

export type RenderedSceneStatus = 'pending' | 'completed' | 'error'
export interface RenderedScene {
  renderId: string
  status: RenderedSceneStatus
  assetUrl: string 
  error: string
  maskBase64: string
  segments: ImageSegment[]
}