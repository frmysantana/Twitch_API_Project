/*By: Fremy Santana
Last modified: September 18, 2017.

A page displaying the twitch streaming status of several users.
Created as part of the FreeCodeCamp curriculum. 

Future: Experiment with animations.

80characterLimit--------------------------------------------------------------*/

$(document).ready(function() {
  
  function channelInfo(channelJSON, name) {
    /* Creates a division displaying the channel's logo and name. Also turns
       the name into a link that takes one to that channel's twitch page.
       Lastly calls the twitchRequest function in order to get the channel's
       streaming information. This way the channel's division element is made 
       before the streamInfo function tries to alter it.
       
       Inputs: The JSON response containing the channel's information.
       Outputs: An element on the page containing the information.
    */
  
    var logoURL;
    
    //Check if the user has a logo; Display "N/A" if they don't.
    (channelJSON.logo !== null) ? logoURL = channelJSON.logo :
      logoURL = "https://image.flaticon.com/icons/svg/16/16096.svg";
    
    var twitchURL = channelJSON.url;
    var element ="<div class='container'><div id='" + name + "' class='row \
        streamer'><div class='col-lg-3'><img class='logo' src='" + logoURL +"' \
        alt='Channel Logo'></div><div class='col-lg-3'><a href='" +twitchURL+
        "' target='_blank'><h3>" + name + "</h3></a></div></div></div>";
    $("#ActiveStreamers").append(element);
    
    twitchRequest("streams/", name);
  };
  
  function streamInfo(streamJSON, name) {
    /* Inserts the channel's streaming information into that channel's 
       division element.
       
       Inputs: The JSON response containing the channel's streaming 
               information.
       Outputs: "Offline" if the channel isn't currently streaming, or a 
                description of the current stream that is included in the 
                JSON response.
    */
    var streamDetails; var status; var element;
    if(streamJSON.stream === null) {
      streamDetails ="Offline";
      status="Offline";
    } else{
      streamDetails = streamJSON.stream.channel.status; 
      status="Online";
    } 
    element = "<div class='col-lg-6'><p>" + streamDetails + "</p></div>";
    $("#" + name).addClass(status);
    $("#" + name).append(element);
  };
  
  function noChannel(name) {
    /* Creates a division stating that the account has closed or never existed.
       If an account searched for no longer exists.
       
       Input: The JSON response for the nonexistent channel.
       Output: A division element saying the account is closed or never existed.
    */

    $("#NoStreamers").append("<div class='container'><div class='no-streamer row\
        justify-content-center'><h3>"+ name +"'s account was closed or never\
        existed.<h3></div></div>")
  };
  
  function twitchRequest(callType, name) { 
    /* Performs the twitch API calls and sends the JSON response to the 
       relevant function.
       
       Inputs: Two strings, the first controls what kind of API call is made 
               (either asking for general channel information or stream 
               information) and the second controls which user the 
               information is asked about.
       Outputs: Nothing. If the call was asking about channel information, 
                the JSON is sent to either the noChannel or channelInfo 
                functions. Otherwise, the JSON is sent to the streamInfo 
                function.
    */
    $.ajax({
      url: "https://wind-bow.gomix.me/twitch-api/"+ callType + name +
            "?callback=?",
      dataType: 'json',
      success: function(data) {
        if (callType ==="channels/") {
          //Check if channel exists. Then sends JSON to appropriate
          //function.
          (data.status === 404) ? noChannel(name) : 
            channelInfo(data, name);
        } else {
          streamInfo(data, name)
        }
      },
      error: function(jqXHR, textStatus) {
        alert(textStatus + "; Check the console for details.");
        console.log(jqXHR.status, textStatus);
      }
    });
  };
  
  (function () {
     var users = ["ESL_SC2", "OgamingSC2", "cretetion", "FreeCodeCamp", 
                  "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", 
                  "brunofin", "comster404"];
     var usersLength = users.length;
     for (i=0; i < usersLength; i++) {
       twitchRequest("channels/", users[i]);
     };
  }());

  /*Event listeners for the three buttons, controling what group of 
  elements are shown.*/
  $("#Online").click(function() {
    $(".Online").removeClass("obfuscate");
    $(".Offline").addClass("obfuscate");
    $(".no-streamer").addClass("obfuscate");
  });

  $("#Offline").click(function() {
    $(".Offline").removeClass("obfuscate");
    $(".Online").addClass("obfuscate");
    $(".no-streamer").addClass("obfuscate");
  });

  $("#All").click(function() {
    $(".Online").removeClass("obfuscate");
    $(".Offline").removeClass("obfuscate");
    $(".no-streamer").removeClass("obfuscate");
  })
});
