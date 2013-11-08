#pragma strict

class ForwardCamera extends MonoBehaviour
{
	var distanceShip : float;
	var ship : Transform;
	
	function Awake () 
	{
		if (ship == null)
			ship = GameObject.FindGameObjectWithTag("Ship").transform;
			
		distanceShip = transform.position.z - ship.position.z;
	}

	function LateUpdate () 
	{
		transform.position.z = ship.position.z + distanceShip;
	}
}