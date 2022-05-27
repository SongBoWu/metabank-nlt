import { FirebaseAuthUtil } from "../databridge/FirebaseAuthUtil";
import { FirestoreUserInfoUtil } from "../databridge/FirestoreUserInfoUtil";

export class HomeScene extends Phaser.Scene {
  private firebaseAuth : FirebaseAuthUtil;
  private firestoreUserinfo: FirestoreUserInfoUtil;
  private logElement : Element;
  private logSnippet : string = '';

  constructor() {
    super({
      key: 'HomeScene'
    })
    this.firebaseAuth = new FirebaseAuthUtil();
    this.firebaseAuth.onAuthChanged();

    this.firestoreUserinfo = new FirestoreUserInfoUtil();
  }

  preload(): void {
      // this.load.setBaseURL('https://labs.phaser.io');

      // this.load.image('sky', 'assets/skies/space3.png');
      // this.load.image('logo', 'assets/sprites/phaser3-logo.png');
      this.load.image('red', 'assets/blue-flare.png');

      this.load.html('log', 'assets/log-text-area.html');
  }

  create(): void {
    var domElement = this.add.dom(400, 250).createFromCache('log');
    this.logElement = domElement.getChildByName('logPreview');
    // this.add.image(400, 300, 'sky');

    // var particles = this.add.particles('red');

    // var emitter = particles.createEmitter({
    //     speed: 100,
    //     scale: { start: 1, end: 0 },
    //     blendMode: 'ADD'
    // });

    // var logo = this.physics.add.image(400, 100, 'logo');

    // logo.setVelocity(100, 200);
    // logo.setBounce(1, 1);
    // logo.setCollideWorldBounds(true);
    // logo.setInteractive();

    // emitter.startFollow(logo);

    var signInTxt = this.make.text({
      x: 10,
      y: 500,
      text: 'SignIn',
      style: { font: 'bold 30px Arial', color: '#00ff00' }
    });
    signInTxt.setInteractive();
    signInTxt.on('pointerdown', () => {
      this.firebaseAuth.signIn('hv46328@gmail.com', '123456');
      this.updateLogPanel('[SignIn]')
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
      this.updateLogPanel('[SignOut]')
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
      this.updateLogPanel('current user: ' + user)
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
      this.updateLogPanel('[Add]')
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
      this.updateLogPanel('[GetDoc]')
      this.scene.start('LevelScene');
    });
  }


  private updateLogPanel(snippet: string) : void {
    this.logSnippet = '[' + new Date().toLocaleString() + '] ' + snippet + '\n' + this.logSnippet;
    this.logElement.textContent = this.logSnippet;
  }

}