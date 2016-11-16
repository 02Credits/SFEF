interface EmoteSprite extends PIXI.Sprite {
    vx: number;
    vy: number;
}

interface EmoteHolder extends PIXI.Container {
    vx: number;
    vy: number;
}



interface KeyboardEventHandler {
    code: number;
    isDown: boolean;
    isUp: boolean;
    press?: () => void;
    isDownHandler?: (event: KeyboardEvent) => void;
    release?: () => void;
    isUpHandler?: (event: KeyboardEvent) => void;
}

var Container = PIXI.Container,
autoDetectRenderer = PIXI.autoDetectRenderer,
loader = PIXI.loader,
resources = PIXI.loader.resources,
Sprite = PIXI.Sprite;

var renderer =
    PIXI.autoDetectRenderer(
        window.innerWidth,
        window.innerHeight,
        {antialias: false, transparent: false, resolution: 1});

renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();

renderer.render(stage);

loader
    .add("images/keith.png")
		.add("images/jonjo.png")
    .load(setup);

//Define any variables that are used in more than one function
var keiths: EmoteSprite[] = [];
var jonjos: EmoteSprite[] = [];
var keithAmount = 80;
var jonjoAmount = 80;
var emoteContainer = new PIXI.Container() as EmoteHolder;

function setup() {

    //Create the `cat` sprite
	
		for (var i=0; i<keithAmount; i++)	{
			keiths[i] = new Sprite(resources["images/keith.png"].texture) as EmoteSprite;
			keiths[i].anchor.set(-2, 0);
			keiths[i].y = 200 * Math.floor(i/10 %10) + 50;
			keiths[i].x = 200 * Math.floor(i % 10) + 50;
			emoteContainer.addChild(keiths[i]);
		}
	
		for (var i=0; i<jonjoAmount; i++) {
			jonjos[i] = new Sprite(resources["images/jonjo.png"].texture) as EmoteSprite;
			jonjos[i].height = 40;
			jonjos[i].width = 30;
			jonjos[i].y = 200 * Math.floor(i/10 %10) +25;
			jonjos[i].x = 200 * Math.floor(i % 10) +25;
			emoteContainer.addChild(jonjos[i]);
		}
		
		emoteContainer.vy = 0;
		emoteContainer.vx = 0;
		stage.addChild(emoteContainer);

    //Capture the keyboard arrow keys
    var left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

    //Left arrow key `press` method
    left.press = function() {
        //Change the cat's velocity when the key is pressed
				emoteContainer.vx = -10;
        emoteContainer.vy = 0;
    };
    //Left arrow key `release` method
    left.release = function() {
        //If the left arrow has been released, and the right arrow isn't down,
        //and the cat isn't moving vertically:
        //Stop the cat
        if (!right.isDown && emoteContainer.vy === 0) {
					emoteContainer.vx = 0;
				 }
    };

    //Up
    up.press = function() {
        emoteContainer.vx = 0;
        emoteContainer.vy = -10;
    };
    up.release = function() {
        if (!down.isDown && emoteContainer.vx === 0) {
					emoteContainer.vy = 0;
				}
    };

    //Right
    right.press = function() {
        emoteContainer.vx = 10;
        emoteContainer.vy = 0;

    };
    right.release = function() {
        if (!left.isDown && emoteContainer.vy === 0) {
					emoteContainer.vx = 0;
        }
    };

    //Down
    down.press = function() {
        emoteContainer.vx = 0;
        emoteContainer.vy = 10;
			
    };
    down.release = function() {
        if (!up.isDown && emoteContainer.vx === 0) {
					emoteContainer.vy = 0;
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

    //Use the keith's velocity to make it move

					emoteContainer.x += emoteContainer.vx;
    			emoteContainer.y += emoteContainer.vy;
			for (var i=0; i<keithAmount; i++) {
				keiths[i].rotation += 0.1;
			}
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
