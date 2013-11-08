#pragma strict
@script RequireComponent(CharacterController)

/********************************************
 * 											*
 * By Luis Saenz							*
 * Control Ship movement towards target 	*
 *											*
 ********************************************/
 
class ShipMovement extends MonoBehaviour
{
	/*** Variables ***************************************************************/
	var debuging: boolean;
	
	enum ShipState {PLAYING, DEAD, WON}
	var currentState : ShipState;
	
	var controller : CharacterController;		//character controller component
	var c_collisionFlags : CollisionFlags;		//collision flag from movement
	
	var direction : Vector3;					//direction of movement
	
	var speed : float;							//current speed
	var maxSpeed : float;						//max speed of ship
	var minSpeed : float;						//min speed of ship
	
	var const_Acceleration : float;				//default acceleration
	var acceleration : float;					//current acceleration
	var jumpSpeed : float;						//speed of vertical jump
	var verticalSpeed : float;					//instantenius vertical speed of jump
	var sideSpeed : float;						//side way speed
	var sidewaySpeed : float;					//current side way speed
	
	var const_Gravity : float = 20.0;					//gravity mag
	var gravity : float;					//gravity mag
	
	var deadDepth : float;						//lowest are for ship to die
	
	var powerState : ShipStateMachine;
	
	//movement and explotion animations
	var varticalAngle : float = 0.0;
	var verticalAngleSpeed : float;
	var verticalAngleDirection : int = 1;
	
	var explosion : GameObject;
	var shipBody : Transform;
	var turningAnimationSpeed : float;
	
	//variable to hold HUD
	var mainHUD : Transform;
	
	/*****************************************************************************/
	
	/*** Unity Functions *********************************************************/
	
	function Awake ()
	{
		if (powerState == null)
			powerState = GetComponent(ShipStateMachine);
			
		if (controller == null)
			controller = GetComponent(CharacterController);
			
		if (mainHUD == null)
			mainHUD = GameObject.FindGameObjectWithTag("Hud").transform;
			
		c_collisionFlags = CollisionFlags.CollidedBelow;
		
		direction = transform.forward;	
		
		gravity = const_Gravity;	
		
		acceleration = const_Acceleration;	
		
		shipBody = GameObject.FindGameObjectWithTag("MyShip").transform;	
	}
	
	function Start () 
	{

	}

	function Update () 
	{
		if (currentState != ShipState.DEAD && currentState != ShipState.WON)
		{
			//if (IsGrounded() == true || powerState.currentState == powerState.PowerState.SPEEDING)
				speed += acceleration * Time.deltaTime;
				
			if (speed <= 0.0)
				speed = 0.0;
				
			direction.z = -speed;
			
			//get direction and movement of AI on Y-plane
			if (IsGrounded() == true && powerState.currentState != powerState.PowerState.FLYING)
			{
				verticalSpeed = -0.01;
				varticalAngle = verticalAngleSpeed * Time.deltaTime;// * verticalAngleDirection;
				
				/*
				if (varticalAngle >= Mathf.PI * 2.0)
					varticalAngle = 0.0;
				
				Debug.Log(Mathf.Sin(varticalAngle));
				shipBody.position.y += Mathf.Sin(varticalAngle) * Time.deltaTime;
				*/
			}
			else
			{
				verticalSpeed -= gravity * Time.deltaTime;
				shipBody.localPosition.y = 0.0;
			}
		
			#if UNITY_ANDROID
			Debug.Log("Unity androig");
			if (Input.acceleration.x <= -0.25)
			{
				sidewaySpeed = sideSpeed * 1.0;
				direction.x = sidewaySpeed;
			}
			else if (Input.acceleration.x >= 0.25)
			{
				sidewaySpeed = sideSpeed * -1.0;
				direction.x = sidewaySpeed;
			}
			else
			{
				sidewaySpeed = 0.0;
				direction.x = 0.0;
			}
			
			if (Input.touchCount == 1 && IsGrounded() == true && Input.GetTouch(0).phase == TouchPhase.Began)
			{
				verticalSpeed = jumpSpeed;
			}
			#endif
			
			if (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow))
			{
				sidewaySpeed = sideSpeed * 1.0;
				direction.x = sidewaySpeed;
				Debug.Log("Moving left " + sidewaySpeed);
			}
			else if (Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.RightArrow))
			{
				sidewaySpeed = sideSpeed * -1.0;
				direction.x = sidewaySpeed;
				Debug.Log("Moving right " + sidewaySpeed);
			}
			else 
			{
				sidewaySpeed = 0.0;
				direction.x = 0.0;
			}
			
			if (debuging) Debug.Log(powerState.currentState + " " + powerState.PowerState.FLYING);
			if (Input.GetKey(KeyCode.Space) && IsGrounded() == true)// && powerState.currentState != powerState.PowerState.FLIGHT)
			{
				if (debuging) Debug.Log("Jumping");
				verticalSpeed = jumpSpeed;
			}
			
			direction += Vector3(0.0, verticalSpeed, 0.0);
			direction *= Time.deltaTime;
			
			//ray cast forward to see if power up is on the way --> in order to not skip when translating ship
			var hit : RaycastHit;
			var dist : float = direction.magnitude + controller.radius;
			//if (dist < powerState.radius + GameUtilities.zeroValue)
			//	dist = powerState.radius;
			if (Physics.Raycast(transform.position, direction.normalized, hit, dist))
			{
				if (hit.transform.tag == "Speed" || hit.transform.tag == "Flip" || hit.transform.tag == "Flight")
				{
					if (debuging) Debug.Log("Detecting " + hit.transform.tag);
					
					if (powerState.currentState == powerState.PowerState.NONE)
						powerState.SetPowerState(hit.transform.tag);
					Destroy(hit.transform.gameObject);
				}
			}
			
			if (Physics.Raycast(transform.position + transform.right * controller.radius, direction.normalized, hit, dist))
			{
				if (hit.transform.tag == "Speed" || hit.transform.tag == "Flip" || hit.transform.tag == "Flight")
				{
					Debug.Log("Detecting " + hit.transform.tag);
					if (powerState.currentState == powerState.PowerState.NONE)
						powerState.SetPowerState(hit.transform.tag);
					Destroy(hit.transform.gameObject);
				}
			}
			
			if (Physics.Raycast(transform.position - transform.right * controller.radius, direction.normalized, hit, dist))
			{
				if (hit.transform.tag == "Speed" || hit.transform.tag == "Flip" || hit.transform.tag == "Flight")
				{
					Debug.Log("Detecting " + hit.transform.tag);
					if (powerState.currentState == powerState.PowerState.NONE)
						powerState.SetPowerState(hit.transform.tag);
					Destroy(hit.transform.gameObject);
				}
			}
			
			if (speed > 0.0)
				shipBody.forward = Vector3.Slerp(shipBody.forward, direction.normalized, turningAnimationSpeed * Time.deltaTime);
				
			c_collisionFlags = controller.Move(direction);
			
			CheckDestroy();
		}
		else
		{
			GameUtilities.playing = false;
		}
	}
	
	function OnGUI()
	{
		#if UNITY_ANDROID
		GUI.Label(MyUtilities.MyRectangle(0.1, 0.25, 0.5, 0.1), "Side speed = " + sidewaySpeed);
		#endif
	}
	
	function OnControllerColliderHit (hit : ControllerColliderHit) 
	{
		var stringTag : String = hit.transform.tag;
		
		if (stringTag == "Speed" || stringTag == "Flip" || stringTag == "Flight")
		{
			powerState.SetPowerState(stringTag);
			Destroy(hit.gameObject);
		}
		else
		{
			CheckDestroy();
		}
	}
	
	/*****************************************************************************/
	
	/*** My Functions ************************************************************/
	
	//Checking if the character hit the ground (collide Below)
	function IsGrounded () : boolean 
	{
		if (debuging) Debug.Log(c_collisionFlags & CollisionFlags.CollidedBelow);
		return (c_collisionFlags & CollisionFlags.CollidedBelow);
	}
	
	function CheckDestroy()
	{
		if ((controller.collisionFlags == CollisionFlags.Sides) || deadDepth >= transform.position.y)
		{
			if (debuging) Debug.Log("Dead ship Depth Dead " + deadDepth);
			DestroyShip();
		}
	}
	
	function DestroyShip()
	{
		currentState = ShipState.DEAD;
		Instantiate(explosion, transform.position, Quaternion.identity);
		
		yield WaitForSeconds(0.025);
		Destroy(GameObject.FindGameObjectWithTag("MyShip"));
		
		#if UNITY_ANDROID
		Handheld.Vibrate();
		#endif
			
		yield WaitForSeconds(5.0);
		//Application.LoadLevel(0);
		mainHUD.GetComponent(HUD).currentScene = mainHUD.GetComponent(HUD).SCENE_TYPE.SCORE;
	}
	
	/*****************************************************************************/
	
}