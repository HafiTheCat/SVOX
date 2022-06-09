
[![Smaller Vox files with SVOX](https://florian-hafner.eu/assets/svox.png)](https://www.npmjs.com/package/svox)


<h1 style="text-align: center;">SVOX is a file format for storing voxel and palette data.</h1>

---

The **SVOX** file format is based on the MagicaVoxel's file format .vox which always includes the full color palette for any given amount of voxels. This can lead to the file containing unnecessary data *(since the whole range of colors in the palette is often not needed)* which can be especially impactful for transmitting smaller assets *(which are usually < 256 Voxels)*.

## Installation

```bash
npm i svox
```

## Usage

```ts
// CommonJS
const SVOX = require('svox');

// ES modules
import SVOX from 'svox';
```

```ts
// Takes an existing SVOX binary file and parses it to a json containing the data of the file
SVOX.fromSVOX(file)

// Takes an existing VOX binary file and parses it to a json containing the data of the file
SVOX.fromVOX(file)

// Takes an existing SVOXGroup consisting of voxel and palette entries converts it to SVOX binary data
SVOX.toSVOX(svoxGroup)

```

## Changelog

[Changelog (available at github)](./CHANGELOG.md)




