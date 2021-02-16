import { ProfileTypes } from "..";

export class RawProfileUpload {
  constructor() {}

  tariffs: string[];
  profileType: string;
  year: number;
  rawData: { profile: any[]; identifier: string }[];
  isFromREE: boolean;
}
