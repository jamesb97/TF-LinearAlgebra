import React from "react";
import MagicDropZone from "react-magic-dropzone";
import './App.css';
//require("@tensorflow/tfjs-backend-cpu");
//require("@tensorflow/tfjs-backend-webgl");
import * as cocoSsd from "@tensorflow-models/coco-ssd";
class Drop extends React.Component {
  onDrop = (accepted, rejected, links) => {
    const img = document.getElementById("img");
    //code execute
    cocoSsd.load().then(model => {
        //detect object in image
        model.detect(img).then(predictions => {
            console.log('Predictions: ', predictions);
        });
    });
  };
  render() {
    return (
      <div className="drop">
        <MagicDropZone
          accept="image/jpeg, image/png, .jpg, .jpeg, .png"
          onDrop={this.onDrop}
        >
          Drop files here!
        </MagicDropZone>
      </div>
    );
  }
}

export default Drop;