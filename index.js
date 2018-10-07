async function main() {
    const js = await import("./pkg");

    js.greet("Hendrik!");
}

main();