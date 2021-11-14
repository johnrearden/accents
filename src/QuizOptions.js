import React, { useState, useRef, useEffect } from 'react';
import { Redirect } from 'react-router';
import { county_data } from './data/county_data';

const BACKGROUND_IMAGE_CORRECT = 'radial-gradient(#7777ff, #777799)'
const BACKGROUND_IMAGE_WRONG = 'radial-gradient(#ff7777, #997777)'
const BACKGROUND_IMAGE_UNSELECTED = 'radial-gradient(#dddddd, #999999)';
const BORDER_COLOR_UNSELECTED = '#999999dd';
const BORDER_PERSISTENCE_DURATION = 1500;
const VOLUME_FADE_PERIOD = 1500;
const CORRECT_SOUND_SOURCE = '/audio/correct_bell.mp3';
const WRONG_SOUND_SOURCE = '/audio/wrong_buzz.mp3';

function QuizOptions(props) {
    
}