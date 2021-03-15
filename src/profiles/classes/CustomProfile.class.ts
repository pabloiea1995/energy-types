import { CustomProfileDay } from "./CustomProfileDay.class";
import { ProfileTag } from "./ProfileTag.class";
import { ProfilingStrategy } from "./ProfilingStrategy.class";

export class CustomProfile {
  idCustomProfile: number;
  creationDate?: string;
  days?: CustomProfileDay[];
  description?: string;
  name: string;
  tags?: ProfileTag[];
  clientId: string;
  profilingStrategy: ProfilingStrategy;
}
