var _ng = _ng || {};

_ng.CommonPopup = function() {
    this.init();
}

_ng.CommonPopup.prototype.constructor = _ng.CommonPopup;
var commonPopup = _ng.CommonPopup.prototype;


var INTER_MEDIUM_PATH = `./${appPath}games/common/dist/fonts/Inter-Medium.ttf`;
var INTER_BLACK_PATH = `./${appPath}games/common/dist/fonts/Inter-Black.ttf`;

var style_elem = document.createElement("style");

var template = `
<div class="wrapper">
    <div class="wrapper_popup">
        <div class="popup">
            <div class="popup_title">
                <h1 class="title" id="title"></h1>
            </div>
            <div class="popup_content">
                <div class ="content" id="content"></div>
            </div>
            <div class="popup_btn" id="btns">
                <div class="btn_1-container">
                    <button class="btn" id="btn-1"></button>
                </div>
                <div class="btn_3-container">
                    <button class="btn" id="btn-3"></button>
                </div>
                <div class="btn_2-container">
                    <button class="btn" id="btn-2"></button>
                </div>
            </div>
        </div>
    </div>
</div>
`;

style_elem.innerHTML = `
@font-face {
    font-family: 'Inter Black';
    src: url('${INTER_BLACK_PATH}') format('truetype');
}

@font-face {
    font-family: 'Inter Medium';
    src: url('${INTER_MEDIUM_PATH}') format('truetype');
}

@font-face {
    font-family: 'MontserratWght';
    src: url('/fonts/Montserrat-VariableFont_wght.ttf') format('truetype');
    font-display: swap;
}

html, body {
    touch-action: manipulation;
    -ms-touch-action: manipulation;
}

.wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    z-index: 5;
    touch-action: manipulation;
    -ms-touch-action: manipulation;
}

.wrapper_popup{
    display: block;
    padding: 10px 10px 10px 10px;
    min-width: 340px;
}

.popup {
    max-width: 589px;
    min-width: 346px;
    padding: 30px 10px 30px 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-align: center;
    align-items: center;
    border-radius: 30px;
    backdrop-filter: blur(5px);
    background-color: rgba(22, 22, 22, 0.8);
    border: 3.71px solid rgba(115, 115, 115, 1);
    transform: scale(1.25);
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    touch-action: manipulation;
    -ms-touch-action: manipulation;
}

.popup_title {
    line-height: 2rem;
    display: flex;
    justify-content: center;
    max-width: 80%;
}

.title {
    font-size: 30px;
    color: #ffffff;
    text-align: center;
    box-sizing: border-box;
    font-family: Inter Black;
}

.popup_content  {
    line-height: 18px;
    display: flex;
    justify-content: center;
    max-width: 80%;
    box-sizing: border-box;
}

.content{
    margin-bottom: 2rem;
    line-height: 18px;
    width: 100%;
    box-sizing: border-box;
    font-family: Inter Medium;
    font-size: 20px;
    color: #ffffff;
    font-weight: 500;
}

.popup_btn{
    display: flex;
    width: 100%;
    justify-content: space-around;
    align-items: center;

}

#btn-3{
    // width: 110px;
    // height: 110px;
    // border-style: solid;
    // border-width: 6px;
    // border-color: rgb(0, 0, 0, 0.35);
    // border-radius: 50%;
    // background-color: #ffffff;
    // color: #002846;
    // font-family: Inter Black;
}

.btn_3-container {
    margin: 0 10px;
}

.btn {
    cursor: pointer;
    min-height: 57px;
    word-break: keep-all;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 67.63px;
    border-width: 2.76px;
    opacity: 1;
    padding: 16px 40px;
    gap: 10px;
    background-color: rgba(255, 208, 0, 1);
    color: rgba(30, 30, 30, 1);
    border: 2.76px solid rgba(79, 79, 79, 1);
    font-family: sans-serif;
    font-weight: 700;
    font-size: 22px;
    line-height: 100%;
    letter-spacing: 2px;
    text-shadow: 0px 3.47px 6.94px rgba(0, 0, 0, 0.25);
}

h1{
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
    unicode-bidi: isolate;
}

.btn:hover  {
    border-color: rgb(255, 255, 255);
    // background-color: rgb(0, 145, 255);
    // color: #ffffff;
}

#btn-3:hover{
    border-color: rgb(255, 255, 255);
    // background-color: rgb(0, 145, 255);
    // color: #ffffff;
}

@media screen and (max-width: 756px) {
    .popup_btn{
        flex-wrap: wrap;
        width: 92%;
    }

    .btn_1-container{
      order: 1;
    }

    .btn_2-container{
        order: 2;
    }

    .btn_3-container{
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 0 auto;
        order: 3;
    }
    .popup {
        transform: scale(1);
    }
}

@media screen and (orientation: landscape) and (max-width: 1024px) and (max-height: 500px) {
    .popup {
        transform: scale(0.8);
    }
}
`;

commonPopup.init = function() {
    // Check if popup already exists to avoid duplicate DOM elements
  const main = document.createElement('div');
main.innerHTML = template;
document.body.appendChild(main);
const div = document.createElement('div');
div.innerHTML = '.';
div.style.fontFamily = 'Inter Medium';
div.style.position = 'absolute';
div.style.opacity = '0';
div.style.margin = '0';
div.style.padding = '0';
document.body.appendChild(div);
const div2 = document.createElement('div');
div2.innerHTML = '.';
div2.style.fontFamily = 'Inter Black';
div2.style.position = 'absolute';
div2.style.opacity = '0';
div2.style.margin = '0';
div2.style.padding = '0';
document.body.appendChild(div2);
document.head.appendChild(style_elem);
this.left = document.getElementById('btn-1')
this.right = document.getElementById('btn-2')
this.middle = document.getElementById('btn-3')
this.title = document.getElementById('title')
this.content = document.getElementById('content')
this.popup = document.getElementsByClassName('wrapper')[0] 
    this.hide();
}


commonPopup.show = function(info, buttons) {
  this.popup.style.display = 'flex';
  this.title.innerHTML = info.title || '';
  this.content.innerHTML = info.message || '';
  if (buttons.middle) {
    if (buttons.left && buttons.right) {
      this.right.style.display = 'flex';
      this.left.style.display = 'flex';
      this.middle.style.display = 'flex';
      this.right.innerHTML = buttons.left.label;
      this.right.onpointerdown = buttons.left.callback;
      this.left.innerHTML = buttons.right.label;
      this.left.onpointerdown = buttons.right.callback;
      this.middle.innerHTML = buttons.middle.label;
      this.middle.onpointerdown = buttons.middle.callback;
    } else {
      this.right.style.display = 'none';
      this.left.style.display = 'none';
      this.middle.style.display = 'flex';
      this.middle.innerHTML = buttons.middle.label;
      this.middle.onpointerdown = buttons.middle.callback;
    }
  } else {
    this.middle.style.display = 'none';
    if (buttons.left) {
      this.left.style.display = 'flex';
      this.left.innerHTML = buttons.left.label;
      this.left.onpointerdown = buttons.left.callback;
    }
    if (buttons.right) {
      this.right.style.display = 'flex';
      this.right.innerHTML = buttons.right.label;
      this.right.onpointerdown = buttons.right.callback;
    }
  }
}

/** Hide the popup */
commonPopup.hide = function() {
   
        this.popup.style.display = 'none';
}
