var FPS = 30;
//画面サイズ関係
var SCREEN_WIDTH = 900; //画面幅
var SCREEN_HEIGHT = 900;//画面高さ
var GAME_SCREEN_HEIGHT = 900;//ゲーム画面
var GAME_SCREEN_WIDTH = 1000;//ゲーム画面

//ゲーム場面用予約語
var SCENE_TITLE = 1;
var SCENE_MAINGAME = 2;

//データアセット
var ASSETS = {
	//通学路01
	img_tuugakuro:'image/matinami_01.jpg',
	//スタート
	img_Start:'image/start.jpg',
    //通学路bgm
    tuugakuroBGM:'sound/tuugakuroBGM.mp3'
}
var game;
enchant();

window.onload = function () {
//	game = new Game(1600, 800);
	game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);
	game.preload(ASSETS);
	game.fps = FPS;
	//
	game.onload = function () {	
        system = new System();
        system.changeScene(SCENE_TITLE);
    };
    
    game.start();
}

//システムクラス（ゲーム全体で必要な要素を保持する）---------------------------
var System = enchant.Class.create({
    initialize: function(){
        this.score = 0;//得点用
        this.rootScene;//ルートシーン参照用(シーン切り替えで必要になる)
    },
    //シーン切り替え
    changeScene: function(sceneNumber){
        switch(sceneNumber){
            case SCENE_TITLE:
                var title = new TitleScene();
                break;
            case SCENE_MAINGAME:
                var main = new MainGameScene();//メインゲームへ
                break;
        }
    },
});


//タイトル画面シーン-------------------------------------------------------------
var TitleScene = enchant.Class.create(enchant.Scene, {
    initialize: function(){
        enchant.Scene.call(this);//シーンクラス呼び出し
        //画面初期処理-----------------
        game.replaceScene(this);//シーンを入れ替える
        this.backgroundColor = 'rgba(0, 0, 0, 1)';//背景色 
        var screen = new Group();//ゲーム用スクリーン作成
        this.addChild(screen);
        //基本効果音
        //var se_start = new SoundEffect();
        //se_start.set(core.assets['se_start'], 1);

		/*
		//メインメニューボタン
		const StartImg = new Sprite(960, 960);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		StartImg.moveTo(0, 0);						//位置
		StartImg.image = game.assets['img_Start'];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		StartImg.scaleX = 0.2;
		StartImg.scaleY = 0.2;
		screen.addChild(StartImg);					//mainSceneに貼り付ける
		*/

        //touch to start表示
        var label = new Label();
        label.text = "TOUCH TO START";
        label.color = 'white';
        label.font = '40px sans-serif';
        label.x = 250; 
        label.y = 400; 
        label.width = GAME_SCREEN_WIDTH;
        screen.addChild(label);

        var isStartPushed = false;//スタートボタンチェックフラグ
		var fpsCount = 0;//フレームカウント

        var startTime, nowTime;//タイマー

        //画面タッチでスタート
		this.addEventListener('touchend', function(){
            if(isStartPushed == false){
                isStartPushed = true;//押したよフラグ
                //this.from = this.age;
				fpsCount = 0;
                // スタート時刻
                startTime = new Date();
                screen.removeChild(label);
            }
        });

        //フェードアウト用オブジェクト
        var fade_out = new FadeOut(GAME_SCREEN_WIDTH, GAME_SCREEN_HEIGHT, "black");
        
        //カウントダウン
        var elapsedTime;
        var countDown = new Label();
        countDown.color = 'white';
        countDown.font = '160px sans-serif';
        countDown.x = 400; 
        countDown.y = 400; 
        countDown.width = GAME_SCREEN_WIDTH;

        //タイトル画面シーンのループ--------------------------------------------------
        this.addEventListener('enterframe', function(){
            if(isStartPushed == true){//スタートボタンが押された

                //カウントダウン
                nowTime = new Date(); // ナウタイム
                 elapsedTime = Math.floor((nowTime - startTime) / 1000);
                var str = '経過秒数: ' + (5 - elapsedTime) + '秒';
                countDown.text = 5 - elapsedTime;   //カウントダウン更新
                if((fpsCount % 30) == 0){
                    screen.addChild(countDown);
                    console.log(str);
                }

                //フレームカウント
                fpsCount += 1;

				//5秒後にフェードアウト
                if(elapsedTime == 4){
						fade_out.start(screen);
					}
            }
            if(fade_out.do(0.1)){//trueが帰ってきたらフェードアウト後の処理へ
                removeChildren(this);//子要素を削除
                system.changeScene(SCENE_MAINGAME);//シーンの切り替え
            }
        });

    },
});
//メインシーン
var MainGameScene = enchant.Class.create(enchant.Scene, {
    initialize: function(){
        enchant.Scene.call(this);
        //画面初期処理-----------------
        game.replaceScene(this);//シーンを入れ替える
        this.backgroundColor = 'rgba(0, 0, 0, 1)';//背景色
        var screen = new Group();//ゲーム用スクリーン作成
        this.addChild(screen);
        system.rootScene = this;//シーンのアドレスを保存
        
		//通学路描画
		const tuugakuroImg = new Sprite(800, 600);				//画像サイズをここに書く。使う予定の画像サイズはプロパティで見ておくこと
		tuugakuroImg.moveTo(0, 0);				//位置
		tuugakuroImg.image = game.assets['img_tuugakuro'];			//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
		screen.addChild(tuugakuroImg);		//mainScene画像を貼り付ける

        //通学路BGM
        game.assets['tuugakuroBGM'].play();

  /*      //出題テキスト読み込み
        var message = [
            'わがはいねこである',
            'なまえはまだない',
            'なんとかかんとか',
            'ぺろぺろ'
        ];
        //出題テキスト表示
        var msgCount = 0;
        var talkText = message[msgCount];
        var mondai = new Label();
    //    mondai.text = talkText;
        mondai.color = 'white';
        mondai.font = '25px sans-serif';
        mondai.x = 140; 
        mondai.y = 610; 
        mondai.width = GAME_SCREEN_WIDTH;
        MondaiHyouji(mondai, talkText, msgCount, message);
        screen.addChild(mondai);*/
        var mondaiBun = new MondaiHyouji();

        // ヘボン式
        var result1 = kanaToRoman(talkText);
        // 訓令式
        var result2 = kanaToRoman(talkText, 'kunrei');
        // ヘボン式 + b.m.p処理なし
        var result3 = kanaToRoman(talkText, null, { bmp : false });

        console.log(result1);
        console.log(result2);
        console.log(result3);

        //ローマ字出題テキスト表示
        var romaji = new Label();
        romaji.color = 'white';
        romaji.font = '25px sans-serif';
        romaji.x = 140; 
        romaji.y = 650; 
        romaji.width = GAME_SCREEN_WIDTH;
        romaji.text = result1;  //テキスト更新
        screen.addChild(romaji);

        //キー入力
        var mojiCount = 0;
        var nyuuryokuMoji;
        setMyKeyDownListener();
        //テキスト表示パラメータ
        var resultText = new Label();
        resultText.text = nyuuryokuMoji;
        resultText.color = 'blue';
        resultText.font = '25px sans-serif';
        resultText.x = 140; 
        resultText.y = 700; 
        resultText.width = GAME_SCREEN_WIDTH;
        //キー入力検知
        function setMyKeyDownListener() {
            parent.addEventListener('keydown',function(event){
                MyFunction(event.key);
            })
        }
        function MyFunction (the_Key) {
            console.log("Key pressed is: "+the_Key);
            if(the_Key == result1[mojiCount] || the_Key == result2[mojiCount] || the_Key == result3[mojiCount]){
                if(mojiCount == 0){
                    nyuuryokuMoji = the_Key;
                    screen.addChild(resultText);//テキスト表示
                }else{
                    nyuuryokuMoji += the_Key;
                }
                if(the_Key == result1[mojiCount]){
                    romaji.text = result1;  //テキスト更新
                }else if(the_Key == result2[mojiCount]){
                    romaji.text = result2;  //テキスト更新
                }else if(the_Key == result3[mojiCount]){
                    romaji.text = result3;  //テキスト更新
                }
                console.log("入力した文字 : " + nyuuryokuMoji);
                //テキスト表示 
                resultText.text = nyuuryokuMoji;
                //文字カウント更新
                mojiCount++;
                
            }
            console.log("次のもじ : " + result1[mojiCount]);
        }

        this.addEventListener('enterframe', function(){
            if(mojiCount == result1.length){
                console.log("clear");
                mojiCount = 0;
                msgCount ++;
                //テキスト入れかえ
                talkText = message[msgCount];
                MondaiHyouji(talkText);
                screen.addChild(mondai);
            }
            var msgLength;
            msgLength = message.length;
            if(msgCount + 1 == msgLength){
                alert('おわり');
            }
        });
    },
});

var MondaiHyouji = function(mondai, talkText, msgCount, message){
    //    mondai.text = talkText;
        mondai.color = 'white';
        mondai.font = '25px sans-serif';
        mondai.x = 140; 
        mondai.y = 610; 
        mondai.width = GAME_SCREEN_WIDTH;
        MondaiHyouji(mondai, talkText, msgCount, message);
        screen.addChild(mondai);
}
var MondaiHyouji = class {
    constructor() { /* コンストラクタ */
        var message = [
            'わがはいねこである',
            'なまえはまだない',
            'なんとかかんとか',
            'ぺろぺろ'
        ];
        //出題テキスト表示
        var msgCount = 0;
        var talkText;
        var mondai = new Label();
    }

    textSet() {  // テキストセット
        talkText = message[msgCount];
        return talkText;
    }
    
  }
/**
 * ひらがなまたはカタカナからローマ字へ変換
 * @param {string} targetStr ローマ字へ変換する文字列（変換元の文字列）
 * @param {"hepburn"|"kunrei"} [type="hepburn"] ローマ字の種類
 * @param {Object} [options] その他各種オプション
 *                           {boolean} [options.bmp=true] ... "ん"（n）の次がb.m.pの場合にnからmへ変換するかどうか
 *                           {"latin"|"hyphen"} [options.longSound="latin"] ... 長音の表し方
 * @return {string} ローマ字へ変換された文字列を返す
 */
 var kanaToRoman = function(targetStr, type, options) {
    /**
     * 変換マップ
     */
    var romanMap = {
        'あ' : 'a',
        'い' : 'i',
        'う' : 'u',
        'え' : 'e',
        'お' : 'o',
        'か' : 'ka',
        'き' : 'ki',
        'く' : 'ku',
        'け' : 'ke',
        'こ' : 'ko',
        'さ' : 'sa',
        'し' : { hepburn : 'shi', kunrei : 'si' },
        'す' : 'su',
        'せ' : 'se',
        'そ' : 'so',
        'た' : 'ta',
        'ち' : { hepburn : 'chi', kunrei : 'ti' },
        'つ' : { hepburn : 'tsu', kunrei : 'tu' },
        'て' : 'te',
        'と' : 'to',
        'な' : 'na',
        'に' : 'ni',
        'ぬ' : 'nu',
        'ね' : 'ne',
        'の' : 'no',
        'は' : 'ha',
        'ひ' : 'hi',
        'ふ' : { hepburn : 'fu', kunrei : 'hu' },
        'へ' : 'he',
        'ほ' : 'ho',
        'ま' : 'ma',
        'み' : 'mi',
        'む' : 'mu',
        'め' : 'me',
        'も' : 'mo',
        'や' : 'ya',
        'ゆ' : 'yu',
        'よ' : 'yo',
        'ら' : 'ra',
        'り' : 'ri',
        'る' : 'ru',
        'れ' : 're',
        'ろ' : 'ro',
        'わ' : 'wa',
        'ゐ' : 'wi',
        'ゑ' : 'we',
        'を' : { hepburn : 'o', kunrei : 'wo' },
        'ん' : 'n',
        'が' : 'ga',
        'ぎ' : 'gi',
        'ぐ' : 'gu',
        'げ' : 'ge',
        'ご' : 'go',
        'ざ' : 'za',
        'じ' : { hepburn : 'ji', kunrei : 'zi' },
        'ず' : 'zu',
        'ぜ' : 'ze',
        'ぞ' : 'zo',
        'だ' : 'da',
        'ぢ' : { hepburn : 'ji', kunrei : 'di' },
        'づ' : { hepburn : 'zu', kunrei : 'du' },
        'で' : 'de',
        'ど' : 'do',
        'ば' : 'ba',
        'び' : 'bi',
        'ぶ' : 'bu',
        'べ' : 'be',
        'ぼ' : 'bo',
        'ぱ' : 'pa',
        'ぴ' : 'pi',
        'ぷ' : 'pu',
        'ぺ' : 'pe',
        'ぽ' : 'po',
        'きゃ' : 'kya',
        'きぃ' : 'kyi',
        'きゅ' : 'kyu',
        'きぇ' : 'kye',
        'きょ' : 'kyo',
        'くぁ' : 'qa',
        'くぃ' : 'qi',
        'くぇ' : 'qe',
        'くぉ' : 'qo',
        'くゃ' : 'qya',
        'くゅ' : 'qyu',
        'くょ' : 'qyo',
        'しゃ' : { hepburn : 'sha', kunrei : 'sya' },
        'しぃ' : 'syi',
        'しゅ' : { hepburn : 'shu', kunrei : 'syu' },
        'しぇ' : 'sye',
        'しょ' : { hepburn : 'sho', kunrei : 'syo' },
        'ちゃ' : { hepburn : 'cha', kunrei : 'tya' },
        'ちぃ' : ['tyi'],
        'ちゅ' : { hepburn : 'chu', kunrei : 'tyu' },
        'ちぇ' : ['tye'],
        'ちょ' : { hepburn : 'cho', kunrei : 'tyo' },
        'てゃ' : 'tha',
        'てぃ' : 'thi',
        'てゅ' : 'thu',
        'てぇ' : 'the',
        'てょ' : 'tho',
        'ひゃ' : 'hya',
        'ひぃ' : 'hyi',
        'ひゅ' : 'hyu',
        'ひぇ' : 'hye',
        'ひょ' : 'hyo',
        'ふぁ' : 'fa',
        'ふぃ' : 'fi',
        'ふぇ' : 'fe',
        'ふぉ' : 'fo',
        'みゃ' : 'mya',
        'みぃ' : 'myi',
        'みゅ' : 'myu',
        'みぇ' : 'mye',
        'みょ' : 'myo',
        'ヴぁ' : 'va',
        'ヴぃ' : 'vi',
        'ヴぇ' : 've',
        'ヴぉ' : 'vo',
        'ぎゃ' : 'gya',
        'ぎぃ' : 'gyi',
        'ぎゅ' : 'gyu',
        'ぎぇ' : 'gye',
        'ぎょ' : 'gyo',
        'じゃ' : { hepburn : 'ja', kunrei : 'zya' },
        'じぃ' : 'zyi',
        'じゅ' : { hepburn : 'ju', kunrei : 'zyu' },
        'じぇ' : 'zye',
        'じょ' : { hepburn : 'jo', kunrei : 'zyo' },
        'ぢゃ' : { hepburn : 'dya', kunrei : 'zya' },
        'ぢぃ' : 'dyi',
        'ぢゅ' : { hepburn : 'dyu', kunrei : 'zya' },
        'ぢぇ' : 'dye',
        'ぢょ' : { hepburn : 'dyo', kunrei : 'zya' },
        'びゃ' : 'bya',
        'びぃ' : 'byi',
        'びゅ' : 'byu',
        'びぇ' : 'bye',
        'びょ' : 'byo',
        'ぴゃ' : 'pya',
        'ぴぃ' : 'pyi',
        'ぴゅ' : 'pyu',
        'ぴぇ' : 'pye',
        'ぴょ' : 'pyo',
        'ぁ' : 'xa',
        'ぃ' : 'xi',
        'ぅ' : 'xu',
        'ぇ' : 'xe',
        'ぉ' : 'xo',
        'ゃ' : 'xya',
        'ゅ' : 'xyu',
        'ょ' : 'xyo',
        'っ' : 'xtu',
        'ヴ' : 'vu',
        'ー' : '-',
        '、' : ', ',
        '，' : ', ',
        '。' : '.'
    };
 
    /**
     * 長音のラテン文字
     */
    var latins = {
        hepburn : {
            'a' : 257,
            'i' : 299,
            'u' : 363,
            'e' : 275,
            'o' : 333
        },
        kunrei : {
            'a' : 226,
            'i' : 238,
            'u' : 251,
            'e' : 234,
            'o' : 244
        }
    };
 
    if (typeof targetStr !== 'string' && typeof targetStr !== 'number') {
        throw '変換する対象が文字列ではありません。';
    }
 
    if (typeof type !== 'string' || !type.match(/^(hepburn|kunrei)$/)) type = 'hepburn';
 
    if (!options) options = {};
    if (typeof options.kana !== 'string') options.kana = 'all';
    if (!options.kana.match(/^(all|hiragana|katakana)$/)) options.kana = 'all';
    if (typeof options.bmp !== 'boolean') options.bmp = true;
    if (typeof options.longSound !== 'string') options.longSound = 'latin';
    if (!options.longSound.match(/^(latin|hyphen)$/)) options.longSound = 'latin';
 
    var remStr = String(targetStr), result = '', slStr, roman, lastStr;
 
    /**
     * 残りの文字列から1文字を切り抜く
     * @return {string} 切り抜いた1つの文字列を返す
     */
    var splice = function() {
        var oneChar = remStr.slice(0, 1);
        remStr = remStr.slice(1);
        return oneChar;
    };
 
    /**
     * 残りの文字列の最初が小文字か判定
     * @return {boolean} 小文字の場合はtrue、そうでない場合はfalseを返す
     */
    var isSmallChar = function() {
        return !!remStr.slice(0, 1).match(/^[ぁぃぅぇぉゃゅょァィゥェォャュョ]$/);
    };
 
    /**
     * カタカナからひらがなへ変換
     * @param {string} kana 元とおなるカタカナ
     * @return {string} ひらがなへ変換された文字列
     */
    var toHiragana = function(kana) {
        return kana.replace(/[\u30a1-\u30f6]/g, function(match) {
            return String.fromCharCode(match.charCodeAt(0) - 0x60);
        });
    };
 
    /**
     * ひらがなから対応するローマ字を取得
     * @param {string} kana 元となるひらがな
     * @return {string} 見つかった場合は対応するローマ字、見つからなかったら元のひらがなを返す
     */
    var getRoman = function(kana) {
        var roman = romanMap[toHiragana(kana)];
        if (roman) {
            if (typeof roman === 'string') {
                return roman;
            } else if (type === 'hepburn') {
                return roman.hepburn;
            } else if (type === 'kunrei') {
                return roman.kunrei;
            }
        } else {
            return kana;
        }
    };
 
    while (remStr) {
        slStr = splice();
 
        if (slStr.match(/^(っ|ッ)$/)) {
            slStr = splice();
            if (isSmallChar()) slStr += splice();
 
            roman = getRoman(slStr);
            roman = (roman !== slStr ? roman.slice(0, 1) : '') + roman;
        } else {
            if (isSmallChar()) slStr += splice();
 
            roman = getRoman(slStr);
        }
 
        var nextRoman = kanaToRoman(remStr.slice(0, 1));
        if (roman === 'n') {
            if (nextRoman.match(/^[aiueo]$/)) {
                if (type === 'hepburn') {
                    roman += '-';
                } else {
                    roman += '\'';
                }
            } else if (options.bmp && nextRoman.match(/^[bmp]/) && type === 'hepburn') {
                roman = 'm';
            }
        } else if (roman === '-') {
            lastStr = result.match(/[aiueo]$/);
            if (lastStr && options.longSound === 'latin') {
                result = result.slice(0, -1);
                roman = String.fromCharCode(latins[type][lastStr[0]]);
            }
        }
 
        result += roman;
    }
 
    return result;
};