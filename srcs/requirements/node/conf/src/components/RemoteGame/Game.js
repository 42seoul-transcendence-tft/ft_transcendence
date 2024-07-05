import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";
import { navigate } from "../../MyReact/MyReactRouter.js";
import TopLine from "../Room/TopLine.js";
import ScoreBoard from "./ScoreBoard.js";
import GameBoard from "./GameBoard.js";
import BottomLine from "./BottomLine.js";
import { pongSocket, mttSocket } from "./GameSocket.js";
import { GameEventHandler } from "./EventHandler.js";
import { INIT, GAME } from "./constant.js";
import "../../css/game/game-page.css";

function RemoteGame({ data }) {
    try {
        const [ game, setGame ] = useState(getInitialGameData(data));

        useEffect(() => {
            addScreenEffect();
            addEvents(game, setGame); 
            turnOnSocketChannels(game, setGame);
            return (() => {
                removeScreenEffect();
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
            </div>
        );
    }
    catch (error) {
        alert(error);
        navigate("/home");
    }
}

function getInitialGameData(data) {
    if (!data) 
        throw new Error("Can't access the game");
    const socket = data.type === GAME.TYPE.PONG ? pongSocket : mttSocket;

    return ({
        socket: socket,
        type: data.type,
        myId: data.myId,
        round: data.gameRound,
        ball: { x: INIT.BALL.X, y: INIT.BALL.Y, image: getBallImage() },
        paddle: { p1: INIT.PADDLE1.Y, p2: INIT.PADDLE2.Y },
        score: [0, 0],
        result: {},
        players: [{}, {}],
        eventHandler: new GameEventHandler(socket),
    });
}

export function addScreenEffect() {
    document.body.id = "screen-effect";
}

export function removeScreenEffect() {
    document.body.id = "";
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

export function getBallImage() {
    const path = "https://10.15.6.2:4242/images/ball/";
    const images = [
        "abstract-1.jpg", "abstract-2.jpg", 
        "abstract-3.jpg", "abstract-4.jpg",
        "42-1.png", "42-2.png"
    ];
    const imageIndex = Math.floor(Math.random() * images.length);

    return (path + images[imageIndex]);
}

export default RemoteGame;