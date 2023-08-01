import { ForwardedRef, forwardRef } from "react"
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer"

import { SceneEventHandler } from "./types"

export const SphericalImage = forwardRef(({
  src,
  onEvent,
  className,
}: {
  src: string
  onEvent: SceneEventHandler
  className?: string
}, ref: ForwardedRef<HTMLImageElement>) => {


  return (
    <ReactPhotoSphereViewer
      src={src}
      // ref={ref}
      container=""
      containerClass={className}
      // 
      height="800px"
     //  height={'100vh'}
      width="100%"

      defaultZoomLvl={1}

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
})

SphericalImage.displayName = "SphericalImage"