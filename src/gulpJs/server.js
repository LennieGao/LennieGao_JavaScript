var userList = [];
var isLogin = false;
var userObj = "";
var areaPlace = "";
var whereAera = {
    area: ""
};

// 注册
var reg = require("http");
var server = reg.createServer(function (req, res) {
    var data = "";
    req.on("data", function (d) {
        data += d;
    });
    req.on("end", function () {
        var obj = JSON.parse(data);
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].phoneNumber === obj.phoneNumber) {
                obj.hasUser = true;
            } else {
                obj.hasUser = false;
            }
        }


        if (obj.hasUser === true) {
            console.log(userList);
        } else {
            userList.push(obj);
            console.log(userList);
        }

        res.writeHead(200, {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*"
        });
        res.write(JSON.stringify(obj));
        res.end();
    });
});
server.listen(1024, "localhost", function () {
    console.log("注册服务开启，开始侦听");
});

// 登录
var login = require("http");
var server1 = login.createServer(function (req, res) {
    var data = "";
    req.on("data", function (d) {
        data += d;
    });
    req.on("end", function () {
        var obj = JSON.parse(data);
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].phoneNumber === obj.phoneNumber && userList[i].psd === obj.psd) {
                userObj = "";
                obj.isUser = true;
                isLogin = true;
                userObj = obj.phoneNumber;
                console.log(userObj);
            } else {
                userObj = "";
                obj.isUser = false;
                isLogin = false;
            }
        }
        res.writeHead(200, {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*"
        });
        res.write(JSON.stringify(obj));
        res.end();
    });
});
server1.listen(1025, "localhost", function () {
    console.log("登录服务开启，开始侦听");
});

// 是否登录
var logined = require("http");
var server2 = logined.createServer(function (req, res) {
    var data = "";
    req.on("data", function (d) {
        data += d;
    });
    req.on("end", function () {
        var obj = JSON.parse(data);
        console.log(obj);
        if (isLogin && !obj.exit) {
            obj.isLogin = true;
            obj.userObj = userObj;
        } else {
            isLogin = false;
            obj.isLogin = false;
            obj.userObj = "";
        }
        // console.log(obj);

        res.writeHead(200, {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*"
        });
        res.write(JSON.stringify(obj));
        res.end();
    });
});
server2.listen(1026, "localhost", function () {
    console.log("登录监听服务开启");
});


// 地址
var area = require("http");
var server3 = area.createServer(function (req, res) {
    var data = "";
    req.on("data", function (d) {
        data += d;
    });
    req.on("end", function () {
        var obj = JSON.parse(data);
        if (obj.area) {
            whereAera.area = obj.area;
            areaPlace = whereAera.area;
        } else {
            areaPlace = whereAera.area;
        }

        // console.log(areaPlace);
        res.writeHead(200, {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*"
        });
        res.write(areaPlace);
        res.end();
    });
});
server3.listen(1027, "localhost", function () {
    console.log("地区监听服务开启");
});



var shopData = [];
// 购物车
var shop = require("http");
var server4 = shop.createServer(function (req, res) {
    var data = "";
    req.on("data", function (d) {
        data += d;
    });
    req.on("end", function () {
        var obj = JSON.parse(data);
        if (shopData.length === 0) {
            shopData.push(obj);
        }
        var hasItem = false;
        var num=0;
        for (var i = 0; i < shopData.length; i++) {
            if (obj.idNum === shopData[i].idNum) {
                hasItem = true;
                num = i;
            } else {
                num = i;
            }
        }
        if (hasItem) {
            shopData[num].num = obj.num;
            shopData[num].sum = shopData[num].num * shopData[num].price;
        }else{
            shopData.push(obj);
        }
        console.log(shopData[num]);
        res.writeHead(200, {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*"
        });
        res.write(JSON.stringify(obj));
        res.end();
    });
});
server4.listen(1028, "localhost", function () {
    console.log("购物车服务开启");
});


// 购物车构成
var createshop = require("http");
var server5 = createshop.createServer(function (req, res) {
    var data = "";
    req.on("data", function (d) {
        data += d;
    });
    req.on("end", function () {
        var obj = JSON.parse(data);

        console.log(obj);
        res.writeHead(200, {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*"
        });
        res.write(JSON.stringify(shopData));
        res.end();
    });
});
server5.listen(1029, "localhost", function () {
    console.log("购物车创建服务开启");
});