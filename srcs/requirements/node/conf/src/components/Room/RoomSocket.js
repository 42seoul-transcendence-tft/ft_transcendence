import {io} from "socket.io-client";
import { GAME, SOCKET, URL_PATH } from "../RemoteGame/constant.js";
import RoomSocketEventHandler from "./EventHandler.js";

class RoomSocket {
    constructor (gameType) {
        const socketOption = this.#getSocketOption(true, true, ['websocket'], true);

        this.#setSocket(gameType, socketOption);
        this.#eventHandler = new RoomSocketEventHandler;
    }
    sendRoomJoinMessage(id, title) {
        this.socket.emit(SOCKET.EVENT.JOIN_ROOM, { pid: id, room: title });
    }
    sendRoomLeaveMessage() {
        this.socket.emit(SOCKET.EVENT.LEAVE_ROOM);
    }
    sendReadyStatus(readyStatus) {
        this.socket.emit(SOCKET.EVENT.READY, readyStatus);
    }
    turnOnRoomChannel(setPlayers) {
        this.#eventHandler.setRoomEvent(setPlayers, this.socket);
        this.socket.off(SOCKET.EVENT.ROOM);
        this.socket.on(SOCKET.EVENT.ROOM, this.#eventHandler.roomEvent);
    }
    turnOffRoomChannel() {
        this.socket.off(SOCKET.EVENT.ROOM, this.#eventHandler.roomEvent);
    }
    #getSocketOption(reconnection, autoConnect, transports, secure) {
        const socketOption = { reconnection, autoConnect, transports, secure};

        return (socketOption);
    }
    #setSocket(gameType, socketOption) {
        if (gameType === GAME.TYPE.PONG)
            this.socket = io(URL_PATH.SOCKET.PONG, socketOption);
        else
            this.socket = io(URL_PATH.SOCKET.MTT, socketOption);
    }
    socket;
    #eventHandler;
}

export default RoomSocket;