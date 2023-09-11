import unrevoked from "../../fixtures/gleif-idvcs/unrevoked.json";
import MyInfoVcVerifier from "myinfo-vc-verifier";

test("should be able to verify did:web issued documents via NDI module", async () => {
  let res = await MyInfoVcVerifier.verify(unrevoked);
  console.log(res.error);
  expect(res.verified).toBe(true);
});
