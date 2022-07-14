import { DatabaseCore } from "../databridge/DatabaseCore";
import eventsCenter from "../plugins/EventsCenter";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class LandingScene extends Phaser.Scene {
    constructor() {
        super('LandingScene');
    }

    preload(): void {
        this.load.html('logintable', 'assets/loginform.html');
    }

    create(): void {
        var loginformElement = this.add.dom(400, 300).createFromCache('logintable');
        loginformElement.addListener('click');
        loginformElement.on('click', (event : any) => {
            if (event.target.name === 'loginButton') {
                var userNameElement = loginformElement.getChildByID('username');
                var passwordElement = loginformElement.getChildByID('password');
        
                var userNameValue = (<HTMLInputElement>userNameElement).value;
                var passwordValue = (<HTMLInputElement>passwordElement).value;
                
                if (userNameValue !== '' && passwordValue !== '') {
                    DatabaseCore.getInstance().getAuthImpl().signIn(userNameValue, passwordValue);
                }
            } else if (event.target.name === 'registerButton') {
                this.scene.start('SignUpScene');
            }
          
        });

        eventsCenter.on('onAuth', this.startGame, this)

        // clean up when Scene is shutdown
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventsCenter.off('onAuth', this.startGame, this)
        })
    }

    private startGame(): void {
        this.scene.start('WelcomeScene');
    }
}