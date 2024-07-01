import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";
import { navigate } from "../../MyReact/MyReactRouter.js";
import TopLine from "../Room/TopLine.js";
import ScoreBoard from "./ScoreBoard.js";
import GameBoard from "./GameBoard.js";
import BottomLine from "./BottomLine.js";
import ResultPopUp from "./ResultPopUp.js";
import { pongSocket, mttSocket } from "./GameSocket.js";
import { GameEventHandler } from "./EventHandler.js";
import { INIT, GAME } from "./constant.js";
import "../../css/game/game-page.css";

function RemoteGame({ data }) {
    if (!data) 
        return (navigate("/home"));
    const [ game, setGame ] = useState(getInitialGameData(data));

    useEffect(() => {
        console.log("=====================Game Page=======================");
        console.log("game:", game);
        addEvents(game, setGame); 
        turnOnSocketChannels(game, setGame);
        return (() => {
            removeEvents(game);
            turnOffSocketChannels(game);
        });
    }, []);
    return (
        <div className="container-fluid" id="game-page">
            <TopLine />
            <ScoreBoard game={ game } />
            <GameBoard game={ game } />
            <BottomLine />
            <ResultPopUp game={ game } />
        </div>
    );
}

function getInitialGameData(data) {
    const socket = data.type === GAME.TYPE.PONG ? pongSocket : mttSocket;

    return ({
        socket: socket,
        type: data.type,
        myId: data.myId,
        round: data.gameRound,
        ball: { x: INIT.BALL.X, y: INIT.BALL.Y },
        paddle: { p1: INIT.PADDLE1.Y, p2: INIT.PADDLE2.Y },
        score: { p1: 0, p2: 0},
        result: {},
        players: [{}, {}],
        eventHandler: new GameEventHandler(socket),
    });
}

function addEvents(game, setGame) {
    game.eventHandler.addKeyDownEvent(game.socket);
    game.eventHandler.addKeyUpEvent(game.socket);
    game.eventHandler.addRefreshEvent();
    game.eventHandler.addPageBackEvent(game, setGame);
}

function removeEvents(game) {
    game.eventHandler.removeKeyDownEvent();
    game.eventHandler.removeKeyUpEvent();
    game.eventHandler.removeRefreshEvent();
    game.eventHandler.removePageBackEvent();
}

function turnOnSocketChannels(game, setGame) {
    game.socket.turnOnRoomChannel(setGame);
    game.socket.turnOnGameChannel(setGame);
    game.socket.turnOnResultChannel(setGame);
}

function turnOffSocketChannels(game) {
    if (game.round > 1) {
        game.socket.turnOffRoomChannel();
        game.socket.turnOffGameChannel();
        game.socket.turnOffResultChannel();
    }
}

export default RemoteGame;