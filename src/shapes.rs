#![allow(unused_imports)]
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

use crate::{debug, SceneConfig};

type World = nphysics2d::world::World<f64>;
type Isometry2 = nalgebra::Isometry2<f64>;
type ShapeHandle = ncollide2d::shape::ShapeHandle<f64>;

use crate::PlayerConfig;

macro_rules! debug { ($($arg:tt)*) => (debug(&format!($($arg)*));) }

pub struct Sprite {
    pub size: Vector2<f64>,
}

#[wasm_bindgen]
#[derive(Default, Serialize, Deserialize, Debug)]
pub struct BananaConfig {
    pub w: f64,
    pub h: f64,
    pub inertia: f64,
    pub explosive: bool,
    pub ttl: f64,
    pub stamina: Option<f64>,
    pub cost: f64,
}
pub struct Banana {
    pub shape: ShapeHandle,
    pub body: BodyHandle,
    pub collision_object: CollisionObjectHandle,
    pub sprite: Sprite,
    pub uid: usize,
    pub ttl: f64,
    pub stamina: f64,
    pub explosive: bool,
}

impl Banana {
    pub fn new(world: &mut World, config: &BananaConfig) -> Self {
        let pos = Isometry2::new(zero(), 0.0);
        let shape = ShapeHandle::new(Cuboid::new(Vector2::new(config.w * 0.5, config.h * 0.5)));
        let body = world.add_rigid_body(pos, shape.inertia(config.inertia), shape.center_of_mass());
        let collision_object = world.add_collider(0.0, shape.clone(), body, Isometry2::identity(), Material::default());

        let sprite_size = Vector2::new(config.w, config.h);
        let sprite = Sprite { size: sprite_size };
        let uid = collision_object.uid();
        let ttl = config.ttl;
        let stamina = config.stamina.unwrap_or(0.05);
        let explosive = config.explosive;

        Banana { shape, body, collision_object, sprite, uid, ttl, explosive, stamina }
    }
}

pub struct Gorilla {
    pub shape: ShapeHandle,
    pub body: BodyHandle,
    pub collision_object: CollisionObjectHandle,
    pub time_to_next_shot: f64,
}

impl Gorilla {
    pub fn new(world: &mut World, config: &PlayerConfig) -> Self {
        let pos = Isometry2::new(Vector2::new(config.x, config.y), 0.0);
        let shape = ShapeHandle::new(Cuboid::new(Vector2::new(config.radx, config.rady)));
        let body = world.add_rigid_body(pos, shape.inertia(config.inertia), shape.center_of_mass());
        let collision_object = world.add_collider(0.0, shape.clone(), body, Isometry2::identity(), Material::default());
        let time_to_next_shot = 0.;

        Gorilla { shape, body, collision_object, time_to_next_shot }
    }


}

pub struct Brick {
    pub shape: ShapeHandle,
    pub body: BodyHandle,
    pub collision_object: CollisionObjectHandle,
    pub uid: usize,
    pub ttl: Option<f64>,
    pub fill_style: String,
}

impl Brick {
    pub fn new(world: &mut World, transform: Isometry2, radx: f64, rady: f64, margin: f64, fill_style: &str) -> Brick {
        let shape = ShapeHandle::new(Cuboid::new(Vector2::new(radx, rady)));
        let body = world.add_rigid_body(transform, shape.inertia(0.1), shape.center_of_mass());
        let collision_object = world.add_collider(
            margin,
            shape.clone(),
            body,
            Isometry2::identity(),
            Material::new(0.0, 1.0)
        );
        let uid = collision_object.uid();
        let ttl: Option<f64> = None;
        Brick { shape, body, collision_object, uid, ttl, fill_style: fill_style.into() }
    }

    pub fn from_vector(world: &mut World, vector: Vector2<f64>, radx: f64, rady: f64, margin: f64, fill_style: &str) -> Self {
        let pos = Isometry2::new(vector, 0.0);
        Brick::new(world, pos, radx, rady, margin, fill_style)
    }

}

pub fn make_ground(world: &mut World, cfg: &SceneConfig) -> CollisionObjectHandle {
    let margin = cfg.margin.unwrap_or(0.);
    let radius_x = cfg.ground_radx.unwrap_or(1.);
    let radius_y = cfg.ground_rady.unwrap_or(1.);
    let radius = Vector2::new(radius_x, radius_y);
    let cuboid = Cuboid::new(radius);
    let shape = ShapeHandle::new(cuboid);
    let x = cfg.ground_x.unwrap_or(0.);
    let y = cfg.ground_y.unwrap_or(0.);
    let pos = Isometry2::new(Vector2::new(x, y), zero());
    debug!("make_ground {:?}", (margin, radius_x, radius_y, radius, pos));

    world.add_collider(
        margin,
        shape,
        BodyHandle::ground(),
        pos,
        Material::default(),
    )
}

pub fn make_building(world: &mut World, center: f64, cols: usize, rows: usize, fill_style: &str, cfg: &SceneConfig) -> Vec<Brick> {

    let margin = cfg.margin.unwrap_or(0.);
    let radx = cfg.box_radx.unwrap_or(1.);
    let rady = cfg.box_rady.unwrap_or(1.);
    let ground_y = cfg.ground_y.unwrap_or(0.);
    let ground_rady = cfg.ground_rady.unwrap_or(0.);

    let w = radx + margin;
    let h = rady + margin;

    let half_width = cols as f64 * w + w * 0.5;

    let mut bricks = Vec::with_capacity(rows * (cols + 1) + 4);
    for yi in 0..rows {
        for xi in 0..cols {
            let x = xi as f64;
            let y = yi as f64;

            let x_offset = if yi % 2 == 1 { w } else { 0f64 };
            let row_y = ground_y - ground_rady - h * (2. * (y));

            let left_corner_pos = Vector2::new(
                center - half_width + w * 0.5

                , row_y
            );
            let row_pos = Vector2::new(
                center - half_width
                - x_offset
                + (x+1.0) * w * 2.0

                , row_y
            );
            let right_corner_pos = Vector2::new(
                center + half_width - w * 0.5

                , row_y
            );

            // left corner brick
            if yi % 2 == 0 && xi == 0 {
                bricks.push(Brick::from_vector(world, left_corner_pos, radx * 0.5, rady, margin, fill_style));
            }

            // normal brick
            bricks.push(Brick::from_vector(world, row_pos, radx, rady, margin, fill_style));

            // right corner brick
            if yi % 2 == 1 && xi == cols-1 {
                bricks.push(Brick::from_vector(world, right_corner_pos, radx * 0.5, rady, margin, fill_style));
            }

        }
    }

    let roof_pos = Vector2::new(
        center
        , ground_y - ground_rady - h * (2. * (rows as f64))
    );

    // roof
    bricks.push(
        Brick::from_vector(
            world,
            roof_pos,
            radx * cols as f64 + radx * 0.5,
            rady,
            margin,
            fill_style
        )
    );
    bricks
}
