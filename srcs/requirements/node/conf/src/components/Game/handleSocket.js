import { useEffect, useState, MyReact } from "../..//MyReact/MyReact.js";
import { SOCKET, socket } from "../utility/socket.js";

function handleGameSocket(game) {
    socket.on(SOCKET.EVENT.GAME, (data) => handleGameEvent(data, game));
}

function handleGameEvent({ ball, paddle, score }, game) {
    if (game.score.p1 !== score[0] || game.score.p2 !== score[1])
        game.setScore((prev) => ({ ...prev, p1: score[0], p2: score[1] }));
    if (game.ball.x !== ball[0] || game.ball.y !== ball[1])
        game.setBall((prev) => ({ ...prev, x: ball[0], y: ball[1] }));
    if (game.paddle.p1 !== paddle[0] || game.paddle.p2 !== paddle[1])
        game.setPaddle((prev) => ({ ...prev, p1: paddle[0], p2: paddle[1] }));
}

export default handleGameSocket;