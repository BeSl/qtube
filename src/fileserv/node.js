const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require('cors');

const ffmpeg = require('fluent-ffmpeg');
const pathToFfmpeg = require('ffmpeg-static');
const ffprobe = require('ffprobe-static');

const app = express();
const PORT = 8000;

app.use(fileUpload());
app.use(cors());

app.get('/ping', function(req, res) {
  res.send('pong');
});

app.get("/", (req, res) => {
   res.sendFile(path.join(__dirname, "index.html"));
 });

app.use(express.static('files'));
app.use(express.static('files/images'));
app.use(express.static('files/video'));

app.post('/upload', function(req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  console.log('req.files >>>', req.files); // eslint-disable-line

  sampleFile = req.files.file;
  
  uploadPath = __dirname + '/files/' + sampleFile.name;
  
  sampleFile.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    const imgName = sampleFile.name.replace("mp4", "jpg");

    cutVideo(uploadPath, `${imgName}`, '5');
    return res.json({
      secure_url: sampleFile.name
    ,
      error : ""
    });
    
  });
});

const cutVideo = async (sourcePath, outputPath, startTime) => {
  console.log('start cut video');

  await new Promise((resolve, reject) => {
    ffmpeg(sourcePath)
      .setFfmpegPath(pathToFfmpeg)
      .setFfprobePath(ffprobe.path)
      .seek('3')
      .output(`files/${outputPath}`)
      .on('end', function (err) {
        if (!err) {
          console.log('conversion Done');
          resolve();
        }
      })
      .on('error', function (err) {
        console.log(outputPath);
        console.log('error: ', err);
        //reject(err);
      })
      .run();
  });
};

function generate_callback(file) {
  return function(err, stats) {
          console.log(file);
          console.log(stats["size"]);
      }
};

app.listen(PORT, function() {
  console.log('Express server listening on port ', PORT); // eslint-disable-line
});