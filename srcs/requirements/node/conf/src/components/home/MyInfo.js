import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";

function MyInfo({ myData }) {
	const expWidth = `width:${(myData.exp % 1000) / 10}%`;
	const winRateWidth = myData.wins + myData.losses === 0 ?
		"width:0%" : `width:${(myData.wins / (myData.wins + myData.losses)) * 100}%`;
	return (
		<div>
			<div className="fs-4 mb-1">
				My Info
			</div>
			<div className="container mb-3 pt-2 pb-2 border-top border-bottom text-center rounded bg-secondary bg-opacity-25">
				<div className="row mt-1 mb-1 bg-dark bg-opacity-75">
					<div className="col-4 text-center">Nickname</div>
					<div className="col-8">{myData.display_name}</div>
				</div>
				<div className="row mt-1 mb-1 bg-dark bg-opacity-75">
					<div className="col-4 text-center">Level</div>
					<div className="col-8">{Math.round(myData.exp / 1000)}</div>
				</div>
				<div className="row mt-1 mb-1 bg-dark bg-opacity-75">
					<div className="col-4 text-center">Exp</div>
					<div className="col-8 pt-1">
						<div className="progress" style="height:20px">
							<div className="progress-bar" style={expWidth}>{(myData.exp % 1000) / 10}%</div>
						</div>
					</div>
				</div>
				<div className="row mt-1 mb-1 bg-dark bg-opacity-75">
					<div className="col-4 text-center">Total</div>
					<div className="col-8">{myData.wins + myData.losses}</div>
				</div>
				<div className="row mt-1 mb-1 bg-dark bg-opacity-75">
					<div className="col-4 text-center">Win</div>
					<div className="col-8">{myData.wins}</div>
				</div>
				<div className="row mt-1 mb-1 bg-dark bg-opacity-75">
					<div className="col-4 text-center">Lose</div>
					<div className="col-8">{myData.losses}</div>
				</div>
				<div className="row mt-1 mb-1 bg-dark bg-opacity-75">
					<div className="col-4 text-center">WR</div>
					<div className="col-8 pt-1">
						<div className="progress" style="height:20px">
							<div className="progress-bar" style={winRateWidth}>
								{myData.wins + myData.losses === 0 ? "0%" : `${Math.round((myData.wins / (myData.wins + myData.losses)) * 100)}%`}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default MyInfo;
