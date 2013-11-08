#pragma strict

var lightIntensity : float;
var animatingLight : boolean = false;
var rangeIntensity : float;
static var currentLightIntensity : float;

function Start () 
{
	 lightIntensity = transform.light.intensity;
}

function Update () 
{
	currentLightIntensity = Random.Range(lightIntensity - rangeIntensity, lightIntensity + rangeIntensity);
	transform.light.intensity = currentLightIntensity;
}
