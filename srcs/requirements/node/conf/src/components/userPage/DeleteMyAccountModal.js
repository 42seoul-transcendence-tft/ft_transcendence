import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";
import Navbar from "../Navbar.js";
import { navigate } from "../../MyReact/MyReactRouter.js";
import notifyStatusById from "../utility/notifyStatusById.js"
import tokenRefresh from "../utility/tokenRefresh";
import closeModalById from "../utility/closeModalById.js"

async function deleteAccount() {
	try {
		const response = await fetch(`http://localhost:8000/api/withdraw`, {
			method: 'POST',
			credentials: 'include'
		});
		if (response.status === 200) {
			return "success";
		} else if (response.status === 401) {
			return await tokenRefresh(deleteAccount);
		} else {
			return Promise.reject("unknown");
		}
	} catch (error) {
		return Promise.reject(error);
	}
}

async function onClickDeleteAccount(event) {
	event.preventDefault();
	const input = document.querySelector("#delete-account-input");
	if (input.value === "delete") {
		closeModalById("delete-account-modal");
		try {
			await deleteAccount();
		} catch (error) {
			console.log("onClickDeleteAccount Error: ", error);
		}
		// fetch(`http://localhost:8000/api/withdraw`, {
		// 	method: 'POST',
		// 	credentials: 'include'
		// })
		// 	.then(response => {
		// 		if (response.status === 200) {
		// 			navigate("/");
		// 		} else {
		// 			notifyStatusById("delete failed!", false, "delete-account-status");
		// 		}
		// 	})
		// 	.catch(error => {
		// 		notifyStatusById("Network Error!", false, "delete-account-status");
		// 		console.log("in onClickDeleteAccount function", error);
		// 	});
	} else {
		notifyStatusById("input 'delete'", false, "delete-account-status");
	}
}

function DeleteMyAccountModal({ title, myId }) {
	return (
		<div className="fs-4">
			<button type="button" className="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#delete-account-modal">
				{title}
			</button>
			<div className="modal text-center" id="delete-account-modal">
				<div className="modal-dialog">
					<div className="modal-content">

						<div className="modal-header text-dark">
							<h4 className="modal-title">Are you sure you want to do this?</h4>
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
						</div>

						<div className="modal-body">
							<div className="container text-dark">
								Enter '<b className="text-danger"><i>delete</i></b>' to delete the account.
							</div>
							<form className="container my-1 py-1">
								<input id="delete-account-input" className="me-1" type="text" />
								<button type="button" className="btn btn-danger btn-md" onClick={onClickDeleteAccount}>
									delete Account
								</button>
							</form>
							<div id="delete-account-status" className="container mt-2 text-success">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DeleteMyAccountModal;
