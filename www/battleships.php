<?php

require_once "../lib/projection.php";
require_once "../lib/dbconnect.php";
require_once "../lib/game.php";
require_once "../lib/users.php";
require_once "../lib/ships.php";

$method = $_SERVER['REQUEST_METHOD'];

$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));                       //παίρνω request
 // $request = explode('/', trim($_SERVER['SCRIPT_NAME'],'/')); 
// Σε περίπτωση που τρέχουμε php–S 

        $input = json_decode(file_get_contents('php://input'),true);
        if($input==null) {
            $input=[];                                                      //παίρνω input
        }


        if(isset($_SERVER['HTTP_X_TOKEN'])) {                           //παίρνω το token
            $input['token']=$_SERVER['HTTP_X_TOKEN'];
        } else {
            $input['token']=''; 
        }

switch ($r=array_shift($request)) {
    
    case 'projection' :                                 //ajax calls switch cases
        switch ($b=array_shift($request)) {
            case '':
            case null: handle_projection($method,$input); 
                break;
            
            default: header("HTTP/1.1 404 Not Found"); break;
        } break; 
        
    case 'game_status':                                
            switch ($u=array_shift($request)){ 
                case '':
                case null:        
                        if(sizeof($request)==0) {handle_game_status($method);}
                        else {header("HTTP/1.1 404 Not Found");}
			            break;
                case 'placed_ships': handle_placed_ships($method, $input);
                    break;
                default: header("HTTP/1.1 404 Not Found"); break;   
            }break;
    case 'players': handle_players($method, $request,$input);
			    break;

    case 'ships': 
            switch ($c=array_shift($request)) {
                case '':
                case null: handle_ships($method); 
                    break;
                case 'ship_name': handle_ship_name($method,$request[0], $input);
                    break;
                case 'hit_ship': handle_hit_ship($method,$request[0],$request[1],$input); break;
                default: header("HTTP/1.1 404 Not Found"); break; }
        break;}



    function handle_projection($method,$input) {        //GET projection εμφάνιση πίνακα
        if($method=='GET') {
                show_projection($input['token']);
               

        } else if ($method=='POST') {              //POST projection reset το παιχνίδι, εμφάνιση πίνακα
                reset_game($input['token']);
        } else {
            header('HTTP/1.1 405 Method Not Allowed');
        }
        
    }

    function handle_game_status($method) {
        if($method=='GET') {                    //GET game status για επιστροφή κατάστασης παιχνιδιού
            show_game_status();
        } else {
            header('HTTP/1.1 405 Method Not Allowed');
        }
    }


    function handle_ships($method) {

        if($method=='GET') {                //GET ships για επιστροφή πλοίων
            show_ships();
        } else {
            header('HTTP/1.1 405 Method Not Allowed');
        }


    }

    function handle_players($method, $p,$input) {
        
        if($method=='PUT'){ 
        switch ($b=array_shift($p)) {                               //PUT εισαγωγή στοιχείων παίκτη

         
            case '1': 
            case '2': handle_user($method, $b,$input);
                        break;
            default: header("HTTP/1.1 404 Not Found");
                     print json_encode(['errormesg'=>"Player $b not found."]);
                     break;
        } }
        else { 
            header("HTTP/1.1 400 Bad Request"); 
            print json_encode(['errormesg'=>"Method $method not allowed here."]);
                 
        }
    }

 
    function handle_ship_name($method,$ship_name, $input){
        
        
                                                                        //PUT εισαγωγή/τοποθέτηση πλοίων
        if ($method=='PUT'){
            place_ship($ship_name, $input['start_row'], $input['start_col'], $input['end_row'], $input['end_col'], $input['token']  );
        } else {
            header('HTTP/1.1 405 Method Not Allowed');
        }
      

   

    }
    
function handle_placed_ships($method, $input){
    if($method=='GET'){
        placed_ships($input['token']);                      //GET επιστροφή κατάστασης τοποθετημένων πλοίων


    } 
    else {
            header('HTTP/1.1 405 Method Not Allowed');
        }

}

                                                        //GET επιστροφή πίνακα μετά από ενημέρωση χτυπήματος
function handle_hit_ship($method, $x, $y,$input){
    if($method=='GET'){
        hit_ship($x,$y,$input['token']);
    }
    else{
        header('HTTP/1.1 405 Method Not Allowed');
    }

}
?>