# How to make a Combined VC

First, a definition: **Combined VC** refers to a normal open-attestation document with an embedded or spliced identity VC from a established identity provider (This document will only refer to the established identifier as NDI/my-info).

In its most minimal form, the raw combined document should look something like this:

```jsonc
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://schemata.tradetrust.io/io/tradetrust/4.0/alpha-context.json"
  ],
  "type": [
    "VerifiableCredential",
    "TradeTrustCredential"
  ],
  "validFrom": "2021-03-08T12:00:00+08:00",
  "issuer": {
    "id": "did:ethr:0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C",
    "type": "TradeTrustIssuer",
    "name": "My Own Company Pte Ltd",
    "identityProof": {
      // note the new identityProofType
      "identityProofType": "IDVC",
      "identifier": "My Own Company Pte Ltd",
      "identityVC": {
        "type": "TradeTrustIdentityVC",
        // here is where you should put your idvc data
        // how do you get a idvc? contact your trust anchor
        "data": {
          "@context": [
            "https://w3id.org/security/bbs/v1",
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/vc/status-list/2021/v1",
            ...
          ],
          "id": "<CREDENTIAL_ID>",
          "type": [
            "VerifiableCredential"
          ],
          "issuer": "<ISSUER>",
          "credentialSubject": {
            "uen": "198801234E",
            "companyname": "My Own Company Pte Ltd",
            "type": [
              "CorporateBasicDetails"
            ],
            "id": "did:ethr:0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C"
          },
          ...
      }
    }
  },
  "credentialStatus": {
    "type": "TradeTrustCredentialStatus",
    "credentialStatusType": "NONE"
  },
  "renderMethod": {
    "type": "TradeTrustRenderMethod",
    "renderMethodType": "EMBEDDED_RENDERER",
    "name": "INVOICE",
    "url": "https://generic-templates.tradetrust.io"
  },
  "credentialSubject": {
    "name": "Document",
    "id": "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42",
    "date": "2018-02-21",
    ....
  },
  "proof": {
    "type": "TradeTrustMerkleProofSignature2018",
    "proofPurpose": "assertionMethod",
    "targetHash": "841c8d1fb121bf7baab0b1677c91dc47cca6aa1e8ac77....",
    "proofs": [],
    "merkleRoot": "841c8d1fb121bf7baab0b1677c91dc47cca6aa1e8ac77....",
    "salts": "W3sidmFsdWUiOiJiYjMyNjdiNGRkZGY0ZWRkMzJlZDNmY2YxYTlhOWM5NzY3NGFi....",
    "privacy": {
      "obfuscated": []
    },
    "key": "did:ethr:0xE94E4f16ad40ADc90C29Dc85b42F1213E034947C#controller",
    "signature": "0x76c3def684b98da04733f8f4..."
  }
}
```

## Notes:

Ensure that your raw document follows the [TTv4-alpha schema](https://schemata.openattestation.com/io/tradetrust/4.0/alpha-schema.json), and you will be able to wrap using the @tradetrust-tt/tradetrust library. Refer to the readme of that library for more details.
