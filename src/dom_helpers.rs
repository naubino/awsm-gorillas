use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};
use web_sys::Document;
use wasm_bindgen::JsCast;

// pub fn get_document() -> Document {
//     let window = web_sys::window().expect("no global `window` exists");
//     let document = window.document().expect("should have a document on window");
// 
//     document
// }

pub fn canvas_get_ctx_2d(canvas: &HtmlCanvasElement) -> CanvasRenderingContext2d {
    canvas
        .get_context("2d")
        .unwrap()
        .unwrap()
        .dyn_into::<CanvasRenderingContext2d>()
        .unwrap()
}