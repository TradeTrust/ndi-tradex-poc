import { validateIframeTexts } from "./helper";

fixture`Home`.page("http://localhost:3000");

test("should show correct verification when uploading a valid oav4-alpha VC", async (t) => {
  await t.setFilesToUpload("input[type=file]", ["../fixtures/v4/oa/brochure.json"]);

  await validateIframeTexts([
    "Verifiable Credentials",
    "How does TradeTrust address these challenges",
  ]);
});
