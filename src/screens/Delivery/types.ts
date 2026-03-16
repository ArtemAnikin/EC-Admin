export interface IDeliveryTravelTime {
  hours: number;
  minutes: number;
}

export interface IDeliveryRow {
  id: string;
  city: string;
  placeLabel: string;
  placeChecked: boolean;
  oneWayPrice: number;
  freeAfterDays: number;
  travelTime: IDeliveryTravelTime;
}
