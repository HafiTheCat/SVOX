const VOXParse = require("vox-parser");
import * as C from "construct-js";
import * as A from "arcsecond";
import * as B from "arcsecond-binary";

export type SVOXGroup = { voxels: SvoxVoxel[]; palette: SvoxColor[] };
export type PreambleObj = { preamble: SvoxPreamble };
export type SvoxPreamble = PreambleObj & SVOXGroup;

type VoxVoxel = { x: number; y: number; z: number; i: number };
type VoxColor = { r: number; g: number; b: number; a: number };
type SvoxVoxel = VoxVoxel;
type SvoxColor = { i: number; r: number; g: number; b: number; a: number };
type BufferTypes = DataView | ArrayBuffer | Buffer | Uint8Array;

const bufferTypesToArrayBuffer = (input: BufferTypes): ArrayBuffer => {
	if (input instanceof DataView) {
		return input.buffer;
	}
	if (input instanceof ArrayBuffer) {
		return input;
	}
	if (input instanceof Buffer) {
		let buf = new Uint8Array(input.byteLength);
		input.copy(buf, 0, 0, input.byteLength);
		return buf.buffer;
	}
	if (input instanceof Uint8Array) {
		return input.buffer;
	}
	throw new Error("Unsupported input type");
};

/** Interface for svox and vox file functions */
export class SVOX {
	/** Takes an existing SVOX binary file and parses it to a json containing the data of the file
	 * @param file The binary svox file to parse
	 */
	static fromSVOX = (file: BufferTypes, headerOnly: boolean = false) => {
		let data = bufferTypesToArrayBuffer(file);

		let paletteChunkParser = (paletteAmount: number) =>
			A.exactly(paletteAmount)(
				A.sequenceOf([B.u8, B.u8, B.u8, B.u8, B.u8]).map(([i, r, g, b, a]) => ({ i, r, g, b, a }))
			);

		let voxelChunkParser = (voxelAmount: number) =>
			A.exactly(voxelAmount)(
				A.sequenceOf([B.u8, B.u8, B.u8, B.u8]).map(([x, y, z, i]) => ({ x, y, z, i }))
			);

		let parser = A.sequenceOf([A.str("SVOX "), B.u8, B.u8, B.u8])
			.map((rawHeaderData) => {
				const [magic, version, paletteAmount, voxelAmount] = rawHeaderData;
				return { magic, version, paletteAmount, voxelAmount };
			})
			.errorMap(() => {
				return `Header could not be parsed!`;
			})
			.chain((headerData) => {
				if (headerData === undefined) return A.fail("Header could not be parsed!");
				if (headerOnly || (headerData.paletteAmount === 0 && headerData.voxelAmount === 0)) {
					return A.succeedWith(headerData);
				}
				if (
					(headerData.paletteAmount === 0 && headerData.voxelAmount !== 0) ||
					(headerData.paletteAmount !== 0 && headerData.voxelAmount === 0)
				) {
					return A.fail(`A single amount header field cant be "0"`);
				}

				return A.sequenceOf([
					paletteChunkParser(headerData.paletteAmount).errorMap(() => {
						return `Palette chunk could not be parsed!`;
					}),
					voxelChunkParser(headerData.voxelAmount).errorMap(() => {
						return `Voxel chunk could not be parsed!`;
					}),
				]).map(([palette, voxels]) => ({ preamble: headerData, palette, voxels }));
			});

		const res = parser.run(data) as any;
		if (res.isError) throw new Error(res.error);
		return res.result;
	};

	/** Takes an existing VOX binary file and parses it to a json containing the data of the file
	 * @param file The binary vox file to parse
	 */
	static fromVOX = (file: ArrayBuffer): SVOXGroup => {
		let data = bufferTypesToArrayBuffer(file);
		if (data.byteLength <= 1) throw new Error("Input is empty");
		const parsedVoxFile = VOXParse.parse(data);

		const voxPalette = parsedVoxFile.body.children[2].content.palette as VoxColor[];
		const voxels = parsedVoxFile.body.children[1].content.voxels as VoxVoxel[];

		let voxObj: SVOXGroup = { voxels: [], palette: [] };
		let colorPalette: { [id: string]: SvoxColor } = {};

		for (let v of voxels) {
			voxObj.voxels.push(v);
			if (!colorPalette.hasOwnProperty(v.i.toString())) {
				colorPalette[v.i] = {
					i: v.i,
					...voxPalette[v.i],
				};
			}
		}

		voxObj.palette = Object.values(colorPalette);
		return voxObj;
	};

	/** Takes an existing SVOXGroup consisting of voxel and palette entries converts it to SVOX binary data
	 * @param svoxGroup The binary vox file to parse
	 */
	static toSVOX = (svoxGroup: SVOXGroup) => {
		if (svoxGroup.voxels === undefined || svoxGroup.palette === undefined)
			throw new Error("SVOXGroup must contain palette and voxels properties");
		let paletteAmount = svoxGroup["palette"].length;
		let voxelAmount = svoxGroup["voxels"].length;

		let preamble = C.Struct("preamble")
			.field("magic", C.RawString("SVOX "))
			.field("version", C.U8(1))
			.field("paletteAmount", C.U8(paletteAmount))
			.field("voxelAmount", C.U8(voxelAmount));

		let palette = C.Struct("palette");
		for (let v of svoxGroup.palette) {
			palette
				.field(`id${v.i}`, C.U8(v.i))
				.field(`r${v.i}`, C.U8(v.r))
				.field(`g${v.i}`, C.U8(v.g))
				.field(`b${v.i}`, C.U8(v.b))
				.field(`a${v.i}`, C.U8(v.a));
		}

		let c = 0;
		let voxels = C.Struct("voxels");
		for (let v of svoxGroup.voxels) {
			voxels
				.field(`x${c}`, C.U8(v.x))
				.field(`y${c}`, C.U8(v.y))
				.field(`z${c}`, C.U8(v.z))
				.field(`colorRef${c}`, C.U8(v.i));
			c++;
		}

		let fileStruct = C.Struct("file")
			.field("preamble", preamble)
			.field("palette", palette)
			.field("voxels", voxels);

		return fileStruct.toUint8Array();
	};
}
