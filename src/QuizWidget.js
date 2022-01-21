import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { coordinates } from './data/coordinates';
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
let correctIndex = -1;
let running = false;

function QuizWidget(props) {
    const [remainingQs, getRemainingQs] = useState(props.totalNumQs);
    const countyList = coordinates.map(county => county.name);
    const [totalAnswered, setTotalAnswered] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [userMessage, setUserMessage] = useState('Guess the county ...');
    const [startButtonEnabled, setStartButtonEnabled] = useState(true);
    const [startButtonText, setStartButtonText] = useState('Start Quiz');
    const [quizIsComplete, setQuizIsComplete] = useState(false);
    const [currentChoices, setCurrentChoices] = useState([]);

    console.log('QuizWidget is running.');

    // Function to handle callback from QuizOptions when answer is chosen.
    const onAnswerChosen = (answerIsCorrect) => {
        console.log('answerIsCorrect == ' + answerIsCorrect);
        setTotalAnswered(totalAnswered + 1);
        if (answerIsCorrect) {
            setTotalCorrect(totalCorrect + 1);
        }
    }

    // Function to handle callback from QuizOptions when it's ready 
    // for another question
    const onReadyForNewQuestion = () => {
        if (running) {
            setCurrentChoices([]);
            createNewQuestion();
            setUserMessage('Try this one ...');
        }
    }

    // Hook to clean-up on dismount
    useEffect(() => {
        return () => {
            running = false;
        }
    }, []);

    // Hook to check if quiz is complete.
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
        createNewQuestion();
    }

    // This effect runs once, after the first render, creating a new question.
    // useEffect(() => {
    //     createNewQuestion();
    // }, []);

    // Steps quiz forward to the next question, loading the correct images and audioclip
    const createNewQuestion = () => {
        // Select a county at random, and then pick 3 others as candidates
        // First, shuffle the array.
        for (let i = countyList.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [countyList[i], countyList[j]] = [countyList[j], countyList[i]];
        }

        // Take the first 4 elements and choose correct answer at random.
        console.log('Creating new question');
        setCurrentChoices(countyList.slice(0, 4));
        correctIndex = Math.floor(Math.random() * 4);
    }

    if (quizIsComplete) {
        return (<Redirect to={'/'} />);
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
                        correctIndex={correctIndex}
                        onOptionSelected={onAnswerChosen}
                        onReadyForNewQuestion={onReadyForNewQuestion}
                        running={running} />
                </div>
                <div className='instructions'>
                    {userMessage}
                </div>
            </div>
        )
    }
}

export default QuizWidget;