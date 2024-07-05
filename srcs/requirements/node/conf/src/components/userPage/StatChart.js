import { useEffect, useState, MyReact } from "../../MyReact/MyReact.js";
import ChangeProfileImageModal from "./ChangeProfileImageModal.js";

function StatChart({ userData, myId, setRefresh }) {
	const level = Math.floor(userData.exp / 1000);
	const nextexp = Math.floor((userData.exp + 1000) / 1000) * 1000;
	const win = userData.wins;
	const loss = userData.losses;
	const winRate = (win / (win + loss)) * 100;
	const winRateWidth = win + loss === 0 ? "width:0%" : `width:${winRate}%`;
	return (
		<div>
			<div className="container">
				<div className="row border-top border-bottom rounded bg-secondary bg-opacity-25">
					<div className="col-md-5 text-center" style="height: 260px">
						<div className="container m-3 pt-3">
							<img className="rounded-circle"
								style="object-fit: cover;"
								width="170" height="170"
								src={userData.avatar}></img>
							<div className="container mt-3">
								{myId === userData.id ? <ChangeProfileImageModal myId={userData.id} setRefreshUpper={setRefresh} /> : null}
							</div>
						</div>
					</div>
					<div className="col-md-7">
						<div className="container m-1 text-center">
							<div className="row my-1 py-1">
								<div className="col-3">nickname</div>
								<div className="col-1">:</div>
								<div id="userpage-statchart-nickname" className="col-8">{userData.display_name}</div>
							</div>
							<div className="row my-1 py-1">
								<div className="col-3">Level</div>
								<div className="col-1">:</div>
								<div className="col-8">{level}</div>
							</div>
							<div className="row my-1 py-1">
								<div className="col-3">Exp</div>
								<div className="col-1">:</div>
								<div className="col-8">{userData.exp}/{nextexp}</div>
							</div>
							<div className="row my-1 py-1">
								<div className="col-3">Total</div>
								<div className="col-1">:</div>
								<div className="col-8">{win + loss}</div>
							</div>
							<div className="row my-1 py-1">
								<div className="col-3">Win</div>
								<div className="col-1">:</div>
								<div className="col-8">{win}</div>
							</div>
							<div className="row my-1 py-1">
								<div className="col-3">Lose</div>
								<div className="col-1">:</div>
								<div className="col-8">{loss}</div>
							</div>
							<div className="row my-1 py-1">
								<div className="col-3">WR</div>
								<div className="col-1">:</div>
								<div className="col-8">
									<div className="progress" style="height:20px">
										<div className="progress-bar" style={winRateWidth}>
											{win + loss === 0 ? "0%" : `${Math.round(winRate)}%`}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default StatChart;
