extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

extern crate web_sys;

use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};

extern crate nalgebra as na;
extern crate ncollide2d;
extern crate nphysics2d;

use na::{Isometry2, Vector2};
use ncollide2d::shape::{Cuboid, ShapeHandle};
use nphysics2d::object::{BodyHandle, Material};
use nphysics2d::volumetric::Volumetric;

type World = nphysics2d::world::World<f64>;

//

#[wasm_bindgen]
pub struct Game {
    canvas: HtmlCanvasElement,
    world: World,
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(constructor)]
    pub fn new(canvas: HtmlCanvasElement) -> Game {
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
        render_nphysics_world(&self.world, context);
    }

    pub fn step(&mut self) {
        self.world.step();
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

fn render_nphysics_world(world: &World, ctx: CanvasRenderingContext2d) {
    world.colliders().for_each(|collider| {
        if let Some(body) = world.rigid_body(collider.data().body()) {
            let pos = body.position().translation.vector;
            let shape = collider.shape();
            if shape.is_shape::<Cuboid<_>>() {
                ctx.begin_path();
                ctx.rect(20.0 + pos.x * 100.0, pos.y * 100.0, 10.0, 10.0);
                ctx.fill();
                // console::log_2(&pos.x.into(), &pos.y.into());
            }
        }
    });
}

// example nphysics scenes

const COLLIDER_MARGIN: f64 = 0.01;

fn setup_nphysics_boxes_scene(world: &mut World) {
    world.set_gravity(Vector2::new(0.0, -9.81));

    /*
     * Ground
     */
    let ground_radx = 25.0;
    let ground_rady = 1.0;
    let ground_shape = ShapeHandle::new(Cuboid::new(Vector2::new(
        ground_radx - COLLIDER_MARGIN,
        ground_rady - COLLIDER_MARGIN,
    )));

    let ground_pos = Isometry2::new(-Vector2::y() * ground_rady, na::zero());
    world.add_collider(
        COLLIDER_MARGIN,
        ground_shape,
        BodyHandle::ground(),
        ground_pos,
        Material::default(),
    );

    /*
     * Create the boxes
     */
    let num = 25;
    let radx = 0.1;
    let rady = 0.1;
    let shiftx = radx * 2.0;
    let shifty = rady * 2.0;
    let centerx = shiftx * num as f64 / 2.0;
    let centery = shifty / 2.0;

    let geom = ShapeHandle::new(Cuboid::new(Vector2::new(
        radx - COLLIDER_MARGIN,
        rady - COLLIDER_MARGIN,
    )));
    let inertia = geom.inertia(1.0);
    let center_of_mass = geom.center_of_mass();

    for i in 0usize..num {
        for j in 0..num {
            let x = i as f64 * shiftx - centerx;
            let y = j as f64 * shifty + centery;

            /*
             * Create the rigid body.
             */
            let pos = Isometry2::new(Vector2::new(x, y), 0.0);
            let handle = world.add_rigid_body(pos, inertia, center_of_mass);

            /*
             * Create the collider.
             */
            world.add_collider(
                COLLIDER_MARGIN,
                geom.clone(),
                handle,
                Isometry2::identity(),
                Material::default(),
            );
        }
    }
}
