import { Selector } from "testcafe";

fixture`Home`.page("http://localhost:3000");

test("should show correct issuer identity when uploading a valid combined VC", async (t) => {
  await t.setFilesToUpload("input[type=file]", [
    "../fixtures/v4/tt/did-idvc-wrapped-signed.json",
  ]);

  await Selector("#iframe")();
  await t.expect(Selector("h4").withText("Identity verified by:").exists).ok();
  await t
    .expect(Selector("h4").withText("National Digital Identity").exists)
    .ok();
});

test("should show correct custom error message when uploading an invalid combined VC, where issuer id wallet address did not matched idVc corporate details id", async (t) => {
  await t.setFilesToUpload("input[type=file]", [
    "../fixtures/v4/tt/did-idvc-wrapped-signed-wrong-binding.json",
  ]);

  await t.wait(5000);
  await t
    .expect(
      Selector("p").withText(
        "bound issuer id and idvc credential subject id are different"
      ).exists
    )
    .ok();
});

test("should show correct custom error message when uploading an invalid combined VC, when idVc is revoked", async (t) => {
  await t.setFilesToUpload("input[type=file]", [
    "../fixtures/v4/tt/did-idvc-wrapped-signed-idvc-revoked.json",
  ]);

  await t.wait(5000);
  await t
    .expect(
      Selector("p").withText("the idvc in the document has been revoked").exists
    )
    .ok();
});

test("should show unexpected error message when uploading an invalid combined VC, when combined VC's signature has been tampered", async (t) => {
  await t.setFilesToUpload("input[type=file]", [
    "../fixtures/v4/tt/did-idvc-wrapped-signed-tampered-signature.json",
  ]);

  await t.wait(5000);
  await t
    .expect(
      Selector("p").withText("merkle root is not signed correctly").exists
    )
    .ok();
});
