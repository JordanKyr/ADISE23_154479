<?php 



function handle_user($method, $b,$input) {
	if($method=='GET') {							
		show_user($b);
	} else if($method=='PUT') {
        set_user($b,$input);
    }
}

function show_user($b) {
	global $mysqli;														//επιστροφή στοιχείων παίκτη
	$sql = 'select player_id,username from players where player_id=?';
	$st = $mysqli->prepare($sql);
	$st->bind_param('s',$b);
	$st->execute();
	$res = $st->get_result();
	header('Content-type: application/json');
	print json_encode($res->fetch_all(MYSQLI_ASSOC), JSON_PRETTY_PRINT);
}

function set_user($b, $input){

																	//εισαγωγή στοιχείων παίκτη
	if(!isset($input['username']) || $input['username']=='') {
		header("HTTP/1.1 400 Bad Request");
		print json_encode(['errormesg'=>"No username given."]);
		exit;
	}
	$username=$input['username'];
	global $mysqli;
	$sql = 'select count(*) as c from players where player_id=? and username is not null';
	$st = $mysqli->prepare($sql);
	$st->bind_param('s',$b);
	$st->execute();
	$res = $st->get_result();
	$r = $res->fetch_all(MYSQLI_ASSOC);
	if($r[0]['c']>0) {															//έλεγχος τιμών
		header("HTTP/1.1 400 Bad Request");
		print json_encode(['errormesg'=>"Player $b is already set. Please select another player."]);
		exit;
	}
	$sql = 'update players set username=?, token=md5(CONCAT( ?, NOW()))  where player_id=?';
	$st2 = $mysqli->prepare($sql);
	$st2->bind_param('sss',$username,$username,$b);
	$st2->execute();


	
	update_game_status();									//ενημέρωση game_status
	$sql = 'select * from players where player_id=?';
	$st = $mysqli->prepare($sql);
	$st->bind_param('s',$b);
	$st->execute();
	$res = $st->get_result();
	header('Content-type: application/json');
	print json_encode($res->fetch_all(MYSQLI_ASSOC), JSON_PRETTY_PRINT);
	
	

}



function current_player($token) {				//επιστρέφει τον τρέχον παίκτη
	

	global $mysqli;
	if($token==null) {return(null);}
	$sql = 'select * from players where token=?';
	$st = $mysqli->prepare($sql);
	$st->bind_param('s',$token);
	$st->execute();
	$res = $st->get_result();
	if($row=$res->fetch_assoc()) {
		return($row['player_id']);
	}return null;


}
?>