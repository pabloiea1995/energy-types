export class CalculateProductionDto {
  lat: number;
  long: number;
  instaledPower: number;
  losses: number;
  isOptimized: boolean;
  angle: number;
  azimuth: number;
  year: number;
  //if present, production curve will adapt date values to selected range, but production
  //will como from available year in pvgis (2016)
  startDate?: string;
  endDate?: string;
}
