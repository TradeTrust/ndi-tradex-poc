import { t, Selector } from "testcafe";

export const Iframe = Selector("#iframe[title='Decentralised Rendered Certificate']", { timeout: 120000 });
export const SampleTemplate = Selector("#root");

export const validateTextContent = async (testcafe, component, texts) =>
  texts.reduce(
    async (previousValue, currentValue) => testcafe.expect(component.textContent).contains(currentValue),
    Promise.resolve()
  );

export const validateIframeTexts = async (texts) => {
  await t.switchToIframe(Iframe);
  await validateTextContent(t, SampleTemplate, texts);
  await t.switchToMainWindow();
};