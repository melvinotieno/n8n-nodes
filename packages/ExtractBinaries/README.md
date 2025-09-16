# Extract Binaries Node

The **Extract Binaries** node for n8n allows you to extract, filter, and route binary data (such as files or attachments) from previous nodes in your workflow. It is useful for workflows that need to process, validate, or split files based on their properties.

## Features

- Extracts binary fields from incoming items.
- Filters binaries by MIME type and file size.
- Routes accepted and rejected binaries to separate outputs.
- Optionally includes the original binary field name in the output.
- Provides rejection reasons for filtered-out binaries.

## Properties

| Property                          | Description                                                                                                |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Output Binary Field**           | The name of the field that will contain the extracted binary data.                                         |
| **Mime Types** (option)           | Comma-separated list of allowed MIME types (e.g., `image/png,application/pdf`). Leave empty to accept all. |
| **Maximum Size (Bytes)** (option) | Maximum allowed file size in bytes. Use a negative number for no limit.                                    |
| **Include Binary Field** (option) | If enabled, adds the original binary field name to the output.                                             |

## Outputs

- **Accepted**: Items that match the filter criteria.
- **Rejected**: Items that do not match, with a `reason` field explaining why.

## Example Usage

1. Add the **Extract Binaries** node after a node that outputs binary data (e.g., HTTP Request, Read Binary File).
2. Set the **Output Binary Field** (e.g., `data`).
3. (Optional) Set allowed **Mime Types** and/or **Maximum Size (Bytes)**.
4. (Optional) Enable **Include Binary Field** to track the source field.
5. Connect the outputs to further processing nodes.

## Example Output

**Accepted Output:**

```json
{
  "binary": {
    "data": {
      /* binary data */
    }
  },
  "json": {
    "metadata": {
      /* file metadata */
    },
    "originalBinaryField": "myFile"
  }
}
```

**Rejected Output:**

```json
{
  "binary": {
    "data": {
      /* binary data */
    }
  },
  "json": {
    "metadata": {
      /* file metadata */
    },
    "originalBinaryField": "myFile",
    "reason": "File size exceeds limit"
  }
}
```
