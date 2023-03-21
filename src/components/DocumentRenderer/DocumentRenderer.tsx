import { FunctionComponent } from "react";
import {
  FrameConnector,
  renderDocument,
  FrameActions,
  HostActionsHandler,
} from "@govtechsg/decentralized-renderer-react-components";
import { NdiTradexDocument } from "../../types";

interface DocumentRendererProps {
  tradexDocument: NdiTradexDocument | null;
}

export const DocumentRenderer: FunctionComponent<DocumentRendererProps> = ({
  tradexDocument,
}) => {
  const dispatchActions = (action: FrameActions) => {
    if (action.type === "UPDATE_HEIGHT") {
      document
        .getElementById("iframe")!
        .setAttribute("height", `${window.innerHeight}px`);
    }
  };

  const onConnected = (frame: HostActionsHandler) => {
    frame(
      renderDocument({
        document: tradexDocument as NdiTradexDocument,
      }),
    );
  };

  return tradexDocument && tradexDocument.openAttestationMetadata.template ? (
    <>
      {
        // simple string match to confirm wallet address matched between ndi and tradex
        tradexDocument.openAttestationMetadata.identityProof.identifier.includes(
          tradexDocument.identityVC.embeddedVC.credentialSubject.id,
        ) ? (
          <div
            className="my-8 mx-auto max-w-md py-4 px-8 bg-white shadow-lg rounded-lg"
            style={{ backgroundColor: "rgb(240 253 244)" }}
          >
            <h2 className="text-gray-800 text-3xl font-semibold">
              {
                tradexDocument.identityVC.embeddedVC.credentialSubject
                  .companyname
              }
            </h2>
            <div className="mt-2 text-gray-600">
              <p>
                UEN:{" "}
                {tradexDocument.identityVC.embeddedVC.credentialSubject.uen}
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
  ) : null;
};
