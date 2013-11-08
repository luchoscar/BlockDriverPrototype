#pragma strict

//@script RequireComponent(Rigidbody)

/****************************************************
 * By Luis Saenz									*
 * Script to control brick behavior					*
 * Block Flipper --> Rotate block 180deg on 		*
 * its local z-axis									*
 * If car hits land area of land mine or half 		*
 * land mine, car is destroied						*
 ****************************************************/
 
class BlockHolder extends MonoBehaviour
{
	/*** Variables ******************************************/
	var debuging : boolean;
	
	var bottomPlane : Transform;				//plane that indicates depth dead for this set of blocks
	var index : int;
	
	/********************************************************/
	
	/*** Unity Functions ************************************/
	function Awake()
	{
		if (bottomPlane == null)
			bottomPlane = transform.GetChild(0).transform;
			
		//if (bottomPlane.collider != null)
		//	Destroy(bottomPlane.collider);
	}
	
	function OnTriggerEnter (other : Collider)
	{
		other.transform.GetComponent(ShipMovement).deadDepth = bottomPlane.position.y;
		//Destroy(transform.collider);
	}
	
	function OnTriggerExit (other : Collider)
	{
		if (debuging) Debug.Log("Exiting collider trigger of block group and destroying " + transform.name);
		//DestroyBlockGroup();
	}
	/********************************************************/
	
	/*** My Functions ***************************************/
	function DestroyBlockGroup()
	{
		if (BlockRandomInit != null)
		{
			yield WaitForSeconds(1);
			BlockRandomInit.blockGroupQueue[0] = null;
			Destroy(transform.gameObject);
		}
	}
	
	/********************************************************/

}