import { validateIframeTexts } from "./helper";

fixture`v3`.page("http://localhost:3000");

test("should show correct verification when uploading a valid v3 VC", async (t) => {
  await t.setFilesToUpload("input[type=file]", [
    "../fixtures/v3/invoice.json",
  ]);

  await validateIframeTexts(["ABC Company", "def@company.com"]);
});
