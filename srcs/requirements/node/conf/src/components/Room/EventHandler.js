import { MyReact } from "../../MyReact/MyReact.js";
import RoomStateSetter from "./StateSetter.js";
import logout from "../utility/logout.js";
import { SOCKET } from "../RemoteGame/constant.js";

class RoomSocketEventHandler {
    setRoomEvent(setPlayers, socket) {
        this.#roomEvent = async (newPlayers) => {
            try {
                await RoomStateSetter.setPlayers(newPlayers, setPlayers);
            }
            catch (error) {
                console.log("Room Error:", error);
                socket.emit(SOCKET.EVENT.LEAVE_ROOM);
                logout();
            }
        };
    }
    get roomEvent() {
        return (this.#roomEvent);
    }
    #roomEvent;
}

export default RoomSocketEventHandler; 