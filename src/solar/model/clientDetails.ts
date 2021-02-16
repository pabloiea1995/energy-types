export class ClientDetails {
  constructor() {
    this.identifier = undefined;
    this.contactNumber = undefined;
    this.sector = undefined;
    this.email = undefined;
    this.officialId = undefined;
    this.phoneNumber = undefined;
    this.address = undefined;
    this.instalationLocation = undefined;
    this.region = undefined;
    this.tariff = undefined;
  }

  identifier?: string; //razon social
  contactNumber?: string;
  sector?: string;
  email?: string;
  officialId?: string; //CIF
  phoneNumber?: string;
  address?: string;
  instalationLocation?: string;
  city?: string;
  region?: string; //provincia
  tariff?: string; //TArifa de acceso
}
