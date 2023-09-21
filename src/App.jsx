import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import * as faceapi from 'face-api.js';
//import { updateAttendance } from './components/api';
//import gifFrames from 'gif-frames';



function App() {
 //const videoRef = useRef();
 const videoRef = useRef();
  
  const canvasRef = useRef();
 // const [recognizedPerson, setRecognizedPerson] = useState("");
  const [recognizedData, setRecognizedData] = useState([]);

  useEffect(() => {
    startVideo();
    loadModels();
    
  }, []);

  // const startVideo = () => {
  //   navigator.mediaDevices.getUserMedia({ video: true })
  //     .then(currentStream => {
  //       videoRef.current.srcObject = currentStream;
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // }



  const startVideo = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log('device :',devices)
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices.length > 0) {
        const externalCamera = videoDevices.find(device => device.deviceId === 'ie+0N1nJcBqpGs+RXnIQIHk3TQw2r5OxpAK0vzJmRNo=');
        const selectedDevice = externalCamera || videoDevices[0];

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: selectedDevice.deviceId }
        });

        videoRef.current.srcObject = stream;
      } else {
        console.log('No video devices found.');
      }
    } catch (error) {
      console.error('Error starting video:', error);
    }
  };

  // const startVideo = async () => {
  //   const videoPath = '/Lables/demo3.mp4';
  //   if (videoRef.current) {
  //     // Check if video is already playing and pause it
  //     if (!videoRef.current.paused) {
  //       videoRef.current.pause();
  //     }
  //     // Set the video source and add event listeners
  //     videoRef.current.src = videoPath;
  //     videoRef.current.preload = 'auto';
  //     videoRef.current.loop = true;
  //     await videoRef.current.play(); // Start playing the video

  //     // Add an event listener for when the video ends
  //     videoRef.current.addEventListener('ended', () => {
  //       videoRef.current.currentTime = 0; // Rewind the video to the beginning
  //       videoRef.current.play(); // Start playing again
  //     });
  //   }
  // };
  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.ageGenderNet.loadFromUri('/models'),
      faceapi.nets.mtcnn.loadFromUri('/models'),
      faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
     
    ]);
    console.log('faceapi.nets', faceapi.nets);
    faceDetection();
  };


  const faceDetection = async () => {
    //const labeledFaceDescriptors = await loadLabeledImages();
    const labeledFaceDescriptors = await loadLabeledImages();
    console.log('labeledFaceDescriptors', labeledFaceDescriptors);


    const models = [
      await faceapi.loadTinyFaceDetectorModel('/models'),
     // await faceapi.loadMtcnnModel('/models'),
      await faceapi.loadSsdMobilenetv1Model('/models')
    ];


    // Initialize an array to store detected IDs
    const detectedIds = [];
  
    setInterval(async () => {
      // const detections = await faceapi.detectAllFaces(videoRef.current,
      //   new faceapi.TinyFaceDetectorOptions())
      const detectionsPromises = models.map(async (model) => {
        // Detect faces using each model
        const detections = await faceapi
          .detectAllFaces(videoRef.current, model)
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions()
        .withAgeAndGender();

        return detections 
      });

      const allDetections = await Promise.all(detectionsPromises)

      const detections = [].concat(...allDetections);



      const context = canvasRef.current.getContext('2d');
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      const resized = faceapi.resizeResults(detections, {
        width: 940,
        height: 650
      });
      faceapi.draw.drawDetections(canvasRef.current, resized);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
  
      const recognizedData = [];

      
  
      for (const detection of detections) {
        const faceDescriptor = detection.descriptor;
        const expressions = detection.expressions;
        const dominantExpression = getDominantExpression(expressions);
        const gender = detection.gender;
        const age = detection.age;
       
  
        // Initialize with high distance and unknown label
        let bestMatch = { label: 'Unknown', distance: 1.0 };
  
        const RECOGNITION_THRESHOLD = 0.38;


        // Compare with labeled face descriptors
        if(faceDescriptor){
        for (const labeledDescriptor of labeledFaceDescriptors) {
          if(labeledDescriptor.descriptors[0]){
          const distance = faceapi.euclideanDistance(faceDescriptor, labeledDescriptor.descriptors[0]);
          if (distance < bestMatch.distance) {
            bestMatch = { label: labeledDescriptor.label, distance: distance };
          }
        }
      }
    }
        // Check if the detected ID is not in the detectedIds array and distance is below threshold
        if (!detectedIds.some((idObj) => idObj.label === bestMatch.label) && bestMatch.distance < RECOGNITION_THRESHOLD) {
          detectedIds.push(bestMatch); // Add the detected ID to the array
          console.log(`Recognized: ${bestMatch.label}`);
        }
  
       // console.log('faceDescriptor', faceDescriptor);
  
        // console.table('Recognized Data', `${bestMatch.label}`, `${bestMatch.distance}`,
        //   `${bestMatch.distance < RECOGNITION_THRESHOLD ? 'Match' : 'No Match'}`);
        // console.log('person data', bestMatch.label, gender, age.toFixed(0), expressions, dominantExpression);
  
        recognizedData.push({
          id: bestMatch.distance < RECOGNITION_THRESHOLD ? bestMatch.label : 'Unknown',
          gender: gender,
          age: age.toFixed(0),
          expressions: expressions,
          dominantExpression: dominantExpression,
          time: new Date().toLocaleTimeString(),
          descriptors: faceDescriptor
        });
      }
      console.log("recognized data",recognizedData)
  
      // Log the current time here
      const currentTime = new Date().toLocaleTimeString();
      // console.log("Current Time:", currentTime);
  
      setRecognizedData(recognizedData);
      //updateDatabase(recognizedData);
  
      // Display all detected IDs without repetition
      console.log('Detected IDs:', [...new Set(detectedIds.map((idObj) => idObj.label))]);
    }, 100);
  };
  
 


  const getDominantExpression = (expressions) => {
    let dominantExpression = null;
    let maxConfidence = 0;

    for (const expression in expressions) {
      if (expressions[expression] > maxConfidence) {
        maxConfidence = expressions[expression];
        dominantExpression = expression;
      }
    }

    return dominantExpression;
  };

  const loadLabeledImages = async () => {
    const labeledDescriptors = [];
    const labels =['vishal_1','vishal_2','vishal_3','vishal_4','vishal_5','vishal_6','vishal_8',
    'vijaya','abhishek','abhishekP','alok','anuja','bhargavi','bhargavi_1','kunal','kunal_2','kunal_4','kunal_5'
    ,'kunal_6','kunal_8','mukul_1','mukul_2','mukul_3','mukul_4','akash','jitendra','shivam','virat','rohitS','deepak',
    'sumit','sumit_02','sumit_3','sumit_05','sumit_06','420']
   
  
    for (const label of labels) {
      const descriptors = [];
     // const commonLabel = label.split('_')[0];
  
      try {
        const img = await faceapi.fetchImage(`/Lables/${label}.jpg`);
        
        // Detect faces using the SsdMobilenetv1 model
      //  console.log("try to fetch SsdMobilenetv ")
        const detectionSsd = await faceapi.detectSingleFace(img,
          new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptor();
        //  console.log("SsdMobilenetv fetched succesfully")
  
        // Detect faces using the TinyFaceDetector model
       // console.log("try to fetch TinyfaceDetector ")
        const detectionTiny = await faceapi.detectSingleFace(img,
          new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
        //  console.log("TinyfaceDetector fetched succesfully")
  
        // Combine results from both models
        if (detectionSsd) {
          descriptors.push(detectionSsd.descriptor);
        }
        if (detectionTiny) {
          descriptors.push(detectionTiny.descriptor);
        }
      } catch (error) {
        console.error(`Error loading or detecting face in image ${label}:`, error);
      }
  
      if (descriptors.length > 0) {
        // Create a LabeledFaceDescriptors instance for the label and its descriptors
        labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors));
      }
    }
  
    return labeledDescriptors;
  };
  
  
  // // Helper function to average descriptors
  // function averageDescriptors(descriptors) {
  //   const numDescriptors = descriptors.length;
  //   const descriptorSize = descriptors[0].length;
  
  //   // Initialize an array with zeros
  //   const combinedDescriptor = new Float32Array(descriptorSize);
  //   console.log('combinedDescriptor',combinedDescriptor)
  
  //   for (let i = 0; i < numDescriptors; i++) {
  //     for (let j = 0; j < descriptorSize; j++) {
  //       combinedDescriptor[j] += descriptors[i][j];
  //     }
  //   }
  
  //   // Calculate the average
  //   for (let j = 0; j < descriptorSize; j++) {
  //     combinedDescriptor[j] /= numDescriptors;
  //   }
  
  //   return combinedDescriptor;
  // }
  







  return (
    <div className="myapp">
      <h1>Face Detection</h1>
      <div className="appvide">
        <video crossOrigin="anonymous" id="video"   ref={videoRef} width="940" height="650" autoPlay = {true}></video>
      </div>
      <canvas ref={canvasRef} width="940" height="650" className="appcanvas" />
      <div className="recognized-labels">
        {recognizedData.map((data, index) => (
          <div key={index} className="recognized-person">
            <p>ID: {data.id},(Gender: {data.gender},Age: {data.age},Expression: {data.dominantExpression})</p>
            {/* <p>Expressions:</p> */}
            {/* <ul>
            {Object.keys(data.expressions).map((expression, index) => (
              <li key={index}>
                {expression}: {data.expressions[expression]}
              </li>
            ))}
          </ul> */}
          </div>
        ))}
      </div>
    </div>
  );

}

export default App;
