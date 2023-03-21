import { useState } from "react";
import { VerificationFragment } from "@govtechsg/oa-verify";
import { DocumentDropzone } from "./components/DocumentDropzone";
import { DocumentRenderer } from "./components/DocumentRenderer";
import { VerificationFragments } from "./components/VerificationFragments";
import { NdiTradexDocument } from "./types";

function App() {
  const [tradexDocument, setTradexDocument] =
    useState<NdiTradexDocument | null>(null);
  const [fragments, setFragments] = useState<VerificationFragment[]>([]);

  const documentDropzoneProps = {
    setTradexDocument,
    setFragments,
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-4">
        <h1>NDI Tradex: Proof of Concept</h1>
      </header>
      {fragments.length > 0 && <VerificationFragments fragments={fragments} />}
      <main>
        <DocumentDropzone {...documentDropzoneProps} />
        <DocumentRenderer tradexDocument={tradexDocument} />
      </main>
    </div>
  );
}

export default App;
