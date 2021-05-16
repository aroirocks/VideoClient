import React from "react";
import VideoPlayer from "./VideoPlayer";
import "../node_modules/video.js/dist/video-js.css";

function VideoSettings({ src, key }) {
  const videoJsOptions = {
    autoplay: false,
    controls: true,
    sources: [
      {
        src: src,
        type: "application/dash+xml",
      },
    ],
  };

  return (
    <>
      <VideoPlayer key={key} {...videoJsOptions} />
    </>
  );
}

export default VideoSettings;
