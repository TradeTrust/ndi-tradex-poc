import { FunctionComponent } from "react";
import { VerificationFragment } from "@govtechsg/oa-verify";

interface VerificationFragmentsProps {
  fragments: VerificationFragment[];
}

export const VerificationFragments: FunctionComponent<
  VerificationFragmentsProps
> = ({ fragments }) => {
  return (
    <ul className="mb-4 border bg-gray-50 p-4">
      {fragments.map((fragment) => (
        <li className="mb-2" key={fragment.name}>
          <p className="font-bold">{fragment.type}</p>
          {fragment.name}: {fragment.status}
        </li>
      ))}
    </ul>
  );
};
