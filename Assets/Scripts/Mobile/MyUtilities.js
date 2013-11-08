#pragma strict

function Start () {

}

function Update () {

}

static function MyRectangle(x : float, y : float, w : float, h : float)
{
	x = Mathf.Clamp(x, 0, 1);
	y = Mathf.Clamp(y, 0, 1);
	w = Mathf.Clamp(w, 0, 1);
	h = Mathf.Clamp(h, 0, 1);
	
	var sw : int = Screen.width;
	var sh : int = Screen.height;
	
	return Rect(x * sw, y * sh, w * sw, h * sh);
}