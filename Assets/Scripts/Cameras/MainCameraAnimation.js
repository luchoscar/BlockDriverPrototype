#pragma strict
/********************************************************
 * By Luis Saenz										*
 * Script to animate ccamera by rotating around global	*
 * z-axis to create vertigo/turn effect 				*
 ********************************************************/

class MainCameraAnimation extends MonoBehaviour
{
	var debuging : boolean;
	
	var angleGoal : float;			//angle to rotate --> 180 >= angle >= 0
	var direction : int;			//direction to rotate angle +/-
	var angleSpeed : float;			//speed to animate camera
	var currentAngle : float;		//current rotation as time goes by
	var animate : boolean;			//flag indicating animation
	var endAngle : float;			//targetted angle
	
	function Start () 
	{
		currentAngle = 0.0;
	}

	function Update () 
	{
		if (GameUtilities.playing && animate)
		{
			var speed : float = angleSpeed * Time.deltaTime * direction;
			transform.RotateAround(Vector3.forward, speed);
			
			currentAngle += speed;
			
			if (debuging) Debug.Log("Current rotation angle " + currentAngle);
			
			if (direction == -1)
			{
				if (currentAngle <= endAngle)
					animate = false;
			}
			else if (direction == 1)
			{
				if (currentAngle >= endAngle)
					animate = false;
			}
			
			if (!animate)
				StopAnimation();
		}
	}

	/***My Functions*************************************************************************/
	
	//function to stop animation
	function StopAnimation()
	{
		if (debuging) 
			Debug.Log("Stopping animation");
		
		currentAngle = endAngle;
		direction = 0;
	}	
	
	function StartAnimation(In_direction : int, In_endAngle : float, In_speed : float)
	{
		if (debuging) 
			Debug.Log("Starting animation");
				
		direction = In_direction;
		angleSpeed = In_speed;
		endAngle = Mathf.Deg2Rad * In_endAngle;
		animate = true;
		
		if (debuging) 
		{
			Debug.Log("Current angle " + currentAngle);
			Debug.Log("End angle " + endAngle);
			Debug.Log("Direction " + direction);
		}
	}
}