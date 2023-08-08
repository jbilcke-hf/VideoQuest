import { ReactNode } from "react"

export function SceneTooltip({
  children,
  isVisible,
  x,
  y,
}: {
  children: ReactNode
  isVisible: boolean
  x: number
  y: number
}) {
  return (
    <div className={[
      `z-10 fixed flex flex-col space-y-2 w-24 h-16 px-2`,
      `translate-x-[-50%] translate-y-[-40px]`,
      isVisible ? "cursor-pointer" : "",
      "pointer-events-none"
    ].join(" ")}
    style={{
      top: `${y}px`,
      left: `${x}px`,
    }}
    >
      <div
        className={[
          `transition-all duration-150`,
          isVisible ? "opacity-100 scale-100" : "scale-0 opacity-0 pointer-events-none",
          `flex items-center justify-center rounded-full h-8 px-4`,
          `text-gray-50 text-xl`,
          `cursor-pointer capitalize`
        ].join(" ")}
        style={{
          textShadow: "#000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px"
        }}>
        {children}
      </div>
    </div>
  )
}