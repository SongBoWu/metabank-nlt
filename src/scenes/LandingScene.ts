import { DatabaseCore } from "../databridge/DatabaseCore";
import eventsCenter from "../plugins/EventsCenter";

export class LandingScene extends Phaser.Scene {
    constructor() {
        super('LandingScene');
    }

    preload(): void {
        this.load.html('logintable', 'assets/loginform.html');
        this.load.image('meta_bg', 'assets/mb_bg.jpg');
    }

    create(): void {
        this.scene.stop('SettingsScene');
        this.add.image(512, 384, 'meta_bg');
        var loginformElement = this.add.dom(512, 900).createFromCache('logintable');
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

        this.tweens.add({
            targets: loginformElement,
            y: 400,
            duration: 2000,
            ease: 'Power3'
        });

        eventsCenter.on('onAuth', this.startGame, this)

        // clean up when Scene is shutdown
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventsCenter.off('onAuth', this.startGame, this)
        })
    }

    private startGame(): void {
        this.scene.start('PreparationScene');
    }
}