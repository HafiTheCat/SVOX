
[![Smaller Vox files with SVOX](https://florian-hafner.eu/assets/svox.png)](https://www.npmjs.com/package/svox)


<h2 style="text-align: center;">SVOX a fileformat for storing voxel based position and color data</h2>

---

The **SVOX** file format is based on MagicaVoxel's file format `.vox` which always includes the full color palette for any given amount of voxels. This can lead to the file containing unnecessary data *(since the whole range of colors in the palette is often not needed)*. It can be especially impactful for transmitting smaller assets *(which are usually < 256 Voxels)* over a network.

## Installation

```shell
// With npm
npm i svox

// With yarn
yarn add svox

// With pnpm
pnpm add svox
```

## Usage
```ts
// CommonJS
const SVOX = require('svox');

// ESModules
import SVOX from 'svox';
```

```ts
// Takes an existing ArrayBuffer containing SVOX data and parses it to an object
SVOX.fromSVOX(file)

// Takes an existing ArrayBuffer containing VOX data and parses it to an object
SVOX.fromVOX(file)

// Takes an existing Object consisting of voxel and palette entries and converts it to SVOX binary data
SVOX.toSVOX(svoxGroup)
```

## File structure

The file structure can be found here: [check out filestructure](https://github.com/f2hafner/SVOX/blob/main/FileStructure.md)

## Changelog

Check out the [Changelog](https://github.com/f2hafner/SVOX/blob/main/CHANGELOG.md)




