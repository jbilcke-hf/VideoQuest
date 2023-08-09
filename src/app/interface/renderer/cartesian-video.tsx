import { useEffect, useRef } from "react"
import { MouseEventHandler } from "./types"
import { RenderedScene } from "@/types"

export function CartesianVideo({
  rendered,
  onEvent,
  className,
  debug,
}: {
  rendered: RenderedScene
  onEvent: MouseEventHandler
  className?: string
  debug?: boolean
}) {
  const ref = useRef<HTMLVideoElement>(null)


  const cacheRef = useRef("")
  useEffect(() => {
    const listener = (e: DragEvent) => {
      if (!ref.current) { return }

      // TODO: check if we are currently dragging an object
      // if yes, then we should check if clientX and clientY are matching the 
      const boundingRect = ref.current.getBoundingClientRect()

      // abort if we are not currently dragging over our display area
      if (e.clientX < boundingRect.left) { return }
      if (e.clientX > (boundingRect.left + boundingRect.width)) { return }
      if (e.clientY < boundingRect.top) { return }
      if (e.clientY > (boundingRect.top + boundingRect.height)) { return }

      const containerX = e.clientX - boundingRect.left
      const containerY = e.clientY - boundingRect.top
    
      const relativeX = containerX / boundingRect.width
      const relativeY = containerY / boundingRect.height

      const key = `${relativeX},${relativeY}`

      // to avoid use
      if (cacheRef.current === key) {
        return
      }
      // console.log(`DRAG: calling onEvent("hover", ${relativeX}, ${relativeY})`)

      cacheRef.current = key
      onEvent("hover", relativeX, relativeY)
    }

    document.addEventListener('drag', listener)

    return () => {
      document.removeEventListener('drag', listener)
    }
  }, [onEvent])
  
  const handleEvent = (event: React.MouseEvent<HTMLVideoElement, MouseEvent>, isClick: boolean) => {

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

  return (
    <div className={className}>
      <video
        src={rendered.assetUrl || undefined}
        ref={ref}
        onMouseUp={(event) => handleEvent(event, true)}
        onMouseMove={(event) => handleEvent(event, false)}
        className="fixed w-screen top-0 left-0 right-0"
        muted
        autoPlay
        loop
      />
      {debug && <img
        src={rendered.maskUrl || undefined}
        className="fixed w-screen top-0 left-0 right-0 opacity-50 pointer-events-none"
      />}
    </div>
  )
}