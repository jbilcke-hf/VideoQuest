import { useEffect, useRef, useState } from "react"

import { ImageSegment, RenderedScene } from "@/app/types"

export const ImageRenderer = ({
  rendered: {
    assetUrl = "",
    maskBase64 = "",
    segments = []
  },
  onUserAction,
}: {
  rendered: RenderedScene
  onUserAction: (action: string) => void
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [actionnable, setActionnable] = useState<string>("")

  useEffect(() => {
    if (maskBase64) {
      console.log("maskBase64:", maskBase64)
      const img = new Image();
      img.onload = function () {
        canvasRef.current = document.createElement('canvas');
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
        contextRef.current = canvasRef.current.getContext('2d');
        contextRef.current!.drawImage(img, 0, 0, img.width, img.height);
      }
      img.src = "data:image/png;base64," + maskBase64;
    } else {
      console.log("error, no maskBase64 detected!")
    }
  }, [maskBase64]);


  const getPixelColor = (x: number, y: number) => {
    if (!contextRef.current) {
      throw new Error("Unable to get context from canvas")
    }

    const imgData = contextRef.current.getImageData(x, y, 1, 1).data


    const clickedColor = Array.from(imgData.slice(0, 3), value => value / 255);

    return clickedColor
  }


  const getSegmentAt = (x: number, y: number): ImageSegment => {
    if (!contextRef.current) throw new Error("Unable to get context from canvas");
    if (!maskBase64) throw new Error("Mask is undefined");

    let closestSegment: ImageSegment = {
      id: 0,
      box: [],
      color: [],
      label: "",
      score: 0,
    }

    const clickedColor = getPixelColor(x,y) as any

    if (`${clickedColor}` === "1,1,1") {
      return closestSegment
    }
  
    let minDistance = Infinity;
        
    segments.forEach(segment => {
      const segmentColor = segment.color.slice(0,3); // get the RGB part only

      const distance = Math.sqrt(
        Math.pow(clickedColor[0] - segmentColor[0], 2) +
        Math.pow(clickedColor[1] - segmentColor[1], 2) +
        Math.pow(clickedColor[2] - segmentColor[2], 2)
      );
      
      if(distance < minDistance) {
        minDistance = distance;
        closestSegment = segment;
      }
    });

    return closestSegment;
  }

  const handleMouseEvent = (event: React.MouseEvent, isClickEvent: boolean = false) => {
    if (!contextRef.current) return; // Return early if mask image has not been loaded yet
  
    const boundingRect = imgRef.current!.getBoundingClientRect();
    const x = event.clientX - boundingRect.left;
    const y = event.clientY - boundingRect.top;
  
    const newSegment = getSegmentAt(x, y)

    if (actionnable !== newSegment.label) {
      setActionnable(newSegment.label)
    }

    if (!newSegment.label) { return }

    console.log("actionnable: ", actionnable)

    if (isClickEvent) {
      console.log("User clicked on " + actionnable);
      // onUserAction(actionnable);
    }
  };

  if (!assetUrl) {
    return <div className="flex w-full h-screen items-center justify-center text-center">
      <div>Rendering first frame.. (might take around 30s)</div>
    </div>
  }

  /*
        <img
          src={assetUrl}
          ref={imgRef}
          width="1024px"
          height="512px"
          className={
            [
              "absolute top-0 left-0",
              actionnable ? "cursor-pointer" : ""
            ].join(" ")
          }
          onMouseDown={(event) => handleMouseEvent(event, true)}
          onMouseMove={handleMouseEvent}
        />

        <img
          src={"data:image/png;base64," + maskBase64}
          ref={imgRef}
          width="1024px"
          height="512px"
          className={
            [
              "absolute top-0 left-0 opacity-30",
              actionnable ? "cursor-pointer" : ""
            ].join(" ")
          }
          onMouseDown={(event) => handleMouseEvent(event, true)}
          onMouseMove={handleMouseEvent}
        />
        */

  return (
    <div className="w-full py-8 px-2">
      <div className="relative w-full">
        <img
          src={"data:image/png;base64," + maskBase64}
          ref={imgRef}
          width="1024px"
          height="512px"
          className={
            [
              "absolute top-0 left-0 opacity-30",
              actionnable ? "cursor-pointer" : ""
            ].join(" ")
          }
          onMouseDown={(event) => handleMouseEvent(event, true)}
          onMouseMove={handleMouseEvent}
        />
      </div>
    </div>
  )
}