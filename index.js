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
    const game = new js.Game(canvas, {width, height});
    game.setup_boxes_scene();
    const loop = () => {
        game.step();
        game.render_scene();
        requestAnimationFrame(loop);
    }
    loop();
}()
