import React, { useLayoutEffect, useState, useRef } from 'react';
import { county_red_codes } from './data/county_red_codes';
import { county_data } from './data/county_data';
import CountySegment from './CountySegment.js';
import { IRELAND_MAP_BASE_WIDTH } from './data/constants';
import { IRELAND_MAP_BASE_HEIGHT } from './data/constants';
import './Megamap.css';

function Megamap() {
    const [currentCounty, setCurrentCounty] = useState('cork');
    const [mapRect, setMapRect] = useState({ width: 400, height: 498  });
    const componentReference = useRef(null);
    const mapReference = useRef(null);
    const canvasRef = useRef(null);
    const hiddenImageRef = useRef(null);

    useLayoutEffect(() => {
        if (componentReference.current) {
            setMapRect(mapReference.current.getBoundingClientRect());
        }
    }, []);

    const onMouseMove = (event) => {
        let canvas = canvasRef.current;
        let modelContext = canvas.getContext('2d');
        let xPos = event.clientX - mapRect.left;
        let yPos = event.clientY - mapRect.top;
        let modelX = xPos / mapRect.width * 400;
        let modelY = yPos / mapRect.height * 498;
        let rc = -1;
        if (modelContext) {
            rc = modelContext.getImageData(modelX, modelY, 1, 1);
        }
        setCurrentCounty(county_red_codes.get(rc.data[0]));
    }

    const onModelImageLoad = () => {
        let canvas = canvasRef.current;
        let modelContext = canvas.getContext('2d');
        let modelImage = hiddenImageRef.current;
        modelContext.drawImage(
            modelImage,
            0,
            0,
            400,
            498
        );
    }

    let sizeRatio = mapRect.width / IRELAND_MAP_BASE_WIDTH;
    const countyComponents = county_data.map((county) => {
        var highlighted = currentCounty === county.name ? true : false;
        return (
            <React.Fragment key={county.name + '_key'}>
                <CountySegment
                    name={county.name}
                    source={county.name + '_mono'}
                    top={mapRect.top + (county.top * sizeRatio)}
                    left={mapRect.left + (county.left * sizeRatio)}
                    width={county.width * sizeRatio}
                    height={county.height * sizeRatio}
                    highlighted={highlighted}
                    handleClick={() => this.handleClick}
                />

            </React.Fragment>
        );
    });

    return (
        <div className='megamap' ref={componentReference} onMouseMove={onMouseMove}>
            <img src='/images/generic_ireland2.jpg' alt='missing' style={{opacity : 0.7, width:'50%', height:'100%',objectFit : 'fill'}}/>
            <div>
                <img src='/images/counties_fade_mask.png'
                    alt='missing'
                    style={{
                        position: 'absolute',
                        left: 100,
                        top: 100, 
                        width: mapRect.width,
                        height: mapRect.height,
                        opacity: 0.3
                    }} />
            </div>
            <div>
                <img src='/images/counties_monochrome_trans_white.png'
                    
                    alt='missing'
                    ref={mapReference}
                    
                    style={{
                        position: 'absolute',
                        left: 100,
                        top: 100,
                        width: mapRect.width,
                        height: mapRect.height,
                    }} />
            </div>
            
            <div id='main_div' className='ireland_map_div' 
                style = {{
                    position : 'absolute',
                    left : 0, 
                    top : 0,
                    width : mapRect.width,
                    height : mapRect.height
                }}>
                {countyComponents}
            </div>
            <div style={{ display: 'none' }}>
                <canvas ref={canvasRef} width='400' height='498' />
                <img src='/images/counties_model.png'
                    ref={hiddenImageRef}
                    alt='alt'
                    onLoad={onModelImageLoad} />
            </div>
        </div>

    )
}

export default Megamap;