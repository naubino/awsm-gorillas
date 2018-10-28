async function main() {
    const js = await import("./pkg");

    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const game = new js.Game(canvas);
    game.setup_boxes_scene();
    const loop = () => {
        game.step();
        game.render_scene();
        //requestAnimationFrame(loop);
    }
    loop();
}

main();