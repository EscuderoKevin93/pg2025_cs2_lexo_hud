import React from "react";
import { Player, Team } from "csgogsi";
import PlayerSimple from "./PlayerSimple";
import "./replay.scss";

interface Props {
  players: Player[];
  team: Team;
  side: "right" | "left";
  current: Player | null;
}

const TeamBoxSimple = ({ players, team, side, current }: Props) => {
  return (
    <div className={`teambox-simple ${team.side} ${side}`}>
      {players.map(player => (
        <PlayerSimple
          key={player.steamid}
          player={player}
          isObserved={!!(current && current.steamid === player.steamid)}
        />
      ))}
    </div>
  );
};

export default TeamBoxSimple;

