import { Team } from 'csgogsi';
import TeamLogo from './TeamLogo';

const WinAnnouncement = ({team, show }: { team: Team | null, show: boolean }) => {
        if(!team || !show) return null;
        return (
            <div className={`win_indicator ${team.orientation} ${team.side} ${show ? 'show' : ''}`}>
                <TeamLogo team={team} height={50} width={50} />
                <div className="win_text_container">
                    <div className="round_text">ROUND</div>
                    <div className="winner_text">WINNER</div>
                </div>
            </div>
        );
}

export default WinAnnouncement;