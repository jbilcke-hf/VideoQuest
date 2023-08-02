import { ForwardedRef, forwardRef } from "react"

import { SceneEventHandler } from "./types"
import { RenderedScene } from "@/app/types"

export const CartesianVideo = forwardRef(({
  rendered,
  onEvent,
  className,
}: {
  rendered: RenderedScene
  onEvent: SceneEventHandler
  className?: string
}, ref: ForwardedRef<HTMLDivElement>) => {

  const handleEvent = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, isClick: boolean) => {

    const element = ((ref as any)?.current) as HTMLDivElement

    if (!element) {
      console.log("element isn't ready")
      return
    }

    const boundingRect = element.getBoundingClientRect()
    const x = event.clientX - boundingRect.left
    const y = event.clientY - boundingRect.top

    const eventType = isClick ? "click" : "hover"
    onEvent(eventType, x, y)
  }

  return (
    <div
    className={className}
    ref={ref}
    onMouseUp={(event) => handleEvent(event, true)}
    onMouseMove={(event) => handleEvent(event, false)}
  >
   <video
      src={rendered.assetUrl || undefined}
      muted
      autoPlay
      loop
      className="absolute"
    />
    <img
      src={rendered.maskUrl || undefined}
      className="absolute opacity-50"
    />
  </div>
  )
})

CartesianVideo.displayName = "CartesianVideo"