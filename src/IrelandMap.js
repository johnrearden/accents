import React from 'react';
import { county_data } from './data/county_data';
import { county_red_codes } from './data/county_red_codes';
import './IrelandMap.css';
import CountySegment from './CountySegment.js';
import { IRELAND_MAP_BASE_WIDTH } from './data/constants';
import { IRELAND_MAP_BASE_HEIGHT } from './data/constants';
import { IRELAND_MAP_BASE_RATIO } from './data/constants';

export default class IrelandMap extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.onModelImageLoad = this.onModelImageLoad.bind(this);
        this.state = {
            mouseOver: false,
            highlightedCounty: props.selectedCounty,
            sizeRatio: 0,
            offsetX: 0,
            offsetY: 0,
        }
        this.modelReady = false;
        this.boundingRect = null;
    }

    refCallback = (element) => {
        if (element) {
            console.log('element.getBoundingClientrect() returns ' + JSON.stringify(element.getBoundingClientRect()));
        }
    }

    componentDidMount = () => {
        let rect = document.getElementById('container').getBoundingClientRect();
        let componentRatio = rect.width / rect.height;
        let correctWidth = rect.right - rect.left;

        if (componentRatio >= 1) { // extra space is on the x axis
            let yOffset = 0;
            let ratio = rect.height / IRELAND_MAP_BASE_HEIGHT;
            let widthUsed = IRELAND_MAP_BASE_WIDTH * ratio;
            let xOffset = (rect.width - widthUsed) / 2;
            this.setState({
                sizeRatio: ratio,
                offsetX: xOffset,
                offsetY: yOffset,
            });
            console.log('IrelandMap width = ' + rect.width + ', correctWidth = ' + correctWidth + ', height = '
                + rect.height + ', compRatio = ' + componentRatio
                + ', offsetX = ' + xOffset + ', offsetY = ' + yOffset);
        } else {
            let xOffset = 0;
            let ratio = rect.width / IRELAND_MAP_BASE_WIDTH;
            let heightUsed = IRELAND_MAP_BASE_HEIGHT * ratio;
            let yOffset = (rect.height - heightUsed) / 2;
            this.setState({
                sizeRatio: ratio,
                offsetX: xOffset,
                offsetY: yOffset,
            });
            console.log('IrelandMap width = ' + rect.width + ', correctWidth = ' + correctWidth + ', height = '
                + rect.height + ', compRatio = ' + componentRatio
                + ', offsetX = ' + xOffset + ', offsetY = ' + yOffset);
        }
    }

    onModelImageLoad = () => {
        const img = this.refs.counties_model;
        const canvas = this.refs.hidden_canvas;
        this.context = canvas.getContext('2d');
        this.context.drawImage(img, 0, 0, 400, 498);
        this.modelReady = true;
    }

    handleClick = (value) => {
        console.log('clicked on ' + value);
    }

    handleMouseMove = (event) => {
        if (!this.modelReady) {
            return;
        }
        const canvas = this.refs.hidden_canvas;
        console.log(canvas);
        this.context = canvas.getContext('2d');
        var bounds = this.refs.main_div.getBoundingClientRect();
        console.log('handleMouseMove() : bounds.width =  ' + bounds.width + ', bounds.height = ' + bounds.height);
        var x = event.clientX - bounds.left;
        var y = event.clientY - bounds.top;
        var modelX = x / bounds.width * 400;
        var modelY = y / bounds.height * 498;
        console.log('handleMouseMove() ... modelX = ' + modelX + ', modelY = ' + modelY);
        if (modelX < 0 || modelX > 400) {
            modelX = 0;
        }
        if (modelY < 0 || modelY > 498) {
            modelY = 0;
        }
        var redCode = this.context.getImageData(modelX, modelY, 5, 5);
        //console.log('modelX = ' + modelX + ', modelY = ' + modelY + ' (' + redCode.data[0] + ') : ' + county_red_codes.get(redCode.data[0]));
        var countyToHighlight = county_red_codes.get(redCode.data[0]);
        if (this.state.highlightedCounty !== countyToHighlight) {
            this.setState({ highlightedCounty: countyToHighlight });
        }
    }



    render() {
        const countyComponents = county_data.map((county) => {
            var highlighted = this.state.highlightedCounty === county.name ? true : false;
            return (
                <React.Fragment key={county.name + '_key'}>
                    <CountySegment
                        name={county.name}
                        source={county.name + '_highlighted'}
                        top={this.state.offsetY + (county.top * this.state.sizeRatio)}
                        left={this.state.offsetX + (county.left * this.state.sizeRatio)}
                        width={county.width * this.state.sizeRatio}
                        height={county.height * this.state.sizeRatio}
                        highlighted={highlighted}
                        handleClick={() => this.handleClick}
                    />
                </React.Fragment>
            );
        });
        let backgroundWidth = this.state.sizeRatio * IRELAND_MAP_BASE_WIDTH;
        let backgroundHeight = this.state.sizeRatio * IRELAND_MAP_BASE_HEIGHT;
        return (
            <div className='container' id='container'>
                <div className='background_div'>
                    <img src='/images/counties_monochrome.png' alt='missing'
                         style={{left : this.state.offsetX,
                                 top : this.state.offsetY,
                                 width : backgroundWidth,
                                 height : backgroundHeight}}/>
                </div>
                <div id='main_div' className='ireland_map_div'
                    ref={this.refCallback}
                    onMouseMove={this.handleMouseMove}>
                    {countyComponents}
                    <div ref='hidden_div' style={{ display: 'none' }}>
                        <canvas ref='hidden_canvas' width='400' height='498' />
                        <img src='/images/counties_model.png'
                            ref='counties_model'
                            alt='alt'
                            onLoad={this.onModelImageLoad} />
                    </div>
                    <div style={{ color: 'white' }}>{this.state.highlightedCounty} </div>
                </div>
            </div>

        );
    }
}
