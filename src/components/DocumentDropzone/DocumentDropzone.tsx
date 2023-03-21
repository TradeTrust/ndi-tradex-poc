import { FunctionComponent } from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { isValid, VerificationFragment } from "@govtechsg/oa-verify";
import { verify } from "../../services/verify";
import { NdiTradexDocument } from "../../types";

interface DocumentDropzoneProps {
  setTradexDocument: (document: NdiTradexDocument | null) => void;
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
    },
    [setFragments, setTradexDocument],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
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
  );
};
