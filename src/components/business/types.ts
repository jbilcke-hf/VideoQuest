export type SceneEventType = 'hover' | 'click' | 'back'

export type SceneEventHandler = (type: SceneEventType, x: number, y: number) => Promise<void>