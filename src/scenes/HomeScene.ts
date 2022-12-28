import { BaseLogPanelScene } from "./BaseLogPanelScene";
import { AuthImpl } from "../databridge/AuthImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { UserData } from "../dto/UserData";
import { QuizImpl } from "../databridge/QuizImpl";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { OptionID, Quiz } from "../dto/Quiz";
import { Level, LevelBuilder, LevelType } from "../dto/LevelInfo";
import { RoundSummaryImpl } from "../databridge/RoundSummaryImpl";
import { RoundSummaryBuilder } from "../dto/RoundSummary";
import { TitleType } from "../const/TitleType";
import { DatabaseCore } from "../databridge/DatabaseCore";

export class HomeScene extends BaseLogPanelScene {
  // private firebaseAuth : AuthImpl;
  private firestoreUserinfo: UserInfoImpl;
  private quizImpl: QuizImpl;
  private levelInfoImpl: LevelInfoImpl;
  private rsImpl: RoundSummaryImpl;

  constructor() {
    super('HomeScene');

    // this.firebaseAuth = new AuthImpl();
    this.firestoreUserinfo = new UserInfoImpl();
    this.quizImpl = new QuizImpl();
    this.levelInfoImpl = new LevelInfoImpl();
    this.rsImpl = new RoundSummaryImpl();
    
  }

  override preload(): void {
      super.preload();

      this.load.html('logintable', 'assets/loginform.html');
  }

  override create(): void {
    super.create();

    var loginformElement = this.add.dom(400, 300).createFromCache('logintable');
    loginformElement.addListener('click');
    loginformElement.on('click', (event : any) => {
      
      if (event.target.name === 'loginButton') {
        var userNameElement = loginformElement.getChildByID('username');
        var passwordElement = loginformElement.getChildByID('password');

        var userNameValue = (<HTMLInputElement>userNameElement).value;
        var passwordValue = (<HTMLInputElement>passwordElement).value;
        
        if (userNameValue !== '' && passwordValue !== '') {
          this.showLog('[SignIn]')
          DatabaseCore.getInstance().getAuthImpl().signIn(userNameValue, passwordValue);
        }
      } else if (event.target.name === 'registerButton') {
        this.scene.start('SignUpScene');
      }
      
    });

    

    // var currentUserTxt = this.make.text({
    //   x: 400, 
    //   y: 500, 
    //   text: 'GetUser', 
    //   style: { font: 'bold 30px Arial', color: '#00ff00' }
    // });
    // currentUserTxt.setInteractive();
    // currentUserTxt.on('pointerdown', ()=>{
    //   console.log('current user: ', this.firebaseAuth.getUser());
    //   var user = this.firebaseAuth.getUser().uid;
    //   this.showLog('current user: ' + user)
    // });
    
    // -------------------------------------
  
    // var getDocTxt = this.make.text({
    //   x: 0, 
    //   y: 550, 
    //   text: 'getUserInfo', 
    //   style: { font: 'bold 30px Arial', color: '#00ff00' }
    // });
    // getDocTxt.setInteractive();
    // getDocTxt.on('pointerdown', () => {
    //     this.firestoreUserinfo.update('testid_123', 100, TitleType.T2)
    //         .then(() => {
    //             this.showLog('[UserInfo][Update] ');
    //         })
    //         .catch((err: any) => {

    //     });
    // });

    var getQuizTxt = this.make.text({
      x: 200, 
      y: 550, 
      text: 'getQuiz', 
      style: { font: 'bold 30px Arial', color: '#00ff00' }
    });
    getQuizTxt.setInteractive();
    getQuizTxt.on('pointerdown', () => {
        // this.quizImpl.get('depo_0001')
        //     .then((quiz: Quiz) => {
        //         this.showLog('[GetQuiz] ' + JSON.stringify(quiz));
        //     })
        //     .catch((err: any) => {

        //     });
        this.quizImpl.getList(LevelType.DEPOSIT, false, ['0001', '0002', '0010'])
        .then((quizzes: Quiz[]) => {
            this.showLog('[GetQuiz] ' + JSON.stringify(quizzes));
        })
        .catch((err: any) => {

        });
    });

    var getLevelTxt = this.make.text({
      x: 350, 
      y: 550, 
      text: 'getLevel', 
      style: { font: 'bold 30px Arial', color: '#00ff00' }
    });
    getLevelTxt.setInteractive();
    getLevelTxt.on('pointerdown', () => {
        // this.levelInfoImpl.getLevel('test123', LevelType.DEPOSIT)
        //     .then((level: Level) => {
        //         this.showLog('[getLevel] ' + JSON.stringify(level));
        //     })
        //     .catch((err: any) => {
        //         this.showLog('[getLevel] ' + err);
        // });
        // this.levelInfoImpl.getLevels('test123')
        //     .then((levels: Level[]) => {
        //         this.showLog('[getLevels] ' + JSON.stringify(levels));
        //     })
        //     .catch((err: any) => {
        //         this.showLog('[getLevels] ' + err);
        // });
        var newLevel = new LevelBuilder()
            .uid('test1111')
            .type(LevelType.FOREX)
            .build();
        this.levelInfoImpl.add(newLevel.uid, "test")
            .then(level => {
                this.showLog('[addLevel] ')
                newLevel.points = 123;
                return this.levelInfoImpl.update(newLevel);
            })
            .then(() => {
              this.showLog('[addLevel] update')
            })
            .catch(err => {
                this.showLog('[addLevel] ' + err)
            });
    });

    var addRSTxt = this.make.text({
      x: 500, 
      y: 550, 
      text: 'addRoundSummary', 
      style: { font: 'bold 30px Arial', color: '#00ff00' }
    });
    addRSTxt.setInteractive();
    addRSTxt.on('pointerdown', () => {
        // this.levelInfoImpl.getLevel('test123', LevelType.DEPOSIT)
        //     .then((level: Level) => {
        //         this.showLog('[getLevel] ' + JSON.stringify(level));
        //     })
        //     .catch((err: any) => {
        //         this.showLog('[getLevel] ' + err);
        // });
        // this.levelInfoImpl.getLevels('test123')
        //     .then((levels: Level[]) => {
        //         this.showLog('[getLevels] ' + JSON.stringify(levels));
        //     })
        //     .catch((err: any) => {
        //         this.showLog('[getLevels] ' + err);
        // });
        // var newRS = new RoundSummaryBuilder()
        //     .uid('test_qq')
        //     .quiz({
        //         id: 'loan_0003',
        //         selection: OptionID.C,
        //         answer: 'test',
        //         isCorrect: false
        //     })
        //     .build();
        // this.rsImpl.add(newRS)
        //     .then(level => {
        //         this.showLog('[addLevel] ' + JSON.stringify(level))
        //     })
        //     .catch(err => {
        //         this.showLog('[addLevel] ' + err)
        //     });
    });

    
  }

    onSignInSuccess(): void {
        this.showLog('[onSignInSuccess]');
    }

    onSignInFailed(): void {
      this.showLog('[onSignInFailed]');
    }

}