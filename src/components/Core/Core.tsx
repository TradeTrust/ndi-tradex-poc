import { useCallback, FunctionComponent } from "react";
import { utils, TTv4 } from "@tradetrust/open-attestation";
import { VerificationFragment } from "@tradetrust/oa-verify";
import { VerificationFragments } from "../VerificationFragments";
import { CorporateVC } from "../CorporateVC";
import { DocumentRenderer } from "../DocumentRenderer";
import { TradexDocument } from "../../types";

interface CoreProps {
  document: TradexDocument;
  fragments: VerificationFragment[];
}

export const Core: FunctionComponent<CoreProps> = ({ document, fragments }) => {
  const renderContent = useCallback(
    (document: TradexDocument) => {
      if (utils.isWrappedV2Document(document) || utils.isSignedWrappedV2Document(document)) {
        console.log("v2");
        return (
          <>
            <section className="bg-cerulean-50">
              <div className="container py-16">
                {fragments.length > 0 && (
                  <VerificationFragments fragments={fragments} />
                )}
              </div>
            </section>
            <section>
              <DocumentRenderer tradexDocument={document} />
            </section>
          </>
        );
      } else if (utils.isSignedWrappedV3Document(document)) {
        return (
          <>
            <section className="bg-cerulean-50">
              <div className="container py-16">
                {fragments.length > 0 && (
                  <VerificationFragments fragments={fragments} />
                )}
              </div>
            </section>
            <section>
              <DocumentRenderer tradexDocument={document} />
            </section>
          </>
        );
      } else if (
        utils.isSignedWrappedOAV4Document(document) ||
        utils.isSignedWrappedTTV4Document(document)
      ) {
        return (
          <>
            <section className="bg-cerulean-50">
              <div className="container py-16">
                {document.issuer.identityProof.identityProofType ===
                  TTv4.IdentityProofType.Idvc && (
                  <CorporateVC document={document} />
                )}
                {fragments.length > 0 && (
                  <VerificationFragments fragments={fragments} />
                )}
              </div>
            </section>
            <section>
              <DocumentRenderer tradexDocument={document} />
            </section>
          </>
        );
      } else {
        return null;
      }
    },
    [document]
  );

  return renderContent(document);
};
