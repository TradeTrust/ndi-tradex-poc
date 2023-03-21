import { v3 } from "@govtechsg/open-attestation";

export type NdiTradexDocument = v3.OpenAttestationDocument & {
  identityVC: any;
};
