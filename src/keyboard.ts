var keyStates: { [keyCode: number]: boolean } = []

window.addEventListener(
    "keydown", function onDown(event: KeyboardEvent) {
        keyStates[event.keyCode] = true;
    }, false
);

window.addEventListener(
    "keyup", function onDown(event: KeyboardEvent) {
        keyStates[event.keyCode] = false;
    }, false
);

export default keyStates;
