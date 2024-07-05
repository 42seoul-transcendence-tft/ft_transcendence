import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";
import { navigate } from "../../MyReact/MyReactRouter.js";
import TopLine from "./TopLine.js";
import Title from "./Title.js";
import Player from "./Player.js";
import BottomLine from "./BottomLine.js";
import QuitPopUp from "./QuitPopUp.js";
import { pongSocket, mttSocket } from "../RemoteGame/GameSocket.js";
import { GAME } from "../RemoteGame/constant.js";
import "../../css/room/room.css";

function Room(props) {
    try {
        const [ room, setRoom ] = useState(getInitialRoomData(props));

        useEffect(() => {
            room.socket.sendRoomJoinMessage(room.myId, room.title);
            room.socket.turnOnRoomChannel(setRoom);
        }, []);
        return (
            <div className="container-fluid" id="room-page">
                <TopLine />
                <Title room={ room } />
                <Player room={ room } />
                <BottomLine setFunction={ setRoom } />
                <QuitPopUp data={ room } setFunction={ setRoom } /> 
            </div>
        );
    }
    catch (error) {
        alert(error);
        navigate("/home");
    }
}

function getInitialRoomData(props) {
    if (!props.room)
        throw new Error("Can't access the room");
    const room = props.room;

    return ({ 
        myId: props.myId,
        title: room.name,
        type: !room.mtt ? GAME.TYPE.PONG : GAME.TYPE.MTT,
        socket: !room.mtt ? pongSocket : mttSocket,
        players: !room.mtt ? [{}, {}] : [{}, {}, {}, {}],
        isQuitClicked: false,
    });
}

export default Room;