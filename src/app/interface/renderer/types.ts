export type MouseEventType = "hover" | "click"

export type MouseEventHandler = (type: MouseEventType, x: number, y: number) => Promise<void>