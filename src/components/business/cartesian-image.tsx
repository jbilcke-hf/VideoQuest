import { ForwardedRef, forwardRef } from "react"

import { SceneEventHandler } from "./types"
import { RenderedScene } from "@/app/types"

export const CartesianImage = forwardRef(({
  rendered,
  onEvent,
  className,
  debug
}: {
  rendered: RenderedScene
  onEvent: SceneEventHandler
  className?: string
  debug?: boolean
}, ref: ForwardedRef<HTMLDivElement>) => {

  const handleEvent = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, isClick: boolean) => {

    const element = ((ref as any)?.current) as HTMLDivElement

    if (!element) {
      console.log("element isn't ready")
      return
    }

    const boundingRect = element.getBoundingClientRect()
    const x = (event.clientX - boundingRect.left) * 1.03
    const y = (event.clientY - boundingRect.top) //* 1.03

    const eventType = isClick ? "click" : "hover"
    onEvent(eventType, x, y)
  }

  if (!rendered.assetUrl) {
    return null
  }
  return (
    <div
      className={className}
      onMouseUp={(event) => handleEvent(event, true)}
      onMouseMove={(event) => handleEvent(event, false)}
    >
      <img
        src={rendered.assetUrl || undefined}
        ref={ref as any}
        className="absolute"
      />
      {debug && <img
        src={rendered.maskUrl || undefined}
        className="absolute opacity-50"
      />}
    </div>
  )
})

CartesianImage.displayName = "CartesianImage"