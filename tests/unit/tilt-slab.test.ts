import { describe, expect, it } from 'vitest';
import { tiltAngles } from '../../src/scripts/tilt';
import { SLAB_MIN_PX, slabRotation, slabThicknessPx } from '../../src/scripts/slab3d';

describe('tiltAngles', () => {
  it('fica reto no centro', () => {
    expect(tiltAngles(100, 50, 200, 100, 8)).toEqual({ rx: 0, ry: 0, gx: 50, gy: 50 });
  });

  it('inclina até o máximo nas bordas', () => {
    expect(tiltAngles(200, 0, 200, 100, 8)).toEqual({ rx: 8, ry: 8, gx: 100, gy: 0 });
    expect(tiltAngles(0, 100, 200, 100, 8)).toEqual({ rx: -8, ry: -8, gx: 0, gy: 100 });
  });

  it('limita posições fora do elemento e tamanho zero', () => {
    expect(tiltAngles(500, -50, 200, 100, 10)).toEqual({ rx: 10, ry: 10, gx: 100, gy: 0 });
    expect(tiltAngles(10, 10, 0, 0, 10)).toEqual({ rx: 0, ry: 0, gx: 50, gy: 50 });
  });
});

describe('slabThicknessPx', () => {
  it('converte mm em px com mínimo visível', () => {
    expect(slabThicknessPx(20)).toBe(32);
    expect(slabThicknessPx(50)).toBe(80);
    expect(slabThicknessPx(2)).toBe(SLAB_MIN_PX);
    expect(slabThicknessPx(Number.NaN)).toBe(SLAB_MIN_PX);
  });
});

describe('slabRotation', () => {
  it('gira para os lados conforme o ponteiro', () => {
    expect(slabRotation(0.5, 0.5)).toEqual({ rz: 0, rx: 0 });
    expect(slabRotation(1, 0)).toEqual({ rz: 15, rx: 7 });
    expect(slabRotation(-3, 9)).toEqual({ rz: -15, rx: -7 });
  });
});
