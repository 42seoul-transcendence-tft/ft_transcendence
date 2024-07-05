import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";
import { navigate } from "../../MyReact/MyReactRouter.js";
import notifyStatusById from "../utility/notifyStatusById.js"
import tokenRefresh from "../utility/tokenRefresh";
import closeModalById from "../utility/closeModalById.js"

async function deleteAccount() {
	try {
		const response = await fetch(`/user/api/withdraw`, {
			method: 'POST',
			credentials: 'include'
		});
		if (response.status === 200) {
			return;
		} else if (response.status === 401) {
			return await tokenRefresh(deleteAccount);
		} else {
			return Promise.reject("unknown");
		}
	} catch (error) {
		console.log("deleteAccount Error: ", error);
		return Promise.reject(error);
	}
}

async function onClickDeleteAccount(event) {
	event.preventDefault();
	const input = document.querySelector("#delete-account-input");
	if (input.value === "delete") {
		try {
			await deleteAccount();
			closeModalById("delete-account-modal");
			navigate("/login");
		} catch (error) {
			console.log("onClickDeleteAccount Error: ", error);
			notifyStatusById(error, false, "delete-account-status");
		}
	} else {
		notifyStatusById("input 'delete'", false, "delete-account-status");
	}
}

function DeleteMyAccountModal() {
	return (
		<div className="fs-4">
			<button type="button" className="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#delete-account-modal">
				delete Account
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
								<input id="delete-account-input" className="me-1" type="text" autocomplete="off" />
								<button className="btn btn-danger btn-md" onClick={onClickDeleteAccount}>
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
