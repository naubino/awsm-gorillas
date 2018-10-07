# minimal wasm project

1. install [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/) or via [cargo](https://rustup.rs/) `cargo install wasm-pack`
2. run `wasm-pack build` to build your rust to `./pkg`
3. run `npm install` to install all you need to get this into your browser
4. run `npm run serve` to start webpack
5. open http://localhost:8080

now go on and read https://rustwasm.github.io/wasm-bindgen/