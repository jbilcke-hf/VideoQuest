import { useEffect, useRef, useState } from "react"

import { ImageSegment, RenderedScene } from "@/app/types"
import { ProgressBar } from "../misc/progress"
import { Game } from "@/app/games/types"
import { Engine, EngineType } from "@/app/engines"
import { CartesianImage } from "./cartesian-image"
import { SceneEventHandler, SceneEventType } from "./types"
import { CartesianVideo } from "./cartesian-video"
import { SphericalImage } from "./spherical-image"

export const Renderer = ({
  rendered: {
    assetUrl = "",
    maskBase64 = "",
    segments = []
  },
  onUserAction,
  onUserHover,
  isLoading,
  game,
  engine,
}: {
  rendered: RenderedScene
  onUserAction: (actionnable: string) => void
  onUserHover: (actionnable: string) => void
  isLoading: boolean
  game: Game
  engine: Engine
}) => {
  const timeoutRef = useRef<any>()
  const imgRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [actionnable, setActionnable] = useState<string>("")
  const [progressPercent, setProcessPercent] = useState(0)
  const progressRef = useRef(0)
  const isLoadingRef = useRef(isLoading)
  const maskUrl = `data:image/png;base64,${maskBase64}`

  useEffect(() => {
    if (maskBase64) {
      // console.log("maskBase64:", maskBase64)
      const img = new Image();
      img.onload = function () {
        canvasRef.current = document.createElement('canvas');
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
        contextRef.current = canvasRef.current.getContext('2d', {
          willReadFrequently: true
        });
        contextRef.current!.drawImage(img, 0, 0, img.width, img.height);
      }
      img.src = "data:image/png;base64," + maskBase64;
    } else {
      // console.log("error, no maskBase64 detected!")
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
        // console.log(`${distance} -> ${segment.label}: score = ${segment.score}`)
      }
    });

    return closestSegment;
  }

  const handleMouseEvent: SceneEventHandler = async (type: SceneEventType, x: number, y: number) => {
    if (!contextRef.current) return; // Return early if mask image has not been loaded yet
  
    if (isLoading) {
      // we ignore all user interactions
      return
    }

    // sometimes we generate an image, but the segmentation fails
    // so if we click anywhere bug there are no segments,
    // we inform the rest of the app by passing nothing
    if (type === "click" && segments.length == 0) {
      onUserAction("nothing, to trigger a scene reload")
      return
    }

    const newSegment = getSegmentAt(x, y)

    if (actionnable !== newSegment.label) {
      if (newSegment.label) {
        console.log(`User is hovering "${newSegment.label}"`)
      } else {
        console.log(`Nothing in the area`)
      }

      // update the actionnable immediately, so we can show the hand / finger cursor pointer
      setActionnable(newSegment.label)
    }

    if (type === "click") {
      if (!newSegment.label) {
        return
      }
      console.log("User clicked on " + newSegment.label)
      onUserAction(actionnable)
    } else {
      // only trigger hover events if there are segments,
      // otherwise it's best to stay silent
      if (segments.length) {
        onUserHover(actionnable)
      }
    }
  };

  const updateProgressBar = () => {
    const duration = 1000 // 1 sec
    const frequency = 200 // 200ms
    const nbUpdatesPerSec = duration / frequency // 5x per second

    // normally it takes 45, and we will try to go below,
    // but to be safe let's set the counter a 1 min
    const nbSeconds = 32 // 1 min
    const amountInPercent =  100 / (nbUpdatesPerSec * nbSeconds) // 0.333

    progressRef.current = Math.min(100, progressRef.current + amountInPercent)
    setProcessPercent(progressRef.current)
  }

  useEffect(() => {
    clearInterval(timeoutRef.current)
    isLoadingRef.current = isLoading
    progressRef.current = 0
    setProcessPercent(0)
    if (isLoading) {
      timeoutRef.current = setInterval(updateProgressBar, 200)
    }
  }, [isLoading, assetUrl, engine?.type])


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
    <div className="w-full pt-2">
      <div
        className={[
          "relative border-2 border-gray-50 rounded-xl overflow-hidden",
          engine.type === "cartesian_video"
          || engine.type === "cartesian_image"
            ? "w-[1024px] h-[512px]"
            : "w-full h-[800px]",
            
          isLoading
            ? "cursor-wait"
            : actionnable
            ? "cursor-pointer"
            : ""
          ].join(" ")}>
        {!assetUrl ?
          null
        : engine.type === "cartesian_video"
          ? <CartesianVideo
              src={assetUrl}
              ref={imgRef as any}
              width="1024px"
              height="512px"
              onEvent={handleMouseEvent}
            />
          : engine.type === "spherical_image"
          ? <SphericalImage
              src={assetUrl}
              ref={imgRef as any}
              onEvent={handleMouseEvent}
            />
          : <CartesianImage
              src={maskUrl}
              ref={imgRef as any}
              width="1024px"
              height="512px"
              onEvent={handleMouseEvent}
            />
        }

      </div>

      {isLoading
      ? <div className="fixed flex w-20 h-20 bottom-8 right-0 mr-8">
          <ProgressBar
            text="⌛"
            progressPercentage={progressPercent}
          />
        </div>
      : null}
    </div>
  )
}