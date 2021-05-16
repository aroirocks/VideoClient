import React from "react";
import videojs from "video.js";
import "videojs-contrib-dash";

export default class VideoPlayer extends React.Component {
  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      console.log("onPlayerReady", this);
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    const Width = window.innerWidth;
    return (
      <div>
        {Width > 470 && (
          <video
            width="600"
            height="400"
            key={this.props.key}
            ref={(node) => (this.videoNode = node)}
            className="video-js vjs-default-skin vjs-big-play-centered"
            playsInline
          />
        )}

        {Width < 470 && (
          <video
            width="300"
            height="200"
            key={this.props.key}
            ref={(node) => (this.videoNode = node)}
            className="video-js vjs-default-skin vjs-big-play-centered"
          />
        )}
      </div>
    );
  }
}
