import React, { useState, useEffect, useRef } from 'react';
import { county_red_codes } from './data/county_red_codes';
import { coordinates } from './data/coordinates';
import CountyTile from './CountyTile.js';
import { IRELAND_MAP_BASE_WIDTH } from './data/constants';
import { IRELAND_MAP_BASE_RATIO } from './data/constants';
import './Megamap.css';

function Megamap(props) {
    const [currentCounty, setCurrentCounty] = useState(undefined);
    const [selectedCounty, setSelectedCounty] = useState('none');
    const [mapRect, setMapRect] = useState({ left: 0, top: 0, width: 0, height: 0 });
    const componentReference = useRef(null);
    const expandedModeRef = useRef(false);
    const canvasRef = useRef(null);
    const hiddenImageRef = useRef(null);
    const mainDivRef = useRef(null);
    const countyLabelRef = useRef(null);
    const audioRef = useRef(null);
    const [shouldRerender, setShouldRerender] = useState(true);
    const county_data = coordinates;

    useEffect(() => {
        function handleResize() {
            const compRect = componentReference.current.getBoundingClientRect();
            const windowSizeRatio = compRect.width / compRect.height;
            const excessHorizontalSpace = windowSizeRatio > IRELAND_MAP_BASE_RATIO;
            let newWidth = 0, newHeight = 0;
            if (excessHorizontalSpace) {
                newWidth = compRect.height * IRELAND_MAP_BASE_RATIO;
                newHeight = compRect.height;
            } else {
                newWidth = compRect.width;
                newHeight = compRect.width / IRELAND_MAP_BASE_RATIO;
            }
            const midX = compRect.left + compRect.width / 2;
            setMapRect({
                left: midX - newWidth / 2,
                top: compRect.top,
                width: newWidth,
                height: newHeight
            });
        }

        handleResize();

        // Call the resize method each time the window changes size.
        window.addEventListener('resize', handleResize);

        // clean-up
        return () => {
            window.removeEventListener('resize', handleResize);
            //window.removeEventListener('orientationchange', handleResize);
        }
    }, []);

    // Forces a second render.
    useEffect(() => {
        if (shouldRerender) {
            setShouldRerender(false);
        }
    }, [shouldRerender]);

    const handleClick = (county) => {
        console.log(currentCounty + ' clicked (expandedMode == '
            + expandedModeRef.current + ')');
        if (expandedModeRef.current == false) {
            audioRef.current.currentTime = 0;
            //audioRef.current.play();
            if (currentCounty !== undefined) {
                setSelectedCounty(currentCounty);
                expandedModeRef.current = true;
            } else {
                setSelectedCounty('none');
            }
        }
    }

    const expandedCountyLostFocus = () => {
        console.log('expanded county lost focus');
        expandedModeRef.current = false;
        setSelectedCounty('none');
    }

    const onMouseMove = (event) => {
        if (expandedModeRef.current == true) {
            return;
        }
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

    const countyComponents = county_data.map((county) => {
        let highlighted = currentCounty === county.name ? true : false;
        let selected = selectedCounty === county.name ? true : false;
        let backgrounded = false;
        if (selectedCounty != 'none' && !selected) {
            backgrounded = true;
        }
        return (
            <React.Fragment key={county.name + '_key'}>
                <CountyTile
                    name={county.name}
                    sizeRatio={sizeRatio}
                    mapRect={mapRect}
                    highlighted={highlighted}
                    backgrounded={backgrounded}
                    expanded={selected}
                    handleClick={() => handleClick()}
                    onFocusLost={() => expandedCountyLostFocus()}
                />
            </React.Fragment>
        );
    });

    return (
        <div className='megamap' ref={componentReference} onMouseMove={onMouseMove}>
            <div>
                {/* <img src='/images/ireland_maps/counties_monochrome.png'
                    alt='count_mono.png'
                    style={{
                        position: 'absolute',
                        left: mapRect.left,
                        top: mapRect.top,
                        width: mapRect.width,
                        height: mapRect.height,
                        // backgroundColor: '#444444cc',
                        opacity: 0.0,
                    }} /> */}
            </div>
            <div id='main_div'
                className='ireland_map_div'
                ref={mainDivRef}
                style={{
                    position: 'absolute',
                    left: mapRect.left,
                    top: mapRect.top,
                    width: mapRect.width,
                    height: mapRect.height
                }}>
                {countyComponents}
            </div>
            <div id='county_label'
                ref={countyLabelRef}
                style={{
                    position: 'absolute',
                    left: mapRect.left + 10,
                    top: mapRect.top + 10,
                    //  color: '#33727b',
                    color: 'silver',
                }}>
                <h2>
                    {currentCounty === undefined ?
                        'Pick county' :
                        currentCounty.charAt(0).toUpperCase() + currentCounty.slice(1)}
                </h2>
            </div>
            <div style={{

            }}>
                <audio id='audio_player' ref={audioRef}>
                    <source src='/audio/test_file2.mp3' type='audio/mp3' />
                </audio>
            </div>
            <div style={{ display: 'none' }}>
                <canvas ref={canvasRef} width='400' height='498' />
                <img src='/images/ireland_maps/counties_model.png'
                    ref={hiddenImageRef}
                    alt='alt'
                    onLoad={onModelImageLoad} />
            </div>
        </div>

    )
}


export default Megamap;