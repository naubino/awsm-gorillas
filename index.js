import { initGamePad, gamepadNormalize, controllers } from './gamepad';

const DEBUG_GAME_PAD = true;

window.viewConfig = {x: 0, y: -500, rotation: 0, zoom: 1};

void async function main() {
    const js = await import("./pkg");
    js.listen_for_keys();

    initGamePad(DEBUG_GAME_PAD);

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
            const input = gamepadNormalize(gamePad);
            const [ hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 ] = input;
            window.viewConfig.x += hori1 * 8;
            window.viewConfig.y += vert1 * 8;
            //window.viewConfig.rotation = Math.atan2(vert2, hori2);
            window.viewConfig.zoom += 0.01 * (-l2 + r2);
        }

        game.step();
        game.render_scene(viewConfig);
        requestAnimationFrame(loop);
    }
    loop();
}()
