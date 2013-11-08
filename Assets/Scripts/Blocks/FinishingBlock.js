#pragma strict
var debuging : boolean;

var finishingTrack : boolean;
var ship : Transform;
var animateCamera : boolean;
var circularAcceleration : float;
var timeAnimation : int;

var cameraObject : Transform;
var currentAngle : float;

function Awake () 
{
	if (ship == null)
		ship = GameObject.FindGameObjectWithTag("Ship").transform;
		
	if (timeAnimation < 0)
	{
		Debug.Log("Negative time enetered, making positive");
		timeAnimation *= -1;
	}
	else if (timeAnimation == 0)
	{
		Debug.Log("No time has been enetered");
	}
	
	if (cameraObject == null)
		cameraObject = Camera.mainCamera.transform;
		
	if (debuging) Debug.Log("Camera to attach " + cameraObject.name + " with tag " + cameraObject.tag);
}

function Update()
{
	if (animateCamera)
	{	
		var rotation : float = circularAcceleration * Time.deltaTime;
		cameraObject.RotateAround(ship.position, Vector3.up, rotation);
		currentAngle += rotation;
		
		if (currentAngle >= Mathf.PI * 2)
			currentAngle = 0.0;
			
		if (debuging)
			Debug.Log("Rotating " + Mathf.Rad2Deg * currentAngle);
	}
}

function LateUpdate () 
{
	if (ship.GetComponent(ShipMovement).speed <= 0.0)
	{
		ship.GetComponent(ShipMovement).acceleration = 0.0;
		finishingTrack = false;
	}
	
	if (finishingTrack)
	{
		var direction : Vector3 = ship.forward + ship.right * circularAcceleration * Time.deltaTime;
		ship.forward = direction.normalized;
	}
}

function OnTriggerEnter(other : Collider)
{
	EnterShip();
}

function EnterShip()
{
	Destroy(transform.collider);
	GameUtilities.playing = false;
	finishingTrack = true;
	ship.GetComponent(ShipMovement).acceleration *= -1.0 * ship.GetComponent(ShipMovement).speed * 15.0;
	ship.GetComponent(ShipMovement).speed *= 0.25;
	
	if (debuging)
		Debug.Log("Starting end camera animation");
	
	animateCamera = true;
	
	yield WaitForSeconds(timeAnimation);
	
	if (debuging)
		Debug.Log("Stopping end camera animation");
}