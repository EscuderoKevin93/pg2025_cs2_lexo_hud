import React from "react";
import { CSGO } from "csgogsi";
import Weapon from "../../Weapon/Weapon";
import "./scoreBoardOnly.scss";

interface Props {
  game: CSGO;
}

const ScoreBoardOnly = ({ game }: Props) => {
  const players = game.players || [];

  // Separar jugadores por equipo
  const left = game.map.team_ct.orientation === "left" ? game.map.team_ct : game.map.team_t;
  const right = game.map.team_ct.orientation === "left" ? game.map.team_t : game.map.team_ct;

  const leftPlayers = players
    .filter((player) => player.team.side === left.side)
    .sort((a, b) => {
      const slotA = "observer_slot" in a ? (a as { observer_slot?: number }).observer_slot ?? 0 : 0;
      const slotB = "observer_slot" in b ? (b as { observer_slot?: number }).observer_slot ?? 0 : 0;
      if (slotA >= 6 && slotB >= 6) {
        return slotB - slotA;
      }
      return slotA - slotB;
    });

  const rightPlayers = players
    .filter((player) => player.team.side === right.side)
    .sort((a, b) => {
      const slotA = "observer_slot" in a ? (a as { observer_slot?: number }).observer_slot ?? 0 : 0;
      const slotB = "observer_slot" in b ? (b as { observer_slot?: number }).observer_slot ?? 0 : 0;
      if (slotA >= 6 && slotB >= 6) {
        return slotB - slotA;
      }
      return slotA - slotB;
    });

  // Función para procesar info del jugador
  const getPlayerInfo = (player: typeof players[0]) => {
    const weapons = player.weapons.map((weapon) => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
    const primary = weapons.filter((weapon) => !["C4", "Pistol", "Knife", "Grenade", undefined].includes(weapon.type))[0] || null;
    const secondary = weapons.filter((weapon) => weapon.type === "Pistol")[0] || null;

    const grenades = weapons.filter((weapon) => weapon.type === "Grenade");
    const getGrenadeByName = (name: string) => {
      return grenades.find((g) => g.name === name || g.name === `weapon_${name}`);
    };
    const flashbang = getGrenadeByName("flashbang");
    const smoke = getGrenadeByName("smokegrenade");
    const hegrenade = getGrenadeByName("hegrenade");
    const molotov = getGrenadeByName("molotov") || getGrenadeByName("incgrenade");

    return {
      player,
      kills: player.stats?.kills || 0,
      deaths: player.stats?.deaths || 0,
      assists: player.stats?.assists || 0,
      money: player.state.money || 0,
      primary,
      secondary,
      flashbang,
      smoke,
      hegrenade,
      molotov,
      isDead: player.state.health === 0,
    };
  };

  return (
    <div className="scoreboard-only-layout">
      <div className="scoreboard-bottom-bar">
        <div className="scoreboard-table">
          {/* Equipo izquierdo (CT) */}
          <div className="team-column left">
            {leftPlayers.map((player) => {
              const info = getPlayerInfo(player);
              return (
                <div key={player.steamid} className={`player-row left ${info.isDead ? "dead" : ""}`}>
                  {/* Nombre */}
                  <div className="player-name">{player.name?.toUpperCase() || "UNKNOWN"}</div>

                  {/* Granadas */}
                  <div className="player-grenades">
                    {info.flashbang ? <Weapon weapon={info.flashbang.name} active={info.flashbang.state === "active"} isGrenade /> : <span className="grenade-empty">•</span>}
                    {info.smoke ? <Weapon weapon={info.smoke.name} active={info.smoke.state === "active"} isGrenade /> : <span className="grenade-empty">•</span>}
                    {info.molotov ? <Weapon weapon={info.molotov.name} active={info.molotov.state === "active"} isGrenade /> : <span className="grenade-empty">•</span>}
                    {info.hegrenade ? <Weapon weapon={info.hegrenade.name} active={info.hegrenade.state === "active"} isGrenade /> : <span className="grenade-empty">•</span>}
                  </div>

                  {/* Arma secundaria */}
                  <div className="player-weapon secondary">
                    {info.secondary && !info.isDead ? (
                      <Weapon weapon={info.secondary.name} active={info.secondary.state === "active"} />
                    ) : (
                      <span className="no-weapon">-</span>
                    )}
                  </div>

                  {/* Arma primaria */}
                  <div className="player-weapon primary">
                    {info.primary && !info.isDead ? (
                      <Weapon weapon={info.primary.name} active={info.primary.state === "active"} />
                    ) : (
                      <span className="no-weapon">-</span>
                    )}
                  </div>

                  {/* Dinero */}
                  <div className="player-money">${info.money}</div>

                  {/* Estadísticas */}
                  <div className="player-stats">
                    <span className="stat kills">{info.kills}</span>
                    <span className="stat-separator">-</span>
                    <span className="stat deaths">{info.deaths}</span>
                    <span className="stat-separator">-</span>
                    <span className="stat assists">{info.assists}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Espacio en el centro */}
          <div className="center-spacer"></div>

          {/* Equipo derecho (T) */}
          <div className="team-column right">
            {rightPlayers.map((player) => {
              const info = getPlayerInfo(player);
              return (
                <div key={player.steamid} className={`player-row right ${info.isDead ? "dead" : ""}`}>
                  {/* Estadísticas (invertido) */}
                  <div className="player-stats">
                    <span className="stat assists">{info.assists}</span>
                    <span className="stat-separator">-</span>
                    <span className="stat deaths">{info.deaths}</span>
                    <span className="stat-separator">-</span>
                    <span className="stat kills">{info.kills}</span>
                  </div>

                  {/* Dinero */}
                  <div className="player-money">${info.money}</div>

                  {/* Arma primaria */}
                  <div className="player-weapon primary">
                    {info.primary && !info.isDead ? (
                      <Weapon weapon={info.primary.name} active={info.primary.state === "active"} />
                    ) : (
                      <span className="no-weapon">-</span>
                    )}
                  </div>

                  {/* Arma secundaria */}
                  <div className="player-weapon secondary">
                    {info.secondary && !info.isDead ? (
                      <Weapon weapon={info.secondary.name} active={info.secondary.state === "active"} />
                    ) : (
                      <span className="no-weapon">-</span>
                    )}
                  </div>

                  {/* Granadas */}
                  <div className="player-grenades">
                    {info.flashbang ? <Weapon weapon={info.flashbang.name} active={info.flashbang.state === "active"} isGrenade /> : <span className="grenade-empty">•</span>}
                    {info.smoke ? <Weapon weapon={info.smoke.name} active={info.smoke.state === "active"} isGrenade /> : <span className="grenade-empty">•</span>}
                    {info.molotov ? <Weapon weapon={info.molotov.name} active={info.molotov.state === "active"} isGrenade /> : <span className="grenade-empty">•</span>}
                    {info.hegrenade ? <Weapon weapon={info.hegrenade.name} active={info.hegrenade.state === "active"} isGrenade /> : <span className="grenade-empty">•</span>}
                  </div>

                  {/* Nombre */}
                  <div className="player-name">{player.name?.toUpperCase() || "UNKNOWN"}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoardOnly;
