

window.onload = function(){

    checkUser();
}
    
//Check if user exists

function checkUser(){

  var skeleos = localStorage.getItem("skeleos");

  if(skeleos !== undefined && skeleos !== null && skeleos !== ""){

    loginUser();

  }
  else{

    $("#overlay").show();
    $("#overlay").append('<form action="javascript:registerUser();" class="center" id="adminform">\
    <div id="formicon"><img src="icon.png" width="100" height="100"><h4>SkeleOS</h4><p>Filesystem not found. Please register</div>\
    <label for="username">Username</label>\
    <input type="text" id="username" name="username" placeholder="Your preferred username" required>\
    <label for="username">Password</label>\
    <input type="password" id="password" name="password" placeholder="Your preferred password" required>\
    <label for="name">Name</label>\
    <input type="text" id="name" name="name" placeholder="Your name" required>\
    <input type="submit" value="Register">\
  </form>');

  }

}

//Login User
function loginUser(){

  $("#overlay").show();
    $("#overlay").append('<form action="javascript:processLogin();" class="center" id="adminform">\
    <div id="formicon"><img src="icon.png" width="100" height="100"><h4>SkeleOS</h4><p>Please login</div>\
    <label for="username">Username</label>\
    <input type="text" id="username" name="username" placeholder="Your username" required>\
    <label for="username">Password</label>\
    <input type="password" id="password" name="password" placeholder="Your password" required>\
    <input type="submit" value="Login">\
  </form>');


}

function processLogin(){

  $("input[type=submit]").prop('disabled', true);
  $("#username").prop('disabled', true);
  $("#password").prop('disabled', true);


  var username = $('#username').val();
  var password = $('#password').val();
  var userdata = localStorage.getItem("skeleos");


  var promise1 = new Promise(function(resolve, reject) {
   
    try{

      var decrypttwo = CryptoJS.AES.decrypt(userdata, password);
  
      var decryptedtext = decrypttwo.toString(CryptoJS.enc.Utf8);
  
    }
    catch{

      resolve(false);

    }
   
    var userobject = JSON.parse(decryptedtext);
    var decryptedusername = userobject.user.username;

    var decryptedlogin = userobject.user.login;

    if(decryptedusername !== undefined && decryptedusername !== null && decryptedlogin !== undefined && decryptedlogin !== null){

      if(username == decryptedusername && decryptedlogin == true){
  
        resolve(true);
        $("#overlay").hide();
        sessionStorage.setItem("decrypted", decryptedtext);
        startOS();
        
      }
      else{

        resolve(false);
        
      }
    }
    
  });
  
  promise1.then(function(value) {
    
    if(value !== true){

      alert("Invalid username or password");
      $("input[type=submit]").prop('disabled', false);
      $("#username").prop('disabled', false);
      $("#password").prop('disabled', false);
    }
   

  });

   

  
}

//Register User
function registerUser(){

  var username = $('#username').val();
  var password = $('#password').val();
  var name = $('#name').val();

  var data =
  
  {
    user:
    {
    username: username,
    name: name,
    login: true
  },
  modules:
    [{
      name: "Browser",
      source: "modules/Browser/index.html",
      id: "Browser"
    },
    {
      name: "TEST",
      source: "modules/Browser/index.html",
      id: "TEST"
    }],
    icons:
    [],
}

var encrypttwo = CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();


  localStorage.setItem("skeleos", encrypttwo);
  $("#overlay").empty();
  loginUser();

}

//Startup 
function startOS(){

   startTime();
   getDate();
   populateGrid();
   setTimeout(function(){

    // alert("Note: \nPlease use the logout button when ending session to ensure data is saved");

   }, 1500);

}
//Time functions
function startTime(){

    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    m = checkTime(m);
    var rawtime = h + ":" + m;
    var edited = tConvert(rawtime);
    document.getElementById('clock').innerHTML = edited;
    var t = setTimeout(startTime, 500);

}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

//Time converter
function tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }
  
//Date functions

function getDate(){

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();

    document.getElementById('date').innerHTML = day + " " + months[month] + " " + year;
   

}

//Grid functions

var gridarray = [];

function populateGrid(){

   var innerwidth = $('#grid-container').innerWidth();
   var innerheight = $('#grid-container').innerHeight();

    var widthamt = Math.floor(innerwidth);
    var heightamt = Math.floor(innerheight);

    var initial = 0;

    var total = widthamt * heightamt;
    var eachgrid = 16000;

    var amt = total/eachgrid;

    var count = 1;

    while(initial < amt){

        $( "#grid-container" ).append( '<div id="griditem'+count+'" class="grid-item" ondrop="drop(event)" ondragover="allowDrop(event)"></div>' );
        gridarray.push("griditem" + count);
        count++;
        initial++;
        
    }
    
    moduleInject();


}

function moduleInject(){

  var data = sessionStorage.getItem("decrypted");
  var dataobject = JSON.parse(data);
  var modules = dataobject.modules;
 

  for(var count = 0; count < modules.length; count++){

    if(modules[count].iconid !== null && modules[count].iconid !== undefined){

      $("#" + dataobject.icons[count].iconid).append('<img id="'+modules[count].id+'icon" data-wid="'+modules[count].id+'" data-source="'+modules[count].source+'" data-name="'+modules[count].name+'" onclick="launch(this.dataset.wid, this.dataset.source, this.dataset.name)" src="https://bit.ly/2LF13By" draggable="true" ondragstart="drag(event)" width="50" height="50" class="center">');

    }
    else{

      while(count < gridarray.length){

        if ( $('#' + gridarray[count]).children().length > 0 ) {
          // do something
        }
        else{

          $("#" + gridarray[count]).append('<img id="'+modules[count].id+'icon" data-wid="'+modules[count].id+'" data-source="'+modules[count].source+'" data-name="'+modules[count].name+'" onclick="launch(this.dataset.wid, this.dataset.source, this.dataset.name)" src="https://bit.ly/2LF13By" draggable="true" ondragstart="drag(event)" width="50" height="50" class="center">');
          break;
        }

      }
    }
  
  }

}

//Drag and drop functions
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    var app = $("#" + data).attr("data-wid");
    var userdata = sessionStorage.getItem("decrypted");
    var updatedata = JSON.parse(userdata);

for(var count = 0; count < updatedata.modules.length; count++){
  console.log(data)

  if((updatedata.modules[count].id + 'icon') == data){

      
  }
  else{

  }
}
//Change to module
      // updatedata.icons.push({appicon: data, iconid: ev.target.id});
      // sessionStorage.setItem("decrypted", JSON.stringify(updatedata));
  
          // updatedata.icons[count].iconid = ev.target.id;
          // sessionStorage.setItem("decrypted", JSON.stringify(updatedata));


    
    
}

//Window move functions
//Make the DIV element draggagle:
// dragElement(document.getElementById("window"));



// function dragElement(elmnt) {
//   var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//   if (document.getElementById(elmnt.id + "header")) {
//     /* if present, the header is where you move the DIV from:*/
//     document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
//   } else {
//     /* otherwise, move the DIV from anywhere inside the DIV:*/
//     elmnt.onmousedown = dragMouseDown;
//   }

//   function dragMouseDown(e) {
//     e = e || window.event;
//     e.preventDefault();
//     // get the mouse cursor position at startup:
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     document.onmouseup = closeDragElement;
//     // call a function whenever the cursor moves:
//     document.onmousemove = elementDrag;
//   }

//   function elementDrag(e) {


//     var distance = $(elmnt).offset().top;
//     if ( $(window).scrollTop() >= distance ) {
//       // Your div has reached the top
//       elmnt.style.top =  $(window).scrollTop() - distance;

//   }
//   else{

//     e = e || window.event;
//     e.preventDefault();
//     // calculate the new cursor position:
//     pos1 = pos3 - e.clientX;
//     pos2 = pos4 - e.clientY;
//     pos3 = e.clientX;
//     pos4 = e.clientY;
//     // set the element's new position:
//     elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//     elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

//   }
     

//   }

//   function closeDragElement() {
//     /* stop moving when mouse button is released:*/
//     document.onmouseup = null;
//     document.onmousemove = null;
//   }
// }

//Fullscreen functions

var isMaximized = false;

function screenSize(){
   if (isMaximized){
      isMaximized = false;
      closeFullscreen();
   }else{
      isMaximized = true;
      openFullscreen()
   }
}

var elem = document.documentElement;
function openFullscreen(element) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}
function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

//Click functions
function launch(id, source, name) {

   $("#" + id + "icon").unbind().dblclick(function(){
    
    if($("#apps").has('*[data-wid="'+id+'"]').length){

    }
    else{

      $("#apps").append('<div data-wid="'+id+'" onclick="keepWindow(this.dataset.wid)"><h4>Browser</h4><p>wfwef</p></div>');

    }

    if($('#' + id).length){

    }
    else{

      $("#main").append(' <div id="'+id+'" class="window center">\
      <div class="windowheader"> \
        <ul>\
              <li class="right">\
              <i class="material-icons pointer" data-wid="'+id+'" onclick="closeWindow(this.dataset.wid)">\
                  close\
                  </i>\
        </li>\
          <li class="left"><p>'+name+'</p></li>\
              <i class="material-icons fullscreen right pointer" data-wid="'+id+'" onclick="windowScreenSize(this.dataset.wid);">\
                      settings_overscan\
                      </i>\
            </li>\
            <li class="right">\
              <i class="material-icons pointer" data-wid="'+id+'" onclick="keepWindow(this.dataset.wid)">\
                  minimize\
                  </i>\
        </li>\
              </ul>\
  </div>\
  <iframe src="'+source+'" id="safebox" frameborder="0" allowfullscreen></iframe>\
    </div>')

    }
   

});

}

//Prompt logout

function promptLogOut(){

  $("#overlay").empty();
  $("#overlay").show();
  $("#overlay").append('<form action="javascript:logOut();" class="center" id="adminform">\
  <div id="formicon"><img src="icon.png" width="100" height="100"><h4>SkeleOS</h4><p>Please enter password to safely logout</p><p><b>Warning: Skipping this step may result in unsafe work!</b></p></div>\
  <label for="username">Password</label>\
  <input type="password" id="password" name="password" placeholder="Your password" required>\
  <input type="submit" value="Logout"><br><span id="cancellogout" onclick="cancelLogin()">< Back</span>\
</form>');

}
//Logout
function logOut(){

  var userdata = sessionStorage.getItem("decrypted");
  var previousdata = localStorage.getItem("skeleos");

  var password = $("#password").val();
  if (password != null) {
      
    var decrypttwo = CryptoJS.AES.decrypt(previousdata, password);

    var decryptedtext = decrypttwo.toString(CryptoJS.enc.Utf8);


    try {
      
      var userobject = JSON.parse(decryptedtext);
      var encrypttwo = CryptoJS.AES.encrypt(userdata, password).toString();
      localStorage.setItem("skeleos", encrypttwo);
      sessionStorage.clear();
      location.reload();

    }catch(e){

      alert("Invalid password");

    }
    
    

  }
  else{
    
  }

}

function cancelLogin(){

  $("#overlay").empty();
  $("#overlay").hide();

}

//Adjust screen size
var state = false;

function windowScreenSize(id) {

  vpw = $("#main").width();
  vph = $("#main").height();

if(state == false){

  $("#" + id).css({"height": vph, "width": vpw});
  state = true;
}
else{

  $("#" + id).css({"height": "500px", "width": "500px"});
  state = false;

}
  }

  function keepWindow(id){

    if($("#" + id).is(":visible")){

      $('#' + id).hide();

    }
    else{

      $('#' + id).show();
      appDrawer();
    }
    
    
  }

  var state = false;

  function appDrawer(){

    if(state == false){

      $("#apps").children().show();
      $("#apps").css({"width": "300px"});
      state = true;
    }
    else{

      $("#apps").children().hide();
      $("#apps").css({"width": "0px"});

      state = false;
    }
  }


  function closeWindow(id){
    
    $("#" + id).remove();
    $("#apps").children('*[data-wid="'+id+'"]').remove();
  }

window.onbeforeunload = function(){

  sessionStorage.clear();

}