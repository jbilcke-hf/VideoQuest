import { useRef } from "react"
import { SceneEventHandler } from "./types"
import { RenderedScene } from "@/app/types"
import { useImageDimension } from "@/lib/useImageDimension"

export function CartesianVideo({
  rendered,
  onEvent,
  className,
  debug,
}: {
  rendered: RenderedScene
  onEvent: SceneEventHandler
  className?: string
  debug?: boolean
}) {
  const maskDimension = useImageDimension(rendered.maskUrl)

  const ref = useRef<HTMLVideoElement>(null)
  const handleEvent = (event: React.MouseEvent<HTMLVideoElement, MouseEvent>, isClick: boolean) => {

    if (!ref.current) {
      console.log("element isn't ready")
      return
    }

    const boundingRect = ref.current.getBoundingClientRect()
    // const x = (event.clientX - boundingRect.left) * 1.03
    // const y = (event.clientY - boundingRect.top) //* 1.03

    // those X and Y will be based on the current size of the container, which might be variable
    const containerX = event.clientX - boundingRect.left
    const containerY = event.clientY - boundingRect.top

    // then we convert them to relative coordinates
    const relativeX = containerX / boundingRect.width
    const relativey = containerY / boundingRect.height

    // finally, we convert back to coordinates within the input image
    // TODO: go read the video size
    const contentX = relativeX * maskDimension.width
    const contentY = relativey * maskDimension.height

    const eventType = isClick ? "click" : "hover"
    onEvent(eventType, contentX, contentY)
  }

  return (
    <div className={className}>
      <video
        src={rendered.assetUrl || undefined}
        ref={ref}
        onMouseUp={(event) => handleEvent(event, true)}
        onMouseMove={(event) => handleEvent(event, false)}
        className="absolute"
        muted
        autoPlay
        loop
        width="1024px"
        height="512px"
      />
      {debug && <img
        src={rendered.maskUrl || undefined}
        className="absolute opacity-50 pointer-events-none"
        width="1024px"
        height="512px"
      />}
    </div>
  )
}