import { useState } from "react";
import { VerificationFragment } from "@tradetrust-tt/tt-verify";
import { DocumentDropzone } from "./components/DocumentDropzone";
import { TradexDocument } from "./types";
import { TradeTrustLogo } from "./assets/logos";
import { TickIcon } from "./assets/icons";
import imgSrcHelp from "./assets/how-can-we-help.png";
import { Core } from "./components/Core";

export const App = () => {
  const [tradexDocument, setTradexDocument] = useState<TradexDocument | null>(
    null
  );
  const [fragments, setFragments] = useState<VerificationFragment[]>([]);

  const documentDropzoneProps = {
    setTradexDocument,
    fragments,
    setFragments,
  };

  return (
    <div>
      <header className="bg-white">
        <div className="container py-4">
          <TradeTrustLogo className="max-w-[170px]" />
        </div>
      </header>
      <main>
        <section className="bg-cerulean-50">
          <div className="container py-16">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2">
                <div className="max-w-md">
                  <h1 className="leading-tight">
                    An Easy Way to Check and Verify your Document
                  </h1>
                  <p>
                    We help you to verify the documents you have issued via
                    TradeTrust framework all in one place.
                  </p>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <DocumentDropzone {...documentDropzoneProps} />
              </div>
            </div>
          </div>
        </section>
        {tradexDocument && (
          <Core fragments={fragments} document={tradexDocument} />
        )}
        <section>
          <div className="container py-16">
            <div className="flex flex-wrap items-center">
              <div className="w-full md:w-1/2">
                <img src={imgSrcHelp} alt="How can we help" />
              </div>
              <div className="w-full md:w-1/2">
                <div className="max-w-md mx-auto">
                  <h2>How we can help</h2>
                  <ul>
                    <li className="my-4">
                      <p>
                        <TickIcon className="max-w-[20px] inline-block mr-2" />
                        <span className="font-bold">View</span> - Easy way to
                        view your document
                      </p>
                    </li>
                    <li className="my-4">
                      <p>
                        <TickIcon className="max-w-[20px] inline-block mr-2" />
                        <span className="font-bold">Check</span> - Make sure it
                        has not been tampered with
                      </p>
                    </li>
                    <li className="my-4">
                      <p>
                        <TickIcon className="max-w-[20px] inline-block mr-2" />
                        <span className="font-bold">Verify</span> - Find out the
                        identity of the issuer registered on a recognised
                        organisation
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="my-4">
        <div className="container border-t border-b py-2 text-center">
          <p>Copyright © 2023 TradeTrust </p>
        </div>
      </footer>
    </div>
  );
};
