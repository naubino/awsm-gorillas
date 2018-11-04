import { initGamePad, gamepadNormalize, controllers, scangamepads } from './gamepad';

const DEBUG_GAME_PAD = !true;

window.viewConfig = {x: 0, y: 2.7 * 100, rotation: 0, zoom: 0.4};

void async function main() {
    const wasm = await import("./pkg");

    initGamePad(DEBUG_GAME_PAD);

    const canvas = document.createElement('canvas');
    canvas.style.border = "1px solid black";
    const [width, height] = [800, 600];
    canvas.width = width;
    canvas.height = height;

    document.body.appendChild(canvas);

    const game = new wasm.Game(canvas, { width, height });
    window.game = game;

    const margin = 0.00000000001;
    game.set_scene({
        margin,
        gravity: 9.81,
        box_radx: 0.21 - margin,
        box_rady: 0.10 - margin,
        ground_radx: 125 - margin,
        ground_rady: 1 - margin,
        ground_x: 0,
        ground_y: 9,
        f1: 1,
        f2: 2,

        buildings: [
            {x:  0.5, w: 5, h: 21},
            {x:  2.9, w: 3, h: 12},
            {x:  4.5, w: 3, h: 15},

            {x:  8.8, w: 7, h: 38},

            {x: 14.3, w: 3, h: 15},
            {x: 15.9, w: 3, h: 12},
            {x: 17.5, w: 5, h: 21},
            // {x: 8.2, w: 8, h: 69},
        ],

        player_a: {x: 1.2,  y: 0.9, radx: 0.2, rady: 0.3, inertia: 0.1 },
        player_b: {x: 17.8, y: 0.4, radx: 0.2, rady: 0.3, inertia: 0.1 },
    });

    let last_time = +performance.now();
    const loop = (timestamp) => {
        try { scangamepads(); } catch {}

        if (controllers[0]) controlPlayer(0, controllers[0]);
        if (controllers[1]) controlPlayer(1, controllers[1]);

        const dt = +timestamp - last_time;
        last_time = +timestamp;

        game.step(1 / 60);
        game.render_scene(viewConfig);

        requestAnimationFrame(loop);
    }
    loop();


    function controlPlayer(player, gamePad) {
        const input = gamepadNormalize(gamePad);

        const [ hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 ] = input;

        window.viewConfig.x -= hori2 * 10;
        window.viewConfig.y -= vert2 * 10;
        window.viewConfig.zoom += 0.01 * (-l2 + r2);

        const pos = game.gorilla_pos(player);
        const mag = Math.sqrt(vert1*vert1 + hori1*hori1);
        const rot = vert1 || hori1 ? Math.atan2(vert1, hori1) : 0;

        const btnX = gamePad.buttons[0].pressed;
        const btnO = gamePad.buttons[1].pressed;
        const btnSqr = gamePad.buttons[2].pressed;
        const btnTri = gamePad.buttons[3].pressed;

        
        const x = pos.x + hori1 * 0.2;
        const y = pos.y + vert1 * 0.2;
        const power = Math.max(8, 20 * mag);


        let shot = { x, y, rot, power, gorilla_id: player };
        if (btnX) {
            shot.config = {
                w: 0.2,
                h: 0.08,
                inertia: 0.1,
                ttl: 20,
                cost: 0.03,
            };
        }
        if (btnO) {
            shot.config = {
                w: 0.3,
                h: 0.1,
                inertia: 1,
                ttl: 20,
                cost: 0.3,
            }
        }

        if (btnX || btnO) {
            game.shoot(shot, (Math.random() - 0.5) * 100);
        }
    }

}()
