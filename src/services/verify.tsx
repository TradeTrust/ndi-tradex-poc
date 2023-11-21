import {
  verificationBuilder,
  openAttestationVerifiers,
  tradeTrustIDVCIdentityProof
} from "@tradetrust-tt/tt-verify";

export const verify = verificationBuilder(
  [...openAttestationVerifiers, tradeTrustIDVCIdentityProof],
  {
    network: "maticmum", // network doesn't matter with did-signed OA documents, for the default key, it seems like sepolia isnt enabled, doesnt matter anyway
  }
);
