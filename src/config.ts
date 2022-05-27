import { HomeScene } from "./scenes/HomeScene"
import { LevelScene } from "./scenes/LevelScene"
import { RoundScene } from "./scenes/RoundScene"

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  parent: 'game',
  dom: {
    createContainer: true
  },
  scene: [
    HomeScene,
    LevelScene,
    RoundScene,
  ]
}