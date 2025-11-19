import React, { useState } from "react";
import { Player } from "csgogsi";
import CameraContainer from "../Camera/Container";
import "./observed.scss";
import { ArmorHelmet, ArmorFull, Bullets } from "./../../assets/Icons";
import { useAction } from "../../API/contexts/actions";
import { getVariant } from "../../API/HUD";
import Avatar from "./Avatar";
import TeamLogo from "../MatchBar/TeamLogo";
import Weapon from "../Weapon/Weapon";

const Observed = ({ player }: { player: Player | null }) => {
  const [showCam, setShowCam] = useState(true);
  const variant = getVariant();

  useAction("toggleCams", () => {
    setShowCam((p) => !p);
  });

  if (!player) return null;

  // Variante HudOnline: no mostrar cámara
  const shouldShowCamera = variant !== "HudOnline" && showCam;

  const currentWeapon = player.weapons.filter((weapon) => weapon.state === "active")[0];
  const ammoClip = currentWeapon && currentWeapon.ammo_clip ? currentWeapon.ammo_clip : 0;
  const ammoReserve = currentWeapon && currentWeapon.ammo_reserve ? currentWeapon.ammo_reserve : 0;

  // Procesar armas y granadas para HudOnline
  const weapons = player.weapons.map((weapon) => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
  const primary = weapons.filter((weapon) => !["C4", "Pistol", "Knife", "Grenade", undefined].includes(weapon.type))[0] || null;
  const secondary = weapons.filter((weapon) => weapon.type === "Pistol")[0] || null;
  const currentWeaponForDisplay = primary || secondary;

  const grenades = weapons.filter((weapon) => weapon.type === "Grenade");
  const getGrenadeByName = (name: string) => {
    return grenades.find((g) => g.name === name || g.name === `weapon_${name}`);
  };
  const flashbang = getGrenadeByName("flashbang");
  const smoke = getGrenadeByName("smokegrenade");
  const hegrenade = getGrenadeByName("hegrenade");
  const molotov = getGrenadeByName("molotov") || getGrenadeByName("incgrenade");

  const teamId = "id" in player.team && player.team.id ? player.team.id : null;

  return (
    <div className={`observed ${player.team.side} ${variant === "HudOnline" ? "no-camera" : ""}`}>
      {/* Recuadro de la cámara */}
      <div className="camera_container">{shouldShowCamera && <CameraContainer observedSteamid={player.steamid} />}</div>

      {/* Contenedor de barras */}
      <div className="bars_container">
        {/* Barra finita negra */}
        <div className="top_bar">
          {/* Contenido de la barra */}
          <div className="bar_content">
            {/* Chaleco */}
            {player.state.armor > 0 && <div className="armor_indicator">{player.state.helmet ? <ArmorHelmet className="armor_icon" /> : <ArmorFull className="armor_icon" />}</div>}

            {/* Vida */}
            <div className="health_indicator">
              <span className="health_value">{player.state.health}</span>
            </div>

            {/* Nombre */}
            <div className="player_name">{player.name.toUpperCase()}</div>

            {/* Balas (al final) */}
            <div className="ammo_indicator">
              <Bullets className="ammo_icon" />
              <span className="ammo_value">
                {ammoClip}/{ammoReserve}
              </span>
            </div>
          </div>
        </div>

        {/* Barra de vida horizontal debajo de la barra finita */}
        <div className="health_bar_container" style={{ "--health-percentage": `${player.state.health}%` } as React.CSSProperties}>
          <div className="health_bar_background"></div>
        </div>

        {/* Contenido especial para HudOnline */}
        {variant === "HudOnline" && (
          <div className="hud-online-content">
            {/* Logo del equipo chiquito */}
            <div className="team-logo-small">
              <TeamLogo team={player.team} height={24} width={24} />
            </div>

            {/* Avatar en el medio */}
            <div className="avatar-center">
              <Avatar 
                teamId={teamId} 
                steamid={player.steamid} 
                url={player.avatar} 
                showSkull={false} 
                showCam={false} 
                height={80}
                width={80}
              />
            </div>

            {/* Arma y granadas */}
            <div className="weapons-section">
              {/* Arma */}
              {currentWeaponForDisplay && (
                <div className="weapon-display">
                  <Weapon weapon={currentWeaponForDisplay.name} active={currentWeaponForDisplay.state === "active"} />
                </div>
              )}

              {/* Granadas */}
              <div className="grenades-display">
                {flashbang ? <Weapon weapon={flashbang.name} active={flashbang.state === "active"} isGrenade /> : <span className="grenade-empty">•</span>}
                {smoke ? <Weapon weapon={smoke.name} active={smoke.state === "active"} isGrenade /> : <span className="grenade-empty">•</span>}
                {molotov ? <Weapon weapon={molotov.name} active={molotov.state === "active"} isGrenade /> : <span className="grenade-empty">•</span>}
                {hegrenade ? <Weapon weapon={hegrenade.name} active={hegrenade.state === "active"} isGrenade /> : <span className="grenade-empty">•</span>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Observed;
