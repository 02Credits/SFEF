import * as constants from "./constants";
import * as PIXI from "pixi.js";

export default class Circle {
    jonjo: PIXI.Sprite;
    keith: PIXI.Sprite;
    container: PIXI.Container;

    constructor(resources: PIXI.loaders.ResourceDictionary) {
        this.keith = new PIXI.Sprite(resources["images/keith.png"].texture);
				this.keith.anchor.set(-2, 0);
        this.container = new PIXI.Container();
        this.container.addChild(this.keith);
        this.jonjo = new PIXI.Sprite(resources["images/jonjo.png"].texture);
        this.jonjo.height = constants.JONJO_WIDTH;
        this.jonjo.width = constants.JONJO_WIDTH;
        this.jonjo.anchor.set(.5, .5);
        this.container.addChild(this.jonjo);
        var background = new PIXI.Sprite(resources["images/jonjo.png"].texture);
        background.width = constants.SPACING * 2;
        background.height = constants.SPACING * 2;
        background.anchor.set(.5, .5);
        background.visible = false;
        this.container.addChild(background);
    }
}
