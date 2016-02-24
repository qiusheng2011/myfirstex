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
                tempclickactiontargetxpathlist=[];
            }
            var md5str=gethalfMD5Value(request.href);
            sendResponse({state: openState,tacitcnb:tacitSetCn,isspecialurl:aresult,md5:md5str,clickactiondata:tempclickactionlist,clickactiontargetxpathlist:tempclickactiontargetxpathlist});
            
            //sendResponse({state: openState,tacitcnb:tacitSetCn,isspecialurl:aresult,md5:md5str});
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

                var javascriptstr=getJavasricptTextOfImglist(request.imgxpaths,request.clickactiondata);
                var  jsonobj=JSON.parse(json);
                 jsonobj["imgfunc"]=javascriptstr;
                json=JSON.stringify(jsonobj);
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



var specialurllist=["baidu"];
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


// 生成图片自动获取脚本

function getJavasricptTextOfImglist(_imgxpathlist,_clickdactiondata) {
    if(_clickdactiondata.length==0||_imgxpathlist.length==0)
    {
        return 'function getImgList(){ return false;}';
    }

    var jsrunstr = 'function getImgList(){';
    jsrunstr += '    function  getnode(xpath, context)'
        + '{'
        + '    var doc = (context && context.ownerDocument)||document;'
        + '   var result = doc.evaluate(xpath, context || doc, null, XPathResult.ANY_TYPE, null);'
        + '   switch (result.resultType) {'
        + '      case XPathResult.NUMBER_TYPE:'
        + '      return result.numberValue;'
        + '  case XPathResult.STRING_TYPE:'
        + '       return result.stringValue;'
        + '   case XPathResult.BOOLEAN_TYPE:'
        + '   return result.booleanValue;'
        + '   default:'
        + '      var nodes = [];'
        + '        var node;'
        + '        while (node = result.iterateNext())'
        + '                nodes.push(node);'
        + '           return nodes;'
        + '    }'
        + ' }';

    jsrunstr += 'var dispatchMouseEvent =function(target, var_args) {'
        + 'var e = document.createEvent("MouseEvents");'
        + 'e.initEvent.apply(e, Array.prototype.slice.call(arguments,1));'
        + 'target.dispatchEvent(e);}; var imgResultList=[];var avoidRepeatImg={};';
    var imgxpathlist =_imgxpathlist;
    jsrunstr += 'var imgxpathlist=' + JSON.stringify(imgxpathlist) + ';';
    jsrunstr += 'var clickactiondata=' + JSON.stringify(_clickdactiondata) + ';';
    jsrunstr += 'for(var i=0;i<clickactiondata.length;i++){';
    jsrunstr += ' var elementStr=getnode(\'\'+clickactiondata[i]+\'\')[0];';
    jsrunstr += 'if(elementStr==null){continue;}'
    jsrunstr += 'dispatchMouseEvent(elementStr, \'mouseover\', true, true);';
    jsrunstr += 'dispatchMouseEvent(elementStr, \'mousedown\', true, true);';
    jsrunstr += 'dispatchMouseEvent(elementStr, \'click\', true, true);';
    jsrunstr += 'dispatchMouseEvent(elementStr, \'mouseup\', true, true);';

    jsrunstr += 'for( var b=0;b<imgxpathlist.length;b++)'
        + '{var key=imgxpathlist[b];'
        + 'var targetImg=getnode(""+key+"")[0];'
        + 'if(targetImg!=null){'
        + 'console.log("成功:图片的src=" + targetImg.src);'
        + 'if(!avoidRepeatImg[targetImg.src])'
        + '{imgResultList.push(targetImg.src);avoidRepeatImg[targetImg.src]=true;  }'
        + '}'
        + 'else'
        + ' {'
        + '   console.log(\"失败:\"+targetImg);'
        + '  }'
        + '}'
        + '}';
    jsrunstr+=' return  imgResultList ;}';
    return jsrunstr;
}
function gethalfMD5Value(url)
{

     var  md5allstr=md5(url);

      return md5allstr.substr(0,16);


}

/*
 * Javascript md5() 函数 用于生成字符串对应的md5值
 * 吴先成  www.51-n.com ohcc@163.com QQ:229256237
 * @param string string 原始字符串
 * @return string 加密后的32位md5字符串
 */
function md5(string){
    function md5_RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
    function md5_AddUnsigned(lX,lY){
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
    function md5_F(x,y,z){
        return (x & y) | ((~x) & z);
    }
    function md5_G(x,y,z){
        return (x & z) | (y & (~z));
    }
    function md5_H(x,y,z){
        return (x ^ y ^ z);
    }
    function md5_I(x,y,z){
        return (y ^ (x | (~z)));
    }
    function md5_FF(a,b,c,d,x,s,ac){
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_GG(a,b,c,d,x,s,ac){
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_HH(a,b,c,d,x,s,ac){
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_II(a,b,c,d,x,s,ac){
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };
    function md5_WordToHex(lValue){
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for(lCount = 0;lCount<=3;lCount++){
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };
    function md5_Utf8Encode(string){
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
    string = md5_Utf8Encode(string);
    x = md5_ConvertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=md5_FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=md5_FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=md5_FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=md5_FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=md5_FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=md5_FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=md5_FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=md5_FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=md5_FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=md5_FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=md5_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=md5_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=md5_FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=md5_FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=md5_FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=md5_FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=md5_GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=md5_GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=md5_GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=md5_GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=md5_GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=md5_GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=md5_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=md5_GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=md5_GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=md5_GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=md5_GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=md5_GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=md5_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=md5_GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=md5_GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=md5_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=md5_HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=md5_HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=md5_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=md5_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=md5_HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=md5_HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=md5_HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=md5_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=md5_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=md5_HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=md5_HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=md5_HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=md5_HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=md5_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=md5_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=md5_HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=md5_II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=md5_II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=md5_II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=md5_II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=md5_II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=md5_II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=md5_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=md5_II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=md5_II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=md5_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=md5_II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=md5_II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=md5_II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=md5_II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=md5_II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=md5_II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=md5_AddUnsigned(a,AA);
        b=md5_AddUnsigned(b,BB);
        c=md5_AddUnsigned(c,CC);
        d=md5_AddUnsigned(d,DD);
    }
    return (md5_WordToHex(a)+md5_WordToHex(b)+md5_WordToHex(c)+md5_WordToHex(d)).toLowerCase();
}


