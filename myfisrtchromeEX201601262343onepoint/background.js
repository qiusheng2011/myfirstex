
var  openState=false;
var currentTab;


function openConfrimB(state){

     openState=state;
    openSuspensionWindow(state);

}


function  openSuspensionWindow(state)
{
    var stateStr=String(state);
    chrome.tabs.query({currentWindow:true},function(tabs){
        console.log(tabs);
      for(var i=0;i<tabs.length;i++)
        {
            chrome.tabs.sendMessage(tabs[i].id, {state: stateStr}, function (response) {
                console.log(response);

            });
        }


    });

}

var response;



chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.getState == "state") {
            sendResponse({state: openState});
        }
        else
        {

            if (request.getState != "submit") {
            } else {

                var sourcesURL=request.url;
                var xmlHttp = null;

                function createxmlHttpRequest() {
                    var xmlHttp;
                    if (window.ActiveXObject)
                        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                    else if (window.XMLHttpRequest)
                        xmlHttp = new XMLHttpRequest();

                    return xmlHttp;
                }

                function doRequestUsingPost(url, body, imgData,formdata) {


                    xmlHttp = createxmlHttpRequest();
                    var Httpurl = "http://www.avarsha.com/human/post_chrome_doc/";
                    var queryString = "url='" + url + "'&body='" + body + "'&imgdata=" + imgData+"'";
                    xmlHttp.open("POST", Httpurl);
                    xmlHttp.onreadystatechange = handleStateChange;
                    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                   // xmlHttp.send(queryString);
                    // 表单


                   // formdata.append("url",url);
                    formdata.append("body",body);
                    //oReq.setRequestHeader("Content-Length", formdata.length);
                    oReq.send(formdata);

                }

                function handleStateChange() {

                    if(oReq==null)
                    {
                        return false;
                    }
                    if (oReq.status == 200 && oReq.readyState == 4) {
                           var result=JSON.parse(oReq.responseText);
                        if (oReq.responseText.indexOf("true") > 0) {
                           // alert("大王,您已经巡山成功!");
                             sendUploadState(true,url);
                             showNotification( true,result.product_id+"大王,您已经巡山成功!",sourcesURL,JSON.parse(json));

                        }
                        else {
                            //alert("呜呜,失败了,请重试!");
                            sendUploadState(false,url);
                            showNotification(false,"彻彻底底的失败了!再试一次吧",sourcesURL,JSON.parse(json));

                        }

                    }


                }

                function getBase64FromImageUrl(url, i,callback) {
                    var img = new Image();
                    var num = i;

                    img.setAttribute('crossOrigin', 'anonymous');


                    img.onload = function () {
                        var canvas = document.createElement("canvas");
                        canvas.width = this.width;
                        canvas.height = this.height;

                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(this, 0, 0);

                        var dataURL = canvas.toDataURL("image/png");

                       // alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
                        var data = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
                        // 转化
                        var blob=new Blob([data],{type:"image/*"})



                         var imgname=""+i+"";
                        imgContent[imgname] = {'url': url, 'imgdata':blob};

                        formData.append(""+i+"",blob);


                        imgNum--;
                        if (imgNum == 0) {
                            doRequestUsingPost(url, json, JSON.stringify(imgBody),formData);
                            //sendResponse({code: 200});
                            callback({code: 200});


                        }

                        //console.log("图片数据" + data);

                    };

                    img.src = url;
                }

                //
                // var callback=sendResponse();
                sendResponse({code:200});


                //表单请求
                var formElement = document.getElementById("fileinfo");
                var oReq = new XMLHttpRequest();

                oReq.onreadystatechange=handleStateChange;
                oReq.open("POST", "http://www.avarsha.com/human/post_chrome_doc/");
               // oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                var formData = new FormData(formElement);


                var json = request.data;
                var url = request.url;
                var imglist = request.imgData;
                var imgBody = {};
                var imgContent = {};
                imgBody["imgdata"] = imgContent;
                var imgNum = imglist.length;

                for (var i = 0; i < imglist.length; i++) {
                    getBase64FromImageUrl(imglist[i],i,sendResponse);
                }


                //doRequestUsingPost(url,json,);
                //sendResponse({code:200});
            }

        }

    });








function post(URL, PARAMS) {
    var temp = document.createElement("form");
    temp.action = URL;
    temp.method = "post";
    temp.style.display = "none";
    for (var x in PARAMS) {
        var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = PARAMS[x];
        // alert(opt.name)
        temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    return temp;
}


//创建 菜单方法
//createRightMenu();
//
//function createRightMenu()
//{
//    chrome.contextMenus.create({"title":"add '%s' to category","contexts":["selection"],"onclick":clickSelfMenu(),"documentUrlPatterns":['http://*/*','https://*/*']});
//
//}
//
////菜单触发方法
//
//function  clickSelfMenu()
//{
//
//    alert("恭喜");
//
//
//}

function  sendUploadState(state,urlm)
{
    var  stateStr;
    if(state)
    {
        stateStr="true";
    }
    else
    {
        stateStr="false";
    }
chrome.tabs.query({url:urlm},function(tabs){
  //  console.log(tabs);
    for(var i=0;i<tabs.length;i++)
    {
        chrome.tabs.sendMessage(tabs[i].id,{uploadstate:stateStr},function (response) {
            console.log(response);

        });
    }


});

   // chrome.tabs.getCurrent(function(tab))




}

// 通知
//
showNotification(true,"avarsha tool 开始工作了","start",{website:{value:"http://www.avarsha.com"},category:{value:"吼吼"},price:{value:"无价"},productname:{value:"0.2版本"},descript:{value:""}});
 function showNotification(state,attention,url,productinfo)
 {

     var body="\n来源:"+productinfo.website.value
         +"\n分类:"+productinfo.category.value
         +"\n产品名字:"+productinfo.productname.value
         +"\n产品价格:"+productinfo.price.value
         +"\n产品描述:"+productinfo.descript.value;
        var icon=(state?"notrue.png":"nofalse.png");

   var  notiMessage=new Notification(attention, {
         icon: icon,
         body: body,
          tag:url
     });
    if(state==false)
    {
        notiMessage.onclick = function(e) {
            alert(body);
            window.open(url, '_blank');

        }

    }
     else{
        window.setTimeout(function (e) {
            notiMessage.close();

        }, 3000);
        notiMessage.onclick = function(e) {
            //window.open('http://www.mozilla.org', '_blank');
            e.target.close();
            alert(body);
        }
    }




 }
