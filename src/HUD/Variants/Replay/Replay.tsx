import { useState } from "react";
import TeamBox from "../../Players/TeamBox";
import MatchBar from "../../MatchBar/MatchBar";
import SeriesBox from "../../MatchBar/SeriesBox";
import RadarMaps from "../../Radar/RadarMaps";
import SideBox from "../../SideBoxes/SideBox";
import MoneyBox from "../../SideBoxes/Money";
import UtilityLevel from "../../SideBoxes/UtilityLevel";
import Killfeed from "../../Killfeed/Killfeed";
import MapSeries from "../../MapSeries/MapSeries";
import Overview from "../../Overview/Overview";
import Tournament from "../../Tournament/Tournament";
import Pause from "../../PauseTimeout/Pause";
import Timeout from "../../PauseTimeout/Timeout";
import Scoreboard from "../../Scoreboard/Scoreboard";
import { CSGO } from "csgogsi";
import { Match } from "../../../API/types";
import { useAction } from "../../../API/contexts/actions";
import { Scout } from "../../Scout";
import TeamBoxSimple from "./TeamBoxSimple";
import Observed from "../../Players/Observed";

interface Props {
  game: CSGO;
  match: Match | null;
}

const Replay = ({ game, match }: Props) => {
  const [forceHide, setForceHide] = useState(false);

  useAction("boxesState", (state) => {
    if (state === "show") {
      setForceHide(false);
    } else if (state === "hide") {
      setForceHide(true);
    }
  });

  const left = game.map.team_ct.orientation === "left" ? game.map.team_ct : game.map.team_t;
  const right = game.map.team_ct.orientation === "left" ? game.map.team_t : game.map.team_ct;

  const leftPlayers = game.players
    .filter((player) => player.team.side === left.side)
    .sort((a, b) => {
      const slotA = "observer_slot" in a ? (a as { observer_slot?: number }).observer_slot ?? 0 : 0;
      const slotB = "observer_slot" in b ? (b as { observer_slot?: number }).observer_slot ?? 0 : 0;
      if (slotA >= 6 && slotB >= 6) {
        return slotB - slotA;
      }
      return slotA - slotB;
    });

  const rightPlayers = game.players
    .filter((player) => player.team.side === right.side)
    .sort((a, b) => {
      const slotA = "observer_slot" in a ? (a as { observer_slot?: number }).observer_slot ?? 0 : 0;
      const slotB = "observer_slot" in b ? (b as { observer_slot?: number }).observer_slot ?? 0 : 0;
      if (slotA >= 6 && slotB >= 6) {
        return slotB - slotA;
      }
      return slotA - slotB;
    });
  
  const isFreezetime = (game.round && game.round.phase === "freezetime") || game.phase_countdowns.phase === "freezetime";

  return (
    <div className="layout">
      <Killfeed />
      <Overview match={match} map={game.map} players={game.players || []} />
      <RadarMaps match={match} map={game.map} game={game} />
      <Scoreboard players={game.players || []} teams={{ left, right }} show={isFreezetime && !forceHide} />
      <MatchBar map={game.map} phase={game.phase_countdowns} bomb={game.bomb} match={match} />
      <Pause phase={game.phase_countdowns} />
      <Timeout map={game.map} phase={game.phase_countdowns} />
      <SeriesBox map={game.map} match={match} />

      <Tournament />

      <Observed player={game.player} />

      {/* Players solo con fotos (sin info adicional) */}
      <TeamBoxSimple team={left} players={leftPlayers} side="left" current={game.player} />
      <TeamBoxSimple team={right} players={rightPlayers} side="right" current={game.player} />

      <Scout left={left.side} right={right.side} />
      <MapSeries teams={[left, right]} match={match} isFreezetime={isFreezetime} map={game.map} />
      <div className={"boxes left"}>
        <UtilityLevel side={left.side} players={game.players} show={isFreezetime && !forceHide} />
        <SideBox side="left" hide={forceHide} />
        <MoneyBox
          team={left.side}
          side="left"
          loss={Math.min(left.consecutive_round_losses * 500 + 1400, 3400)}
          equipment={leftPlayers.map((player) => player.state.equip_value).reduce((pre, now) => pre + now, 0)}
          money={leftPlayers.map((player) => player.state.money).reduce((pre, now) => pre + now, 0)}
          show={isFreezetime && !forceHide}
        />
      </div>
      <div className={"boxes right"}>
        <UtilityLevel side={right.side} players={game.players} show={isFreezetime && !forceHide} />
        <SideBox side="right" hide={forceHide} />
        <MoneyBox
          team={right.side}
          side="right"
          loss={Math.min(right.consecutive_round_losses * 500 + 1400, 3400)}
          equipment={rightPlayers.map((player) => player.state.equip_value).reduce((pre, now) => pre + now, 0)}
          money={rightPlayers.map((player) => player.state.money).reduce((pre, now) => pre + now, 0)}
          show={isFreezetime && !forceHide}
        />
      </div>
    </div>
  );
};

export default Replay;

