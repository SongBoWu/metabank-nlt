import { LevelType, RoundMode } from "../const/LevelType";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class LevelScene extends BaseLogPanelScene {
  constructor() {
    super('LevelScene');
  }

  override create(): void {
    super.create();

    var practiceTxt = this.make.text({
      x: 10,
      y: 500,
      text: 'Practice',
      style: { font: 'bold 20px Arial', color: '#00ff00' }
    });
    practiceTxt.setInteractive();
    practiceTxt.on('pointerdown', () => {
      this.showLog('[Practice]')
      this.scene.start('RoundScene', { mode: RoundMode.PRACTICE })
    });

    var challengeTxt = this.make.text({
      x: 110,
      y: 500,
      text: 'Challenge',
      style: { font: 'bold 20px Arial', color: '#00ff00' }
    });
    challengeTxt.setInteractive();
    challengeTxt.on('pointerdown', () => {
      this.showLog('[Challenge]')
      this.scene.start('RoundScene', { mode: RoundMode.CHALLENGE })
    });
  }
}