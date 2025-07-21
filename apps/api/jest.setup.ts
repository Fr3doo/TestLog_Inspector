/**
 * Configuration globale Jest pour le projet API.
 * ----------------------------------------------
 * - Ajoute les matchers de jest-extended.
 * - Fige le fuseau horaire en Europe/Paris (cohérent avec l’app).
 */

import 'jest-extended';

// S’assure que les dates / snapshots utilisent toujours le même TZ.
process.env.TZ = 'Europe/Paris';
