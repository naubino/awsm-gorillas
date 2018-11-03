import { initGamePad, gamepadNormalize, controllers, scangamepads } from './gamepad';

const DEBUG_GAME_PAD = !true;

window.viewConfig = {x: 0, y: -500, rotation: 0, zoom: 1};

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

    const margin = 0.0000001;
    game.setup_boxes_scene({
        margin,
        box_radx: 0.1 - margin,
        box_rady: 0.1 - margin,
        ground_radx: 125 - margin,
        ground_rady: 1 - margin,
        ground_x: 0,
        ground_y: 9,
        f1: 1,
        f2: 2,
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
