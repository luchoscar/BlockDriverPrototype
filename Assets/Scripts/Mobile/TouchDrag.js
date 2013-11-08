#pragma strict

var cubeObj : Transform;

function Start () {

}

function OnGUI() 
{
	if (Input.touchCount > 0 && (Input.GetTouch(0).phase == TouchPhase.Moved || Input.GetTouch(0).phase == TouchPhase.Began))
	{
		var ray : Ray = Camera.main.ScreenPointToRay (Input.GetTouch(0).position);
		GUI.Label(MyUtilities.MyRectangle(0.1, 0.0, 0.9, 0.05), "You touch me!!!");
		GUI.Label(MyUtilities.MyRectangle(0.1, 0.03, 0.9, 0.05), Input.GetTouch(0).position.ToString());
		GUI.Label(MyUtilities.MyRectangle(0.1, 0.05, 0.9, 0.05), ray.origin.ToString());
		
		var hit : RaycastHit;
		if (Physics.Raycast(ray.origin, ray.direction, hit))
		{
			cubeObj.position = Vector3(hit.point.x, cubeObj.position.y, hit.point.z);
		} 
		
	}
}