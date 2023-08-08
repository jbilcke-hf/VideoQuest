export function SceneMenu({
  actions,
  isVisible,
  x,
  y,
}: {
  actions: string[]
  isVisible: boolean
  x: number
  y: number
}) {
  return (
    <div className={[
      `z-20 fixed flex flex-col w-24 pt-8 px-2 pb-2`,
      `translate-x-[-50%] translate-y-[-20px]`,
      isVisible ? "" : "",
      isVisible ? "" : "pointer-events-none"
    ].join(" ")}
    style={{
      top: `${y}px`,
      left: `${x}px`,
    }}
    >
    {actions.map((action, i) =>
      <div
      key={action}
      className={[
        `flex items-center justify-center px-2 py-1 cursor-pointer`
      ].join(" ")}>
        <div
          className={[
            `transition-all duration-150`,
            isVisible ? "opacity-100 scale-100" : "scale-0 opacity-0 pointer-events-none",
            `flex items-center justify-center rounded-full h-8 px-4`,
            `hover:bg-gray-50 bg-gray-100 hover:border-gray-800 border-gray-300 border`,
            `rounded-2xl text-gray-800 text-md`,
          ].join(" ")}>
          {action}
        </div>
    </div>)}
    </div>
  )
}