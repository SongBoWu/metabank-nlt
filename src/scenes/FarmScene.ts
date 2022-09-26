import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class FarmScene extends BaseLogPanelScene {
    constructor() {
        super('FarmScene');
    }

    override create(data?: any): void {
        super.create();
        this.showLog('create ' + JSON.stringify(data));

        var backToMain = this.make.text({
            x: 10,
            y: 500,
            text: 'Back to Level',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        backToMain.setInteractive();
        backToMain.on('pointerdown', () => {
            this.scene.start('LevelScene',
            {
                from: 'FarmScene',
            });
        });
    }
}