#pragma strict

/****************************************************
 * By Luis Saenz									*
 * Script to control brick behavior					*
 * Block Flipper --> Rotate block 180deg on 		*
 * its local z-axis									*
 * If car hits land area of land mine or half 		*
 * land mine, car is destroied						*
 ****************************************************/
 
class BlockScript extends MonoBehaviour
{
	/*** Variables ******************************************/
	var fireEffect : GameObject;						//fire object for effect
	
	enum BlockState {NORMAL, INVERTED}					//block state ---> normal --> local up = world up
	static var currentState : BlockState;				//			  ---> inverted --> local up = world up * -1
	
	enum BlockType {NORMAL, MINE, HALF_MINE, WALKER}	//type of block ---> normal --> no mines
	var blockType : BlockType;							//				---> mine --> mines on all sides
														//				---> half_mine --> only one random side with mines
	
	var normal : boolean;								//flag indicating if block has no mines
	var top : boolean;									//flag indicating if top side has mines
	
	static var rotationSpeed : float = 5;					//angular rotation speed
	static var angle: float;							//angle of rotation
	
	var pushForce : float;								//force to push ship when hit on rotation
	
	var mines : Transform;								//mines of block
	var minesEffector : Transform[];					//hold mine effectors for animation
	var effectorAnimationIncreaseSpeed : float;			//animation increment of speed of effector
	var effectorAnimationSpeed : float;					//current Speed of effector aniation (angle)
	
	var mineSide : Vector3;								//side where to move mines when initializing
	var direction : Vector3 = Vector3.up;
	
	/********************************************************/
	
	/*** Unity Functions ************************************/
	function Awake () 
	{
		if (blockType != BlockType.NORMAL)
		{
			if (mines == null)
				mines = transform.GetChild(0).transform;
			
			mineSide = transform.up;
			
			var tempArray : Array = mines.GetComponentsInChildren.<Transform>();
			tempArray.shift();
			minesEffector = tempArray.ToBuiltin(Transform);
		}
		
		switch (blockType)
		{
			case BlockType.MINE:
			case BlockType.HALF_MINE:
				mines.GetComponent(MineScript).effector = fireEffect;
				mines.GetComponent(MineScript).currentType = mines.GetComponent(MineScript).EffectorType.MINE;
				break;
			case BlockType.WALKER:
			//case BlockType.HALF_MINE:
				mines.GetComponent(MineScript).effector = null;
				mines.GetComponent(MineScript).currentType = mines.GetComponent(MineScript).EffectorType.WALKER;
				break;
			default:
				break;
		}
		
		//move mines to correct position
		if (blockType == BlockType.NORMAL)
		{
			normal = true;
			mineSide = Vector3.zero;
		}
		else if (blockType == BlockType.MINE)
		{
			normal = false;
			mineSide = Vector3.zero;
		}
		else if (blockType == BlockType.HALF_MINE)
		{
			var type : int = Random.Range(0, 2);
			if (type == 0)
			{
				top = true;
				normal = false;
			}
			else
			{
				top = false;
				normal = false;
				mineSide *= -1.0;
			}
			
			mines.localScale.y *= 0.5;
			mines.position.y += mines.localScale.y * mineSide.y;
		}
		
		angle = 0.0;
	}

	function Update () 
	{
		if (GameUtilities.animeteBlock)
		{
			//RotateBlock();
			if (currentState == BlockState.NORMAL)
			{
				angle += rotationSpeed * Time.deltaTime;
				
				if (angle >= 180)
				{
					angle = 180;
					GameUtilities.animeteBlock = false;
					currentState = BlockState.INVERTED;
				}
			}
			else if (currentState == BlockState.INVERTED)
			{		
				angle -= rotationSpeed * Time.deltaTime;
			
				if (angle <= 0)
				{
					angle = 0;
					GameUtilities.animeteBlock = false;
					currentState = BlockState.NORMAL;
				}
			}
			
			transform.rotation.eulerAngles.z = angle;
		}
		
		switch (blockType)
		{
			case BlockType.MINE:
			case BlockType.HALF_MINE:
				break;
			case BlockType.WALKER:
			//case BlockType.HALF_MINE:
				effectorAnimationSpeed -= effectorAnimationIncreaseSpeed * Time.deltaTime;
				if (effectorAnimationSpeed <= Mathf.PI * -2.0)
					effectorAnimationSpeed = 0.0;
				
				var i :int = 0;
				for(var effector : Transform in minesEffector)
				{
					effector.name = "Mine " + i;
					effector.Rotate(effectorAnimationSpeed, 0, 0);
					i++;
				}
				break;
		}
	}
	
	function LateUpdate()
	{
		if (GameUtilities.animeteBlock == false)
		{
			switch(currentState)
			{
				case BlockState.NORMAL:
					transform.rotation.eulerAngles.z = 0.0;
					break;
				case BlockState.INVERTED:
					transform.rotation.eulerAngles.z = 180.0;
					break;
			}
		}
	}
	
	/********************************************************/
	
	/*** My Functions ***************************************/
	
	//function to set the flag to animate block
	function SetRotateBlock()
	{
		GameUtilities.animeteBlock = true;
	}
	
	//function to rotate block
	private function RotateBlock()
	{
		if (currentState == BlockState.NORMAL)
		{
			angle += rotationSpeed * Time.deltaTime;
				
			if (angle >= 180)
			{
				angle = 180;
				GameUtilities.animeteBlock = false;
				currentState = BlockState.INVERTED;
			}
		}
		else if (currentState == BlockState.INVERTED)
		{	
			angle -= rotationSpeed * Time.deltaTime;
			
			if (angle <= 0)
			{
				angle = 0;
				GameUtilities.animeteBlock = false;
				currentState = BlockState.NORMAL;
			}
		}
			
		transform.rotation.eulerAngles.z = angle;
	}
	
	/********************************************************/

}