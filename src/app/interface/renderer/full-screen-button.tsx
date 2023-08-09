import { cn } from "@/lib/utils"
import { FullScreenIcon } from "../../../components/icons/full-screen"

export function FullScreenButton() {
  return (
    <div className={cn(
      `absolute z-10 right-0 bottom-0`,
    )}>
      <div
        className={cn(
          `transform-all duration-200 text-white opacity-80 cursor-pointer scale-100`,
          `hover:opacity-100 hover:text-white hover:scale-110 p-4`
        )}>
        <FullScreenIcon />
      </div>
    </div>
  )
}