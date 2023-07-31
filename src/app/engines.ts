
export type EngineType = "image" | "video"

export interface Engine {
  type: EngineType
  label: string
  modelName: string
  modelUrl: string
}

export const engines: Record<string, Engine> = {
  image: {
    type: "image",
    label: "Image",
    modelName: "SDXL 1.0",
    modelUrl: "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0",
  },
  video: {
    type: "video",
    label: "Video",
    modelName: "Zeroscope V2 576w",
    modelUrl: "https://huggingface.co/cerspense/zeroscope_v2_576w",
  }
}

export const defaultEngine: EngineType = "image"

export const getEngine = (type?: EngineType): Engine => engines[type || defaultEngine] || engines[defaultEngine]