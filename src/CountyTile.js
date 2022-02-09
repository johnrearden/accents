import React from 'react';
import './css/CountyTile.css';
import AccentSelector from './AccentSelector.js';
import { county_data } from './data/county_data.js'
import { COUNTY_INFO } from './data/constants';

const CountyTile = (props) => {

    //console.log('CountyTile for ' + props.name + ' rendered');

    const onClick = (event) => {
        //console.log(props.name + ' clicked');
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
    let textCenterX = coords.midX * props.sizeRatio;
    let textCenterY = coords.midY * props.sizeRatio;
    let textSize = (Math.round(props.mapRect.width * .05)).toString() + 'px';
    let ratio = 1.0;
    let textLeft = left + textCenterX - props.countyNameTextSize.width / 2;
    let textTop = top + textCenterY - props.countyNameTextSize.height / 2;
    let smallLabelText = props.name;
    let extraText = '\n' + COUNTY_INFO.get(props.name).irishName
        + '\n\'' + COUNTY_INFO.get(props.name).gaaName + '\'';
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
        textLeft = 10;
        textTop = 10;
        smallLabelText = props.name.charAt(0).toUpperCase() + props.name.slice(1);
    }

    let opac = 1.0;
    if (props.highlighted && !props.expanded) {
        opac = 0.8;
    } else if (props.backgrounded) {
        opac = 0.2;
    }
    let zIndex = props.highlighted ? 3 : 2;
    let showSmallLabels = props.expanded || (!props.backgrounded && props.showLabel);
    let showBigLabel = !showSmallLabels && props.highlighted && !props.expanded;
    let smallLabelFontSize = !props.expanded ?
        props.countyNameFontSize + 'px' : '20px';
    let labelOpac = showSmallLabels ? 1.0 : 0.0;

    let accentComponent;
    if (props.expanded) {
        accentComponent =
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
    } 

    return (
        <div className='county_tile'>
            <img src={source}
                className='county_image'
                onClick={(event) => {
                    onClick(event);
                }}
                style={{
                    position: 'absolute',
                    top: top,
                    left: left,
                    width: width,
                    height: height,
                    opacity: opac,
                    zIndex: zIndex,
                }} />
            <div className='county_label'
                style={{
                    position: 'absolute',
                    top: top + height,
                    left: left + width / 4,
                    color: 'white',
                    fontSize: textSize,
                    opacity: showBigLabel ? 1.0 : 0.0,
                    zIndex: 4,
                    pointerEvents: 'none'
                }}>
                {props.name}
            </div>
            <div className='small_label'
                style={{
                    position: 'absolute',
                    color: props.expanded ? 'white' : 'white',
                    top: textTop,
                    left: textLeft,
                    fontSize: smallLabelFontSize,
                    zIndex: 10,
                    opacity: labelOpac,
                    pointerEvents: 'none',
                }}>
                {smallLabelText}
                <span style={{
                    fontSize: '60%',
                    fontColor: '#888888',
                    fontStyle: 'italic',
                    lineHeight: '100%',
                    opacity: props.expanded ? 1.0 : 0.0,
                }}>
                    {extraText}
                </span>
            </div>

            <div className='location_buttons'>
                {accentComponent}
            </div>
            <div>
                <button className='close_button'
                    style={{
                        opacity: props.expanded ? 1.0 : 0.0,
                        fontSize: textSize,
                        position: 'absolute',
                        right: '20px',
                        top: '20px',
                        zIndex: props.expanded ? 4 : 1
                    }}
                    onClick={onCloseButtonClicked}>
                    x
                </button>
            </div>
        </div>
    );
}

export default CountyTile;