import React, { useState, useRef } from 'react';
import { county_data } from './data/county_data';
import './QuizWidget.css';

function QuizWidget(props) {
    const [remainingQs, getRemainingQs] = useState(props.totalNumQs);
    const countyList = county_data.map(county => county.name);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);

    // function to play audio when quiz_option is clicked
    const onOptionClick = () => {
        const audioPlayer = document.getElementsByClassName('audio_player')[0];
        audioPlayer.play();
    }

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
        const image_url = '/images/highlighted_counties/' + county + '_highlighted.png';
        const title = county.charAt(0).toUpperCase() + county.slice(1);
        return (
            <React.Fragment key={county + '_key'}>
                <div className='quiz_option'
                     onClick={onOptionClick}>
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
                </div>
            </React.Fragment>
        );
    });

    return (
        <div className='container'>
            <div className='totals'>
                <h1>{totalCorrect}/{totalAnswered}</h1>
            </div>
            <div className='prompt'>
                <h3>CHOOSE A COUNTY</h3>
            </div>
            <div className='options_holder'>
                {images}
            </div>
            <div>
                <audio className='audio_player' controls >
                    <source src='/audio/file_example_MP3_700KB.mp3'>
                    </source>
                </audio> 
            </div>
        </div>

    )

}

export default QuizWidget;