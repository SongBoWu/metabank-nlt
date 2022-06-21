import { BaseLogPanelScene } from "./BaseLogPanelScene";
import { FirebaseAuthUtil } from "../databridge/FirebaseAuthUtil";
import { FirestoreUserInfoUtil } from "../databridge/FirestoreUserInfoUtil";

export class HomeScene extends BaseLogPanelScene {
  private firebaseAuth : FirebaseAuthUtil;
  private firestoreUserinfo: FirestoreUserInfoUtil;

  constructor() {
    super('HomeScene');

    this.firebaseAuth = new FirebaseAuthUtil();
    this.firebaseAuth.onAuthChanged();

    this.firestoreUserinfo = new FirestoreUserInfoUtil();
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

    var addDocTxt = this.make.text({
      x: 10, 
      y: 550, 
      text: 'AddUserInfo', 
      style: { font: 'bold 30px Arial', color: '#00ff00' }
    });
    addDocTxt.setInteractive();
    addDocTxt.on('pointerdown', ()=>{
      this.firestoreUserinfo.add('testid_123');
      this.showLog('[Add]');
    });
  
    var getDocTxt = this.make.text({
      x: 300, 
      y: 550, 
      text: 'getUserInfo', 
      style: { font: 'bold 30px Arial', color: '#00ff00' }
    });
    getDocTxt.setInteractive();
    getDocTxt.on('pointerdown', ()=>{
      this.firestoreUserinfo.get('testid_123');
      this.showLog('[GetDoc]');
      this.scene.start('LevelScene');
    });
  }

}