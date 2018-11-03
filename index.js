void async function main() {
    const js = await import("./pkg");
    js.listen_for_keys();

    const canvas = document.createElement('canvas');
    canvas.style.border = "1px solid black";
    const width = 800;
    const height = 800;
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    const game = new js.Game(canvas, { width, height });
    window.game = game;
    game.setup_boxes_scene();
    
    const loop = () => {
        const gamePad = gamePads[0];
        if (gamePad) {
            const [ hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 ] = gamePad.axes;
            game.pan(hori1 * 5);
        }

        game.step();
        game.render_scene();
        requestAnimationFrame(loop);
    }
    loop();
}()

function input_update() {
    const [ hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 ] = gamePads.axes;

}


function debugAddGamePad() {
    var d = document.createElement("div");
    d.setAttribute("id", "controller" + gamepad.index);

    var t = document.createElement("h1");
    t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
    d.appendChild(t);

    var b = document.createElement("div");
    b.className = "buttons";
    for (var i = 0; i < gamepad.buttons.length; i++) {
        var e = document.createElement("span");
        e.className = "button";
        //e.id = "b" + i;
        e.innerHTML = i;
        b.appendChild(e);
    }

    d.appendChild(b);

    var a = document.createElement("div");
    a.className = "axes";

    for (var i = 0; i < gamepad.axes.length; i++) {
        var p = document.createElement("progress");
        p.className = "axis";
        //p.id = "a" + i;
        p.setAttribute("max", "2");
        p.setAttribute("value", "1");
        p.innerHTML = i;
        a.appendChild(p);
    }

    d.appendChild(a);

    // See https://github.com/luser/gamepadtest/blob/master/index.html
    var start = document.getElementById("start");
    if (start) {
        start.style.display = "none";
    }

    document.body.appendChild(d);
    requestAnimationFrame(debugUpdateGamePad);
}

function debugUpdateGamePad() {
    if (!haveEvents) {
        scangamepads();
    }

    var i = 0;
    var j;

    for (j in controllers) {
        var controller = controllers[j];
        var d = document.getElementById("controller" + j);
        var buttons = d.getElementsByClassName("button");

        for (i = 0; i < controller.buttons.length; i++) {
            var b = buttons[i];
            var val = controller.buttons[i];
            var pressed = val == 1.0;
            if (typeof (val) == "object") {
                pressed = val.pressed;
                val = val.value;
            }

            var pct = Math.round(val * 100) + "%";
            b.style.backgroundSize = pct + " " + pct;

            if (pressed) {
                b.style.backgroundColor = "orange";
            } else {
                b.style.backgroundColor = "white";
            }
        }

        var axes = d.getElementsByClassName("axis");
        for (i = 0; i < controller.axes.length; i++) {
            var a = axes[i];
            a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
            a.setAttribute("value", controller.axes[i] + 1);
        }
    }

    requestAnimationFrame(debugUpdateGamePad);
}

function debugRemoveGamePad() {
    var d = document.getElementById("controller" + gamepad.index);
    document.body.removeChild(d);
}

let gamePads;
void function gamePad() {

    let haveEvents = 'ongamepadconnected' in window;
    let controllers = {};
    gamePads = controllers;

    function connecthandler(e) {
        addgamepad(e.gamepad);
    }

    function addgamepad(gamepad) {
        controllers[gamepad.index] = gamepad;
        if (DEBUG_GAME_PAD) debugAddGamePad();
    }

    function disconnecthandler(e) {
        removegamepad(e.gamepad);
    }

    function removegamepad(gamepad) {
        if (DEBUG_GAME_PAD) debugRemoveGamePad();
        delete controllers[gamepad.index];
    }

    function scangamepads() {
        var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
        for (var i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                if (gamepads[i].index in controllers) {
                    controllers[gamepads[i].index] = gamepads[i];
                } else {
                    addgamepad(gamepads[i]);
                }
            }
        }
    }

    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);

    if (!haveEvents) {
        setInterval(scangamepads, 500);
    }
}()