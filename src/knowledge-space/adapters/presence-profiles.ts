import type { PresenceProfile } from '../semantics/index.ts';

/**
 * Reviewed Phase-level promotions from a tracked crayon strip to a pervasive
 * crayon field. Empty is intentional: broad social coverage must be approved
 * from evidence rather than inferred from an Entity type.
 */
export const REVIEWED_PRESENCE_PROFILES = [] as const satisfies readonly PresenceProfile[];
