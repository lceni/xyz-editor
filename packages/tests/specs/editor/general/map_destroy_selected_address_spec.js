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
import {editorTests, displayTests, testUtils, prepare} from 'hereTest';
import {Map} from '@here/xyz-maps-core';
import {Editor} from '@here/xyz-maps-editor';
import chai from 'chai/chai';
import dataset from './map_destroy_selected_address_spec.json';

describe('destroy editor when point address is selected', function() {
    const expect = chai.expect;

    let editor;
    let display;
    let preparedData;
    let address;

    before(async function() {
        preparedData = await prepare(dataset);
        display = new Map(document.getElementById('map'), {
            center: {longitude: 77.134776956, latitude: 18.038907646},
            zoomLevel: 18,
            layers: preparedData.getLayers()
        });
        editor = new Editor(display, {
            layers: preparedData.getLayers()
        });

        await editorTests.waitForEditorReady(editor);

        address = preparedData.getFeature('paLayer', -47998);
    });

    after(async function() {
        if (editor.destroy) {
            editor.destroy();
        }
        display.destroy();

        await preparedData.clear();
    });

    xit('validate destroy editor is working', async function() {
        address.select();

        editor.destroy();
    });
});
