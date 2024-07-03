import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";
import getUserData from "../utility/getUserData.js";
import logout from "../utility/logout.js";
import tokenRefresh from "../utility/tokenRefresh.js";

function BioMessage({ userId, isMyPage }) {
	const [userData, setUserData] = useState("");
	const [refresh, setRefresh] = useState(true);
	const [isInputMode, setIsInputMode] = useState(false);

	useEffect(() => {
		const a = async () => {
			try {
				const _userData = await getUserData(userId);
				setUserData(() => _userData);
			} catch (error) {
				console.log("BioMessage Error: ", error);
				logout();
			}
		}
		if (userId > 0) {
			a();
		}
	}, [userId, refresh]);

	async function onClickEditBio(event) {
		event.preventDefault();
		const newBioMessage = document.querySelector("#bio-input");
		newBioMessage.value = userData.introduce;
		setIsInputMode(current => !current);
	}

	async function onClickSaveBio(event) {
		event.preventDefault();
		setIsInputMode(current => !current);
		const newBioMessage = document.querySelector("#bio-input").value;
		try {
			await changeBioMessage(newBioMessage, userId);
			setRefresh(current => !current);
		} catch (error) {
			console.log("onClickSaveBio Error: ", error);
			logout();
		}
	}

	return (
		<div>
			<div className="container d-flex align-items-end my-1">
				<div className="constainer fs-4">
					Bio
				</div>
				{isMyPage ?
					<div className="btn-group ms-3">
						<div className={"btn btn-primary btn-sm " + (isInputMode ? "disabled" : "")} onClick={onClickEditBio}>Edit</div>
						<div className={"btn btn-primary btn-sm " + (isInputMode ? "" : "disabled")} onClick={onClickSaveBio}>Save</div>
					</div> : <div></div>
				}
			</div>
			<div
				className="pt-2 pb-2 border-top border-bottom rounded bg-secondary bg-opacity-25"
				style="height: 120px; overflow-y: auto;">
				<textarea id="bio-input" input={userData.introduce} className="rounded" maxLength={200}
					style={"height:92%; width: 100%; resize: none;" + (isInputMode ? "" : " display: none;")} />
				<div id="bio-display" className="container"
					style={"height: 100%; white-space: wrap; word-break: break-all;" + (isInputMode ? " display: none;" : "")}>
					{userData.introduce}
				</div>
			</div>
		</div >
	);
}

async function changeBioMessage(newBioMessage, myId) {
	try {
		const response = await fetch(`/user/api/users/${myId}/`, {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				introduce: newBioMessage
			})
		});
		if (response.status === 200) {
			return;
		} else if (response.status === 401) {
			return (tokenRefresh(() => changeBioMessage(newBioMessage, myId)));
		} else {
			return Promise.reject("unknown");
		}
	} catch (error) {
		console.log("onClickSaveBio Error: ", error);
		return Promise.reject(error);
	}
}

export default BioMessage;
