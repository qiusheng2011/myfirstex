//document.write("<script language='javascript' src='one.js'></script>");
var  openState=false;
var currentTab;

var tacitSetCn="";
//var specialurllist=["http://www.saksfifthavenue.com/","http://www.baidu.com"];
var specialurllist=[];



var tempclickactionlist;
var tempclickactiontargetxpathlist;

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

            chrome.tabs.sendMessage(tabs[i].id, {state: stateStr,tacitcn:tacitSetCn}, function (response) {
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
           var aresult=analyseIsSpecialURL(request.taburl);
            if(tempclickactionlist==null)
            {
                tempclickactionlist=[];
            }
            if(tempclickactiontargetxpathlist==null)
            {
                tempclickactiontargetxpathlist={};
            }
            sendResponse({state: openState,tacitcnb:tacitSetCn,isspecialurl:aresult,clickactiondata:tempclickactionlist,clickactiontargetxpathlist:tempclickactiontargetxpathlist});
        }
        else
        {

            if (request.getState != "submit") {
            } else {


                // 设置默认分类
                if(request.tacitcn!=null)
                {
                    tacitSetCn=request.tacitcn;
                    tempclickactionlist=request.clickactiondata;
                    tempclickactiontargetxpathlist=request.imgxpaths;

                }

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
                            if(hasispiderb)
                            {
                                showSimpleNotification(true,"GOGOGOGOGO_SUCCESS","SUCCESS",sourcesURL);
                                return;
                            }
                             showNotification( true,"大王,您已经巡山成功!",sourcesURL,JSON.parse(json));

                        }
                        else {
                            //alert("呜呜,失败了,请重试!");

                            sendUploadState(false,url);
                            if(hasispiderb)
                            {
                                showSimpleNotification(false,"BACKBACKBACK_FAILED","败北",sourcesURL);
                                return;
                            }
                            showNotification(false,"彻彻底底的失败了!再试一次吧",sourcesURL,JSON.parse(json));

                        }

                    }
                    else
                    {
                       if(oReq.status != 200) {

                          // sendUploadState(false, url);
                           if(hasispiderb)
                           {
                               showSimpleNotification(false,"BACKBACKBACK_FAILED","败北",sourcesURL);
                               return;
                           }
                           showNotification(false, "程序错误 ,请及时联系程序猿!", sourcesURL, JSON.parse(json));
                           alert(oReq.toString);
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
               // oReq.open("POST", "http://192.168.1.176:8000/human/post_chrome_doc/");
               // oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                var formData = new FormData(formElement);

                 var hasispiderb=(request.hasspider!="false");

                var json = request.data;
                var url = request.url;
                if(hasispiderb)
                {
                    doRequestUsingPost(url, json,"NULL",formData);
                    return;
                }


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

 // 开关响应
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

 function showNotification(state,attention,url,productinfo)
 {

     var body="\n来源:"+productinfo.website.value
         +"\n分类::"+productinfo.category.value
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
            window.open(url, '_blank');
            alert(body);

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

function  showSimpleNotification(state,attention,message,url)
{
    var icon=(state?"notrue.png":"nofalse.png");
    var  notiMessage=new Notification(attention, {
        icon: icon,
        body: message,
        tag:url
    });

}

/// 监听 窗口改变

chrome.tabs.onSelectionChanged.addListener(function( tabId, object) {

    chrome.tabs.sendMessage(tabId, {state:String(openState),tacitcn:tacitSetCn}, function (response) {
        console.log(response);

    });

});


function  analyseIsSpecialURL(urlp)
{


    for(var i=0 ;i<specialurllist.length;i++)
    {

       if(urlp.indexOf(specialurllist[i])>=0)
       {
           return true;
       }
       else
       {
           continue;
       }
    }

    return false;


}


//var specialurllist=["6pm","allurebridals","asos", "bhldn","baidu","davidsbridal","dessy","dillards","farfetch", "forever21", "jovani","macys", "morilee","nordstrom","promgirl","pronovias","simplydresses","tiffanyrose","unique-vintage"];
//var specialurllist=["baidu","1stdibs","2020ave","31philliplim","6pm","absstyle","acnestudios","adasa","adriannapapell","alducadaosta","alexandermcqueen","alexanderwang","aliceandolivia","allsaints","allurebridals","amazon","americanapparel","amiclubwear","anntaylor","anthropologie","antonioli","apeainthepod","armani","asos","avenue32","azaleasf","backcountry","bagheeraboutique","balenciaga","balmain","bananarepublic","barenecessities","barneys","barneyswarehouse","bcbg","bebe","belk","belleandclive","bentleymotors","bergdorfgoodman","bernardboutique","betseyjohnson","bhldn","billabong","bloomingdales","blueandcream","bluefly","bonadrag","boohoo","boutique1","brooksbrothers","brownsfashion","buckle","burberry","bysymphony","c21stores","calvinklein","carnetdemode","cashinmybag","cashmereandvelvet","charlotterusse","chicnova","chicos","clotheshorseanonymous","clubmonaco","coggles","couturecandy","currentboutique","cusp","cynthiarowley","dailylook","daintyhooligan","dante5","davidsbridal","davidyurman","dereklam","designsbystephene","dessy","dianiboutique","dillards","dkny","dolcegabbana","dorothyperkins","dressbarn","dsquared2","dvf","ebay","edressme","ekseption","eshakti","etsy","express","farfetch","fashionproject","forever21","forzieri","freepeople","frenchconnection","fwrd","gap","gilt","gojane","gucci","guess","guessbymarciano","halsbrook","harpersbazaar","harrods","helmutlang","herroom","herveleger","hm","houseoffraser","hsn","intermixonline","italist","jamesperse","jbrandjeans","jcpenney","jcrew","jny","johnlewis","jovani","julesb","karenmillen","karenmillen","karmaloop","katespade","kirnazabete","kohls","lagarconne","landsend","lanebryant","lanecrawford","lanvin","lastcall","lespommettes","liberty","lightinthebox","lillypulitzer","lindelepalais","lipsy","little-mistress","loft","lordandtaylor","luisaviaroma","lulus","lyst","macys","madewell","madisonlosangeles","maggylondon","mango","marcjacobs","marissacollections","matchesfashion","maxstudio","maykool","michaelkors","missguidedus","missselfridge","modaoperandi","modcloth","moddeals","montaignemarket","morilee","moschino","mytheresa","nancymeyer","nastygal","nathalieschuterman","neimanmarcus","net-a-porter","newyorkdress","next","nicolemiller","nike","nordstrom","nordstromrack","nyandcompany","openingceremony","oscardelarenta","outletbicocca","overstock","oxygenboutique","pacsun","parkerny","pinkmascara","pinupgirlclothing","polyvore","poshgirl","profilefashion","promgirl","pronovias","psyche","question-air","rachelpally","rag-bone","ralphlauren","renttherunway","revolveclothing","riverisland","romwe","ronherman","runway2street","runwaycatalog","saksfifthavenue","saksoff5th","scoopnyc","sears","selfridges","sexydresses","shop-hers","shopambience","shopbop","shoplesnouvelles","shopmrsh","shopplanetblue","shopstyle","shopswank","shopthetrendboutique","shoptiques","shopzoeonline","sierratradingpost","simplydresses","singer22","snobswap","soma","ssense","steinmart","stellamccartney","stevenalan","stylebop","superette","surfstitch","svmoscow","swell","talbots","target","tartcollections","tedbaker","tessabit","theclutcher","thecorner","thedreslyn","theory","theoutnet","therealreal","tibi","tiffanyrose","tillys","tommy","topshop","torrid","toryburch","unique-vintage","urbanoutfitters","vanmildert","venus","victoriassecret","vince","vincecamuto","vonmaur","wetseal","whitehouseblackmarket","yandy","yoox","youheshe","ysl","zappos","zara","zazzle","zimmermannwear"];

//getALLSpecialWebSiteList();
// 获取有爬虫网站列表
function getALLSpecialWebSiteList()
{
    var xmlhttp=new XMLHttpRequest();
     xmlhttp.onreadystatechange=function() {
         if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
             document.getElementById("specialdiv").innerHTML = xmlhttp.responseText.toString();

              var dataArray=document.getElementsByTagName("tbody");
             for(var i=1;i<2;i++)
             {
                 var tbodyE=dataArray[i];
                 var childArray=tbodyE.childNodes;

                 for(var a=3;a<childArray.length;a++)
                 {
                     var failedrate=parseFloat(childArray[a].childNodes[3].innerText);
                     console.log(failedrate);
                     if(failedrate<10.0)
                     {
                         var websiteName=childArray[a].childNodes[0].innerText;
                         specialurllist.push(websiteName);

                     }

                 }



             }


             specialurllist.push("baidu");
             showNotification(true,"avarsha tool 开始工作了","start",{website:{value:"http://www.avarsha.com"},category:{value:"吼吼"},price:{value:"无价"},productname:{value:"0.2版本"},descript:{value:"兆百特信息技术有限公司"}});

         }


     };
    xmlhttp.open("GET","http://54.67.124.101:6051/all",true);
    xmlhttp.send();




}

function  getNodesByxpath(xpath, context)
{
    var doc = (context && context.ownerDocument)||document;
    var result = doc.evaluate(xpath, context || doc, null, XPathResult.ANY_TYPE, null);
    switch (result.resultType) {
        case XPathResult.NUMBER_TYPE:
            return result.numberValue;
        case XPathResult.STRING_TYPE:
            return result.stringValue;
        case XPathResult.BOOLEAN_TYPE:
            return result.booleanValue;
        default:
            var nodes = [];
            var node;
            while (node = result.iterateNext())
                nodes.push(node);
            return nodes;
    }
}


