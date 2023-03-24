import { FunctionComponent } from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { isValid, VerificationFragment } from "@govtechsg/oa-verify";
import { verify } from "../../services/verify";
import { TradexDocument } from "../../types";
import { createLogger } from "../../utils/debug";
import imgSrcTradeTrust from "../../assets/tradetrust-file.png";

const log = createLogger("oa-verify");

interface DocumentDropzoneProps {
  setTradexDocument: (document: TradexDocument | null) => void;
  setFragments: (fragments: VerificationFragment[]) => void;
}

export const DocumentDropzone: FunctionComponent<DocumentDropzoneProps> = ({
  setTradexDocument,
  setFragments,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = async () => {
          const text = reader.result;

          const document = JSON.parse(text as string);
          const fragments = await verify(document);
          log(`fragments: ${JSON.stringify(fragments, null, 2)}`);

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
    },
    [setFragments, setTradexDocument],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div
      className="border-2 border-dashed rounded-lg p-16 bg-white text-center my-8 md:my-0"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <img
        className="max-w-[60px] mx-auto mb-4"
        src={imgSrcTradeTrust}
        alt="TradeTrust file"
      />
      {isDragActive ? (
        <p className="font-bold">Drop the files here ...</p>
      ) : (
        <>
          <p className="font-bold">
            Drop your TradeTrust Document to verify content
          </p>
          <p className="my-4">or</p>
          <button className="bg-cerulean-500 text-white rounded-2xl px-4 py-2">
            Select Document
          </button>
        </>
      )}
    </div>
  );
};
