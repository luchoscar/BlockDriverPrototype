#pragma strict

class HUD extends MonoBehaviour
{
	/*** Variables ***************************************************************/
	var debuging : boolean;
	
	enum SCENE_TYPE {INTRO, GAME, SCORE}
	var currentScene : SCENE_TYPE;
	
	enum SPEED_FORMAT {MILES, KILOMETERS}
	static var speedFormat : SPEED_FORMAT;
	
	var timeCounter : float = 0.0;
	
	var speedHUD : GUIText;
	var timerHUD : GUIText;
	var powerHUD : GUIText;
	
	var ship : Transform;
	
	var MILES : float = 0.621371;
	var speedy : float;
	
	var sceneLevel : int;
	
	/*****************************************************************************/
	
	/*** Unity Functions *********************************************************/
	function Awake()
	{
		if (debuging)
		{
			Debug.Log((GameUtilities.maxScore.name == null) + " - " + GameUtilities.maxScore.time + " - " + GameUtilities.maxScore.speed);
		
			for (var i : int = 0; i < 5; i++)
			{
				Debug.Log(i + " --> " + GameUtilities.runnerUps[i] + " " + (GameUtilities.runnerUps[i] == null));
			}
		}
		
		currentScene = SCENE_TYPE.INTRO;
		
		speedFormat = SPEED_FORMAT.MILES;
		
		DontDestroyOnLoad (this.gameObject);
	}
	
	function Start()
	{
		if (timerHUD == null)
			timerHUD = GameObject.FindGameObjectWithTag("TimerHUD").guiText;
			
		if (speedHUD == null)
			speedHUD = GameObject.FindGameObjectWithTag("SpeedHUD").guiText;
		
		if (powerHUD == null)
			powerHUD = GameObject.FindGameObjectWithTag("PowerUpHUD").guiText;
			
		GameUtilities.playing = false;
		
		timerHUD.enabled = false;
		speedHUD.enabled = false;
		powerHUD.enabled = false;
	}
	
	function Update () 
	{
		if (GameUtilities.playing)// && ship != null)
		{
			timeCounter += Time.deltaTime;
			FormatTime();
			
			//speedy = ship.GetComponent(ShipMovement).direction.magnitude;
				
			FormatSpeed();
			
			powerHUD.text = ship.GetComponent(ShipStateMachine).currentState.ToString();
		}
	}
	
	function OnGUI () 
	{
		#if UNITY_ANDROID
		GUI.Label(MyUtilities.MyRectangle(0.1, 0.10, 0.5, 0.1), "X Acceleraion = " + Input.acceleration.x);
		GUI.Label(MyUtilities.MyRectangle(0.1, 0.15, 0.5, 0.1), "Y Acceleraion = " + Input.acceleration.y);
		GUI.Label(MyUtilities.MyRectangle(0.1, 0.20, 0.5, 0.1), "Z Acceleraion = " + Input.acceleration.z);
		#endif
		
    	switch (currentScene)
    	{
    		case SCENE_TYPE.INTRO:
    			if (GUI.Button (Rect (400,200,150,50), "Play Level"))
        		{
        			Application.LoadLevel(1);
        		}
        		
        		/*
        		if (GUI.Button (Rect (400,200,150,50), "Level 1"))
        		{
        			Application.LoadLevel(1);
        		}
        		else if (GUI.Button (Rect (600,200,150,50), "Level 2"))
        		{
        			Application.LoadLevel(2);
        		}
        		*/
        	break;
        	case SCENE_TYPE.GAME:
        	break;
        	case SCENE_TYPE.SCORE:
        		if (GUI.Button (Rect (400,200,150,50), "Play Again"))
        		{
        			Application.LoadLevel(sceneLevel);
        		}
        		if (GUI.Button (Rect (600,200,150,50), "Back To Menu"))
        		{
        			Destroy(this.gameObject);
        			Application.LoadLevel(0);
        		}
        	break;
        }
	}
	
	function OnLevelWasLoaded (level : int) 
	{
		sceneLevel = level;
		
    	switch(level)
    	{
        	case 0:
        	break;
        	default:
        		ship = GameObject.FindGameObjectWithTag("Ship").transform;currentScene = SCENE_TYPE.GAME;
        		
        		GameUtilities.playing = true;
        		
        		timerHUD.enabled = true;
				speedHUD.enabled = true;
				powerHUD.enabled = true;
				
				timeCounter = 0.0;
        	break;
    }
}
	/*****************************************************************************/
	
	/*** My Functions ************************************************************/
	
	//function to perform a state of the HUD
	function DoState()
	{
	}
	
	//format time to minutes : seconds
	function FormatTime()
	{
		var minutes : String = Mathf.Floor(timeCounter / 60).ToString("00");
		var seconds : String = Mathf.Floor(timeCounter % 60).ToString("00");
		var miliseconds : String = Mathf.Floor((timeCounter - Mathf.Floor(timeCounter)) * 100).ToString("00");
			
		timerHUD.text = minutes + " : " + seconds + " : " + miliseconds;
	}
	
	//format speed to km/h or mph
	function FormatSpeed()
	{
		if (ship != null)
			var speed : float = ship.GetComponent(ShipMovement).speed;
		
		switch(speedFormat)
		{
			case SPEED_FORMAT.MILES:
				speed *= MILES;
				speedHUD.text = speed.ToString("F2") + " mph"; 
				break;
			case SPEED_FORMAT.KILOMETERS:
				speedHUD.text = speed.ToString("F2") + " km/h";
				break;
		}
	}
	
	//set speed format
	function SetFormat(In_format : int)
	{
		if (In_format > 1 || In_format < 0)
			Debug.Log("Format index outside array range");
			
		switch(In_format)
		{
			case 0:
				speedFormat = SPEED_FORMAT.MILES; 
				break;
			case 1:
				speedFormat = SPEED_FORMAT.KILOMETERS; 
				break;
		}
	}
	
	/*****************************************************************************/
}