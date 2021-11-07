import React, { useState, useRef, useEffect } from 'react';
import { county_data } from './data/county_data';
import './QuizWidget.css';

const backgroundImageCorrect = 'radial-gradient(#7777ff, #777799)'
const backgroundImageWrong = 'radial-gradient(#ff7777, #997777)'
const backgroundImageUnselected = 'radial-gradient(#dddddd, #999999)';
const borderColorUnselected = '#999999dd';
const borderPersistenceDuration = 1000;

// Variables without re-render on mutation.
let correctChoice = null;
let currentChoices = [];
let running = false;

function QuizWidget(props) {
    const [remainingQs, getRemainingQs] = useState(props.totalNumQs);
    const countyList = county_data.map(county => county.name);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [currentChoiceIcons, setCurrentChoiceIcons] = useState([]);
    const audioRef = useRef(null);

    // function to play audio when quiz_option is clicked
    const onOptionClick = (event, county) => {
        console.log(correctChoice + ' == ' + county);
        stopCurrentClip();
        let currentElement = event.currentTarget;
        setTotalAnswered((totalAnswered) => totalAnswered + 1);
        
        if (county === correctChoice) {
            console.log('Correct!');
            currentElement.style.borderColor = 'blue';
            currentElement.style.backgroundImage = backgroundImageCorrect;
            window.setTimeout(() => {
                switchBackgroundImage(currentElement, backgroundImageUnselected);
                currentElement.style.borderColor = borderColorUnselected;
                setOptionsOpacity(0.0);
            }, borderPersistenceDuration);
            setTotalCorrect((totalCorrect) => totalCorrect + 1);
            console.log('totalAnswered = ' + totalAnswered);
            console.log('totalCorrect = ' + totalCorrect);

        } else {
            console.log('Wrong!');
            event.currentTarget.style.borderColor = 'red';
            event.currentTarget.style.backgroundImage = backgroundImageWrong;
            window.setTimeout(() => {
                switchBackgroundImage(currentElement, backgroundImageUnselected);
                currentElement.style.borderColor = borderColorUnselected;
                setOptionsOpacity(0.0);
            }, borderPersistenceDuration);
            console.log('totalAnswered = ' + totalAnswered);
        }
        window.setTimeout(() => {
            createNewQuestion();
            playCurrentClip();
        }, 2000);
    }

    const switchBackgroundImage = (element, img) => {
        element.style = img;
    }

    const onPlayClipPressed = () => {
        running = true;
        console.log('playClipPressed... running == ' + running);
        playCurrentClip();
        setOptionsOpacity(1.0);
    }

    // This effect runs once, after the first render, creating a new question.
    useEffect(() => {
        createNewQuestion();
    }, []);

    // Steps quiz forward to the next question, loading the correct images and audioclip
    const createNewQuestion = () => {
        // Select a county at random, and then pick 3 others as candidates
        // First, shuffle the array.
        for (let i = countyList.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [countyList[i], countyList[j]] = [countyList[j], countyList[i]];
        }

        // Take the first 4 elements and choose correct answer at random.
        currentChoices = (countyList.slice(0, 4));
        correctChoice = currentChoices[Math.floor(Math.random() * 4)];

        // Map the possible answers to their images.
        const imageArray = currentChoices.map((county) => {
            const image_url = '/images/highlighted_counties/' + county + '_highlighted.png';
            const title = county.charAt(0).toUpperCase() + county.slice(1);
            return (
                <React.Fragment key={county}>
                    <div className='quiz_option_wrapper'>
                        <div className='question_mask'>
                            ?
                        </div>
                        <div className='quiz_option' 
                             onClick={(event) => { onOptionClick(event, county) }}>
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
                    </div>
                </React.Fragment>
            );
        });

        // Load the new audio clip for the correct answer into the audioplayer
        //
        //
        //


        // Rerender the new set of choice icons and play the current clip
        setCurrentChoiceIcons(imageArray);
        if (running) {
            console.log('running is true, setting delay for setOptionsOpacity(1.0)');
            window.setTimeout(() => {setOptionsOpacity(1.0)}, 500);
        } else {
            console.log('running is still ' + running);
        }
    }

    const playCurrentClip = () => {
        audioRef.current.play();
    }

    const stopCurrentClip = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }

    const setOptionsOpacity = (opacity) => {
        let elements = document.getElementsByClassName('quiz_option');
        for (const e of elements) {
            e.style.opacity = opacity;
        }
    }

    return (
        <div className='container'>
            <div className='totals'>
                {totalCorrect} / {totalAnswered}
            </div>
            <div >
                <button className='play_clip_button'
                    onClick={onPlayClipPressed}>Start Quiz</button>
            </div>
            <div className='options_holder'>
                {currentChoiceIcons}
            </div>
            <div className='instructions'>
                Guess the county ...
            </div>
            <div>
                <audio className='audio_player' ref={audioRef}>
                    <source src='/audio/file_example_MP3_700KB.mp3'>
                    </source>
                </audio>
            </div>
        </div>

    )

}

export default QuizWidget;