import React, { useState, useRef, useEffect } from 'react';
import { Redirect } from 'react-router';
import { county_data } from './data/county_data';
import './QuizOptions.css';

const BACKGROUND_IMAGE_CORRECT = 'radial-gradient(#7777ff, #777799)'
const BACKGROUND_IMAGE_WRONG = 'radial-gradient(#ff7777, #997777)'
const BACKGROUND_IMAGE_UNSELECTED = 'radial-gradient(#dddddd, #999999)';
const BORDER_COLOR_UNSELECTED = '#999999dd';
const BORDER_PERSISTENCE_DURATION = 1500;
const VOLUME_FADE_PERIOD = 1500;
const APPEARANCE_RESET_TIMEOUT = 2000;
const CORRECT_SOUND_SOURCE = '/audio/correct_bell.mp3';
const WRONG_SOUND_SOURCE = '/audio/wrong_buzz.mp3';


// Component diplays a grid of county choices, handles clicks on correct
// and incorrect options and notifies its parent of each correct and incorrect
// answer. Is also responsible for playing a sound clip for each question, and 
// an appropriate sound effect to respond to the answer.
//
// props :  props.choices  - An array of counties representing the choices
//          props.correctAnswer - a string; the name of the correct county.
//          props.notifyParent - callback to inform parent of choice.
//          props.running - a flag to indicate that the start quiz button has been pressed


function QuizOptions(props) {
    console.log('QuizOptions running');
    const audioRef = useRef(new Audio('/audio/file_example_MP3_700KB.mp3'));
    const soundEffectsRef = useRef(new Audio());
    const isTransition = useRef(false);
    const target = useRef(null);
    const [opacity, setOpacity] = useState(0.0);
    const [count, setCount] = useState(0);

    // Hook to make the component visible again after a new set of choices
    // is received from the parent.
    useEffect(() => {
        if (props.running) {
            isTransition.current = false;
            console.log('props.choices altered .... running useEffect()');
            makeVisible(true);
            playCurrentClip();
            
        }
    }, [props.choices]);

    // Hook to manage sound clip fade out after choice is made. It is triggered 
    // by a change in the isTransition variable from false to true.
    useEffect(() => {
        // don't fade if isTransition is resetting back to false
        if (isTransition.current) {
            console.log('In transition - sound clip fade out useEffect invoked');
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
            }, VOLUME_FADE_PERIOD / 10);

            // Clean-up
            return () => clearInterval(volumeFadeInterval);
        } 
    }, [isTransition.current]);

    // Hook to manage appearance changes after choice is made. It is triggered 
    // by a change in the isTransition variable from false to true.
    useEffect(() => {
        if (isTransition.current) {
            let opacityTimeout = setTimeout(() => {
                makeVisible(false);
                console.log('opacity reset');
            }, BORDER_PERSISTENCE_DURATION);
            let appearanceTimeout = setTimeout(() => {
                target.current.style.backgroundImage = BACKGROUND_IMAGE_UNSELECTED;
                target.current.style.borderColor = BORDER_COLOR_UNSELECTED;
                console.log('appearance reset');
            }, APPEARANCE_RESET_TIMEOUT);

            // Clean-up
            return () => {
                clearTimeout(opacityTimeout);
                clearTimeout(appearanceTimeout);
            }
        }
    }, [isTransition.current]);

    // Hook to notify parent that we are ready for another question
    useEffect(() => {
        if (isTransition.current) {
            let readyForNewQuestionTimeout = setTimeout(() => {
                props.onReadyForNewQuestion();
            }, BORDER_PERSISTENCE_DURATION + APPEARANCE_RESET_TIMEOUT + 1.0)

            // Clean-up
            return () => {
                clearTimeout(readyForNewQuestionTimeout);
            }
        }
    }, [isTransition.current]);

    // Handler for click events on the options.
    const onOptionClick = (event, county) => {
        if (isTransition.current) {
            return; // take no action until component is reset
        } else {
            isTransition.current = true;
            console.log('isTransition.current is switched to ' + isTransition.current);
            target.current = event.currentTarget;
            let selectedIndex = props.choices.indexOf(county);
            let answerIsCorrect = props.correctIndex == selectedIndex;
            props.onOptionSelected(answerIsCorrect);

            console.log(event.currentTarget);
            // Alter appearance of chosen option to reflect correct/incorrect choice
            if (answerIsCorrect) {
                event.currentTarget.style.borderColor = 'blue';
                event.currentTarget.style.backgroundImage = BACKGROUND_IMAGE_CORRECT;
                playCorrectSound();
            } else {
                event.currentTarget.style.borderColor = 'red';
                event.currentTarget.style.backgroundImage = BACKGROUND_IMAGE_WRONG;
                playWrongSound();
            }
            //setCount(count + 1);
        }
    }

    const playCurrentClip = () => {
        audioRef.current.play();
    }

    const stopCurrentClip = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }

    const playCorrectSound = () => {
        soundEffectsRef.current.volume = 0.5;
        soundEffectsRef.current.setAttribute('src', CORRECT_SOUND_SOURCE);
        soundEffectsRef.current.play();
    }

    const playWrongSound = () => {
        soundEffectsRef.current.volume = 0.5;
        soundEffectsRef.current.setAttribute('src', WRONG_SOUND_SOURCE);
        soundEffectsRef.current.play();
    }

    const makeVisible = (visible) => {
        if (visible) {
            setOpacity(1.0);
        } else {
            setOpacity(0.0);
        }
    }


    // Map the possible answers to their images.
    const imageArray = props.choices.map((county) => {
        const image_url = '/images/highlighted_counties/' + county + '_highlighted.png';
        const title = county.charAt(0).toUpperCase() + county.slice(1);
        return (
            <React.Fragment key={county}>
                <div className='quiz_option_wrapper'>
                    <div className='question_mask'>
                    </div>
                    <div className='quiz_option'
                        onClick={(event) => { onOptionClick(event, county) }}
                        style={{opacity : opacity}}>
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
    // h
    //
    //

    return (
        <div>
            <div className='options_holder' key={props.uniqueKey}>
                {imageArray}
            </div>
        </div>

    )
}

export default QuizOptions;