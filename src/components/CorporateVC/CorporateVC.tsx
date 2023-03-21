import { FunctionComponent } from "react";
import { IdentityVC } from "../../types";

interface CorporateVCProps {
  identityVC: IdentityVC;
}

export const CorporateVC: FunctionComponent<CorporateVCProps> = ({
  identityVC,
}) => {
  const { companyname, uen } = identityVC.embeddedVC.credentialSubject;

  return (
    <div
      className="my-8 mx-auto max-w-md py-4 px-8 bg-white shadow-lg rounded-lg"
      style={{ backgroundColor: "rgb(240 253 244)" }}
    >
      <h2 className="text-gray-800 text-3xl font-semibold">{companyname}</h2>
      <div className="mt-2 text-gray-600">
        <p>UEN: {uen}</p>
      </div>
    </div>
  );
};
