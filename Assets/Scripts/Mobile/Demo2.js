#pragma strict

var systemInfo : String = "";
var platformInfo : String = "";
var show : boolean = false;

function Start () 
{
	systemInfo = SystemInfo.deviceModel;
	
	Debug.Log(systemInfo);
	
	if (Application.platform == RuntimePlatform.Android)
	{
		platformInfo = "Android platform " + Application.platform;
		
	}
	else
	{
		platformInfo = "Not Android platform " + Application.platform;
	}
	
	Debug.Log(platformInfo);
}

function Update () 
{

}

function OnGUI()
{
	//GUI.Label(MyUtilities.MyRectangle(0.1, 0.1, 0.9, 0.2), systemInfo);
	//GUI.Label(MyUtilities.MyRectangle(0.1, 0.15, 0.9, 0.2), platformInfo);
	
	//#if UNITY_ANDROID
//	
	if (GUI.Button(MyUtilities.MyRectangle(0.1, 0.25, 0.9, 0.05), "Touch me"))
	{
		show = true;
		GUI.Label(MyUtilities.MyRectangle(0.1, 0.3, 0.9, 0.05), "You touch me!!!");
		GUI.Label(MyUtilities.MyRectangle(0.1, 0.1, 0.9, 0.05), systemInfo);
		GUI.Label(MyUtilities.MyRectangle(0.1, 0.15, 0.9, 0.05), platformInfo);
		Debug.Log("clicked");
	}
	
//	if (show)
//	{
//		GUI.Label(MyUtilities.MyRectangle(0.1, 0.3, 0.9, 0.2), "You touch me!!!");
//		GUI.Label(MyUtilities.MyRectangle(0.1, 0.1, 0.9, 0.2), systemInfo);
//		GUI.Label(MyUtilities.MyRectangle(0.1, 0.15, 0.9, 0.2), platformInfo);
//	}
	
	#if UNITY_ANDROID		
	
	if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Stationary)
		GUI.Label(MyUtilities.MyRectangle(0.1, 0.2, 0.9, 0.05), "Touch me!!!");
		
	var xAngle : float = Input.acceleration.x;
	var yAngle : float = Input.acceleration.y;
	var zAngle : float = Input.acceleration.z;
	GUI.Label(MyUtilities.MyRectangle(0.1, 0.35, 0.2, 0.05), "x --> " + xAngle);
	GUI.Label(MyUtilities.MyRectangle(0.1, 0.4, 0.2, 0.05), "y --> " + yAngle);
	GUI.Label(MyUtilities.MyRectangle(0.1, 0.45, 0.2, 0.05), "z --> " + zAngle);
		
	#endif
}