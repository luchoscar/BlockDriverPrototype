#pragma strict
/********************************************************
 * By Luis Saenz										*
 * Script to trigger main camera animate				*
 ********************************************************/
 
class CameraFlip extends MonoBehaviour
{
	var debuging : boolean;
	
	var direction : int;			//direction to flip camera to
	var speed : float;				//speed of rotation
	var endAngle : float;			//targetted rotation
	var checkedAngle : boolean;		//flag indicating that angle has been check
	function Start()
	{
		if (direction != 1 && direction != -1)
		{
			var message : String = "";
			
			if (direction > 0)
			{
				direction = 1;
				message = "Direction gratter than 0, changing to 1";
			}
			else if (direction < 0)
			{
				direction = -1;
				message = "Direction less than 0, changing to -1";
			}
			else
			{
				message = "Direction cannot be 0";
			}
			
			if (debuging)
				Debug.Log(message);
		}
		
		if ((direction == 1 && endAngle < 0) || (direction == -1 && endAngle > 0))
			endAngle *= -1;
	}
	
	function OnTriggerEnter(other : Collider)
	{
		if (other.tag == "Ship")
		{
			if (debuging)
				Debug.Log("Entering - " + transform.name + " - camera animation");
			
			Camera.mainCamera.transform.GetComponent(MainCameraAnimation).StartAnimation(direction, endAngle, speed);	
		}
	}
	
	function OnTriggerExit(other : Collider)
	{
		if (other.tag == "Ship")
		{
			if (debuging)
				Debug.Log("Exiting - " + transform.name + " - camera animation");
				
			Camera.mainCamera.transform.GetComponent(MainCameraAnimation).StartAnimation(direction * -1, 0.0, speed);	
		}
	}
}