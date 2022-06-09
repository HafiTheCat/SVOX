# File Structure

## General structure
|Name|Bytes|Description|
|-|-|-|
|header|8|Contains meta information about the content|
|palette chunk|5 x paletteAmount|Contains the color entries|
|voxel chunk|4 x voxelAmount|Contains the voxel entries|

## Header structure
|Name|Bytes|Description|
|-|-|-|
|magic|5|Identifier that this file is a SVOX file e.g. "SVOX "|
|version|1|Version of the file-structure used|
|paletteAmount|1|Amount of color entries in the palette chunk|
|voxelAmount|1|Amount of voxel entries in the voxel chunk|

## Palette chunk structure
|Name|Bytes|Description|
|-|-|-|
|id|1|Color Identifier that gets referenced in the voxel entry|
|red|1|red value of the color|
|green|1|green value of the color|
|blue|1|blue value of the color|
|alpha|1|alpha value of the color|

## Voxel chunk structure
|Name|Bytes|Description|
|-|-|-|
|X|1|x position of the voxel|
|Y|1|y position of the voxel|
|Z|1|z position of the voxel|
|colorRef|1|Reference to the color in the palette chunk|