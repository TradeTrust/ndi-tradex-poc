import { validateIframeTexts } from "./helper";

fixture`v4`.page("http://localhost:3000");

test("should show correct verification when uploading a valid oav4-alpha VC", async (t) => {
  await t.setFilesToUpload("input[type=file]", [
    "../fixtures/v4/oa/brochure.json",
  ]);

  await validateIframeTexts([
    "Verifiable Credentials",
    "How does TradeTrust address these challenges",
  ]);
});

test("should show correct verification when uploading a valid ttv4-alpha VC", async (t) => {
  await t.setFilesToUpload("input[type=file]", [
    "../fixtures/v4/tt/did-invoice-vanilla.json",
  ]);

  await validateIframeTexts([
    "ABC Company",
    "def@company.com",
    "urn:uuid:a013fb9d-bb03-4056-b696-05575eceaf42"
  ]);
});
