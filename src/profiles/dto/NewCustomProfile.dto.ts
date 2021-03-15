import { DayCurve } from "../../energy";
import { ProfileTag } from "../classes/ProfileTag.class";
import { ProfilingStrategy } from "../classes/ProfilingStrategy.class";
import { ProfilingStrategyDto } from "./ProfilingstrategyDto";

export class NewCustomProfileDto {
  days: DayCurve[];
  tags: ProfileTag[];
  name: string;
  description?: string;
  profilingStrategy: ProfilingStrategyDto;
}
