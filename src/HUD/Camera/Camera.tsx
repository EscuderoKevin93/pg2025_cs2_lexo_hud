import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { mediaStreams } from "../../API/HUD/camera";
type Props = {
    steamid: string,
    visible: boolean;
}

const CameraView = ({ steamid, visible }: Props) => {
    const [uuid] = useState(uuidv4());
    const [ forceHide, setForceHide ] = useState(false);

    useEffect(() => {

    }, [])

    useEffect(() => {
        const mountStream = (stream: MediaStream) => {
            console.log(`[Camera] Mounting stream for ${steamid}`);
            const remoteVideo = document.getElementById(`remote-video-${steamid}-${uuid}`) as HTMLVideoElement;
            if(!remoteVideo || !stream){
                console.log(`[Camera] No video element or stream for ${steamid}`);
            }
            if (!remoteVideo || !stream) return;
    
            remoteVideo.srcObject = stream;
    
            remoteVideo.play().catch(err => {
                console.error(`[Camera] Error playing video for ${steamid}:`, err);
            });
        }

        const mountExistingStream = () => {
            const currentStream = mediaStreams.players.find(player => player.steamid === steamid);
            console.log(`[Camera] Checking for existing stream for ${steamid}:`, {
                found: !!currentStream,
                hasPeerConnection: !!currentStream?.peerConnection,
                hasRemoteStreams: !!currentStream?.peerConnection?._remoteStreams,
                streamCount: currentStream?.peerConnection?._remoteStreams?.length || 0,
                allPlayers: mediaStreams.players.map(p => p.steamid)
            });
            
            if(!currentStream || !currentStream.peerConnection || !currentStream.peerConnection._remoteStreams) {
                console.log(`[Camera] No existing stream connection for ${steamid} - waiting for stream...`);
                return;
            }

            const stream = currentStream.peerConnection._remoteStreams[0];

            if(!stream) {
                console.log(`[Camera] No stream in connection for ${steamid}`);
                return;
            }

            mountStream(stream);
        }

        const onStreamCreate = (stream: MediaStream) => {
            console.log(`[Camera] Stream created for ${steamid}`);
            mountStream(stream);
        }

        const onStreamDestroy = () => {
            console.log(`[Camera] Stream destroyed for ${steamid}`);
            const remoteVideo = document.getElementById(`remote-video-${steamid}-${uuid}`) as HTMLVideoElement;

            if (!remoteVideo) return;

            remoteVideo.srcObject = null;
        }

        const onBlockedUpdate = (steamids: string[]) => {
            const isBlocked = steamids.includes(steamid);
            console.log(`[Camera] Blocked update for ${steamid}: ${isBlocked}`);
            setForceHide(isBlocked);
        }

        console.log(`[Camera] Setting up camera for ${steamid}, visible: ${visible}`);
        
        const isBlocked = mediaStreams.blocked.includes(steamid);
        setForceHide(isBlocked);
        if (isBlocked) {
            console.log(`[Camera] Player ${steamid} is blocked`);
        }

        mediaStreams.onStreamCreate(onStreamCreate, steamid);
        mediaStreams.onStreamDestroy(onStreamDestroy, steamid);
        mediaStreams.onBlockedUpdate(onBlockedUpdate);

        mountExistingStream();

        return () => {
            mediaStreams.removeListener(onStreamCreate);
            mediaStreams.removeListener(onStreamDestroy);
            mediaStreams.removeListener(onBlockedUpdate);
        }
    }, [steamid, uuid]);

    const shouldShow = visible && !forceHide;
    console.log(`[Camera] Rendering video for ${steamid}, visible: ${visible}, forceHide: ${forceHide}, shouldShow: ${shouldShow}`);

    return <React.Fragment>
        <video className="video-call-preview" autoPlay muted id={`remote-video-${steamid}-${uuid}`} style={{ opacity: shouldShow ? 1 : 0.001 }}></video>
    </React.Fragment>
}

export default CameraView;