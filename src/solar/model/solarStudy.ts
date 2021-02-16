import { ContractedPower } from "../../clients/classes/ContractedPower.class";
import { EnergyPrices } from "../../clients/classes/EnergyPrices.class";
import { PowerPrices } from "../../clients/classes/PowerPrices.class";
import { DayCurve, PowerCurve } from "../../energy/classes/powerCurve.class";
import { ClientDetails } from "./clientDetails";
import { Surface } from "./surface";
import { v4 } from "uuid";
import { SolarPanel } from "./solarPanel";
import { SolarStudyResults } from "./solarStudyResults";
import { AbstractByPeriodValuesDto } from "../../energy/dtos/AbstractByPeriodValuesDto";
export class SolarStudy {
  constructor() {
    this.id = v4();
    this.surfaces = undefined;
    this.clientDetails = new ClientDetails();
    this.location = undefined;
    this.worksOnWeekend = undefined;
    this.energyTariff = undefined;
    this.energyPrices = new EnergyPrices();
    this.contractedPower = new ContractedPower();
    this.powerPrices = new PowerPrices("es");
    this.results = new SolarStudyResults();
    this.panelOrientation = undefined;
    this.panelInclination = undefined;
  }
  id?: string;

  surfaces?: Surface[];
  clientDetails?: ClientDetails;
  location?: {
    lng?: number;
    lat?: number;
  };
  worksOnWeekend?: boolean;
  energyTariff?: string;
  energyPrices?: EnergyPrices;
  powerPrices?: PowerPrices;
  contractedPower?: ContractedPower;
  panelOrientation?: number;
  panelInclination?: number;
  solarPanel?: SolarPanel;
  consumption?: PowerCurve;
  results?: SolarStudyResults;
  peakPowerCost?: number;
}
