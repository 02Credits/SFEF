

var keyStatus: { [keyCode: number]: boolean; } = {};
var keyEvents: { [keyCode: number]: ((down: boolean) => void)[]; } = {};

window.addEventListener(
    "keydown", (event) => {
        keyStatus[event.keyCode] = true;
        if (_.has(keyEvents, event.keyCode))
        {
            _.each(keyEvents[event.keyCode], (handler) => {
                handler(true);
            });
        }
        event.preventDefault();
    }, false);

window.addEventListener(
    "keyup", (event) => {
        keyStatus[event.keyCode] = false;
        if (_.has(keyEvents, event.keyCode))
        {
            _.each(keyEvents[event.keyCode], (handler) => {
                handler(false);
            });
        }
        event.preventDefault();
    }, false);

function AddHandler(keycode: number, handler: (down: boolean) => void) {
    if (_.has(keyEvents, keycode))
    {
        keyEvents[keycode].push(handler);
    }
    else
    {
        keyEvents[keycode] = [];
        AddHandler(keycode, handler);
    }
}

function IsDown(keycode: number)
{
    if (_.has(keyStatus, keycode))
    {
        return keyStatus[keycode];
    }
    else
    {
        return false;
    }
}

export default {
    AddHandler: AddHandler,
    IsDown: IsDown
};
