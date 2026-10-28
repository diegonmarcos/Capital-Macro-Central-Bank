import type { EconomicIndicator, TimeSeriesData, NowcastData } from './types';

export const dsgeIndicators: EconomicIndicator[] = [
  { name: 'Real GDP', value: 25462.7, change: 2.4, unit: 'B$', trend: 'up' },
  { name: 'Inflation', value: 3.2, change: -0.3, unit: '%', trend: 'down' },
  { name: 'Unemployment', value: 3.7, change: -0.1, unit: '%', trend: 'down' },
  { name: 'Interest Rate', value: 5.25, change: 0.25, unit: '%', trend: 'up' }
];

export const mlIndicators: EconomicIndicator[] = [
  { name: 'Nowcast Accuracy', value: 94.2, change: 1.3, unit: '%', trend: 'up' },
  { name: 'Data Feeds', value: 47, change: 2, unit: 'src', trend: 'up' },
  { name: 'Agent Count', value: 10000, change: 0, unit: '', trend: 'stable' },
  { name: 'Refresh Rate', value: 15, change: 0, unit: 'min', trend: 'stable' }
];

export const nowcasts: NowcastData[] = [
  { indicator: 'GDP Growth (Q4 2024)', nowcast: 2.3, confidence: 0.87, sources: ['Credit Cards', 'Employment'], updated: '2 min ago' },
  { indicator: 'Retail Sales', actual: 3.1, nowcast: 3.2, confidence: 0.92, sources: ['Credit Cards', 'Google Trends'], updated: '5 min ago' },
  { indicator: 'Industrial Production', actual: 1.8, nowcast: 1.7, confidence: 0.84, sources: ['Electricity', 'Shipping'], updated: '12 min ago' },
  { indicator: 'Consumer Confidence', nowcast: 102.5, confidence: 0.79, sources: ['Social Media', 'Surveys'], updated: '8 min ago' }
];

export const dataSources = [
  'Credit Cards', 'Employment', 'Satellite', 'Google Trends',
  'Electricity', 'Shipping', 'Social Media', 'Surveys'
];

export const dataSourceIcons: Record<string, string> = {
  'Credit Cards': 'credit-card',
  'Employment': 'users',
  'Satellite': 'globe',
  'Google Trends': 'search',
  'Electricity': 'zap',
  'Shipping': 'truck',
  'Social Media': 'share-2',
  'Surveys': 'bar-chart-3'
};

export function generateTimeSeries(points = 20, baseValue = 100, volatility = 5): TimeSeriesData[] {
  const data: TimeSeriesData[] = [];
  let value = baseValue;

  for (let i = 0; i < points; i++) {
    value = value + (Math.random() - 0.5) * volatility;
    data.push({
      date: `Q${(i % 4) + 1} ${2020 + Math.floor(i / 4)}`,
      value: parseFloat(value.toFixed(2)),
      forecast: i >= 15 ? value + (Math.random() - 0.3) * 3 : null
    });
  }

  return data;
}
