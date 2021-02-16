import { DayCurve } from "../../energy/classes/powerCurve.class";
import { ProfileTypes } from "./ProfileTypes.enum";

/**
 * This class defines a profile object; a list of date profile data of specified type and energy tariff, with a dat range
 */

export class Profile {
  constructor(
    tariff: string,
    startDate: string,
    endDate: string,
    type: string
  ) {
    this.tariff = tariff;
    this.endDate = endDate;
    this.startDate = startDate;
    this.type = type;
  }

  profile?: DayCurve[];
  tariff: string;
  startDate: string;
  endDate: string;
  type: string;
}
