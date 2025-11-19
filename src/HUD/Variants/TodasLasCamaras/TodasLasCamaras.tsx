import { useEffect, useState, useMemo } from "react";
import { CSGO, Player } from "csgogsi";
import PlayerCamera from "../../Camera/Camera";
import api from "../../../API";
import "./todasLasCamaras.scss";

interface Props {
  game: CSGO;
  filterTeam?: "CT" | "T" | null;
}

const TodasLasCamaras = ({ game, filterTeam = null }: Props) => {
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

  // Obtener todos los jugadores del juego
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

  // Filtrar jugadores por equipo si es necesario
  const filteredPlayers = useMemo(() => {
    const players = allPlayers.map(steamid => {
      const player = game.players?.find(p => p.steamid === steamid);
      return { steamid, player };
    }).filter(({ player }) => {
      if (!filterTeam) return true;
      return player?.team.side === filterTeam;
    });

    return players;
  }, [allPlayers, game.players, filterTeam]);

  const getPlayerInfo = (steamid: string): Player | null => {
    return game.players?.find(p => p.steamid === steamid) || null;
  };

  return (
    <div className="todas-las-camaras-layout">
      <div className="cameras-horizontal-grid">
        {filteredPlayers.map(({ steamid, player }) => {
          const playerInfo = player || getPlayerInfo(steamid);
          if (!playerInfo) return null;

          const health = playerInfo.state.health || 0;
          const kills = playerInfo.stats?.kills || 0;
          const deaths = playerInfo.stats?.deaths || 0;
          const assists = playerInfo.stats?.assists || 0;
          const isDead = health === 0;

          return (
            <div key={steamid} className={`camera-horizontal-item ${playerInfo.team.side.toLowerCase()} ${isDead ? "dead" : ""}`}>
              {/* Contenedor de la cámara */}
              <div className="camera-video-container">
                <PlayerCamera steamid={steamid} visible={true} />
              </div>

              {/* Información del jugador abajo - una sola línea */}
              <div className="player-info-bar">
                <span className="player-name">{playerInfo.name?.toUpperCase() || "UNKNOWN"}</span>
                {!isDead && <span className="stat health">{health}</span>}
                <span className="stat kills">{kills}</span>
                <span className="stat deaths">{deaths}</span>
                <span className="stat assists">{assists}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodasLasCamaras;

