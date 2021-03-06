var players = {};

var languages = [];

var players_loaded = 0;


function show_badges(index){

    $("#badges_"+index).fadeToggle("slow");
}


/* restart the page 
        delete datas
        reset the page
*/
function reload(){

    delete players[1];
    delete players[2];

    // delete
    $("#userinfo_1").remove();
    $("#userinfo_2").remove();

    // hide
    $("#reload").hide();
    $("#tie").hide();

    // clean input
    $("#player1_name").val("");
    $("#player2_name").val("");

    // show
    $("#input_1").show();
    $("#input_2").show();

    players_loaded = 0;

}

// This helper is used by the template to render the "badges" (lang - score).
Handlebars.registerHelper('list', function(items, options) {
  var badges = "";

  for( var lang in items ) {
    badges+= '<span class="green_badge">';

        // It may happen that the language can be 'null' because GitHub does not
        // understand the language used. I.e. if the repository is composed of various file
        // that are using different programming languages 
        if( lang == "null"){
            badges += '<b>N/A </b>';
        }else{
            badges += '<b>'+lang+' </b>';
        }
        badges += Number( items[lang].score).toFixed(2);
        badges += '</span>';
  }

  return badges;
});


// build and render the user div. It uses handlebarsjs template
function userTemplate(user_index)
{ 

    var source   = $("#user-template").html();
    var template = Handlebars.compile(source);

    var context = new Object();

    context.user_index = user_index;
    context.username = players[user_index].username;
    context.avatar_url = players[user_index].avatar_url;
    context.github_page = players[user_index].github_page;
    context.languages = players[user_index].languages;

    var html    = template(context);

    $('#player'+user_index).append( html );

}


function fight(){

    $("#fight").fadeOut();

    var score_1_tot = 0.0;
    var score_2_tot = 0.0;

    for(var i = 0; i < languages.length; i++){

        if(players[1].languages[languages[i]] != undefined)
            score_1_tot += parseFloat(players[1].languages[languages[i]].score);

        if(players[2].languages[languages[i]] != undefined)
            score_2_tot += parseFloat(players[2].languages[languages[i]].score);
        
    }

    $('#score_1').text(score_1_tot.toFixed(2));
    $('#score_2').text(score_2_tot.toFixed(2));
    $('#score_container_1').fadeIn();
    $('#score_container_2').fadeIn();


    // show the winner
    if(score_1_tot > score_2_tot){

        $('#winner_ribbon_1').fadeIn();
       
    }else if( score_1_tot < score_2_tot ){ 

        $('#winner_ribbon_2').fadeIn(); 

    }else{ // we've a tie/draw

        $("#tie").fadeIn("slow");

    }    

    $("#reload").show();

}


function getUserInfo(player_number)
{

    var username = $("#player"+player_number+"_name").val();

    if(username == "")
        return;
   
    players[player_number] = new Object();
    players[player_number].username = username;
    players[player_number].avatar_url = "";
    players[player_number].github_page = "";
    players[player_number].languages = new Array();

    // not every user has some repos so it is useless to get the avatar from
    // the repo.owner.avatar_url field
    $.getJSON("https://api.github.com/users/"+username, function(data){
        players[player_number].avatar_url = data.avatar_url;
        players[player_number].github_page = data.html_url;
                
    });

    $.getJSON("https://api.github.com/users/"+username+"/repos", function(data){

        for( var i = 0; i < data.length -1; i++)
        {
            var stars = data[i].stargazers_count;
            var forks = data[i].forks;
            var watchers = data[i].watchers;

            // this repo is not created by the user
            var was_forked = data[i].forked;

            if( languages.indexOf(data[i].language) == -1)
                languages.push(data[i].language);

            if( players[player_number].languages[data[i].language] == undefined ) {
                players[player_number].languages[data[i].language] = {};
                players[player_number].languages[data[i].language].score = 0.0;
                players[player_number].languages[data[i].language].repos_count = 0;
            }

            players[player_number].languages[data[i].language].repos_count++;

            if(was_forked){
                // check if the user has done some pull or contribution to the original repo
                // add a component
            }

            var score =  parseFloat(stars + forks + 0.2*watchers);
            players[player_number].languages[data[i].language].score += score;
        }

        // hide the input part
        $("#input_"+player_number).hide();
        //$('#player'+player_number).append( buildUserDiv(player_number));
        userTemplate(player_number);

        players_loaded+= 1;
        if(players_loaded == 2){
            // set visible "fight" button
            $("#fight").fadeIn("slow");
        }

    }).error(function() { // the user does not exists
        alert("The user "+username+" does not exists!!!");
    });

}


$(document).ready( function()
{

    // bind event onclick on input "text"
    $("#player1_name").keyup(function(e){
         
            e.stopPropagation();   
            // No need to do anything if it's not the enter key
            // Also only e.which is needed as this is the jQuery event object.
            if (e.which != 13 ) {
                return;
            }
                           
            getUserInfo(1);
        });

    $("#player2_name").keyup(function(e){
         
            e.stopPropagation();   
            // No need to do anything if it's not the enter key
            // Also only e.which is needed as this is the jQuery event object.
            if (e.which != 13 ) {
                return;
            }
                           
            getUserInfo(2);
        });

});
