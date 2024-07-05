import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";
import { navigate } from "../../MyReact/MyReactRouter.js";
import getUserData from "../utility/getUserData.js"
import getUserMatchRecords from "../utility/getUserMatchRecords.js"
import logout from "../utility/logout.js";

function MatchRecords({ userId }) {
	const [userMatchRecords, setUserMatchRecords] = useState([]);

	useEffect(() => {
		const a = async () => {
			try {
				const _userMatchRecords = await getUserMatchRecords(userId);
				setUserMatchRecords(() => _userMatchRecords);
			} catch (error) {
				console.log("MatchRecords Error: ", error);
				logout();
			}
		}
		a();
	}, [])

	return (
		<div>
			<div className="container fs-4">
				Match Records
			</div>
			<div
				className="pt-2 pb-2 border-top border-bottom rounded bg-secondary bg-opacity-25"
				style="height: 400px; overflow-y: auto;">
				{userMatchRecords.map((match) =>
					<MatchRecord match={match} userId={userId} />
				)}
			</div>
		</div>
	);
}

function MatchRecord({ match, userId }) {
	const isP1Win = match.p1_score > match.p2_score;
	const isUserP1 = match.p1 == userId;
	const isUserWin = (isUserP1 ? isP1Win : !isP1Win);

	const [p1Name, setP1Name] = useState("Player 1");
	const [p2Name, setP2Name] = useState("Player 2");
	matchTime(match.date);
	useEffect(() => {
		const a = async () => {
			try {
				let _p1Name = match.p1;
				let _p2Name = match.p2;
				if (match.p1) {
					const p1Data = await getUserData(match.p1);
					_p1Name = p1Data.name;
				}
				if (match.p2) {
					const p2Data = await getUserData(match.p2);
					_p2Name = p2Data.name;
				}
				setP1Name(() => _p1Name);
				setP2Name(() => _p2Name);
			} catch (error) {
				console.log("MatchRecord Error: ", error);
				logout();
			}
		}
		a();
	}, [match.p1, match.p2])
	return (
		<div
			className={"my-1 py-1 text-light text-center container bg-dark border-start rounded" + (isUserWin ? " border-success" : " border-danger")}
			style="user-select: none;">
			<div className="row">
				<div className="col-2">
					<div className={"my-3" + (isUserWin ? " text-success " : " text-danger ")}>
						<b>{isUserWin ? "Win" : "Lose"}</b>
					</div>
				</div>
				<div className="col-10 mt-1 py-1">
					<div className="row">
						<div id={``}
							className={"col-4 text-end " + (!p1Name ? "text-secondary" : "text-info")}
							style={!p1Name ? "" : "cursor: pointer;"}
							onClick={!p1Name ? null : event => onClickNameInMatchRecord(event, match.p1)}>
							{!p1Name ? "unknown" : p1Name}
						</div>
						<div className="col-4">{match.p1_score} vs {match.p2_score}</div>
						<div className={"col-4 text-start " + (!p2Name ? "text-secondary" : "text-info")}
							style={!p2Name ? "" : "cursor: pointer;"}
							onClick={!p2Name ? null : event => onClickNameInMatchRecord(event, match.p2)}>
							{!p2Name ? "unknown" : p2Name}
						</div>
					</div>
					<div>
						{matchTime(match.date)}
					</div>
				</div>
			</div>
		</div >
	);
}

function matchTime(timestamp) {
	const date = new Date(timestamp);
	return (`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
}

function onClickNameInMatchRecord(event, userId) {
	event.preventDefault();
	navigate(`/userpage?userId=${userId}`);
}

export default MatchRecords;