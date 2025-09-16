// /src/config/constants.js

// Tamaño del juego
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

// Entorno
export const ENVIRONMENT = {
  skyColor: 0x87ceeb,
  seaColor: 0x0b4f6c,
};

// Bote
export const BOAT = {
  size: { width: 120, height: 40 },
  color: 0x8b4513,
};

// Buzo
export const DIVER = {
  size: { width: 32, height: 64 },
  color: 0xffd166,
  speed: {
    swimX: 220,
    swimUp: -120,
    swimDown: 150,
    maxFall: 100,
    gravityStep: 5,
  },
};

// Peces
export const FISH = {
  size: { width: 36, height: 20 },
  color: 0xff6b6b,
  speed: 60,
  releaseMultiplier: 3,
  count: 8,
  netColor: 0x6c757d,
  netBorder: 0x343a40,
};

// Oxígeno
export const OXYGEN = {
  max: 10,
  start: 6,
  decreaseIntervalMs: 1000,
};
