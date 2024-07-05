import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";
import logout from "../utility/logout.js";
import tokenRefresh from "../utility/tokenRefresh.js";
import getUserProfileImage from "../utility/getUserProfileImage.js";
import notifyStatusById from "../utility/notifyStatusById.js"

function ChangeProfileImageModal({ myId, setRefreshUpper }) {
	const [imageUrl, setImageUrl] = useState();
	const [refreshThis, setRefreshThis] = useState();

	async function onChangeImageUpload(event) {
		event.preventDefault();
		const { files } = event.target;
		const uploadFile = files[0];
		if (uploadFile) {
			const reader = new FileReader();
			reader.readAsDataURL(uploadFile);
			reader.onloadend = () => {
				setImageUrl(() => reader.result);
			}
		} else {
			setRefreshThis(current => !current);
		}
	}

	useEffect(() => {
		const a = async () => {
			try {
				const _imageUrl = await getUserProfileImage(myId);
				setImageUrl(() => _imageUrl);
			} catch (error) {
				console.log("ChangeProfileImageModal Error: ", error);
				logout();
			}
		}
		a();
	}, [refreshThis]);
	return (
		<div className="fs-4">
			<button type="button" className="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#change-profile-image-modal">
				Change profile image
			</button>
			<div className="modal text-center" id="change-profile-image-modal">
				<div className="modal-dialog">
					<div className="modal-content">

						<div className="modal-header text-dark">
							<h4 className="modal-title">Change Your Profile image!</h4>
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
						</div>

						<div className="modal-body">
							<div className="text-center">
								<img src={imageUrl} className="rounded-circle" img="img" style="object-fit: cover; width: 150px; height: 150px;" />
							</div>
							<div className="d-flex container px-4 mt-2">
								<input className="form-control" type="file" id="change-profile-image-input" onChange={onChangeImageUpload} />
								<button className="btn btn-primary" onClick={event => onClickChangeProfileImageSubmit(event, myId, setRefreshUpper)}>Submit</button>
							</div>
						</div>
						<div id="change-profile-image-status" className="container mb-2 text-success"></div>
					</div>
				</div>
			</div>
		</div>
	);
}

async function changeProfileImage(myId) {
	try {
		const input = document.querySelector("#change-profile-image-input");
		const file = input.files[0];
		if (!file) return "no file";
		const formData = new FormData();
		formData.append("avatar", file);
		const response = await fetch(`/user/api/users/${myId}/`, {
			method: 'PATCH',
			credentials: 'include',
			body: formData
		});
		if (response.status === 200) {
			return "success";
		} else if (response.status === 401) {
			return await tokenRefresh(() => changeProfileImage(myId));
		} else {
			return Promise.reject("unknown");
		}
	} catch (error) {
		console.log("changeProfileImage Error: ", error);
		return Promise.reject(error);
	}
}

async function onClickChangeProfileImageSubmit(event, myId, setRefreshUpper) {
	event.preventDefault();
	try {
		const result = await changeProfileImage(myId);
		if (result === "success") {
			notifyStatusById("successfully changed!", true, "change-profile-image-status");
			setRefreshUpper(current => !current);
		} else {
			notifyStatusById("no file!", false, "change-profile-image-status");
		}
	} catch (error) {
		console.log("onClickChangeProfileImageSubmit Error: ", error);
		logout();
	}
}

export default ChangeProfileImageModal;
