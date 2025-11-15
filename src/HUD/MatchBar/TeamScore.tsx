import * as I from "csgogsi";
import { Timer } from "./MatchBar";
import TeamLogo from './TeamLogo';
import PlantDefuse from "../Timers/PlantDefuse"
import { onGSI } from "../../API/contexts/actions";
import WinAnnouncement from "./WinIndicator";
import { useState } from "react";

interface IProps {
  orientation: "left" | "right";
  timer: Timer | null;
  team: I.Team;
  showName?: boolean;
}

const TeamScore = ({orientation, timer, team, showName = true }: IProps) => {
    const [ show, setShow ] = useState(false);

    onGSI("roundEnd", result => {
      if(result.winner.orientation !== orientation) return;
      setShow(true);

      setTimeout(() => {
        setShow(false);
      }, 5000);
    }, [orientation]);

    return (
      <>
        <div className={`team ${orientation} ${team.side || ''}`}>
          {showName && <div className="team-name">{team?.name || null}</div>}
          <TeamLogo team={team} />
          <div className="round-thingy"><div className="inner"></div></div>
        </div>
        <PlantDefuse timer={timer} side={orientation} />
        <WinAnnouncement team={team} show={show} />
      </>
    );
}

export default TeamScore;