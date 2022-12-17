import React from 'react';
import Canvas from './game/Canvas';
import { Link } from 'react-router-dom';
const PlayGameButton = () => {
    return (
        <Link to="/game">
        Play a game
        </Link>
    );
};

export default PlayGameButton;
