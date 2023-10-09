import {
  verificationBuilder,
  openAttestationVerifiers,
  Verifier,
  ValidVerificationFragment,
  InvalidVerificationFragment,
  ErrorVerificationFragment,
  SkippedVerificationFragment,
  verifySignature,
  createResolver,
} from "@govtechsg/oa-verify";
import MyInfoVcVerifier from "myinfo-vc-verifier";
import { utils } from "@govtechsg/open-attestation";
import { IDENTITY_VC_TYPE, TradexDocument } from "../types";
import { createLogger } from "../utils/debug";

const log = createLogger("ndi");

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
  REVOKED = 4,
}

const skip: VerifierType["skip"] = async () => {
  return {
    status: "SKIPPED",
    type: "ISSUER_IDENTITY",
    name: verifierName,
    reason: {
      code: NdiCorporateIdentityCode.SKIPPED,
      codeString: NdiCorporateIdentityCode[NdiCorporateIdentityCode.SKIPPED],
      message: `Document does not have identityVC`,
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
  document: any
): Promise<NdiCorporateIdentityFragment> => {
  // verification of IDVC
  const corporateVc = document.identityVC.embeddedVC;
  const revokedStatus = await MyInfoVcVerifier.getRevokeStatus(corporateVc);
  const verificationResult = await MyInfoVcVerifier.verify(corporateVc);
  log(`revokedStatus: ${revokedStatus}`);
  log(`verificationResult: ${JSON.stringify(verificationResult, null, 2)}`);

  // verification of Combined VC's signed merkle proof
  const merkleRoot = `0x${document.proof.merkleRoot}`;
  const { key, signature } = document.proof;
  const did = document.openAttestationMetadata.identityProof.identifier;

  // the API key provided below is OA's free INFURA_API_KEY
  const customConfig = {
    networks: [
      {
        name: "sepolia",
        rpcUrl: `https://sepolia.infura.io/v3/bb46da3f80e040e8ab73c0a9ff365d18`,
      },
    ],
  };
  let resolver = createResolver({ ethrResolverConfig: customConfig });

  // We do not need to expose verifySignature from oa-verify
  // since did verification should be according to w3c spec,
  // using it here only for convenience sake.
  const verificationStatusOfSignature = await verifySignature({
    did,
    merkleRoot,
    key,
    signature,
    resolver,
  });
  log(
    `verificationResult: ${JSON.stringify(
      verificationStatusOfSignature,
      null,
      2
    )}`
  );

  // verification of implicit binding between 2 documents
  const isWalletAddressMatched = document.issuer.id.includes(
    document.identityVC.embeddedVC.credentialSubject.id
  ); // simple string match to confirm wallet address matched between NDI and tradex

  if (
    verificationResult.verified &&
    verificationStatusOfSignature.verified &&
    isWalletAddressMatched &&
    !revokedStatus // revoked status of IDVC
    // could add revoked status of combined VC as well
  ) {
    return {
      data: true,
      name: verifierName,
      status: "VALID",
      type: "ISSUER_IDENTITY",
    };
  } else if (revokedStatus) {
    return {
      data: false,
      name: verifierName,
      status: "INVALID",
      type: "ISSUER_IDENTITY",
      reason: {
        code: NdiCorporateIdentityCode.REVOKED,
        codeString: NdiCorporateIdentityCode[NdiCorporateIdentityCode.REVOKED],
        message: `NDI corporate identity has been revoked`,
      },
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
    network: "sepolia", // network doesn't matter with did-signed OA documetns
  }
);
