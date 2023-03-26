const scenetop = document.querySelector("#top");
const sceneend = document.querySelector("#end");
const start = document.querySelector("#start");
const start2 = document.querySelector("#start2");
const start3 = document.querySelector("#start3");
const start4 = document.querySelector("#start4");
const scecedisplay = document.querySelector("#display");
let field = document.querySelectorAll(".field");
let turn = document.querySelector("h2");
let judgdisplay = document.querySelector("#judgdisplay");
let game = document.querySelector("#game");
let board = Array(9);
let winflag = true;
let count = 0;

//'win_patterns'は、多次元配列として定義
//勝利となるパターンは以下の形式
const win_patterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

//init()関数は、ページが読み込まれた時点でstartとstart2のHTML要素をクリックイベントリスナーに追加
init();
function init() {
  start.addEventListener('click', playingfirst, false);
  start2.addEventListener('click', playingsecond, false);
}

function changescene(hiddenscene, visiblescene) {
  hiddenscene.classList.add("is-hidden");
  hiddenscene.classList.remove("is-visible");
  visiblescene.classList.add("is-visible");
  visiblescene.classList.remove("is-hidden");
}

function playingfirst() {
  changescene(scenetop, scecedisplay);
  player();
}
function playingsecond() {
  changescene(scenetop, scecedisplay);
  count = 3;
  turn.textContent = "コンピューターの番です";
  com();
  player()
}
//playingfirst()関数とplayingsecond()関数は、それぞれ「先攻」ボタンと「後攻」ボタンがクリックされた時に実行
//playingfirst()はプレイヤーが先攻の場合、playingsecond()はコンピューターが先攻の場合
//changescene()関数を呼び出してシーンを変更、player()またはcom()関数を呼び出してそれぞれのターンを開始

function turn_action() {
  if (count % 2 == 0) {
      turn.textContent = "コンピューターの番です"
  } else {
      turn.textContent = "あなたの番です"
  }
  Judgment();
  count++;
}
//turn_action()関数は、ターンを管理するために使用
//count変数は、現在のターンを表すのに用いる
//Judgment()関数は勝敗がついたかどうかを確認
//最後にcountをインクリメントして、次のターンに備える


//マスがクリックされた時の処理
function player() {
  for (let i = 0; i < field.length; i++) {
      field[i].onclick = () => {
          if (board[i] == undefined) {
              field[i].textContent = "○";
              board[i] = 1;
              turn_action();
              if (winflag) {
                  com();
              }
          }
      }
  }
}

//コンピュータ側の応手
function com() {
  game.classList.add('pointer-none');
  //コンピューターが後手の場合の一手目
  if (board[4] == 1 && count == 1) {
      drawingpiece(0);
      return;
  } else if (count == 1) {
      drawingpiece(4)
      return;
  }
  //2手目以降
  //勝利するために最善の手を見つけ、それを実行するための処理を実行
  if (count > 2) {
      for (let j = 2; j > 0; j--) {
          for (let i = 0; i < win_patterns.length; i++) {
              let patterns = win_patterns[i];
              let square1 = (board[patterns[0]]);
              let square2 = (board[patterns[1]]);
              let square3 = (board[patterns[2]]);

              let x = square1 == undefined && square2 == j && square3 == j
              let y = square1 == j && square2 == undefined && square3 == j
              let z = square1 == j && square2 == j && square3 == undefined

              if (x) {
                  drawingpiece(patterns[0]);
                  return;
              }
              else if (y) {
                  drawingpiece(patterns[1]);
                  return;
              }
              else if (z) {
                  drawingpiece(patterns[2]);
                  return;
              }
          }
      }
  }

  //コンピューターの手を打つためのロジック
  //プレイヤーの手番でない場合、フィールドの空いている場所を探し、適切な場所を見つけたらdrawingpiece関数を呼び出してコンピューターの手を表示
  //drawingpiece関数は、setTimeout関数を使用して、1秒後にAIの手を表示し、field配列とboard配列を更新
  //最後に、再びプレイヤーにターンを渡す
  if (!count % 2 == 0) {
      let flag = true;
      while (flag) {
          let random = Math.floor(Math.random() * board.length);
          if (board[random] == undefined) {
              drawingpiece(random);
              flag = false;
          }
      }
  }
  function drawingpiece(place) {
      setTimeout(function () {
          field[place].textContent = "×";
          board[place] = 2;
          game.classList.remove('pointer-none');
          turn_action();

      }, 1000);
  }
}

//三つ揃ったか判定
function Judgment() {

  for (let i = 0; i < win_patterns.length; i++) {
      let patterns = win_patterns[i];
      let square1 = (board[patterns[0]]);
      let square2 = (board[patterns[1]]);
      let square3 = (board[patterns[2]]);
      completed = square1 && square1 == square2 && square2 == square3 && square3 == square1;
      if (completed) {
          if (count % 2 == 0) {
              judgtextcreate(0);
              return;
          } else {
              judgtextcreate(1);
              return;
          }
      }
  }
  if (board.includes(undefined) == false && winflag) {
      judgtextcreate(2)
      return;
  }

  function judgtextcreate(result) {
      let judgtext = ["あなたの勝ちです", "コンピューターの勝ちです", "引き分けです"];
      judgdisplay.textContent = judgtext[result];
      changescene(scenetop, sceneend);
      scecedisplay.classList.remove("is-visible");
      scecedisplay.classList.add("is-hidden");
      start3.textContent = "もう一度対戦する";
      start3.onclick = () => { document.location.reload() };
      start4.textContent = "TOPへ戻る";
      start4.onclick = () => { document.location.reload() };
      game.classList.add('pointer-none');
      winflag = false;
      return;
  }
}