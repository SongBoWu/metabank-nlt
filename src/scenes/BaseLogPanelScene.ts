
import { DatabaseCore } from "../databridge/DatabaseCore";
import eventsCenter from "../plugins/EventsCenter";

export class BaseLogPanelScene extends Phaser.Scene {

    // private logElement: Element;
    private logSnippet: string = '';

    constructor(sceneKey: string) {
        super({
            key: sceneKey
        })
    }

    init(): void {

    }

    preload(): void {
        // this.load.html('logPanel', 'assets/log-text-area.html');
        this.load.image('bg', 'assets/background-geo-grey.jpg');
    }

    create(data?: any): void {
        window.addEventListener('online', this.onNetworkOnline.bind(this));
        window.addEventListener('offline', this.onNetworkOffline.bind(this));
        
        this.add.image(512, 324, 'bg');
        // var domElement = this.add.dom(400, 250).createFromCache('logPanel');
        // this.logElement = domElement.getChildByName('logPreview');

        eventsCenter.on('onUnAuth', this.backToHome, this)

        // clean up when Scene is shutdown
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventsCenter.off('onUnAuth', this.backToHome, this)
        })

        var signOutTxt = this.make.text({
            x: 650, 
            y: 550, 
            text: 'SignOut', 
            style: { font: 'bold 20px Arial', color: '#00ff00' }
          });
          signOutTxt.setInteractive();
          signOutTxt.on('pointerdown', ()=>{
            DatabaseCore.getInstance().getAuthImpl().signOut();
          });
    }

    protected showLog(snippet: string): void {
        // this.logSnippet = '[' + new Date().toLocaleString() + '] ' + snippet + '\n' + this.logSnippet;
        // this.logElement.textContent = this.logSnippet;
        console.log(this.logSnippet);
    }

    protected cleanLog(): void {
        this.logSnippet = '';
    }

    backToHome(): void {
        this.scene.start('LandingScene');
    }

    protected onNetworkOnline(event: Event): void {
        console.log("You are now connected to the network.");
    }

    protected onNetworkOffline(event: Event): void {
        console.log("The network connection has been lost.");
    }
}