import React from 'react';
import './css/CountyDropDown.css';

const CountyDropDown = (props) => {
    let dropdownItems = props.items.map((item) => {
        return (
            <div class='dropdown_item'>
                {item}
            </div>
        );
    })
    return (
        <div class='dropdown'>
            <button class='drop_button'>Choose County</button>
            <div class='dropdown_content'>
                {dropdownItems}
            </div>
        </div>
    );
}

export default CountyDropDown;