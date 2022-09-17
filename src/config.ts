import { FarmScene } from "./scenes/FarmScene"
import { GratzScene } from "./scenes/GratzScene"
import { HomeScene } from "./scenes/HomeScene"
import { LandingScene } from "./scenes/LandingScene"
import { LevelScene } from "./scenes/LevelScene"
import { RoundScene } from "./scenes/RoundScene"
import { SignUpScene } from "./scenes/SignUpScene"
import { WelcomeScene } from "./scenes/WelcomeScene"

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
    LandingScene,
    SignUpScene,
    WelcomeScene,
    LevelScene,
    RoundScene,
    FarmScene,
    GratzScene,
  ]
}