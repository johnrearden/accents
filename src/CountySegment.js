import React from 'react';
import './CountySegment.css';
import {OPACITY_INCREMENT, OPACITY_DECREMENT} from './data/constants';

/* 
    A CountySegment component takes the following props from its parent :
        .source : The path to the image source file
        .top    : The top style attribute
        .left   : The left style attribute
        .width  : The width style attribute
        .height : The height style attribute
        .opacity: The opacity attribute for the image
        .fireMouseOver : A handle to a callback in the parent when the mouse is over the component.
        .fireMouseOut  : A hangle to a callback in the parent when the mouse has exited the component.
*/
export default class CountySegment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity : 0.0,
        }
        this.opacityUpdateUnderway = false;
    }

    adjustOpacity = () => {
        if (this.props.highlighted) {
            if (this.state.opacity < 0.7) {
                let tempOpac = this.state.opacity + OPACITY_INCREMENT;
                tempOpac = tempOpac > 0.7 ? 0.7 : tempOpac;
                this.setState({opacity : tempOpac}, () => requestAnimationFrame(this.adjustOpacity));
            }
        } else if (!this.props.highlighted) {
            if (this.state.opacity > 0.0) {
                let tempOpac = this.state.opacity - OPACITY_DECREMENT;
                tempOpac = tempOpac < 0.0 ? 0.0 : tempOpac;
                this.setState({opacity : tempOpac}, () => requestAnimationFrame(this.adjustOpacity));
            }
        }
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.highlighted !== this.props.highlighted) {
            this.adjustOpacity();
        } 
    }

    render() {
        const source = '/images/counties_mono/' + this.props.source + '.png';
        return (
            <div className='county_segment' >
                <img src={source}
                    className='county_map' alt='Map of County' 
                    onClick={(event)=> {
                        event.stopPropagation();
                        this.props.handleClick()}
                    }
                    onTouchEnd={this.props.handleClick}
                    style={{
                        position : 'absolute',
                        top : this.props.top,
                        left : this.props.left,
                        width : this.props.width,
                        height : this.props.height,
                        opacity : this.state.opacity,
                    }} />
                
            </div>
        );
    }
}