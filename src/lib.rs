#![allow(unused_macros)]
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};
use web_sys::{EventTarget, KeyboardEvent};

use serde_derive::{Serialize, Deserialize};

use nalgebra::{Vector2, zero};
use ncollide2d::shape::{Cuboid};
use ncollide2d::world::CollisionObjectHandle;
use nphysics2d::object::{BodyHandle, Material};
use nphysics2d::volumetric::Volumetric;

mod dom_helpers;
mod shapes;

type World = nphysics2d::world::World<f64>;
type Isometry2 = nalgebra::Isometry2<f64>;
type ShapeHandle = ncollide2d::shape::ShapeHandle<f64>;

#[wasm_bindgen]
extern {
    #[wasm_bindgen(js_namespace = console)] pub fn warn(msg: &str);
    #[wasm_bindgen(js_namespace = console)] pub fn debug(msg: &str);
    #[wasm_bindgen(js_namespace = console)] pub fn error(msg: &str);
}

macro_rules! debug { ($($arg:tt)*) => (debug(&format!($($arg)*));) }
macro_rules! warn { ($($arg:tt)*) => (warn(&format!($($arg)*));) }
macro_rules! error { ($($arg:tt)*) => (error(&format!($($arg)*));) }

#[derive(Debug, Serialize, Deserialize)]
pub struct GameConfig {
    width: Option<f64>,
    height: Option<f64>,
}

#[derive(Default, Debug, Serialize, Deserialize)]
pub struct ViewConfig {
    rotation: Option<f64>,
    x: Option<f64>,
    y: Option<f64>,
    zoom: Option<f64>,
}

type Num = Option<f64>;

#[derive(Default, Debug, Serialize, Deserialize)]
pub struct SceneConfig {
    margin: Num,
    box_radx: Num,
    box_rady: Num,
    ground_radx: Num,
    ground_rady: Num,
    ground_x: Num,
    ground_y: Num,
    f1: Num,
    f2: Num,
}

#[wasm_bindgen]
pub struct Game {
    canvas: HtmlCanvasElement,
    world: World,
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(constructor)]
    pub fn new(canvas: HtmlCanvasElement, config: &JsValue) -> Game {
        let conf: GameConfig = config.into_serde().unwrap();
        debug!("game config: {:?}", conf);
        Game {
            canvas: canvas,
            world: World::new(),
        }
    }

    pub fn setup_boxes_scene(&mut self, scene_conf: &JsValue) {
        let scene_config: SceneConfig = scene_conf.into_serde().unwrap();

        setup_nphysics_boxes_scene(&mut self.world, &scene_config);
    }

    pub fn render_scene(&self, view_conf: &JsValue) {
        let view_config: ViewConfig = view_conf.into_serde().unwrap();

        let ctx = dom_helpers::canvas_get_ctx_2d(&self.canvas);
        ctx.clear_rect(0.0, 0.0, self.canvas.width().into(), self.canvas.height().into());
        ctx.save();
        ctx.translate(view_config.x.unwrap_or(0.0), view_config.y.unwrap_or(0.0)).unwrap();
        ctx.rotate(view_config.rotation.unwrap_or(0.0)).unwrap();
        ctx.scale(view_config.zoom.unwrap_or(1.0), view_config.zoom.unwrap_or(1.0)).unwrap();
        render_nphysics_world(&self.world, &ctx);
        ctx.restore();
    }

    pub fn step(&mut self) {
        self.world.step();
    }

}

struct SimpleBox {
    pub shape: ShapeHandle,
    pub body: BodyHandle,
    pub collisionObject: CollisionObjectHandle,
}

impl SimpleBox {
    pub fn new(world: &mut World, transform: Isometry2, radx: f64, rady: f64, margin: f64) -> SimpleBox {
        let shape = ShapeHandle::new(Cuboid::new(Vector2::new(radx, rady)));
        let body = world.add_rigid_body(transform, shape.inertia(0.1), shape.center_of_mass());
        let collisionObject = world.add_collider(margin, shape.clone(), body, Isometry2::identity(), Material::default());
        SimpleBox { shape, body, collisionObject }
    }

    pub fn from_vector(world: &mut World, vector: Vector2<f64>, radx: f64, rady: f64, margin: f64) -> Self {
        let pos = Isometry2::new(vector, 0.0);
        SimpleBox::new(world, pos, radx, rady, margin)
    }
}

// example nphysics scenes

fn make_building(world: &mut World, x_pos: f64, width: usize, height: usize, cfg: &SceneConfig) {

    let margin = cfg.margin.unwrap_or(0.);
    let radx = cfg.box_radx.unwrap_or(1.);
    let rady = cfg.box_rady.unwrap_or(1.);
    let ground_x = cfg.ground_x.unwrap_or(0.);
    let ground_y = cfg.ground_y.unwrap_or(0.);
    let ground_rady = cfg.ground_rady.unwrap_or(0.);
    let f1 = cfg.f1.unwrap_or(1.);
    let f2 = cfg.f2.unwrap_or(1.);
    //let shiftx = radx * 2.0;
    //let shifty = rady * -2.0;
    //let centerx = shiftx * width as f64 / 2.0 - 3.;

    let ground_pos = Vector2::new(ground_x, ground_y - ground_rady);
    //let ground_pos = Isometry2::new(ground, zero()).translation.vector;

    let w = radx + margin;
    let h = rady + margin;

    for yi in 0..height {
        for xi in 0..width {
            let x = xi as f64;
            let y = yi as f64;

            let vec = Vector2::new(x_pos + x * 2.0 * w, ground_y - ground_rady - h * (1. + margin + 2. * (y + margin)));

            SimpleBox::from_vector(world, vec, radx, rady, margin);
        }
    }
}

fn setup_nphysics_boxes_scene(world: &mut World, cfg: &SceneConfig) {
    world.set_gravity(Vector2::new(0.0, 0.981));

    shapes::make_ground(world, cfg);
    make_building(world, 1., 3, 5, cfg);
    make_building(world, 2., 3, 5, cfg);
    make_building(world, 3., 4, 6, cfg);
    make_building(world, 4., 3, 7, cfg);


}

fn render_nphysics_world(world: &World, ctx: &CanvasRenderingContext2d) {
    world.colliders().for_each(|collider| {

        if let Some(body) = world.rigid_body(collider.data().body()) {

            let pos = body.position().translation.vector;
            let x = pos.x;
            let y = pos.y;

            let rotation = body.position().rotation;
            let shape = collider.shape();

            if let Some(cube) = shape.as_shape::<Cuboid<_>>() {
                // let shape_offset = collider.position().translate.vector;
                let size = cube.half_extents();
                let (w, h) = (size.x, size.y);
                ctx.begin_path();
                ctx.save();
                ctx.scale(100., 100.).unwrap();
                // ctx.translate(x - w + shape_offset.x, y - h + shape_offset.y);
                ctx.translate(x , y).unwrap();
                ctx.rotate(rotation.angle()).unwrap();
                ctx.rect(-w, -h,  w * 2., h * 2.);
                // ctx.rect(20.0 + pos.x * 100.0, pos.y * 100.0, 10.0, 10.0);
                // ctx.fill();
                ctx.set_line_width(0.01);
                ctx.stroke();

                ctx.set_fill_style(&JsValue::from(String::from("red")));
                ctx.fill_rect(0., 0., 0.01, 0.01);

                ctx.restore();
                // console::log_2(&pos.x.into(), &pos.y.into());
            } else {
                debug!("not painting" );
            }
        }
    });
    // debug!("painted colliders" );
}

