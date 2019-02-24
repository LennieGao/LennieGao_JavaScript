        // 获取商品json文件
        var jsonList;
        var sameList = [];
        var isItem = {};
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", loadShopList);
        xhr.open("get", "../json/shopList.json");
        xhr.send();
        // 获取城市列表

        var xhr1 = new XMLHttpRequest();
        var arr;
        var areaContent = {
          area: ""
        };
        xhr1.addEventListener("load", loadHandler);
        xhr1.open("get", "../json/city.json");
        xhr1.send();

        function loadHandler(e) {
          arr = JSON.parse(this.response);
          loadArea(areaContent);
          areaBox.addEventListener("mouseenter", findP);
          place.addEventListener("mouseleave", clearAll);
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

        function loadShopList(e) {
          jsonList = JSON.parse(this.response);
          findItem(jsonList);
          typeList(jsonList);
          createTree(listTree, isItem);
          createPicList(piclist, isItem["list"]["img"]);
          createItem(everyInfo, isItem["list"]);
          createSame(sameThing.firstElementChild, sameList);
          var Obj = {
            select: false
          };
          for (var str in isItem["list"]) {
            if (str === "price") {
              Obj[str] = Number(isItem.list.price.split("¥")[1]);
            } else {
              Obj[str] = isItem["list"][str];
            }
          }
          Obj.num = 1;
          Obj.sum = Obj.num * Obj.price;
          Obj.del = false;
          var addBox = document.createElement("div");
          addBox.id = "shopBox";
          everyInfo.lastElementChild.appendChild(addBox);
          addToShop(addBox, Obj);
        }

        function findItem(list) {
          var itemId = location.href.split("?")[1];
          for (var i = 0; i < list.length; i++) {
            if (i === 0 || i === 9) {
              for (var j = 0; j < list[i].length; j++) {
                if (list[i][j].href === itemId) {
                  isItem.first = "热门商品";
                  isItem.second = "商品";
                  isItem.third = list[i][j].title;
                  isItem.list = list[i][j];
                  sameList = list[i];
                  return;
                }
              }
            } else {
              for (var k = 3; k < list[i].length; k++) {
                if (list[i][k].href === itemId) {
                  isItem.first = list[i][0].title;
                  isItem.second = list[i][1].title1;
                  isItem.third = list[i][k].title;
                  isItem.list = list[i][k];
                  sameList = list[i];
                  return;
                }
              }
            }
          }
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

        function createTree(parent, obj) {
          var li = document.createElement("li");
          li.textContent = "全部分类";
          parent.appendChild(li);
          for (var str in obj) {
            if (str === "list") continue;
            var li2 = document.createElement("li");
            li2.textContent = ">" + obj[str];
            parent.appendChild(li2);
          }
        }

        function createPicList(parent, piclist) {
          var li = document.createElement("li");
          var img = new Image();
          img.src = "../" + piclist;
          li.appendChild(img);
          parent.appendChild(li);
        }

        function createItem(parent, itemlist) {
          var leng = parent.children.length;
          for (var i = 0; i < leng.length; i++) {
            parent.firstElementChild.remove();
          }
          // console.log(itemlist);
          var div = document.createElement("div");
          for (var item in itemlist) {
            if (item === "img") {
              var bigdiv = document.createElement("div");
              var smallspan = document.createElement("span");
              var block = document.createElement("span");
              var img = new Image();
              var bigimg = new Image();
              var bigbox = document.createElement("span");
              bigimg.className = "bigimg";
              bigbox.className = "bigbox";
              img.className = "smallimg";
              block.className = "block";
              smallspan.className = "mark";
              img.src = "../" + itemlist[item];
              bigimg.src = "../" + itemlist[item];
              smallspan.addEventListener("mouseover", bigHandler);
              smallspan.addEventListener("mouseout", bigHandler);
              bigbox.appendChild(bigimg);
              bigdiv.appendChild(img);
              bigdiv.appendChild(smallspan);
              bigdiv.appendChild(bigbox);
              bigdiv.appendChild(block);
              parent.appendChild(bigdiv);
            } else if (item === "title") {
              var h2 = document.createElement("h2");
              h2.textContent = itemlist[item];
              div.appendChild(h2);
            } else if (item === "href") {
              var span = document.createElement("span");
              span.textContent = "商品货号: " + itemlist[item];
              div.appendChild(span);
            }
          }
          var priceBox = document.createElement("div");
          var text = document.createElement("span");
          var price = document.createElement("span");
          text.textContent = "风尚价: ";
          price.textContent = itemlist.price;
          priceBox.appendChild(text);
          priceBox.appendChild(price);
          div.appendChild(priceBox);
          div.innerHTML +=
            "<span class='area'>送至:</span><div id='areaBox'></div><div id='place'></div>";
          parent.appendChild(div);
        }

        function bigHandler(e) {
          if (e.type === "mouseover") {
            this.parentNode.lastElementChild.style.display = "block";
            this.parentNode.children[2].style.display = "block";
            this.addEventListener("mousemove", moveHandler);
          } else {
            this.parentNode.lastElementChild.style.display = "none";
            this.parentNode.children[2].style.display = "none";
          }
        }

        function moveHandler(e) {
          var left =
            e.pageX -
            this.parentNode.offsetLeft -
            this.offsetLeft -
            this.parentNode.lastElementChild.offsetWidth / 2;
          var top =
            e.pageY -
            this.parentNode.offsetTop -
            this.offsetTop -
            this.parentNode.lastElementChild.offsetHeight / 2;
          if (left <= 0) {
            left = 0;
          } else if (
            left >=
            this.offsetWidth - this.parentNode.lastElementChild.offsetWidth
          ) {
            left = this.offsetWidth - this.parentNode.lastElementChild.offsetWidth;
          }
          if (top <= 0) {
            top = 0;
          } else if (
            top >=
            this.offsetHeight - this.parentNode.lastElementChild.offsetHeight
          ) {
            top = this.offsetHeight - this.parentNode.lastElementChild.offsetHeight;
          }
          this.parentNode.lastElementChild.style.left = left + "px";
          this.parentNode.lastElementChild.style.top = top + "px";
          this.parentNode.children[2].firstElementChild.style.left = -left * 2 + "px";
          this.parentNode.children[2].firstElementChild.style.top = -top * 2 + "px";
        }

        function createSame(parent, list) {
          for (var i = 3; i < list.length; i++) {
            var a = document.createElement("a");
            a.href = "../html/info.html?" + list[i]["href"];
            var li = document.createElement("li");
            var img = new Image();
            img.src = "../" + list[i]["img"];
            var content = document.createElement("span");
            content.textContent = list[i]["title"];
            var price = document.createElement("div");
            price.textContent = list[i]["price"];
            a.appendChild(img);
            a.appendChild(content);
            a.appendChild(price);
            li.appendChild(a);
            parent.appendChild(li);
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
          // console.log(obj);
        }

        function exitLogin(e) {
          obj.exit = true;
          var xhr = new XMLHttpRequest();
          xhr.addEventListener("load", userLogin);
          xhr.open("POST", "http://localhost:1026");
          xhr.send(JSON.stringify(obj));
        }

        // 购物车


        function addToShop(parent, list) {
          var len = parent.children.length;
          for (var i = 0; i < len; i++) {
            parent.firstElementChild.remove();
          }

          if (parent.nextElementSibling) {
            parent.nextElementSibling.remove();
          }

          parent.data = list;
          var left = document.createElement("button");
          var text = document.createElement("input");
          var right = document.createElement("button");
          text.value = list.num;
          // console.log(list);
          left.addEventListener("click", sendData);
          text.addEventListener("blur", sendData);
          right.addEventListener("click", sendData);
          left.textContent = "-";
          right.textContent = "+";
          parent.appendChild(left);
          parent.appendChild(text);
          parent.appendChild(right);
          var addToShopList = document.createElement("div");
          addToShopList.list = list;
          addToShopList.addEventListener("click", startData);
          addToShopList.textContent = "加入购物车";
          everyInfo.lastElementChild.appendChild(addToShopList);
          // console.log(list);
        }

        function startData(e) {
          var obj1 = this.list;
          // console.log(this.list);
          sendedData.apply(this, obj1);
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
          } else {
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

        function sendedData(list) {
          var xhr = new XMLHttpRequest();
          xhr.addEventListener("load", sendAllData);
          xhr.open("POST", "http://localhost:1028");
          xhr.self = this;
          if (this instanceof HTMLDivElement) {
            console.log(this.list);
            xhr.send(JSON.stringify(this.list));
          } else {
            xhr.send(JSON.stringify(list));
          }

        }

        function sendAllData(e) {
          // console.log(JSON.parse(this.response));
          // shopBox.children[1].value=JSON.parse(this.response).num;
          addToShop(shopBox, JSON.parse(this.response));
          if (this.self.textContent === "加入购物车") {
            location.href = "shopping.html";
          }
        }