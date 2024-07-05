import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";
import TopLine from "../Room/TopLine.js";
import BottomLine from "../Room/BottomLine.js";
import QuitPopUp from "../Room/QuitPopUp.js";
import ScoreBoard from "../RemoteGame//ScoreBoard.js";
import GameBoard from "./GameBoard.js";
import LocalEventHandler from "./EventHandler.js";
import BallSetter from "./BallSetter.js";
import HitChecker from "./HitChecker.js";
import { INIT } from "./constant.js";
import { addScreenEffect, removeScreenEffect, getBallImage } from "../RemoteGame/Game.js";
import "../../css/game/game-page.css";

function LocalGame() {
    const [ game, setGame ] = useState(getInitialGameData());
    const isStarted = game.isStarted;

    if (HitChecker.isBallHitGoalLine(game.ball))
        setNextGame(setGame);
    useEffect(() => {
        if (isStarted) {
            addScreenEffect();
            addGameEvents(game, setGame); 
            game.ballSetter.setBallMove(setGame);
        }
        return (() => {
            removeScreenEffect();
            removeGameEvents(game);
            game.ballSetter.setBallStop();
        });
    }, [isStarted]);
    return (
        <div className="container-fluid" id="game-page">
            <TopLine />
            <ScoreBoard game={ game } />
            <GameBoard game={ game } setGame={ setGame } />
            <BottomLine setFunction={ setGame } />
            <QuitPopUp data={ game } setFunction={ setGame } /> 
        </div>
    );
}

function getInitialGameData() {
    return ({
        ball: { ...INIT.BALL, image: getBallImage() },
        paddle: [ INIT.PADDLE1, INIT.PADDLE2 ],
        score: [ 0, 0 ],
        eventHandler: new LocalEventHandler(),
        ballSetter: new BallSetter(),
        isQuitClicked: false,
        isStarted: false,
    });
}

function addGameEvents(game, setGame) {
    game.eventHandler.addKeyDownEvent(setGame);
    game.eventHandler.addKeyUpEvent(setGame);
}

export function removeGameEvents(game) {
    game.eventHandler.removeKeyDownEvent();
    game.eventHandler.removeKeyUpEvent();
}

function setNextGame(setGame) {
    setGame((prev) => {
        const newScore = getNewScore(prev);
        const ballDirectionX = prev.ball.direction.x < 0 ? -1 : 1;

        return ({
            ...prev,
            ball: { ...prev.ball, ...INIT.BALL, direction: { x: ballDirectionX, y: 0 }},
            paddle: [ INIT.PADDLE1, INIT.PADDLE2 ],
            score: newScore,
        });
    });
}

function getNewScore(game) {
    if (game.ball.direction.x > 0)
        return ([ game.score[0] + 1, game.score[1] ]);
    else
        return ([ game.score[0], game.score[1] + 1]);
}

export default LocalGame;