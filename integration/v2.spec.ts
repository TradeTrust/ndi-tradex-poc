import { validateIframeTexts } from "./helper";

fixture`Home`.page("http://localhost:3000");

test("should show correct verification when uploading a valid v2 VC", async (t) => {
  await t.setFilesToUpload("input[type=file]", [
    "../fixtures/v2/cert-origin.json",
  ]);

  await validateIframeTexts(["CERTIFICATE OF ORIGIN", "Alice Tan"]);
});
