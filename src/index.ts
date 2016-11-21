import * as constants from "./constants";
import Circle from "./circle";
import * as PIXI from "pixi.js";
import keyStates from "./keyboard";
import analyser from "./soundShit";
import {loop} from "./utils";

var Container = PIXI.Container;
var autoDetectRenderer = PIXI.autoDetectRenderer;
var loader = PIXI.loader;
var resources = PIXI.loader.resources;
var Sprite = PIXI.Sprite;

var renderer =
    PIXI.autoDetectRenderer(
        window.innerWidth,
        window.innerHeight,
        {antialias: false, transparent: false, resolution: 1});

renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
document.body.appendChild(renderer.view);

//Audio shit
var frequencyData = new Uint8Array(analyser.frequencyBinCount);

var stage = new PIXI.Container();

renderer.render(stage);

loader
    .add("images/keith.png")
	  .add("images/jonjo.png")
	  .add("song/song.mp3")
    .load(setup);

//Define any variables that are used in more than one function
var circles: Circle[][] = [];
var colorMatrix = new PIXI.filters.ColorMatrixFilter();
var blurFilter = new PIXI.filters.BlurFilter();
blurFilter.blur = .5;
var emoteContainer = new PIXI.Container();

var vx = 0;
var vy = 0;
var rotation = 0;

function setup() {
		for (var j=-3; j<(window.innerWidth / constants.SPACING) + 3; j++)	{
        circles[j] = [];
			  for (var i=-3; i<(window.innerHeight / constants.SPACING) + 3; i++)	{
            circles[j][i] = new Circle(resources);
            circles[j][i].container.x = constants.SPACING * i;
            circles[j][i].container.y = constants.SPACING * j;

            stage.addChild(circles[j][i].container);
			  }
		}

		//Filters
    stage.filters = [blurFilter, colorMatrix];

    //Start the game loop
    gameLoop();
}

function gameLoop(){
    //Loop this function 60 times per second
    requestAnimationFrame(gameLoop);

    play();
    //Render the stage
    renderer.render(stage);
}

function play() {
    rotation += constants.ROTATION_SPEED;

    analyser.getByteFrequencyData(frequencyData);

    var rightBound = (Math.floor(window.innerWidth/constants.SPACING) + 1) * constants.SPACING;
    var bottomBound = (Math.floor(window.innerHeight/constants.SPACING) + 1) * constants.SPACING;
    var leftBound = -1 * constants.SPACING;
    var topBound = leftBound;

    vx = 0;
    vy = 0;
    if (keyStates[constants.LEFT_CODE])
    {
        vx -= constants.MOVEMENT_SPEED;
    }
    if (keyStates[constants.UP_CODE])
    {
        vy -= constants.MOVEMENT_SPEED;
    }
    if (keyStates[constants.RIGHT_CODE])
    {
        vx += constants.MOVEMENT_SPEED;
    }
    if (keyStates[constants.DOWN_CODE])
    {
        vy += constants.MOVEMENT_SPEED;
    }

    for (var row of circles)
    {
        for (var circle of row)
        {
            circle.container.x += vx;
            circle.container.y += vy;
            circle.keith.rotation = rotation;
            circle.jonjo.height = frequencyData[100];
            circle.jonjo.width = frequencyData[100];

            circle.container.x = loop(circle.container.x, leftBound, rightBound);
            circle.container.y = loop(circle.container.y, topBound, bottomBound);
        }
    }

		colorMatrix.hue(rotation);
}
