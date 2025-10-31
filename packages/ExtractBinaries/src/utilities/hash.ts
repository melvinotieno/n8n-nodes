import crypto from "node:crypto";

export const createBinaryHash = (buffer: Buffer, algorithm: string = "sha256"): Promise<string> => {
	const chunkSize = 1024 * 1024; // 1 MB

	return new Promise((resolve) => {
		const hash = crypto.createHash(algorithm);

		let offset = 0;

		const step = () => {
			if (offset >= buffer.length) {
				resolve(hash.digest("hex"));
				return;
			}

			hash.update(buffer.subarray(offset, offset + chunkSize));
			offset += chunkSize;

			setImmediate(step);
		};

		step();
	});
};
