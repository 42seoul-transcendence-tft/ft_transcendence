import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";
import Navbar from "../Navbar.js";
import MyInfo from "./MyInfo.js";
import FriendsInfo from "./FriendsInfo.js";
import RoomsInfo from "./RoomsInfo.js";
import getMyData from "../utility/getMyData.js";
import logout from "../utility/logout.js";

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

function Home() {
	const [myData, setMyData] = useState(defaultMyData);

	useEffect(() => {
		const a = async () => {
			try {
				const _myData = await getMyData();
				setMyData(() => _myData);
			} catch (error) {
				console.log("Home Error: ", error);
				logout();
			}
		}
		a();
	}, []);

	return (
		<div style="user-select: none;">
			<Navbar />
			<div className="container text-light">
				<div className="row mt-3">
					<div className="col-md-5">
						<MyInfo myData={myData} />
						<FriendsInfo />
					</div>
					<div className="col-md-7">
						<RoomsInfo myId={myData.id} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
