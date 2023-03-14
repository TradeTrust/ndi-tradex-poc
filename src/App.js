import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  verificationBuilder,
  openAttestationVerifiers,
  isValid,
} from "@govtechsg/oa-verify";
import {
  FrameConnector,
  renderDocument,
} from "@govtechsg/decentralized-renderer-react-components";
import MyInfoVcVerifier from "myinfo-vc-verifier";

const ndiVerifier = {
  skip: () => {
    return {
      status: "SKIPPED",
      type: "ISSUER_IDENTITY",
      name: "NdiCorporateIdentity",
      reason: {
        code: 0,
        codeString: "SKIPPED",
        message: `:)`,
      },
    };
  },
  test: () => {
    return true;
  },
  verify: async (document) => {
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
      };
    }
  },
};

const verify = verificationBuilder(
  [openAttestationVerifiers[0], openAttestationVerifiers[3], ndiVerifier],
  {
    network: "goerli",
  },
);

const dispatchActions = (action) => {
  if (action.type === "UPDATE_HEIGHT") {
    document
      .getElementById("iframe")
      .setAttribute("height", `${window.innerHeight}px`);
  }
};

function App() {
  const [tradexDocument, setTradexDocument] = useState(null);
  const [fragments, setFragments] = useState([]);

  const onConnected = (frame) => {
    frame(
      renderDocument({
        document: tradexDocument,
      }),
    );
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = async () => {
        const text = reader.result;
        const document = JSON.parse(text);
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
        <ul className="mb-4 border p-4">
          {fragments.map((fragment) => (
            <li className="mb-2" key={fragment.name}>
              <p className="font-bold">{fragment.type}</p>
              {fragment.name}: {fragment.status}
            </li>
          ))}
        </ul>
      )}
      <main>
        <div className="border p-8 bg-yellow-100" {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
        {tradexDocument && (
          <FrameConnector
            style={{ width: "100%", border: "0px" }}
            source={tradexDocument.openAttestationMetadata.template.url}
            dispatch={dispatchActions}
            onConnected={onConnected}
          />
        )}
      </main>
    </div>
  );
}

export default App;
