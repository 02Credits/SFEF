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
var keiths: EmoteSprite[] = [];
var jonjos: EmoteSprite[] = [];
var keithCount = 0;
var jonjoCount = 0;
var circles: any[] = [];
var graphics = new PIXI.Graphics();
var colorMatrix = new PIXI.filters.ColorMatrixFilter();
var blurFilter = new PIXI.filters.BlurFilter();
var emoteContainer = new PIXI.Container() as EmoteHolder;

function setup() {

		
		for (var j=0; j<20; j++)	{
			for (var i=0; i<20; i++)	{
				keiths[keithCount] = new Sprite(resources["images/keith.png"].texture) as EmoteSprite;
				keiths[keithCount].anchor.set(-2, 0);
				keiths[keithCount].y = 235 * i;
				keiths[keithCount].x = 235 * j;
				emoteContainer.addChild(keiths[keithCount]);
				keithCount++;
			}
		}
        graphics.lineStyle(2, 0x0000FF, 1);
		for (var j=0; j<20; j++)	{
			for (var i=0; i<20; i++) {
				jonjos[jonjoCount] = new Sprite(resources["images/jonjo.png"].texture) as EmoteSprite;
                //circles[jonjoCount] = graphics.drawCircle(235 * i - 4, 235 * j - 3, 50);
				jonjos[jonjoCount].height = 40;
				jonjos[jonjoCount].width = 30;
				jonjos[jonjoCount].y = 235 * i;
                jonjos[jonjoCount].anchor.set(.5, .5);
				jonjos[jonjoCount].x = 235 * j;
				emoteContainer.addChild(jonjos[jonjoCount]);
				jonjoCount++;
			}
		}

        
		emoteContainer.x = -1500;
		emoteContainer.y = -1500;
		emoteContainer.vy = 0;
		emoteContainer.vx = 0;
		
	
		
		graphics.lineStyle(2, 0x0000FF, 1);
		graphics.drawRect(-120,-120, 235*2, 235*2);
		graphics.drawRect(-120, -120, 235, 235);
		graphics.drawRect(-120,-120, 235/2, 235/2);
	
	
		//Filters
		blurFilter.blur = .5;
		//colorMatrix.technicolor(false);
		//colorMatrix.brightness(3, true);
		emoteContainer.filters = [blurFilter, colorMatrix];
	
	
		emoteContainer.addChild(graphics);
		stage.addChild(emoteContainer);

    //Capture the keyboard arrow keys
    var left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

    //Left arrow key `press` method
    left.press = function() {
        //Change the cat's velocity when the key is pressed
				emoteContainer.vx = -3.5;
        emoteContainer.vy = 0;
    };
    //Left arrow key `release` method
    left.release = function() {
        if (!right.isDown && emoteContainer.vy === 0) {
					emoteContainer.vx = 0;
				 }
    };

    //Up
    up.press = function() {
        emoteContainer.vx = 0;
        emoteContainer.vy = -3.5;
    };
    up.release = function() {
        if (!down.isDown && emoteContainer.vx === 0) {
					emoteContainer.vy = 0;
				}
    };

    //Right
    right.press = function() {
        emoteContainer.vx = 3.5;
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
        emoteContainer.vy = 3.5;
			
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

    //Use the keith's velocity to make it move, but only if it will stay on the screen
			if (emoteContainer.x + emoteContainer.vx <= -250 && emoteContainer.x + emoteContainer.vx >= -2440) {
				emoteContainer.x += emoteContainer.vx;
			}
	
    	if (emoteContainer.y + emoteContainer.vy <= -250 && emoteContainer.y + emoteContainer.vy >= -3200) {
				emoteContainer.y += emoteContainer.vy;
			}
			for (var i=0; i<keithCount; i++) {
				keiths[i].rotation += 0.125;
                jonjos[i].height = frequencyData[100] * 1.1;
                jonjos[i].width = frequencyData[100] * 1.1;
			}
            
            //circles[200].radius += 10;
			colorMatrix.hue(keiths[1].rotation);

            analyser.getByteFrequencyData(frequencyData);
            console.log(frequencyData);
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

