import { useRef } from "react"
import { SceneEventHandler } from "./types"
import { RenderedScene } from "@/app/types"

export function CartesianImage({
  rendered,
  onEvent,
  className,
  debug
}: {
  rendered: RenderedScene
  onEvent: SceneEventHandler
  className?: string
  debug?: boolean
}) {

  const ref = useRef<HTMLImageElement>(null)
  const handleEvent = async (event: React.MouseEvent<HTMLImageElement, MouseEvent>, isClick: boolean) => {

    if (!ref.current) {
      // console.log("element isn't ready")
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
    const relativeY = containerY / boundingRect.height

    const eventType = isClick ? "click" : "hover"
    onEvent(eventType, relativeX, relativeY)
  }

  if (!rendered.assetUrl) {
    return null
  }
  return (
    <div
      className={[
        "h-[512px]",
        className
      ].join(" ")
      }
    >
      <img
        src={rendered.assetUrl || undefined}
        ref={ref}
        className="absolute"
        onMouseUp={(event) => handleEvent(event, true)}
        onMouseMove={(event) => handleEvent(event, false)}
      />
      {debug && <img
        src={rendered.maskUrl || undefined}
        className="absolute opacity-50 pointer-events-none"
      />}
    </div>
  )
}