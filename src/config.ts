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
import { GuideScene } from "./scenes/GuideScene"
import { FootprintScene } from "./scenes/FootprintScene"
import { AnalysisScene } from "./scenes/AnalysisScene"
import { AnalysisBehaviorScene } from "./scenes/AnalysisBehaviorScene"

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
  scale: {
    parent: 'game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.NO_CENTER,
    width: 1024,
    height: 768
  },
  parent: 'game',
  dom: {
    createContainer: true
  },
  scene: [
    LandingScene,
    SignUpScene,
    WelcomeScene,
    GuideScene,
    LevelScene,
    RoundScene,
    FarmScene,
    GratzScene,
    LeaderboardScene,
    FootprintScene,
    EntranceExamScene,
    PreparationScene,
    VKSScene,
    SettingsScene,
    LoadingScene,
    AnalysisScene,
    AnalysisBehaviorScene,
  ]
}