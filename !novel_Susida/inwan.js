////////////////////////////////////////////////////////////////
//ゲーム開発の基本機能ライブラリ
///////////////////////////////////////////////////////////////
//****************************************************************
//内容：Labelクラスを継承した自作ラベルクラス
var MyLabel = enchant.Class.create(enchant.Label,{
    initialize: function(size, font){
        enchant.Label.call(this);
        this.size = 24;
        this.fontStyle = "sans-serif";
        if(font){
            this.fontStyle = font + ',' + this.fontStyle;
        }
        if(size){
            this.size = size;
        }
        this.font = this.size + "px " + this.fontStyle;
        this.color = "white";
        this.width = 640;
    },
});
//内容：制限時間の計測と表示
//説明：ラベルクラスを継承。引数で渡された分・秒から経過時間を引いて表示する
var TimeCountDown = enchant.Class.create(enchant.Label, {
    initialize: function(min, sec){//引数に分と秒を入れる
        enchant.Label.call(this);
        this.color = "white";
        this.font = '30px sans-serif';
        this.isTimeUp = false;
        var tick = 0;
        var minute = min;
        var second = sec; 
        this.addEventListener('enterframe', function(){
            if(this.isTimeUp == true){//タイムオーバーになっていればもう処理しない
                return;
            }
            if(tick++ >= FPS){//残り時間計算（FPS = 1秒）
                tick = 0;
                if(--second < 0){
                    second = 59;
                    if(--minute < 0){//タイムアップ
                        this.isTimeUp = true;//フラグ立てる
                        return;
                    }
                }
            }
            this.text = minute + ":" + ('00' + second).slice(-2);//時間
        });
    }
});
//*************************************************************************
//内容:シーン内の子要素を全削除関数
function removeChildren(parent){
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}
//************************************************************************
//内容：min～maxの整数をランダムで返す
function random(min,max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
//************************************************************************
//内容：音の再生(同一音の複数同時再生可能）
var SoundEffect = enchant.Class.create({
    //ファイルセット関数(引数：ファイル、オブジェクト作成数(※必ず1以上)）
    set: function(data, max){
        this.sound = [];//サウンドオブジェクト保存用
        this.count = 0;//カウント用初期化
        this.max = max;//同時再生最大数
        for(var i = 0; i < this.max; i++){
            this.sound[i] = data.clone();    
        }
    },
    //再生関数(クローンを順繰りに再生) 
    play: function(){
        this.sound[this.count++].play();
        if(this.count >= this.max){
            this.count = 0;
        }
    },
    //一時停止(現在一時停止はできるが、鳴っていた音だけを続きから再生することができていない)
    pause: function(){
        for(var i = 0; i < this.max; i++){
            this.sound[i].pause();
        }
    }
});
//************************************************************************
//内容：BGM再生(ループ再生）、一時停止、停止
var Bgm = enchant.Class.create({
    initialize: function(){
        this.data = null;
        this.isPlay = false;//プレイの状態フラグ
        this.isPuase = false;
    },
    //BGM用音楽ファイルのセット
    set: function(data){
        this.data = data;
    },
    //再生(再生のみに使う)
    play: function(){
        this.data.play();
        this.isPlay = true;
        if(this.data.src != undefined){//srcプロパティを持っている場合(スマホの場合)
            this.data.src.loop = true;
        }
    },
    //ループ再生(必ずループ内に記述すること) PCでのループ再生で使う
    loop: function(){
        if(this.isPlay == true && this.data.src == undefined){//再生中でsrcプロパティを持っていない場合(PC)
            this.data.play();
        }else if(this.isPuase){//スマホでポーズ画面から戻ったとき用
            this.data.play();
            this.isPuase = false;
        }
    },
    //再生停止(曲を入れ替える前は,必ずstop()させる)
    stop: function(){
        if(this.data != null){
            if(this.isPlay && !this.isPuase){//プレイ中か？
                this.data.stop();
                this.isPlay = false;
            }else if(this.isPuase){
                this.isPlay = false;
                this.isPuase = false;
                this.data.currentTime = 0;
            }
        }
    },
    //一時停止（ポーズ画面などの一時的な画面の切り替え時に音を止めたいときのみ使う）
    pause: function(){
        if(this.data != null){
            this.data.pause();
            this.isPuase = true;
        }
    }
});

//************************************************************************
//内容：画面のフェードアウト
var FadeOut = enchant.Class.create(enchant.Sprite, {
    initialize: function(w, h, color) {
        enchant.Sprite.call(this, w, h);
        
        // Surface作成
        var bg = new Surface(w, h);
        bg.context.fillStyle = color;
        bg.context.fillRect(0, 0, w, h);
        // Sprite作成
        Sprite.call(this, w, h);
        this.image = bg;
        this.x = 0;
        this.y = 0;
        this.opacity = 0;
        this.isStart = false;
    },
    //フェードアウト開始初期処理(引数にシーンが必要)
    start: function(scene){
        if(!this.isStart){
            scene.addChild(this);
            this.isStart = true;
        }
    },
    //実行処理(先にstart()で初期処理しないと作動しない)
    do: function(speed){//引数：フェードアウトの速さ0.01~0.5(大きいほど速い)
        if(this.isStart){
            this.opacity += speed;
            if(this.opacity >= 1){//終わったらtrueを返す
                return true;
            }
            return false;
        }
    },
    stop: function(){
        this.isStart = false;
        this.opacity = 0;
    }
});