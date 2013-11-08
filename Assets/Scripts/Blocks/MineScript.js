#pragma strict

class MineScript extends MonoBehaviour
{
	var debuging : boolean;
	
	enum EffectorType {MINE, WALKER}
	var currentType : EffectorType;
	
	//walker variables
	var reduceSpeed : float;		//% of current speed to set as negative acceleration
	var ship : Transform;
	var applySpeed : boolean;		//flag indicating when to reduce speed
	
	//matrials to use per efector type
	var materialEffector : Material[];
	
	//fire effector
	var effector : GameObject;
	
	function Start () 
	{
		Debug.Log(effector);
		
		if (ship == null)
			ship = GameObject.FindGameObjectWithTag("Ship").transform;
			
		var effectors : Transform[] = transform.GetComponentsInChildren.<Transform>();
		
		for (var i : int = 1; i < effectors.length; i++)
		{
			//slower effect
			if (effector == null)
			{
				effectors[i].renderer.material = materialEffector[currentType];
			}
			//mines effector
			else
			{
				if (i % 3 == 2)
				{
					var tempEffect : GameObject = Instantiate(effector, effectors[i].position, Quaternion.identity);
					tempEffect.transform.parent = effectors[i];
					//Instantiate(effector, effectors[i].position, Quaternion.identity);
				}
				effectors[i].renderer.enabled = false;
			}
		}
	}
	
	function OnTriggerEnter (other : Collider) 
	{
		ship = other.transform;
		
		if (currentType == EffectorType.MINE)
		{
			ship.GetComponent(ShipMovement).currentState = ship.GetComponent(ShipMovement).ShipState.DEAD;
			ship.GetComponent(ShipMovement).DestroyShip();
		}
		else if (currentType == EffectorType.WALKER)
		{
			applySpeed = true;
			ship.GetComponent(ShipMovement).acceleration *= -ship.GetComponent(ShipMovement).acceleration * reduceSpeed;
		}
	}
	
	function OnTriggerExit (other : Collider) 
	{
		if (debuging) Debug.Log("Exiting effector");
		applySpeed = false;
		ship.GetComponent(ShipMovement).acceleration = ship.GetComponent(ShipMovement).const_Acceleration;
	}
}