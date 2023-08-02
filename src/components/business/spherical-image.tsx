import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer"

import { SceneEventHandler } from "./types"
import { RenderedScene } from "@/app/types"

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

  if (!rendered.assetUrl) {
    return null
  }

  return (
    <ReactPhotoSphereViewer
      src={rendered.assetUrl}
      // ref={ref}
      container=""
      containerClass={className}
      // 
      height="100vh"
      width="100%"

      defaultZoomLvl={1}

      overlay={rendered.maskUrl || undefined}
      overlayOpacity={debug ? 0.5 : 0}

      panoData={{
        fullWidth: 1300,
        fullHeight: 700,
        croppedWidth: 1024,
        croppedHeight: 512,
        croppedX: 0,
        croppedY: 120,
        // poseHeading: 0, // 0 to 360
         posePitch: 0, // -90 to 90
        // poseRoll: 0, // -180 to 180
      }}

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