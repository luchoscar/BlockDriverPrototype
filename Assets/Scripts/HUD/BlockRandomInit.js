#pragma strict
/******
	need function to populate array at start
 ******/
/********************************************************************************************
 * By Luis Saenz																			*
 * Script to create the place the next block group at the end of the track					*
 * In order to calculate where to place the block the following formula 					*
 * is implemented:																			*
 * 	xf = 0.5 * a * (2 * Vv / g)^2 + sqrt(2 * a * xi + (Vi)^2) * (2 * Vv / g) + c * 0.5		*
 * 	where:																					*
 *		a = ship acceleration 																*
 *		Vv = jump speed																		*
 *		g = gravity	absolute value															*
 *		xi = last position on the last block where ship can jump --> z-pos + z-bounds.size	*
 *		Vi = ship forward speed at the time of calculations									*
 *		c = z-bounds.size of block group to be created										*
 *		xf = position where to place the block group to be created							*
 *																							*
 * Thirteen (13) block groups will be pre-loaded at the start of the level, and serve as a 	*
 * tutorial.  The last seven (7) groups will also be stored on a queue.  When the first		*
 * element in the queue is destroied (null), all elements will get shift 1 position and 	*
 * a new block group will be created and stored at the end of the queue						*
 *																							*
 ********************************************************************************************/
 
class BlockRandomInit extends MonoBehaviour
{
	var debuging : boolean;
	
	//var blockGroupQueueGameObject : Transform[];	//queue that holds the last 7 blok groups
	static var blockGroupQueue : Array;					//queue to control creation of block groups
	var maxQBlocksQueue : int;						//max number of blocks to be hold in queue
	var blockCounter : int;
	
	var blockGroupArray : GameObject[];				//array holding all available block group types
	var ship : Transform;
	
	var lastBlockGroup : Transform;
	var nextBlockGroup : Transform;
	
	var myQueueArray : GameObject[];
	
	function Awake()
	{
		if (ship == null)
			ship = GameObject.FindGameObjectWithTag("Ship").transform;
	
		if (blockGroupArray != null)
		{
			var blockGroup : GameObject[] = GameObject.FindGameObjectsWithTag("BlockGroup");
			maxQBlocksQueue = blockGroup.length;
			blockCounter = maxQBlocksQueue;
			blockGroupArray = new GameObject[maxQBlocksQueue];
			
			for (var blockGrp : GameObject in blockGroup)
			{
				blockGroupArray[blockGrp.transform.GetComponent(BlockHolder).index - 1] = blockGrp;
			}
			
			lastBlockGroup = blockGroupArray[maxQBlocksQueue - 1].transform;
			
			blockGroupQueue = new Array(blockGroupArray	);
			myQueueArray = blockGroupQueue.ToBuiltin(GameObject);
		}
	}

	function Update () 
	{
		if (GameUtilities.playing)
		{
			if (blockGroupQueue[0] == null)
			{
				//myQueueArray = null;
				//myQueueArray = blockGroupQueue.ToBuiltin(GameObject);
				Debug.Log("First block group destroied");
				CalculatePosition();
			}
		}
	}
	
	//calculate next position of block group
	function CalculatePosition()
	{
		if (lastBlockGroup == null)
		{
			lastBlockGroup = blockGroupQueue[blockCounter - 1]; //as GameObject).transform;
			Debug.Log("Last on queue " + (blockGroupQueue[maxQBlocksQueue - 1] as GameObject).transform.name);
		}
		
		Debug.Log("Var Last on queue " + lastBlockGroup.name);
		
		if (GameUtilities.playing)
			BlockRandomInit.blockGroupQueue.shift();
		
		var a : float = ship.GetComponent(ShipMovement).const_Acceleration;
		var Vv : float = ship.GetComponent(ShipMovement).jumpSpeed;
		var g : float = ship.GetComponent(ShipMovement).const_Gravity;
		
		var Vi : float;
		if (ship.GetComponent(ShipStateMachine).currentState != ship.GetComponent(ShipStateMachine).PowerState.SPEEDING)
		{
			Vi = ship.GetComponent(ShipMovement).speed;
		}
		else
		{
			Vi = ship.GetComponent(ShipStateMachine).recordedSpeed;
		}
		
		//calculate last possible position to jump
		var xi : float = lastBlockGroup.position.z + lastBlockGroup.collider.bounds.size.z * 0.5;
		lastBlockGroup = null;
		
		//get next random block group
		var next : int = Random.Range(0, blockGroupArray.length);
		nextBlockGroup = (Instantiate(blockGroupArray[next], Vector3(0.0, 0.0, -100.0), Quaternion.identity)).transform;// as Transform;
		nextBlockGroup.position.z = -100;
		
		if (nextBlockGroup != null)
			Debug.Log("Next group " + nextBlockGroup.name);
		else
			Debug.Log("Next group does not exist");
			
		if (nextBlockGroup.collider != null)
			Debug.Log("Group has collider");
		else
			Debug.Log("Group has no collider");
			
		var c : float = nextBlockGroup.collider.bounds.size.z;
		
		var xf : float = 0.0;
		
		/*** calculate positon for next block *********************************************************************************
		
		before jump
		linear acceleration
			v = (a)(t) + vi --> t = (v - vi) / a
			xi = 0.5(a)(t^2) + (vi)(t) --> xi = 0.5a(((v - vi)/a)^2) + vi((v - vi)/a) --> v^2 = 2(a)(xi)+vi^2 --> eq01
		
		during jump
			vertical motion
			xf = -0.5g(t^2) + (vv)(t) --> t = 0 or t = 2(vv)/g --> eq02
			
			horizontal motion with acceleration
			xf = 0.5(a)(t^2) + v(t) --> eq03
			
		replace eq01 and eq02 on eq03
			xf = 0.5(a)(2(vv)/g)^2 + |sqrt(2(a)(xi)+vi^2)|(2(vv)/g)
			
		add half of collider so new block group is place correctly
			xf = 0.5(a)(2(vv)/g)^2 + |sqrt(2(a)(xi)+vi^2)|(2(vv)/g) + c
			
		***********************************************************************************************************************/
		
		xf = 0.5 * a * Mathf.Pow((2 *Vv /g),2) + Mathf.Abs(Mathf.Sqrt(2 * a *xi + Mathf.Pow(Vi, 2))) * (2 * Vv /g) + c;
		
		//reduce calculated distance a 20% to compensate for lose of acceleration
		xf *= 0.8;
		Debug.Log("New position is " + xf);
		//var blockNext : Transform = Instantiate(nextBlockGroup, Vector3(0.0, xf, 0.0), Quaternion.identity);
		nextBlockGroup.position = Vector3(0.0, 0.0, xf);
		lastBlockGroup = nextBlockGroup;//Instantiate(nextBlockGroup, Vector3(0.0, xf, 0.0), Quaternion.identity);
		//lastBlockGroup.position.z = xf;
		blockCounter++;
		//blockNext.name = "StartBlockObject_" + blockCounter;
		//BlockRandomInit.blockGroupQueue.push(blockNext);
		lastBlockGroup.name = "StartBlockObject_" + blockCounter;
		BlockRandomInit.blockGroupQueue.push(lastBlockGroup);
	}
}