import React from "react";
import { Player } from "csgogsi";
import Avatar from "../../Players/Avatar";
import "./replay.scss";

interface Props {
  player: Player;
  isObserved: boolean;
}

const PlayerSimple = ({ player }: Props) => {
  const teamId = "id" in player.team && player.team.id ? player.team.id : null;
  const isDead = player.state.health === 0;

  return (
    <div className={`player ${isDead ? "dead" : ""} ${isObserved ? "active" : ""}`}>
      <div className="player_panel">
        {/* Avatar arriba */}
        <div className={`avatar_container ${player.state.flashed ? "flashed" : ""} ${player.state.burning ? "burning" : ""}`}>
          <Avatar 
            teamId={teamId} 
            steamid={player.steamid} 
            url={player.avatar} 
            showSkull={false} 
            showCam={false} 
            sidePlayer={true} 
          />
        </div>
        
        {/* Nombre abajo */}
        <div className="player_bottom_section">
          <div className="player_name">{player.name.toUpperCase()}</div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlayerSimple);

