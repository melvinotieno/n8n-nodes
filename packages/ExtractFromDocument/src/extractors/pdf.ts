// Most of this code is based on n8n's PDF extractor and is adopted to fit the
// ExtractFromDocument package structure.
// https://github.com/n8n-io/n8n/blob/b1305fe5f146bd590fc7caab568d8dba1568cea7/packages/nodes-base/utils/binary.ts#L134-L205

import type { TextContent as PdfTextContent } from "pdfjs-dist/types/src/display/api";

const parseText = (textContent: PdfTextContent) => {
  let lastY = undefined;
  const text = [];
  for (const item of textContent.items) {
    if ("str" in item) {
      if (lastY == item.transform[5] || !lastY) {
        text.push(item.str);
      } else {
        text.push(`\n${item.str}`);
      }
      lastY = item.transform[5];
    }
  }
  return text.join("");
};

async function extract(buffer: Buffer, args: IArgs): Promise<IExtract> {
  const { mergePages = true, maxPages } = args;

  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");

  const document = await getDocument({
    data: new Uint8Array(buffer),
    isEvalSupported: false,
  }).promise;

  const { metadata } = await document
    .getMetadata()
    .catch(() => ({ info: null, metadata: null }));

  const pages = [];
  if (maxPages !== 0) {
    let pagesToRead = document.numPages;
    if (maxPages && maxPages < document.numPages) {
      pagesToRead = maxPages;
    }

    for (let i = 1; i <= pagesToRead; i++) {
      const page = await document.getPage(i);
      const text = await page.getTextContent().then(parseText);
      pages.push(text);
    }
  }

  const text = mergePages ? pages.join("\n\n") : pages;

  return {
    text,
    numpages: document.numPages,
    metadata: (metadata && Object.fromEntries([...metadata])) ?? undefined,
  };
}

export default extract;
