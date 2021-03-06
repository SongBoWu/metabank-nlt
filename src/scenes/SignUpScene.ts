import { User } from "firebase/auth";
import { DatabaseCore } from "../databridge/DatabaseCore";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { UserData, UserDataBuilder } from "../dto/UserData";

export class SignUpScene extends Phaser.Scene {
    private firestoreUserinfo: UserInfoImpl;

    private nickname : string;
    private score : number;

    constructor() {
        super('SignUpScene');
        this.firestoreUserinfo = new UserInfoImpl();
    }

    preload(): void {
        this.load.html('registerInputform', 'assets/registerform.html');
    }

    create(): void {
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
                    DatabaseCore.getInstance().getAuthImpl().signUp(accountValue, passwordValue, this.onRegisterSuccess.bind(this), this.onRegisterFailed.bind(this));
                }
            } else if (event.target.name === 'backButton') {
                this.scene.start('LandingScene');
            }
        });
    }

    onRegisterSuccess(user : User) : void {
        var userData = new UserDataBuilder()
            .id(user.uid)
            .nickName(this.nickname)
            .groupByScore(this.score)
            .build();
        this.firestoreUserinfo.add(userData, this.onUserCreatedSuccess.bind(this), this.onUserCreatedFailed.bind(this));
    }

    onRegisterFailed(errorCode : number) : void {
        console.log('[onRegisterFailed] ' + errorCode);
    }

    onUserCreatedSuccess(user: UserData) : void {
        console.log('[onUserCreatedSuccess] ' + JSON.stringify(user));
        this.scene.start('WelcomeScene');
    }

    onUserCreatedFailed(): void {
        console.log('[onUserCreatedFailed] ');

    }
}