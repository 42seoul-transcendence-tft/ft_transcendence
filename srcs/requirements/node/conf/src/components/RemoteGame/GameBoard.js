import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";
import Paddle from "./Paddle.js";
import Ball from "./Ball.js";
import PlayerSlot from "./PlayerSlot.js";
import ResultPopUp from "./ResultPopUp.js";
import "../../css/game/game-board.css";

function GameBoard({ game }) {
    return (
        <div className="row" id="game-board">
            <PlayerSlot id="player1" player={ game.players[0] }/>
            <Board ball={ game.ball } paddle={ game.paddle } game={ game }/>
            <PlayerSlot id="player2" player={ game.players[1] }/>
            <ResultPopUp game={ game } />
        </div>
    );
}

function Board({ ball, paddle, game }) {
    return (
        <div className="col" id="board">
            <Ball id="ball" ball={ ball } />
            <Paddle id="paddle1" paddle={ paddle } />
            <Paddle id="paddle2" paddle={ paddle }/>
        </div>
    );
}

export default GameBoard;