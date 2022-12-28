import { GameObjects } from "phaser";
import { HistoryImpl } from "../databridge/HistoryImpl";
import { LevelInfoImpl } from "../databridge/LevelInfoImpl";
import { LibraryImpl } from "../databridge/LibraryImpl";
import { UserInfoImpl } from "../databridge/UserInfoImpl";
import { LogicController } from "../domain/LogicController";
import { Library } from "../dto/Library";
import { VKSHistoryBuilder, VKSScore, VKSSlice, VKSSliceBuilder, VKSType } from "../dto/VKSHistory";
import { BaseLogPanelScene } from "./BaseLogPanelScene";

export class VKSScene extends BaseLogPanelScene {

    // DB impl
    private libImpl : LibraryImpl;
    private userInfoImpl: UserInfoImpl;
    private historyImpl: HistoryImpl;

    // Data
    private vType: VKSType;
    private wordList: Library[];
    private curWordIndex: number = 0;
    private curWord: Library;
    private scoreChecked: number;
    private slices: VKSSlice[] = [];
    private scoreDesc = ['I. 我對這個單字沒印象。', 'II. 我看過這個單字，卻不知道它的意思。', 'III.	我看過這個單字，', 'IV. 我確知這個單字，'];

    // UI components - Main
    private numberTxt: GameObjects.Text;
    private wordTxt: GameObjects.Text;
    private scoreDesTxt: GameObjects.Text[] = [];
    private radioIcons: GameObjects.Image[] = [];
    private radioCheckedIcons: GameObjects.Image[] = [];

    // UI components - HTML
    private vksPanelElement: GameObjects.DOMElement;
    private transTxt: GameObjects.Text;
    private transInputElement: HTMLInputElement;
    private sentTxt: GameObjects.Text;
    private sentenceInputElement: HTMLInputElement;

    
    constructor() {
        super('VKSScene');
        this.userInfoImpl = new UserInfoImpl();
        this.libImpl = new LibraryImpl();
        this.historyImpl = new HistoryImpl();
    }

    override preload(): void {
        super.preload();

        this.load.image('radioIcon', 'assets/icons/radio_32.png');
        this.load.image('radioCheckedIcon', 'assets/icons/radio_checked_32.png');
        this.load.html('vks_panel', 'assets/htmls/vks.html');
    }

    override create(data?: any): void {
        super.create();
        this.vType = data.type;

        this.scene.launch('LoadingScene');

        var base_x = 100;
        var base_y = 100;

        this.numberTxt = this.make.text({
            x: base_x,
            y: base_y,
            text: '',
            style: { font: '20px verdana', color: '#000000' }
        });

        this.wordTxt = this.make.text({
            x: base_x,
            y: base_y + 50,
            text: '',
            style: { font: '60px verdana', color: '#000000' }
        });

        var iconX = base_x;
        var iconY = base_y + 200;
        var txtY = base_y + 180;
        for(var index = 0; index < 4; index ++) {
            var radio = this.add.image(iconX, iconY + 60 * index, 'radioIcon');
            var radioChecked = this.add.image(iconX, iconY + 60 * index, 'radioCheckedIcon');
            radioChecked.setVisible(false);

            var scoreDesTxt = this.make.text({
                x: iconX + 50,
                y: txtY + 60 * index,
                text: this.scoreDesc.at(index),
                style: { font: '30px verdana', color: '#000000' }
            });
            scoreDesTxt.setInteractive();
            scoreDesTxt.on('pointerdown', this.onScoreDesTxtClickListener.bind(this, index) );

            this.radioIcons[index] = radio;
            this.radioCheckedIcons[index] = radioChecked;
            this.scoreDesTxt[index] = scoreDesTxt;
        }

        this.vksPanelElement = this.add.dom(700, 570).createFromCache('vks_panel');
        this.vksPanelElement.addListener('click');
        this.vksPanelElement.on('click', (event : any) => {
            console.log('[VKSScene][PanelElement] ' + JSON.stringify(event));
        });

        this.transTxt = this.make.text({
            x: 150,
            y: txtY + 60 * 4,
            text: '我知道這個單字',
            style: { font: '30px verdana', color: '#000000' }
        });
        this.transTxt.setVisible(false);
        var transInput = this.vksPanelElement.getChildByID('vks_txt_trans');
        this.transInputElement = (<HTMLInputElement>transInput);
        this.transInputElement.hidden = true;

        this.sentTxt = this.make.text({
            x: 150,
            y: txtY + 60 * 5,
            text: '請試著造句',
            style: { font: '30px verdana', color: '#000000' }
        });
        this.sentTxt.setVisible(false);
        var sentenceInput = this.vksPanelElement.getChildByID('vks_txt_sen');
        this.sentenceInputElement = (<HTMLInputElement>sentenceInput);
        this.sentenceInputElement.hidden = true;

        this.libImpl.getAllBasicWords()
        .then((wordList: Library[]) => {
            this.scene.stop('LoadingScene');
            this.wordList = wordList;
            console.log('get ' + wordList.length + ' words');
            this.curWordIndex = 0;
            this.curWord = this.wordList.at(this.curWordIndex);
            this.refreshUI();
        })
        .catch((err: any) => {
            this.scene.stop('LoadingScene');
            this.showLog('[VKSScene][AllBasicWords] ' + JSON.stringify(err));
        });

        var nextBtn = this.make.text({
            x: 100,
            y: txtY + 60 * 6.5,
            text: 'Next......',
            style: { font: '30px verdana', color: '#000000' }
        });
        nextBtn.setInteractive();
        nextBtn.on('pointerdown', this.onNextBtnClicked.bind(this));
    }

    private onScoreDesTxtClickListener(clickIndex: number): void {
        this.showLog('You clicked score ' + clickIndex);

        this.scoreChecked = clickIndex;
        for(var index = 0; index < 4; index ++) {
            this.radioCheckedIcons.at(index).setVisible(index == clickIndex);
            this.radioIcons.at(index).setVisible(index != clickIndex);
        }

        this.transTxt.setVisible(clickIndex == 2 || clickIndex == 3);
        this.transTxt.setText(clickIndex == 2 ? '意思可能是' : '它的意思是');
        this.transInputElement.hidden = (clickIndex == 0 || clickIndex == 1);
        this.sentTxt.setVisible(clickIndex == 3);
        this.sentenceInputElement.hidden = clickIndex != 3;
    }

    private refreshUI() {
        // reset data
        this.scoreChecked = -1;

        this.numberTxt.setText(this.curWordIndex + 1 + ' / ' + this.wordList.length);
        this.wordTxt.setText(this.curWord.word);

        for(var index = 0; index < 4; index ++) {
            this.radioCheckedIcons.at(index).setVisible(false);
            this.radioIcons.at(index).setVisible(true);
        }

        this.transTxt.setVisible(false);
        this.transTxt.setText('');
        this.transInputElement.value = '';
        this.transInputElement.hidden = true;
        this.sentTxt.setVisible(false);
        this.sentenceInputElement.value = '';
        this.sentenceInputElement.hidden = true;
    }

    private isNecessaryInputFilled(): boolean {
        if (this.scoreChecked == 2) {
            return this.transInputElement.value !== '';
        } else if (this.scoreChecked == 3) {
            return this.transInputElement.value !== '' && this.sentenceInputElement.value !== '';
        } else if (this.scoreChecked == -1) {
            return false
        }
        return true
    }

    private onNextBtnClicked(): void {
        if (this.isNecessaryInputFilled()) {
            this.addLogSlice();

            this.curWordIndex ++;

            if (this.curWordIndex < this.wordList.length) {
                this.curWord = this.wordList.at(this.curWordIndex);
                this.refreshUI();
            } else {
                // upload log
                var logSnippet = new VKSHistoryBuilder()
                    .uid(LogicController.getInstance().getUser().id)
                    .uname(LogicController.getInstance().getUser().nickName)
                    .vType(this.vType)
                    .result(this.slices)
                    .build();
                this.historyImpl.add(logSnippet);

                // update user info
                if (this.vType == VKSType.PRE) {
                    this.userInfoImpl.updatePreVKSstatus(LogicController.getInstance().getUser().id);
                } else  {
                    this.userInfoImpl.updatePostVKSstatus(LogicController.getInstance().getUser().id);
                }
                
                this.scene.start('PreparationScene');
            }
        }

    }

    private addLogSlice(): void {
        this.slices.push(new VKSSliceBuilder()
            .id(this.curWord.id)
            .word(this.curWord.word)
            .score(this.mapScoreFromIndex(this.scoreChecked))
            .translation(this.transInputElement.value)
            .sentence(this.sentenceInputElement.value)
            .build());
    }

    private mapScoreFromIndex(clickIndex: number): VKSScore {
        switch(clickIndex) {
            case 0:
                return VKSScore.LEVEL_0;
            case 1:
                return VKSScore.LEVEL_1;
            case 2:
                return VKSScore.LEVEL_2;
            case 3:
                return VKSScore.LEVEL_3;
            default:
                return null;
        }
    }

    private onScoreDesTxtHoverOut(index: number): void {
        this.showLog('You clicked score ' + index);

    }
}
