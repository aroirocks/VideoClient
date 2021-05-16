import React from "react";
import { ProgressBar } from "react-bootstrap";

const Progressbar = ({ progress }) => (
  <ProgressBar now={progress} label={`${progress}%`} />
);

export default Progressbar;
