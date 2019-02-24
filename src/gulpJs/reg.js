var phoneNumber = document.getElementById("phoneNum");
var psd = document.getElementById("psd");
var repsd = document.getElementById("repsd");
var isTrue = [0, 0, 0];
var reg1;
var reg2;
var spans;
init();

function init() {
  reg1 = /^1[0-9]{10}$/;
  reg2 = /^[\w]{8,18}$/;
  spans = document.querySelectorAll(".spans");
  phoneNumber.addEventListener("blur", isNum);
  psd.addEventListener("blur", isNum);
  repsd.addEventListener("blur", isNum);
  send.addEventListener("click", Ajax);
  //   console.log(phoneNumber, psd, repsd);
}

function isNum(e) {
  if (this.id === "phoneNum") {
    if (this.value.match(reg1)) {
      isTrue[0] = 1;
      spans[0].style.display = "none";
    } else {
      isTrue[0] = 0;
      spans[0].style.display = "inline";
    }
  } else if (this.id === "psd") {
    if (this.value.match(reg2)) {
      isTrue[1] = 1;
      spans[1].style.display = "none";
    } else {
      isTrue[1] = 0;
      spans[1].style.display = "inline";
    }
  } else if (this.id === "repsd") {
    if (this.value === psd.value) {
      isTrue[2] = 1;
      spans[2].style.display = "none";
    } else {
      isTrue[2] = 0;
      spans[2].style.display = "inline";
    }
  }
}

function Ajax() {
  if (isTrue[0] * isTrue[1] * isTrue[2] === 0) {
    alert("您输入的有误");
    return;
  }
  var obj = {
    hasUser: false
  };
  obj.phoneNumber = phoneNumber.value;
  obj.psd = psd.value;
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", loadHandler);
  xhr.open("POST", "http://localhost:1024");
  xhr.send(JSON.stringify(obj));
}

function loadHandler(e) {
  if (JSON.parse(this.response).hasUser) {
    alert("手机已被注册");
    location.href = "regist.html";
  } else {
    alert("注册成功");
    location.href = "login.html";
  }
}

var obj = {};
logined(obj);

function logined(obj) {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", userLogin);
  xhr.open("POST", "http://localhost:1026");
  xhr.send(JSON.stringify(obj));
}

function userLogin(e) {
  var obj = JSON.parse(this.response);
  if (obj.isLogin) {
    loginTo.textContent = obj.userObj;
    loginTo.href = "";
    regTo.textContent = "退出";
    regTo.href = "";
    regTo.addEventListener("click", exitLogin);
  } else {
    loginTo.textContent = "登录";
    loginTo.href = "html/login.html";
    regTo.removeEventListener("click", exitLogin);
    regTo.textContent = "注册";
    regTo.href = "html/regist.html";
  }
  console.log(obj);
}

function exitLogin(e) {
  obj.exit = true;
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", userLogin);
  xhr.open("POST", "http://localhost:1026");
  xhr.send(JSON.stringify(obj));
}