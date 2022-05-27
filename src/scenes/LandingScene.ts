import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class LandingScene extends BaseLogPanelScene {
    constructor() {
        super('LandingScene');
    }

    override create(): void {
        super.create();

        var signInTxt = this.make.text({
          x: 10,
          y: 500,
          text: 'SignIn',
          style: { font: 'bold 30px Arial', color: '#00ff00' }
        });
        signInTxt.setInteractive();
        signInTxt.on('pointerdown', () => {
          this.showLog('[SignIn]')
        });
    }
}