import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Drop from './Drop';
/*require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl')
const cocoSsd = require('@tensorflow-models/coco-ssd');*/
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

class App extends React.Component {
  videoRef = React.createRef();
  canvasRef = React.createRef();
  onDrop = (accepted, rejected, links) => {
    //Some content
  }
  componentDidMount() {
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
      const webCamPromise = navigator.mediaDevices.getUserMedia(
        { audio: false,
        video: {
          facingMode: "user"
        } }
      )
      .then(stream => {
        window.stream = stream;
        this.videoRef.current.srcObject = stream;
        return new Promise((resolve, reject) => {
          this.videoRef.current.onloadmetadata = () => {
            resolve();
          };
        });
      });
      const modelPromise = cocoSsd.load();
      Promise.all([modelPromise, webCamPromise])
      .then(values => {
        this.detectFrame(this.videoRef.current, values[0]);
      })
      .catch(error => {
        console.log(error);
      });
    }
  }
  detectFrame = (video, model) => {
    model.detect(video).then(predictions => {
      this.renderPredictions(predictions);
      requestAnimationFrame(() => {
        this.detectFrame(video, model);
      });
    });
  };
  renderPredictions = predictions => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //Font options
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      //Draw the bounding box
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);
      //Draw out the label background
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10);
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });
    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      //Draw out the text last to ensure that it is on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
      console.log("Predictions: ", predictions);
    });
  };
  render() {
    return (
      <div className="container">
      <h2>TensorFlow Object Detection</h2>
        <video className="size" autoPlay playsInline muted ref={this.videoRef} width="600" height="500" />
        <canvas className="size" ref={this.canvasRef} width="600" height="500" />
        <br />
        <Drop />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
export default App;