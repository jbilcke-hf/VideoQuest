import { cn } from "@/lib/utils"
import { ReactNode } from "react"

export function LastEvent({ children, className = "" }: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn(
      `fixed top-16 left-6 flex flex-row`,
      `transition-all duration-300`,
      `text-lg rounded-full backdrop-blur-md bg-stone-900/10 p-3`,
      className
    )}
    style={{
      textShadow: "1px 0px 2px #000000ab"
    }}>
      <div className="transition-all duration-300 text-xl px-2">{children}</div>
    </div>
  )
}