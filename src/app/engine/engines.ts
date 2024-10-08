
export type EngineType =
  | "cartesian_image"
  | "cartesian_image_turbo"
  | "cartesian_video"
  | "spherical_image"
  | "spherical_video"
  | "spherical_stereogram"
  | "spherical_stereovideo"

export interface Engine {
  type: EngineType
  label: string
  modelName: string
  modelUrl: string
  visible: boolean
  enabled: boolean
}

export const engines: Record<string, Engine> = {
  /*
  cartesian_image: {
    type: "cartesian_image_turbo",
    label: "Turbo image",
    visible: true,
    enabled: true,
    modelName: "LCM-SDXL",
    modelUrl: "https://huggingface.co/latent-consistency/lcm-sdxl",
  },
  */
  /*
  cartesian_image: {
    type: "cartesian_image",
    label: "Turbo image",
    visible: true,
    enabled: true,
    modelName: "SDXL",
    modelUrl: "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0",
  },
  cartesian_video: {
    type: "cartesian_video",
    label: "Cartesian video",
    visible: true,
    enabled: true,
    modelName: "Zeroscope",
    modelUrl: "https://huggingface.co/cerspense/zeroscope_v2_576w",
  },
  */
  spherical_image: {
    type: "spherical_image",
    label: "Flux Panorama LoRA v2",
    visible: true,
    enabled: true,
    modelName: "Flux Panorama LoRA v2",
    modelUrl: "https://huggingface.co/jbilcke-hf/flux-dev-panorama-lora-2",
  },
  /*

  spherical_video: {
    type: "spherical_video",
    label: "Spherical video",
    visible: false,
    enabled: false,
    modelName: "Zeroscope",
    modelUrl: "https://huggingface.co/cerspense/zeroscope_v2_576w",
  },

  spherical_stereogram: {
    type: "spherical_stereogram",
    label: "Spherical stereogram",
    visible: false,
    enabled: false,
    modelName: "SDXL 360",
    modelUrl: "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0",
  },

  // A.K.A. the Holy Graal
  spherical_stereovideo: {
      type: "spherical_stereovideo",
      label: "Spherical stereovideo",
      visible: false,
      enabled: false,
      modelName: "",
      modelUrl: "",
    }
  */
}

export const defaultEngine: EngineType = Object.keys(engines)[0] as EngineType

export const getEngine = (type?: EngineType): Engine => engines[type || defaultEngine] || engines[defaultEngine]