import { useEffect, useRef, useState } from "react"

import { DropZoneTarget, ImageSegment, RenderedScene, SceneEvent } from "@/app/types"
import { ProgressBar } from "../misc/progress"
import { Game } from "@/app/games/types"
import { Engine } from "@/app/engines"
import { CartesianImage } from "./cartesian-image"
import { MouseEventHandler, MouseEventType } from "./types"
import { CartesianVideo } from "./cartesian-video"
import { SphericalImage } from "./spherical-image"
import { useImageDimension } from "@/lib/useImageDimension"
import { useDrop } from "react-dnd"
import { formatActionnableName } from "@/lib/formatActionnableName"
import { SceneTooltip } from "./scene-tooltip"
import { SceneMenu } from "./scene-menu"

export const SceneRenderer = ({
  rendered,
  onEvent,
  isLoading,
  game,
  engine,
  debug,
}: {
  rendered: RenderedScene
  onEvent: (event: SceneEvent, actionnable?: string) => void
  isLoading: boolean
  game: Game
  engine: Engine
  debug: boolean
}) => {
  const timeoutRef = useRef<any>()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [actionnable, setActionnable] = useState<string>("")
  const actionnableRef = useRef<string>("")
  const [progressPercent, setProcessPercent] = useState(0)
  const progressRef = useRef(0)
  const isLoadingRef = useRef(isLoading)
  const maskDimension = useImageDimension(rendered.maskUrl)

  const [isHover, setHover] = useState(false)

  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const [isTooltipVisible, setTooltipVisible] = useState(false)
  const [isMenuVisible, setMenuVisible] = useState(false)
  const [tooltipX, setTooltipX] = useState(0)
  const [tooltipY, setTooltipY] = useState(0)
  const [menuX, setMenuX] = useState(0)
  const [menuY, setMenuY] = useState(0)

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "item",
    drop: (): DropZoneTarget => ({
      type: "Actionnable",
      name: actionnable,
      title: formatActionnableName(actionnable),
      description: ""
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  useEffect(() => {
    if (!rendered.maskUrl) {
      return
    }
    const img = new Image()
    img.onload = function () {
      canvasRef.current = document.createElement('canvas')
      canvasRef.current.width = img.width
      canvasRef.current.height = img.height
      contextRef.current = canvasRef.current.getContext('2d', {
        willReadFrequently: true
      })
      contextRef.current!.drawImage(img, 0, 0, img.width, img.height)
    }
    img.src = rendered.maskUrl
  }, [rendered.maskUrl])

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
        
    rendered.segments.forEach(segment => {
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

  // note: coordinates must be between 0 and 1
  const handleMouseEvent: MouseEventHandler = async (type: MouseEventType, relativeX: number, relativeY: number) => {
    
    const noMenu = !containerRef.current
    const noContext = !contextRef.current
    const noSegmentationMask = !rendered.maskUrl
    const noSegmentsToClickOn = rendered.segments.length == 0

    const mustAbort =
     noMenu
     || noContext
     || noSegmentationMask
     || noSegmentsToClickOn
     || isLoading

    if (mustAbort) {
      // if (type === "click") { onEvent("ClickOnNothing") }
      return
    }

    const imageX = relativeX * maskDimension.width
    const imageY = relativeY * maskDimension.height
    
    const newSegment = getSegmentAt(imageX, imageY)

    if (actionnable !== newSegment.label) {
      if (newSegment.label) {
        // console.log(`User is hovering "${newSegment.label}"`)
      } else {
        // console.log(`Nothing in the area`)
      }

      // update the actionnable immediately, so we can show the hand / finger cursor pointer
      setActionnable(actionnableRef.current = newSegment.label)
    }

    const container = containerRef.current
    const containerBox = container.getBoundingClientRect()

    const absoluteMouseX = containerBox.left + relativeX * container.clientWidth
    const absoluteMouseY = containerBox.top + relativeY * container.clientHeight
    
    clearTimeout(tooltipTimeoutRef.current)
    clearTimeout(menuTimeoutRef.current)
    setTooltipVisible(false)
    setMenuVisible(false)
    setTooltipX(absoluteMouseX)
    setTooltipY(absoluteMouseY)
    setMenuX(absoluteMouseX)
    setMenuY(absoluteMouseY)

    
    if (type === "click") {
      setMenuVisible(false)
      if (!newSegment.label) {
        // setMenuVisible(false)
        return
      }

      setTooltipVisible(true)
      setMenuVisible(true)

      console.log("User clicked on " + newSegment.label)
      onEvent("ClickOnActionnable", actionnable)
    } else { // hover
      if (actionnable) {
        setHover(true)

        tooltipTimeoutRef.current = setTimeout(() => {
          if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current)
            tooltipTimeoutRef.current = undefined
            setTooltipVisible(true)
          }
        }, 400)

        menuTimeoutRef.current = setTimeout(() => {
          if (menuTimeoutRef.current) {
            clearTimeout(menuTimeoutRef.current)
            menuTimeoutRef.current = undefined
            setMenuVisible(true)
          }
        }, 500)

        onEvent("HoveringActionnable", actionnable)
      } else {
        setHover(false)
        onEvent("HoveringNothing")

        /*
        tooltipTimeoutRef.current = setTimeout(() => {
          if (tooltipTimeoutRef.current) {
            setTooltipVisible(false)
            clearTimeout(tooltipTimeoutRef.current)
            tooltipTimeoutRef.current = undefined
          }
        }, 500)

        menuTimeoutRef.current = setTimeout(() => {
          if (menuTimeoutRef.current) {
            setMenuVisible(false)
            clearTimeout(menuTimeoutRef.current)
            menuTimeoutRef.current = undefined
          }
        }, 500)
        */

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
  }, [isLoading, rendered.assetUrl, engine?.type])

  return (
    <div className="w-full pt-2" ref={drop}>
      <div
        ref={containerRef}
        className={[
          "relative border-2 border-gray-50 rounded-xl overflow-hidden min-h-[512px]",
          engine.type === "cartesian_video"
          || engine.type === "cartesian_image"
            ? "w-full" // w-[1024px] h-[512px]"
            : "w-full",
            
          isLoading
            ? "cursor-wait"
            : actionnable
            ? isHover
            ? "cursor-crosshair"
            : "cursor-crosshair"
            : ""
          ].join(" ")}>
        {engine.type === "cartesian_video"
          ? <CartesianVideo
              rendered={rendered}
              onEvent={handleMouseEvent}
              debug={debug}
            />
          : (engine.type === "spherical_image" || engine.type === "spherical_video")
          ? <SphericalImage
              rendered={rendered}
              onEvent={handleMouseEvent}
              debug={debug}
            />
          : <CartesianImage
              rendered={rendered}
              onEvent={handleMouseEvent}
              debug={debug}
            />
        }

      </div>

      <SceneTooltip
        isVisible={isTooltipVisible && !isLoading}
        x={tooltipX}
        y={tooltipY}>
        {actionnable}
      </SceneTooltip>

      {/*
      <SceneMenu
        actions={["Go here", "Interact"]}
        isVisible={isMenuVisible && !isLoading}
        x={menuX}
        y={menuY}
      />
      */}

      {isLoading
      ? <div className="fixed flex w-20 h-20 bottom-8 right-0 mr-8 z-50">
          <ProgressBar
            text="⌛"
            progressPercentage={progressPercent}
          />
        </div>
      : null}
    </div>
  )
}