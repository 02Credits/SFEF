interface KeithSprite extends PIXI.Sprite {
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
    .load(setup);

//Define any variables that are used in more than one function
var cat: KeithSprite;

function setup() {

    //Create the `cat` sprite
    cat = new Sprite(resources["images/keith.png"].texture) as KeithSprite;
    cat.y = 96;
    cat.vx = 0;
    cat.vy = 0;
    stage.addChild(cat);

    //Capture the keyboard arrow keys
    var left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

    //Left arrow key `press` method
    left.press = function() {
        //Change the cat's velocity when the key is pressed
        cat.vx = -5;
        cat.vy = 0;
    };
    //Left arrow key `release` method
    left.release = function() {
        //If the left arrow has been released, and the right arrow isn't down,
        //and the cat isn't moving vertically:
        //Stop the cat
        if (!right.isDown && cat.vy === 0) {
            cat.vx = 0;
        }
    };

    //Up
    up.press = function() {
        cat.vy = -5;
        cat.vx = 0;
    };
    up.release = function() {
        if (!down.isDown && cat.vx === 0) {
            cat.vy = 0;
        }
    };

    //Right
    right.press = function() {
        cat.vx = 5;
        cat.vy = 0;
    };
    right.release = function() {
        if (!left.isDown && cat.vy === 0) {
            cat.vx = 0;
        }
    };

    //Down
    down.press = function() {
        cat.vy = 5;
        cat.vx = 0;
    };
    down.release = function() {
        if (!up.isDown && cat.vx === 0) {
            cat.vy = 0;
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

    //Use the cat's velocity to make it move
    cat.x += cat.vx;
    cat.y += cat.vy
	  cat.rotation += 0.1;
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
