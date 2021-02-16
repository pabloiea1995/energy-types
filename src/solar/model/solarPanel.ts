import { v4 } from "uuid";

export class SolarPanel {
  constructor(
    width: number,
    heigth: number,
    name: string,
    peakPower: number,
    efficiency: number
  ) {
    this.solarPanelId = v4();
    this.width = width;
    this.heigth = heigth;
    this.name = name;
    this.peakPower = peakPower;
    this.efficiency = efficiency;
  }
  efficiency: number;
  peakPower: number;
  solarPanelId?: string;
  manufacturer?: string;
  name?: string;
  width: number;
  heigth: number;
  depth?: number;
}
