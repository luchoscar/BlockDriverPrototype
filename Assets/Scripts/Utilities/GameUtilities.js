#pragma strict

static class GameUtilities
{
	var zeroValue : float = 0.0001;
	var playing : boolean;
	var animeteBlock : boolean = false;
	var playerDeath : boolean = false;
		
	/***My Structures**********************************************************/
	class PLAYERS extends System.ValueType
	{
    	var name : String;
    	var time : float;
    	var speed : float;
    	     
    	function PLAYERS(In_name : String, In_time : float, In_speed : float)
    	{
    		this.name = In_name;
    		this.time = In_time;
    		this.speed = In_speed;
    	}
    	
    	function CopyPlayer(In_record : PLAYERS)
    	{
    		this.name = In_record.name;
    		this.time = In_record.time;
    		this.speed = In_record.speed;
    	}
    }
    
    var newRecord : boolean = false;
    var maxScore : PLAYERS;
    var currentPlayer : PLAYERS;
    var runnerUps : PLAYERS[] = new PLAYERS[5];
    
    /**************************************************************************/
    
    /***My Functions***********************************************************/
	//check for vector magnitude <> 0
	function ValidateVector(In_vect : Vector3) : boolean
	{
		return (In_vect.magnitude <= zeroValue);
	}
	
	function NewMaxTime() : boolean
	{
		return (maxScore.time < currentPlayer.time);
	}
	
	function NewMaxSpeed() : boolean
	{
		return (maxScore.speed < currentPlayer.speed);
	}
	
	//takes to records (PLAYERS) and compares their time and speed
	//returns whether the new record is above or below existing record
	function CompareRecords(In_player : PLAYERS, In_newPlyaer : PLAYERS) : boolean
	{
		if (In_player.time > In_newPlyaer.time) return false;
		else if (In_player.time == In_newPlyaer.time && In_player.speed > In_newPlyaer.speed) return false;
		else return false;
	}
	
	//if new records is within top 6 players, it enters the record and returns true;
	//else returns false
	function EnterNewRecord() : boolean
	{
		var recordEntered : boolean = false;
		
		if (newRecord)
		{
			//check for first player playing game
			if (maxScore.name == null)
			{
				maxScore.CopyPlayer(currentPlayer);
			}
			//check to see if record is not within top 6
			else 
			{
				//loop through records array to see if there is a need to add
				for (var rec : int = 0; rec < 5; rec++)
				{
					//if record is empty compare with current
					if (runnerUps[rec].name != null)
					{
					}
					//add current to empty record
					else
					{
						runnerUps[rec].CopyPlayer(currentPlayer);
					}
				}			
			}
			
			newRecord = false;
		}
		
		return recordEntered;
	}
	
	//set current playthrough as a record for comparation
	function SetNewRecord(In_name : String, In_time : float, In_speed : float)
	{
		currentPlayer.name = In_name;
    	currentPlayer.time = In_time;
    	currentPlayer.speed = In_speed;
    	
    	newRecord = true;
    	
    	EnterNewRecord();
	}
	
	/**************************************************************************/
}