import { RoundMode } from "../const/RoundMode";
import { QuizImpl } from "../databridge/QuizImpl";
import { LogicController } from "../domain/LogicController";
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
    console.log(JSON.stringify(data));

    // var practiceTxt = this.make.text({
    //   x: 10,
    //   y: 500,
    //   text: 'Practice',
    //   style: { font: 'bold 20px Arial', color: '#00ff00' }
    // });
    // practiceTxt.on('pointerdown', () => {
    //   this.showLog('[Practice]')
    //   this.scene.start('FarmScene', { mode: RoundMode.PRACTICE })
    // });

    var challengeTxt = this.make.text({
      x: 110,
      y: 500,
      text: 'Challenge',
      style: { font: 'bold 20px Arial', color: '#00ff00', backgroundColor: '#ffffff' }
    });
    challengeTxt.on('pointerdown', () => {
      this.showLog('[Challenge]')
      this.scene.start('RoundScene')
    });

    // ==== fetch quiz ====
    if (data.from == 'WelcomeScene') {
      this.showLog('You ar in Level: ' + data.levelType);
      LogicController.getInstance().setCurrentLevel(data.levelType);
      this.quizImpl.getList(data.levelType)
          .then((quizzes: Quiz[]) => {
              LogicController.getInstance().setQuizzes(quizzes);
              // this.showLog('[GetQuiz] ' + JSON.stringify(quizzes));
              challengeTxt.setInteractive()
              // practiceTxt.setInteractive();
          })
          .catch((err: any) => {
              this.showLog('[GetQuiz] ' + JSON.stringify(err));
          }
      );
    } else {
        challengeTxt.setInteractive()
        // practiceTxt.setInteractive();
    }
    
  }
}