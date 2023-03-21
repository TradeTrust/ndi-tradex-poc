import {
  verificationBuilder,
  openAttestationVerifiers,
  Verifier,
  ValidVerificationFragment,
  InvalidVerificationFragment,
  ErrorVerificationFragment,
} from "@govtechsg/oa-verify";
import MyInfoVcVerifier from "myinfo-vc-verifier";

type NdiCorporateIdentityFragment =
  | ValidVerificationFragment<Boolean>
  | InvalidVerificationFragment<Boolean>
  | ErrorVerificationFragment<any>;

type VerifierType = Verifier<NdiCorporateIdentityFragment>;

enum NdiCorporateIdentityCode {
  SKIPPED = 0,
  UNEXPECTED_ERROR = 1,
  INVALID_IDENTITY = 2,
}

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type: "ISSUER_IDENTITY",
    name: "NdiCorporateIdentity",
    reason: {
      code: NdiCorporateIdentityCode.SKIPPED,
      codeString: NdiCorporateIdentityCode[NdiCorporateIdentityCode.SKIPPED],
      message: `:)`,
    },
  };
};

const test: VerifierType["test"] = () => {
  return true;
};

const customVerify: VerifierType["verify"] = async (
  document: any,
): Promise<NdiCorporateIdentityFragment> => {
  const corporateVc = document.identityVC.embeddedVC;
  const verificationResult = await MyInfoVcVerifier.verify(corporateVc);
  console.log(verificationResult, "from ndi library");
  if (verificationResult.verified) {
    return {
      data: true,
      name: "NdiCorporateIdentity",
      status: "VALID",
      type: "ISSUER_IDENTITY",
    };
  } else {
    return {
      data: false,
      name: "NdiCorporateIdentity",
      status: "INVALID",
      type: "ISSUER_IDENTITY",
      reason: {
        code: NdiCorporateIdentityCode.INVALID_IDENTITY,
        codeString:
          NdiCorporateIdentityCode[NdiCorporateIdentityCode.INVALID_IDENTITY],
        message: `NDI corporate identity is invalid`,
      },
    };
  }
};

const ndiVerifier: VerifierType = {
  skip,
  test,
  verify: customVerify,
};

export const verify = verificationBuilder(
  [openAttestationVerifiers[0], openAttestationVerifiers[3], ndiVerifier],
  {
    network: "goerli",
  },
);
