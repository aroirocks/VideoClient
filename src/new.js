const setData = () => {
  if (inputfile != null) {
    // Setting filename session
    var file = inputfile[0];
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
    });
    r.on("fileError", function (file, message) {
      console.log("error Uploading the file");
    });
    r.on("fileProgress", function (file, message) {
      var progress = r.progress();
      // Here we can show progress on a spinner or a progress Bar
    });
  }
};
