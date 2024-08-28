"use server"

import { HfInference } from "@huggingface/inference"
import { createZephyrPrompt } from "@/lib/createZephyrPrompt"

export async function predict({
  systemPrompt,
  userPrompt,
  nbMaxNewTokens
}: {
  systemPrompt: string
  userPrompt: string
  nbMaxNewTokens: number
}): Promise<string> {
  const hf = new HfInference(process.env.HF_API_TOKEN)
  let instructions = ""
  try {
    for await (const output of hf.textGenerationStream({
      model: `HuggingFaceH4/zephyr-7b-beta`,
      
      inputs: createZephyrPrompt([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]) + "\n[{", // <-- important: we force its hand

      parameters: {
        do_sample: true,
        max_new_tokens: nbMaxNewTokens,
        return_full_text: false,
      }
    })) {
      instructions += output.token.text
      // process.stdout.write(output.token.text)
      if (
        instructions.includes("</s>") || 
        instructions.includes("<s>") ||
        instructions.includes("/s>") ||
        instructions.includes("[INST]") ||
        instructions.includes("[/INST]") ||
        instructions.includes("<SYS>") ||
        instructions.includes("<<SYS>>") ||
        instructions.includes("</SYS>") ||
        instructions.includes("<</SYS>>") ||
        instructions.includes("<|user|>") ||
        instructions.includes("<|end|>") ||
        instructions.includes("<|system|>") ||
        instructions.includes("<|assistant|>")
      ) {
        break
      }
    }
  } catch (err) {
    // console.error(`error during generation: ${err}`)

    // a common issue with Llama-2 might be that the model receives too many requests
    if (`${err}` === "Error: Model is overloaded") {
      instructions = ``
    }
  }

  // need to do some cleanup of the garbage the LLM might have gave us
  return (
    instructions
    .replaceAll("<|end|>", "")
    .replaceAll("<s>", "")
    .replaceAll("</s>", "")
    .replaceAll("/s>", "")
    .replaceAll("[INST]", "")
    .replaceAll("[/INST]", "") 
    .replaceAll("<SYS>", "")
    .replaceAll("<<SYS>>", "")
    .replaceAll("</SYS>", "")
    .replaceAll("<</SYS>>", "")
    .replaceAll("<|system|>", "")
    .replaceAll("<|user|>", "")
    .replaceAll("<|all|>", "")
    .replaceAll("<|assistant|>", "")
    .replaceAll('""', '"')
  )
}
