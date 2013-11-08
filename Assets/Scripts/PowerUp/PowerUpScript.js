#pragma strict

class PowerUpScript extends MonoBehaviour
{
	function Start () {

	}

	function Update () {

	}
	
	function OnTriggerEnter(other : Collider)
	{
		if (other.transform.tag == "Ship")
		{
			other.transform.GetComponent(ShipStateMachine).SetPowerState(other.transform.tag);
			Destroy(gameObject);
		}
	}
}