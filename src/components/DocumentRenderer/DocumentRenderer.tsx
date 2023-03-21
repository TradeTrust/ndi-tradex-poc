import { FunctionComponent } from "react";
import {
  FrameConnector,
  renderDocument,
  FrameActions,
  HostActionsHandler,
} from "@govtechsg/decentralized-renderer-react-components";
import { TradexDocument } from "../../types";

interface DocumentRendererProps {
  tradexDocument: TradexDocument | null;
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
        document: tradexDocument as TradexDocument,
      }),
    );
  };

  return (
    <FrameConnector
      style={{ width: "100%", border: "0px" }}
      source={tradexDocument!.openAttestationMetadata.template!.url}
      dispatch={dispatchActions}
      onConnected={onConnected}
    />
  );
};
