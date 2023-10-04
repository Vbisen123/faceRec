
import React, { useRef, useEffect, useState } from 'react';
import './App.css';

function RecordVideo() {
  const videoRef = useRef();
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const sendSegmentIntervalRef = useRef(null); // Reference to the interval function

  useEffect(() => {
    startCamera();
    loadModels();
  }, []);

  useEffect(() => {
    if (isRecording) {
      startRecording();
      startSendingSegments();
    } else {
      stopSendingSegments();
    }
  }, [isRecording]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      console.log("video recording started");
    } catch (error) {
      console.error('Error starting video:', error);
    }
  };

  const loadModels = async () => {
    // Load face detection models here as you did before
    // ...
  };

  const startRecording = () => {
    try {
      const stream = videoRef.current.srcObject;
      if (stream) {
        mediaRecorderRef.current = new MediaRecorder(stream);
        const recordedChunks = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'video/mp4' });
          saveVideoToServer(blob); // Send the recorded video to the server

          // Clear recordedChunks for the next segment
          recordedChunks.length = 0;
        };

        mediaRecorderRef.current.start();
      }
    } catch (error) {
      console.error('Error starting MediaRecorder:', error);
    }
  };

  const saveVideoToServer = (blob) => {
    const formData = new FormData();
    formData.append('video', blob, 'recorded-video.webm');

    fetch('http://localhost:3002/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Video uploaded to the server');
      })
      .catch((error) => {
        console.error('Error uploading video to the server:', error);
      });
  };

  const startSendingSegments = () => {
    sendSegmentIntervalRef.current = setInterval(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.start();
      }
    }, 10000);
  };

  const stopSendingSegments = () => {
    if (sendSegmentIntervalRef.current) {
      clearInterval(sendSegmentIntervalRef.current);
    }
  };

  return (
    <div className="myapp">
      <h1>Face Detection</h1>
      <div className="appvideo">
        <video
          crossOrigin="anonymous"
          ref={videoRef}
          width="640"
          height="480"
          autoPlay={true}
        ></video>
      </div>
      <div className="buttons">
        <button onClick={() => setIsRecording(!isRecording)}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
    </div>
  );
}

export default RecordVideo;
