import React, { useState, useRef } from "react";

const MusicPopup = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef(null);

  const playlist = [
    <iframe src="https://www.nhaccuatui.com/mh/normal/qnRhGjLkfhEp" width="620" height="382" frameborder="0" allowfullscreen allow="autoplay"></iframe>,
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  ];

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const nextIndex = (currentTrack + 1) % playlist.length;
    setCurrentTrack(nextIndex);
    audioRef.current.src = playlist[nextIndex];
    audioRef.current.play();
    setIsPlaying(true);
  };

  const prevTrack = () => {
    const prevIndex = (currentTrack - 1 + playlist.length) % playlist.length;
    setCurrentTrack(prevIndex);
    audioRef.current.src = playlist[prevIndex];
    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div style={{ position: "fixed", bottom: "100px", right: "20px" }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{ padding: "10px", background: "#007bff", color: "#fff", borderRadius: "5px", border: "none", cursor: "pointer" }}>
        🎵 {isOpen ? "Đóng" : "Nhạc"}
      </button>

      {isOpen && (
        <div style={{ position: "absolute", bottom: "50px", right: "0", background: "#fff", padding: "15px", boxShadow: "0px 0px 10px rgba(0,0,0,0.2)", borderRadius: "8px" }}>
          <p>🎶 Trình phát nhạc</p>
          <button onClick={prevTrack} style={{ marginRight: "5px", padding: "10px", background: "#ffc107", color: "#fff", borderRadius: "5px", border: "none", cursor: "pointer" }}>⏮ Trước</button>
          <button onClick={toggleMusic} style={{ padding: "10px", background: "#28a745", color: "#fff", borderRadius: "5px", border: "none", cursor: "pointer" }}>
            {isPlaying ? "🔇 Tắt nhạc" : "▶️ Bật nhạc"}
          </button>
          <button onClick={nextTrack} style={{ marginLeft: "5px", padding: "10px", background: "#ffc107", color: "#fff", borderRadius: "5px", border: "none", cursor: "pointer" }}>⏭ Tiếp</button>
        </div>
      )}

      <audio ref={audioRef} src={playlist[currentTrack]} loop></audio>
    </div>
  );
};

export default MusicPopup;
