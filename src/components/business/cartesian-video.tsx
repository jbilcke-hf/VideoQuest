import { ForwardedRef, forwardRef } from "react"

import { SceneEventHandler } from "./types"

export const CartesianVideo = forwardRef(({
  src,
  width,
  height,
  onEvent,
  className,
}: {
  src: string
  width: number | string
  height: number | string
  onEvent: SceneEventHandler
  className?: string
}, ref: ForwardedRef<HTMLVideoElement>) => {

  const handleEvent = (event: React.MouseEvent<HTMLVideoElement, MouseEvent>, isClick: boolean) => {

    const element = ((ref as any)?.current) as HTMLVideoElement

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
    <video
      src={src}
      ref={ref}
      muted
      autoPlay
      loop
      width={width}
      height={height}
      className={className}
      onMouseUp={(event) => handleEvent(event, true)}
      onMouseMove={(event) => handleEvent(event, false)}
    />
  )
})