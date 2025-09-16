/**
 * Parse a human readable file size string into bytes.
 *
 * @param input The file size string to parse.
 * @param base The base to use for the conversion (2 for binary, 10 for decimal).
 * @returns The file size in bytes.
 */
export const parseFileSize = (input: string | number, base: number = 2): number => {
	if (typeof input === "number") return input;

	const units: Record<number, [string[], number][]> = {
		2: [
			[["b", "bit", "bits"], 1 / 8],
			[["B", "Byte", "Bytes", "bytes"], 1],
			[["Kb"], 128],
			[["k", "K", "kb", "kB", "KB", "KiB", "Ki", "ki"], 1024],
			[["Mb"], 131072],
			[["m", "M", "mb", "mB", "MB", "MiB", "Mi", "mi"], 1024 ** 2],
			[["Gb"], 1.342e8],
			[["g", "G", "gb", "gB", "GB", "GiB", "Gi", "gi"], 1024 ** 3],
			[["Tb"], 1.374e11],
			[["t", "T", "tb", "tB", "TB", "TiB", "Ti", "ti"], 1024 ** 4],
			[["Pb"], 1.407e14],
			[["p", "P", "pb", "pB", "PB", "PiB", "Pi", "pi"], 1024 ** 5],
			[["Eb"], 1.441e17],
			[["e", "E", "eb", "eB", "EB", "EiB", "Ei", "ei"], 1024 ** 6],
		],
		10: [
			[["b", "bit", "bits"], 1 / 8],
			[["B", "Byte", "Bytes", "bytes"], 1],
			[["Kb"], 125],
			[["k", "K", "kb", "kB", "KB", "KiB", "Ki", "ki"], 1000],
			[["Mb"], 125000],
			[["m", "M", "mb", "mB", "MB", "MiB", "Mi", "mi"], 1.0e6],
			[["Gb"], 1.25e8],
			[["g", "G", "gb", "gB", "GB", "GiB", "Gi", "gi"], 1.0e9],
			[["Tb"], 1.25e11],
			[["t", "T", "tb", "tB", "TB", "TiB", "Ti", "ti"], 1.0e12],
			[["Pb"], 1.25e14],
			[["p", "P", "pb", "pB", "PB", "PiB", "Pi", "pi"], 1.0e15],
			[["Eb"], 1.25e17],
			[["e", "E", "eb", "eB", "EB", "EiB", "Ei", "ei"], 1.0e18],
		],
	};

	const match = /^([0-9.,]+)\s*(\w*)$/u.exec(input.toString().trim());
	if (!match) throw new Error(`Can't interpret ${input || "a blank string"}`);

	const num = parseFloat(match[1].replace(",", "."));
	const unit = match[2];

	if (Number.isNaN(num) || !Number.isFinite(num)) {
		throw new Error(`Can't interpret ${input || "a blank string"}`);
	}

	if (!unit) return Math.round(num);

	for (const [names, factor] of units[base]) {
		if (names.includes(unit)) {
			return Math.round(num * factor);
		}
	}

	throw new Error(`${unit} doesn't appear to be a valid unit`);
};
