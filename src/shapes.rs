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
