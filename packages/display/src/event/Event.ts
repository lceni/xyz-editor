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

import {features} from '@here/xyz-maps-core';

let UNDEF;

/**
 *  Event
 *
 *  @class
 *  @interface
 *  @public
 *  @name mapedit.API.Event
 */
class MapEvent {
    nativeEvent: Event;
    type: string;
    timeStamp: DOMTimeStamp;
    detail: any;
    data: any;
    target: features.Feature;
    button: number;
    mapX: number;
    mapY: number;
    /**
     * The native MouseEvent generated by the browser. This property will be null if the
     * Event was not directly generated from a native Touch- or Mouse-event.
     *
     * @public
     * @expose
     * @type Event
     *
     * @name mapedit.API.Event.prototype.nativeEvent
     */
    /**
     *  The map feature this event relates to.
     *
     *  @public
     *  @expose
     *  @type mapedit.map.features.simplified.Object
     *
     *  @name mapedit.API.Event.prototype.target
     */
    /**
     *  Gives the x coordinate relative to the map element in pixels
     *
     *  @public
     *  @expose
     *  @type number
     *
     *  @name mapedit.API.Event.prototype.mapX
     */
    /**
     *  Gives the y coordinate relative to the map element in pixels
     *
     *  @public
     *  @expose
     *  @type number
     *
     *  @name mapedit.API.Event.prototype.mapY
     */
    /**
     *  The type of mouse event. This will be the same as the listener it maps to
     *
     *  @public
     *  @expose
     *  @type number
     *
     *  @name mapedit.API.Event.prototype.type
     */
    /**
     *  This property holds the numeric id of a mouse button that has changed state, because it was pressed or released.
     *
     *  @public
     *  @expose
     *  @type number
     *
     *  @name mapedit.API.Event.prototype.button
     */
    /**
     *  This property specifies the time at which the event was created in milliseconds relative to 1970-01-01T00:00:00Z.
     *
     *  @public
     *  @expose
     *  @type number
     *
     *  @name mapedit.API.Event.prototype.timeStamp
     */
    constructor(type, detail) {
        this.type = type;
        this.timeStamp = Date.now();

        if (detail != UNDEF) {
            this.data =
                this.detail = detail;
        }
    }

    /** @expose */
    stopPropagation() {
        const ev = this.nativeEvent;
        // make sure move are not received by map pan handler in any case..
        if (ev.type == 'mousemove' || ev.type == 'touchmove') {
            ev.stopImmediatePropagation();
            // disable's (ios)browser's  "page-scroll"/"pinch to zoom"...
            return ev.preventDefault();
        }
        // up/down events need to pass..
        // return ev.stopPropagation()
    };

    /** @expose */
    toString() {
        return 'MapEvent ' + this.type;
    };
}


export {MapEvent};
