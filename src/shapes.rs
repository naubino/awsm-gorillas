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

use crate::{debug, SceneConfig, SimpleBox};

type World = nphysics2d::world::World<f64>;
type Isometry2 = nalgebra::Isometry2<f64>;
type ShapeHandle = ncollide2d::shape::ShapeHandle<f64>;

macro_rules! debug { ($($arg:tt)*) => (debug(&format!($($arg)*));) }

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

pub fn make_building(world: &mut World, x_pos: f64, width: usize, height: usize, cfg: &SceneConfig) {

    let margin = cfg.margin.unwrap_or(0.);
    let radx = cfg.box_radx.unwrap_or(1.);
    let rady = cfg.box_rady.unwrap_or(1.);
    let ground_x = cfg.ground_x.unwrap_or(0.);
    let ground_y = cfg.ground_y.unwrap_or(0.);
    let ground_rady = cfg.ground_rady.unwrap_or(0.);
    let f1 = cfg.f1.unwrap_or(1.);
    let f2 = cfg.f2.unwrap_or(1.);

    let ground_pos = Vector2::new(ground_x, ground_y - ground_rady);
    //let ground_pos = Isometry2::new(ground, zero()).translation.vector;

    let w = radx + margin;
    let h = rady + margin;

    for yi in 0..height {
        for xi in 0..width {
            let x = xi as f64;
            let y = yi as f64;

            let pos = Vector2::new(x_pos + x * 2.0 * w, ground_y - ground_rady - h * (1. + margin + 2. * (y + margin)));

            SimpleBox::from_vector(world, pos, radx, rady, margin);
        }
    }
}
