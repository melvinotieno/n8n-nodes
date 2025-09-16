# Extract from Document Node

The **Extract from Document** node for n8n allows you to extract text content from various document formats in your workflows. It supports PDF and DOCX files and provides flexible options for handling the extracted content.

## Features

- Extracts text content from PDF and DOCX documents
- Supports password-protected PDF files
- Option to merge all pages into a single text or return text per page
- Configurable maximum page limit
- Flexible source data preservation options
- Returns document metadata alongside extracted text

## Supported File Types

| Format | MIME Type                                                                 | Description              |
| ------ | ------------------------------------------------------------------------- | ------------------------ |
| PDF    | `application/pdf`                                                         | Portable Document Format |
| DOCX   | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | Microsoft Word Document  |

## Properties

| Property                 | Description                                                                                   |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **Input Binary Field**   | The name of the binary field containing the document to extract text from                     |
| **Merge Pages** (option) | Whether to merge text from all pages into a single string or return an array of text per page |
| **Max Pages** (option)   | Maximum number of pages to process. Use -1 for no limit                                       |
| **Password** (option)    | Password for protected PDF documents                                                          |
| **Keep Source** (option) | Choose what data to preserve from the input: JSON, Binary, or Both                            |

## Example Usage

1. Connect a node that outputs binary document data (e.g., HTTP Request, Read Binary File)
2. Add the **Extract from Document** node
3. Set the **Input Binary Field** to match your binary field name
4. Configure extraction options as needed
5. Process the extracted text in subsequent nodes

## Example Output

```json
{
  "text": "Extracted document content...",
  "numpages": 5,
  "info": {
    "PDFFormatVersion": "1.4",
    "IsAcroFormPresent": false
  },
  "metadata": {
    "Title": "Document Title",
    "Author": "Document Author"
  },
  "version": "3.4.120"
}
```

## Error Handling

The node will throw an error if:

- The specified binary field doesn't exist
- The file format is not supported
- The document is corrupted or unreadable
- A password-protected PDF is accessed without the correct password

Enable "Continue on Fail" in the node settings to handle errors gracefully and continue processing other items.
