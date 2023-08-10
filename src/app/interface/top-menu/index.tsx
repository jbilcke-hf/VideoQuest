"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { Game, GameType } from "@/app/games/types"
import { games } from "@/app/games"
import { Engine, EngineType, engines } from "@/app/engine/engines"
import { cn } from "@/lib/utils"

export function TopMenu({
  engine,
  defaultGame,
  game,
  onChangeEngine,
  onChangeGame,
  onToggleDebug,
  debug,
}: {
  engine: Engine,
  defaultGame: string
  game: Game
  onChangeEngine: (newEngine: EngineType) => void
  onChangeGame: (newGameType: GameType) => void
  onToggleDebug: (isToggledOn: boolean) => void
  debug: boolean
}) {
  return (
    <div className={cn(
      `z-10 fixed top-0 left-0 right-0`,
      `flex flex-row w-full justify-between items-center`,
      `backdrop-blur-xl`,
      `px-2 py-2 border-b-1 border-gray-50 dark:border-gray-50`,
      `bg-stone-900/50 dark:bg-stone-900/50 text-gray-50 dark:text-gray-50`
    )}>
      <div className="flex flex-row items-center space-x-3 font-mono">
        <Label className="flex text-sm">Select a story:</Label>
        <Select
          defaultValue={defaultGame}
          onValueChange={(value) => { onChangeGame(value as GameType) }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue className="text-sm" placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(games).map(([key, game]) =>
              <SelectItem key={key} value={key}>{game.title}</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-row items-center space-x-3 font-mono">
        <Switch
            checked={debug}
            onCheckedChange={onToggleDebug}
            // we won't disable it, so we can occupy our using while loading
            // disabled={isLoading}
        />
        <Label>Debug</Label>
      </div>
      <div className="flex flex-row items-center space-x-3 font-mono">
        <Label className="flex text-sm">Rendering engine:</Label>
        <Select
          defaultValue={game.engines.includes(engine.type) ? engine.type : game.engines[0]}
          onValueChange={(value) => { onChangeEngine(value as EngineType) }}>
          <SelectTrigger className="w-[300px]">
            <SelectValue className="text-sm" placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(engines)
              .filter(([_, engine]) => engine.visible)
              .map(([key, engine]) =>
              <SelectItem
                key={key}
                value={key}
                disabled={
                  !engine.enabled || !game.engines.includes(engine.type)
                }>{
                  engine.label
                } ({
                  engine.modelName
                })</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}