import { initGamePad, gamepadNormalize, controllers, scangamepads } from './gamepad';

const DEBUG_GAME_PAD = !true;

window.viewConfig = {x: 0, y: 0.6, rotation: 0, zoom: 50.0};

const style = [ '#04aaac', '#ac0204', '#acaaac', '#aa04ac', '#aaac04' ]
const selectedLevel = 2;
const levels = [
    {
    buildings: [
        { x: -9.6, w: 5, h: 15, fill_style: style[2] },
        { x: -7.3, w: 5, h: 30, fill_style: style[1] },
        { x: -4.6, w: 7, h: 40, fill_style: style[4] },

        { x: 4.6, w: 7, h: 40, fill_style: style[3] },
        { x: 7.3, w: 5, h: 30, fill_style: style[0] },
        { x: 9.6, w: 5, h: 15, fill_style: style[2] },
    ],

    player_a: { x: -7.3, y: -4.0, radx: 0.2, rady: 0.3, inertia: 0.5 },
    player_b: { x: 7.3, y: -4.0, radx: 0.2, rady: 0.3, inertia: 0.5 },
},
    {
    buildings: [
        { x: -7.0, w: 7, h: 40, fill_style: style[0] },
        { x: -4.3, w: 5, h: 25, fill_style: style[1] },
        { x: -2.0, w: 5, h: 15, fill_style: style[2] },

        { x: 2.0, w: 5, h: 15, fill_style: style[4] },
        { x: 4.3, w: 5, h: 25, fill_style: style[0] },
        { x: 7.0, w: 7, h: 40, fill_style: style[3] },
    ],

    player_a: { x: -7.0, y: -4.0, radx: 0.2, rady: 0.3, inertia: 0.5 },
    player_b: { x: 7.0, y: -4.0, radx: 0.2, rady: 0.3, inertia: 0.5 },
},
{
    buildings: [
        { x: -7.0, w: 5, h: 21, fill_style: style[0] },
        { x: -4.6, w: 3, h: 12, fill_style: style[1] },
        { x: -3.0, w: 3, h: 15, fill_style: style[2] },

        { x: 0.0, w: 7, h: 38, fill_style: style[3] },

        { x: 3.0, w: 3, h: 15, fill_style: style[4] },
        { x: 4.6, w: 3, h: 12, fill_style: style[1] },
        { x: 7.0, w: 5, h: 21, fill_style: style[0] },
    ],
    player_a: { x: -7.0, y: -1.0, radx: 0.2, rady: 0.3, inertia: 0.1 },
    player_b: { x: 7.0, y: -1.0, radx: 0.2, rady: 0.3, inertia: 0.1 },
},
(() => {

    const leftBuildings = [
        { x: -1.6, w: 5, h: 45, fill_style: style[2] },
        { x: -9.6, w: 5, h: 15, fill_style: style[2] },
        { x: -7.3, w: 5, h: 30, fill_style: style[1] },
        { x: -4.6, w: 7, h: 40, fill_style: style[4] },
    ];

    const rightBuildings = leftBuildings.map(building => ({
        ...building,
        x: -building.x,
    }));


    return {
        buildings: [
            ...leftBuildings,
            ... rightBuildings
        ],

        player_a: { x: -7.3, y: -4.0, radx: 0.2, rady: 0.3, inertia: 0.5 },
        player_b: { x: 7.3, y: -4.0, radx: 0.2, rady: 0.3, inertia: 0.5 },
    };
})()
];


const shotConfigs = {
    light: {
        w: 0.2,
        h: 0.08,
        inertia: 0.8,
        ttl: 10,
        cost: 0.1,
    },
    medium: {
        w: 0.3,
        h: 0.1,
        inertia: 1,
        ttl: 10,
        cost: 0.3,
    },
    heavy: {
        w: 0.6,
        h: 0.2,
        inertia: 1,
        ttl: 10,
        cost: 3.0,
    }
};

void async function main() {
    const wasm = await import("./pkg");

    initGamePad(DEBUG_GAME_PAD);

    const gorilla_img = document.createElement('img');
    gorilla_img.src = "gorilla.png";
    gorilla_img.id = "gorilla-png";

    const canvas = document.createElement('canvas');
    canvas.style.border = "1px solid black";
    const [width, height] = [800, 500];
    canvas.width = width;
    canvas.height = height;
    canvas.style.marginLeft  = "auto"
    canvas.style.marginRight = "auto"
    canvas.style.display = "block"

    document.body.appendChild(canvas);

    const integration_parameters = {
        dt: 1.0 / 60.0,
        erp: 0.2,
        warmstart_coeff: 1.00,
        restitution_velocity_threshold: 1.0,
        allowed_linear_error: 0.0001,
        allowed_angular_error: 0.0001,
        max_linear_correction: 100.0,
        max_angular_correction: 0.2,
        max_stabilization_multiplier: 0.2,
        max_velocity_iterations: 20,
        max_position_iterations: 2,
    };

    const game = new wasm.Game(canvas, gorilla_img, { width, height, integration_parameters });
    window.game = game;


    const margin = 0.00000000001;
    game.set_scene({
        margin,
        gravity: 9.81,
        box_radx: 0.21 - margin,
        box_rady: 0.10 - margin,
        ground_radx: 125 - margin,
        ground_rady: 4.5 ,
        ground_x: 0,
        ground_y: 9,
        f1: 1,
        f2: 2,

        ... levels[selectedLevel % levels.length]
    });

    let last_time = + performance.now();

    const loop = (timestamp) => {
        try { scangamepads(); } catch {}

        if (controllers[0]) controlPlayer(0, controllers[0], (btn) => shoot({game, playerIndex: 0}, btn));
        if (controllers[1]) controlPlayer(1, controllers[1], (btn) => shoot({game, playerIndex: 1}, btn));

        const dt = +timestamp - last_time;
        last_time = +timestamp;

        game.step(1 / 60);
        game.render_scene(viewConfig);

        requestAnimationFrame(loop);
    }
    loop();
}()


function controlPlayer(playerIndex, gamePad, shootCallback) {
    const input = gamepadNormalize(gamePad);

    const [ hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 ] = input;

    const rot = vert1 || hori1 ? Math.atan2(vert1, hori1) : 0;

    const btnX = gamePad.buttons[0].pressed;
    const btnO = gamePad.buttons[1].pressed;
    const btnTri = gamePad.buttons[2].pressed;
    const btnSqr = gamePad.buttons[3].pressed;
    const l1 = gamePad.buttons[4].pressed;
    const r1 = gamePad.buttons[5].pressed;

    
    window.viewConfig.x -= hori2 * 0.5;
    window.viewConfig.y -= vert2 * 0.5;
    window.viewConfig.zoom += 0.3 * (-l2 + r2);

    if (playerIndex === 0) {
        // if (l1) {window.viewConfig.rotation += 0.05}
        // if (r1) {window.viewConfig.rotation -= 0.05}
        if (l1) { window.viewConfig.x += 0.5 }
        if (r1) { window.viewConfig.x -= 0.5 }
    }
    shootCallback({btnX, btnO, btnTri, btnSqr, rot, hori1, vert1})
}

function shoot({game, playerIndex}, {btnX, btnO, btnSqr, btnTri, rot, hori1, vert1}) {

    const pos = game.gorilla_pos(playerIndex);
    const mag = Math.sqrt(vert1*vert1 + hori1*hori1);
    const power = Math.max(8, 14 * mag);
    const x = pos.x + hori1 * 0.2;
    const y = pos.y + vert1 * 0.2;

    const {light, medium, heavy} = shotConfigs;

    let shot = { x, y, rot, power, gorilla_id: playerIndex };
    if (btnX) {
        shot.config = light;
    }
    if (btnO) {
        shot.config = medium
    }
    if (btnTri) {
        shot.config = heavy
    }

    if (btnX || btnO || btnTri) {
        game.shoot(shot, (Math.random() - 0.5) * 100);
    }
}
