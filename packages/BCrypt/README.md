# BCrypt Node

The **BCrypt** node for n8n provides password hashing and verification using the bcrypt package. It is useful for securely storing and comparing passwords or other sensitive data in your workflows.

## Features

- Hash plain text values using bcrypt.
- Compare plain text values against bcrypt hashes.
- Configure salt rounds for hashing.

## Properties

| Property        | Description                                        |
| --------------- | -------------------------------------------------- |
| **Action**      | Choose between "Hash" and "Compare".               |
| **Plain Text**  | The plain text value to hash or compare.           |
| **Salt Rounds** | (Hash only) Number of salt rounds (default: 10).   |
| **Hash Text**   | (Compare only) The bcrypt hash to compare against. |

## Example Usage

### Hashing a Value

1. Set **Action** to "Hash".
2. Enter the plain text to hash.
3. (Optional) Set the number of salt rounds.

**Output:**

```json
{
  "hash": "$2b$10$..."
}
```

### Comparing a Value

1. Set **Action** to "Compare".
2. Enter the plain text value and the bcrypt hash.

**Output:**

```json
{
  "match": true
}
```

## Resources

- [BCrypt Documentation](https://www.npmjs.com/package/bcrypt)

---
