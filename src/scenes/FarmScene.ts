import { Game, GameObjects } from "phaser";
import { HistoryImpl } from "../databridge/HistoryImpl";
import { LibraryImpl } from "../databridge/LibraryImpl";
import { LogicController } from "../domain/LogicController";
import { BannerConf } from "../dto/BannerConf";
import { LevelType } from "../dto/LevelInfo";
import { Library, LibraryBuilder } from "../dto/Library";
import { ParcSliceBuilder, PracHistoryBuilder, PracSlice } from "../dto/PracHistory";
import eventsCenter from "../plugins/EventsCenter";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class FarmScene extends BaseLogPanelScene {

    // DB impl
    private libImpl: LibraryImpl;
    private historyImpl: HistoryImpl;

    // Data
    private words: Library[];
    private curIndex: number = 0;
    private unReadWords: string[] = [];
    
    // Log
    private slices: PracSlice[] = [];

    // UI components
    private libPanelElement: GameObjects.DOMElement;
    private wordIcons: GameObjects.Image[] = [];
    private wordText: GameObjects.Text[] = [];
    private preBtn: GameObjects.Image;
    private nextBtn: GameObjects.Image;
    private mainBtn: GameObjects.Image;

    constructor() {
        super('FarmScene');
        this.libImpl = new LibraryImpl();
        this.historyImpl = new HistoryImpl();
    }

    override preload(): void {
        super.preload();

        this.load.html('lib_panel', 'assets/library_detail.html');
        this.load.image('checkIcon', 'assets/icons/check.png');
        this.load.image('nextBtnIcon', 'assets/icons/next_64.png');
        this.load.image('homeIcon', 'assets/icons/home_64.png');
        //this.load.text('library_artifact', 'assets/data/library.txt');
    }

    override create(data?: any): void {
        super.create();
        this.showLog('create ' + JSON.stringify(data));
        this.showBanner();

        this.curIndex = 0;
        this.words = LogicController.getInstance().getLibrary();
        this.words.forEach((value, index, all) => {
            this.unReadWords[index] = value.id;

            var y_coordinate = 80 + 50 * index;
            this.wordIcons[index] = this.add.image(760, y_coordinate + 15, 'checkIcon');
            this.wordIcons[index].setVisible(false);

            var wordText = this.wordText[index];
            wordText = this.make.text({
                x: 800,
                y: y_coordinate,
                text: value.word,
                style: { font: 'bold 28px Arial', color: '#1a3d1d' }
            });
            wordText.on('pointerdown', () => {
                this.curIndex = index;
                this.updateLibContentAndUI();
            });
            wordText.setInteractive();

            // init logSnippet
            this.slices[index] = new ParcSliceBuilder()
                .id(value.id)
                .word(value.word)
                .build();
        });
        this.libPanelElement = this.add.dom(350, 125).createFromCache('lib_panel');
        this.libPanelElement.setVisible(true);

        var btn_coord_y = 650;
        this.nextBtn = this.add.image(600, btn_coord_y, 'nextBtnIcon');
        this.nextBtn.setInteractive();
        this.nextBtn.on('pointerdown', () => {
            this.curIndex ++;
            this.updateLibContentAndUI();
        });

        this.preBtn = this.add.image(100, btn_coord_y, 'nextBtnIcon');
        this.preBtn.setFlipX(true);
        this.preBtn.setVisible(false);
        this.preBtn.setInteractive();
        this.preBtn.on('pointerdown', () => {
            this.curIndex --;
            this.updateLibContentAndUI();
        });

        
        this.mainBtn = this.add.image(350, btn_coord_y, 'homeIcon');
        this.mainBtn.setVisible(false);
        this.mainBtn.setInteractive();
        this.mainBtn.on('pointerdown', () => {

            var log = new PracHistoryBuilder()
                .uid(LogicController.getInstance().getUser().id)
                .uname(LogicController.getInstance().getUser().nickName)
                .level(LogicController.getInstance().getCurrentLevel().type)
                .result(this.slices)
                .build();

            this.historyImpl.add(log, this.onUploadLogSuccess.bind(this), this.onUploadLogFail.bind(this));

            this.scene.start('LevelScene', {
                from: 'FarmScene'
            });
        });

        this.updateLibContentAndUI();

        this.events.addListener('resume', this.resume.bind(this));
        this.events.addListener('pause', this.pause.bind(this));
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.events.removeListener('resume');
            this.events.removeListener('pause');
        });
    }

    resume(): void {
        console.log('[RoundScene][resume]');
        this.showBanner();
        this.libPanelElement.setVisible(true);
    } 
  
    private pause(): void {
        console.log('[RoundScene][pause]');
        this.libPanelElement.setVisible(false);
    }

    private updateLibContentAndUI(): void {
        var libInstance = this.words.at(this.curIndex);

        // Update unRead list
        var readWordIndex = this.unReadWords.indexOf(libInstance.id);
        if (readWordIndex != -1) {
            this.unReadWords.splice(readWordIndex, 1);
        }
        
        // update UI
        var numberElement = this.libPanelElement.getChildByID('number');
        numberElement.innerHTML = (this.curIndex + 1) + '/' + this.words.length;
        var worfElement = this.libPanelElement.getChildByID('word');
        worfElement.innerHTML = libInstance.word;
        var phoneticElement = this.libPanelElement.getChildByID('phonetic');
        phoneticElement.innerHTML = libInstance.phonetic;
        var transElement = this.libPanelElement.getChildByID('trans');
        transElement.innerHTML = libInstance.translation;
        var typeElement1 = this.libPanelElement.getChildByID('type1');
        typeElement1.innerHTML = libInstance.wordTypes[0].type;
        var exampleElement1 = this.libPanelElement.getChildByID('example1');
        exampleElement1.innerHTML = libInstance.wordTypes[0].example;
        var typeElement2 = this.libPanelElement.getChildByID('type2');
        typeElement2.innerHTML = libInstance.wordTypes[1].type;
        var exampleElement2 = this.libPanelElement.getChildByID('example2');
        exampleElement2.innerHTML = libInstance.wordTypes[1].example;

        this.updateButtons();

        // Update checked icon
        this.wordIcons[this.curIndex].setVisible(true);

        // update log snippet
        this.slices[this.curIndex].click_time ++;
    }

    private updateButtons(): void {
        this.preBtn.setVisible(this.curIndex == 0 ? false : true);
        this.nextBtn.setVisible(this.curIndex == this.words.length -1 ? false : true);
        this.mainBtn.setVisible(this.unReadWords.length == 0 ? true : false);
    }

    private showBanner(): void {
        var conf = new BannerConf();
        conf.isHitoBoard = true;
        conf.curScene = 'FarmScene';
        eventsCenter.emit('onSettingUpdated', conf);
    }

    private onUploadLogSuccess(collectionId: string) {
        console.log('[FarmScene][onUploadLogSuccess] ' + collectionId);
    }

    private onUploadLogFail(e: any) {
        console.log('[FarmScene][onUploadLogFail] ' + JSON.stringify(e));

    }


    private writeCollection(): void {
        var lib_arti = this.cache.text.get('library_artifact');
        var lib_list = lib_arti.split('\n');
        lib_list.forEach((element: string) => {
            var detail = element.split('|');
            var libInstance;
            console.log('length: ' + detail.length);
            if (detail.length == 10) {
                libInstance = new LibraryBuilder()
                .id(detail[0])
                .type(detail[1] as LevelType)
                .word(detail[2])
                .phonetic(detail[3])
                .translation(detail[4])
                .wordTypes1(detail[5], detail[6])
                .wordTypes2(detail[7], detail[8])
                .isBonus(Boolean(JSON.parse(detail[9])))
                .build();
            } else {
                libInstance = new LibraryBuilder()
                .id(detail[0])
                .type(detail[1] as LevelType)
                .word(detail[2])
                .phonetic(detail[3])
                .translation(detail[4])
                .wordTypes1(detail[5], detail[6])
                .isBonus(Boolean(JSON.parse(detail[7])))
                .build();
            }
            console.log(JSON.stringify(libInstance));
            this.libImpl.add(libInstance);
        });
    }
}