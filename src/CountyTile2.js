import zIndex from '@material-ui/core/styles/zIndex';
import React, { useEffect, useRef } from 'react';
import './CountyTile.css';
import { accentLocations } from './data/accent_locations.js'
import { county_data } from './data/county_data.js'
import { calculateXPos, calculateYPos } from './utilities/PositionTranslator';

const CountyTile = (props) => {
    const hiddenImage = useRef(null);
    const contextRef = useRef(null);
    const canvasRef = useRef(null);
    const originalWidth = useRef(0);
    const originalHeight = useRef(0);
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

    let source = '/images/counties_mono/' + props.source + '.png';
    let opac = 1.0;
    if (props.highlighted && !props.expanded) {
        opac = 0.8;
    } else if (props.backgrounded) {
        opac = 0.1;
    }

    const onImageLoad = () => {
        canvasRef.current = document.createElement('canvas');
        canvasRef.current.width = props.width;
        canvasRef.current.height = props.height;
        contextRef.current = canvasRef.current.getContext('2d');
        let image = hiddenImage.current;
        contextRef.current.drawImage(image, 0, 0, props.width, props.height);
        originalWidth.current = props.width;
        originalHeight.current = props.height;
        let rc = contextRef.current.getImageData(props.width / 2, props.height / 2, 1, 1);
        //console.log(rc.data);
    }

    const onMouseMove = (event) => {
        if (props == null) {
            console.log('props are null! ... doing snothing');
            return;
        }
        if (contextRef.current && props.expanded) {
            let pixelData = getPointerPixelData(event);

            if (pixelData == 255) {

            }
        }
    }

    const onClick = (event) => {
        if (props.expanded) {
            let pixelData = getPointerPixelData(event);
            if (pixelData != 255) {
                props.onFocusLost();
            }
        } else {
            props.handleClick();
        }
    }

    const getPointerPixelData = (event) => {
        let canvas = canvasRef.current;
        let context = contextRef.current;
        let xPos = event.clientX - props.left - props.mapLeft;
        let yPos = event.clientY - props.top - props.mapTop;

        let modelX = xPos / props.width * canvas.width;
        let modelY = yPos / props.height * canvas.height;

        if (!(modelX >= 0 && modelY <= canvas.width)) modelX = 0;
        if (!(modelX >= 0 && modelY <= canvas.height)) modelY = 0;

        let rc = context.getImageData(modelX, modelY, 1, 1);
        return rc.data[3];
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

    return (
        <div className='county_tile' onMouseMove={onMouseMove}>
            <img src={source}
                className='county_image' alt='Map of County'
                onClick={(event) => {
                    onClick(event);
                }}
                onTouchEnd={(event) => {
                    onClick(event);
                }}
                onMouseMove={(event) => {
                    onMouseMove(event);
                }}
                style={{
                    position: 'absolute',
                    top: props.top,
                    left: props.left,
                    width: props.width,
                    height: props.height,
                    opacity: opac,
                    zIndex: props.highlighted ? 10 : 5,
                }} />
            <div className='county_label'
                style={{
                    position: 'absolute',
                    top: props.top + props.height / 2,
                    left: props.left + props.width / 4,
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
            <div style={{ display: 'none' }}>
                <img ref={hiddenImage} src={source} onLoad={onImageLoad} />
            </div>
        </div>
    );
}

export default CountyTile;