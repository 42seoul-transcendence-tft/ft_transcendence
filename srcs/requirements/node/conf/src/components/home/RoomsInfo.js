import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";
import { navigate } from "../../MyReact/MyReactRouter.js";
import logout from "../utility/logout.js";
import getRoomsData from "../utility/getRoomsData.js"
import CreateRoomModal from "./CreateRoomModal.js"

function RoomsInfo({ myId }) {
	const [rooms, setRooms] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const a = async () => {
			try {
				const _rooms = await getRoomsData();
				setRooms(() => _rooms);
				setLoading(() => false);
			} catch (error) {
				console.log("HomeMatches Error: ", error);
				logout();
			}
		};
		a();
	}, []);

	return (
		<div>
			<div className="fs-4 row mb-1">
				<div className="container col-6">
					<div className="d-flex flex-row">
						<div className="fs-4">
							Matches
						</div>
						<div className="ms-2 mt-2 fs-6">
							created: {rooms.length}
						</div>
					</div>
				</div>
				<div className="container col-6 text-end pe-4 d-flex flex-row-reverse align-items-center">
					<CreateRoomModal myId={myId} />
					<RefreshRoomButton setRooms={setRooms} />
				</div>
			</div>
			<div
				className="container pt-2 pb-2 border-top border-bottom rounded bg-secondary bg-opacity-25"
				style="height: 674px; overflow-y: auto;">
				{loading ?
					<div className="d-flex justify-content-center" style="height:100%">
						<div className="d-flex align-items-center">
							<div className="spinner-border text-primary"></div>
						</div>
					</div>
					:
					<div>
						{rooms
							.filter(room => room.cur_users !== room.max_users && room.in_game === false)
							.map((room) => (
								<RoomInfo key={room.id} myId={myId} room={room} active={true} setRooms={setRooms} />
							))}
						{rooms
							.filter(room => room.cur_users === room.max_users || room.in_game === true)
							.map((room) => (
								<RoomInfo key={room.id} myId={myId} room={room} active={false} setRooms={setRooms} />
							))}
					</div>
				}
			</div>
		</div >
	);
}

function RefreshRoomButton({ setRooms }) {
	async function onClickRefreshRoomButton(event) {
		event.preventDefault();
		try {
			const _rooms = await getRoomsData();
			setRooms(() => _rooms);
		} catch (error) {
			console.log("HomeMatches Error: ", error);
			logout();
		}
	}
	return (
		<div className="d-flex justify-content-center bg-primary rounded me-1" style="height:30px; width:30px; cursor: pointer;">
			<div className="d-flex align-items-center">
				<img src="https://10.15.6.2:4242/images/refresh.png" onClick={onClickRefreshRoomButton} style="height:25px; width:25px;" />
			</div>
		</div>
	);
}

function isRoomFull(room) {
	if (room.max_users <= room.cur_users) return true;
	return false;
}

function isAlreadyEnteredRoom(room, myId) {
	if (room.p1 === myId || room.p2 === myId || room.p3 === myId || room.p4 === myId) return true;
	return false;
}

function isStartedRoom(room) {
	if (room.in_game === true) return true;
	return false;
}

async function onClickEnterRoom(event, room, myId, setRooms) {
	event.preventDefault();
	const roomId = room.id;
	const title = room.name;
	const roomType = room.mtt ? "mtt" : "pong";
	try {
		const currentRooms = await getRoomsData();
		const currentRoom = currentRooms.find(room => room.id === roomId);
		if (currentRoom === undefined) {
			alert("This room disappeared");
			setRooms(() => currentRooms);
		} else if (isRoomFull(currentRoom)) {
			alert("This room is full");
			setRooms(() => currentRooms);
		} else if (isAlreadyEnteredRoom(currentRoom, myId)) {
			alert("you've already entered");
			setRooms(() => currentRooms);
		} else if (isStartedRoom(currentRoom)) {
			alert("game has already started");
			setRooms(() => currentRooms);
		} else {
			navigate("/room", { room: currentRoom, myId: myId });
		}
	} catch (error) {
		console.log("onClickEnterRoom Error: ", error);
		logout();
	}
}

function RoomInfo({ room, myId, active, setRooms }) {
	const opt1 = "container rounded text-center my-2 py-3 text-light border bg-primary";
	const opt2 = "container rounded text-center my-2 py-3 text-light border bg-secondary";
	const [mouseEntered, setMouseEntered] = useState(false);
	function MouseEnter() {
		setMouseEntered(() => true);
	}
	function MouseLeave() {
		setMouseEntered(() => false);
	}
	if (!mouseEntered || active === false) {
		return (
			<div className={active === true ? opt1 : opt2} style="height: 82px; user-select: none;" onMouseEnter={MouseEnter} onMouseLeave={MouseLeave}>
				<div className="container-fluid">{room.name}</div>
				<div className="row">
					<div className="col-6">
						{room.mtt === true ? "Tournerment" : "1 vs 1"}
					</div>
					<div className="col-6">
						{room.cur_users} / {room.max_users}
					</div>
				</div>
			</div>
		);
	} else {
		return (
			<div className="my-2 py-4 fs-4 text-center bg-primary rounded border"
				style="height: 82px; user-select: none; cursor: pointer;"
				onMouseEnter={MouseEnter} onMouseLeave={MouseLeave}
				onClick={event => onClickEnterRoom(event, room, myId, setRooms)}
			>
				<div>
					Enter Room
				</div>
			</div>
		);
	}
}

export default RoomsInfo;