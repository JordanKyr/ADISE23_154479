//global μεταβλητές

var me={};                      
var game_status={};
var count_ships=0;
var ships_placed_flag=0;
var game_ended_flag=0;

$( function() {
    $('#battleships_login').click(login_to_game);



   
    $('#target_title').hide();              
    $('#fleet_title').hide();
    
    $('#do_place').click( do_place);     //κουμπί-μέθοδος για τοποθέτηση πλοίου
   
    $('#do_hit').click( do_hit);         //κουμπί-μέθοδος για χτύπημα

    $('#projection_reset').click(reset_projection);

    $('#place_div').hide();
    $('#hit_div').hide();
    

});

function draw_ship_info_table(){                    //δημιουργία πίνακα για τα στοιχεία πλοίων
    var t3='<table id="table_ship_info">';
    for(var i=1; i<=5; i++) {
        
        t3 += '<tr>';
        for(var j=1; j<=3; j++) {
            t3 += '<td class="table_ship_inform" id="square_info_'+i+'_'+j+'">'+i+','+j+'</td>';
        }
        t3+='</tr>';

    }
    t3+='</table>';
    $('#ships_info').html(t3);

    $('#square_info_1_1').html('<img src="./images/carrier.png" alt="hit_image" ></img>');
    $('#square_info_2_1').html('<img src="./images/battleship.png" alt="hit_image" ></img>');
    $('#square_info_3_1').html('<img src="./images/cruiser.png" alt="hit_image" ></img>');
    $('#square_info_4_1').html('<img src="./images/submarine.png" alt="hit_image" ></img>');
    $('#square_info_5_1').html('<img src="./images/destroyer.png" alt="hit_image" ></img>');


}


function fill_ships(){      //γέμισμα πίνακα πλοίων με ajax call
    $.ajax({
        type: 'GET',
        url: "battleships.php/ships/",
        headers: {"X-Token": me.token},
        success: fill_ships_by_data  
       
      });

}


function fill_ships_by_data(data){


var i=1;
    for(var j=0; j<5; j++ ){
     var ship_info=data[j];





                    var id = '#square_info_' + i + '_2';
                   
                    $(id).html(ship_info.ship_name);

                    id='#square_info_'+ i +'_3';
                    $(id).html(ship_info.ship_size + ' spots' );

        i++;
                }

            
}


function draw_start_table() {          //δημιουργία πίνακα για target και projection 
	     
    var t2='<table id="table_target">';
	for(var i=1; i<=10 ; i++) {

		t2 += '<tr>';
		for(var j=1; j<=10; j++ ) {
			t2 += '<td class="table_square_target" id="square_target_'+i+'_'+j+'">' + i +','+j+'</td>'; 
		}
		t2+='</tr>';
	}
	t2+='</table>';
	
	$('#target').html(t2);


	var t='<table id="game_table">';
	for(var i=1; i<=10 ; i++) {

		t += '<tr>';
		for(var j=1; j<=10; j++ ) {
			t += '<td class="table_square" id="square_'+i+'_'+j+'">' + i +','+j+'</td>'; 
		}
		t+='</tr>';
	}
	t+='</table>';
	
	$('#projection').html(t);




}




function reset_projection(){   //αρχικοποίηση παιχνιδιού
  
    alert("Game Reseted!")       //ajax call POST 
    $.ajax({
        type: 'POST',
        url: "battleships.php/projection/", 
        headers: {"X-Token": me.token},
        success: fill_projection_by_data  
       
      });
      $('#game_initializer').show();
      $('#place_div').hide();
      $('#hit_div').hide();
      $('#game_info').hide();
      $('#projection').hide();
      $('#target').hide();
      $('#target_title').hide();
      $('#fleet_title').hide();
      $('#table_ship_info').hide();
      
  
}


function fill_projection() {
                                 //κάλεσμα ajax για εισαγωγή στοιχείων target & projection
     
    $.ajax({           
            type: 'GET',
            url: "battleships.php/projection/",
            headers: {"X-Token": me.token},
            success: fill_projection_by_data  
           
          }
            
     
    );
 

}

function fill_projection_by_data(data){
                
                        //εισαγωγή στοιχείων target & projection

    var projection_array=data.slice(0,100);
                                                //ενας πίνακας για το projection και ένας για target

    var targets_array=data.slice(100,200);





    for(var y=0; y<projection_array.length; y++){
    
        var p = projection_array[y];
       

     let i=y;

        for( ; i<100; i++)
        {
            
            var o = projection_array[i];
            
           
            var id = '#square_' + o.x_p + '_' + o.y_p;
            
            
            if(o.cell_status=='1') {          //αντίστοιχες εικόνες στα κελιά με πλοία

                    switch(o.ship_name){
                        case 'Carrier': $(id).html('<img src="./images/carrier.png" alt="carrier_image" ></img>') ;  break;
                        case 'Battleship': $(id).html('<img src="./images/battleship.png" alt="battleship_image" ></img>') ;  break;
                        case 'Cruiser': $(id).html('<img src="./images/cruiser.png" alt="cruiser_image" ></img>') ;  break;
                        case 'Submarine': $(id).html('<img src="./images/submarine.png" alt="submarine_image" ></img>') ;  break;
                        case 'Destroyer': $(id).html('<img src="./images/destroyer.png" alt="destroyer_image" ></img>') ;  break;
                        default: $(id).html(''); break;
                    }

            }else { $(id).html('');}


        
        }
    }
    

    for(var y=0; y<targets_array.length; y++){
    
        var t = targets_array[y];
        

     let i=y;

        for( ; i<100; i++)
        {
            
            var o = targets_array[i];
            
                                                                                        //o 1 vlepei to target toy 2

            var id = '#square_target_' + o.x_t + '_' + o.y_t;
            //var c = (o.target_status=='not_specified') ?  '' :'1';

            var c =o.target_status;                             //αντίστοιχες εικόνες στα κελιά που έχουν χτυπηθεί
            switch(c){
                case 'not_specified': $(id).html(''); 
                break;
                case 'hit':
                        $(id).html('<img src="./images/hit.png" alt="hit_image" ></img>') ;
                break;


                case 'miss': 
                         $(id).html('<img src="./images/miss.png" alt="miss_image" ></img>');
                break;
                default: 
                 $(id).html(''); break;

            }

           

        
        }
    }
    

}


function login_to_game() {
	if($('#username').val()=='') {
		alert('You have to set a username');    //login ajax call PUT με τα στοιχεία του παίκτη
		return;
	}
	var p_id = $('#player_id').val();
	//draw_start_table(p_id);
	//fill_projection();
	
	$.ajax({
            type: 'PUT',
            url: "battleships.php/players/"+p_id, 
			
			dataType: "json",
			contentType: 'application/json',
			data: JSON.stringify( {username: $('#username').val(), player_id: p_id}),
            headers: {"X-Token": me.token},
			success: login_result,
			error: login_error});
}

function login_result(data) {
    me = data[0];                                  //εμφάνιση πινάκων και στοιχείων μετά το login
    draw_start_table();
    fill_projection();
	
	$('#game_initializer').hide();
	update_info();
	game_status_update();
    $('#game_info').show();
    $('#projection').show();
    $('#target').show();
    $('#place_div').show();

    draw_ship_info_table();
    fill_ships();
    $('table_ship_info').show();
    
    $('#target_title').show();
    $('#fleet_title').show();
}


function login_error(data,y,z,c) {
	var x = data.responseJSON;
	alert(x.errormesg);
}

function update_info(){      //κείμενο για επιστροφή στοιχείων παίκτη και παιχνιδιού
   
    if(game_ended_flag==0){
	$('#game_info').html("I am Player: "+me.player_id+", my name is "+me.username +'<br>Token='+me.token+'<br>Game state: '+game_status.game_stat+', '+ game_status.p_turn+' must play now.');
    }
    else{
    $('#game_info').html("I am Player: "+me.player_id+", my name is "+me.username +'<br>Token='+me.token+'<br>Game state: '+game_status.game_stat+', '+ game_status.result+'.');

    }
}





function game_status_update() {                   
	$.ajax({url: "battleships.php/game_status/",headers: {"X-Token": me.token}, success: update_status });
}

function update_status(data) {    //ενημέρωση game status 
	game_status=data[0];
	update_info();
    
    if(game_status.game_stat=='ships_placed' && ships_placed_flag==0)      //περίπτωση που έχουν τοποθετηθεί όλα τα πλοία
    {
            alert("Both Players Placed all the Ships");                                             
            ships_placed_flag=1;
           
    }else if(game_status.game_stat=='ships_placed' && ships_placed_flag==1 && game_status.p_turn==me.player_id){
                                                        //αν έχουν τοποθετηθεί τα πλοία παιρνάμε στη φάση χτυπημάτων και εμφανίζεται το input για τις συντεταγμένες
        $('#hit_div').show(500);
    }
    else {   $('#hit_div').hide(500);}

	if(game_status.p_turn==me.player_id &&  me.player_id!=null && ships_placed_flag==0) {
		x=0;
		// do play                                                  //μετά το login το input για τοποθέτηση πλοίου
		$('#place_div').show(500);
		setTimeout(function() { game_status_update();}, 15000);
	} else {
		// must wait for something
		$('#place_div').hide(500);
		setTimeout(function() { game_status_update();}, 4000);
	}
    
    if(game_status.p_turn==1 && game_status.game_stat=='ended' && game_ended_flag==0) {
        alert("1st Player Wins! Game Ended");                                               //έλεγχος νικητή
        game_ended_flag=1; 
        }
    
        if(game_status.p_turn==2 && game_status.game_stat=='ended' && game_ended_flag==0 ) {
            alert("2nd Player Wins! Game Ended"); 
            game_ended_flag=1; 
          }
  }






function do_place() {
        
 if(count_ships<5){                                                     //καλεί ajax PUT για να στείλει τα στοιχεία τοποθέτησης πλοίου
            var s = $('#place_ship').val();
            
            var a = s.trim().split(/[ ]+/);
            
                    if(a.length!=5) {
                        alert('Must give a ship name and 4 numbers');
                        return;
                    }
                    $.ajax({url: "battleships.php/ships/ship_name/"+a[0], 
                            type: 'PUT',
                            dataType: "json",
                            contentType: 'application/json',
                            data: JSON.stringify( {start_row: a[1], start_col: a[2], end_row: a[3], end_col: a[4]}),
                            headers: {"X-Token": me.token},
                            success: move_result,
                            error: login_error});
                    

                }
            }
            
     

                                        //επιστρέφει τον πίνακα μετά την τοποθέτηση πλοίου
function move_result(data) 
{
    fill_projection_by_data(data);
    count_ships++;

    if(count_ships==5) {
        alert('You have placed all your ships'); 
        $('#place_div').hide(500);


        $.ajax({url: "battleships.php/game_status/placed_ships",headers: {"X-Token": me.token}, success: update_status });

        }
 
}



function do_hit(){                                  //μέθοδος για έναρξη διαδικασίας χτυπήματος
    var s = $('#hit_ship').val();                      
    var a = s.trim().split(/[ ]+/);
                                                        //έλεγχος στοιχείων που έδωσε ο χρήστης, έλεγχος για x και y
    if(a.length!=2) {
        alert('Must give two coordinates X & Y');
        return;
    }

    $.ajax({url: "battleships.php/ships/hit_ship/"+a[0]+'/'+a[1],           //ajax call για να στείλω request τα input που έδωσε ο χρήστης
                            type: 'GET',
                            dataType: "json",
                            contentType: 'application/json',
                            headers: {"X-Token": me.token},
                            success: hit_result,
                            error: login_error});
                    


}

function hit_result(data)           //επιστροφή κατάστασης πινάκων μετά το χτύπημα πλοίου.
{


    fill_projection_by_data(data);
  //  update_status(data);
}
