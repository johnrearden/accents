import React from 'react';
import { accentLocations } from './data/accent_locations.js';
import { calculateXPos, calculateYPos } from './utilities/PositionTranslator';


const AccentSelector = (props) => {
    let locationList = [];
    if (accentLocations.get(props.name)) {
        locationList = accentLocations.get(props.name);
    }
    if (props.name == 'cork') {
        locationList.forEach((loc) => {
            let xLoc = loc.adjustedX;
            if (xLoc = -1) {
                xLoc = calculateXPos(loc.long);
                loc.adjustedX = xLoc - props.absLeft;
            }
            let yLoc = loc.adjustedY;
            if (yLoc = -1) {
                yLoc = calculateYPos(loc.lat);
                loc.adjustedY = yLoc - props.absTop;
            }
        });
    }

    const locationButtons = locationList.map((location) => {
        let expansionRatio = props.expanded ? props.expandedRatio : 1.0;
        let xPos = props.left + location.adjustedX * props.sizeRatio * expansionRatio;
        let yPos = props.top + location.adjustedY * props.sizeRatio * expansionRatio;
        let textSize = Math.round(props.height * expansionRatio / 75);
        let buttonSize = Math.round(props.height * expansionRatio / 150);
        return (
            <React.Fragment key={location.name}>
                <div>
                    <div style={{
                        transitionProperty: 'opacity, left, top, width, height',
                        transitionDuration: '0.3s',
                        transitionTimingFunction: 'ease-in-out',
                        position: 'absolute',
                        width: buttonSize + 'px',
                        height: buttonSize + 'px',
                        left: xPos - 3,
                        top: yPos - 3,
                        borderRadius: '50%',
                        background: 'white',
                        zIndex: 11,
                        opacity: props.expanded ? 1.0 : 0.0,
                    }}>
                    </div>
                    <div style={{
                        transitionProperty: 'opacity, left, top, width, height',
                        transitionDuration: '0.3s',
                        transitionTimingFunction: 'ease-in-out',
                        position: 'absolute',
                        fontSize: textSize + 'px',
                        left: xPos + 10,
                        top: yPos - textSize / 2,
                        zIndex: 11,
                        opacity: props.expanded ? 1.0 : 0.0,
                    }}>
                        {location.name}
                    </div>
                </div>

            </React.Fragment>
        )
    });

    return locationButtons;
}

export default AccentSelector;