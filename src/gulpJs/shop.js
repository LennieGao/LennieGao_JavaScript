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
        loginTo.href = "login.html";
        regTo.removeEventListener("click", exitLogin);
        regTo.textContent = "注册";
        regTo.href = "regist.html";
    }
    // console.log(obj);
}

function exitLogin(e) {
    obj.exit = true;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", userLogin);
    xhr.open("POST", "http://localhost:1026");
    xhr.send(JSON.stringify(obj));
}
var xhr = new XMLHttpRequest();
var arr;
var areaContent = {
    area: ""
};
xhr.addEventListener("load", loadHandler);
xhr.open("get", "../json/city.json");
xhr.send();

function loadHandler(e) {
    arr = JSON.parse(this.response);
    areaBox.addEventListener("mouseenter", findP);
    place.addEventListener("mouseleave", clearAll);
    loadArea(areaContent);
}

function findP(e) {
    place.style.display = "block";
    var len = place.children.length;
    for (var i = 0; i < len; i++) {
        place.firstElementChild.remove();
    }
    for (var j = 0; j < arr.length; j++) {
        var box = document.createElement("div");
        box.textContent = arr[j].name;
        box.data = arr[j];
        box.addEventListener("click", findCity);
        place.appendChild(box);
    }
}

function findCity(e) {
    var len = place.children.length;
    for (var i = 0; i < len; i++) {
        place.firstElementChild.remove();
    }
    var cityList = this.data.city;
    for (var j = 0; j < cityList.length; j++) {
        var box = document.createElement("div");
        box.textContent = cityList[j].name;
        box.data = cityList[j];
        box.father = this;
        box.addEventListener("click", findArea);
        place.appendChild(box);
    }
}

function findArea(e) {
    var len = place.children.length;
    for (var i = 0; i < len; i++) {
        place.firstElementChild.remove();
    }
    var areaList = this.data.area;
    for (var j = 0; j < areaList.length; j++) {
        var box = document.createElement("div");
        box.textContent = areaList[j];
        box.father = this;
        box.addEventListener("click", addAddress);
        place.appendChild(box);
    }
}

function addAddress(e) {
    areaContent.area = this.father.father.textContent + "," + this.father.textContent + "," + this.textContent;
    loadArea(areaContent);
    var len = place.children.length;
    for (var i = 0; i < len; i++) {
        place.firstElementChild.remove();
    }
}

function clearAll(e) {
    place.style.display = "none";
}

function loadArea(obj) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", startArea);
    xhr.open("POST", "http://localhost:1027");
    xhr.send(JSON.stringify(obj));
}

function startArea(e) {
    // console.log(this.response);
    areaBox.textContent = this.response;
}
getData();

function getData() {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", createTab);
    xhr.open("POST", "http://localhost:1029");
    xhr.send(JSON.stringify({}));
}

function createTab() {
    var tabData = JSON.parse(this.response);
    console.log(tabData);
    createTableAll(shopTab, tabData);
}

function createTableAll(parent, list) {
    var len = parent.children.length;
    for (var j = 0; j < len-1; j++) {
        parent.lastElementChild.remove();
    }
    console.log(parent.children.length);
    for (var i = 0; i < list.length; i++) {
        var tr = document.createElement("tr");
        // console.log(list[i]);
        for (var str in list[i]) {
            var td = document.createElement("td");
            if (str === "select") {
                var select = document.createElement("input");
                select.type = "checkbox";
                select.checked = list[i][str];
                td.appendChild(select);
            } else if (str === "img") {
                var info = document.createElement("img");
                var title = document.createElement("span");
                info.src = "../" + list[i].img;
                title.textContent = list[i].title;
                td.appendChild(info);
                td.appendChild(title);
            } else if (str === "title") {
                continue;
            } else if (str === "idNum") {
                var ID = document.createElement("span");
                ID.textContent = list[i].idNum;
                td.appendChild(ID);
            } else if (str === "price") {
                var price = document.createElement("span");
                price.textContent = list[i].price;
                td.appendChild(price);
            } else if (str === "num") {
                td.appendChild(addToShop(list[i]));
            }else if(str === "sum"){
                var sum = document.createElement("span");
                sum.textContent = list[i].price*list[i].num;
                td.appendChild(sum);
            }else if(str==="del"){
                var del = document.createElement("button");
                del.textContent = "删除";
                del.bool = list[i].del;
				del.onclick=function(e){
					var e=e||window.event;
					var target=e.target||e.srcElement;
					 target.parentNode.parentNode.remove();
				}
                td.appendChild(del);
            }
            tr.appendChild(td);
            // td.textContent = list[i][str];		
        }
        parent.appendChild(tr);
    }
}


function addToShop(list) {
    console.log(list);
    var addBox = document.createElement("div");
    addBox.className = "shopBox";
    addBox.data = list;
    var left = document.createElement("button");
    var text = document.createElement("input");
    var right = document.createElement("button");
    text.value = list.num;
    left.addEventListener("click", sendData);
    text.addEventListener("blur", sendData);
    right.addEventListener("click", sendData);
    left.textContent = "-";
    right.textContent = "+";
    addBox.appendChild(left);
    addBox.appendChild(text);
    addBox.appendChild(right);
    return addBox;
}

function sendData(e) {
    if (this.textContent === "+") {
        this.parentNode.data.num++;
        if (this.parentNode.data.num > 99) {
            this.parentNode.data.num = 99;
        }
    } else if (this.textContent === "-") {
        this.parentNode.data.num--;
        if (this.parentNode.data.num < 1) {
            this.parentNode.data.num = 1;
        }
    }
	 else {
        if (isNaN(this.value)) {
            this.value = 1;
            return;
        }
        this.parentNode.data.num = this.value;
        if (this.value < 1) {
            this.parentNode.data.num = 1;
        } else if (this.value > 99) {
            this.parentNode.data.num = 99;
        }
    }
    this.parentNode.data.sum = this.parentNode.data.num * this.parentNode.data.price;
    sendedData(this.parentNode.data);
}

function sendedData(data) {
    var xhr = new XMLHttpRequest();
    xhr.self = this;
    xhr.addEventListener("load", sendAllData);
    xhr.open("POST", "http://localhost:1028");
    xhr.send(JSON.stringify(data));
}

function sendAllData(e) {
    console.log(JSON.parse(this.response));
    getData();
}