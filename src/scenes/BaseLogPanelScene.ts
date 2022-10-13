
import { DatabaseCore } from "../databridge/DatabaseCore";
import eventsCenter from "../plugins/EventsCenter";

export class BaseLogPanelScene extends Phaser.Scene {

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
        
        this.add.image(512, 384, 'bg');
        // var domElement = this.add.dom(400, 250).createFromCache('logPanel');
        // this.logElement = domElement.getChildByName('logPreview');

        eventsCenter.on('onUnAuth', this.backToHome, this)

        // clean up when Scene is shutdown
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            eventsCenter.off('onUnAuth', this.backToHome, this)
        })

    }

    protected showLog(snippet: string): void {
        console.log(snippet);
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