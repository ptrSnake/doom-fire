// Doom fire palette: 37 colors going from black to white through fire tones.
// Each palette index maps an "intensity" value to an RGB color.
export const FIRE_PALETTE_SIZE = 37;

const FIRE_PALETTE = [
  0x070707, 0x1F0707, 0x2F0F07, 0x470F07, 0x571707, 0x671F07, 0x771F07,
  0x8F2707, 0x9F2F07, 0xAF3F07, 0xBF4707, 0xC74707, 0xDF4F07, 0xDF5707,
  0xDF5707, 0xD75F07, 0xD75F07, 0xD7670F, 0xCF6F0F, 0xCF770F, 0xCF7F0F,
  0xCF8717, 0xC78717, 0xC78F17, 0xC7971F, 0xBF9F1F, 0xBF9F1F, 0xBFA727,
  0xBFA727, 0xBFAF2F, 0xB7AF2F, 0xB7B72F, 0xB7B737, 0xCFCF6F, 0xDFDF9F,
  0xEFEFC7, 0xFFFFFF,
];

/**
 * Doom-style fire simulation.
 *
 * The core idea: heat only flows UPWARD (from a row y to the row above, y-1).
 * For every pixel we pick a random horizontal offset in [-1..2] so the flame
 * wiggles sideways instead of rising in straight lines, and we reduce the heat
 * by a small random "decay" so the fire cools down the higher it gets.
 */
export class Fire {
  readonly width: number;
  readonly height: number;
  /** Per-pixel heat (0 = cold/black .. FIRE_PALETTE_SIZE-1 = hot/white). */
  private readonly pixels: Uint8Array;

  /**
   * @param width Number of columns of the fire buffer
   * @param height Number of rows of the fire buffer
   */
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.pixels = new Uint8Array(width * height);
  }

  /** Resets the whole buffer to cold (all black). */
  clear() {
    this.pixels.fill(0);
  }

  /**
   * Seeds the bottom row with maximum heat. This is the fire source: the flame
   * keeps being fed from the bottom and only cools down as it rises.
   */
  seed() {
    for (let i = 0; i < this.width; i++) {
      this.pixels[(this.height - 1) * this.width + i] = FIRE_PALETTE_SIZE - 1;
    }
  }

  /**
   * Runs one simulation step, moving heat upward with random sideways drift
   * and a random decay.
   */
  step() {
    // Iterate from the top downwards so we always read heat from a row BELOW
    // the destination (y-1), never from a row we already modified this step.
    for (let y = 1; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // Source pixel: the one we read the heat from
        const src = this.width * y + x;

        // Random horizontal drift: 0..3, producing an offset of -1, 0, 1 or 2
        const rand_idx = Math.floor(Math.random() * 4);

        // Destination column = source column shifted by the drift
        const dst_x = x - rand_idx + 1;
        if (dst_x < 0 || dst_x >= this.width) {
          continue; // stay inside the buffer, ignore pixels that fall off the edges
        }

        // Destination pixel: one row above the source, at the drifted column
        const dst = (y - 1) * this.width + dst_x;

        // Move the heat upward, subtracting a random decay (0 or 1) so the fire
        // gradually loses intensity. The hotter the source, the longer it lasts.
        const src_val = this.pixels[src];
        const decay = rand_idx & 1;
        this.pixels[dst] = src_val > decay ? src_val - decay : 0;
      }
    }
  }

  /**
   * Reads the heat value of a single pixel.
   * @param x Horizontal coordinate (0..width-1)
   * @param y Vertical coordinate (0..height-1)
   */
  intensityAt(x: number, y: number): number {
    return this.pixels[y * this.width + x];
  }

  /**
   * Looks up the RGB color (0xRRGGBB) for a given palette index.
   * @param idx Palette index (0..FIRE_PALETTE_SIZE-1)
   */
  static paletteColor(idx: number): number {
    return FIRE_PALETTE[idx];
  }
}