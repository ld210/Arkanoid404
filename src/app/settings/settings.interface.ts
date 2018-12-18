export interface Settings {
  frames: {
    frame_size: {
      w: number,
      h: number
    },
    frame_delay: number,
    ball_increment_step: {
      dx: number,
      dy: number
    }
  };
  sprites: {
    ball_radius: number,
    brick_size: {
      w: number,
      h: number
    },
    vessel_size: {
      w: number,
      h: number
    }
  };
  controls: {
    start_pause: string,
    left: string,
    right: string,
    menu: string
  };
}
