import { FunctionComponent, useCallback, useEffect } from "react";
import {
  FrameConnector,
  renderDocument,
  FrameActions,
  HostActionsHandler,
} from "@govtechsg/decentralized-renderer-react-components";
import { TradexDocument } from "../../types";
import get from "lodash.get";
import { utils } from "@tradetrust/open-attestation";

interface DocumentRendererProps {
  tradexDocument: TradexDocument | null;
}

export const DocumentRenderer: FunctionComponent<DocumentRendererProps> = ({
  tradexDocument,
}) => {
  let fallback = "https://demo-cnm.openattestation.com";
  const dispatchActions = (action: FrameActions) => {
    if (action.type === "UPDATE_HEIGHT") {
      document
        .getElementById("iframe")!
        .setAttribute("height", `${action.payload}px`);
    }
  };

  const onConnected = (frame: HostActionsHandler) => {
    frame(
      renderDocument(
        utils.isWrappedV2Document(tradexDocument)
          ? {
              document: utils.getData(tradexDocument) as any,
            }
          : { document: tradexDocument as any}
      )
    );
  };

  const getLocation = useCallback(
    (document: TradexDocument): string => {
      if (utils.isWrappedV2Document(document)) {
        return get(utils.getData(document), "$template.url", fallback);
      } else if (utils.isSignedWrappedV3Document(document)) {
        return get(document, "openAttestationMetadata.template.url", fallback);
      } else if (
        utils.isSignedWrappedOAV4Document(document) ||
        utils.isSignedWrappedTTV4Document(document)
      ) {
        return get(document, "renderMethod.url");
      } else {
        return fallback;
      }
    },
    [document]
  );

  return (
    <FrameConnector
      style={{ width: "100%", border: "0px" }}
      source={tradexDocument ? getLocation(tradexDocument) : fallback}
      dispatch={dispatchActions}
      onConnected={onConnected}
    />
  );
};
