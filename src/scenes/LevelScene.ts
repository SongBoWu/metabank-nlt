import { GameObjects } from "phaser";
import { GroupType } from "../const/GroupType";
import { RoundMode } from "../const/RoundMode";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { LibraryImpl } from "../databridge/LibraryImpl";
import { QuizImpl } from "../databridge/QuizImpl";
import { LogicController } from "../domain/LogicController";
import { BannerConf } from "../dto/BannerConf";
import { LevelStatus, LevelType } from "../dto/LevelInfo";
import { Library } from "../dto/Library";
import { Quiz } from "../dto/Quiz";
import eventsCenter from "../plugins/EventsCenter";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class LevelScene extends BaseLogPanelScene {

  // DB impl
  private quizImpl: QuizImpl;
  private libImpl: LibraryImpl;
  private levelApi: LevelInfoImpl;

  // UI components
  private btns: GameObjects.Image[] = [];
  private btnHovers: GameObjects.Image[] = [];
  private btnTxts: GameObjects.Text[] = [];
  
  constructor() {
    super('LevelScene');
    this.quizImpl = new QuizImpl();
    this.libImpl = new LibraryImpl();
    this.levelApi = new LevelInfoImpl();
  }

  override preload(): void {
      super.preload();
      this.load.image('level_title_icon', 'assets/level_title4.png');
      this.load.image('level_button_icon', 'assets/level_btn.png'); // #fcfac0
      this.load.image('level_button_hover_icon', 'assets/level_btn_hover.png'); // #ada20c
  }

  override create(data: any): void {
    super.create();
    this.showLog('[LevelScene][onCreate] ' + JSON.stringify(data));
    this.showBanner();

    var practiceBtn = this.add.image(400, 650, 'level_button_icon');
    var practiceBtnHover = this.add.image(400, 650, 'level_button_hover_icon');
    var practiceTxt = this.make.text({x: 360, y: 635, text: '學習區', style: { font: '28px Arial', color: '#ada20c' }});
    practiceBtn.setInteractive();
    practiceBtn.setScale(1.2, 1);
    practiceBtnHover.setVisible(false);
    practiceBtnHover.setScale(1.2, 1);
    practiceBtn.on('pointerdown', () => {
      if (LogicController.getInstance().isNecessaryToLearn()) {
        this.scene.start('FarmScene', { mode: RoundMode.PRACTICE })
      }
    });
    practiceBtn.on('pointerover', () => { 
      if (LogicController.getInstance().isNecessaryToLearn()) {
        practiceBtnHover.setVisible(true);
        practiceTxt.setColor('#fcfac0');
      } 
    });
    practiceBtn.on('pointerout', () => { 
      practiceBtnHover.setVisible(false); 
      practiceTxt.setColor('#ada20c');
    });


    var challengeBtn = this.add.image(600, 650, 'level_button_icon');
    var challengeBtnHover = this.add.image(600, 650, 'level_button_hover_icon');
    var challengeTxt = this.make.text({x: 560, y: 635, text: '挑戰區', style: { font: '28px Arial', color: '#ada20c' }});
    challengeBtn.setInteractive();
    challengeBtn.setScale(1.2, 1);
    challengeBtnHover.setVisible(false);
    challengeBtnHover.setScale(1.2, 1);
    challengeBtn.on('pointerdown', () => {
      if (!LogicController.getInstance().isNecessaryToLearn()) {
        this.scene.start('RoundScene')
      }
    });
    challengeBtn.on('pointerover', () => { 
      if (!LogicController.getInstance().isNecessaryToLearn()) {
        challengeBtnHover.setVisible(true);
        challengeTxt.setColor('#fcfac0');
      }
    })
    challengeBtn.on('pointerout', () => { 
      challengeBtnHover.setVisible(false);
      challengeTxt.setColor('#ada20c');
    })


    var curLevel = LogicController.getInstance().getCurrentLevel();
    var curLevelProperty = LogicController.getInstance().getCurrentLevelProperty();
    var extraDesc = (LogicController.getInstance().getUser().group == GroupType.EXPERIMENTAL) ? '當您連續答對2題時會額外給予2題的獎勵機會。' : ''
    var chalHintTxt = this.make.text({
        x: 110,
        y: 200,
        text: ''
          // + 'You can learn all vocabularies in Practice Mode. Ether scans one \n'
          // + 'by one via next/previous button, or click the desired in the right side.\n\n'
          // + 'In Challenge Mode, you have to answer ' + curLevelProperty.amountOfQuiz + " questions in " + curLevelProperty.maxRemains + ' chances. \n'
          // + 'When you get right answer, you will earn ' + curLevelProperty.pointAward + ' points.\n'
          // + 'Otherwise, you will lose ' + (-1 * curLevelProperty.pointPenalty) + ' points.\n\n'
          // + 'Everytime, It\'s only be allowed to start Challenge Mode when Practice\n'
          // + 'Mode was finished.'
          + '您可以在練習模式下學習所有詞彙。可以透過下一個/上一個的按鈕逐\n'
          + '個學習，或單擊右側所需額外學習的詞彙。每次皆須完成練習模式才允\n'
          + '許啟動挑戰模式。\n\n'
          + '在此關任務中，共有' + curLevelProperty.amountOfQuiz + '題題目。答對時獲得' + curLevelProperty.pointAward + '分，答錯時失去' + (-1 * curLevelProperty.pointPenalty) + '分。\n'
          + extraDesc,
        style: { font: 'bold 25px Arial', color: '#000000' } 
    });

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
              return this.libImpl.getList(curLevel.type);
          })
          .then((library: Library[]) => {
              this.scene.stop('LoadingScene');
              console.log('get ' + library.length + ' words');
              practiceBtn.setInteractive();
              challengeBtn.setInteractive();
              LogicController.getInstance().setLibrary(library);
          })
          .catch((err: any) => {
              this.showLog('[GetQuiz] ' + JSON.stringify(err));
              this.scene.stop('LoadingScene');
          }
      );
    } else if (data.from == 'FarmScene') {
        LogicController.getInstance().setNecessaryToLearn(false);
        LogicController.getInstance().increaseTimesOfPrac();
        
        this.levelApi.update(LogicController.getInstance().getCurrentLevel());

    } else if (data.from == 'RoundScene') {
        LogicController.getInstance().setNecessaryToLearn(true);
        
    }

    this.showLog(JSON.stringify(curLevel));

    this.events.addListener('resume', this.resume.bind(this));
    this.events.addListener('pause', this.pause.bind(this));

    // clean up when Scene is shutdown
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.events.removeListener('resume');
      this.events.removeListener('pause');
    })
  }

  resume(): void {
      console.log('[LevelScene][resume]');
      this.showBanner();
  } 

  private pause(): void {
      console.log('[LevelScene][pause]');
  }

  private showBanner(): void {
    var conf = new BannerConf();
    conf.isBadge = true;
    conf.isPoint = true;
    conf.isHitoBoard = true;
    conf.isExit = true;
    conf.isInLevel = true;
    conf.curScene = 'LevelScene';
    eventsCenter.emit('onSettingUpdated', conf);
  }
}