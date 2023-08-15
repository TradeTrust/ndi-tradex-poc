import { Selector } from "testcafe";

fixture`Home`.page("http://localhost:3000");

test("should show correct issuer identity when uploading a valid combined VC", async (t) => {
  await t.setFilesToUpload("input[type=file]", [
    "../fixtures/signed-documents/ndi-tradex.json",
  ]);

  await Selector("#iframe")();
  await t.expect(Selector("h4").withText("Identity verified by:").exists).ok();
  await t
    .expect(Selector("h4").withText("National Digital Identity").exists)
    .ok();
});

test("should show correct custom error message when uploading an invalid combined VC, where issuer id wallet address did not matched idVc corporate details id", async (t) => {
  await t.setFilesToUpload("input[type=file]", [
    "../fixtures/error-documents/wallet-address-not-matched.json",
  ]);

  await t.wait(5000);
  await t
    .expect(
      Selector("p").withText(
        "Wallet address did not matched between NDI and Tradex",
      ).exists,
    )
    .ok();
});


test("should show correct custom error message when uploading an invalid combined VC, when idVc is revoked", async (t) => {
  await t.setFilesToUpload("input[type=file]", [
    "../fixtures/error-documents/revoked.json",
  ]);

  await t.wait(5000);
  await t
    .expect(
      Selector("p").withText(
        "NDI corporate identity has been revoked",
      ).exists,
    )
    .ok();
});
