import React, { useState, useRef, useEffect } from 'react';
import { Redirect } from 'react-router';
import { county_data } from './data/county_data';
import './QuizWidget.css';

const backgroundImageCorrect = 'radial-gradient(#7777ff, #777799)'
const backgroundImageWrong = 'radial-gradient(#ff7777, #997777)'
const backgroundImageUnselected = 'radial-gradient(#dddddd, #999999)';
const borderColorUnselected = '#999999dd';
const borderPersistenceDuration = 1500;
const volumeFadePeriod = 1500;
const correctSoundSource = '/audio/correct_bell.mp3';
const wrongSoundSource = '/audio/wrong_buzz.mp3';

// Variables without re-render on mutation.
let correctChoice = null;
let currentChoices = [];
let running = false;
let isTransition = true;

function QuizWidget(props) {
    const [remainingQs, getRemainingQs] = useState(props.totalNumQs);
    const countyList = county_data.map(county => county.name);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [currentChoiceIcons, setCurrentChoiceIcons] = useState([]);
    const [userMessage, setUserMessage] = useState('Guess the county ...');
    const [startButtonEnabled, setStartButtonEnabled] = useState(true);
    const [startButtonText, setStartButtonText] = useState('Start Quiz');
    const [quizIsComplete, setQuizIsComplete] = useState(false);
    const audioRef = useRef(null);
    const soundEffectsRef = useRef(null);

    // function to play audio when a quiz_option is clicked on
    const onOptionClick = (event, county) => {
        if (isTransition) {
            return;
        }
        console.log(correctChoice + ' == ' + county);
        fadeOutCurrentClip();
        let currentElement = event.currentTarget;
        setTotalAnswered((totalAnswered) => totalAnswered + 1);

        // Alter appearance of chosen option to reflect correct/incorrect choice
        if (county === correctChoice) {
            setUserMessage('Correct!');
            playCorrectSound();
            isTransition = true;
            currentElement.style.borderColor = 'blue';
            currentElement.style.backgroundImage = backgroundImageCorrect;
            window.setTimeout(() => {
                setOptionsOpacity(0.0);
            }, borderPersistenceDuration);
            setTotalCorrect((totalCorrect) => totalCorrect + 1);
        } else {
            setUserMessage('Wrong!');
            playWrongSound();
            isTransition = true;
            event.currentTarget.style.borderColor = 'red';
            event.currentTarget.style.backgroundImage = backgroundImageWrong;
            window.setTimeout(() => {
                setOptionsOpacity(0.0);
            }, borderPersistenceDuration);
        }

        // If the quiz is still incomplete, after a delay, create and 
        // display the next question.
        window.setTimeout(() => {
            if (running) {
                switchBackgroundImage(currentElement, backgroundImageUnselected);
                currentElement.style.borderColor = borderColorUnselected;
                createNewQuestion();
                playCurrentClip();
                setUserMessage('Try this one ...');
                allowOptionClickAfterDelay();
            }
        }, 3000);
    }

    // Callback to check if quiz is complete.
    useEffect(() => {
        if (totalAnswered >= props.totalNumQs) {
            console.log('quiz complete');
            setUserMessage('Well done, you got ' + totalCorrect
                + ' right out of ' + totalAnswered);
            running = false;
            setStartButtonText('Finish');
            setStartButtonEnabled(true);
            setQuizIsComplete(true);
        }
    }, [totalAnswered]);

    const switchBackgroundImage = (element, img) => {
        element.style = img;
    }

    const onStartPressed = () => {
        running = true;
        setStartButtonEnabled(false);
        playCurrentClip();
        setOptionsOpacity(1.0);
        allowOptionClickAfterDelay();
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
            window.setTimeout(() => { setOptionsOpacity(1.0) }, 500);
        }
    }

    const playCurrentClip = () => {
        audioRef.current.play();
    }

    const stopCurrentClip = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }

    const fadeOutCurrentClip = () => {
        const volumeFadeInterval = setInterval(() => {
            var currentVol = audioRef.current.volume;
            var newVol = (parseFloat(currentVol - 0.1).toFixed(1));
            if (newVol >= 0) {
                audioRef.current.volume = newVol;
            } else {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current.volume = 1.0;
                window.clearInterval(volumeFadeInterval);
            }
        }, volumeFadePeriod / 10);
    }

    const playCorrectSound = () => {
        soundEffectsRef.current.volume = 0.5;
        soundEffectsRef.current.setAttribute('src', correctSoundSource);
        soundEffectsRef.current.play();
    }

    const playWrongSound = () => {
        soundEffectsRef.current.volume = 0.5;
        soundEffectsRef.current.setAttribute('src', wrongSoundSource);
        soundEffectsRef.current.play();
    }

    const setOptionsOpacity = (opacity) => {
        let elements = document.getElementsByClassName('quiz_option');
        for (const e of elements) {
            e.style.opacity = opacity;
        }
    }

    const allowOptionClickAfterDelay = () => {
        window.setTimeout(() => {
            isTransition = false;
        }, 1000);
    }

    if (quizIsComplete) {
        return (<Redirect to={'/home'} />);
    } else {
        return (
            <div className='container'>
                <div className='totals'>
                    {totalCorrect} / {totalAnswered}
                </div>
                <div >
                    <button className='start_button'
                        disabled={!startButtonEnabled}
                        onClick={onStartPressed}>
                        {startButtonText}
                    </button>
                </div>
                <div className='options_holder'>
                    {currentChoiceIcons}
                </div>
                <div className='instructions'>
                    {userMessage}
                </div>
                <div>
                    <audio className='audio_player' ref={audioRef}>
                        <source src='/audio/file_example_MP3_700KB.mp3' />
                    </audio>
                    <audio className='audio_player' ref={soundEffectsRef}>
                        <source src='/audio/correct_bell.mp3' />
                    </audio>
                </div>
            </div>

        )
    }



}

export default QuizWidget;