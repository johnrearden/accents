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
const APPEARANCE_RESET_TIMEOUT = 3000;
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

function QuizOptions(props) {
    console.log('QuizOptions running');
    const audioRef = useRef(null);
    const soundEffectsRef = useRef(null);
    let isTransition = false;
    let target = null;

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
        let elements = document.getElementsByClassName('quiz_option');
        let opacity = 0.0;
        if (visible) {
            let opacity = 1.0;
        }
        for (const e of elements) {
            e.style.opacity = opacity;
        }
    }

    // Handler for click events on the options.
    const onOptionClick = (event, county) => {
        if (isTransition) {
            return; // take no action until component is reset
        } else {
            isTransition = true;
            let selectedIndex = props.choices.indexOf(county);
            let answerIsCorrect = props.correctIndex == selectedIndex;
            console.log('answerIsCorrect : ' + answerIsCorrect + '...' +
                props.correctAnswer + ' == ' + county);
            props.notifyParent(answerIsCorrect);

            // Alter appearance of chosen option to reflect correct/incorrect choice
            target = event.currentTarget;
            if (county === props.correctAnswer) {
                target.style.borderColor = 'blue';
                target.style.backgroundImage = BACKGROUND_IMAGE_CORRECT;
                playCorrectSound();
            } else {
                target.style.borderColor = 'red';
                target.style.backgroundImage = BACKGROUND_IMAGE_WRONG;
                playWrongSound();
            }
        }
    }


    // Map the possible answers to their images.
    console.log('correct answer == ' + props.choices[props.correctIndex]);
    const imageArray = props.choices.map((county) => {
        console.log('choice == ' + county);
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
                    <div>
                        <audio ref={audioRef}>
                            <source src='/audio/file_example_MP3_700KB.mp3'></source>
                        </audio>
                        <audio ref={soundEffectsRef}>
                        </audio>
                    </div>
                </div>
            </React.Fragment>
        );
    });

    // Load the new audio clip for the correct answer into the audioplayer
    //
    //
    //

    return (
        <div>
            <div className='options_holder'>
                {imageArray}
            </div>
        </div>

    )

    // Hook to make the component visible again after a new set of choices
    // is received from the parent.
    useEffect(() => {
        console.log('props.choices altered .... running useEffect()');
        makeVisible(true);
    }, [props.choices]);
    

    // Hook to manage sound clip fade out after choice is made. It is triggered 
    // by a change in the isTransition variable from false to true.
    useEffect(() => {
        // don't fade if isTransition is resetting back to false
        if (isTransition) {
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
    }, [isTransition]);

    // Hook to manage appearance changes after choice is made. It is triggered 
    // by a change in the isTransition variable from false to true.
    useEffect(() => {
        if (isTransition) {
            let opacityTimeout = setTimeout(() => {
                makeVisible(false);
            }, BORDER_PERSISTENCE_DURATION);
            let appearanceTimeout = setTimeout(() => {
                //switchBackgroundImage(currentElement, BACKGROUND_IMAGE_UNSELECTED);
                target.style.borderColor = BORDER_COLOR_UNSELECTED;
            }, APPEARANCE_RESET_TIMEOUT);

            // Clean-up
            return () => {
                clearTimeout(opacityTimeout);
                clearTimeout(appearanceTimeout);
            }
        }
    }, [isTransition]);

    
}

export default QuizOptions;