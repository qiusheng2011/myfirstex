/**
 * Created by mdgao on 1/14/16.
 */

var background=chrome.extension.getBackgroundPage();



function openConfrim(id){

    var state=false;
    if(id.target.name=="OFF")
    {
     id.target.name="ON";
     id.target.innerHTML="Pickupweb ON";
      id.target.style.background="#61CE3C";
        state=true;
    }
    else
    {
     id.target.name="OFF";
     id.target.innerHTML="Pickupweb OFF";
     id.target.style.background="#BD2D30";
        state=false;
    }
      //var background=chrome.extension.getBackgroundPage();
     background.openConfrimB(state);
}

var button =document.getElementById("showhomepagebt");
  if(background.openState)
  {
      button.name="ON";
      button.innerHTML="Pickupweb ON";
      button.style.background="#61CE3C";
      state=true;

  }
  else
  {
      button.name="OFF";
      button.innerHTML="Pickupweb OFF";
      button.style.background="#BD2D30";
      state=false;
  }



function  openAbout()
{
    chrome.tabs.create({
        url: 'about.html'
    });


}



document.getElementById("showhomepagebt").addEventListener("click",openConfrim);

document.getElementById("abouttool").addEventListener("click",openAbout);

