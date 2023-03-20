# How to make a Combined VC
First, a definition: **Combined VC** refers to a normal open-attestation document with an embedded or spliced identity VC from a established identity provider (This document will only refer to the established identifier as NDI/my-info).


In its most minimal form, the raw combined document should look something like this:
```json
{
  "version": "https://schema.openattestation.com/3.0/schema.json",
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
    "https://schemata.openattestation.com/io/tradetrust/Invoice/1.0/invoice-context.json",
    "https://gist.githubusercontent.com/cavacado/d6f4a4d7e817fb067ee8dde708dbd954/raw/a1b02636579ec70c4bacb73bd38d1e2d5a6f7a2b/extended+type3.json",
    "above-entry-should-be-replaced-by-a-context-published-by-schemata.openattestation-once-we-finalised-the-way-of-extension",
    // NEW must add this context inorder to wrap the COMBINED-VC and not throw (from oa-cli)
  ],
  "issuanceDate": "2010-01-01T19:23:24Z",
  "type": ["VerifiableCredential", "OpenAttestationCredential"],
  "credentialSubject": {
    "name": "TradeTrust Invoice v3",
    // ...Truncated Invoice Data that follows the Invoice context
  },
  "issuer": {
    "id": "<did:ethr:<WALLET-ADDRESS>",
    // DID-of-signer-of-COMBINED-VC
    "name": "My Own Company Pte Ltd"
  },
  "openAttestationMetadata": {
    "template": {
      "type": "EMBEDDED_RENDERER",
      "name": "INVOICE",
      "url": "https://generic-templates.tradetrust.io"
    },
    "proof": {
      "type": "OpenAttestationProofMethod",
      "method": "DID",
      "value": "<did:ethr:<WALLET-ADDRESS>",
      // DID-of-signer-of-COMBINED-VC
      "revocation": {
        "type": "NONE"
      }
    },
    "identityProof": {
      "type": "DID",
      "identifier": "<did:ethr:<WALLET-ADDRESS>"
      // DID-of-signer-of-COMBINED-VC
    }
  },
  // NEW nested field
  "identityVC": {
    "type": "NDI",
    // spliced identity VC
    "embeddedVC": {
      "@context": [
        "https://w3id.org/security/bbs/v1",
        "https://www.w3.org/2018/credentials/v1",
        // <NDI-IDVC-Context>,
        "https://w3id.org/vc/status-list/2021/v1"
      ],
      "id": // id of the VC, URI that points to the identity of this IDENTITY-VC,
      "type": ["VerifiableCredential"],
      "issuer": // DID-of-signer-of-IDENTITY-VC,
      "credentialSubject": {
        "uen": "198801234E",
        "companyname": "My Own Company Pte Ltd",
        "type": ["CorporateBasicDetails"],
        "id": // WALLET-ADDRESS-of-issuer-of-COMBINED-VC
      },
      "expirationDate": "2023-11-01T06:45:43Z",
      "credentialStatus": {
        "id": // URI-that-when-dereferenced-should-give-the-status-of-the-IDENTITY-VC>",
        "type": "StatusList2021Entry",
        "statusListIndex": 325,
        "statusListCredential": // URI-that-when-dereferenced-should-give-the-STATUSLIST-VC-of-NDI
      },
      "issuanceDate": "2023-22-13T01:35:08Z",
      "proof": {
        "type": "BbsBlsSignature2020",
        "created": "2023-03-15T00:55:21Z",
        "proofPurpose": "assertionMethod",
        "proofValue": "sV/i0SqiH6HHLc/muDM0grZDSOv048SRd5y89Vf7cZZ457e/wjtMnr1Y6QOox2KfE1cd+3ANrzjW7v3/VU2Q1uvuwd039ZIuyleUlHot6C4maxOwkL2Izbl235uTC4WaDFbFe+jCeBwC3vSqrdP97A==",
        "verificationMethod": // uri to handle verification
      }
    }
  }
}
```
We will break down each section to clarify how to structure the combined VC.

At a very high level, we have designed the combined VC to be as minimally intrusive if we are coming from the usual identifier methods from OA.

The main points to note are the 1) **addition of a new context**, and 2) an **additional nested field `identityVC`** which contains a `type` and `embeddedVC` fields.

# Additional Context

One of the additions we made was to extend the current context of a oa v3 document to "recognise" an additional `idenityVC` field. The word "recognise" is in double quotes because we chose a way to tell the json-ld expander algorithm to actually ignore the `identityVC` field.

Within the new remote context, it resolves to something like this:

```json
{
  "@context": {
    "@version": 1.1,
    "@protected": true,
    "identityVC": {
      "@id": "http://example.com/vocab/json",
      "@type": "@json"
    }
  }
}
```
which tells any machine reading this combined vc that when you encounter an `identityVC` field, just ignore it as its being used as literal `JSON` data.

The rationale for doing so is because retaining any sort of type/schema information about the `IdentityVC` doesn't make sense, as our application only parses and extracts this data to be sent along to NDI/other identity provider's verification module.

# Additional nested field `identityVC`

All the setup for the context is just so that our wrapping algorithm recognises and would not throw an error when it encounters the `identityVC` field.

Within this nested object, it contains just 2 fields, `type` and `embeddedVC`:

```js
{
  identityVC: {
    type: // Name of the verified identity provider (NDI / GLEIF etc),
    embeddedVC: // payload of the identity VC, to be passed to a verification module provided by the identity providers.
  }
}
```

The `type` field is necessary for us at the verification end, to be able to map the different verification modules to the different types of combined vcs.

The `embeddedVC` field is just to contain the identity VC payload from the identity provider.

# Making of Combined VC

After these new items have been added to the raw document, it becomes the raw combined VC's payload that can be processed with our usual oa methods (ie `wrap`, `sign`). Follow the tutorial [here](https://www.openattestation.com/docs/integrator-section/verifiable-document/did/create) if unsure.

Once that is done, the signed document is considered to be a document that is **issued** by `SIGNER-OF-COMBINED-VC` and **identified** by `SIGNER-OF-IDENITY-VC`, which could be realised as a counterpart to the other DID-signing methods of OA. ([In particular DID issued, identified by DNS](https://github.com/Open-Attestation/adr/blob/master/issuing_using_did.md#issued-via-direct-signing-identified-by-did))

# TODOS:
- publish finalised extension of context solution on schemata
- get reviews on this doc.