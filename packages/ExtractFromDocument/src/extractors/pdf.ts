// PDF text extraction functionality adapted from n8n's core PDF utilities
// to work with the ExtractFromDocument node architecture.
// Original source: https://github.com/n8n-io/n8n/blob/b1305fe5f146bd590fc7caab568d8dba1568cea7/packages/nodes-base/utils/binary.ts#L134-L205

import type { TextContent as PdfTextContent } from "pdfjs-dist/types/src/display/api";

const parseText = (textContent: PdfTextContent) => {
	const text = [];

	let lastY: number | undefined;

	for (const item of textContent.items) {
		if ("str" in item) {
			if (lastY === item.transform[5] || !lastY) {
				text.push(item.str);
			} else {
				text.push(`\n${item.str}`);
			}

			lastY = item.transform[5];
		}
	}

	return text.join("");
};

async function extract(buffer: Buffer, args: IDocumentOptions): Promise<IDocumentExtract> {
	const { mergePages = true, maxPages, password } = args;

	const { getDocument, version } = await import("pdfjs-dist/legacy/build/pdf.mjs");

	const document = await getDocument({
		data: new Uint8Array(buffer),
		isEvalSupported: false,
		password,
	}).promise;

	const { info, metadata } = await document
		.getMetadata()
		.catch(() => ({ info: null, metadata: null }));

	const pages = [];

	if (maxPages !== 0) {
		let pagesToRead = document.numPages;

		if (maxPages && maxPages < document.numPages) {
			pagesToRead = maxPages;
		}

		// extract content from each page
		for (let i = 1; i <= pagesToRead; i++) {
			const page = await document.getPage(i);
			const text = await page.getTextContent().then(parseText);
			pages.push(text);
		}
	}

	const text = mergePages ? pages.join("\n\n") : pages;

	return {
		text,
		version,
		numpages: document.numPages,
		info: (info && Object.fromEntries(Object.entries(info))) ?? undefined,
		metadata: (metadata && Object.fromEntries([...metadata])) ?? undefined,
	};
}

export default extract;
