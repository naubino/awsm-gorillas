extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

extern crate web_sys;

use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};

extern crate nalgebra as na;
extern crate ncollide2d;
extern crate nphysics2d;

extern crate serde;
#[macro_use]
extern crate serde_derive;
extern crate serde_json;

use na::{Vector2};
use ncollide2d::shape::{Cuboid};
use ncollide2d::world::CollisionObjectHandle;
use nphysics2d::object::{BodyHandle, Material};
use nphysics2d::volumetric::Volumetric;

type World = nphysics2d::world::World<f64>;
type Isometry2 = na::Isometry2<f64>;
type ShapeHandle = ncollide2d::shape::ShapeHandle<f64>;

#[wasm_bindgen]
extern {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(msg: &str);

    #[wasm_bindgen(js_namespace = console)]
    pub fn debug(msg: &str);
}


#[derive(Debug, Serialize, Deserialize)]
pub struct GameConfig {
    width: Option<f64>,
    height: Option<f64>,
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
        debug(&format!("game config: {:?}", conf));
        Game {
            canvas: canvas,
            world: World::new(),
        }
    }

    pub fn setup_boxes_scene(&mut self) {
        setup_nphysics_boxes_scene(&mut self.world);
    }

    pub fn render_scene(&self) {
        let context = canvas_get_context_2d(&self.canvas);
        context.clear_rect(0., 0., self.canvas.width().into(), self.canvas.height().into());
        render_nphysics_world(&self.world, context);
    }

    pub fn step(&mut self) {
        self.world.step();
    }
}

struct SimpleBox {
    shape: ShapeHandle,
    body: BodyHandle,
    collisionObject: CollisionObjectHandle,
}

impl SimpleBox {
    pub fn new(world: &mut World, transform: Isometry2, radx: f64, rady: f64) -> SimpleBox {
        let shape = make_box_shape(radx, rady);
        let body = make_simple_body(world, transform, shape.clone());
        let collisionObject = make_simple_collider(world, shape.clone(), body);
        SimpleBox { shape, body, collisionObject }
    }
}

fn canvas_get_context_2d(canvas: &HtmlCanvasElement) -> CanvasRenderingContext2d {
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
    let pos = Isometry2::new(Vector2::new(0., 8.), na::zero());
    debug(&format!("make_ground {:?}", (margin, radius_x, radius_y, radius, pos)));
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
    let margin = 0.01;
    let transform = Isometry2::identity();
    let material = Material::default();
    world.add_collider(margin, shape, body, transform, material)
}

// example nphysics scenes

fn setup_nphysics_boxes_scene(world: &mut World) {
    world.set_gravity(Vector2::new(0.0, 9.81));

    let ground = make_ground(world);

    let num = 25;
    let radx = 0.1;
    let rady = 0.1;
    let shiftx = radx * 2.0;
    let shifty = rady * 3.0;
    let centerx = shiftx * num as f64 / 2.0;
    let centery = shifty / 2.0;

    for i in 0usize..num {
        for j in 0..num {
            let x = i as f64 * shiftx - centerx;
            let y = j as f64 * shifty + centery;
            let pos = Isometry2::new(Vector2::new(x, y), 0.0);
            SimpleBox::new(world, pos, radx, rady);
        }
    }
}

fn render_nphysics_world(world: &World, ctx: CanvasRenderingContext2d) {
    world.colliders().for_each(|collider| {
        if let Some(body) = world.rigid_body(collider.data().body()) {

            let pos = body.position().translation.vector;
            let x = pos.x;
            let y = pos.y;

            let rotation = body.position().rotation;
            let shape = collider.shape();

            if let Some(cube) = shape.as_shape::<Cuboid<_>>() {
                let size = cube.half_extents();
                let (w, h) = (size.x, size.y);
                ctx.begin_path();
                ctx.save();
                ctx.scale(100., 100.);
                ctx.translate(x-w, y-h);
                ctx.rotate(rotation.angle());
                ctx.rect(0.,0., w*2., h*2.);
                // ctx.rect(20.0 + pos.x * 100.0, pos.y * 100.0, 10.0, 10.0);
                ctx.fill();
                ctx.restore();
                // console::log_2(&pos.x.into(), &pos.y.into());
            }
        }
    });
}

