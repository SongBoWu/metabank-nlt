import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class FarmScene extends BaseLogPanelScene {
    constructor() {
        super('FarmScene');
    }

    override create(data?: any): void {
        super.create();
        this.showLog('create ' + JSON.stringify(data));

        var optATxt = this.make.text({
            x: 10,
            y: 500,
            text: 'A. ',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        optATxt.setInteractive();
        optATxt.on('pointerdown', () => {
            this.showLog('[OPTION] A');
        });

        var optBTxt = this.make.text({
            x: 210,
            y: 500,
            text: 'B. ',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        optBTxt.setInteractive();
        optBTxt.on('pointerdown', () => {
            this.showLog('[OPTION] B');
        });

        var optCTxt = this.make.text({
            x: 10,
            y: 550,
            text: 'C. ',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        optCTxt.setInteractive();
        optCTxt.on('pointerdown', () => {
            this.showLog('[OPTION] C');
        });

        var optDTxt = this.make.text({
            x: 210,
            y: 550,
            text: 'D. ',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        optDTxt.setInteractive();
        optDTxt.on('pointerdown', () => {
            this.showLog('[OPTION] D');
        });
    }
}