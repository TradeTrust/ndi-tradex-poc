import { FunctionComponent } from "react";
import { VerificationFragment } from "@tradetrust-tt/tt-verify";
import { TickIcon } from "../../assets/icons";

enum Status {
  DOCUMENT_INTEGRITY = "Document has not been tampered with",
  DOCUMENT_STATUS = "Document has been issued",
  ISSUER_IDENTITY = "Document has been identified",
}
interface VerificationFragmentsProps {
  fragments: VerificationFragment[];
}

export const VerificationFragments: FunctionComponent<
  VerificationFragmentsProps
> = ({ fragments }) => {
  const validFragments = fragments.filter(
    (fragment) => fragment.status === "VALID",
  );

  return (
    <ul className="flex flex-wrap items-center">
      {validFragments.map((fragment) => (
        <li className="mb-2 lg:mb-0 mr-4" key={fragment.name}>
          <div className="flex">
            <TickIcon className="w-[20px] mr-2" />
            <p>{Status[fragment.type]}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};
