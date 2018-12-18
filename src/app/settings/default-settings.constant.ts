import { Settings } from './settings.interface';

export const DEFAULT_SETTINGS: Settings = {
  frames: {
    frame_size: {
      w: 1024,
      h: 720
    },
    frame_delay: 5,
    ball_increment_step: {
      dx: 2,
      dy: -2
    }
  },
  sprites: {
    ball_radius: 5,
    brick_size: {
      w: 30,
      h: 10
    },
    vessel_size: {
      w: 80,
      h: 10
    }
  },
  controls: {
    start_pause: 'Space',
    left: 'ArrowLeft',
    right: 'ArrowRight',
    menu: 'Escape'
  }
};