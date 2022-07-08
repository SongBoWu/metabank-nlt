import { BaseLogPanelScene } from "./BaseLogPanelScene";
import { AuthImpl } from "../databridge/AuthImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { UserData } from "../dto/UserData";
import { QuizImpl } from "../databridge/QuizImpl";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { Quiz } from "../dto/Quiz";
import { Level, LevelBuilder, LevelType } from "../dto/LevelInfo";

export class HomeScene extends BaseLogPanelScene {
  private firebaseAuth : AuthImpl;
  private firestoreUserinfo: UserInfoImpl;
  private quizImpl: QuizImpl;
  private levelInfoImpl: LevelInfoImpl;

  constructor() {
    super('HomeScene');

    this.firebaseAuth = new AuthImpl();
    this.firebaseAuth.onAuthChanged();

    this.firestoreUserinfo = new UserInfoImpl();
    this.quizImpl = new QuizImpl();
    this.levelInfoImpl = new LevelInfoImpl();
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
          this.firebaseAuth.signIn(userNameValue, passwordValue);
        }
      } else if (event.target.name === 'registerButton') {
        this.scene.start('SignUpScene');
      }
      
    });

    var signOutTxt = this.make.text({
      x: 150, 
      y: 500, 
      text: 'SignOut', 
      style: { font: 'bold 30px Arial', color: '#00ff00' }
    });
    signOutTxt.setInteractive();
    signOutTxt.on('pointerdown', ()=>{
      this.firebaseAuth.signOut();
      this.showLog('[SignOut]')
    });

    var currentUserTxt = this.make.text({
      x: 400, 
      y: 500, 
      text: 'GetUser', 
      style: { font: 'bold 30px Arial', color: '#00ff00' }
    });
    currentUserTxt.setInteractive();
    currentUserTxt.on('pointerdown', ()=>{
      console.log('current user: ', this.firebaseAuth.getUser());
      var user = this.firebaseAuth.getUser().uid;
      this.showLog('current user: ' + user)
    });
    
    // -------------------------------------
  
    var getDocTxt = this.make.text({
      x: 0, 
      y: 550, 
      text: 'getUserInfo', 
      style: { font: 'bold 30px Arial', color: '#00ff00' }
    });
    getDocTxt.setInteractive();
    getDocTxt.on('pointerdown', () => {
        this.firestoreUserinfo.get('testid_123')
            .then((userData: UserData) => {
                this.showLog('[GetDoc] ' + JSON.stringify(userData));
                return this.firestoreUserinfo.get('456');
            })
            .catch((err: any) => {

        });
    });

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
        this.quizImpl.getList(LevelType.DEPOSIT, ['0001', '0002', '0010'])
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
            .uid('test_qq')
            .type(LevelType.FOREX)
            .build();
        this.levelInfoImpl.add(newLevel)
            .then(level => {
                this.showLog('[addLevel] ' + JSON.stringify(level))
            })
            .catch(err => {
                this.showLog('[addLevel] ' + err)
            });
    });
  }

    onSignInSuccess(): void {
        this.showLog('[onSignInSuccess]');
    }

    onSignInFailed(): void {
      this.showLog('[onSignInFailed]');
    }

}