import { FunctionComponent } from "react";
import { TradexDocument } from "../../types";
import get from "lodash.get";

interface CorporateVCProps {
  document: TradexDocument;
}

const fallback = {
  companyname: "XYZ",
  uen: "123",
  id: "abc",
};

export const CorporateVC: FunctionComponent<CorporateVCProps> = ({
  document,
}) => {
  const { companyname, uen, id } = get(
    document,
    "issuer.identityProof.identityVC.data.credentialSubject",
    fallback
  );

  return (
    <div className="mb-8">
      <div className="mb-2">
        <h2 className="font-semibold">Verify Document</h2>
      </div>
      <div className="mb-4">
        <h4 className="text-black font-semibold">Issued by:</h4>
        <h4 className="text-cerulean-500">{companyname}</h4>
        <p className="text-gray-500">UEN: {uen}</p>
        <p className="text-gray-500">{id}</p>
      </div>
      <div>
        <h4 className="text-black font-semibold">Identity verified by:</h4>
        <h4 className="text-cerulean-500">National Digital Identity</h4>
      </div>
    </div>
  );
};
