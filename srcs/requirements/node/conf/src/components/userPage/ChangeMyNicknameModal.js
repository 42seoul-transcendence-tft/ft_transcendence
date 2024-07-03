import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";
import tokenRefresh from "../utility/tokenRefresh.js"
import notifyStatusById from "../utility/notifyStatusById.js"

function ChangeMyNicknameModal({ myId }) {
	return (
		<div className="fs-4">
			<button type="button" className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#change-name-modal">
				Change nickname
			</button>
			<div className="modal text-center" id="change-name-modal">
				<div className="modal-dialog">
					<div className="modal-content">

						<div className="modal-header text-dark">
							<h4 className="modal-title">Change Your nickname!</h4>
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
						</div>

						<div className="modal-body">
							<form className="container my-1 py-1">
								<input id="change-name-input" className="me-1" type="text" placeholder="Your new nickname" autocomplete="off" />
								<button className="btn btn-primary btn-md" onClick={event => onClickChangeNickname(event, myId)}>Submit</button>
							</form>
							<div id="change-name-status" className="container mt-2 text-success"></div>
						</div>

					</div>
				</div>
			</div>
		</div>
	);
}

function isNonAlphanumeric(newNickname) {
	const alphanumericRegex = /^[a-zA-Z0-9]*$/;
	return !alphanumericRegex.test(newNickname);
}

async function changeNickname(myId, newNickname) {
	try {
		const response = await fetch(`/user/api/users/${myId}/`, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				display_name: newNickname
			})
		});
		if (response.status === 200) {
			return await response.json();
		} else if (response.status === 401) {
			return await tokenRefresh(() => changeNickname(myId, newNickname));
		} else if (response.status === 400) {
			return Promise.reject("This nickname already exists");
		} else {
			return Promise.reject("unknown");
		}
	} catch (error) {
		return Promise.reject("network");
	}
}

async function onClickChangeNickname(event, myId) {
	event.preventDefault();
	const newNickname = document.querySelector("#change-name-input").value;
	if (newNickname.length < 2) {
		notifyStatusById("name too short!", false, "change-name-status");
	} else if (newNickname.length > 16) {
		notifyStatusById("name too long!", false, "change-name-status");
	} else if (isNonAlphanumeric(newNickname)) {
		notifyStatusById("Only alphabets and numbers are available", false, "change-name-status");
	} else {
		try {
			await changeNickname(myId, newNickname);
			let nicknameElement = document.querySelector("#userpage-statchart-nickname");
			notifyStatusById("successfully changed!", true, "change-name-status");
			nicknameElement.innerText = newNickname;
		} catch (error) {
			console.log("onClickChangeNickname error:", error);
			notifyStatusById(error, false, "change-name-status");
		}
	}
}

export default ChangeMyNicknameModal;
