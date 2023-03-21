import React from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  verificationBuilder,
  openAttestationVerifiers,
  isValid,
  VerificationFragment,
  Verifier,
  ValidVerificationFragment,
  InvalidVerificationFragment,
  ErrorVerificationFragment,
} from "@govtechsg/oa-verify";
import {
  FrameConnector,
  renderDocument,
  FrameActions,
  HostActionsHandler,
} from "@govtechsg/decentralized-renderer-react-components";
import { v3 } from "@govtechsg/open-attestation";
import MyInfoVcVerifier from "myinfo-vc-verifier";

type NdiCorporateIdentityFragment =
  | ValidVerificationFragment<Boolean>
  | InvalidVerificationFragment<Boolean>
  | ErrorVerificationFragment<any>;

type VerifierType = Verifier<NdiCorporateIdentityFragment>;

type NdiTradexDocument = v3.OpenAttestationDocument & {
  ndiMetadata: any;
};

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
  const corpVc = document.ndiMetadata;
  const verificationResult = await MyInfoVcVerifier.verify(corpVc);
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

const verify = verificationBuilder(
  [openAttestationVerifiers[0], openAttestationVerifiers[3], ndiVerifier],
  {
    network: "goerli",
  },
);

const dispatchActions = (action: FrameActions) => {
  if (action.type === "UPDATE_HEIGHT") {
    document
      .getElementById("iframe")!
      .setAttribute("height", `${window.innerHeight}px`);
  }
};

function App() {
  const [tradexDocument, setTradexDocument] =
    useState<NdiTradexDocument | null>(null);
  const [fragments, setFragments] = useState<VerificationFragment[]>([]);

  const onConnected = (frame: HostActionsHandler) => {
    frame(
      renderDocument({
        document: tradexDocument as NdiTradexDocument,
      }),
    );
  };

  const onDrop = useCallback((acceptedFiles: any[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        const text = reader.result;

        const document = JSON.parse(text as string);
        const fragments = await verify(document);
        console.log(fragments, "from oa-verify library with custom verifier");

        if (
          isValid(fragments, ["DOCUMENT_INTEGRITY"]) &&
          isValid(fragments, ["DOCUMENT_STATUS"]) &&
          isValid(fragments, ["ISSUER_IDENTITY"])
        ) {
          setFragments(fragments);
          setTradexDocument(document);
        } else {
          setFragments(fragments);
          setTradexDocument(null);
          console.warn("One of the fragments is invalid.");
        }
      };
      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-4">
        <h1>NDI Tradex: Proof of Concept</h1>
      </header>
      {fragments.length > 0 && (
        <ul className="mb-4 border bg-gray-50 p-4">
          {fragments.map((fragment) => (
            <li className="mb-2" key={fragment.name}>
              <p className="font-bold">{fragment.type}</p>
              {fragment.name}: {fragment.status}
            </li>
          ))}
        </ul>
      )}
      <main>
        <div
          className="mb-8 border-2 border-dashed p-8 bg-yellow-100"
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
        {tradexDocument && tradexDocument.openAttestationMetadata.template && (
          <>
            {
              // simple string match to confirm wallet address matched between ndi and tradex
              tradexDocument.openAttestationMetadata.identityProof.identifier.includes(
                tradexDocument.ndiMetadata.credentialSubject.id,
              ) ? (
                <div
                  className="my-8 mx-auto max-w-md py-4 px-8 bg-white shadow-lg rounded-lg"
                  style={{ backgroundColor: "rgb(240 253 244)" }}
                >
                  <h2 className="text-gray-800 text-3xl font-semibold">
                    {tradexDocument.ndiMetadata.credentialSubject.companyname}
                  </h2>
                  <div className="mt-2 text-gray-600">
                    <p>
                      UEN: {tradexDocument.ndiMetadata.credentialSubject.uen}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="font-semibold text-2xl text-center text-red-500">
                  This document is not issued by Tradex and NDI.
                </p>
              )
            }
            <FrameConnector
              style={{ width: "100%", border: "0px" }}
              source={tradexDocument.openAttestationMetadata.template.url}
              dispatch={dispatchActions}
              onConnected={onConnected}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
