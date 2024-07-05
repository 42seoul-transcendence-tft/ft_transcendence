import { MyReact } from "../../MyReact/MyReact.js";
import getUserData from "../utility/getUserData.js";
import getUserProfileImage from "../utility/getUserProfileImage.js";

class RoomStateSetter {
    static async setPlayers(newPlayers, playerSetter) {
        const newPlayersArray = Object.values(newPlayers);

        await updatePlayers(newPlayersArray, playerSetter);
        updateReadyStatus(newPlayersArray, playerSetter);;;
    }
}

async function updatePlayers(newPlayers, playerSetter) {
    const promises = newPlayers.reduce((promises, newPlayer) => {
        if (newPlayer.pid) {
            promises.push(getUserData(newPlayer.pid));
            promises.push(getUserProfileImage(newPlayer.pid));
        }
        else 
            promises.push(Promise.resolve(null));
        return (promises);
    }, []);;
    const promiseResults = await Promise.all(promises);
    const updatedPlayers = [];
    for (let i = 0; i < promiseResults.length; i++) {
        if (promiseResults[i]) 
            updatedPlayers.push({ ...promiseResults[i], photoURL: promiseResults[++i] });
        else
            updatedPlayers.push({});
    }
    playerSetter((prev) => ({...prev, players: updatedPlayers}));
} 

function updateReadyStatus(newPlayers, playerSetter) {
    newPlayers.forEach((newPlayer, index) => {
        if (newPlayer.pid) {
            playerSetter((prev) => ({ ...prev, players: prev.players.map((player, i) => (
                    i === index ? { ...player, ready: newPlayer.ready } : player))
            }));
        }
    });
}

export default RoomStateSetter;