// Types
export type * from './types/index.js';

// Collector
export { EventCollector } from './collector/event-collector.js';
export { SessionManager } from './collector/session-manager.js';
export { ClientTracker } from './collector/client-tracker.js';
export type { ClientTrackerConfig } from './collector/client-tracker.js';

// Queries
export { TrafficQueries } from './queries/traffic-queries.js';
export { FunnelQueries } from './queries/funnel-queries.js';
export { RevenueQueries } from './queries/revenue-queries.js';

// Attribution
export { AttributionEngine } from './attribution/attribution-engine.js';
export type { AttributionModel, AttributionResult } from './attribution/attribution-engine.js';

// Third-party integrations
export * from './third-party/index.js';
