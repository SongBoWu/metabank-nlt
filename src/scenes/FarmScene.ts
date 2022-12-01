import { GameObjects } from "phaser";
import { LibraryImpl } from "../databridge/LibraryImpl";
import { LogicController } from "../domain/LogicController";
import { LevelType } from "../dto/LevelInfo";
import { Library, LibraryBuilder } from "../dto/Library";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class FarmScene extends BaseLogPanelScene {

    private libPanelElement: GameObjects.DOMElement;
    private libImpl: LibraryImpl;

    private words: Library[];
    private curIndex: number = 0;

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

        this.words = LogicController.getInstance().getLibrary();


        this.libPanelElement = this.add.dom(520, 125).createFromCache('lib_panel');


        var nextBtn = this.make.text({
            x: 120,
            y: 700,
            text: 'Next',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        nextBtn.setInteractive();
        nextBtn.on('pointerdown', () => {
            this.curIndex ++;
            this.updateLibContent();

            if (this.curIndex == this.words.length - 1) {
                preBtn.setVisible(true);
                nextBtn.setVisible(false);
            } else {
                preBtn.setVisible(true);
                nextBtn.setVisible(true);
            }
        });

        var preBtn = this.make.text({
            x: 10,
            y: 700,
            text: 'Previous',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        preBtn.setVisible(false);
        preBtn.setInteractive();
        preBtn.on('pointerdown', () => {
            this.curIndex --;
            this.updateLibContent();

            if (this.curIndex == 0) {
                preBtn.setVisible(false);
                nextBtn.setVisible(true);
            } else {
                preBtn.setVisible(true);
                nextBtn.setVisible(true);
            }
        });

        var backToMain = this.make.text({
            x: 180,
            y: 700,
            text: 'Back to Main',
            style: { font: 'bold 20px Arial', color: '#00ff00' }
        });
        backToMain.setInteractive();
        backToMain.on('pointerdown', () => {
            this.scene.start('LevelScene', {
                from: 'FarmScene'
            });
        });

        this.updateLibContent();
    }

    private updateLibContent(): void {
        var libInstance = this.words.at(this.curIndex);

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