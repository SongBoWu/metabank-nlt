import { User } from "firebase/auth";
import { FirebaseAuthUtil } from "../databridge/FirebaseAuthUtil";
import { FirestoreUserInfoUtil } from "../databridge/FirestoreUserInfoUtil";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class SignUpScene extends BaseLogPanelScene {
    private firebaseAuth : FirebaseAuthUtil;
    private firestoreUserinfo: FirestoreUserInfoUtil;

    private nickname : string;
    private score : number;

    constructor() {
        super('SignUpScene');

        this.firebaseAuth = new FirebaseAuthUtil();
        this.firebaseAuth.onAuthChanged();

        this.firestoreUserinfo = new FirestoreUserInfoUtil();
    }

    override preload(): void {
        super.preload();
        this.load.html('registerInputform', 'assets/registerform.html');
    }

    override create(): void {
        super.create();

        var registerformElement = this.add.dom(400, 300).createFromCache('registerInputform');
        registerformElement.addListener('click');
        registerformElement.on('click', (event : any) => {
          
            if (event.target.name === 'registerButton') {
                var nickNameElement = registerformElement.getChildByID('nickname');
                var scoreElement = registerformElement.getChildByID('score');
                var accountElement = registerformElement.getChildByID('account');
                var passwordElement = registerformElement.getChildByID('password');
        
                var accountValue = (<HTMLInputElement>accountElement).value;
                var passwordValue = (<HTMLInputElement>passwordElement).value;
                var nickNameValue = (<HTMLInputElement>nickNameElement).value;
                var scoreValue = (<HTMLInputElement>scoreElement).value;
                
                if (nickNameValue !== '' && scoreValue !== '' && accountValue !== '' && passwordValue !== '') {
                    this.nickname = nickNameValue;
                    this.score = +scoreValue;
                    this.firebaseAuth.signUp(accountValue, passwordValue, this.onRegisterSuccess.bind(this), this.onRegisterFailed.bind(this));
                }
            } else if (event.target.name === 'backButton') {
                this.scene.start('HomeScene');
            }
        });
    }

    onRegisterSuccess(user : User) : void {
        this.showLog('[onRegisterSuccess]')
        this.firestoreUserinfo.add(user.uid, this.nickname, this.score)
    }

    onRegisterFailed(errorCode : number) : void {
        this.showLog('[onRegisterFailed] ' + errorCode)
    }
}