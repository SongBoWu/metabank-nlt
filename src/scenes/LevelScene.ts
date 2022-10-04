import { RoundMode } from "../const/RoundMode";
import { QuizImpl } from "../databridge/QuizImpl";
import { LogicController } from "../domain/LogicController";
import { LevelStatus, LevelType } from "../dto/LevelInfo";
import { Quiz } from "../dto/Quiz";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class LevelScene extends BaseLogPanelScene {
  private quizImpl: QuizImpl;
  // private needToLearn: Boolean;
  
  constructor() {
    super('LevelScene');
    this.quizImpl = new QuizImpl();
  }

  override create(data: any): void {
    super.create();
    this.showLog('[onCreate] ' + JSON.stringify(data));

    var practiceTxt = this.make.text({
      x: 10,
      y: 500,
      text: 'Practice',
      style: { font: 'bold 20px Arial', color: '#00ff00' }
    });
    practiceTxt.setInteractive();
    practiceTxt.on('pointerdown', () => {
      if (LogicController.getInstance().isNecessaryToLearn()) {
        this.showLog('[Practice]')
        this.scene.start('FarmScene', { mode: RoundMode.PRACTICE })
      }
    });

    var challengeTxt = this.make.text({
      x: 110,
      y: 500,
      text: 'Challenge',
      style: { font: 'bold 20px Arial', color: '#00ff00', backgroundColor: '#ffffff' }
    });
    challengeTxt.setInteractive();
    challengeTxt.on('pointerdown', () => {
      if (!LogicController.getInstance().isNecessaryToLearn()) {
        this.showLog('[Challenge]')
        this.scene.start('RoundScene')
      }
    });

    var top10Txt = this.make.text({
      x: 300,
      y: 500,
      text: 'Top10',
      style: { font: 'bold 20px Arial', color: '#00ff00', backgroundColor: '#ffffff' }
    });
    top10Txt.setInteractive();
    top10Txt.on('pointerdown', () => {
        this.scene.start('LeaderboardScene', {
          from: 'LevelScene',
        })
    });

    var curLevel = LogicController.getInstance().getCurrentLevel();

    // ==== fetch quiz ====
    if (data.from == 'WelcomeScene') {
      this.showLog('You are in Level: ' + curLevel.type);
      curLevel.status = LevelStatus.STARTED;
      LogicController.getInstance().setNecessaryToLearn(true);
      practiceTxt.disableInteractive();
      challengeTxt.disableInteractive();

      this.quizImpl.getList(curLevel.type)
          .then((quizzes: Quiz[]) => {
              LogicController.getInstance().setQuizzes(quizzes);
              // this.showLog('[GetQuiz] ' + JSON.stringify(quizzes));
              practiceTxt.setInteractive();
              challengeTxt.setInteractive()
          })
          .catch((err: any) => {
              this.showLog('[GetQuiz] ' + JSON.stringify(err));
          }
      );
    } else if (data.from == 'FarmScene') {
        LogicController.getInstance().setNecessaryToLearn(false);
        LogicController.getInstance().increaseTimesOfPrac();
        
        // TODO, server api 

    } else if (data.from == 'RoundScene') {
        LogicController.getInstance().setNecessaryToLearn(true);
        
    }

    this.showLog(JSON.stringify(curLevel));
  }
}