export const controllers = {};
const haveEvents = 'ongamepadconnected' in window;

export function scangamepads() {
    var gamepads = navigator.getGamepads
        ? navigator.getGamepads()
        : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
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

function connecthandler(e) {
    addgamepad(e.gamepad);
}

function addgamepad(gamepad) {
    controllers[gamepad.index] = gamepad;
    if (debugGamePad) addGamePad(gamepad);
}

function disconnecthandler(e) {
    removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
    if (debugGamePad) debug.removeGamePad(gamepad);
    delete controllers[gamepad.index];
}

let debugGamePad = false;

export function initGamePad(_debugGamePad = false) {
    debugGamePad = _debugGamePad;

    window.addEventListener("gamepadconnected", connecthandler);
    window.addEventListener("gamepaddisconnected", disconnecthandler);

    if (!'ongamepadconnected' in window) {
        setInterval(scangamepads, 500);
    }
};

export function gamepadNormalize(gamePad) {
    let hori1, vert1, l2, hori2, vert2, r2, hori3, vert3;
    // gilberts linux laptop
    if (gamePad.axes.length === 8) {
        [ hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 ] = gamePad.axes;
    }
    // hendriks mac book
    else if (gamePad.axes.length === 4) {
        const { axes, buttons } = gamePad;
        [ hori1, vert1, hori2, vert2 ] = axes;
        const btn = (i) => gamepadButton(buttons[i]);
        l2 = btn(6);
        r2 = btn(7);
        hori3 = -btn(14) + btn(15);
        vert3 = -btn(12) + btn(13);
    }
    // don't know yet
    else console.error("I don't know this game pad mapping.");
    const arr = [ hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 ];
    return arr.map((x) => x * x > 0.01 ? x : 0);
}

// I hope only 'val' is needed, not 'pressed'
function gamepadButton(val) {
    // var pressed = val == 1.0;
    if (typeof (val) == "object") {
        // pressed = val.pressed;
        val = val.value;
    }
    return val;
}


function addGamePad(gamepad) {
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
    requestAnimationFrame(updateGamePad);
}

function updateGamePad() {
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

    requestAnimationFrame(updateGamePad);
}

function removeGamePad(gamepad) {
    var d = document.getElementById("controller" + gamepad.index);
    document.body.removeChild(d);
}
