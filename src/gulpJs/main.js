var Carousel = (function () {
    var liStyle = {
        width: "10px",
        height: "10px",
        borderRadius: "20px",
        backgroundColor: "#C9CED2",
        float: "left",
        lineHeight: "20px",
        textAlign: "center",
        marginLeft: "20px",
        color: "white"
    };
    var ulStyle = {
        margin: 0,
        padding: 0,
        listStyle: "none",
        position: "absolute",
        bottom: "20px"
    };
    var imgConStyle = {
        position: "absolute",
        left: "0px"
    };
    var maskDivStyle = {

        overflow: "hidden",
        position: "relative",
        margin: "auto",
        backgroundColor: "antiquewhite"
    };

    function Carousel(parent, list, bnList) {
        this.initCarousel(parent, bnList);
        this.source = list;

    }
    Carousel.prototype = {
        carouselView: null,
        imageList: [],
        _width: 0,
        _height: 0,
        _source: [],
        position: 0,
        direction: "",
        bool: false,
        autoBool: false,
        speed: 100,
        preDot: null,
        time: 200,
        set source(value) {
            if (!value) return;
            if (!Array.isArray(value)) return;
            if (value.length === 0) return;
            this.width = 0;
            this.height = 0;

            if (this.imageList.length > 0) {
                this.imageList[this.imageList.length - 1].removeEventListener("load", this.loadImageHandler);
            }
            this.imageList.length = 0;
            this._source = value;
            this.reloadImg(value);
        },
        get source() {
            return this._source;
        },
        set width(value) {
            this._width = value;
            if (this.imageList.length === 0) return;
            this.carouselView.style.width = value + "px";
            var ul = this.carouselView.lastElementChild;
            ul.style.left = (value - ul.offsetWidth) / 2 + "px";
        },
        get width() {
            return this._width;
        },
        set height(value) {
            this._height = value;
            if (this.imageList.length === 0) return;
            this.carouselView.style.height = value + "px";
            this.carouselView.firstElementChild.style.height = value + "px";
            this.carouselView.children[1].style.top = this.carouselView.children[2].style.top = (this.height - this.carouselView.children[1].offsetHeight) / 2 + "px";
        },
        get height() {
            return this._height;
        },
        reloadImg: function (list) {
            var img = new Image();
            img.addEventListener("load", this.loadImageHandler);
            img.list = list;
            img.self = this;
            img.num = 0;
            img.imgList = [];
            img.src = list[img.num];
        },
        loadImageHandler: function (e) {
            this.imgList.push(this.cloneNode(false));
            this.num++;
            if (this.num > this.list.length - 1) {
                this.self.imgLoadFinish(this.imgList);
                return;
            }
            this.src = this.list[this.num];
        },
        imgLoadFinish: function (imgList) {
            this.imageList = imgList;
            var imgCon = this.carouselView.firstElementChild;
            var ul = this.carouselView.lastElementChild;
            this.clearCon(imgCon);
            this.clearCon(ul);
            imgCon.appendChild(this.imageList[0]);
            for (var i = 0; i < this.imageList.length; i++) {
                var li = document.createElement("li");
                Object.assign(li.style, liStyle);
                ul.appendChild(li);
            }
            if (this.width === 0) {
                this.width = this.imageList[0].width;
            } else {
                this.carouselView.style.width = this.width + "px";
                this.setWidth(imgCon, this.width);
            }
            if (this.height === 0) {
                this.height = this.imageList[0].height;
            } else {
                this.carouselView.style.height = this.height + "px";
                this.carouselView.firstElementChild.style.height = this.height + "px";
                this.setWidth(imgCon, 0, this.height);
            }
            this.changeDot();
            ul.style.left = (this.width - ul.offsetWidth) / 2 + "px";
        },
        setWidth: function (con, w, h) {
            for (var i = 0; i < con.children.length; i++) {
                if (w) {
                    con.children[i].style.width = w + "px";
                }
                if (h) {
                    con.children[i].style.height = h + "px";
                }
            }
        },
        clearCon: function (con) {
            var len = con.children.length;
            for (var i = 0; i < len; i++) {
                con.firstElementChild.remove();
            }
        },
        initCarousel: function (parent, bnList) {
            if (!this.carouselView) {
                this.carouselView = document.createElement("div");
                Object.assign(this.carouselView.style, maskDivStyle);
                this.carouselView.self = this;
                this.carouselView.addEventListener("mouseenter", this.mouseCarouselHandler);
                this.carouselView.addEventListener("mouseleave", this.mouseCarouselHandler);
                var imgCon = document.createElement("div");
                this.carouselView.appendChild(imgCon);
                Object.assign(imgCon.style, imgConStyle);
                for (var i = 0; i < bnList.length; i++) {
                    var img = new Image();
                    img.self = this;
                    img.addEventListener("load", this.bnLoadHandler);
                    img.src = bnList[i];
                    var obj = {
                        height: 0,
                        position: "absolute"
                    };
                    if (i === 0) {
                        obj.left = "10px";
                    } else {
                        obj.right = "10px";
                    }
                    Object.assign(img.style, obj);
                    img.addEventListener("click", this.bnClickHandler);
                    this.carouselView.appendChild(img);
                }

                var ul = document.createElement("ul");
                Object.assign(ul.style, ulStyle);
                this.carouselView.appendChild(ul);
                ul.self = this;
                ul.addEventListener("click", this.dotClickHandler);
                parent.appendChild(this.carouselView)
            }
            return this.carouselView;
        },
        bnLoadHandler: function (e) {
            this.style.top = (this.self.height - this.offsetHeight) / 2 + "px";
        },
        bnClickHandler: function (e) {
            if (this.self.bool) return;
            if (this.offsetLeft === 10) {
                this.self.direction = "right";
                this.self.position--;
                if (this.self.position < 0) {
                    this.self.position = this.self.imageList.length - 1;
                }
            } else {
                this.self.direction = "left";
                this.self.position++;
                if (this.self.position > this.self.imageList.length - 1) {
                    this.self.position = 0;
                }
            }
            this.self.createNextImg();
        },
        dotClickHandler: function (e) {
            if (this.self.bool) return;
            if (e.target instanceof HTMLUListElement) return;
            var arr = Array.from(this.children);
            var index = arr.indexOf(e.target);
            if (index === this.self.position) return;
            if (index > this.self.position) {
                this.self.direction = "left";
            } else {
                this.self.direction = "right";
            }
            this.self.position = index;
            this.self.createNextImg();
        },
        createNextImg: function () {
            if (this.direction !== "left" && this.direction !== "right") return;
            var imgCon = this.carouselView.firstElementChild;
            if (this.direction === "left") {
                imgCon.appendChild(this.imageList[this.position]);
                imgCon.style.width = this.width * 2 + "px";
                imgCon.style.left = "0px";
            } else {
                imgCon.insertBefore(this.imageList[this.position], imgCon.firstElementChild);
                imgCon.style.width = this.width * 2 + "px";
                imgCon.style.left = -this.width + "px";
            }
            if (this.width !== 0) {
                this.imageList[this.position].style.width = this.width + "px";
            }
            if (this.height !== 0) {
                this.imageList[this.position].style.height = this.height + "px";
            }
            this.changeDot();
            this.bool = true;
        },
        update: function () {
            this.autoPlay();
            this.imgCarousel();
        },
        autoPlay: function () {
            if (!this.autoBool) return;
            this.time--;
            if (this.time > 0) return;
            this.time = 200;
            this.direction = "left";
            this.position++;
            if (this.position > this.imageList.length - 1) {
                this.position = 0;
            }
            this.createNextImg();
        },
        imgCarousel: function () {
            if (!this.bool) return;
            if (this.direction !== "left" && this.direction !== "right") {
                this.bool = false;
                return;
            }
            var imgCon = this.carouselView.firstElementChild;
            if (this.direction === "left") {
                imgCon.style.left = imgCon.offsetLeft - this.speed + "px";
                if (imgCon.offsetLeft <= -this.width) {
                    imgCon.firstElementChild.remove();
                    imgCon.style.left = "0px";
                    this.bool = false;
                    this.direction = "";
                }
            } else {
                imgCon.style.left = imgCon.offsetLeft + this.speed + "px";
                if (imgCon.offsetLeft >= 0) {
                    imgCon.style.left = "0px";
                    imgCon.lastElementChild.remove();
                    this.bool = false;
                    this.direction = "";
                }
            }
        },
        changeDot: function () {
            if (this.preDot) {
                this.preDot.style.backgroundColor = "#C9CED2";
            }
            this.preDot = this.carouselView.lastElementChild.children[this.position];
            this.preDot.style.backgroundColor = "#FA6500";
        },
        mouseCarouselHandler: function (e) {
            if (e.type === "mouseenter") {
                this.self.autoBool = false;
            } else if (e.type === "mouseleave") {
                this.self.autoBool = true;
            }
        }
    };
    Carousel.prototype.constructor = Carousel;
    return Carousel;
})();

// 获取JSON文件
var allShopList;
var xhr1 = new XMLHttpRequest();
xhr1.addEventListener("load", loadShopList);
xhr1.open("get", "json/shopList.json");
xhr1.send();
var itemList;

function loadShopList(e) {
    allShopList = JSON.parse(this.response);
    var hotItem = document.getElementById("hot_list");
    creatHotLi(allShopList[0], hotItem);
    creatShopListAll(shop_list1, allShopList[1]);
    creatShopListAll(shop_list2, allShopList[2]);
    creatShopListAll(shop_list3, allShopList[3]);
    creatShopListAll(shop_list4, allShopList[4]);
    creatShopListAll(shop_list5, allShopList[5]);
    creatShopListAll(shop_list6, allShopList[6]);
    creatShopListAll(shop_list7, allShopList[7]);
    creatShopListAll(shop_list8, allShopList[8]);
    itemList = allShopList[9];
    init();
    typeList(allShopList);
}
var arr = [
    "img/main/banner1.jpg",
    "img/main/banner2.jpg",
    "img/main/banner3.jpg",
    "img/main/banner4.jpg",
    "img/main/banner5.jpg",
    "img/main/banner6.jpg",
    "img/main/banner7.jpg"
];
arr1 = ["img/main/jiantou.png"];
var carousel = new Carousel(banner, arr, arr1);
carousel.width = banner.offsetWidth;
carousel.height = 420;
animate();

function animate() {
    requestAnimationFrame(animate);
    carousel.update();
}
var box, pic_box, left, right, dot_box, liList;
var count = 0;
var num = 160;
var direct;
var bool = false;
var autoPlay = true;
var picurl = ["img/main/banner_shop1.jpg", "img/main/banner_shop2.jpg", "img/main/banner_shop3.jpg", "img/main/banner_shop4.jpg"];
var piclist = [];
var imgList = [];
var WIDTH = 360;
var HEIGHT = 404;


function init() {
    box = document.getElementById("shopScroll");
    pic_box = document.getElementById("shopScroll_pic");
    dot_box = document.getElementById("shopScroll_dot");
    box.addEventListener("mouseenter", isAuto);
    box.addEventListener("mouseleave", isAuto);
    creatImg();
    animation();
    creatDot();
}

function creatImg() {
    for (var j = 0; j < picurl.length; j++) {
        piclist[j] = document.createElement("a");
        piclist[j].href = "html/info.html?" + itemList[j].href;
        // console.log(itemList[j].href);
        piclist[j].style.display = "inline-block";
        imgList[j] = new Image();
        imgList[j].src = picurl[j];
        piclist[j].appendChild(imgList[j]);
        piclist[j].style.width = WIDTH + "px";
        piclist[j].style.height = HEIGHT + "px";
        for (var str in itemList[j]) {
            if (str === "href") continue;
            var div = document.createElement("div");
            div.textContent = itemList[j][str];
            piclist[j].appendChild(div);
        }
    }
    pic_box.appendChild(piclist[0]);

}

function nextPic() {
    pic_box.style.width = WIDTH * 2 + "px";
    if (direct === "right") {
        pic_box.appendChild(piclist[count]);
        pic_box.style.left = 0;
    } else if (direct === "left") {
        pic_box.insertBefore(piclist[count], pic_box.firstElementChild);
        pic_box.style.left = -WIDTH + "px";
    }
    bool = true;
    liChange();
}

function animation() {
    requestAnimationFrame(animation);
    picMove();
    autoScroll();
}

function creatDot() {
    for (var i = 0; i < picurl.length; i++) {
        var li = document.createElement("li");
        dot_box.appendChild(li);
        li.style.background = "#CCCCCC";
    }
    dot_box.firstElementChild.style.background = "#FD823E";
    dot_box.addEventListener("click", changeDot);
    liChange();
}

function changeDot(e) {
    if (bool) return;
    var list = Array.from(dot_box.children);
    var index = list.indexOf(e.target);
    if (index === count) {
        return;
    }
    if (index > count) {
        direct = "right";
    } else if (index < count) {
        direct = "left";
    }
    count = index;
    nextPic();
}

function liChange() {
    if (liList) {
        liList.style.backgroundColor = "#CCCCCC";
    }
    liList = dot_box.children[count];
    liList.style.background = "#FD823E";
}

function picMove() {
    if (!bool) return;
    if (direct === "left") {
        pic_box.style.left = pic_box.offsetLeft + 10 + "px";
        if (pic_box.offsetLeft > 0) {
            bool = false;
            pic_box.lastElementChild.remove();
        }
    } else if (direct === "right") {
        pic_box.style.left = pic_box.offsetLeft - 10 + "px";
        if (pic_box.offsetLeft < -WIDTH) {
            bool = false;
            pic_box.firstElementChild.remove();
            pic_box.style.left = 0;
        }
    }
}

function autoScroll() {
    if (!autoPlay) return;
    num--;
    if (num === 0) {
        num = 160;
        direct = "right";
        count++;
        if (count === picurl.length) {
            count = 0;
        }
        nextPic();
    }

}

function isAuto(e) {
    if (e.type === "mouseenter") {
        autoPlay = false;
    } else if (e.type = "mouseleave") {
        autoPlay = true;
    }
}

function creatHotLi(list, parent) {
    for (var i = 0; i < list.length; i++) {
        var li = document.createElement("li");
        var box = document.createElement("a");
        box.href = "html/info.html?" + list[i].href;
        box.style.display = "block";
        for (var str in list[i]) {
            if (str === "img") {
                var img = new Image();
                img.src = list[i][str];
                box.appendChild(img);
            } else if (str === "title" || str === "price") {
                var div = document.createElement("div");
                div.textContent = list[i][str];
                box.appendChild(div);
            }
        }
        li.appendChild(box);
        parent.appendChild(li);
    }
}

function creatShopListAll(parent, list) {
    var leng = parent.children.length;
    for (var i = 0; i < leng; i++) {
        parent.firstElementChild.remove();
    }
    var titleBox = document.createElement("div");
    var h2 = document.createElement("h2");
    h2.textContent = list[0].title;
    titleBox.appendChild(h2);
    parent.appendChild(titleBox);
    for (var item in list[1]) {
        if (!list[1][item]) continue;
        var span = document.createElement("span");
        span.textContent = list[1][item];
        h2.appendChild(span);
    }
    for (var i = 2; i < list.length; i++) {
        var li = document.createElement("li");
        var box = document.createElement("a");
        box.href = "html/info.html?" + list[i].href;
        box.style.display = "block";
        for (var str in list[i]) {
            if (str === "img") {
                var img = new Image();
                img.src = list[i][str];
                box.appendChild(img);
            } else if (str === "title" || str === "price") {
                var div = document.createElement("div");
                div.textContent = list[i][str];
                box.appendChild(div);
            }
        }

        li.appendChild(box);
        parent.appendChild(li);
    }
}

function typeList(list) {
    var ul = document.createElement("ul");
    var div = document.createElement("div");
    for (var i = 2; i < list.length - 1; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "html/oneType.html?" + i;
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
        liItem.href = "html/info.html?" + this.list[j].href;
        for (var item in this.list[j]) {
            if (item === "img") {
                var img = new Image();
                img.src = this.list[j][item];
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

var xhr = new XMLHttpRequest();
var arr;
var areaContent = {
    area: ""
};
xhr.addEventListener("load", loadHandler);
xhr.open("get", "json/city.json");
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
    console.log(this.response);
    areaBox.textContent = this.response;
}