import { v4 } from "uuid";
import { PowerCurve } from "../../energy";

export class Surface {
  constructor() {
    this.surfaceId = v4();
  }

  surfaceId?: string;

  name?: string;
  polygonPath?: any; //for google map polygon drawing
  area?: number;

  dimensions?: {
    width: number; //ancho
    heigt: number; //largo
  };

  material?: string;

  inclination?: number;

  orientation?: number;

  panelNumber?: number;
  panelInclination?: number;
  panelOrientation?: number;
  panelPosition?: "vertical" | "horizontal";
  production?: PowerCurve;
}
