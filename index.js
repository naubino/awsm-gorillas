import { initGamePad, gamepadNormalize, controllers, scangamepads } from './gamepad';

const DEBUG_GAME_PAD = !true;

window.viewConfig = {x: 0, y: -10, rotation: 0, zoom: 1};

void async function main() {
    const wasm = await import("./pkg");

    initGamePad(DEBUG_GAME_PAD);

    const canvas = document.createElement('canvas');
    canvas.style.border = "1px solid black";
    const [width, height] = [800, 800];
    canvas.width = width;
    canvas.height = height;

    document.body.appendChild(canvas);

    const game = new wasm.Game(canvas, { width, height });
    window.game = game;

    const margin = 0.000000001;
    game.set_scene({
        margin,
        gravity: 0.8,
        box_radx: 0.1 - margin,
        box_rady: 0.1 - margin,
        ground_radx: 125 - margin,
        ground_rady: 1 - margin,
        ground_x: 0,
        ground_y: 9,
        f1: 1,
        f2: 2,

        buildings: [
            {x: 0.2, w: 3, h: 18},
            {x: 1.1, w: 3, h: 8},
            {x: 2.0, w: 4, h: 6},
            {x: 3.0, w: 3, h: 8},
            {x: 4.0, w: 2, h: 9},
            //{x: 5.2, w: 5, h: 24},
            {x: 6.2, w: 5, h: 28},
            //{x: 7.4, w: 2, h: 39},
            // {x: 8.4, w: 2, h: 39},
            // {x: 9.4, w: 2, h: 39},
            // {x: 10.4, w: 2, h: 39},
            // {x: 11.4, w: 2, h: 39},
            // {x: 12.4, w: 2, h: 39},
            // {x: 14.4, w: 2, h: 39},
            // {x: 16.4, w: 2, h: 39},
            // {x: 18.4, w: 2, h: 39},
            // {x: 20.4, w: 2, h: 39},
            // {x: 22.4, w: 2, h: 39},
        ],

        player_a: {x: 1.3, y: 5.6, radx: 0.2, rady: 0.3},
        player_b: {x: 6.8,   y: 1.8, radx: 0.2, rady: 0.3},
    });

    const loop = () => {
        const gamePad = controllers[0];
        if (gamePad) {
            const input = gamepadNormalize(gamePad);
            const [ hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 ] = input;
            window.viewConfig.x -= hori1 * 8;
            window.viewConfig.y -= vert1 * 8;
            //window.viewConfig.rotation = Math.atan2(vert2, hori2);
            window.viewConfig.zoom += 0.01 * (-l2 + r2);
            scangamepads();
        }

        game.step();
        game.render_scene(viewConfig);
        requestAnimationFrame(loop);
    }
    loop();
}()
