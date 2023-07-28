"use client"

export const VideoRenderer = ({ url }: { url?: string }) => {

  if (!url) {
    return <div className="flex w-full pt-8 items-center justify-center text-center">
      <div>Rendering first frames.. (might take around 30s)</div>
    </div>
  }

  return (
    <div className="w-full py-8 px-2">
       <video
          src={url}
          muted
          autoPlay
          loop
          className="w-full rounded-md overflow-hidden"
        />
    </div>
  )
}