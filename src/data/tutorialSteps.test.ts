import { describe, it, expect } from 'vitest';
import { TUTORIAL_STEPS } from './tutorialSteps';

describe('Tutorial Steps Configuration — Gala Equipamientos', () => {
  it('1. Debe contener exactamente 12 pasos organizados y secuenciales', () => {
    expect(TUTORIAL_STEPS).toHaveLength(12);
    TUTORIAL_STEPS.forEach((step, idx) => {
      expect(step.id).toBe(idx + 1);
      expect(step.title).toBeDefined();
      expect(step.description).toBeDefined();
      expect(step.route).toBeDefined();
      expect(step.targetSelector).toBeDefined();
    });
  });

  it('2. Las rutas deben corresponder con pantallas reales de la aplicación', () => {
    const validPrefixes = ['/demo', '/admin', '/catalogo'];
    for (const step of TUTORIAL_STEPS) {
      const match = validPrefixes.some(prefix => step.route.startsWith(prefix));
      expect(match).toBe(true);
    }
  });

  it('3. El primer paso debe ser Bienvenida y el último paso Reinicio de demo', () => {
    expect(TUTORIAL_STEPS[0].title).toContain('Paso 1: Bienvenida');
    expect(TUTORIAL_STEPS[11].title).toContain('Paso 12: Reiniciar');
  });
});
