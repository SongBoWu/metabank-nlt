import { GameObjects } from "phaser";
import { GroupType } from "../const/GroupType";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { LogicController } from "../domain/LogicController";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class GuideScene extends BaseLogPanelScene {

    // DB impl
    private firestoreUserinfo: UserInfoImpl;

    // UI components
    private guidePanelElement: GameObjects.DOMElement;
    private nextBtn: GameObjects.Image;
    
    constructor() {
        super('GuideScene');
        this.firestoreUserinfo = new UserInfoImpl();
    }

    preload(): void {
        super.preload();
        this.load.image('nextIcon', 'assets/icons/next_64.png');
        this.load.html('guide1', 'assets/guide1.html');
        this.load.html('guide2', 'assets/guide2.html');
    }

    create(): void {
        super.create();

        var user = LogicController.getInstance().getUser();
        this.guidePanelElement = this.add.dom(550, 350).createFromCache(user.group == GroupType.EXPERIMENTAL ? 'guide1' : 'guide2');
        this.guidePanelElement.setVisible(true);


        this.nextBtn = this.add.image(100, 700, 'nextIcon');
        this.nextBtn.setInteractive();
        this.nextBtn.on('pointerdown', this.OnNextBtnClickListener.bind(this));
    }

    private OnNextBtnClickListener(): void {
        this.scene.start('WelcomeScene');
    }
}