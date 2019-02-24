var phoneNumber = document.getElementById("phoneNum");
var psd = document.getElementById("psd");
send.addEventListener("click", Ajax);

function Ajax() {
    if (!phoneNumber.value || !psd.value) {
        alert("您输入的为空");
        return;
    }
    var obj = {};
    obj.phoneNumber = phoneNumber.value;
    obj.psd = psd.value;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", loadHandler);
    xhr.open("POST", "http://localhost:1025");
    xhr.send(JSON.stringify(obj));
}

function loadHandler(e) {
    if (!JSON.parse(this.response).isUser) {
        alert("用户名或密码错误");
        location.href = "login.html";
    } else {
        alert("登录成功");
        var user = JSON.parse(this.response);
        location.href = "../index.html";
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