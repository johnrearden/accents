import React, {useState, useEffect, useRef } from 'react';
import { county_red_codes } from './data/county_red_codes';
import { county_data } from './data/county_data';
import CountySegment from './CountySegment.js';
import { IRELAND_MAP_BASE_WIDTH } from './data/constants';
import { IRELAND_MAP_BASE_RATIO } from './data/constants';
import './Megamap.css';

function Megamap() {
    const [currentCounty, setCurrentCounty] = useState('cork');
    const [mapRect, setMapRect] = useState({left: 0, top: 0, width: 0, height: 0});
    const componentReference = useRef(null);
    const mapReference = useRef(null);
    const canvasRef = useRef(null);
    const hiddenImageRef = useRef(null);
    const mainDivRef = useRef(null);

    useEffect(() => {
        function handleResize() {
            const compRect = componentReference.current.getBoundingClientRect();
            //console.dir(compRect, {depth: null});
            const windowSizeRatio = compRect.width / compRect.height;
            console.log('compRect : w/h = (' + compRect.width + ',' + compRect.height + ')');
            const excessHorizontalSpace = windowSizeRatio > IRELAND_MAP_BASE_RATIO;
            let newWidth = 0, newHeight = 0;
            if (excessHorizontalSpace) {
                newWidth = compRect.height * IRELAND_MAP_BASE_RATIO;
                newHeight = compRect.height;
                console.log('Excess horizontal space');
            } else {
                newWidth = compRect.width;
                newHeight = compRect.width / IRELAND_MAP_BASE_RATIO;
                console.log('Excess vertical space');
            }
            setMapRect({
                left: compRect.left,
                top: compRect.top,
                width: newWidth,
                height : newHeight
            });
        }

        // Call the resize method each time the window changes size.
        window.addEventListener('resize', handleResize);
        
        // Call the resize method to inform component of correct size after first render is complete.
        window.setTimeout(handleResize, 200);

        // clean-up
        return ()=> window.removeEventListener('resize', handleResize);

    }, []);

    const onMouseMove = (event) => {
        let canvas = canvasRef.current;
        let modelContext = canvas.getContext('2d');
        let xPos = event.clientX - mapRect.left;
        let yPos = event.clientY - mapRect.top;
        let modelX = xPos / mapRect.width * 400;
        let modelY = yPos / mapRect.height * 498;
        if (!(modelX >= 0 && modelX <= 400)) modelX = 0;
        if (!(modelY >= 0 && modelY <= 498)) modelY = 0;
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
    //console.dir(mapRect, {depth: null});
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
            <img src='/images/green_gold.jpeg' 
                 alt='gen_ir2.jpg' 
                 style={{opacity : 0.6, width:'100vw', height:'100vh'}}/>
            <div>
                <img src='/images/counties_monochrome.png'
                    alt='count_mono.png'
                    style={{
                        position: 'absolute',
                        left: mapRect.left,
                        top: mapRect.top, 
                        width: mapRect.width,
                        height: mapRect.height,
                        opacity: 0.5,
                        background : '#ffffff'
                    }} />
            </div>
            <div>
                <img src='/images/counties_monochrome_trans_white.png'
                    alt='mono_white.png'
                    ref={mapReference}
                    style={{
                        position: 'absolute',
                        left: mapRect.left,
                        top: mapRect.top,
                        width: mapRect.width,
                        height: mapRect.height,
                        opacity: 0.0
                    }} />
            </div>
            
            <div id='main_div' 
                className='ireland_map_div' 
                ref={mainDivRef}
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