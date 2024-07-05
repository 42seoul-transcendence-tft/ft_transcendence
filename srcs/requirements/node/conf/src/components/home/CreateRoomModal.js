import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";
import { navigate } from "../../MyReact/MyReactRouter.js";
import tokenRefresh from "../utility/tokenRefresh.js";
import closeModalById from "../utility/closeModalById.js";
import notifyStatusById from "../utility/notifyStatusById.js"
import logout from "../utility/logout.js";

function CreateRoomModal({ myId }) {
	const [local, setLocal] = useState(false);
	function onClickLocalOn() {
		setLocal(() => true);
	}
	function onClickLocalOff() {
		setLocal(() => false);
	}
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
											<input type="radio" className="form-check-input" id="radio1" name="optradio" value="pong" checked onClick={onClickLocalOff} />
											<label className="form-check-label text-dark" for="radio1">1 vs 1 (net)</label>
										</div>
										<div className="form-check">
											<input type="radio" className="form-check-input" id="radio2" name="optradio" value="mtt" onClick={onClickLocalOff} />
											<label className="form-check-label text-dark" for="radio2">Tournerment (net)</label>
										</div>
										<div className="form-check">
											<input type="radio" className="form-check-input" id="radio3" name="optradio" value="local" onClick={onClickLocalOn} />
											<label className="form-check-label text-dark" for="radio3">1 vs 1 (Local)</label>
										</div>
										<div className="row">
											{local ? <div className="col-8"></div>
												:
												<div className="col-8">
													<input id="create-room-input" className="me-1" type="text" placeholder="Room name" autocomplete="off" style="width:100%; height:38px;" />
												</div>}
											<div className="col-4">
												<button className="btn btn-primary btn-md flex-fill" onClick={event => onCreateNewRoomSubmit(event, myId)}>Submit</button>
											</div>
										</div>
										<div id="create-room-status" className="container mt-2 text-success flex-fill text-center"></div>
									</form>
								</div>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
	);
}

async function createRoom(title, roomType) {
	try {
		const response = await fetch("/game/api/rooms/", {
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
			return await response.json();
		} else if (response.status === 400) {//같은 이름의 방이 이미 있음
			return Promise.reject("same room");
		} else if (response.status === 401) {
			return await tokenRefresh(() => createRoom(title, roomType));
		} else if (response.status === 403) {
			const data = await response.json();
			if (data.detail === "Authentication credentials were not provided.") {
				return await tokenRefresh(() => createRoom(title, roomType));
			} else {
				return Promise.reject("unknown");
			}
		} else {
			return Promise.reject("unknown");
		}
	} catch (error) {
		console.log("createRoom Error: ", error);
		return Promise.reject(error);
	}
}

async function onCreateNewRoomSubmit(event, myId) {
	event.preventDefault();
	const roomType = document.querySelector("input[name='optradio']:checked").value;
	if (roomType === "local") {//로컬 방의 경우
		closeModalById("create-room-modal");
		navigate("/local_game");
	} else {//온라인 방의 경우
		let title = document.querySelector("#create-room-input").value;
		if (title === "") {
			title = (roomType === "pong" ? "Let's play 1:1 with me" : "Let's play a tournament");
		}
		try {
			const roomData = await createRoom(title, roomType);
			closeModalById("create-room-modal");
			navigate("/room", { room: roomData, myId: myId });
		} catch (error) {
			console.log("onCreateNewRoomSubmit Error: ", error);
			if (error === "same room") {
				notifyStatusById("Using Room name", false, "create-room-status");
			} else {
				closeModalById("create-room-modal");
				logout();
			}
		}
	}
}

export default CreateRoomModal;