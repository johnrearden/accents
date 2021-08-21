import React from 'react';
import './AlphabeticalCountyPicker.css';
import { COUNTY_NAMES } from './data/constants';
import demoSoundFile1 from './data/audio/phone1.ogg';
import demoSoundFile2 from './data/audio/phone2.ogg';

export default class AlphabeticalCountyPicker extends React.Component {
    render() {
        var alphabeticalList = [];
        for (let element of COUNTY_NAMES.values()) {
            alphabeticalList = alphabeticalList.concat(element);
        }
        alphabeticalList.sort();
        return (
            <React.Fragment>
                <div className='container'>
                    <div className='county_grid'>
                        {alphabeticalList.map((countyName) => {
                            return (
                                <div className='grid_item' onClick={() => this.props.clickHandler(countyName.toLowerCase())}>
                                    {countyName}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </React.Fragment>
        );


    }
}