import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class VKSScene extends BaseLogPanelScene {
    private firestoreUserinfo: UserInfoImpl;
    private levelInfoImpl : LevelInfoImpl;

    private entranceExamTxt: Phaser.GameObjects.Text;
    private preVKSTxt: Phaser.GameObjects.Text;
    private postVKSTxt: Phaser.GameObjects.Text;
    
    constructor() {
        super('VKSScene');
        this.firestoreUserinfo = new UserInfoImpl();
        this.levelInfoImpl = new LevelInfoImpl();
    }

    override preload(): void {
        super.preload();
    }

    override create(data?: any): void {
        super.create();
    }
}
