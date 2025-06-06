import React from 'react';
import EndGameScreen from './EndGameScreen';
import { useState } from 'react';
import styled from 'styled-components';
import './Canvas.css';
import Question from './Question';

const GameContainer = styled.div`
    background-color: transparent;
    width: 1000px;
    height: 550px;
    margin: auto;
    position: relative;
    border: 2px solid gray;
`;

const Planet = styled.img.attrs((props) => props)`
    width: 50px;
    height: 50px;
    position: absolute;
    top: ${(props) => props.y}px;
    left: ${(props) => props.x}px;
`;
const GameButton = styled.button`
    position: absolute;
    background: grey;
    padding: 10px;
    width: 10rem;
    border-radius: 4px;
    top: 510px;
    left: 840px;
`;
const Score = styled.div`
    position: absolute;
    background: grey;
    width: 10rem;
    height: 2rem;
`;

const Player = styled.img`
    width: 50px;
    height: 50px;
    position: absolute;
    z-index:10;
`
const Canvas = ({ planets }) => {
    const [x, setX] = useState(250);
    const [y, setY] = useState(250);
    const [score, setScore] = useState(0);
    const [questionToDisplay, setQuestionToDisplay] = useState('');
    const [gameOver, setGameOver] = useState();
    const [answerCorrect, setAnswerCorrect] = useState(false);

    let planetNodes = planets.map((planet, id) => {
        return (
            <Planet key={id} y={planet.coordinates.y} x={planet.coordinates.x} src={planet.image} />
        );
    });

    function onKeyDown(e) {
        if (!gameOver) {
            e.preventDefault();
            if (e.key === 'ArrowUp') {
                if (y > 0) {
                    setY((prevState) => prevState - 10);
                }
                setQuestionToDisplay('');
            } else if (e.key === 'ArrowDown') {
                if (y < 500) {
                    setY((prevState) => prevState + 10);
                }
                setQuestionToDisplay('');
            } else if (e.key === 'ArrowLeft') {
                if (x > 0) {
                    setX((prevState) => prevState - 10);
                }
                setQuestionToDisplay('');
            } else if (e.key === 'ArrowRight') {
                if (x < 950) {
                    setX((prevState) => prevState + 10);
                }
                setQuestionToDisplay('');
            } else if (e.key === ' ') {
                openPlanet();
            }
        }
    }

    const openPlanet = () => {
        if (!planets || planets.length === 0) {
            console.log("No planets to check");
            return;
        }
        console.log("Player position:", x, y);
        planets.forEach((planet) => {
          // Calculate distance between player and planet
          const dx = x - planet.coordinates.x;
          const dy = y - planet.coordinates.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // If player is within 30 pixels of the planet, show question
          if (distance < 30) {
            console.log("Planet detected:", planet.name);
            console.log("Question data:", planet.questions[0]);
            
            // Make sure we're passing the first question object
            if (planet.questions && planet.questions.length > 0) {
              setQuestionToDisplay(planet.questions[0]);
            }
            return; // Stop after finding the first close planet
          }
        });
      };
    
    const handleGameOverClick = () => {
        gameOver ? setGameOver(false) : setGameOver(true);
        setQuestionToDisplay('');
    };
    const playerStyle = {
        left: x,
        top: y,
    };

    const countScore = () => {
        setQuestionToDisplay('');
        if (answerCorrect === true) {
            const newScore = score + 10;
            setScore(newScore);
            setAnswerCorrect(false);
        }
    };

    const checkAnswerCorrect = () => {
        setAnswerCorrect(true);
    };

    const restartGame = () => {
        setX(250);
        setY(250);
        setScore(0);
        setGameOver(false);
        setQuestionToDisplay('');
    };

    return (
        <>
            <GameContainer tabIndex='0' onKeyDown={onKeyDown}>
                <Player src="./images/ovni.png" alt='planet' style={playerStyle} />
                <>{planetNodes}</>
                {questionToDisplay ? (
                    <Question
                        questionToDisplay={questionToDisplay}
                        countScore={countScore}
                        checkAnswerCorrect={checkAnswerCorrect}
                    />
                ) : null}
                <GameButton onClick={handleGameOverClick}>End Game</GameButton>
                <Score>Current score: {score}</Score>
                {gameOver ? (
                    <EndGameScreen
                        handleGameOverClick={handleGameOverClick}
                        score={score}
                        restartGame={restartGame}
                    />
                ) : null}
            </GameContainer>
        </>
    );
};

export default Canvas;
