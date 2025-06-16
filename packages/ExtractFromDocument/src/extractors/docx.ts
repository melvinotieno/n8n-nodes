import { DOMParser } from "@xmldom/xmldom";
import yauzl, { type Entry, type ZipFile } from "yauzl";

function extractTextFromXml(xml: string): string {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "text/xml");
  const textNodes = xmlDoc.getElementsByTagName("w:t");

  let extractedText = "";
  for (const element of textNodes) {
    extractedText += element.textContent + "\n";
  }

  return extractedText;
}

function openReadStream(zipFile: ZipFile, entry: Entry): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let documentXml = "";

    zipFile.openReadStream(entry, (error, readStream) => {
      if (error) {
        return reject(new Error(`Failed to read entry: ${error.message}`));
      }

      readStream.on("data", (chunk) => {
        documentXml += chunk.toString();
      });

      readStream.on("end", () => resolve(documentXml));

      readStream.on("error", reject);
    });
  });
}

async function extract(buffer: Buffer, args: IArgs): Promise<IExtract> {
  const { mergePages = true, maxPages } = args;

  return new Promise<IExtract>((resolve, reject) => {
    // Open the DOCX file as a zip archive
    yauzl.fromBuffer(buffer, { lazyEntries: true }, (error, zipFile) => {
      if (error) {
        return reject(new Error(`Failed to open DOCX file: ${error.message}`));
      }

      const handleZipError = (err: Error) => {
        reject(new Error(`Error reading DOCX file: ${err.message}`));
      };

      const handleZipEnd = () => {
        resolve({ text: "", numpages: 0 });
      };

      const processEntry = async (entry: yauzl.Entry) => {
        if (entry.fileName !== "word/document.xml") {
          return zipFile.readEntry(); // Skip entries that are not the main document
        }

        try {
          const documentXml = await openReadStream(zipFile, entry);
          const extract = extractTextFromXml(documentXml).split("\f"); // '\f' as page marker

          let pages = extract;
          if (maxPages && maxPages > 0) {
            pages = pages.slice(0, maxPages);
          }

          const text = mergePages ? pages.join("\n") : pages;
          resolve({ text, numpages: extract.length });
          zipFile.close();
        } catch (err) {
          reject(err as Error);
        }
      };

      zipFile.on("error", handleZipError);
      zipFile.on("entry", processEntry);
      zipFile.on("end", handleZipEnd);
      zipFile.readEntry();
    });
  });
}

export default extract;
