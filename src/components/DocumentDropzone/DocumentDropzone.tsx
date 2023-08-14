import { FunctionComponent, useState } from "react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  isValid,
  VerificationFragment,
  InvalidVerificationFragment,
} from "@govtechsg/oa-verify";
import { verify } from "../../services/verify";
import { TradexDocument } from "../../types";
import { createLogger } from "../../utils/debug";
import imgSrcTradeTrust from "../../assets/tradetrust-file.png";

const log = createLogger("oa-verify");

type Status = "initial" | "pending" | "error";

interface DocumentDropzoneProps {
  setTradexDocument: (document: TradexDocument | null) => void;
  fragments: VerificationFragment[];
  setFragments: (fragments: VerificationFragment[]) => void;
}

export const DocumentDropzone: FunctionComponent<DocumentDropzoneProps> = ({
  setTradexDocument,
  fragments,
  setFragments,
}) => {
  const [status, setStatus] = useState<Status>("initial");

  const uiStatus =
    status === "error"
      ? "bg-red-50 border-red-300"
      : "bg-white border-gray-300";
  const uiErrorMsgs = fragments.filter(
    (fragment) => fragment.status === "INVALID",
  ) as InvalidVerificationFragment<any>[];

  const onDragEnter = useCallback(() => {
    setStatus("initial");
    setFragments([]);
  }, [setFragments]);

  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      setStatus("pending");
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = async () => {
          const text = reader.result;

          const document = JSON.parse(text as string);
          const fragments = await verify(document);
          log(`fragments: ${JSON.stringify(fragments, null, 2)}`);

          if (isValid(fragments)) {
            setStatus("initial");
            setFragments(fragments);
            setTradexDocument(document);
          } else {
            setStatus("error");
            setFragments(fragments);
            setTradexDocument(null);
          }
        };
        reader.readAsText(file);
      });
    },
    [setFragments, setTradexDocument],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter,
  });

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-16 text-center my-8 md:my-0 ${uiStatus}`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <img
        className="max-w-[60px] mx-auto mb-4"
        src={imgSrcTradeTrust}
        alt="TradeTrust file"
      />

      {status === "pending" ? (
        <svg
          className="animate-spin h-5 w-5 text-cerulean mx-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : isDragActive ? (
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
      {uiErrorMsgs.length > 0 && (
        <ul className="text-red-600 mt-8">
          {uiErrorMsgs.map((fragment) => (
            <li key={fragment.name}>
              <p className="text-red-600">{fragment.reason.message}.</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
