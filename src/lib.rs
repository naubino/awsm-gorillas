#![allow(unused_macros, unused_imports)]
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;

use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement, HtmlImageElement};
use web_sys::{EventTarget, KeyboardEvent};

use serde_derive::{Serialize, Deserialize};

use nalgebra::{Vector2, zero, Real};
use ncollide2d::shape::{Cuboid};
use ncollide2d::world::CollisionObjectHandle;
use ncollide2d::events::ContactEvent;
use ncollide2d::events::ProximityEvent;
use ncollide2d::query::Proximity;
use nphysics2d::object::{BodyHandle, Material};
use nphysics2d::volumetric::Volumetric;

use std::collections::HashMap;

mod dom_helpers;
mod shapes;

use self::shapes::{Banana, Brick, Gorilla};

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

#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize)]
pub struct Point {
    x: f64,
    y: f64,
}

impl Into<Vector2<f64>> for Point {
    fn into(self) -> Vector2<f64> {
        Vector2::new(self.x, self.y)
    }
}

impl Into<Isometry2> for Point {
    fn into(self) -> Isometry2 {
        Isometry2::new(self.into(), 0f64)
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GameConfig {
    width: Option<f64>,
    height: Option<f64>,
    integration_parameters: Option<IntegrationParameters<f64>>,
}

#[derive(Debug, Serialize, Deserialize)]
/// Parameters for u time-step of the physics engine.
pub struct IntegrationParameters<N: Real> {
    /// The timestep (default: `1.0 / 60.0`)
    pub dt: N,
    /// The Error Reduction Parameter in `[0, 1]` is the proportion of
    /// the positional error to be corrected at each time step (default: `0.2`).
    pub erp: N,
    /// Each cached impulse are multiplied by this coefficient in `[0, 1]`
    /// when they are re-used to initialize the solver (default `1.0`).
    pub warmstart_coeff: N,
    /// Contacts at points where the involved bodies have a relative
    /// velocity smaller than this threshold wont be affected by the restitution force (default: `1.0`).
    pub restitution_velocity_threshold: N,
    /// Ammount of penetration the engine wont attempt to correct (default: `0.001m`).
    pub allowed_linear_error: N,
    /// Ammount of angular drift of joint limits the engine wont
    /// attempt to correct (default: `0.001rad`).
    pub allowed_angular_error: N,
    /// Maximum linear correction during one step of the non-linear position solver (default: `100.0`).
    pub max_linear_correction: N,
    /// Maximum angular correction during one step of the non-linear position solver (default: `0.2`).
    pub max_angular_correction: N,
    /// Maximum nonlinera SOR-prox scaling parameter when the constraint
    /// correction direction is close to the kernel of the involved multibody's
    /// jacobian (default: `0.2`).
    pub max_stabilization_multiplier: N,
    /// Maximum number of iterations performed by the velocity constraints solver.
    pub max_velocity_iterations: usize,
    /// Maximum number of iterations performed by the position-based constraints solver.
    pub max_position_iterations: usize,
}

impl From<IntegrationParameters<f64>> for nphysics2d::solver::IntegrationParameters<f64> {
    fn from(a: IntegrationParameters<f64>) -> Self {
        let IntegrationParameters {
            allowed_angular_error,
            allowed_linear_error,
            dt,
            erp,
            max_angular_correction,
            max_linear_correction,
            max_position_iterations,
            max_velocity_iterations,
            max_stabilization_multiplier,
            restitution_velocity_threshold,
            warmstart_coeff,
        } = a;
        nphysics2d::solver::IntegrationParameters {
            allowed_angular_error,
            allowed_linear_error,
            dt,
            erp,
            max_angular_correction,
            max_linear_correction,
            max_position_iterations,
            max_velocity_iterations,
            max_stabilization_multiplier,
            restitution_velocity_threshold,
            warmstart_coeff,
        }
    }
}

#[derive(Default, Debug, Serialize, Deserialize)]
pub struct PlayerConfig {
    x: f64,
    y: f64,
    radx: f64,
    rady: f64,
    inertia: f64,
}

#[derive(Default, Debug, Serialize, Deserialize)]
pub struct BuildingConfig {
    x: f64,
    w: usize,
    h: usize,
    fill_style: String,
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
    gravity: Num,
    margin: Num,
    box_radx: Num,
    box_rady: Num,
    ground_radx: Num,
    ground_rady: Num,
    ground_x: Num,
    ground_y: Num,
    buildings: Vec<BuildingConfig>,
    player_a: PlayerConfig,
    player_b: PlayerConfig,
}

#[derive(Default)]
struct GameEntities {
    gorillas: Vec<Gorilla>,
    bricks: Vec<Brick>,
    bananas: Vec<Banana>,
}

impl GameEntities {
    pub fn get_banana(&self, uid: usize) -> Option<&Banana> {
        self.bananas.iter().find(|banana| banana.uid == uid)
    }
    pub fn get_brick(&self, uid: usize) -> Option<&Brick> {
        self.bricks.iter().find(|bricks| bricks.uid == uid)
    }
    pub fn get_banana_mut(&mut self, uid: usize) -> Option<&mut Banana> {
        self.bananas.iter_mut().find(|banana| banana.uid == uid)
    }
    pub fn get_brick_mut(&mut self, uid: usize) -> Option<&mut Brick> {
        self.bricks.iter_mut().find(|bricks| bricks.uid == uid)
    }
}

#[derive(Debug)]
enum ObjectKind {
    Ground,
    Banana,
    Brick,
    Gorilla,
}

#[wasm_bindgen]
pub struct Game {
    canvas: HtmlCanvasElement,
    objects: GameEntities,
    object_kinds: HashMap<usize, ObjectKind>,
    world: World,
    gorilla_png: HtmlImageElement,
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(constructor)]
    pub fn new(canvas: HtmlCanvasElement, gorilla_png: HtmlImageElement, config: &JsValue) -> Game {
        let conf: GameConfig = config.into_serde().unwrap();
        debug!("game config: {:?}", conf);

        let mut world = World::new();

        if let Some(conf) = conf.integration_parameters {
            let params = world.integration_parameters_mut();
            *params = conf.into();
        }

        Game {
            canvas: canvas,
            objects: GameEntities::default(),
            object_kinds: Default::default(),
            world,
            gorilla_png
        }
    }

    fn pos_of(&self, body: BodyHandle) -> Vector2<f64> {
        if let Some(body) = self.world.rigid_body(body) {
            body.position().translation.vector
        } else {
            warn!("cannot resolve position of ...");
            zero()
        }
    }

    fn rot_of(&self, body: BodyHandle) -> f64 {
        if let Some(body) = self.world.rigid_body(body) {
            body.position().rotation.angle()
        } else {
            warn!("cannot resolve position of ...");
            zero()
        }
    }

    fn size_of(&self, shape: &ShapeHandle) -> Vector2<f64> {
        if let Some(cube) = shape.as_shape::<Cuboid<_>>() {
            let size = cube.half_extents();
            let (w, h) = (size.x, size.y);
            Vector2::new( w * 2., h * 2. )
        } else {
            warn!("this object  is not a cube");
            Vector2::new(0.4, 0.7)
        }
    }

    pub fn set_scene(&mut self, raw_scene_config: &JsValue) {
        let scene_config: SceneConfig = raw_scene_config.into_serde().unwrap();

        let mut world = &mut self.world;

        world.set_gravity(Vector2::new(0.0, scene_config.gravity.unwrap_or(9.81)));

        shapes::make_ground(world, &scene_config);

        for building in &scene_config.buildings {
            // let &BuildingConfig {x, w, h, fill_style } = building;
            let mut bricks = shapes::make_building(world, building.x, building.w, building.h, &building.fill_style, &scene_config);
            for brick in &bricks {
                self.object_kinds.insert(brick.uid, ObjectKind::Brick);
            }
            self.objects.bricks.append(&mut bricks);
        }

        let gorilla_a = Gorilla::new(world, &scene_config.player_a);
        let gorilla_b = Gorilla::new(world, &scene_config.player_b);

        self.objects.gorillas.push(gorilla_a);
        self.objects.gorillas.push(gorilla_b);
    }

    pub fn render_scene(&self, raw_view_config: &JsValue) {
        let view_config: ViewConfig = raw_view_config.into_serde().unwrap();

        let zoom = view_config.zoom.unwrap_or(1.0);
        let width = self.canvas.width() as f64;
        let height = self.canvas.height() as f64;
        let background = "#0402ac";
        // let background = "#ffffff";

        let ctx = dom_helpers::canvas_get_ctx_2d(&self.canvas);

        // background
        ctx.save();
            ctx.set_fill_style(&JsValue::from(background));
            ctx.fill_rect(0.0, 0.0, self.canvas.width().into(), self.canvas.height().into());
        ctx.restore();

        // foreground
        ctx.save();
            ctx.translate(0.5 * width, 0.5 * height).unwrap();

            ctx.rotate(view_config.rotation.unwrap_or(0.0)).unwrap();

            ctx.translate( (-0.5 * width ) / zoom, (-0.5 * height) / zoom).unwrap();

            ctx.scale(zoom, zoom).unwrap();

            ctx.translate(view_config.x.unwrap_or(0.0), view_config.y.unwrap_or(0.0)).unwrap();

            ctx.set_fill_style(&JsValue::from("#FFFF00"));
            ctx.fill_rect(-0.25, -4.25, 0.5, 0.5);

            // self.debug_render(&ctx);
            self.render_bricks(&ctx);
            self.render_players(&ctx);
            self.render_bananas(&ctx);

        ctx.restore();

    }

    fn render_bricks(&self, ctx: &CanvasRenderingContext2d) {
        for brick in &self.objects.bricks {
            self.render_brick(&ctx, brick);
        }
    }

    fn render_brick(&self, ctx: &CanvasRenderingContext2d, brick: &shapes::Brick) {
        let pos = self.pos_of(brick.body);
        let size = self.size_of(&brick.shape);
        let angle = self.rot_of(brick.body);

        ctx.begin_path();
        ctx.save();
        ctx.translate(pos.x , pos.y).unwrap();
        ctx.rotate(angle).unwrap();

        ctx.rect(-size.x * 0.5, - size.y * 0.5, size.x, size.y);
        ctx.set_line_width(0.02);
        ctx.stroke();
        ctx.set_fill_style(&JsValue::from(&brick.fill_style));
        ctx.fill();

        ctx.restore();
    }

    fn render_bananas(&self, ctx: &CanvasRenderingContext2d) {
        for banana in &self.objects.bananas {
            self.render_banana(&ctx, banana);
        }
    }

    fn render_banana(&self, ctx: &CanvasRenderingContext2d, banana: &Banana) {
        let pos = self.pos_of(banana.body);
        let size = banana.sprite.size;
        let angle = self.rot_of(banana.body);

        ctx.begin_path();
        ctx.save();
        ctx.translate(pos.x , pos.y).unwrap();
        ctx.rotate(angle).unwrap();

        ctx.rect(-size.x * 0.5, - size.y * 0.5, size.x, size.y);
        ctx.set_line_width(0.02);
        ctx.stroke();
        ctx.set_fill_style(&JsValue::from(String::from("yellow")));
        ctx.fill_rect(-size.x * 0.5, - size.y * 0.5, size.x, size.y);
        ctx.restore();
    }

    fn debug_render(&self, ctx: &CanvasRenderingContext2d) {
        self.world.colliders().for_each(|collider| {

            if let Some(body) = self.world.rigid_body(collider.data().body()) {

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
                    ctx.set_fill_style(&JsValue::from(String::from("#ffffff")));
                    ctx.translate(x , y).unwrap();
                    ctx.rotate(rotation.angle()).unwrap();
                    ctx.rect(-w, -h,  w * 2., h * 2.);
                    ctx.rect(20.0 + pos.x * 100.0, pos.y * 100.0, 10.0, 10.0);
                    ctx.fill();
                    ctx.set_line_width(0.01);
                    ctx.stroke();
                    ctx.set_fill_style(&JsValue::from(String::from("red")));
                    ctx.fill_rect(-0.025, -0.025, 0.05, 0.05);
                    ctx.restore();
                    // console::log_2(&pos.x.into(), &pos.y.into());
                } else {
                    debug!("not painting" );
                }
            }
        });
    }

    pub fn render_players(&self, ctx: &CanvasRenderingContext2d) {
        for gorilla in &self.objects.gorillas {
            let pos = self.pos_of(gorilla.body);
            let size = self.size_of(&gorilla.shape);
            let angle = self.rot_of(gorilla.body);

            ctx.save();
            ctx.translate(pos.x , pos.y).unwrap();
            ctx.rotate(angle).unwrap();

            ctx.draw_image_with_html_image_element_and_dw_and_dh(&self.gorilla_png, -size.x * 0.5, -size.y * 0.5, size.x, size.y);

            ctx.restore();
        }
    }

    pub fn step(&mut self, dt: f64) {
        for gorilla in &mut self.objects.gorillas {
            gorilla.time_to_next_shot -= dt;
        }

        let ts = self.world.timestep();
        let mut time = dt;
        while time > 0.0 {
            self.world.step();
            time -= ts;
        }

        self.collisions();
        self.gc(dt);
    }

    pub fn shoot(&mut self, raw_shot: &JsValue, r: f64) {
        let shot: Shot = raw_shot.into_serde().unwrap();
        self._shoot(&shot, r);
    }

    fn gc(&mut self, dt: f64) {
        self.gc_bananas(dt);
        self.gc_bricks(dt);
    }

    fn gc_bananas(&mut self, dt: f64) {
        let mut garbage = Vec::new();
        let new_bananas = self.objects.bananas
            .drain(..)
            .map(|mut banana| {
                banana.ttl = banana.ttl - dt;
                banana
            })
            .inspect(|banana| if banana.ttl < 0.0 {
                garbage.push(banana.collision_object);
            })
            .filter(|banana| banana.ttl >= 0.0)
            .collect();
        self.objects.bananas = new_bananas;
        self.world.remove_colliders(&garbage);
    }

    fn gc_bricks(&mut self, dt: f64) {
        let mut garbage = Vec::new();
        let new_bricks = self.objects.bricks
            .drain(..)
            .map(|mut brick| {
                brick.ttl = brick.ttl.map(|ttl| ttl - dt);
                brick
            })
            .inspect(|brick| if brick.ttl.is_some() && brick.ttl.unwrap() < 0.0 {
                garbage.push(brick.collision_object);
            })
            .filter(|brick| brick.ttl.is_none() || brick.ttl.unwrap() >= 0.0)
            .collect();
        self.objects.bricks = new_bricks;
        self.world.remove_colliders(&garbage);
    }

    fn collisions(&mut self) {
        for event in self.world.contact_events().iter() {
            // let ProximityEvent{collider1, collider2, new_status, ..} = event;
            // debug!(" contact {:?} ", event);
            //if new_status == &Proximity::Intersecting {
            if let ContactEvent::Started(collider1, collider2) = event {
                use self::ObjectKind::*;
                let kind1 = self.object_kinds.get(&collider1.uid());
                let kind2 = self.object_kinds.get(&collider2.uid());
                let brick_ttl = Some(0.01);

                match (kind1, kind2) { // TODO: this doesn't work if you pull it out into a function
                    (Some(Brick), Some(Banana)) => {
                        if let Some(banana) = self.objects.bananas.iter_mut().find(|b| b.uid == collider2.uid()) {
                            banana.ttl = 0.01;
                            if banana.explosive {
                                if let Some(brick) = self.objects.bricks.iter_mut().find(|b| b.uid == collider1.uid()) {
                                    brick.ttl = brick_ttl;
                                }
                            }
                        }
                    },
                    (Some(Banana), Some(Brick)) => {
                        if let Some(banana) = self.objects.bananas.iter_mut().find(|b| b.uid == collider1.uid()) {
                            banana.ttl = 0.1;
                            if banana.explosive {
                                if let Some(brick) = self.objects.bricks.iter_mut().find(|b| b.uid == collider2.uid()) {
                                    brick.ttl = brick_ttl;
                                }
                            }
                        }
                    },
                    // (Some(Banana), None) | (None, Some(Banana)) => {
                    //     // debug!("Banana hit something weird ");
                    // },
                    // (Some(Brick), Some(Brick)) => { },
                    _ => {
                       //  debug!("weird collision {:?}", (kind1, kind2) );
                    }
                }
            }
        }
    }

    pub fn gorilla_pos(&self, index: usize) -> JsValue {
        let pos = self.pos_of(self.objects.gorillas[index].body);
        JsValue::from_serde(&Point { x: pos.x, y: pos.y }).unwrap()
    }

    pub fn move_gorilla(&mut self, idx: usize, raw_point: &JsValue) {
        let point: Point = raw_point.into_serde().unwrap();
        debug!("moving gorilla {} to {:?}", idx, point);
        let body = match idx {
            0 => Some(self.objects.gorillas[0].body),
            1 => Some(self.objects.gorillas[1].body),
            _ => None,
        };
        if let Some(body) = body {
            if let Some(gorilla) = self.world.rigid_body_mut(body) {
                let r#move: Vector2<f64> = point.into();
                let old_pos = gorilla.position();
                let new_pos = Isometry2::new(
                    old_pos.translation.vector + r#move,
                    0f64
                );
                gorilla.set_position(new_pos);
            }
        }
    }

    fn _shoot(&mut self, shot: &Shot, r: f64) {

        if let Some(ref mut gorilla) = self.objects.gorillas.get_mut(shot.gorilla_id) {
            if gorilla.time_to_next_shot > 0. {
                return;
            } else {
                gorilla.time_to_next_shot = shot.config.cost;
            }
        }

        let banana = Banana::new(&mut self.world, &shot.config);
        let pos = Isometry2::new(Vector2::new(shot.x, shot.y), shot.rot);
        let vel = Vector2::new(f64::cos(shot.rot), f64::sin(shot.rot)) * shot.power;
        if let Some(rb) = self.world.rigid_body_mut(banana.body) {
            rb.set_position(pos);
            rb.set_linear_velocity(vel);
            rb.set_angular_velocity(r);
            self.object_kinds.insert(banana.uid, ObjectKind::Banana);
            self.objects.bananas.push(banana);
        }
    }
}

#[wasm_bindgen]
#[derive(Default, Serialize, Deserialize, Debug)]
pub struct Shot {
    x: f64,
    y: f64,
    rot: f64,
    power: f64,
    gorilla_id: usize,
    config: BananaConfig,
}

#[wasm_bindgen]
#[derive(Default, Serialize, Deserialize, Debug)]
pub struct BananaConfig {
    pub w: f64,
    pub h: f64,
    pub inertia: f64,
    pub explosive: bool,
    ttl: f64,
    cost: f64,
}