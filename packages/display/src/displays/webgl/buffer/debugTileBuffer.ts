/*
 * Copyright (C) 2019 HERE Europe B.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 * License-Filename: LICENSE
 */

import {GeometryBuffer} from './GeometryBuffer';
import {GeometryGroup} from './GeometryGroup';
import {normalize} from './addLineString';
import {createTextData} from './createText';
import {GlyphTexture} from '../GlyphTexture';

const TILE_SIZE = 512;
// const TILE_SIZE = 256;


const createTileBuffer = (tileSize: 256 | 512) => {
    // 0 ------- 1
    // |      /  |
    // |    /    |
    // |  /      |
    // 3 ------- 2

    let gridTileBuffer = new GeometryBuffer();
    gridTileBuffer.addAttribute('a_position', {
        data: new Int16Array([
            0, 0,
            tileSize, 0,
            tileSize, tileSize,
            0, tileSize
        ]),
        size: 2
    });
    let geoGroup = new GeometryGroup([
        0, 1, 3,
        3, 1, 2
    ], 'Polygon');
    geoGroup.addUniform('u_zIndex', 0.0);
    geoGroup.addUniform('u_fill', [1.0, 1.0, 1.0, 1.0]);
    geoGroup.scissor = false;
    geoGroup.depth = false;
    geoGroup.alpha = false;
    gridTileBuffer.addGroup(geoGroup);
    return gridTileBuffer;
};

export {createTileBuffer};

const createGridTileBuffer = (tileSize: 256 | 512, color: number[] = [1.0, 0.0, 0.0, 1.0], strokeWidth: number = 2) => {
    let vertex = new Int16Array([
        0, 0, 0, 0, /* ---> */ tileSize, 0, tileSize, 0,
        tileSize, 0, tileSize, 0, /* ---> */ tileSize, tileSize, tileSize, tileSize,
        tileSize, tileSize, tileSize, tileSize, /* ---> */ 0, tileSize, 0, tileSize,
        0, tileSize, 0, tileSize, /* ---> */ 0, 0, 0, 0
    ]);
    let vLength = 5;
    let normal = [];
    let vIndex = [];

    for (let c = 0, stop = (vLength - 1) * 4; c < stop; c += 4) {
        let i1 = c * 2;
        let x1 = vertex[i1];
        let y1 = vertex[i1 + 1];
        let i2 = i1 + 4;
        let x2 = vertex[i2];
        let y2 = vertex[i2 + 1];
        let vecAB = normalize([x2 - x1, y2 - y1]);
        normal.push(
            vecAB[1], -vecAB[0], // p11
            -vecAB[1], vecAB[0], // p12
            vecAB[1], -vecAB[0], // p12
            -vecAB[1], vecAB[0] // p22
        );
        vIndex.push(
            c, c + 2, c + 1,
            c + 1, c + 2, c + 3,
        );
    }

    let gridTileBuffer = new GeometryBuffer();
    gridTileBuffer.addAttribute('a_position', {
        data: vertex,
        size: 2
    });
    let geoGroup = new GeometryGroup(vIndex, 'Line');
    geoGroup.addUniform('u_zIndex', 0.0);
    geoGroup.addAttribute('a_normal', {
        data: new Int8Array(normal),
        normalized: true,
        size: 2
    });
    geoGroup.addUniform('u_fill', color);
    geoGroup.addUniform('u_strokeWidth', strokeWidth);

    geoGroup.scissor = false;
    geoGroup.depth = false;

    gridTileBuffer.addGroup(geoGroup);


    return gridTileBuffer;
};

export {createGridTileBuffer};


let glyphs;

const createGridTextBuffer = (quadkey: string, gl: WebGLRenderingContext, font: {}) => {
    if (!glyphs) {
        glyphs = new GlyphTexture(gl, font, 64);
        glyphs.addChars('L0123456789');
        glyphs.sync();
    }

    const vertices = createTextData(quadkey + ' L' + quadkey.length, glyphs.atlas);
    const position = vertices.position;

    let textBuffer = new GeometryBuffer();
    // textBuffer.addAttribute('a_position', {
    //     data: new Int8Array(position.length),
    //     size: 2,
    //     stride: 0
    // });
    textBuffer.addAttribute('a_point', {
        data: position,
        size: 2,
        stride: 0
    });
    textBuffer.addAttribute('a_texcoord', {
        data: vertices.texcoord,
        size: 2,
        stride: 0
    });

    let group = new GeometryGroup({
        first: 0,
        count: vertices.numVertices
    }, 'Text');

    group.depth = false;
    group.scissor = false;
    group.texture = glyphs;
    group.addUniform('u_texture', 0);
    group.addUniform('u_atlasScale', [1 / glyphs.width, 1 / glyphs.height]);
    group.addUniform('u_opacity', 1.0);


    textBuffer.addGroup(group);
    return textBuffer;
};

export {createGridTextBuffer};