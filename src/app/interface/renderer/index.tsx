import { useEffect, useRef, useState } from "react"
import { useDrop } from "react-dnd"

import { DropZoneTarget, ImageSegment, RenderedScene, SceneEvent } from "@/types"
import { useImageDimension } from "@/lib/useImageDimension"
import { formatActionnableName } from "@/lib/formatActionnableName"
import { Game } from "@/app/games/types"
import { Engine } from "@/app/engine/engines"

import { CartesianImage } from "./cartesian-image"
import { MouseEventHandler, MouseEventType } from "./types"
import { CartesianVideo } from "./cartesian-video"
import { SphericalImage } from "./spherical-image"

import { SceneTooltip } from "./scene-tooltip"
import { SceneMenu } from "./scene-menu"
import { cn } from "@/lib/utils"

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

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [actionnable, setActionnable] = useState<string>("")
  const actionnableRef = useRef<string>("")

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
    const outOfBounds = relativeX < 0 || relativeX > 1 || relativeY < 0 || relativeY > 1

    const mustAbort =
     noMenu
     || noContext
     || noSegmentationMask
     || noSegmentsToClickOn
     || isLoading
     || outOfBounds

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
  }

  const isFullScreen = true
  return (
    <div className="" ref={drop}>
      <div
        ref={containerRef}
        className={cn(
          "border-0 overflow-hidden",
          `fixed top-0 left-0 right-0 w-screen`,
            
          isLoading
            ? "cursor-wait"
            : actionnable
            ? isHover
            ? "cursor-crosshair"
            : "cursor-crosshair"
            : ""
          )}>
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

        {/*
        engine.type === "cartesian_image" || engine.type === "cartesian_video"
        ? <SceneTooltip
          isVisible={isTooltipVisible && !isLoading}
          x={tooltipX}
          y={tooltipY}>
          {actionnable}
        </SceneTooltip> : null
        */
        }
      </div>

      {/*
      engine.type === "cartesian_image" || engine.type === "cartesian_video"
       ? 
      <SceneMenu
        actions={["Go here", "Interact"]}
        isVisible={isMenuVisible && !isLoading}
        x={menuX}
        y={menuY}
      /> : null
      */}

    </div>
  )
}