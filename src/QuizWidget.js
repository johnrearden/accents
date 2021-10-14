import React, { useState, useRef } from 'react';
import { county_data } from './data/county_data';
import './QuizWidget.css';

function QuizWidget(props) {
    const [remainingQs, getRemainingQs] = useState(props.totalNumQs);
    const countyList = county_data.map(county => county.name);
    console.log(countyList);

    // Select a county at random, and then pick 3 others as candidates
    // First, shuffle the array.
    for (let i = countyList.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [countyList[i], countyList[j]] = [countyList[j], countyList[i]];
    }

    // Take the first 4 elements and choose correct answer at random.
    const options = countyList.slice(0, 4);
    const answer = options[Math.floor(Math.random() * 4) + 1];

    // Map the possible answers to their images.
    const images = options.map((county) => {
        const image_url = '/images/' + county + '_highlighted.png';
        const title = county.charAt(0).toUpperCase() + county.slice(1);
        return (
            <React.Fragment key={county + '_key'}>
                <div className='quiz_option'>
                    <div className='option_image' style={{
                        backgroundImage: `url(${image_url})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        padding: '10px',
                        color: 'black'
                    }}>
                    </div>
                    <div className='option_label'>
                        {title}
                    </div>
                    {/* <img src={image_url}
                        className='options_image'
                        alt='missing image file' /> */}

                </div>
            </React.Fragment>
        );
    });

    return (
        <div className='container'>
            <div className='options_holder'>
                {images}
            </div>
        </div>

    )

}

export default QuizWidget;