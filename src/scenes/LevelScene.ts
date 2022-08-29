import { RoundMode } from "../const/RoundMode";
import { QuizImpl } from "../databridge/QuizImpl";
import { LevelType } from "../dto/LevelInfo";
import { Quiz } from "../dto/Quiz";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class LevelScene extends BaseLogPanelScene {
  private quizImpl: QuizImpl;
  
  constructor() {
    super('LevelScene');
    this.quizImpl = new QuizImpl();
  }

  override create(data: any): void {
    super.create();

    var practiceTxt = this.make.text({
      x: 10,
      y: 500,
      text: 'Practice',
      style: { font: 'bold 20px Arial', color: '#00ff00' }
    });
    practiceTxt.on('pointerdown', () => {
      this.showLog('[Practice]')
      this.scene.start('FarmScene', { mode: RoundMode.PRACTICE })
    });

    var challengeTxt = this.make.text({
      x: 110,
      y: 500,
      text: 'Challenge',
      style: { font: 'bold 20px Arial', color: '#00ff00' }
    });
    challengeTxt.on('pointerdown', () => {
      this.showLog('[Challenge]')
      this.scene.start('RoundScene', { mode: RoundMode.CHALLENGE })
    });

    this.quizImpl.getList(LevelType.DEPOSIT)
        .then((quizzes: Quiz[]) => {
            this.showLog('[GetQuiz] ' + JSON.stringify(quizzes));
            challengeTxt.setInteractive()
            practiceTxt.setInteractive();
        })
        .catch((err: any) => {
            this.showLog('[GetQuiz] ' + JSON.stringify(err));
        }
    );
  }
}