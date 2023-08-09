export function Help({
  clickables,
  isLoading,
}: {
  clickables: string[]
  isLoading: boolean
}) {
  return (
    <div className="flex flex-row">
      <div className="text-xl mr-2">
        {isLoading
          ? <span>⌛ Generating areas for clicks and drag & drop, please wait..</span>
          : <span>💡 Try to click on:</span>
        }
      </div>
      {clickables.map((clickable, i) => 
      <div key={i} className="flex flex-row text-xl mr-2">
        <div className="">{clickable}</div>
        {i < (clickables.length - 1) ? <div>,</div> : null}
      </div>)}
    </div>
  )
}