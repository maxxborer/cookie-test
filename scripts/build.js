const fs = require("fs");
const path = require("path");

// public
fs.rmSync(path.join(__dirname, "../dist/public"), { recursive: true, force: true });
fs.cpSync(
  path.join(__dirname, "../src/public"),
  path.join(__dirname, "../dist/public"),
  { recursive: true, force: true, dereference: true }
);

// cert
fs.rmSync(path.join(__dirname, "../dist/cert"), { recursive: true, force: true });
fs.cpSync(
  path.join(__dirname, "../src/cert"),
  path.join(__dirname, "../dist/cert"),
  { recursive: true, force: true, dereference: true }
);

// views
fs.rmSync(path.join(__dirname, "../dist/views"), { recursive: true, force: true });
fs.cpSync(
  path.join(__dirname, "../src/views"),
  path.join(__dirname, "../dist/views"),
  { recursive: true, force: true, dereference: true }
);
