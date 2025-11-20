export type ItemInfo = {
  id: number;
  name: string;
  icon: string;
  examine: string;
  members: boolean;
  value: number;
  highalch: number;
  lowalch: number;
  limit: number;
};

export type Mapping = ItemInfo[];

export type ItemPriceInfo = {
  avgHighPrice: number;
  highPriceVolume: number;
  avgLowPrice: number;
  lowPriceVolume: number;
};

export type LatestPriceInfo = {
  high: number;
  highTime: number;
  low: number;
  lowTime: number;
};

export type ItemId = number;

export type LatestPrices = {
  data: Record<ItemId, LatestPriceInfo>;
};

export const TimeScales = ["5m", "1h"] as const;
export type TimeScale = (typeof TimeScales)[number];

export type TimedPrices = {
  data: Record<ItemId, ItemPriceInfo>;
  timestamp: number;
};

export type TimeseriesPoint = {
  timestamp: number;
  avgHighPrice: number;
  avgLowPrice: number;
  highPriceVolume: number;
  lowPriceVolume: number;
};

export const TimeSteps = ["5m", "1h", "6h", "24h"] as const;
export type TimeStep = (typeof TimeSteps)[number];

export type Timeseries = {
  data: [];
  itemId: ItemId;
};
