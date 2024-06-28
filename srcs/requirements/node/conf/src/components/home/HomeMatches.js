import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";
import { navigate } from "../../MyReact/MyReactRouter.js";
import tokenRefresh from "../utility/tokenRefresh.js";
import logout from "../utility/logout.js";
import modalCloseById from "../utility/modalClose.js";

function HomeMatches({ myId }) {
	const [rooms, setRooms] = useState([]);
	useEffect(async () => {
		try {
			const _rooms = await getOpenRooms();
			setRooms(() => _rooms);
		} catch (error) {
			console.log("HomeMatches Error: ", error);
			logout();
		}
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
				<div className="container col-6 text-end pe-4 d-flex flex-row-reverse">
					<CreateRoomModal myId={myId} />
					<RefreshRoomButton setRooms={setRooms} />
				</div>
			</div>
			<div
				className="container pt-2 pb-2 border-top border-bottom rounded bg-secondary bg-opacity-25"
				style="height: 574px; overflow-y: auto;">
				<div>
					{rooms
						.filter(room => room.cur_users !== room.max_users && room.in_game === false)
						.map((room) => (
							<HomeMatchInfo myId={myId} room={room} active={true} setRooms={setRooms} />
						))}
					{rooms
						.filter(room => room.cur_users === room.max_users || room.in_game === true)
						.map((room) => (
							<HomeMatchInfo myId={myId} room={room} active={false} setRooms={setRooms} />
						))}
				</div>
			</div>
		</div>
	);
}

async function getOpenRooms() {
	try {
		const response = await fetch("http://localhost:8001/api/rooms/", {
			method: 'GET',
			credentials: 'include'
		});
		if (response.status === 200) {
			return await response.json();
		} else if (response.status === 403) {//엑세스토큰 만료됐을 때
			const data = await response.json();
			if (data.detail === "Authentication credentials were not provided.") {
				return await tokenRefresh(getOpenRooms);
			} else {
				return Promise.reject({ reason: "unknown" });
			}
		} else {
			return Promise.reject({ reason: "unknown" });
		}
	} catch (error) {
		console.log("getOpenRooms Error: ", error);
		return Promise.reject({ reason: "network" });
	}
}

function RefreshRoomButton({ setRooms }) {
	async function onClickRefreshRoomButton(event, setRooms) {
		event.preventDefault();
		try {
			const _rooms = await getOpenRooms();
			setRooms(() => _rooms);
		} catch (error) {
			console.log("HomeMatches Error: ", error);
			logout();
		}
	}
	return (
		<button type="button" className="btn btn-sm btn-primary me-2" onClick={event => onClickRefreshRoomButton(event, setRooms)}>
			Refresh
		</button>
	);
}

async function createRoom(title, roomType) {
	try {
		const response = await fetch("http://localhost:8001/api/rooms/", {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: title,
				mtt: (roomType === "mtt" ? true : false)
			})
		});
		if (response.status === 200 || response.status === 201) {
			return;
		} else if (response.status === 400) {//같은 이름의 방이 이미 있음
			return Promise.reject({ reason: "same room" });
		} else if (response.status === 401) {//???!!! 백엔드에서 401로 바꿔주면 403은 지워야함
			return await tokenRefresh(() => createRoom(title, roomType));
		} else if (response.status === 403) {
			const data = await response.json();
			if (data.detail === "Authentication credentials were not provided.") {
				return await tokenRefresh(() => createRoom(title, roomType));
			} else {
				return Promise.reject({ reason: "unknown" });
			}
		} else {
			return Promise.reject({ reason: "unknown" });
		}
	} catch (error) {
		console.log("createRoom Error: ", error);
		return Promise.reject({ reason: "network" });
	}
}

async function onCreateNewRoomSubmit(event, myId) {
	event.preventDefault();
	let title = document.querySelector("#create-room-input").value;
	const roomType = document.querySelector("input[name='optradio']:checked").value;
	if (title === "") {
		title = (roomType === "pong" ? "Let's play 1:1 with me" : "Let's play a tournament");
	}
	try {
		await createRoom(title, roomType);
		modalCloseById("create-room-modal");
		navigate(`/room?title=${title}&myId=${myId}&type=${roomType}`);
	} catch (error) {
		console.log("onCreateNewRoomSubmit Error: ", error);
		if (error.reason === "same room") {
			modifyCommentMsg("Using Room name", false)
			setTimeout(() => modifyCommentMsg("", true), 3000);
		} else {
			modalCloseById("create-room-modal");
			logout();
		}
	}
}

function modifyCommentMsg(msg, isSuccess) {
	const comment = document.querySelector("#create-room-status");
	if (comment) {
		comment.classList.remove("text-success");
		comment.classList.remove("text-danger");
		comment.innerText = msg;
		if (isSuccess === true) {
			comment.classList.add("text-success");
		} else {
			comment.classList.add("text-danger");
		}
	}
}

function CreateRoomModal({ myId }) {
	return (
		<div>
			<button type="button" className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#create-room-modal">
				Create Room
			</button>
			<div className="modal" id="create-room-modal">
				<div className="modal-dialog">
					<div className="modal-content">

						<div className="modal-header text-dark">
							<h4 className="modal-title">Create New Room</h4>
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
						</div>

						<div className="modal-body">
							<div className="row">
								<div className="col-2"></div>
								<div className="col-10">
									<form className="text-start">
										<div className="form-check">
											<input type="radio" className="form-check-input" id="radio1" name="optradio" value="pong" checked />
											<label className="form-check-label text-dark" for="radio1">1 vs 1</label>
										</div>
										<div className="form-check">
											<input type="radio" className="form-check-input" id="radio2" name="optradio" value="mtt" />
											<label className="form-check-label text-dark" for="radio2">Tournerment(4P)</label>
										</div>
										<input id="create-room-input" className="me-1" type="text" placeholder="Room name" />
									</form>
									<div className="d-flex">
										<div id="create-room-status" className="container mt-2 text-success flex-fill text-center"></div>
										<button className="btn btn-primary btn-md flex-fill" onClick={event => onCreateNewRoomSubmit(event, myId)}>Submit</button>
									</div>
								</div>
							</div>
						</div>

					</div>
				</div>
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
	const roomId = room.id;
	const title = room.name;
	const roomType = room.mtt ? "mtt" : "pong";
	event.preventDefault();
	try {
		const currentRooms = await getOpenRooms();
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
			console.log("asdqwezxc");
			navigate(`/room?title=${title}&myId=${myId}&type=${roomType}`);
		}
	} catch (error) {
		console.log("onClickEnterRoom Error: ", error);
	}
}

function HomeMatchInfo({ room, myId, active, setRooms }) {
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

export default HomeMatches;