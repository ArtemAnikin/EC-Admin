import type { IDeliveryTravelTime } from './types';

export const DEFAULT_TRAVEL_TIME: IDeliveryTravelTime = { hours: 0, minutes: 0 };

export function formatPrice(currency: string, value: number): string {
  return `${currency}${value}`;
}

export function parseTravelTime(value: unknown): IDeliveryTravelTime {
  if (
    value != null &&
    typeof value === 'object' &&
    'hours' in value &&
    'minutes' in value
  ) {
    const v = value as { hours: unknown; minutes: unknown };
    return {
      hours: Number(v.hours) || 0,
      minutes: Number(v.minutes) || 0,
    };
  }
  return DEFAULT_TRAVEL_TIME;
}
