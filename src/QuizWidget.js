import React, { useState, useRef, useEffect } from 'react';
import { Redirect } from 'react-router';
import { county_data } from './data/county_data';
import QuizOptions from './QuizOptions.js';
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
    const [currentChoices, setCurrentChoices] = useState([]);

    // Function to handle callback from QuizOptions when answer is chosen.
    const onAnswerChosen = (answerIsCorrect) => {
        console.log('answerIsCorrect == ' + answerIsCorrect);
        setTotalAnswered(totalAnswered + 1);
        if (answerIsCorrect) {
            setTotalCorrect(totalCorrect + 1);
        }

        // If the quiz is still incomplete, after a delay, create and 
        // display the next question.
        window.setTimeout(() => {
            if (running) {
                createNewQuestion();
                setUserMessage('Try this one ...');
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

    const onStartPressed = () => {
        running = true;
        setStartButtonEnabled(false);
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
        setCurrentChoices(countyList.slice(0, 4));
        correctChoice = currentChoices[Math.floor(Math.random() * 4)];
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
                <div className='options'>
                    <QuizOptions choices={currentChoices}
                        correctAnswer={correctChoice}
                        notifyParent={onAnswerChosen} />
                </div>
                <div className='instructions'>
                    {userMessage}
                </div>
            </div>
        )
    }
}

export default QuizWidget;