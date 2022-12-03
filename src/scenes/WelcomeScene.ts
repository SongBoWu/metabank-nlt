import { DatabaseCore } from "../databridge/DatabaseCore";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { LogicController } from "../domain/LogicController";
import { Level, LevelBuilder, LevelStatus, LevelType } from "../dto/LevelInfo";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

// 1. Refer to "Scenes\Tutorial\Scene Controller" for scene control
export class WelcomeScene extends BaseLogPanelScene {
    // private firestoreUserinfo: UserInfoImpl;
    // private levelInfo : LevelInfoImpl;
    private levelMap : Map<LevelType, Level>;
    
    constructor() {
        super('WelcomeScene');
        // this.firestoreUserinfo = new UserInfoImpl();
        // this.levelInfo = new LevelInfoImpl();
    }

    override preload(): void {
        super.preload();
        this.load.image('welcome_bg', 'assets/station_bg.png');
        this.load.image('monkey', 'assets/monkey_1.png');
        this.load.image('level1_icon', 'assets/piggy-bank.png');
        this.load.image('level2_icon', 'assets/exchange.png');
        this.load.image('level3_icon', 'assets/calculator.png');
        this.load.image('question_icon', 'assets/faq.png')
    }

    override create(): void {
        super.create();

        this.scene.launch('SettingsScene');

        this.add.image(512, 384, 'welcome_bg');
        this.add.image(512, 650, 'monkey');

        var user = DatabaseCore.getInstance().getAuthImpl().getUser();
        this.levelMap = LogicController.getInstance().getLevels();

        var level1_icon = this.add.image(200, 300, 'level1_icon');
        var level2_icon = this.add.image(500, 250, 'level2_icon');
        var level3_icon = this.add.image(800, 300, 'level3_icon');
        // var question_icon = this.add.image(100, 600, 'question_icon');
            
        level1_icon.setInteractive();
        level1_icon.on('pointerdown', () => {  
            LogicController.getInstance().setCurrentLevel(LevelType.DEPOSIT);
            if (this.levelMap.get(LevelType.DEPOSIT).status != LevelStatus.FINISHED) {
                this.scene.start('LevelScene',
                {
                    from: 'WelcomeScene',
                    levelType: LevelType.DEPOSIT,
                });
            }
        });
        level1_icon.on('pointerover', () => {
            // TODO
        });

        level2_icon.setInteractive();
        level2_icon.on('pointerdown', () => {
            LogicController.getInstance().setCurrentLevel(LevelType.FOREX);
            if (this.levelMap.get(LevelType.FOREX).status != LevelStatus.FINISHED) {
                this.scene.start('LevelScene',
                {
                    from: 'WelcomeScene',
                    levelType: LevelType.FOREX,
                });
            }
        });

        level3_icon.setInteractive();
        level3_icon.on('pointerdown', () => {
            LogicController.getInstance().setCurrentLevel(LevelType.LOAN);
            if (this.levelMap.get(LevelType.LOAN).status != LevelStatus.FINISHED) {
                this.scene.start('LevelScene',
                {
                    from: 'WelcomeScene',
                    levelType: LevelType.LOAN,
                });
            }
        });

    }

    protected override onNetworkOnline(event: Event): void {
        // TODO
    }

    protected override onNetworkOffline(event: Event): void {
        // TODO
    }
}