
import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import * as faceapi from 'face-api.js';
import axios from 'axios';

function Facerec() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [recognizedData, setRecognizedData] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state

  useEffect(() => {
    loadModelsAndLabels()
      .then(() => {
        setIsLoading(false); // Set isLoading to false once models and labels are loaded
        loadVideos();
        const interval = setInterval(loadVideos, 5000); // Fetch videos every 5 seconds (adjust as needed)
        setFetchInterval(interval);
      })
      .catch((error) => {
        console.error('Error loading models and labels:', error);
      });
      
  }, []);;


  useEffect(() => {
    if (isPlaying) {
      startVideo(currentVideoIndex);
    }
  }, [currentVideoIndex, isPlaying]);

  const loadVideos = () => {
    axios.get('http://localhost:3002/uploaded') // Replace with your server endpoint
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        return response.data;
      })
      .then((data) => {
        if (data && data.files && data.files.length > 0) {
          setVideoList(data.files);
          setIsPlaying(true); // Start playing the video when the list is loaded
        } else {
          console.error('No video files found in the list.');
        }
      })
      .catch((error) => {
        console.error('Error loading video list:', error);
      });
  };

  const loadModelsAndLabels = async () => {
    // Show loader while loading models and labels
    setIsLoading(true);

    try {
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

      const labeledFaceDescriptors = await loadLabeledImages();

      // Start face detection once everything is loaded
      faceDetection(labeledFaceDescriptors);
    } catch (error) {
      console.error('Error loading models and labels:', error);
    }
  };

  const loadLabeledImages = async () => {
    const labeledDescriptors = [];
    const labels = [
      'vishal_1', 'vishal_2', 'vishal_3',
      'vishal_4', 'vishal_5', 'vishal_6', 'vishal_8',
      'vijaya', 'abhishek', 'abhishekP', 'alok', 'anuja',
      'bhargavi', 'bhargavi_1', 'kunal', 'kunal_2', 'kunal_4',
      'kunal_5', 'kunal_6', 'kunal_8', 'mukul_1', 'mukul_2',
      'mukul_3', 'mukul_4', 'akash', 'jitendra', 'shivam',
      'virat', 'rohitS', 'deepak', 'sumit', 'sumit_02',
      'sumit_3', 'sumit_05', 'sumit_06', '420'
    ];

    for (const label of labels) {
      const descriptors = [];

      try {
        const img = await faceapi.fetchImage(`/Lables/${label}.jpg`);

        const detectionSsd = await faceapi.detectSingleFace(img,
          new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptor();

        const detectionTiny = await faceapi.detectSingleFace(img,
          new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

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
        labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors));
      }
    }

    return labeledDescriptors;
  };

  const faceDetection = async (labeledFaceDescriptors) => {
    const detectedIds = [];

    setInterval(async () => {
      const detections = await faceapi.detectAllFaces(videoRef.current,
        new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions()
        .withAgeAndGender();

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

        let bestMatch = { label: 'Unknown', distance: 1.0 };

        const RECOGNITION_THRESHOLD = 0.4;

        for (const labeledDescriptor of labeledFaceDescriptors) {
          if (labeledDescriptor.descriptors[0]) {
            const distance = faceapi.euclideanDistance(faceDescriptor, labeledDescriptor.descriptors[0]);
            if (distance < bestMatch.distance) {
              bestMatch = { label: labeledDescriptor.label, distance: distance };
            }
          }
        }

        if (!detectedIds.some((idObj) => idObj.label === bestMatch.label) && bestMatch.distance < RECOGNITION_THRESHOLD) {
          detectedIds.push(bestMatch);
          console.log(`Recognized: ${bestMatch.label}`);
        }

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

      const currentTime = new Date().toLocaleTimeString();

      setRecognizedData(recognizedData);
      console.log('Detected IDs:', [...new Set(detectedIds.map((idObj) => idObj.label))]);
    }, 1000);
  };

  const startVideo = (index) => {
    if (videoList.length === 0) {
      return;
    }

    const videoUrl = `http://localhost:3002/public/${videoList[index]}`;
    videoRef.current.src = videoUrl;
    videoRef.current.load();

    videoRef.current.oncanplay = () => {
      videoRef.current.play();
    };

    videoRef.current.onerror = (error) => {
      console.error('Error loading video:', error);
    };
  };

  const handleVideoEnded = () => {
    setCurrentVideoIndex((currentVideoIndex + 1) % videoList.length);
    faceDetection();
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

  return (
    <div className="myapp">
      <h1>Face Detection</h1>
      {isLoading ? (
        <div className="loading-screen">
          <p>Loading models and labels...</p>
        </div>
      ) : (
        <>
          <div className="appvideo">
            <video
              crossOrigin="anonymous"
              id="video"
              ref={videoRef}
              width="940"
              height="650"
              controls
              autoPlay={true}
              onEnded={handleVideoEnded}
            ></video>
          </div>
          <canvas ref={canvasRef} width="940" height="650" className="appcanvas" />
          <div className="recognized-labels">
            {recognizedData.map((data, index) => (
              <div key={index} className="recognized-person">
                <p>ID: {data.id}, (Gender: {data.gender}, Age: {data.age}, Expression: {data.dominantExpression})</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Facerec;
