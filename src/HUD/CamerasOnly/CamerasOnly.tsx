import { useEffect, useState, useMemo } from "react";
import { CSGO } from "csgogsi";
import PlayerCamera from "../Camera/Camera";
import api from "../../API";
import "./camerasOnly.scss";

interface Props {
  game: CSGO;
}

const CamerasOnly = ({ game }: Props) => {
  const [availablePlayers, setAvailablePlayers] = useState<string[]>([]);

  // Obtener jugadores disponibles de la API de cámaras
  useEffect(() => {
    const loadPlayers = () => {
      api.camera.get().then(response => {
        const availableSteamids = response.availablePlayers.map(player => player.steamid);
        setAvailablePlayers(availableSteamids);
      }).catch(err => {
        console.error("Error loading camera players:", err);
      });
    };

    loadPlayers();
    const interval = setInterval(loadPlayers, 5000);
    return () => clearInterval(interval);
  }, []);

  // Obtener todos los jugadores del juego (hasta 10: 5 CT + 5 T)
  const allPlayers = useMemo(() => {
    const gamePlayers = game.players || [];
    const playerSet = new Set<string>();
    
    // Primero agregar jugadores del juego que tengan steamid
    gamePlayers.forEach(player => {
      if (player.steamid) {
        playerSet.add(player.steamid);
      }
    });
    
    // Si hay menos de 10 jugadores del juego, agregar jugadores disponibles
    if (playerSet.size < 10) {
      availablePlayers.forEach(steamid => {
        if (playerSet.size < 10) {
          playerSet.add(steamid);
        }
      });
    }
    
    return Array.from(playerSet);
  }, [game.players, availablePlayers]);

  // Separar jugadores por equipo
  const ctPlayers = useMemo(() => {
    const ct = allPlayers.filter(steamid => {
      const player = game.players?.find(p => p.steamid === steamid);
      return player?.team.side === "CT";
    });
    
    // Si no hay jugadores CT del juego, tomar los primeros 5 disponibles
    if (ct.length === 0) {
      return allPlayers.slice(0, 5);
    }
    
    // Limitar a 5 jugadores CT
    return ct.slice(0, 5);
  }, [allPlayers, game.players]);

  const tPlayers = useMemo(() => {
    const t = allPlayers.filter(steamid => {
      const player = game.players?.find(p => p.steamid === steamid);
      return player?.team.side === "T";
    });
    
    // Si no hay jugadores T del juego, tomar los siguientes 5 disponibles
    if (t.length === 0) {
      return allPlayers.slice(5, 10);
    }
    
    // Limitar a 5 jugadores T
    return t.slice(0, 5);
  }, [allPlayers, game.players]);

  return (
    <div className="cameras-only-layout">
      <div className="cameras-grid">
        <div className="team-column ct">
          <div className="team-label">CT</div>
          <div className="cameras-list">
            {ctPlayers.map(steamid => (
              <div key={`ct-${steamid}`} className="camera-item ct">
                <PlayerCamera steamid={steamid} visible={true} />
              </div>
            ))}
          </div>
        </div>
        <div className="team-column t">
          <div className="team-label">T</div>
          <div className="cameras-list">
            {tPlayers.map(steamid => (
              <div key={`t-${steamid}`} className="camera-item t">
                <PlayerCamera steamid={steamid} visible={true} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CamerasOnly;

