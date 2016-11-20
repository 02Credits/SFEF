var SPACING = 235;
var JONJO_HEIGHT = 40;
var JONJO_WIDTH = 30;
var LEFT_CODE = 37;
var UP_CODE = 38;
var RIGHT_CODE = 39;
var DOWN_CODE = 40;
var MOVEMENT_SPEED = 3.5;
var ROTATION_SPEED = 0.125;
var JONJO_SCALE = 1.1;

var Container = PIXI.Container;
var autoDetectRenderer = PIXI.autoDetectRenderer;
var loader = PIXI.loader;
var resources = PIXI.loader.resources;
var Sprite = PIXI.Sprite;

interface KeyboardEventHandler {
    code: number;
    isDown: boolean;
    isUp: boolean;
    press?: () => void;
    isDownHandler?: (event: KeyboardEvent) => void;
    release?: () => void;
    isUpHandler?: (event: KeyboardEvent) => void;
}

class Circle {
    jonjo: PIXI.Sprite;
    keith: PIXI.Sprite;
    container: PIXI.Container;

    constructor(resources: PIXI.loaders.ResourceDictionary) {
        this.keith = new PIXI.Sprite(resources["images/keith.png"].texture);
				this.keith.anchor.set(-2, 0);
        this.container = new PIXI.Container();
        this.container.addChild(this.keith);
        this.jonjo = new PIXI.Sprite(resources["images/jonjo.png"].texture);
        this.jonjo.height = JONJO_HEIGHT;
        this.jonjo.width = JONJO_WIDTH;
        this.jonjo.anchor.set(.5, .5);
        this.container.addChild(this.jonjo);
        var background = new PIXI.Sprite(resources["images/jonjo.png"].texture);
        background.width = SPACING * 2;
        background.height = SPACING * 2;
        background.anchor.set(.5, .5);
        background.visible = false;
        this.container.addChild(background);
    }
}


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
var ctx = new AudioContext();
var audio = document.createElement('audio');
audio.src = "song/song.mp3";
var audioSrc = ctx.createMediaElementSource(audio);
var analyser = ctx.createAnalyser();
audioSrc.connect(analyser);
audioSrc.connect(ctx.destination);
var frequencyData = new Uint8Array(analyser.frequencyBinCount);
audio.autoplay = true;
audio.play();

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
		for (var j=-3; j<(window.innerWidth / SPACING) + 3; j++)	{
        circles[j] = [];
			  for (var i=-3; i<(window.innerHeight / SPACING) + 3; i++)	{
            circles[j][i] = new Circle(resources);
            circles[j][i].container.x = SPACING * i;
            circles[j][i].container.y = SPACING * j;

            stage.addChild(circles[j][i].container);
			  }
		}

		//Filters
    stage.filters = [blurFilter, colorMatrix];

    //Capture the keyboard arrow keys
    var left = keyboard(37);
    var up = keyboard(38);
    var right = keyboard(39);
    var down = keyboard(40);

    //Left
    left.press = function() {
        //Change the cat's velocity when the key is pressed
				vx = -MOVEMENT_SPEED;
    };
    left.release = function() {
        if (!right.isDown) {
					  vx = 0;
				}
    };

    //Up
    up.press = function() {
        vy = -MOVEMENT_SPEED;
    };
    up.release = function() {
        if (!down.isDown) {
					  vy = 0;
				}
    };

    //Right
    right.press = function() {
        vx = MOVEMENT_SPEED;

    };
    right.release = function() {
        if (!left.isDown) {
					  vx = 0;
        }
    };

    //Down
    down.press = function() {
        vy = MOVEMENT_SPEED;

    };
    down.release = function() {
        if (!up.isDown) {
					  vy = 0;
        }
    };

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
    rotation += ROTATION_SPEED;

    analyser.getByteFrequencyData(frequencyData);

    var rightBound = (Math.floor(window.innerWidth/SPACING) + 1) * SPACING;
    var bottomBound = (Math.floor(window.innerHeight/SPACING) + 1) * SPACING;
    var leftBound = -1 * SPACING;
    var topBound = leftBound;

    //Use the keith's velocity to make it move, but only if it will stay on the screen
    for (var row of circles)
    {
        for (var circle of row)
        {
            circle.container.x += vx;
            circle.container.y += vy;
            circle.keith.rotation = rotation;
            circle.jonjo.height = frequencyData[100];
            circle.jonjo.width = frequencyData[100];

            if (circle.container.x > rightBound)
            {
                circle.container.x = leftBound;
            }
            if (circle.container.x < leftBound)
            {
                circle.container.x = rightBound;
            }
            if (circle.container.y > bottomBound)
            {
                circle.container.y = topBound;
            }
            if (circle.container.y < topBound)
            {
                circle.container.y = bottomBound;
            }
        }
    }

		colorMatrix.hue(rotation);
}

//The `keyboard` helper function
function keyboard(keyCode: number) {
    var key: KeyboardEventHandler = {
        code: keyCode,
        isDown: false,
        isUp: true,
    };

    key.isDownHandler = function(event) {
				if (event.keyCode === key.code) {
						if (key.isUp && key.press) key.press();
						key.isDown = true;
						key.isUp = false;
				}
				event.preventDefault();
    };

    key.isUpHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.isDownHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.isUpHandler.bind(key), false
    );
    return key;
}
