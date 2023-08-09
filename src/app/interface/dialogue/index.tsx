import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export function Dialogue({ children, className = "", isLoading }: {
  children: ReactNode
  className?: string
  isLoading: boolean
 }) {
  return (
    <div
      className={cn(
        `fixed left-6 max-w-[60%]`,
        `transition-all duration-300`,
        `text-xl rounded-2xl backdrop-blur-xl bg-stone-600/40 p-4`,
        className
      )}
      style={{
        textShadow: "1px 0px 2px #000000ab"
      }}>{
      isLoading
      ? <p>⌛ Generating story, please wait..</p>
      : children
    }</div>
  )
}