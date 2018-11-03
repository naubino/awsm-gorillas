const DEBUG_GAME_PAD = true;
const haveEvents = 'ongamepadconnected' in window;
const controllers = {};

window.viewConfig = {x: 0, y: 0, rotation: 1, zoom: 1};

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
        const gamePad = controllers[0];
        if (gamePad) {
            const input = gamepad_normalize(gamePad);
            console.log(input);
            const { hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 } = input;
            window.viewConfig.x += hori1 * 8;
            window.viewConfig.y += vert1 * 8;
            window.viewConfig.rotation = Math.atan2(vert2, hori2);
            window.viewConfig.zoom += 0.01 * (-l2 + r2);
        }

        game.step();
        game.render_scene(viewConfig);
        requestAnimationFrame(loop);
    }
    loop();
}()

function gamepad_normalize(gamePad) {
    let hori1, vert1, l2, hori2, vert2, r2, hori3, vert3;
    // gilberts linux laptop
    if (gamePad.axes.length === 8) {
        [ hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 ] = gamePad.axes;
    }
    // hendriks mac book
    else if (gamePad.axes.length === 4) {
        const { axes, buttons } = gamePad;
        [ hori1, vert1, hori2, vert2 ] = axes;
        const btn = (i) => gamepad_btn(buttons[i]);
        l2 = btn(6);
        r2 = btn(7);
        hori3 = -btn(14) + btn(15);
        vert3 = -btn(12) + btn(13);
    }
    // don't know yet
    else console.error("I don't know this game pad mapping.");
    return { hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 };
}

// I hope only 'val' is needed, not 'pressed'
function gamepad_btn(val) {
    // var pressed = val == 1.0;
    if (typeof (val) == "object") {
        // pressed = val.pressed;
        val = val.value;
    }
    return val;
}

function input_update() {
    const [ hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 ] = gamePads.axes;

}


function debugAddGamePad(gamepad) {
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

function debugRemoveGamePad(gamepad) {
    var d = document.getElementById("controller" + gamepad.index);
    document.body.removeChild(d);
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

void function gamePad() {

    function connecthandler(e) {
        addgamepad(e.gamepad);
    }

    function addgamepad(gamepad) {
        controllers[gamepad.index] = gamepad;
        if (DEBUG_GAME_PAD) debugAddGamePad(gamepad);
    }

    function disconnecthandler(e) {
        removegamepad(e.gamepad);
    }

    function removegamepad(gamepad) {
        if (DEBUG_GAME_PAD) debugRemoveGamePad(gamepad);
        delete controllers[gamepad.index];
    }

    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);

    if (!haveEvents) {
        setInterval(scangamepads, 500);
    }
}()