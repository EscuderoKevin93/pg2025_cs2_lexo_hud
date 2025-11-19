import { Player, Team } from "csgogsi";
import TeamLogo from "../MatchBar/TeamLogo";
import Avatar from "../Players/Avatar";
import "./scoreboard.scss";

interface Props {
  players: Player[];
  teams?: { left: Team; right: Team };
  show: boolean;
}

const calculateKDA = (kills: number, assists: number, deaths: number): number => {
  if (deaths === 0) return kills + assists;
  return (kills + assists) / deaths;
};

const Scoreboard = ({ players, show }: Props) => {
  // Crear lista de jugadores con su KDA y equipo - TODOS los jugadores
  const playersWithKDA = players.map((player) => {
    const kills = player.stats?.kills || 0;
    const assists = player.stats?.assists || 0;
    const deaths = player.stats?.deaths || 0;
    const kda = calculateKDA(kills, assists, deaths);

    return {
      player,
      kills,
      assists,
      deaths,
      kda,
      teamSide: player.team?.side || "CT",
      team: player.team || null,
    };
  });

  // Ordenar por KDA (descendente)
  playersWithKDA.sort((a, b) => b.kda - a.kda);

  return (
    <div className={`scoreboard ${show ? "show" : "hide"}`}>
      <div className="scoreboard_container">
        {playersWithKDA.map(({ player, kills, deaths, kda, teamSide, team }, index) => {
          const kdaFormatted = kda.toFixed(2);
          const teamId = "id" in team && team.id ? team.id : null;

          return (
            <div key={player.steamid || `player-${index}`} className={`scoreboard_row ${teamSide}`} style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="team_logo_wrapper">
                <TeamLogo team={team} height={24} width={24} />
              </div>
              <div className="avatar_wrapper">
                <Avatar steamid={player.steamid} url={player.avatar} teamId={teamId} height={32} width={32} showSkull={false} showCam={false} />
              </div>
              <div className="player_name">{player.name?.toUpperCase() || player.defaultName?.toUpperCase() || "UNKNOWN"}</div>
              <div className="stats_section">
                <span className="stat kills">
                  <span className="stat_value">{kills}</span>
                </span>
                <span className="stat_separator">-</span>
                <span className="stat deaths">
                  <span className="stat_value">{deaths}</span>
                </span>
                <span className="stat_separator">-</span>
                <span className="stat kda">
                  <span className="stat_value">{kdaFormatted}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Scoreboard;
