import React from 'react';
import {COUNTY_NAMES} from './data/constants';
import './CountyButtonPanel.css';

export default class CountyButtonPanel extends React.Component {

    render() {
        return (
            <div id='button_panel_holder'>
                <div className='column'>
                    <div className='province_div'>
                        <div className='province_label'>Leinster</div>
                        <div className='county_list'>
                            {COUNTY_NAMES.get('Leinster').map((name) => {
                                return (<button className='county_button'>{name}</button>) 
                            })}
                        </div>                        
                       
                    </div>
                    <div className='province_div'>
                        <div className='province_label'>Connaught</div>
                        <div className='county_list'>
                            {COUNTY_NAMES.get('Connaught').map((name) => {
                                return (<button className='county_button'>{name}</button>) 
                            })}
                        </div>  
                    </div>
                </div>
                <div className='column'>
                    <div className='province_div'>
                        <div className='province_label'>Munster</div>
                        <div className='county_list'>
                            {COUNTY_NAMES.get('Munster').map((name) => {
                                return (<button className='county_button'>{name}</button>) 
                            })}
                        </div>  
                    </div>
                    <div className='province_div'>
                        <div className='province_label'>Ulster</div>
                        <div className='county_list'>
                            {COUNTY_NAMES.get('Ulster').map((name) => {
                                return (<button className='county_button'>{name}</button>) 
                            })}
                        </div>  
                    </div>
                </div>
            </div>
        );
    }
}