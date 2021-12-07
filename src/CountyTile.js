import zIndex from '@material-ui/core/styles/zIndex';
import React, { useEffect, useRef } from 'react';
import './CountyTile.css';
import { accentLocations } from './data/accent_locations.js'
import { county_data } from './data/county_data.js'
import { calculateXPos, calculateYPos } from './utilities/PositionTranslator';

const CountyTile = (props) => {
    
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



    

    const onClick = (event) => {
        props.handleClick();
    }

    const locationButtons = locationList.map((location) => {
        let expansionRatio = props.expanded ? props.expandedRatio : 1.0;
        let xPos = props.left + location.adjustedX * props.sizeRatio * expansionRatio;
        let yPos = props.top + location.adjustedY * props.sizeRatio * expansionRatio;
        let textSize = Math.round(props.height * expansionRatio / 75);
        let buttonSize = Math.round(props.height * expansionRatio / 150);
        return (
            <React.Fragment>
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
                        //color: 'white',
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

    let source = '/images/counties_mono/' + props.name + '.png';
    let coords = county_data.get(props.name);
    let top = coords.top * props.sizeRatio;
    let left = coords.left * props.sizeRatio;
    let width = coords.width * props.sizeRatio;
    let height = coords.height * props.sizeRatio;
    if (props.expanded) {
        console.log(props.name + ' is expanded');
        let expandedWidth = props.mapRect.width * 1.0;
        if (expandedWidth > width * 4) {
            expandedWidth = width * 4;
        }
        let ratio = expandedWidth / (width);
        let expandedHeight = height * ratio;
        let expandedLeft = (props.mapRect.width / 2) - (expandedWidth / 2);
        let expandedTop = (props.mapRect.height / 2) - (expandedHeight / 2);
        top = expandedTop;
        left = expandedLeft;
        width = expandedWidth;
        height = expandedHeight;
    }
    let opac = 1.0;
    if (props.highlighted && !props.expanded) {
        opac = 0.8;
    } else if (props.backgrounded) {
        opac = 0.2; 
    } 

    return (
        <div className='county_tile'>
            <img src={source}
                className='county_image' alt='Map of County'
                onClick={(event) => {
                    onClick(event);
                }}
                onTouchEnd={(event) => {
                    onClick(event);
                }}
                style={{
                    position: 'absolute',
                    top: top,
                    left: left,
                    width: width,
                    height: height,
                    opacity: opac,
                    zIndex: props.highlighted ? 10 : 5,
                }} />
            <div className='county_label'
                style={{
                    position: 'absolute',
                    top: top + height / 2,
                    left: left + width / 4,
                    color: 'white',
                    fontSize: '12px',
                    opacity: 0.0,
                    zIndex: 6
                }}>
                {props.name}
            </div>
            <div className='location_buttons'>
                {locationButtons}
            </div>
        </div>
    );
}

export default CountyTile;