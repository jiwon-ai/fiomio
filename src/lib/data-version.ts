/**
 * Versioning for the proprietary dataset (the moat). Every logged event carries
 * these so the data stays reproducible and segmentable per model version.
 *
 *  - ENGINE_VERSION : bump when the diagnostic scoring logic or weights change
 *    (src/lib/diagnostic.ts / ingredients), so recommendations from different
 *    engine generations are never mixed when training.
 *  - SCHEMA_VERSION : bump when the logged event payload shape changes.
 */
export const ENGINE_VERSION = "1.0.0";
export const SCHEMA_VERSION = "2";
