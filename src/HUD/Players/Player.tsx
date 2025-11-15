import * as I from "csgogsi";
import React, { useState, useEffect, useRef } from "react";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import { Skull, Headshot, ArmorHelmet, ArmorFull, Defuse, C4 } from "./../../assets/Icons";

interface IProps {
  player: I.Player;
  isObserved: boolean;
}

const compareWeapon = (weaponOne: I.WeaponRaw, weaponTwo: I.WeaponRaw) => {
  if (
    weaponOne.name === weaponTwo.name &&
    weaponOne.paintkit === weaponTwo.paintkit &&
    weaponOne.type === weaponTwo.type &&
    weaponOne.ammo_clip === weaponTwo.ammo_clip &&
    weaponOne.ammo_clip_max === weaponTwo.ammo_clip_max &&
    weaponOne.ammo_reserve === weaponTwo.ammo_reserve &&
    weaponOne.state === weaponTwo.state
  )
    return true;

  return false;
};

const compareWeapons = (weaponsObjectOne: I.Weapon[], weaponsObjectTwo: I.Weapon[]) => {
  const weaponsOne = [...weaponsObjectOne].sort((a, b) => a.name.localeCompare(b.name));
  const weaponsTwo = [...weaponsObjectTwo].sort((a, b) => a.name.localeCompare(b.name));

  if (weaponsOne.length !== weaponsTwo.length) return false;

  return weaponsOne.every((weapon, i) => compareWeapon(weapon, weaponsTwo[i]));
};

const arePlayersEqual = (playerOne: I.Player, playerTwo: I.Player) => {
  if (
    playerOne.name === playerTwo.name &&
    playerOne.steamid === playerTwo.steamid &&
    playerOne.observer_slot === playerTwo.observer_slot &&
    playerOne.defaultName === playerTwo.defaultName &&
    playerOne.clan === playerTwo.clan &&
    playerOne.stats.kills === playerTwo.stats.kills &&
    playerOne.stats.assists === playerTwo.stats.assists &&
    playerOne.stats.deaths === playerTwo.stats.deaths &&
    playerOne.stats.mvps === playerTwo.stats.mvps &&
    playerOne.stats.score === playerTwo.stats.score &&
    playerOne.state.health === playerTwo.state.health &&
    playerOne.state.armor === playerTwo.state.armor &&
    playerOne.state.helmet === playerTwo.state.helmet &&
    playerOne.state.defusekit === playerTwo.state.defusekit &&
    playerOne.state.flashed === playerTwo.state.flashed &&
    playerOne.state.smoked === playerTwo.state.smoked &&
    playerOne.state.burning === playerTwo.state.burning &&
    playerOne.state.money === playerTwo.state.money &&
    playerOne.state.round_killhs === playerTwo.state.round_killhs &&
    playerOne.state.round_kills === playerTwo.state.round_kills &&
    playerOne.state.round_totaldmg === playerTwo.state.round_totaldmg &&
    playerOne.state.equip_value === playerTwo.state.equip_value &&
    playerOne.state.adr === playerTwo.state.adr &&
    playerOne.avatar === playerTwo.avatar &&
    !!playerOne.team.id === !!playerTwo.team.id &&
    playerOne.team.side === playerTwo.team.side &&
    playerOne.country === playerTwo.country &&
    playerOne.realName === playerTwo.realName &&
    compareWeapons(playerOne.weapons, playerTwo.weapons)
  )
    return true;

  return false;
};
const Player = ({ player, isObserved }: IProps) => {
  const isDead = player.state.health === 0;
  const [damageTaken, setDamageTaken] = useState<number | null>(null);
  const prevHealthRef = useRef<number>(player.state.health);

  // Detectar daño recibido
  useEffect(() => {
    const prevHealth = prevHealthRef.current;
    const currentHealth = player.state.health;

    // Solo mostrar daño si la vida bajó (no si subió por heal)
    if (prevHealth > currentHealth && currentHealth > 0) {
      const damage = prevHealth - currentHealth;
      setDamageTaken(damage);

      // Limpiar después de la animación
      setTimeout(() => {
        setDamageTaken(null);
      }, 2000);
    }

    prevHealthRef.current = currentHealth;
  }, [player.state.health]);

  // Procesar armas
  const weapons = player.weapons.map((weapon) => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
  const primary = weapons.filter((weapon) => !["C4", "Pistol", "Knife", "Grenade", undefined].includes(weapon.type))[0] || null;
  const secondary = weapons.filter((weapon) => weapon.type === "Pistol")[0] || null;
  const currentWeapon = primary || secondary;

  // Procesar granadas (4 tipos: flashbang, smoke, hegrenade, molotov/incgrenade)
  const grenades = weapons.filter((weapon) => weapon.type === "Grenade");
  // const grenadeTypes = ["flashbang", "smokegrenade", "hegrenade", "molotov", "incgrenade"];

  const getGrenadeByName = (name: string) => {
    return grenades.find((g) => g.name === name || g.name === `weapon_${name}`);
  };

  const flashbang = getGrenadeByName("flashbang");
  const smoke = getGrenadeByName("smokegrenade");
  const hegrenade = getGrenadeByName("hegrenade");
  const molotov = getGrenadeByName("molotov") || getGrenadeByName("incgrenade");

  // Verificar si tiene C4
  const hasC4 = weapons.some((weapon) => weapon.type === "C4");

  return (
    <div className={`player ${isDead ? "dead" : ""} ${isObserved ? "active" : ""}`}>
      {/* Indicador de daño recibido */}
      {damageTaken !== null && <div className="damage_indicator">-{damageTaken}</div>}
      <div className="player_panel">
        <div className="player_top_section" style={{ "--health-percentage": `${player.state.health}%` } as React.CSSProperties}>
          {/* Barra de vida de fondo que se vacía desde arriba */}
          <div className="health_bar_background"></div>

          {/* Kills de la ronda - arriba lado izquierdo */}
          {!isDead && player.state.round_kills > 0 && (
            <div className="round_kills_indicator">
              <Headshot className="round_kills_icon" />
              <span className="round_kills_value">{player.state.round_kills}</span>
            </div>
          )}

          {/* Defuse/C4 - arriba lado derecho */}
          {!isDead && (
            <>
              {player.team.side === "CT" && player.state.defusekit && (
                <div className="defuse_indicator_top">
                  <Defuse className="defuse_icon_top" />
                </div>
              )}
              {player.team.side === "T" && hasC4 && (
                <div className="c4_indicator_top">
                  <C4 className="c4_icon_top" />
                </div>
              )}
            </>
          )}

          {/* Nombre del jugador */}
          <div className="player_name">{player.name.toUpperCase()}</div>

          {/* Chaleco y Vida arriba del recuadro negro */}
          {!isDead && (
            <div className="health_armor_indicators">
              {player.state.armor > 0 && <div className="armor_indicator">{player.state.helmet ? <ArmorHelmet className="armor_icon" /> : <ArmorFull className="armor_icon" />}</div>}
              <div className="health_indicator">
                <span className="health_value">{player.state.health}</span>
              </div>
            </div>
          )}
        </div>

        {/* Avatar del jugador - fuera de la sección superior para evitar que se corte */}
        <div className={`avatar_container ${player.state.flashed ? "flashed" : ""} ${player.state.burning ? "burning" : ""}`}>
          <Avatar teamId={player.team.id} steamid={player.steamid} url={player.avatar} showSkull={false} showCam={false} sidePlayer={true} />
        </div>
        <div className="player_bottom_section">
          {!isDead ? (
            <>
              <div className="bottom_top_row">
                {/* Granadas */}
                <div className="grenades_container">
                  {flashbang ? <Weapon weapon={flashbang.name} active={flashbang.state === "active"} isGrenade /> : <div className="grenade_empty">•</div>}
                  {smoke ? <Weapon weapon={smoke.name} active={smoke.state === "active"} isGrenade /> : <div className="grenade_empty">•</div>}
                  {molotov ? <Weapon weapon={molotov.name} active={molotov.state === "active"} isGrenade /> : <div className="grenade_empty">•</div>}
                  {hegrenade ? <Weapon weapon={hegrenade.name} active={hegrenade.state === "active"} isGrenade /> : <div className="grenade_empty">•</div>}
                </div>
                {/* Arma */}
                <div className="weapon_container">{currentWeapon ? <Weapon weapon={currentWeapon.name} active={currentWeapon.state === "active"} /> : null}</div>
              </div>
              <div className="bottom_bottom_row">
                {/* Dinero */}
                <div className="money">${player.state.money}</div>
                {/* Kills y Muertes */}
                <div className="stats_container">
                  <div className="kills">
                    <Headshot className="kills_icon" />
                    <span className="kills_value">{player.stats.kills}</span>
                  </div>
                  <div className="deaths">
                    <Skull className="deaths_icon" />
                    <span className="deaths_value">{player.stats.deaths}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Primera fila: ADR - Kills en ronda */}
              <div className="dead_top_row">
                <div className="adr_container">
                  <span className="adr_label">ADR:</span>
                  <span className="adr_value">{Math.round(player.state.adr || 0)}</span>
                </div>
                {player.state.round_kills > 0 && (
                  <div className="dead_round_kills">
                    <Headshot className="dead_round_kills_icon" />
                    <span className="dead_round_kills_value">{player.state.round_kills}</span>
                  </div>
                )}
              </div>
              {/* Segunda fila: Dinero - Kills totales - Muertes totales */}
              <div className="dead_bottom_row">
                <div className="money">${player.state.money}</div>
                <div className="stats_container">
                  <div className="kills">
                    <Headshot className="kills_icon" />
                    <span className="kills_value">{player.stats.kills}</span>
                  </div>
                  <div className="deaths">
                    <Skull className="deaths_icon" />
                    <span className="deaths_value">{player.stats.deaths}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const arePropsEqual = (prevProps: Readonly<IProps>, nextProps: Readonly<IProps>) => {
  if (prevProps.isObserved !== nextProps.isObserved) return false;

  return arePlayersEqual(prevProps.player, nextProps.player);
};

export default React.memo(Player, arePropsEqual);
//export default Player;
