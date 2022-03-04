//to import the required tensorflow,react-webcam,coco-ssd model,hooks dependencies
import React, { useRef, useState, useEffect } from "react";

//tensorflow models dependency
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

//react-webcam dependency
import Webcam from "react-webcam";

//utilites to get rectangle boxes
import { drawRect } from "./Utilities/utilities";

import "./App.css";




function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  //to get screenshot on button click 
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);
  
  const myDesign =  {
    color: "Blue",
    padding: "10px",
    fontFamily: "Sans-Serif",
  }
  
  //to load the coco-ssd model from the 1st render, called from use effect hook
  const runCocoModel = async () => {
    const net = await cocoSsd.load();
    
    setInterval(() => {
      detect(net);
    }, 10);
  };

  //to get detections
  const detect = async (net) => {
    //to check if video data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      //to get the Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      //to set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      //to set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      //to make Detections
      const obj = await net.detect(video);
      // console.log(obj);

      //to draw the boxes
      const ctx = canvasRef.current.getContext("2d");
      drawRect(obj, ctx); 
    }
  };
  
  
  //to call runCocoModel on render
  useEffect(()=>{runCocoModel()});
  
  return (
    <>
      <div className="App">

        <div>
          <h1 style={myDesign}>✨✨✨Hello,Welcome to the Object Detection App with image capture feature ✨✨✨</h1>
          {/* on click to get screenshot from capture */}
          <button onClick={capture}>Click me to <em><b>Capture the image</b></em> 📸👌</button>
        </div><br />

        <div>
          {/* to render the image captured only when available and clicked */}
          {imgSrc && (<img src={imgSrc} alt={"screenshot"}/>)}
        </div>

        <header className="App-header">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            muted={true} 
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 9,
              width: 640,
              height: 480,
            }}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              right: 0,
              textAlign: "center",
              zindex: 8,
              width: 640,
              height: 480,
            }}
          />
        </header>
        
      </div>
    </>
  );
}

export default App;
