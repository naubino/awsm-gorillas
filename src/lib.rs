#![allow(unused_macros)]
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};
use web_sys::{Document, EventTarget, KeyboardEvent};

use serde_derive::{Serialize, Deserialize};

use nalgebra::{Vector2, zero};
use ncollide2d::shape::{Cuboid};
use ncollide2d::world::CollisionObjectHandle;
use nphysics2d::object::{BodyHandle, Material};
use nphysics2d::volumetric::Volumetric;

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

    pub fn setup_boxes_scene(&mut self) {
        setup_nphysics_boxes_scene(&mut self.world);
    }

    pub fn render_scene(&self, view_conf: &JsValue) {
        let view_config: ViewConfig = view_conf.into_serde().unwrap();

        let ctx = canvas_get_ctx_2d(&self.canvas);
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
    pub fn new(world: &mut World, transform: Isometry2, radx: f64, rady: f64) -> SimpleBox {
        let shape = make_box_shape(radx, rady);
        let body = make_simple_body(world, transform, shape.clone());
        let collisionObject = make_simple_collider(world, shape.clone(), body);
        SimpleBox { shape, body, collisionObject }
    }

    pub fn from_vector(world: &mut World, vector: Vector2<f64>, radx: f64, rady: f64) -> Self {
        let pos = Isometry2::new(vector, 0.0);
        SimpleBox::new(world, pos, radx, rady)
    }
}

#[wasm_bindgen]
pub fn listen_for_keys() -> Result<(), JsValue> {
    let document = get_document();

    let cb = Closure::wrap(Box::new(move |v: KeyboardEvent| {
        debug!("down wityh all the keys: {:#?}", v.key())
    }) as Box<dyn Fn(_)>);

    let et: &EventTarget = document.as_ref();
    et.add_event_listener_with_callback("keydown", cb.as_ref().unchecked_ref())?;
    cb.forget();

    Ok(())
}

fn get_document() -> Document {
    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");

    document
}

fn canvas_get_ctx_2d(canvas: &HtmlCanvasElement) -> CanvasRenderingContext2d {
    canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into::<CanvasRenderingContext2d>()
        .unwrap()
}

fn make_ground(world: &mut World) -> CollisionObjectHandle {
    let margin = 0.01;
    let radius_x = 125.0 - margin;
    let radius_y = 1.0 - margin;
    let radius = Vector2::new(radius_x, radius_y);
    let cuboid = Cuboid::new(radius);
    let shape = ShapeHandle::new(cuboid);
    let pos = Isometry2::new(Vector2::new(0., 9. ), zero());
    debug!("make_ground {:?}", (margin, radius_x, radius_y, radius, pos));

    world.add_collider(
        margin,
        shape,
        BodyHandle::ground(),
        pos,
        Material::default(),
    )
}


fn make_box_shape(radx: f64, rady: f64) -> ShapeHandle {
    ShapeHandle::new(Cuboid::new(Vector2::new(radx, rady)))
}

fn make_simple_body(world: &mut World, transform: Isometry2, shape: ShapeHandle) -> BodyHandle {
    world.add_rigid_body(transform, shape.inertia(0.1), shape.center_of_mass())
}

fn make_simple_collider(world: &mut World, shape: ShapeHandle, body: BodyHandle) -> CollisionObjectHandle {
    let margin = 0.00;
    let transform = Isometry2::identity();
    let material = Material::default();
    world.add_collider(margin, shape, body, transform, material)
}

// example nphysics scenes

fn make_building(world: &mut World, x_pos: f64, width: usize, height: usize) {

    let radx = 0.1;
    let rady = 0.1;
    let shiftx = radx * 2.0;
    let shifty = rady * -2.0;
    let centerx = shiftx * width as f64 / 2.0 - 3.;

    let ground_pos = Isometry2::new(Vector2::new(0., 8.00), zero()).translation.vector;

    // for yi in 0usize..height {
    //     // for xi in 0..width {
    //     // let xi = 1;
    //     //     let x = xi as f64 * shiftx - ground_pos.x + x_pos;
    //     //     let y = ground_pos.y - yi as f64 * shifty;
    //     //     let pos = Isometry2::new(Vector2::new(x, y), 0.0);
    //         SimpleBox::new(world, pos, radx, rady);
    //     // }
    // }

    SimpleBox::from_vector(world, Vector2::new(1., ground_pos.y - rady), radx, rady);
    SimpleBox::from_vector(world, Vector2::new(1., ground_pos.y - rady - 2.5 * rady), radx, rady);
    SimpleBox::from_vector(world, Vector2::new(4., ground_pos.y - rady), radx, rady);
}

fn setup_nphysics_boxes_scene(world: &mut World) {
    world.set_gravity(Vector2::new(0.0, 0.981));

    make_ground(world);
    make_building(world, 1., 3, 5);
    // make_building(world, 2., 3, 5);
    // make_building(world, 3., 4, 6);
    // make_building(world, 4., 3, 7);


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

