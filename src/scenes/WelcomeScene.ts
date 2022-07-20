import { DatabaseCore } from "../databridge/DatabaseCore";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { LogicController } from "../domain/LogicController";
import { Level, LevelBuilder, LevelType } from "../dto/LevelInfo";
import { UserDataBuilder } from "../dto/UserData";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class WelcomeScene extends BaseLogPanelScene {
    private firestoreUserinfo: UserInfoImpl;
    private levelInfo : LevelInfoImpl;
    
    constructor() {
        super('WelcomeScene');
        this.firestoreUserinfo = new UserInfoImpl();
        this.levelInfo = new LevelInfoImpl();
    }

    override preload(): void {
        super.preload();
    }

    override create(): void {
        super.create();

        var user = DatabaseCore.getInstance().getAuthImpl().getUser();

        this.firestoreUserinfo.get(user.uid)
            .then(userData => {
                LogicController.getInstance().setUser(userData);
                return this.levelInfo.getLevels(user.uid);
            })
            .then((levels: Level[]) => {
                levels.forEach(level => {
                    console.log('[WelcomeScene] ' + JSON.stringify(level));
                })
            })
            .catch(() => {
                // TODO
            });

        var startTxt = this.make.text({
            x: 10, 
            y: 500, 
            text: 'Start', 
            style: { font: 'bold 30px Arial', color: '#00ff00' }
            });
            startTxt.setInteractive();
            startTxt.on('pointerdown', ()=>{
                this.scene.start('LevelScene',
                {
                    from: 'WelcomeScene'
                });
            })
        ;
    }

    protected override onNetworkOnline(event: Event): void {
        // TODO
    }

    protected override onNetworkOffline(event: Event): void {
        // TODO
    }
}