import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer"

import { SceneEventHandler } from "./types"
import { RenderedScene } from "@/app/types"
import { useEffect, useRef, useState } from "react"

export function SphericalImage({
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
  const sceneConfig = JSON.stringify({ rendered, debug })
  const [lastSceneConfig, setLastSceneConfig] = useState<string>(sceneConfig)
  const ref = useRef<{
    needsUpdate: () => void
    setPanorama: (src: string, options: Record<string, any>) => Promise<void>
    setOptions: (options: Record<string, any>) => void
  }>(null)

  const options = {
    defaultZoomLvl: 1,
    overlay: rendered.maskUrl || undefined,
    overlayOpacity: debug ? 0.5 : 0,
    /*
    panoData: {
      fullWidth: 2000,
      fullHeight: 1200,
      croppedWidth: 1024,
      croppedHeight: 512,
      croppedX: 0,
      croppedY: 200,
      // poseHeading: 0, // 0 to 360
      posePitch: 0, // -90 to 90
      // poseRoll: 0, // -180 to 180
    }
    */
  }

  useEffect(() => {
    const task = async () => {
      // console.log("SphericalImage: useEffect")
      if (sceneConfig !== lastSceneConfig) {
        // console.log("SphericalImage: scene config changed!")
    
        if (!ref.current) {
          // console.log("SphericalImage: no ref!")
          setLastSceneConfig(sceneConfig)
          return
        }

        // console.log("SphericalImage: calling setOptions")
        // console.log("SphericalImage: changing the panorama to: " + rendered.assetUrl.slice(0, 120))
      
        await ref.current.setPanorama(rendered.assetUrl, {
          ...options,
          showLoader: false,
        })
        ref.current.setOptions(options)
        // console.log("SphericalImage: asking to re-render")
        ref.current.needsUpdate()

        setLastSceneConfig(sceneConfig)
      }
    }
    task()
  }, [sceneConfig, rendered.assetUrl, ref.current])

  if (!rendered.assetUrl) {
    return null
  }

  return (
    <ReactPhotoSphereViewer
      src={rendered.assetUrl}
      ref={ref}
      container=""
      containerClass={className}
      // 
      height="100vh"
      width="100%"

      {...options}
   
      onClick={(data, instance) => {
        console.log("on click:")
        const position = data.target.getPosition()
        console.log("position:", position)
      }}

      onReady={(instance) => {
        console.log("spherical image display is ready")
        /*
        const markersPlugs = instance.getPlugin(MarkersPlugin);
        if (!markersPlugs)
          return;
        markersPlugs.addMarker({
          id: "imageLayer2",
          imageLayer: "drone.png",
          size: { width: 220, height: 220 },
          position: { yaw: '130.5deg', pitch: '-0.1deg' },
          tooltip: "Image embedded in the scene"
        });
        markersPlugs.addEventListener("select-marker", () => {
          console.log("asd");
        });
        */
      }}

    />
  )
}