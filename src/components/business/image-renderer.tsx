import { useRef } from "react"

import { ImageSegment, RenderedScene } from "@/app/types"

export const ImageRenderer = ({
  assetUrl = "",
  maskBase64 = "",
  segments = []
}: RenderedScene) => {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  
  const getPixelColor = (x: number, y: number) => {
    console.log("getting pixel color")
    if (!context) {
      throw new Error("Unable to get context from canvas")
    }

    const imgData = context.getImageData(x, y, 1, 1).data

    return `[${imgData[0]},${imgData[1]},${imgData[2]},${imgData[3]/255}]`
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    const boundingRect = imgRef.current!.getBoundingClientRect()
  
    const x = event.clientX - boundingRect.left
    const y = event.clientY - boundingRect.top
  
    if (maskBase64) {
      const image = new Image()

      image.onload = function () {
        if (context) {
          context.drawImage(image, 0, 0)

          const clickedColor = getPixelColor(x, y) as any
          
          let closestSegment: ImageSegment | null = null

          let minDistance = Infinity
          
          segments.forEach(segment => {
            const segmentColor = segment.color.slice(0,3) // get the RGB part only
            
            const distance = Math.sqrt(
              Math.pow(clickedColor[0] - segmentColor[0], 2) +
              Math.pow(clickedColor[1] - segmentColor[1], 2) +
              Math.pow(clickedColor[2] - segmentColor[2], 2)
            )
            
            if(distance < minDistance) {
              minDistance = distance;
              closestSegment = segment;
            }
          })
  
          console.log("closestSegment:", closestSegment)
          console.log(closestSegment) // Here is the closest matching segment
        }
      }

      image.src = maskBase64
      // image.src = "data:image/png;base64," + maskBase64;
    } else {
      console.log("No mask available, aborting..")
    }
  }


  if (!assetUrl) {
    return <div className="flex w-full h-screen items-center justify-center text-center">
      <div>Rendering first frame.. (might take around 30s)</div>
    </div>
  }

  return (
    <div className="w-full py-8 px-2">
      <img
        src={assetUrl}
        ref={imgRef}
        className="w-full rounded-md overflow-hidden"
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}