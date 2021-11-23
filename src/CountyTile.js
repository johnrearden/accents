import React, {useRef} from 'react';
import './CountyTile.css';

const CountyTile = (props) => {
    const previousHighlighted = useRef(false);
    console.log(props.name + ' running');
    const source = '/images/counties_mono/' + props.source + '.png';

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
                    opacity: props.highlighted ? 1.0 : 0.0,
                    
                }} />

        </div>
    );
}

export default CountyTile;