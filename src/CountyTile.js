import React, { useRef } from 'react';
import './CountyTile.css';

const CountyTile = (props) => {
    //console.log(props.name + ' running');
    const source = '/images/counties_mono/' + props.source + '.png';
    let opac = 0.4;
    if (props.highlighted) {
        opac = 1.0;
    } else if (props.backgrounded) {
        opac = 0.2;
    }

    return (
        <div className='county_tile' >
            <img src={source}
                className='county_image' alt='Map of County'
                onClick={(event) => {
                    props.handleClick()
                }
                }
                onTouchEnd={props.handleClick}
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
                 style={{position: 'relative',
                        color: 'white',
                        fontSize: '12px',
                        opacity: 0.0}}>
                {props.name}
            </div>
        </div>
    );
}

export default CountyTile;