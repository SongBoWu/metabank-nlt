import { User } from "firebase/auth";
import { DatabaseCore } from "../databridge/DatabaseCore";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { UserData, UserDataBuilder } from "../dto/UserData";

export class SignUpScene extends Phaser.Scene {
    private firestoreUserinfo: UserInfoImpl;
    private levelInfo: LevelInfoImpl;

    private nickname : string;

    constructor() {
        super('SignUpScene');
        this.firestoreUserinfo = new UserInfoImpl();
        this.levelInfo = new LevelInfoImpl();
    }

    preload(): void {
        this.load.html('registerInputform', 'assets/registerform.html');
        this.load.image('meta_bg', 'assets/mb_bg.jpg');
    }

    create(): void {
        this.add.image(512, 384, 'meta_bg');
        var registerformElement = this.add.dom(512, 400).createFromCache('registerInputform');
        registerformElement.addListener('click');
        registerformElement.on('click', (event : any) => {
          
            if (event.target.name === 'registerButton') {
                var nickNameElement = registerformElement.getChildByID('nickname');
                var accountElement = registerformElement.getChildByID('account');
                var passwordElement = registerformElement.getChildByID('password');
        
                var accountValue = (<HTMLInputElement>accountElement).value;
                var passwordValue = (<HTMLInputElement>passwordElement).value;
                var nickNameValue = (<HTMLInputElement>nickNameElement).value;
                
                if (nickNameValue !== '' && accountValue !== '' && passwordValue !== '') {
                    this.nickname = nickNameValue;
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
            .build();
        this.firestoreUserinfo.add(userData, this.onUserCreatedSuccess.bind(this), this.onUserCreatedFailed.bind(this));
    }

    onRegisterFailed(errorCode : number) : void {
        console.log('[onRegisterFailed] ' + errorCode);
    }

    onUserCreatedSuccess(user: UserData) : void {
        console.log('[onUserCreatedSuccess] ' + JSON.stringify(user));
        this.levelInfo.add(user.id, user.nickName)
            .then(() => {
                this.scene.start('WelcomeScene');
            })
            .catch(() => {
                console.log('[addLevel] error');
            });
        
    }

    onUserCreatedFailed(): void {
        console.log('[onUserCreatedFailed] ');
    }
}