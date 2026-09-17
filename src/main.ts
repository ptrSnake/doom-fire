import { Fire } from "./fire.ts";

// Fire buffer dimensions (low-res, scaled up by CSS to fullscreen)
const WIDTH = 128;
const HEIGHT = 128;

const app = document.getElementById("app")!;
const canvas = document.createElement("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;
app.appendChild(canvas);

const ctx = canvas.getContext("2d")!;
// The framebuffer: one RGBA byte per channel for every pixel
const image = ctx.createImageData(WIDTH, HEIGHT);
const data = image.data;

const fire = new Fire(WIDTH, HEIGHT);
fire.clear();
fire.seed();

/**
 * Writes a single RGBA pixel into the ImageData framebuffer.
 * @param x Horizontal coordinate (0..WIDTH-1)
 * @param y Vertical coordinate (0..HEIGHT-1)
 * @param r Red channel (0..255)
 * @param g Green channel (0..255)
 * @param b Blue channel (0..255)
 * @param a Alpha channel (0..255, defaults to opaque)
 */
function setPixel(x: number, y: number, r: number, g: number, b: number, a = 255) {
  const i = (y * WIDTH + x) * 4;
  data[i] = r;
  data[i + 1] = g;
  data[i + 2] = b;
  data[i + 3] = a;
}

/**
 * Copies every fire pixel to the framebuffer by looking up its palette color,
 * then pushes the whole ImageData to the canvas.
 */
function render() {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const color = Fire.paletteColor(fire.intensityAt(x, y));
      setPixel(x, y, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff);
    }
  }
  ctx.putImageData(image, 0, 0);
}

/**
 * Runs one fire simulation step per animation frame.
 */
function frame() {
  fire.step();
  render();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);