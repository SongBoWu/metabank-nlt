import { User } from "firebase/auth";
import { AuthImpl } from "../databridge/AuthImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { UserData, UserDataBuilder } from "../dto/UserData";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class SignUpScene extends BaseLogPanelScene {
    private firebaseAuth : AuthImpl;
    private firestoreUserinfo: UserInfoImpl;

    private nickname : string;
    private score : number;

    constructor() {
        super('SignUpScene');

        this.firebaseAuth = new AuthImpl();
        this.firestoreUserinfo = new UserInfoImpl();
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
        var userData = new UserDataBuilder()
            .id(user.uid)
            .nickName(this.nickname)
            .groupByScore(this.score)
            .build();
        this.firestoreUserinfo.add(userData, this.onUserCreatedSuccess.bind(this), this.onUserCreatedFailed.bind(this));
    }

    onRegisterFailed(errorCode : number) : void {
        this.showLog('[onRegisterFailed] ' + errorCode);
    }

    onUserCreatedSuccess(user: UserData) : void {
        this.showLog('[onUserCreatedSuccess] ' + JSON.stringify(user));
        this.scene.start('LevelScene');
    }

    onUserCreatedFailed(): void {
        this.showLog('[onUserCreatedFailed] ');

    }
}