
export class BaseLogPanelScene extends Phaser.Scene {

    private logElement: Element;
    private logSnippet: string = '';

    constructor(sceneKey: string) {
        super({
            key: sceneKey
        })
    }

    preload(): void {
        this.load.html('logPanel', 'assets/log-text-area.html');
    }

    create(): void {
        var domElement = this.add.dom(400, 250).createFromCache('logPanel');
        this.logElement = domElement.getChildByName('logPreview');
    }

    protected showLog(snippet: string): void {
        this.logSnippet = '[' + new Date().toLocaleString() + '] ' + snippet + '\n' + this.logSnippet;
        this.logElement.textContent = this.logSnippet;
    }
}