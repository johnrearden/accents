import React from 'react';
import {COUNTY_INFO} from './data/constants';

export default class CountyOverview extends React.Component {

        render() {
            var countyName = COUNTY_INFO.get(this.props.selectedCounty).name;
            var irishName = COUNTY_INFO.get(this.props.selectedCounty).irishName;
            var gaaName = COUNTY_INFO.get(this.props.selectedCounty).gaaName;
            var source = this.props.selectedCounty + '_mono';
            return (
                <div id='county_overview'>
                    <div className='county_name'>{countyName}</div>
                    <div className='irish_name'>{irishName}</div>
                    <div className='gaa_name'>{gaaName}</div>
                    <div className='county_image'>
                        <img src={`/images/${source}.png`} alt='County pic is missing'/>
                    </div>
                </div>
            );
        }



}
