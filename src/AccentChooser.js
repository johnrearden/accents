import React from 'react';
import './AccentChooser.css';
import IrelandMap from './IrelandMap.js';
import AlphabeticalCountyPicker from './AlphabeticalCountyPicker.js';
import CountyOverview from './CountyOverview.js';

export default class AccentChooser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCounty: 'cork',
        }
        this.onSelectedCountyChange = this.onSelectedCountyChange.bind(this);
    }

    onSelectedCountyChange = (newCounty) => {

        if (this.state.selectedCounty !== newCounty) {
            this.setState({ selectedCounty: newCounty });
        }
    }
    render() {
        return (
            <div className='main_container'>

                {/* <div className='left_column'>
                    <AlphabeticalCountyPicker
                        selectedCounty={this.state.selectedCounty}
                        clickHandler={this.onSelectedCountyChange} />
                </div> */}
                <div className='center_column'>
                    {/* <div id='empty_div'></div> */}
                    <IrelandMap
                        selectedCounty={this.state.selectedCounty}
                        clickHandler={this.onSelectedCountyChange} />
                </div>
                {/* <div className='right_column'>
                    <CountyOverview
                        selectedCounty={this.state.selectedCounty} />
                </div> */}


            </div>
        );
    }
}