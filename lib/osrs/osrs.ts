import { apiFetch } from "../api";
import type {
  LatestPrices,
  Mapping,
  TimeScale,
  TimeStep,
  TimedPrices,
} from "./types";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

const osrsBaseUrl = "https://prices.runescape.wiki/api/v1/osrs";
const osrsLatestUrl = `${osrsBaseUrl}/latest`;
const osrs5MinutesUrl = `${osrsBaseUrl}/5m`;
const osrs1HourUrl = `${osrsBaseUrl}/1h`;

const osrsMappingUrl = `${osrsBaseUrl}/mapping`;

const osrsTimeSeries = `${osrsBaseUrl}/timeseries`;

export async function mappingGET() {
  "use cache";
  cacheLife("hours");

  const res = await apiFetch(osrsMappingUrl);

  return (await res.json()) as Mapping;
}

export async function latestGET() {
  "use cache";
  cacheLife("minutes");

  const res = await apiFetch(osrsLatestUrl);

  return (await res.json()) as LatestPrices;
}

export async function timedPricesGET(scale: TimeScale) {
  "use cache";
  cacheLife("minutes");
  const url = scale === "1h" ? osrs1HourUrl : osrs5MinutesUrl;

  const res = await apiFetch(url);

  return (await res.json()) as TimedPrices;
}

export async function priceTimeSeriesGET(itemId: number, timeStep: TimeStep) {
  "use cache";
  cacheLife("minutes");

  const url = new URL(osrsTimeSeries);

  url.searchParams.set("id", itemId.toString());
  url.searchParams.set("timestep", timeStep);

  const res = await apiFetch(url);

  return (await res.json()) as TimedPrices;
}
