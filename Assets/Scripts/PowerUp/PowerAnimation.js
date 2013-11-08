#pragma strict  
/********************************
 * 								*
 * By Luis Saenz				*
 * Animate power ups 		 	*
 *								*
 ********************************/
 
class PowerAnimation extends MonoBehaviour
{
	var debuging : float;
	
	enum POWER_TYPE {SPEED, FLY, FLIP}
	enum POWER_AREA {BODY, OUT}
	
	var powerType : POWER_TYPE;
	var powerArea : POWER_AREA;
	
	var animationSpeed : float;
	var rotationPoint : Vector3;
	
	private var animationDirection : Vector3;
	
	function Start () 
	{
		if (debuging) 
			Debug.Log(transform.parent.parent.name + " " + transform.parent.parent.position);
		
		animationSpeed = 50.0;
		rotationPoint = transform.parent.position;
		animationDirection = transform.up;
	}

	function Update () 
	{
		transform.RotateAround(rotationPoint, animationDirection, (animationSpeed * Time.deltaTime));
	}
}