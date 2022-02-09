import React, { useEffect, useRef, useState } from 'react';
import { accentLocations } from './data/accent_locations.js';
import { calculateXPos, calculateYPos } from './utilities/PositionTranslator';
import './css/AccentSelector.css';

const FONT_PROPORTION = '90%';

const AccentSelector = (props) => {


    let sizeMap = useRef(new Map());
    const [locationList, setLocationList] = useState([]);

    // Populate location list and measure text size only after 1st render
    useEffect(() => {
        let list = [];
        if (accentLocations.get(props.name)) {
            let tempCanvas = document.createElement('canvas');
            let context = tempCanvas.getContext('2d');
            let font = FONT_PROPORTION;
            list = accentLocations.get(props.name);
            list.forEach((location) => {
                let metrics = context.measureText(location.name);
                let width = Math.ceil(metrics.width);
                let height = Math.ceil(metrics.actualBoundingBoxAscent
                    + metrics.actualBoundingBoxDescent);
                sizeMap.current.set(location.name, {
                    width: width,
                    height: height
                });
            });
        }
        setLocationList(list);
    }, []);

    locationList.forEach((loc) => {
        let xLoc = loc.adjustedX;
        if (xLoc === -1) {
            xLoc = calculateXPos(loc.long);
            loc.adjustedX = xLoc - props.absLeft;
        }
        let yLoc = loc.adjustedY;
        if (yLoc === -1) {
            yLoc = calculateYPos(loc.lat);
            loc.adjustedY = yLoc - props.absTop;
        }
    });

    const onAccentClicked = (loc, url) => {
        if (props.expanded) {
            props.onAccentSelected(loc, url);
        } 
    };

    const locationButtons = locationList.map((location) => {
        let expansionRatio = props.expanded ? props.expandedRatio : 1.0;
        let xPos = props.left + location.adjustedX * props.sizeRatio * expansionRatio;
        let yPos = props.top + location.adjustedY * props.sizeRatio * expansionRatio;
        let buttonSize = Math.round(props.height * expansionRatio / 200);
        let url = location.clip_url;
        let size = sizeMap.current.get(location.name);
        let textWidth = size ? size.width : 0;
        let textHeight = size ? size.height : 0;
        let textLeft = xPos - textWidth / 2;
        let textTop = yPos + buttonSize;
        return (
            <React.Fragment key={location.name}>
                <div className='accent_location'
                    onClick={(event) => {
                        onAccentClicked(location.name, url)
                    }}>
                    <div className='accent_button'
                        style={{
                            transitionProperty: 'opacity, left, top, width, height',
                            transitionDuration: '0.3s',
                            transitionTimingFunction: 'ease-in-out',
                            position: 'absolute',
                            width: buttonSize + 'px',
                            height: buttonSize + 'px',
                            left: xPos - buttonSize / 2,
                            top: yPos - buttonSize / 2,
                            borderRadius: '50%',
                            zIndex: 11,
                            opacity: props.expanded ? 1.0 : 0.0,
                        }}>
                    </div>
                    <div style={{
                        transitionProperty: 'opacity, left, top, width, height',
                        transitionDuration: '0.3s',
                        transitionTimingFunction: 'ease-in-out',
                        position: 'absolute',
                        fontSize: FONT_PROPORTION,
                        left: textLeft,
                        top: textTop,
                        zIndex: 11,
                        opacity: props.expanded ? 1.0 : 0.0,
                    }}>
                        {location.name}
                    </div>
                </div>

            </React.Fragment>
        )
    });

    if (locationButtons.length > 0) {
        return locationButtons;
    } else {
        return (
            <div className='no_clips_message'
                style={{
                    opacity: props.expanded ? 1.0 : 0.0
                }}>
                No clips available yet .... sorry!
            </div>)
    }


}

export default AccentSelector;