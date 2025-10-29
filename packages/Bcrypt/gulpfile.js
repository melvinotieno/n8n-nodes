import path from "node:path";
import { dest, src, task } from "gulp";

task("copy:assets", copyAssets);

/**
 * Copies asset files from the source to the destination.
 * @returns {Stream} The stream for the copy operation.
 */
function copyAssets() {
	const source = path.resolve("src", "**", "*.{png,svg,node.json}");
	const destination = path.resolve("dist");

	return src(source).pipe(dest(destination));
}
