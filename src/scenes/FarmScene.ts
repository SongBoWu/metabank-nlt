import { GameObjects } from "phaser";
import { LibraryImpl } from "../databridge/LibraryImpl";
import { LogicController } from "../domain/LogicController";
import { BannerConf } from "../dto/BannerConf";
import { LevelType } from "../dto/LevelInfo";
import { Library, LibraryBuilder } from "../dto/Library";
import eventsCenter from "../plugins/EventsCenter";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class FarmScene extends BaseLogPanelScene {

    private libPanelElement: GameObjects.DOMElement;
    private libImpl: LibraryImpl;

    private words: Library[];
    private curIndex: number = 0;
    private unReadWords: string[] = [];

    private wordText: GameObjects.Text[] = [];
    private preBtn: GameObjects.Text;
    private nextBtn: GameObjects.Text;
    private back2MainBtn: GameObjects.Text;

    constructor() {
        super('FarmScene');
        this.libImpl = new LibraryImpl();
    }

    override preload(): void {
        super.preload();

        this.load.html('lib_panel', 'assets/library_detail.html');
        this.load.text('library_artifact', 'assets/data/library.txt');
    }

    override create(data?: any): void {
        super.create();
        this.showLog('create ' + JSON.stringify(data));
        this.showBanner();

        this.curIndex = 0;
        this.words = LogicController.getInstance().getLibrary();
        this.words.forEach((value, index, all) => {
            this.unReadWords[index] = value.id;

            var wordText = this.wordText[index];
            wordText = this.make.text({
                x: 800,
                y: 80 + 50 * index,
                text: value.word,
                style: { font: 'bold 28px Arial', color: '#1a3d1d' }
            });
            wordText.on('pointerdown', () => {
                // TODO, record then upload the trace
                console.log('[FarmScene][word_click]: ' + index);
                this.curIndex = index;
                this.updateLibContent();
                this.updateButtons();
            });
            wordText.setInteractive();
        });
        this.libPanelElement = this.add.dom(350, 125).createFromCache('lib_panel');


        this.nextBtn = this.make.text({
            x: 120,
            y: 700,
            text: 'Next',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        this.nextBtn.setInteractive();
        this.nextBtn.on('pointerdown', () => {
            this.curIndex ++;
            this.updateLibContent();
            this.updateButtons();
        });

        this.preBtn = this.make.text({
            x: 10,
            y: 700,
            text: 'Previous',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        this.preBtn.setVisible(false);
        this.preBtn.setInteractive();
        this.preBtn.on('pointerdown', () => {
            this.curIndex --;
            this.updateLibContent();
            this.updateButtons();
        });

        
        this.back2MainBtn = this.make.text({
            x: 180,
            y: 700,
            text: 'Back to Main',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        this.back2MainBtn.setVisible(false);
        this.back2MainBtn.setInteractive();
        this.back2MainBtn.on('pointerdown', () => {
            this.scene.start('LevelScene', {
                from: 'FarmScene'
            });
        });

        this.updateLibContent();
        this.updateButtons();
    }

    private updateLibContent(): void {
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
    }

    private updateButtons(): void {
        this.preBtn.setVisible(this.curIndex == 0 ? false : true);
        this.nextBtn.setVisible(this.curIndex == this.words.length -1 ? false : true);
        this.back2MainBtn.setVisible(this.unReadWords.length == 0 ? true : false);
    }

    private showBanner(): void {
        var conf = new BannerConf();
        conf.isHitoBoard = true;
        eventsCenter.emit('onSettingUpdated', conf);
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