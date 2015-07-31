var players = {};

var languages = [];

var players_loaded = 0;



function show_badges(index){

    $("#badges_"+index).fadeToggle("slow");
}


function show_tie(){


}


function buildUserDiv(user_index)
{
    // use template and MustacheJS except for the badges part. For now just use js.
    var div =   '<div class="user_info text-center">\
                    <div>\
                        <div>\
                            <a target="_blank" href="'+players[user_index].github_page+'">\
                                <img class="img-circle avatar" id="avatar_'+players[user_index].username+'" src="'+players[user_index].avatar_url+'">\
                            </a>\
                        </div>\
                    </div>\
                        <div class="non-semantic-protector" id="winner_ribbon_'+user_index+'" style="display:none; margin-top: -80px;"> \
                            <div class="ribbon">\
                                <strong class="ribbon-content" id="ribbon_text_'+user_index+'">WINNER</strong>\
                            </div>\
                        </div>\
                    <div>\
                        <h2>'+players[user_index].username+'</h2>\
                        <div id="score_container_'+user_index+'" style="display:none;">\
                            <div class="score_title">SCORE</div>\
                            <div onclick="show_badges('+user_index+')" class="score_value" id="score_'+user_index+'"></div>\
                            <div id="badges_'+user_index+'" style="display:none;">';

    for(var lang in players[user_index].languages){
        div+= '<span class="green_badge">';

        // It may happen that the language can be 'null' because GitHub does not
        // understand the language used. I.e. if the repository is composed of various file
        // that are using different programming languages 
        if( lang == "null"){
            div+= '<b>N/A </b>';
        }else{
            div+= '<b>'+lang+' </b>';
        }
        div+= Number(players[user_index].languages[lang].score).toFixed(2);
        div+= '</span>';
    }



    div +=                  '</div>\
                        </div>\
                    </div>\
                </div>';



    return div;
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

        /*$("#ribbon_text_1").text("DRAW");
        $("#ribbon_text_2").text("DRAW");

        $('#winner_ribbon_1').fadeIn(); 
        $('#winner_ribbon_2').fadeIn(); */
    }    

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
        $('#player'+player_number).append( buildUserDiv(player_number));

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
