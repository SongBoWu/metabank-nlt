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

  override preload(): void {
      super.preload();
      this.load.image('level_title_icon', 'assets/level_title4.png');
      this.load.image('challenge_btn', 'assets/che_btn.png');
      this.load.image('challenge_btn_hover', 'assets/che_btn_hover.png');
      this.load.image('practice_btn', 'assets/prac_btn.png');
      this.load.image('practice_btn_hover', 'assets/prac_btn_hover.png');
  }

  override create(data: any): void {
    super.create();
    this.showLog('[onCreate] ' + JSON.stringify(data));

    // var titleIcon = this.add.image(250, 200, 'level_title_icon');
    // titleIcon.setScale(1);


    var practiceBtn = this.add.image(400, 650, 'practice_btn');
    practiceBtn.setScale(1.2);
    var practiceBtnHover = this.add.image(400, 650, 'practice_btn_hover');
    practiceBtnHover.setScale(1.2);
    practiceBtnHover.setVisible(false);
    practiceBtn.setInteractive();
    practiceBtn.on('pointerdown', () => {
      if (LogicController.getInstance().isNecessaryToLearn()) {
        this.scene.start('FarmScene', { mode: RoundMode.PRACTICE })
      }
    });
    practiceBtn.on('pointerover', () => { 
      if (LogicController.getInstance().isNecessaryToLearn()) {
        practiceBtnHover.setVisible(true);
      } 
    })
    practiceBtn.on('pointerout', () => { practiceBtnHover.setVisible(false); })


    var challengeBtn = this.add.image(600, 650, 'challenge_btn');
    challengeBtn.setScale(1.2);
    var challengeBtnHover = this.add.image(600, 650, 'challenge_btn_hover');
    challengeBtnHover.setScale(1.2);
    challengeBtnHover.setVisible(false);
    challengeBtn.setInteractive();
    challengeBtn.on('pointerdown', () => {
      if (!LogicController.getInstance().isNecessaryToLearn()) {
        this.scene.start('RoundScene')
      }
    });
    challengeBtn.on('pointerover', () => { 
      if (!LogicController.getInstance().isNecessaryToLearn()) {
        challengeBtnHover.setVisible(true); 
      }
    })
    challengeBtn.on('pointerout', () => { challengeBtnHover.setVisible(false); })


    var curLevel = LogicController.getInstance().getCurrentLevel();

    // ==== fetch quiz ====
    if (data.from == 'WelcomeScene') {
      this.showLog('You are in Level: ' + curLevel.type);
      this.scene.launch('LoadingScene');
      curLevel.status = LevelStatus.STARTED;
      LogicController.getInstance().setNecessaryToLearn(true);
      
      practiceBtn.disableInteractive();
      challengeBtn.disableInteractive();

      this.quizImpl.getList(curLevel.type, false)
          .then((quizzes: Quiz[]) => {
              LogicController.getInstance().setQuizzes(quizzes);
              return this.quizImpl.getList(curLevel.type, true);
          })
          .then((quizzes: Quiz[]) => {
            LogicController.getInstance().setBonusQuizzes(quizzes);
            this.scene.stop('LoadingScene');
            practiceBtn.setInteractive();
            challengeBtn.setInteractive();
          })
          .catch((err: any) => {
              this.showLog('[GetQuiz] ' + JSON.stringify(err));
              this.scene.stop('LoadingScene');
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