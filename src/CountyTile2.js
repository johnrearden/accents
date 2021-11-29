import React, { useEffect, useRef } from 'react';
import './CountyTile.css';

const CountyTile = (props) => {
    const hiddenImage = useRef(null);
    const contextRef = useRef(null);
    const canvasRef = useRef(null);
    const originalWidth = useRef(0);
    const originalHeight = useRef(0);
    let source = '/images/counties_mono/' + props.source + '.png';
    if (props.name == 'cork') {
       source = '/images/counties_mono/cork_green_gradient_oil.png';
    }
    let opac = 0.4;
    if (props.highlighted) {
        opac = 1.0;
    } else if (props.backgrounded) {
        opac = 0.2;
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
            console.log('props are null! ... doing snothing' );
            return;
        }
        if (contextRef.current && props.expanded) {
            let pixelData = getPointerPixelData(event);
            console.log('mouse moving on expanded ' + props.name 
                + ', data == ' + pixelData);
            if (pixelData == 255) {
                
            } 
        }
    }

    const onClick = (event) => {
        if (props.expanded) {
            let pixelData = getPointerPixelData(event);
            console.log('clicked - data == ' + pixelData);
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
                    position: 'relative',
                    color: 'white',
                    fontSize: '12px',
                    opacity: 0.0
                }}>
                {props.name}
            </div>
            <div style={{ display: 'none' }}>
                <img ref={hiddenImage} src={source} onLoad={onImageLoad} />
            </div>
        </div>
    );
}

export default CountyTile;