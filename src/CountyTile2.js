import React, { useEffect, useRef } from 'react';
import './CountyTile.css';

const CountyTile = (props) => {
    const hiddenImage = useRef(null);
    const contextRef = useRef(null);
    const canvasRef = useRef(null);
    const originalWidth = useRef(0);
    const originalHeight = useRef(0);
    //console.log(props.name + ' running');f
    const source = '/images/counties_mono/' + props.source + '.png';
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
        let canvas = canvasRef.current;
        let context = contextRef.current;
        let xPos = event.clientX - props.left - props.mapLeft;
        let yPos = event.clientY - props.top - props.mapTop;

        let modelX = xPos / props.width * canvas.width;
        let modelY = yPos / props.height * canvas.height;

        if (!(modelX >= 0 && modelY <= canvas.width)) modelX = 0;
        if (!(modelX >= 0 && modelY <= canvas.height)) modelY = 0;
        if (context) {
            let rc = context.getImageData(modelX, modelY, 1, 1);
            console.log(props.name + ' rc == ' + rc.data[3] + '('
                + modelX + ',' + modelY + ')');
            console.log('xPos ==' + xPos + ', yPos = ' + yPos);
            console.log('canvas.width == ' + canvas.width + ', canvas.height == ' + canvas.height);
        }

    }

    return (
        <div className='county_tile' onMouseMove={onMouseMove}>
            <img src={source}
                className='county_image' alt='Map of County'
                onClick={(event) => {
                    props.handleClick()
                }}
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