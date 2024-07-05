import { useEffect, useState, MyReact } from "../MyReact/MyReact.js";
import { Link } from "../MyReact/MyReactRouter.js";
import { navigate } from "../MyReact/MyReactRouter.js";
import getMyData from "./utility/getMyData.js";
import logout from "./utility/logout.js";
import getUserProfileImage from "./utility/getUserProfileImage.js";

const defaultMyData = {
	"id": 0,
	"name": "default",
	"email": "default@student.42seoul.kr",
	"avatar": "https://www.studiopeople.kr/common/img/default_profile.png",
	"exp": 0,
	"wins": 0,
	"losses": 0,
	"friends": []
}

function onClickShowMyInfo(userId) {
	navigate(`/userpage?userId=${userId}`);
}

function Navbar({ refresh }) {
	const [myData, setMyData] = useState(defaultMyData);

	useEffect(() => {
		const a = async () => {
			try {
				const _myData = await getMyData();
				const _myProfileImage = await getUserProfileImage(_myData.id);
				_myData.avatar = _myProfileImage;
				setMyData(() => _myData);
			} catch (error) {
				console.log("Navbar Error: ", error);
				logout();
			}
		};
		a();
	}, [refresh]);

	return (
		<div className="container-fluid bg-dark bg-opacity-75" style="user-select: none;">
			<div className="container">
				<nav className="navbar navbar-expand-sm navbar-dark">
					<div className="container-fluid">
						<Link to="/home" className="navbar-brand fs-4">42 Pong</Link>
						<div className="row">
							<div className="col">
								<img className="rounded-circle"
									style="object-fit: cover;" width="35" height="35"
									src={myData.avatar} />
							</div>
							<div className="dropdown col">
								<div className=" btn-primary btn-sm text-center text-light fs-4" style="cursor: pointer;" data-bs-toggle="dropdown">
									{myData.name}
								</div>
								<ul className="dropdown-menu" style="cursor: pointer;">
									<li className="dropdown-item" onClick={() => onClickShowMyInfo(myData.id)}>Show Info</li>
									<li className="dropdown-item text-danger" onClick={logout}>Logout</li>
								</ul>
							</div>
						</div>
					</div>
				</nav>
			</div>
		</div>
	);
}

export default Navbar;