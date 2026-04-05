export interface MetricDefinition {
  key: string;
  name: string;
  description: string;
  aggregation: 'sum' | 'count' | 'avg' | 'min' | 'max';
  eventName?: string;
  valueField?: string;
}

export interface AggregateQuery {
  metricKey: string;
  dateFrom: Date;
  dateTo: Date;
  dimensions?: Record<string, string>;
  granularity?: 'day' | 'week' | 'month';
}

export interface AggregateResult {
  date: string;
  metricKey: string;
  value: number;
  dimensions?: Record<string, string>;
}

export interface DateRange {
  from: Date;
  to: Date;
}
