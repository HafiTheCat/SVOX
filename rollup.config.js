import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

export default [
	{
		input: "./src/index.ts",
		output: {
			file: "dist/index.js",
			format: "cjs",
			exports: "auto",
		},
		external: ["vox-parser", "construct-js", "arcsecond", "arcsecond-binary"],
		plugins: [
			typescript({ target: "ES6", compilerOptions: { removeComments: true, module: "ESNext" } }),
		],
	},
	{
		input: "./src/index.ts",
		output: {
			file: "dist/index.mjs",
			format: "es",
		},
		external: ["vox-parser", "construct-js", "arcsecond", "arcsecond-binary"],
		plugins: [
			typescript({ target: "ES2020", compilerOptions: { removeComments: true, module: "ESNext" } }),
		],
	},
	{
		input: "./src/index.ts",
		output: {
			file: "dist/index.d.ts",
			format: "cjs",
		},
		plugins: [typescript({ compilerOptions: { module: "ESNext" } }), dts()],
	},
];
