import {
  verificationBuilder,
  openAttestationVerifiers,
  tradeTrustIDVCIdentityProof
} from "@tradetrust/oa-verify";

export const verify = verificationBuilder(
  [...openAttestationVerifiers, tradeTrustIDVCIdentityProof],
  {
    network: "homestead", // network doesn't matter with did-signed OA documetns, for the default key, it seems like sepolia isnt enabled, doesnt matter anyway
  }
);
