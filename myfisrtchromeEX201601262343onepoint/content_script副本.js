

//  宏定义区域

var body=document.body;
var imgNum=0;
var globalState=false;
//
var currentinputid="none";

var   allimgJsonArray={};




var dataArray=new Array( new Array(),new Array(),new Array(),new Array(),new Array(),new Array());
var dataName=new Array("website","catagory","productname","price","descript","images");
for(var i=0;i<dataArray.length;i++ )
{
    dataArray[i][0]=dataName[i];
}


// 功能 鼠标划过 区域高亮

function  changeDomState()
{

    var  textList=document.body.getElementsByTagName("p");

    for (var i =textList.length - 1; i >= 0; i--) {

        var p=textList[i];
        p.style.outlineStyle="dotted";
        p.style.outlineColor="#BD2D30";

    }

    var  imgList=document.body.getElementsByTagName("img");
    for ( var i=0 ; i<imgList.length;i++)
    {
           var img=imgList[i];
           img.style.outlineStyle="dotted";
           img.style.outlineColor="#BD2D30";
    }

    var   linkList=document.body.getElementsByTagName("a");
     for( link in linkList)
     {
           link.style.outlineStyle="dotted";
           link.style.outlineColor="#BD2D30";
     }

}


//----------------------- MAIN --------
var xhr=new XMLHttpRequest();

var element=document.getElementById("test");


window.onclick=function(e){
   return clickElement(e);
};


//----------------------

//-----------  高亮选中元素

var  mousebackgroundColor="";
var  mousebackgroundColor_parent="";
var mousebackgroundColor_child="";
window.onmouseover=function(e){
    if(globalState==false)
    {
        return false;
    }
    if(document.getElementById("swopenbt").name=="OFF")
    {
        //document.body.removeAttribute("onclick");

        return false;
    }
   // window.onclick=addEventListener("onclick",clickElement);
    window.onclick=function(e){
        clickElement(e);
    };
    //document.body.onclick=function(e){ e.target.stopPropagation(); };
      if(e.target.id=="suspensionwindow"|| e.target.className.indexOf("sw")>=0)
      {
          return false;
      }

      mousebackgroundColor= e.target.style.backgroundColor;
      mousebackgroundColor_parent=e.target.parentElement.style.backgroundColor;
    //  mousebackgroundColor_child= e.target.firstChild.style.backgroundColor;

    e.target.style.backgroundColor="#F9F900";
    e.target.parentElement.style.backgroundColor="#1AFD9C";
    //e.target.firstChild.style.backgroundColor="#7373B9";
};
window.onmouseout=function(e){
    if(globalState==false)
    {
        return false;
    }
    if(document.getElementById("swopenbt").name=="OFF")
    {
        return false;
    }
     if(e.target.id == "suspensionwindow" || e.target.className.indexOf("sw")>=0)
     {
         return false;
     }
     e.target.style.backgroundColor=mousebackgroundColor;
    if(e.target.parentElement) {
        e.target.parentElement.style.backgroundColor = mousebackgroundColor_parent;
    }
    // e.target.firstChild.style.backgroundColor=mousebackgroundColor_child;

    mousebackgroundColor="";
   // mousebackgroundColor_child="";
    mousebackgroundColor_parent=""
};



function  clickElement(e)
{
        e.cancelable=true;
        // alert(e.target.textContent);
        if(document.getElementById("swopenbt").name=="OFF"|| e.target.localName=="body")
        {

            window.onclick=null;

            return true;
        }
        else
        {
            e.stopPropagation();
            // 跳过显示界面
            var temp= e.target;
            console.log(e.target);


            if(e.target.id=="suspensionwindow"|| e.target.className.indexOf("sw")>=0)
            {
                if(e.target.className=="swsusclearbt")
                {
                    clearContent(e);
                }

                return false;
            }
            else {
                 if(e.target.localName=="img"|| e.target.getElementsByTagName("img").length>0)
                 {

                     analyseImgElemente(e.target);
                     e.preventDefault();
                     return false;
                 }

                analyseElement(e);
                e.preventDefault();
                return false;
            }
        }


}



//---------------- 悬浮的输入的窗口 ------------------

//<script languange="javascript" src="suspenswindow.js"></ script>




function ShowInputWindow(state) {
   // document.body.focus();
    globalState=state;
    if (state == false) {
         if(document.getElementById("suspensionwindow"))
         {
             document.getElementById("suspensionwindow").style.display="none";
             document.getElementById("swopenbt").name="OFF";

         }

        return  ;
    }
    else
    {
         if(document.getElementById("suspensionwindow"))
         {

             document.getElementById("suspensionwindow").style.display="";
            if( document.getElementById("swopenbt").innerHTML.indexOf("ON")>=0)
            {
                document.getElementById("swopenbt").name="ON";
            }
             else
            {
                document.getElementById("swopenbt").name="OFF";
            }

             return ;
         }

    }


   var suspensionWindow=document.createElement("div");
        suspensionWindow.id="suspensionwindow";
       // body.appendChild(suspensionWindow);
    body.insertBefore(suspensionWindow,body.firstElementChild);
    //

     var currentTabUrl=window.location.href;


    suspensionWindow.innerHTML="<p class='swat' id='swuploadat' style='font-size: 35px;color: #BD2D30;display:none'>loading</p><div class='sw line' style='text-align:center'><button class='sw'  id='swopenbt' type=\"button\" name=\"OFF\" value=\"pick up  web OFF\" onclick='openConfrim(this)' style=\"background:#BD2D30;text-align:center;width:auto;padding:0 20px;margin:0 auto;\">pick up  web OFF </button><button class='sw'  id='swisupbt' type=\"button\" name=\"OFF\" >ISUP</button></div>"
        +"<div class='sw line'><p class='sw'><strong  class='sw'>网站地址【website】:</strong></p><input class='swiput' type=\"text\" name='website' value='"+ currentTabUrl+"' ><button disabled='disabled'style='background:#333333;' class='swsusclearbt'>clear</button></div>"
        +"<div class='sw line'><p class='sw'><strong  class='sw'>分类【CollectionName】:</strong></p><input class='sw' type=\"text\" id='swinput1' name='category' dropzone=value /><button class='swsusclearbt' >clear</button></div>"
        +"<div class='sw line'><p class='sw'><strong  class='sw'>产品名称【ProductName】:</strong></p> <input class='sw' type=\"text\"  id='swinput2' name='productname' /><button class='swsusclearbt'>clear</button> </div>"
        +"<div class='sw line'><p class='sw'><strong  class='sw'>产品价格【Price】:</strong></p><input class='sw' type=\"text\" name='price' id='swinput3'  /><button class='swsusclearbt'  >clear</button></div>"
        +"<div class='sw line'><p class='sw'><strong  class='sw'>产品描述【Descript】:</strong></p><textarea class='swtextarea' id='swdestextarea' style='color: black' ></textarea><button class='swsusclearbt'  >clear</button> </div>"
        +"<div class='sw line'><p class='sw'><strong  class='sw'>产品图片【Product Img】:</strong></p><button id='swsusallbtimg' class='swsusallbtimg'   >allImg</button><button id='swsusclearbtimg' class='swsusclearbtimg'>clear</button></div>"
        +"<br>"
    +"<button id='confirmpinfobt'  class='swsubmit' value='submit' style='margin:5px auto 10px;display:block;'>SUBMIT</button>";
    var openbutton= document.getElementById("swopenbt");
    var  openconfirm=document.createElement("script");
    openconfirm.innerHTML="function openConfrim(id){"+"if(id.name==\"OFF\"){id.name=\"ON\";id.innerHTML=\"pick up  web ON\";id.style.background=\"#61CE3C\";}else{id.name=\"OFF\";id.innerHTML=\"pick up  web OFF\";id.style.background=\"#BD2D30\";}}";
     suspensionWindow.appendChild(openconfirm);

    var suspensionwindowStyleContent="#suspensionwindow{width:380px;background:rgba(0,0,0,0.6);color:#fff;position:fixed;right:10px;top:60px;font:400 12px/1.2 Helvetica;overflow:hidden;z-index:99999;border-radius:5px;padding:5px;margin: 0 0 0 5px;max-height:90vh;overflow-Y:auto;}";
    suspensionwindowStyleContent+="#suspensionwindow .line{overflow:hidden;margin-bottom:10px;}";
    suspensionwindowStyleContent+="#suspensionwindow button{width:50px;height:18px;left:5px; line-height:18px;background:#f47737;color:#fff;border-radius:4px;margin-left:5px;border:none; padding:0;margin:0 0 0 5px;}";
    suspensionwindowStyleContent+="#suspensionwindow p.sw{width:160px;float:left;text-align:left;margin:0;line-height:18px;}";
    suspensionwindowStyleContent+="#suspensionwindow input{width:120px;float:left;border:none;color:#000000;padding:0;margin: 0 0 0 5px;}";
    suspensionwindowStyleContent+="#suspensionwindow .swimgdiv{width:100%;overflow:hidden;}";
    suspensionwindowStyleContent+="#suspensionwindow .swimg-item{float:left;padding:2px;border:1px solid #fff;text-align:center;width:20%;}";
    suspensionwindowStyleContent+="#suspensionwindow .swimg{width:40px;height:40px;margin:5px;vertical-align:middle;cursor:pointer;}";
    suspensionwindowStyleContent+="#suspensionwindow .swimg-item p{margin:0;cursor:pointer;color:#f47727;background:#fff;}";
    suspensionwindowStyleContent+="#suspensionwindow textarea{width:350px;height:80px}"
    var  suspensionwindowStyle=document.createElement("style");
    suspensionwindowStyle.innerHTML=suspensionwindowStyleContent;
       document.head.appendChild(suspensionwindowStyle);


    // 一键获取 body 中所有的图片
    var swsusallbt=document.getElementById("swsusallbtimg");

     swsusallbt.addEventListener("click",analyseBodyImg);
   //  开关监听
    var onOffBt=document.getElementById("swopenbt");
    onOffBt.addEventListener("click",openConfrimD)
    // 监听clear button
      var clearbuttons=document.getElementsByClassName("swsusclearbt");
        for(var i=0;i<clearbuttons.length;i++){
            var ebt=clearbuttons[i];

            ebt.addEventListener("click",clearContent);
        }
      var submitBtn=document.getElementById("confirmpinfobt");

      submitBtn.addEventListener("click",submitContent)

   // 监听图片清除
     var imgclearBt=document.getElementById("swsusclearbtimg");
     imgclearBt.addEventListener("click",clearImgContent);

    //var swsuscopybt=suspensionWindow.getElementsByClassName("swsuscopybt");

    //swsusallbt.addEventListener("click",pasteTocategoryInput)


    // 添加聚集焦点
    document.getElementById("swinput1").onclick=function(e){ inputGetfocus(e); };
    document.getElementById("swinput2").onclick=function(e){ inputGetfocus(e); };
    document.getElementById("swinput3").onclick=function(e){ inputGetfocus(e); };
    document.getElementById("swdestextarea").onclick=function(e){ inputGetfocus(e); };


    document.getElementById("swisupbt").onclick=function(e){
    susdiv= document.getElementById("suspensionwindow");

    var  button= e.target;
    var ison=button.getAttribute("name");
    if(ison=="OFF")
    {
        button.setAttribute("name","ON");
       // susdiv.style.removeProperty("maxHeight");
        susdiv.style.height="22px";
        susdiv.style.overflowY="hidden";
    }
    else {
        button.setAttribute("name","OFF");
        susdiv.style.maxHeight="90vh";
        susdiv.style.height="";
         susdiv.style.overflowY="auto";
    }



}


}

//---------------------------事件方法-----------------






// 更改  文本焦点

function   inputGetfocus(e)
{

    currentinputid= e.target.id;

}


// 粘贴文本







// 清空文本内容
function  clearContent(id)
{


      var input=id.target.previousElementSibling;

    if(input.value!="")
    {
        input.value="";
    }
    if(input.localName=="textarea")
    {
        input.previousElementSibling.value="";
    }

}
// 清空图片内容
function  clearImgContent(id)
{
    var imgDiv=document.getElementById("susimglist");

   var rootDIV=document.getElementById("suspensionwindow");
   //rootDIV.style.height="350px";
   // imgDiv.parentNode.removeChild(imgDiv);
    var imglist=imgDiv.getElementsByTagName("img");
    if(imglist.length>0)
    {
        for(var i=imglist.length-1; i>=0;i--)
        {
            if(imglist[i].nextElementSibling.name.toString()=="markon")
            {

            }
            else
            {
                delete allimgJsonArray[imglist[i].src];
                imgDiv.removeChild(imglist[i].parentNode);

            }

        }


    }


}

// 清空单张图片内容
function clearSingleImg(id)
{

      delete allimgJsonArray[id.target.src];
    var suspensionWindow=document.getElementById("suspensionwindow");
    var imgDiv=document.getElementById("susimglist");
    imgDiv.removeChild(id.target.parentNode);

}

// 提交内容
function  submitContent(id)
{
      var submitbt=id.target;
     var list=new Array();
    dataArray[0][0]="website";
    dataArray[0][1]=window.location.href;
    dataArray[0][2]="";

     // textarea  传递


    // textarea 传递



    var fromList=document.getElementById("suspensionwindow").getElementsByTagName("input");
    for (var  i=1;i<fromList.length; i++) {

        if (String(fromList[i].value).length<=0){
            alert("数据不能为空 ");
            return false;

        }
        else
        {
            if(i==4)
            {
               // fromList[i].value=document.getElementById("swdestextarea").value;
            }

               dataArray[i][0]=fromList[i].getAttribute("name");
              dataArray[i][1]=String(fromList[i].value);
              dataArray[i][2]=fromList[i].getAttribute("xpath");



        }
    }
      dataArray[4][1]=document.getElementById("swdestextarea").value;
    dataArray[4][2]=document.getElementById("swdestextarea").getAttribute("xpath");




            // list[i-1]=fromList[i].value.toString();
    var imglist=document.getElementById("suspensionwindow").getElementsByTagName("img");
    if(imglist.length<=0)
    {
        alert("图片不能为空 ");
        return false;

    }
    var jsonstring="["
    if(imglist.length<=0)
    {
               jsonstring="]"
    }
    else
    {
        for (var i = 0; i < imglist.length - 1; i++) {

            jsonstring += "{\"xpath\":\"" + imglist[i].name.replace(/\"/g, "'") + "\",\"src\":\"" + imglist[i].src + "\"},";

        }
        jsonstring += "{\"xpath\":\"" + imglist[imglist.length - 1].name.replace(/\"/g, "'") + "\",\"src\":\"" + imglist[imglist.length - 1].src + "\"}]";





        console.log("submit:dada" + dataArray.toString());
    }
            dataArray[5][0]=jsonstring;

            var sendstring="{";

            for(var i=0;i<(dataArray.length-1);i++)
            {

                var array=dataArray[i];
                if(isEmptyObject(array[2]))
                {

                    array[2]="NULL";
                }

                 array[1]=strDealJsonvalueReplace(array[1]);
                 array[2]=strDealJsonvalueReplace(array[2]);


                sendstring+="\""+array[0]+"\":{"+"\"value\":\""+array[1]+"\",\"xpath\":\""+array[2].replace(/\"/g,"'")+"\"},"
            }

            sendstring+="\"images\":"+jsonstring+"}";
            console.log(sendstring);
         // alert(sendstring);
      var imgUrlList=new Array();
    for (var i = 0; i < imglist.length; i++) {
              imgUrlList[i]=imglist[i].src;
    }
             //  sendDataToserver(sendstring)
            document.getElementById("swuploadat").style.display="";
            chrome.runtime.sendMessage({getState:"submit",data:sendstring,imgData:imgUrlList,url:window.location.href},function(response)
            {
                if(response.code.toString()=="200")
                {
                    alert("数据正在提交中,请您耐心等待结果...");

                    clearALLContent();


                }

            });
    //   获取图片原生数据
     imgNum=imglist.length;


}

// 数据完整发送到服务器

function  sendDataToserver(datastr)
{
    chrome.runtime.sendMessage({getState:"submit",data:sendstring,url:window.location.href},function(response)
    {
        if(response.code.toString()=="200")
        {
            //alert("添加成功");
            clearALLContent();


        }

    });




}




function clearALLContent()
{
    var fromList=document.getElementById("suspensionwindow").getElementsByTagName("input");
    for (var i=1 ;i<fromList.length ;i++)
    {

        if(fromList[i].value.toString().length<=0)
        {


        }
        else
        {
            fromList[i].value="";
            fromList[i].setAttribute("xpath","NULL");
            dataArray[i][1]="NULL";
            dataArray[i][2]="NUll";

        }
    }

     var textarea=document.getElementById("swdestextarea");
      textarea.value="";
      textarea.setAttribute("xpath","NULL");

    var imgDiv=document.getElementById("susimglist");

    var rootDIV=document.getElementById("suspensionwindow");
    //rootDIV.style.height="350px";
    // imgDiv.parentNode.removeChild(imgDiv);
    var imglist=imgDiv.getElementsByTagName("img");
    if(imglist.length>0) {
        for (var i = imglist.length - 1; i >= 0; i--) {

            imgDiv.removeChild(imglist[i].parentNode);
            allimgJsonArray={};



        }
    }




}
//  开关
function openConfrimD(e){
     var id= e.target;
    if(id.name=="OFF")
    {
        //id.name="ON";
        //id.innerHTML="pick up  web ON";
        //id.style.background="#61CE3C";
       // document.body.removeAttribute("onclick");
        listenADDnodeImg(true);
    }
    else
    {
        //id.name="OFF";
        //id.innerHTML="pick up  web OFF";
        //id.style.background="#BD2D30";
       // document.body.setAttribute("onclick"," document.body.stopPropagation();");
        listenADDnodeImg(true);
    }



}

// --------------------数据通信 -------------------
chrome.extension.onMessage.addListener(function (request,sender,sendResponse) {

    if(request.state=="true")
    {
        ShowInputWindow(true);


    }
    else if(request.state=="false")
    {
        ShowInputWindow(false);
    }


    if(request.uploadstate!=null)
    {
        document.getElementById("swuploadat").style.display="none";
        if(request.uploadstate="true")
        {



        }
        else
        {

        }



    }

    sendResponse({code:"200"});

}
);

chrome.runtime.sendMessage({getState:"state"},function(response)
{
     if(response.state)
     {
         ShowInputWindow(true);
     }
    else
     {
         ShowInputWindow(false);
     }

});







// --------------------选中标签路径 ,属性分析------------

function  getNodeWhoseChildsAreMore(e)
{
     var parentNode= e.parentElement;
    if(parentNode&&e.localName!="body")
    {
        if(parentNode.localName.toString()=="div")
        {
           if(parentNode.getElementsByTagName("img").length>=2)
           {
                  return parentNode;

           }else
           {

               return getNodeWhoseChildsAreMore(parentNode);

           }

        }
        else
        {
           return getNodeWhoseChildsAreMore(parentNode);

        }
    }
    else
    {
         return e;

    }
}

function  analyseBodyImg(e)
{

     analyseImgElemente(document.body);

}

/////图片去重
function avoidRepetitionImg(list)
{
    var n={},r=[];

    for(var i=0;i<list.length;i++)
    {
        if(!r[list[i].src])
        {
             n[list.src]=true;
            r.push(list[i]);
        }


    }
    console.log("去掉了:"+(list.length- r.length));
    return  r;

}


// 分析含有 图片的节点

function  analyseImgElemente(e)
{
    var suspensionWindow=document.getElementById("suspensionwindow");
    var imgDiv=document.getElementById("susimglist");
     if(document.getElementById("susimglist")==null)
     {
         imgDiv=document.createElement("div");
         imgDiv.className="swimgdiv";
         imgDiv.id="susimglist";
         var submitbt=document.getElementById("confirmpinfobt");
         //suspensionWindow.insertBefore(imgDiv,submitbt);
         submitbt.parentNode.insertBefore(imgDiv,submitbt.previousElementSibling);
     }
     var  ppnode=getNodeWhoseChildsAreMore(e);
     var imgListSet=ppnode.getElementsByTagName("img");
   //先去重后排序
     var imgList=sortImglist(avoidRepetitionImg(imgListSet));

    //当前可选图片的数组
     var displayImgList=imgDiv.getElementsByTagName("img");

    for(var i=0;i<imgList.length;i++)
    {

        if(imgList[i].className=="swimg"||parseFloat(imgList[i].naturalHeight)<102.0||parseFloat(imgList[i].naturalWidth)<102.0)
        {
             continue;
        }
        if(allimgJsonArray[imgList[i].src])
        {
            continue;
        }
        allimgJsonArray[imgList[i].src]=true;

        var img=document.createElement("img");
        var img_c=document.createElement("div");
        var img_des=document.createElement("p");
        img_des.className="swimgdes";
        img_des.textContent=imgList[i].naturalWidth+" X "+imgList[i].naturalHeight;
        img.setAttribute("area",""+parseFloat(imgList[i].naturalWidth)*parseFloat(imgList[i].naturalHeight)+"");
        img_des.textAlign="center";
        img_des.name="markoff";
        img_c.appendChild(img);
        img_c.appendChild(img_des);
        img_c.className="swimg-item";
        img.className="swimg";
        img.src=imgList[i].src;
        img.name=getPathTo(imgList[i]);

        for(var b=0;b<displayImgList.length;b++)
        {
            if(displayImgList[b].nextElementSibling.name=="markon")
            {
                if(b=displayImgList.length)
                {
                    imgDiv.appendChild(img_c);
                }
                continue;
            }
            var a=parseFloat(img.getAttribute("area"));
            var d=parseFloat(displayImgList[b].getAttribute("area"));
            if(a>=d)
            {

                imgDiv.insertBefore(img_c,displayImgList[b].parentNode);
                break;
            }
            else {
                imgDiv.appendChild(img_c);

            }

        }
        if(displayImgList.length==0)
        {
            imgDiv.appendChild(img_c);
        }


      //  imgDiv.appendChild(img_c);
        img.addEventListener("click",clearSingleImg,false);
        img_des.addEventListener("click",changeImgMarkState,false)
    }



}

function  changeImgMarkState(e)
{
     var pnode= e.target;
    if(pnode.name=="markoff")
    {
        pnode.name="markon";
        pnode.style.backgroundColor="green";
        pnode.parentNode.style.backgroundColor="green";
    }
    else
    {
        pnode.parentNode.style.backgroundColor="";
        pnode.style.backgroundColor="white";
        pnode.name="markoff";
    }



}




function analyseElement(e)
{

    // debug
     console.log(e.target);
     var  element= e.target;
    //debug

    var attributesTemp=e.target.attributes;
    for(name in  attributesTemp){
        var  attValue=attributesTemp[name].nodeValue;
       console.log(attributesTemp[name].nodeName+":"+attValue);
    }




         var xpath=getPathTo(e.target)
    var currentE=document.getElementById(currentinputid);
    if(currentE.name=="price"&&(e.target.textContent.indexOf("$")<0))
    {
        currentE.value+="$";

    }
    if(currentE==null)
    {

    }
    else {
        currentE.value += e.target.textContent;
        if(e.target.textContent==null)
        {
            currentE.value+= e.target.parentNode.textContent;
        }

        currentE.setAttribute("xpath",xpath);
    }






}


function getPathTo(element) {
    if (element.id!=='')
        return 'id("'+element.id+'")';
    if (element===document.body)
        return element.tagName;

    var ix= 0;
    var siblings= element.parentNode.childNodes;
    for (var i= 0; i<siblings.length; i++) {
        var sibling= siblings[i];
        if (sibling===element)
            return getPathTo(element.parentNode)+'/'+element.tagName+'\['+(ix+1)+'\]';
        if (sibling.nodeType===1 && sibling.tagName===element.tagName)
            ix++;
    }



}

function getPageXY(element) {
    var x= 0, y= 0;
    while (element) {
        x+= element.offsetLeft;
        y+= element.offsetTop;
        element= element.offsetParent;
    }
    return [x, y];
}


function sortImglist(list)
{
     listArray=new Array();
    for(var i=0;i<list.length;i++)
    {

        listArray.push(list[i]);
    }


    listArray.sort(function(a,b)
    {
        return b.naturalWidth- a.naturalWidth;

    });


    return listArray;


}



// -------------------自动监听分析------

function analyseADDNode(e)
{
    console.log("节点"+e.target.toString());
    var attributesTemp=e.target.attributes;
    for(name in  attributesTemp){
        var  attValue=attributesTemp[name].nodeValue;
        console.log("属性"+attributesTemp[name].nodeName+":"+attValue);
    }
    console.log("添加的标签*"+e.target.outerHTML);
    if (e.target.localName =="img") {
        analyseImgElemente(e);
        console.log(e.target.outerHTML);
        if(e.target.outerHTML.indexOf("img")>=0)
        {
           // alert(e.target.outerHTML);

        }
    }
    else {


    }



    if(e.type== "DOMAttrModified")
    {

        console.log("【修改的节点]"+ e.target);
        if(e.attrName=="src")
        {

          //  alert(e.attrName);

        }



    }
    else  if(e.type== "DOMNodeInserted")
    {




    }
}


var MutationObserver=window.MutationObserver||WebKitMutationObserver || window.MozMutationObserver
var mutaObserver;
//  开启 关闭  自动监听
function listenADDnodeImg(state)
{
   if(state) {

       if(mutaObserver!=null)
       {
           var config = { attributes: true, childList: true,subtree:true, characterData: false };
           mutaObserver.observe(document.body,config);
       }



       mutaObserver=new MutationObserver(function(mutations)
       {
           console.log(mutations);
           analyseDomChange(mutations);
       });
       var config = { attributes: true, childList: true,subtree:true,characterData:false};
       mutaObserver.observe(document.body,config);
   }
    else
   {

        mutaObserver.disconnect();
   }




}

// 分析节点的变化 并进行响应的动作

function  analyseDomChange(mutations)
{
     for(var i=0; i<mutations.length;i++)
     {

         if(mutations[i].target.className.indexOf("sw")>0)
         {
             return;
         }
       var mutationRecord=mutations[i];
         if(mutationRecord.addedNodes!=null&&mutationRecord.type=="childList")
         {
             var nodelist=mutationRecord.addedNodes;
             if(nodelist.length>0) {
                 for(var b=0;b<nodelist.length;b++) {

                     //if(nodelist[b].className.indexOf("sw")>0)
                     //{
                     //    return;
                     //}
                     analyseImgElemente(nodelist[b]);
                 }
             }


         }else if(mutationRecord.type=="attributes")
         {
             if(mutationRecord.attributeName=="src") {
                 var ce=mutationRecord.target.parentNode;
                 if(ce.className=="swimg-item"){
                    return;
                 }
                 else
                 {
                     analyseImgElemente(mutationRecord.target);
                 }
             }
         }



     }


}







// ------------------------ 监听分析-------------------------
//------------------------ 鼠标 拖动

var xl;
var yl;
function  moveSWDIV(e)
{


}


// 其他方法
function isEmptyObject(obj){
    for(var n in obj){return false}
    return true;
}


function getBase64Image(img) {



    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img,0,0,img.naturalWidth,img.naturalHeight);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to
    // guess the original format, but be aware the using "image/jpg"
    // will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function getBase64FromImageUrl(url) {
    var img = new Image();

    img.setAttribute('crossOrigin', 'anonymous');


    img.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width =this.width;
        canvas.height =this.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

       // alert(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
        var data=dataURL.replace(/^data:image\/(png|jpg);base64,/, "");

            console.log("图片数据"+data);

    };

    img.src = url;
}

function strDealJsonvalueReplace(v) {

    v=v.replace(/\n/g,"<br>");
    v=v.replace(/\r/g,"<br>");
    //  v=v.replace(/\"/g,"\'");
    v=v.replace(/\t/,"");
    v=v.replace(/\"/g,"”");//替换半角双引号为全角双引号
    v=v.replace(/(^\s*)|(\s*$)/g,"");//this.replace(/(^\s*)|(\s*$)/g,'')
    return v;
}