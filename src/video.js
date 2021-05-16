import React, { useState, useEffect } from "react";
import Progressbar from "./progress";
import Resumable from "resumablejs";
import VideSettings from "./VideSettings";
import "./video.module.css";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";

const FileUpload = () => {
  const [chunk, setChunksize] = useState(1048576);
  const [uploadpercentage, setuploadpersentage] = useState(0);
  const [progressbar, showprogressbar] = useState(false);
  const [inputfile, setinputfile] = useState(null);
  const [spinner, setspinner] = useState(false);
  const [chunkalert, setchunkalert] = useState(false);
  const [fileList, setfileList] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [streamsrc, setstreamsrc] = useState("url/mpd file");
  const url = "url";
  const handlechange = (e) => {
    setChunksize(e.target.value);
  };

  const round = (number, decimalPlaces) => {
    const factorOfTen = Math.pow(10, decimalPlaces);
    return Math.round(number * factorOfTen) / factorOfTen;
  };

  useEffect(async () => {
    const getfiles = await axios.get(`${url}/getfiles`);
    const prevFiles = getfiles.data.map((item) => "url" + item);
    setfileList(prevFiles);
  }, []);

  const setData = () => {
    if (inputfile != null) {
      // Setting filename session
      var file = inputfile[0];
      setchunkalert(true);
      var r = new Resumable({
        target: `${url}/upload`,
        testChunks: false,
        chunkSize: chunk,
        simultaneousUploads: 3,
        query: { upload_token: file["name"] },
      });
      r.addFile(file);
      r.on("fileAdded", function (file, event) {
        r.upload();
      });
      r.on("fileSuccess", function (file, message) {
        console.log("sucessfully file uploaded");
        const processVideo = async () => {
          setchunkalert(false);
          setspinner(true);
          const onlyvideo = await axios.post(`${url}/onlyvideo`, {
            filename: `${inputfile[0]["name"]}`,
          });
          const onlyaudio = await axios.post(`${url}/onlyaudio`, {
            filename: `${inputfile[0]["name"]}`,
          });
          const only720p = await axios.post(`${url}/only720`, {
            filename: `${inputfile[0]["name"]}`,
          });
          const only540 = await axios.post(`${url}/only540`, {
            filename: `${inputfile[0]["name"]}`,
          });
          const only240 = await axios.post(`${url}/only240`, {
            filename: `${inputfile[0]["name"]}`,
          });
          const mpd_file = await axios.post(`${url}/mpdfile`, {
            filename: `${inputfile[0]["name"]}`,
          });
          setspinner(false);
          setstreamsrc(url + "/" + mpd_file.data);
        };
        processVideo();
      });
      r.on("fileError", function (file, message) {
        setErrorMessage(
          "It appears the file was larger than 20Mb Please try a different file"
        );
      });
      r.on("fileProgress", function (file, message) {
        var progress = r.progress();
        showprogressbar(true);
        if (errorMessage == null) {
          setuploadpersentage(round((progress / 1) * 100, 2));
        } else {
          showprogressbar(false);
          setuploadpersentage(0);
        }
      });
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-xl-2 col-lg-2"></div>
        <div className="col-xl-3 col-lg-3 ">
          <label htmlFor="exampleFormControlFile1">
            {"Upload an mp4 file < 20Mb"}
          </label>
          <input
            type="file"
            className="form-control-file"
            id="exampleFormControlFile1"
            onChange={(e) => setinputfile(e.target.files)}
            accept=".mp4"
          />
        </div>
        <div className="col-xl-3 col-lg-3 ">
          <label htmlFor="Compress"></label>
          <select
            className="form-control"
            onChange={(e) => handlechange(e)}
            value={chunk}
          >
            <option value="262144">0.25Mb</option>
            <option value="1048576">1Mb</option>
            <option value="2097152">2Mb</option>
            <option value="4194304">4Mb</option>
            <option value="6291456">6Mb</option>
          </select>
          <small className="form-text text-muted">Chunk size</small>
        </div>
        <div className="col-xl-4 col-lg-4  mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setData()}
          >
            Upload
          </button>
        </div>
      </div>
      {chunkalert && (
        <div className="row text-center mt-3">
          <div className="col">
            <p>
              Open the Networks tab to view the file being uploaded in chunks
            </p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="row text-center mt-3">
          <div className="col">
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="row mt-4">
        <div className="col-xl-2 col-lg-2"></div>
        <div className="col-xl-8 col-lg-8">
          {progressbar && <Progressbar progress={uploadpercentage} />}
        </div>
        <div className="col-xl-2 col-lg-2"></div>
      </div>

      {spinner && (
        <div className="row mt-3 text-center mt-3">
          <div className="col-12">
            <p>Processing video into different formats</p>
          </div>
          <div className="col-12">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        </div>
      )}

      <div className="row mt-3 mb-5 text-center">
        <div className="col-xl-2 col-lg-2 "></div>
        <div className="col-xl-8 col-lg-8 d-flex justify-content-center">
          {/* <VideSettings src={streamsrc} key={streamsrc} /> */}
        </div>
        <div className="col-xl-2 col-lg-2"></div>
      </div>
      <p class="lead text-center">
        Resumable chunk upload with Dash playback support for mp4 files
      </p>
      <p class="lead text-center mt-4">
        {fileList && (
          <>
            <h1>File List</h1>
            {fileList.map((item, i) => (
              <p>
                <a href="#" onClick={() => setstreamsrc(item)}>
                  {`vid : ${i + 1}`}
                </a>
              </p>
            ))}
          </>
        )}
      </p>
    </>
  );
};

export default FileUpload;
