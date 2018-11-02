async function main() {
    const js = await import("./pkg");

    const canvas = document.createElement('canvas');
    const width = 800;
    const height = 800;
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    const game = new js.Game(canvas, {width, height});
    game.setup_boxes_scene();
    const loop = () => {
        game.step();
        game.render_scene();
        requestAnimationFrame(loop);
    }
    loop();
}

main();
