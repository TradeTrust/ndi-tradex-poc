import { v3 } from "@govtechsg/open-attestation";

export enum IDENTITY_VC_TYPE {
  NDI = "NDI", // NDI's corporate VC
}

export interface IdentityVC {
  type: IDENTITY_VC_TYPE;
  embeddedVC: any;
}

export type TradexDocument = v3.OpenAttestationDocument & {
  identityVC: IdentityVC;
};
