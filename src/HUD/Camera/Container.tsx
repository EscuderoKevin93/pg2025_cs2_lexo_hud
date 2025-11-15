import { useEffect, useState, useMemo } from "react";
import PlayerCamera from "./Camera";
import api from "../../API";
import "./index.scss";



const CameraContainer = ({ observedSteamid }: { observedSteamid: string | null }) => {
    const [ players, setPlayers ] = useState<string[]>([]);

    useEffect(() => {
        const loadPlayers = () => {
            api.camera.get().then(response => {
                const availableSteamids = response.availablePlayers.map(player => player.steamid);
                setPlayers(prev => {
                    const allPlayersSet = new Set([...prev, ...availableSteamids]);
                    if (observedSteamid) {
                        allPlayersSet.add(observedSteamid);
                    }
                    return Array.from(allPlayersSet);
                });
            }).catch(err => {
                console.error("Error loading camera players:", err);
            });
        };

        loadPlayers();
        
        const interval = setInterval(loadPlayers, 5000);
        
        return () => clearInterval(interval);
    }, [observedSteamid]);

    useEffect(() => {
        if (observedSteamid) {
            setPlayers(prev => {
                const uniqueSet = new Set(prev);
                uniqueSet.add(observedSteamid);
                return Array.from(uniqueSet);
            });
        }
    }, [observedSteamid]);

    const uniquePlayers = useMemo(() => Array.from(new Set(players)), [players]);

    return <div id="cameras-container">
        {
            uniquePlayers.map(steamid => (
                <PlayerCamera key={`camera-${steamid}`} steamid={steamid} visible={observedSteamid === steamid} />
            ))
        }
    </div>
}

export default CameraContainer;