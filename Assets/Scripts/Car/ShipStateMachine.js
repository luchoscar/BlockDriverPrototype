#pragma strict

/************************************************************************
 * 																		*
 * By Luis Saenz														*
 * Control Power Up states												*
 *	-Flash --> instant increse/decrese of forward speed					*
 *	-Flight --> levitate ship for a specific amount of Time				*
 *	-Flip --> flip all blocks upside down for a specific amount of Time	*
 *																		*
 ************************************************************************/
 
class ShipStateMachine extends MonoBehaviour
{
	/*** Variables ***************************************************************/
	var debugging : boolean;
	
	enum PowerState {FLYING, FLIPPED, SPEEDING, FLIP, SPEED, FLIGHT, NONE}
	var currentState : PowerState;
	
	var currentTime : float;						//time when power up has been apply
	var powerTime : float[];						//amount of time of power up
													//[0] --> time spent on flying
													//[1] --> time before fliping blocks after power up is triggered
													//[2] --> time spent using SPEED boost: 10% accelerating, 80% mantaining sped, 10% desaccelerating 
										
	var accelerationBoost : float;					//value to scale movement acceleration for SPEED power up
	var recordedSpeed : float;						//record speed before using SPEED power up
	var movement : ShipMovement;
	
	var twoFingersSwip : boolean;
	
	/*****************************************************************************/
	
	/*** Unity Functions *********************************************************/
	
	function Awake () 
	{
		currentState = PowerState.NONE;
		
		if (movement == null)
			movement = transform.GetComponent(ShipMovement);
	}

	function Update () 
	{
		if (debugging)
		{
			if (Input.GetKeyUp(KeyCode.Alpha1) || Input.GetKeyUp(KeyCode.Keypad1))
			{
				currentState = PowerState.FLIGHT;
			}
			else if (Input.GetKeyUp(KeyCode.Alpha2) || Input.GetKeyUp(KeyCode.Keypad2))
			{
				currentState = PowerState.FLIP;
			}
			else if (Input.GetKeyUp(KeyCode.Alpha3) || Input.GetKeyUp(KeyCode.Keypad3))
			{
				currentState = PowerState.SPEED;
			}
		}
		
		if (Input.GetKeyUp(KeyCode.Mouse0))
		{
			StartPowerState();
		}
		else if (Input.GetKeyUp(KeyCode.Mouse1))
		{
			currentState = PowerState.NONE;
			movement.gravity = movement.const_Gravity;
			movement.acceleration = movement.const_Acceleration;
		}
		
		#if UNITY_ANDROID
		if (Input.touchCount == 2 && Input.GetTouch(0).phase == TouchPhase.Began && Input.GetTouch(1).phase == TouchPhase.Began && Input.GetTouch(0).phase == TouchPhase.Moved && Input.GetTouch(1).phase == TouchPhase.Moved)
		{
			if (Input.GetTouch(0).deltaPosition.magnitude > 0.0 && Input.GetTouch(1).deltaPosition.magnitude > 0.0)
			{
				twoFingersSwip = true;
				currentState = PowerState.NONE;
				movement.gravity = movement.const_Gravity;
				movement.acceleration = movement.const_Acceleration;
			}
		}
		else if (Input.touchCount == 2 && Input.GetTouch(0).phase == TouchPhase.Began && Input.GetTouch(1).phase == TouchPhase.Began && !twoFingersSwip)
		{
			StartPowerState();
		}
		
		twoFingersSwip = false;
		
		#endif
		
		DoPowerState();
	}
	
	/*****************************************************************************/
	
	/*** My Functions ************************************************************/
	
	//function to select power state
	function SetPowerState(In_tag : String)
	{
		if (In_tag == "Speed")
		{
			currentState = PowerState.SPEED;
		}
		else if (In_tag == "Flip")
		{
			currentState = PowerState.FLIP;
		}
		else if (In_tag == "Flight")
		{
			currentState = PowerState.FLIGHT;
		}
	}
	
	//function to start using power up 
	//power ups that can be excecuted by implementing yield instructions
	function StartPowerState()
	{
		switch(currentState)
		{
			case PowerState.FLIGHT:
				currentState = PowerState.FLYING;
				movement.verticalSpeed = movement.jumpSpeed * 2.0;
				currentTime = Time.time;
				break;
			case PowerState.FLIP:
				GameUtilities.animeteBlock = true;
				currentState = PowerState.NONE;
				var timeFlip : int = powerTime[currentState];
				yield WaitForSeconds(timeFlip);
				GameUtilities.animeteBlock = true;
				currentState = PowerState.NONE;
				break;
			case PowerState.SPEED:
				currentState = PowerState.SPEEDING;
				recordedSpeed = movement.speed;
				movement.acceleration = movement.const_Acceleration * accelerationBoost;
				yield WaitForSeconds(powerTime[currentState] * 0.60);
				movement.acceleration = 0.0;
				if (currentState == PowerState.SPEEDING)
				{
					yield WaitForSeconds(powerTime[currentState] * 0.20);
				}
				movement.acceleration = movement.const_Acceleration * accelerationBoost * -1.0;
				if (currentState == PowerState.SPEEDING)
				{
					yield WaitForSeconds(powerTime[currentState] * 0.20);
				}
				movement.acceleration = movement.const_Acceleration;
				currentState = PowerState.NONE;
				break;
			case PowerState.NONE:
				break;
		}
	}
	
	//function to excecute certain power ups
	//Flight --> check when vertical speed ~ 0.0 to suspend gravity
	function DoPowerState()
	{
		switch(currentState)
		{
			case PowerState.FLYING:
				if (movement.verticalSpeed <= GameUtilities.zeroValue)
					movement.gravity = 0.0;
				if (Time.time - currentTime >= powerTime[currentState])
				{
					currentState = PowerState.NONE;
					movement.gravity = movement.const_Gravity;
				}
				break;
			case PowerState.FLIP:
				break;
			case PowerState.SPEED:
				break;
			case PowerState.NONE:
				break;
		}
	}
	
	//function to end power up
	function EndPowerUp()
	{
		if (Time.time - currentTime >= powerTime[currentTime])
		{
			switch(currentState)
			{
				case PowerState.FLIGHT:
					movement.gravity = movement.const_Gravity;
					break;
				case PowerState.FLIP:
					GameUtilities.animeteBlock = true;
					break;
			}
		}
	}
	
	/*****************************************************************************/
}