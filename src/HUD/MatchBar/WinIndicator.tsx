import { Team } from "csgogsi";
import TeamLogo from "./TeamLogo";

const WinAnnouncement = ({ team, show }: { team: Team | null; show: boolean }) => {
  if (!team || !show) return null;
  return (
    <div className={`win_indicator ${team.orientation} ${team.side} show`}>
      {/* Nombre del equipo de fondo con efecto cortado */}
      <div className="team_name_background">{team.name?.toUpperCase() || "TEAM"}</div>
      
      {/* Contenedor principal */}
      <div className="win_content_container">
        {/* Texto a la izquierda */}
        <div className="win_text_container">
          <div className="round_text">GANO</div>
          <div className="winner_text">LA RONDA</div>
        </div>
        
        {/* Logo a la derecha */}
        <TeamLogo team={team} height={80} width={80} />
      </div>
    </div>
  );
};

export default WinAnnouncement;
