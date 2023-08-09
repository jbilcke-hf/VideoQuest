import { useEffect, useRef } from "react"

import { RenderedScene } from "@/types"
import { MouseEventHandler } from "@/app/interface/renderer/types"
import { FullScreenIcon } from "@/components/icons/full-screen"
import { FullScreenButton } from "@/app/interface/renderer/full-screen-button"

export function CartesianImage({
  rendered,
  onEvent,
  className,
  debug
}: {
  rendered: RenderedScene
  onEvent: MouseEventHandler
  className?: string
  debug?: boolean
}) {

  const ref = useRef<HTMLImageElement>(null)

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
    <>
      <img
        src={rendered.assetUrl || undefined}
        ref={ref}
        className="fixed w-screen top-0 left-0 right-0"
        onMouseUp={(event) => handleEvent(event, true)}
        onMouseMove={(event) => handleEvent(event, false)}
      />
      {debug && <img
        src={rendered.maskUrl || undefined}
        className="fixed w-screen top-0 left-0 right-0 opacity-50 pointer-events-none"
      />}
      {/* <FullScreenButton /> */}
    </>
  )
}