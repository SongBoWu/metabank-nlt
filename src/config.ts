import { FarmScene } from "./scenes/FarmScene"
import { GratzScene } from "./scenes/GratzScene"
import { HomeScene } from "./scenes/HomeScene"
import { LandingScene } from "./scenes/LandingScene"
import { LeaderboardScene } from "./scenes/LeaderboardScene"
import { LevelScene } from "./scenes/LevelScene"
import { RoundScene } from "./scenes/RoundScene"
import { SettingsScene } from "./scenes/SettingsScene"
import { SignUpScene } from "./scenes/SignUpScene"
import { LoadingScene} from "./scenes/LoadingScene"
import { WelcomeScene } from "./scenes/WelcomeScene"
import { EntranceExamScene } from "./scenes/EntranceExamScene"
import { PreparationScene } from "./scenes/PreparationScene"
import { VKSScene } from "./scenes/vksScene"

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
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
    LeaderboardScene,
    EntranceExamScene,
    PreparationScene,
    VKSScene,
    SettingsScene,
    LoadingScene,
  ]
}