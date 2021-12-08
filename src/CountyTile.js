import zIndex from '@material-ui/core/styles/zIndex';
import React, { useEffect, useRef } from 'react';
import './CountyTile.css';
import AccentSelector from './AccentSelector.js';
import { accentLocations } from './data/accent_locations.js'
import { county_data } from './data/county_data.js'
import { calculateXPos, calculateYPos } from './utilities/PositionTranslator';

const CountyTile = (props) => {
    
    const onClick = (event) => {
        props.handleClick();
    }

    const onCloseButtonClicked = (event) => {
        props.onFocusLost();
    }

    const onAccentSelected = (loc, url) => {
        console.log('An accent location (' + loc + ') was clicked - url == ' + url);
        props.playAudioClip(url);
    }

    let source = '/images/counties_mono/' + props.name + '.png';
    let coords = county_data.get(props.name);
    let top = coords.top * props.sizeRatio;
    let left = coords.left * props.sizeRatio;
    let width = coords.width * props.sizeRatio;
    let height = coords.height * props.sizeRatio;
    let textSize = (Math.round(props.mapRect.width * .05)).toString() + 'px';
    let ratio = 1.0;
    if (props.expanded) {
        let expandedWidth = props.mapRect.width * 1.0;
        if (expandedWidth > width * 4) {
            expandedWidth = width * 4;
        }
        ratio = expandedWidth / width;
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
                    zIndex: props.highlighted ? 3 : 1,
                }} />
            <div className='county_label'
                style={{
                    position: 'absolute',
                    top: top + height,
                    left: left + width / 4,
                    color: 'white',
                    fontSize: textSize,
                    opacity: props.highlighted && !props.expanded? 1.0 : 0.0,
                    zIndex: 4,
                    pointerEvents: 'none'
                }}>
                {props.name}
            </div>
            <div className='location_buttons'>
                <AccentSelector name={props.name}
                                expandedRatio={ratio}
                                sizeRatio={props.sizeRatio}
                                left={left}
                                top={top}
                                absLeft={coords.left}
                                absTop={coords.top}
                                width={width}
                                height={height}
                                expanded={props.expanded}
                                onAccentSelected={onAccentSelected}
                />
            </div>
            <div>
                <button className='close_button'
                        style={{
                            opacity: props.expanded ? 1.0 : 0.0,
                            border: 'none',
                            fontSize: textSize,
                            left: left + width - width / 5,
                            top: top + height,
                            zIndex: 4}}
                        onClick={onCloseButtonClicked}>
                            close
                </button>
            </div>
        </div>
    );
}

export default CountyTile;