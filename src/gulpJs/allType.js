// 获取JSON文件
var allShopList;
var xhr1 = new XMLHttpRequest();
xhr1.addEventListener("load", loadShopList);
xhr1.open("get", "../json/shopList.json");
xhr1.send();

function loadShopList(e) {
    allShopList = JSON.parse(this.response);
    typeList(allShopList);
    findAll(allShopList, typeAll);
}


function typeList(list) {
    var ul = document.createElement("ul");
    var div = document.createElement("div");
    for (var i = 2; i < list.length - 1; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "oneType.html?" + i;
        a.textContent = list[i][0]["title"];
        li.list = list[i];
        li.div = div;
        li.addEventListener("mouseover", screenList);
        li.appendChild(a);
        ul.appendChild(li);
    }
    ul.div = div;
    ul.addEventListener("mouseleave", hideList);
    ul.appendChild(div);
    allType.appendChild(ul);
}

function screenList(e) {
    var len = this.div.children.length;
    for (var i = 0; i < len; i++) {
        this.div.firstElementChild.remove();
    }
    this.div.style.display = "block";
    var titleShop = document.createElement("div");
    var h3 = document.createElement("h3");
    h3.textContent = this.textContent;
    var ul = document.createElement("ul");

    for (var str in this.list[1]) {
        var treelist = document.createElement("li");
        treelist.textContent = this.list[1][str];
        ul.appendChild(treelist);
    }
    var contentShop = document.createElement("div");
    var h2 = document.createElement("h2");
    h2.textContent = "相关热门";
    contentShop.appendChild(h2);
    for (var j = 3; j < this.list.length - 1; j++) {
        var liItem = document.createElement("a");
        liItem.href = "info.html?" + this.list[j].href;
        for (var item in this.list[j]) {
            if (item === "img") {
                var img = new Image();
                img.src = "../" + this.list[j][item];
                liItem.appendChild(img);
            } else if (item === "title") {
                var txt = document.createElement("p");
                txt.textContent = this.list[j][item];
                liItem.appendChild(txt);
            } else if (item === "price") {
                var p = document.createElement("span");
                p.textContent = "售价" + this.list[j][item];
                liItem.appendChild(p);
            }
        }
        contentShop.appendChild(liItem);
    }
    titleShop.appendChild(h3);
    titleShop.appendChild(ul);
    this.div.appendChild(titleShop);
    this.div.appendChild(contentShop);
}

function hideList(e) {
    this.div.style.display = "none";
}

function findAll(list, parent) {
    console.log(list);
    var ul = document.createElement("ul");
    for (var i = 2; i < list.length - 1; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.textContent = list[i][0].title;
        a.href = "oneType.html?" + i;
        li.appendChild(a);
        for (var j = 0; j < list[i].length; j++) {
            for (var str in list[i][j]) {
                if (str === "title1" || str === "title2" || str === "title3") {
                    var toWhere = document.createElement("a");
                    toWhere.textContent = list[i][j][str];
                    toWhere.href = "oneType.html?" + i + "&" + j;
                    li.appendChild(toWhere);
                }
            }
        }
        ul.appendChild(li);
    }
    parent.appendChild(ul);
}


obj = {};
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
}

function exitLogin(e) {
    obj.exit = true;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", userLogin);
    xhr.open("POST", "http://localhost:1026");
    xhr.send(JSON.stringify(obj));
}