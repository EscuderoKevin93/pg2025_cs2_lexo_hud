import * as I from "csgogsi";
import "./matchbar.scss";
import TeamLogo from "./TeamLogo";
import WinIndicator from "./WinIndicator";
import PlantDefuse from "../Timers/PlantDefuse";
import { useBombTimer } from "../Timers/Countdown";
import { onGSI } from "../../API/contexts/actions";
import { Match } from "./../../API/types";
import { useEffect, useState } from "react";
import * as API from "./../../API/types";
import api from "./../../API";

function stringToClock(time: string | number, pad = true) {
  if (typeof time === "string") {
    time = parseFloat(time);
  }
  const countdown = Math.abs(Math.ceil(time));
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown - minutes * 60;
  if (pad && seconds < 10) {
    return `${minutes}:0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

interface IProps {
  match: Match | null;
  map: I.Map;
  phase: I.CSGO["phase_countdowns"];
  bomb: I.Bomb | null;
}

export interface Timer {
  time: number;
  active: boolean;
  side: "left" | "right";
  type: "defusing" | "planting";
  player: I.Player | null;
}
const getRoundLabel = (mapRound: number) => {
  const round = mapRound + 1;
  if (round <= 24) {
    return `RONDA ${round}`;
  }
  const additionalRounds = round - 24;
  const OT = Math.ceil(additionalRounds / 6);
  return `OT ${OT} (${additionalRounds - (OT - 1) * 6}/6)`;
};

const Matchbar = (props: IProps) => {
  const { match, map, phase } = props;
  const time = stringToClock(phase.phase_ends_in);
  const left = map.team_ct.orientation === "left" ? map.team_ct : map.team_t;
  const right = map.team_ct.orientation === "left" ? map.team_t : map.team_ct;

  const [tournament, setTournament] = useState<API.Tournament | null>(null);
  const [showLeftWin, setShowLeftWin] = useState(false);
  const [showRightWin, setShowRightWin] = useState(false);

  useEffect(() => {
    api.tournaments.get().then(({ tournament }) => {
      if (tournament) {
        setTournament(tournament);
      }
    });
  }, []);

  // Win indicator logic
  onGSI(
    "roundEnd",
    (result) => {
      if (result.winner.orientation === "left") {
        setShowLeftWin(true);
        setTimeout(() => setShowLeftWin(false), 5000);
      } else if (result.winner.orientation === "right") {
        setShowRightWin(true);
        setTimeout(() => setShowRightWin(false), 5000);
      }
    },
    []
  );

  const bombData = useBombTimer();
  const plantTimer: Timer | null =
    bombData.state === "planting"
      ? {
          time: bombData.plantTime,
          active: true,
          side: bombData.player?.team.orientation || "right",
          player: bombData.player,
          type: "planting",
        }
      : null;

  const defuseTimer: Timer | null =
    bombData.state === "defusing"
      ? {
          time: bombData.defuseTime,
          active: true,
          side: bombData.player?.team.orientation || "left",
          player: bombData.player,
          type: "defusing",
        }
      : null;

  const tournamentName = tournament?.name || (match && "event" in match && (match as { event?: { name?: string } }).event?.name) || "PUNTO GAMERS EXPERIENCE";

  const amountOfMaps = (match && Math.floor(Number(match.matchType.substr(-1)) / 2) + 1) || 0;

  return (
    <>
      <div id="matchbar_container">
        {/* RECTÁNGULO 1 - Barra superior */}
        <div id="tournament_bar">
          <div className="tournament_name">{tournamentName.toUpperCase()}</div>
        </div>

        {/* RECTÁNGULO 2 - Barra principal (centro) */}
        <div id="matchbar">
          <div className="timer_container">
            <div className="round_timer_text">{time}</div>
            <div className="round_now">{getRoundLabel(map.round)}</div>
          </div>
        </div>

        {/* RECTÁNGULO 3 - Equipo izquierdo */}
        <div className="team_box_wrapper left">
          <div className={`team_box left ${left.side}`}>
            <div className="team_info_container">
              <div className="team_name_panel">{left.name?.toUpperCase() || "TEAM"}</div>
              <div className="series_wins_container">
                {new Array(amountOfMaps).fill(0).map((_, i) => (
                  <div key={i} className={`wins_box ${left.matches_won_this_series > i ? "win" : ""} ${left.side}`} />
                ))}
              </div>
            </div>
            <div className="score_logo_container">
              <TeamLogo team={left} height={50} width={50} />
              <div className="team_score">{left.score}</div>
            </div>
          </div>
          <WinIndicator team={left} show={showLeftWin} />
          <PlantDefuse timer={left.orientation === plantTimer?.side ? plantTimer : left.orientation === defuseTimer?.side ? defuseTimer : null} side="left" />
        </div>

        {/* RECTÁNGULO 4 - Equipo derecho */}
        <div className="team_box_wrapper right">
          <div className={`team_box right ${right.side}`}>
            <div className="score_logo_container">
              <div className="team_score">{right.score}</div>
              <TeamLogo team={right} height={50} width={50} />
            </div>
            <div className="team_info_container">
              <div className="team_name_panel">{right.name?.toUpperCase() || "TEAM"}</div>
              <div className="series_wins_container">
                {new Array(amountOfMaps).fill(0).map((_, i) => (
                  <div key={i} className={`wins_box ${right.matches_won_this_series > i ? "win" : ""} ${right.side}`} />
                ))}
              </div>
            </div>
          </div>
          <WinIndicator team={right} show={showRightWin} />
          <PlantDefuse timer={right.orientation === plantTimer?.side ? plantTimer : right.orientation === defuseTimer?.side ? defuseTimer : null} side="right" />
        </div>
      </div>
    </>
  );
};

export default Matchbar;
