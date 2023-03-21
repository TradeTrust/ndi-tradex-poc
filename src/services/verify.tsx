import {
  verificationBuilder,
  openAttestationVerifiers,
  Verifier,
  ValidVerificationFragment,
  InvalidVerificationFragment,
  ErrorVerificationFragment,
  SkippedVerificationFragment,
} from "@govtechsg/oa-verify";
import MyInfoVcVerifier from "myinfo-vc-verifier";
import { utils } from "@govtechsg/open-attestation";
import { IDENTITY_VC_TYPE, TradexDocument } from "../types";

const verifierName = "NdiCorporateIdentity";

type NdiCorporateIdentityFragment =
  | ValidVerificationFragment<Boolean>
  | InvalidVerificationFragment<Boolean>
  | ErrorVerificationFragment<any>
  | SkippedVerificationFragment;

type VerifierType = Verifier<NdiCorporateIdentityFragment>;

enum NdiCorporateIdentityCode {
  SKIPPED = 0,
  UNEXPECTED_ERROR = 1,
  INVALID_IDENTITY = 2,
  WALLET_NOT_MATCHED = 3,
}

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type: "ISSUER_IDENTITY",
    name: verifierName,
    reason: {
      code: NdiCorporateIdentityCode.SKIPPED,
      codeString: NdiCorporateIdentityCode[NdiCorporateIdentityCode.SKIPPED],
      message: `Document does not have identityVC.`,
    },
  };
};

const test: VerifierType["test"] = (document: any) => {
  if (utils.isWrappedV3Document(document as TradexDocument)) {
    return document.identityVC.type === IDENTITY_VC_TYPE.NDI;
  }
  return false;
};

const customVerify: VerifierType["verify"] = async (
  document: any,
): Promise<NdiCorporateIdentityFragment> => {
  const corporateVc = document.identityVC.embeddedVC;
  const verificationResult = await MyInfoVcVerifier.verify(corporateVc);
  console.log(verificationResult, "from ndi library");

  const isWalletAddressMatched =
    document.openAttestationMetadata.identityProof.identifier.includes(
      document.identityVC.embeddedVC.credentialSubject.id,
    ); // simple string match to confirm wallet address matched between ndi and tradex

  if (verificationResult.verified && isWalletAddressMatched) {
    return {
      data: true,
      name: verifierName,
      status: "VALID",
      type: "ISSUER_IDENTITY",
    };
  } else if (!verificationResult.verified) {
    return {
      data: false,
      name: verifierName,
      status: "INVALID",
      type: "ISSUER_IDENTITY",
      reason: {
        code: NdiCorporateIdentityCode.INVALID_IDENTITY,
        codeString:
          NdiCorporateIdentityCode[NdiCorporateIdentityCode.INVALID_IDENTITY],
        message: `NDI corporate identity is invalid`,
      },
    };
  } else if (!isWalletAddressMatched) {
    return {
      data: false,
      name: verifierName,
      status: "INVALID",
      type: "ISSUER_IDENTITY",
      reason: {
        code: NdiCorporateIdentityCode.WALLET_NOT_MATCHED,
        codeString:
          NdiCorporateIdentityCode[NdiCorporateIdentityCode.WALLET_NOT_MATCHED],
        message: `Wallet address did not matched between NDI and Tradex`,
      },
    };
  } else {
    return {
      data: false,
      name: verifierName,
      status: "INVALID",
      type: "ISSUER_IDENTITY",
      reason: {
        code: NdiCorporateIdentityCode.UNEXPECTED_ERROR,
        codeString:
          NdiCorporateIdentityCode[NdiCorporateIdentityCode.UNEXPECTED_ERROR],
        message: `Unexpected error encountered`,
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
  [...openAttestationVerifiers, ndiVerifier],
  {
    network: "goerli",
  },
);
