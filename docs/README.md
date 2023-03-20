# Call for comments:

Here are 3 proposed methods of extending the context (+1):

# Method 0:

 Modifying and extending the current OA-context, most likely not an option as we would prefer to leave it as it is.

 https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json

----
The following methods involve adding an additional context that the wrapping party needs to do before wrapping/issuing their document.

# Method 1
 Adding an additional context, with the terms as defined as literal json data: (corresponding combined vc doc is in `method1.json`)

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

here we are saying that identityVC is just a json literal, and when an json-ld expander encounters such a field, it should not attempt to expand and instead ignores it.

Which kind of makes sense because we are literally using the data within the identityVC field for verification only, we dont need to tell other machines that they can handle this data (they wont know how to handle in the first place)

# Method 2

Adding an additional context, with only the type/kind defined as literal json data but retaining the context-info of the identity VC which should conform to the W3C VC data model. (corresponding combined vc doc is in `method2.json`)

```json
{
  "@context": {
    "@version": 1.1,
    "@protected": true,
    "identityVC": "@nest",
    "embeddedVC": {
      "@id": "cred:verifiableCredential",
      "@type": "@id",
      "@container": "@graph"
    }
  }
}
```
Here what this is telling the expander is that there is a term called `identityVC` in the document, and its a nested data, But only pay attention to the nested embeddedVC field as that is defined as a `verfiableCredential` as defined in the namespace `cred`.

Here we retain some contextual information about the vc, but imo, its unnecessary as at the application level (verifier layer), we only use the data. 

Here the expander should ignore any other data that is defined in the nested value of `identityVC`. (ie `kind` in this case)

# Method 3

Adding an additional context, whereby we introduce a new definition of a Node ie `IdentityVC` and then consume this definition in the data itself.

```json
{
  "@context": {
    "@version": 1.1,
    "@protected": true,
    "IdentityVC": {
      "@id": "https://schemata.openattestation.com/vocab/#IdentityVC",
      "@context": {
        "kind": "xsd:string",
        "embeddedVC": {
          "@id": "cred:verifiableCredential",
          "@type": "@id",
          "@container": "@graph"
        }
      }
    },
    "identityVC": {
      "@id": "IdentityVC",
      "@type": "@id",
      "@container": "@graph"
    }
  }
}
```

This is most probably the same as what we have been doing for OA-context. One advantage of this way is the protection of this type definition so no1 can modify it if they decide to extend the context further.

However, to me this is a little overkill because same reason as above, we are using the embedded vc as just data. There shouldnt be a need to let other machines know that that field is a vc since they would never look at it.

# Disclaimer

Of course im not claiming to be an expert in jsonld-spec and w3c standards so feel free to point out where my mistakes could be at. And if someone with better understanding of @context could explain how we can work out a solution that will be the best.