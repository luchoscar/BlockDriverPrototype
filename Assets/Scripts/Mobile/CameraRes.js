#pragma strict

public static var guiMatrix : Matrix4x4;

private var nativeWidth : float = 800.0f;  
private var nativeHeight : float = 600.0f;

function Awake()
{
	DontDestroyOnLoad(this.gameObject);
}

function Start () 
{
	var scale : Vector3 = Vector3(Screen.width / nativeWidth, 
                                  Screen.height / nativeHeight,
                                  1.0f);
    CameraRes.guiMatrix = Matrix4x4.TRS(Vector3.zero, Quaternion.identity, scale);
}

function Update () {

}

function OnLevelWasLoaded (level : int)
{
	var xRes : int = Screen.width;
	var yRes : int = Screen.height;
	
	Screen.SetResolution(xRes, yRes, true);
}