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
type Num = Option<f64>;

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
pub struct PlayerConfig {
    x: f64,
    y: f64,
    radx: f64,
    rady: f64,
}

#[derive(Default, Debug, Serialize, Deserialize)]
pub struct ViewConfig {
    rotation: Option<f64>,
    x: Option<f64>,
    y: Option<f64>,
    zoom: Option<f64>,
}


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
    player_a: PlayerConfig,
    player_b: PlayerConfig,
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

    pub fn setup_boxes_scene(&mut self, raw_scene_config: &JsValue) {
        let scene_config: SceneConfig = raw_scene_config.into_serde().unwrap();

        let mut world = &mut self.world;

        world.set_gravity(Vector2::new(0.0, 0.981));

        shapes::make_ground(world, &scene_config);

        shapes::make_building(world, 1., 4, 5, &scene_config);
        shapes::make_building(world, 2., 5, 8, &scene_config);
        shapes::make_building(world, 3., 4, 6, &scene_config);
        shapes::make_building(world, 4., 3, 7, &scene_config);

        let gorilla_a = Gorilla::new(world, &scene_config.player_a);
        let gorilla_b = Gorilla::new(world, &scene_config.player_b);

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

struct Gorilla {
    pub shape: ShapeHandle,
    pub body: BodyHandle,
    pub collisionObject: CollisionObjectHandle,
}

impl Gorilla {
    pub fn new(world: &mut World, config: &PlayerConfig) -> Self {
        let pos = Isometry2::new(Vector2::new(config.x, config.y), 0.0);
        let shape = ShapeHandle::new(Cuboid::new(Vector2::new(config.radx, config.rady)));
        let body = world.add_rigid_body(pos, shape.inertia(0.1), shape.center_of_mass());
        let collisionObject = world.add_collider(0.0, shape.clone(), body, Isometry2::identity(), Material::default());

        Gorilla { shape, body, collisionObject }
    }
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

