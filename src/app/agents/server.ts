"use server"

import { HfInference } from "@huggingface/inference"

const hfi = new HfInference(process.env.HF_API_TOKEN)
const hf = hfi.endpoint(`${process.env.HF_INFERENCE_ENDPOINT_URL || ""}`)

export async function decideNextSteps(userAction: string) {
  return ""
}