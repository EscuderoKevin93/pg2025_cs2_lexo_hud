import * as I from "csgogsi";
import TeamLogo from "../MatchBar/TeamLogo";
import "./mapseries.scss";
import { Match, Veto } from "../../API/types";

interface IProps {
  match: Match | null;
  teams: I.Team[];
  isFreezetime: boolean;
  map: I.Map;
}

interface IVetoProps {
  veto: Veto;
  teams: I.Team[];
  active: boolean;
}

const VetoEntry = ({ veto, teams, active }: IVetoProps) => {
  const mapDisplayName = veto.mapName?.replace("de_", "").toUpperCase() || "";
  const pickerTeam = teams.find((team) => team.id === veto.teamId);
  const winnerTeam = veto.winner ? teams.find((team) => team.id === veto.winner) : null;
  const scoreDisplay = veto.score ? Object.values(veto.score).join(" - ") : "- -";

  return (
    <div className={`veto_entry ${active ? "active" : ""}`}>
      <div className="map_name">{mapDisplayName}</div>
      <div className="map_info">
        <div className="picker_logo">
          {pickerTeam ? <TeamLogo team={pickerTeam} height={28} width={28} /> : <div className="placeholder">-</div>}
        </div>
        {winnerTeam ? (
          <div className="winner_logo">
            <TeamLogo team={winnerTeam} height={28} width={28} />
          </div>
        ) : (
          <div className="winner_logo placeholder">-</div>
        )}
        <div className="map_score">{scoreDisplay}</div>
      </div>
    </div>
  );
};

const MapSeries = ({ match, teams, isFreezetime, map }: IProps) => {
  if (!match || !match.vetos.length) return null;

  const pickedMaps = match.vetos.filter((veto) => veto.type !== "ban" && veto.mapName);

  return (
    <div className={`map_series_container ${isFreezetime ? "show" : "hide"}`}>
      <div className="series_header">
        <div className="header_label">PICKS</div>
      </div>
      <div className="series_list_header">
        <div className="header_map">MAPA</div>
        <div className="header_pick">PICK</div>
        <div className="header_win">WIN</div>
        <div className="header_score">SCORE</div>
      </div>
      <div className="series_list">
        {pickedMaps.map((veto) => {
          if (!veto.mapName) return null;
          return (
            <VetoEntry
              key={`${match.id}${veto.mapName}${veto.teamId}${veto.side}`}
              veto={veto}
              teams={teams}
              active={map.name.includes(veto.mapName)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MapSeries;