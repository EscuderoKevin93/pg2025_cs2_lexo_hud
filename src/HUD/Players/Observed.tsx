import React, { useState } from "react";
import { Player } from "csgogsi";
import CameraContainer from "../Camera/Container";
import "./observed.scss";
import { ArmorHelmet, ArmorFull, Bullets } from "./../../assets/Icons";
import { useAction } from "../../API/contexts/actions";

const Observed = ({ player }: { player: Player | null }) => {
  const [showCam, setShowCam] = useState(true);

  useAction("toggleCams", () => {
    setShowCam((p) => !p);
  });

  if (!player) return null;

  const currentWeapon = player.weapons.filter((weapon) => weapon.state === "active")[0];
  const ammoClip = currentWeapon && currentWeapon.ammo_clip ? currentWeapon.ammo_clip : 0;
  const ammoReserve = currentWeapon && currentWeapon.ammo_reserve ? currentWeapon.ammo_reserve : 0;

  return (
    <div className={`observed ${player.team.side}`}>
      {/* Recuadro de la cámara */}
      <div className="camera_container">{showCam && <CameraContainer observedSteamid={player.steamid} />}</div>

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
      </div>
    </div>
  );
};

export default Observed;
