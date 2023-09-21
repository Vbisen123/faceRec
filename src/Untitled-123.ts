



///code for playing video on screen and webcam 


  // const startVideo = async () => {
  //   try {
  //     const devices = await navigator.mediaDevices.enumerateDevices();
  //     console.log('device :',devices)
  //     const videoDevices = devices.filter(device => device.kind === 'videoinput');

  //     if (videoDevices.length > 0) {
  //       const externalCamera = videoDevices.find(device => device.deviceId === 'ie+0N1nJcBqpGs+RXnIQIHk3TQw2r5OxpAK0vzJmRNo=');
  //       const selectedDevice = externalCamera || videoDevices[0];

  //       const stream = await navigator.mediaDevices.getUserMedia({
  //         video: { deviceId: selectedDevice.deviceId }
  //       });

  //       videoRef.current.srcObject = stream;
  //     } else {
  //       console.log('No video devices found.');
  //     }
  //   } catch (error) {
  //     console.error('Error starting video:', error);
  //   }
  // };



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



  // const videodete = startVideo();
  // console.log('video',videodete)
  



  //code for live detection  




// Define the euclideanDistance function
// function euclideanDistance(point1, point2) {
//   const dx = point1.x - point2.x;
//   const dy = point1.y - point2.y;
//   return Math.sqrt(dx * dx + dy * dy);
// }

// // Define the isLiveFaceDetected function
// function isLiveFaceDetected(faceLandmarks) {
//   // Set an appropriate threshold for mouth movement based on your environment and conditions
//   const MOUTH_MOVEMENT_THRESHOLD = 0.1;

//   // Calculate the distance between mouth landmarks (e.g., points 49 and 55)
//   const mouthDistance = euclideanDistance(faceLandmarks[49], faceLandmarks[55]);

//   // You should have a proper implementation for isBlinkDetected
//   // For this example, let's assume isBlinkDetected is a function that checks for blinking.
//   const isBlinkDetected = checkForBlink(faceLandmarks);

//   // If blink is not detected and mouth movement is below the threshold, consider it a live face
//   return !isBlinkDetected && mouthDistance < MOUTH_MOVEMENT_THRESHOLD;
// }

// // Example function to check for blinking (you can implement your own logic here)
// function checkForBlink(faceLandmarks) {
//   // Implement logic to check for blinking here
//   return false; // For the sake of this example, assume no blinking
// }



// // Calculate the Eye Aspect Ratio (EAR) for a given set of eye landmarks
// function calculateEAR(eyeLandmarks) {
//   const eyeInner = euclideanDistance(eyeLandmarks[1], eyeLandmarks[5]);
//   const eyeTop = euclideanDistance(eyeLandmarks[2], eyeLandmarks[4]);
//   const eyeBottom = euclideanDistance(eyeLandmarks[0], eyeLandmarks[3]);
//   // console.log('eyeInner',eyeInner)
//   // console.log('eyeTop',eyeTop)
//   // console.log('eyeBottom',eyeBottom)


//   return (eyeInner + eyeTop) / (2 * eyeBottom);
// }

// // Check if a blink is detected based on EAR
// function isBlinkDetected(faceLandmarks) {
//   const leftEyeEAR = calculateEAR(faceLandmarks.getLeftEye());
//   const rightEyeEAR = calculateEAR(faceLandmarks.getRightEye());

//   // Set an appropriate threshold based on your environment and conditions
//   const EAR_THRESHOLD = 0.2;

//   // If both eyes have a lower EAR than the threshold, consider it a blink
//   return leftEyeEAR < EAR_THRESHOLD && rightEyeEAR < EAR_THRESHOLD;
// }

// Call the loadVideoDescriptors function
//loadVideoDescriptors();

//loadVideoDescriptors(); // Call this function to load video descriptors




////////////////////////////////////////////////////




        // const isBlinking = isBlinkDetected(detection.landmarks);
        // console.log(isBlinking)


        // if (isBlinking){
        //   continue;
        // }
  
        //  const isLive = isLiveFaceDetected(detection.landmarks)
        //  console.log(isLive)

        // if (isLive){
        //   continue;
        // }


        ////////////////////////////






        //code for video and image detector  

  // const labels = ['vishal_10'];
  
  // async function loadVideoDescriptors() {
  //   const labeledFaceDescriptors = [];
  
  //   // Loop through your labels
  //   for (const label of labels) {
  //     const descriptors = [];
  //     console.log("descriptors", descriptors);
  
  //     try {
  //       const videoPath = `/Lables/${label}.mp4`;
  //       const video = document.createElement('video');
  //       video.src = videoPath;
  //       video.autoplay= true;
  //       video.muted = true;
  //       video.type = 'video/mp4';
  
  //       // Create a canvas to draw video frames
  //       const canvas = document.createElement('canvas');
  //       const context = canvas.getContext('2d'); // Get 2D rendering context
  //       document.body.appendChild(canvas);
  
  //       // Wait for video to load its metadata
  //       await new Promise((resolve) => {
  //         video.addEventListener('loadedmetadata', () => {
  //           // Set canvas dimensions to match video dimensions
  //           canvas.width = video.videoWidth;
  //           canvas.height = video.videoHeight;
  //           console.log('Video metadata loaded:', video.videoWidth, video.videoHeight);
  
  //           // video.play().then(() => resolve());
  //           // console.log("Video is playing");
  //           video.play()
  //           .then(() => {
  //             console.log("Video is playing");
  //             resolve();
  //           })
  //           .catch((error) => {
  //             console.error("Error playing video:", error);
  //             reject(error);
  //           });
          
  //         });
  //       });
  
  //       video.addEventListener('play', async () => {
  //         console.log("detection is started")
  //         setInterval(async () => {
  //           const detections = await faceapi.detectAllFaces(canvas,
  //             new faceapi.SsdMobilenetv1Options())
  //             .withFaceLandmarks()
  //             .withFaceDescriptors()
  //             .withFaceExpressions()
  //             .withAgeAndGender();


  
  //           if (detections && detections.length > 0) {
  //             for (const detection of detections) {
  //               const descriptor = detection.descriptor;
  //               descriptors.push(descriptor);
  //             }
  //           }
  //         }, 100); // Adjust the interval as needed
  //       });
  
  //       labeledFaceDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors));
  //       //video.pause();
  //     } catch (error) {
  //       console.error(`Error loading or detecting faces in video ${label}:`, error);
  //     }
  //   }
  
  //   return labeledFaceDescriptors;
  // }
  
  // // Call the function to load video descriptors
  // loadVideoDescriptors().then((labeledFaceDescriptors) => {
  //   console.log('Loaded face descriptors:', labeledFaceDescriptors);
  // }).catch((error) => {
  //   console.error('Error loading video descriptors:', error);
  // });
  
  // loadVideoDescriptors().then((labeledFaceDescriptors) => {
  //   console.log('Video descriptors loaded:', labeledFaceDescriptors);
  // });
  
  
  



//for detecting faces on the basis of loaded images

//   const loadLabeledImages = async () => {
//     const labeledDescriptors = [];

//     // const labels = ['4_01','04_02','04_03','04_04','05','05_3','05_4', '05_5','05_6','06_01','06_2','06_03','06_04','16','16_1','16_2','16_3','16_4',
//     // '16_5','16_6','16_7','16_8','16_9','16_10','17','18','19','20','21'];
//    const labels =['vishal_1','vishal_2','vishal_3','vishal_4','vishal_5','vishal_6','vishal_8',
//    'vijaya','abhishek','abhishekP','alok','anuja','bhargavi','bhargavi_1','kunal','kunal_2','kunal_3','kunal_4','kunal_5'
//    ,'kunal_6','kunal_8','mukul_1','mukul_2','mukul_3','mukul_4','akash','jitendra','shivam','dhoni','virat','rohitS','deepak','sumit','sumit_02','sumit_3','sumit_05','sumit_06','420']


    

//     for (const label of labels) {
//       const descriptors = [];

//     //  const commonLabel = label.split('_')[0];

//       try {
//         const img = await faceapi.fetchImage(`/Lables/${label}.jpg`);
//         const detection = await faceapi.detectSingleFace(img,
//           new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor().withFaceExpressions()
//           .withAgeAndGender();

//          // console.log('detection',detection)
//         if (detection) {
//           const descriptor = detection.descriptor;
//           descriptors.push(descriptor);
//         }
//       } catch (error) {
//         console.error(`Error loading or detecting face in image ${label}:`, error);
//       }
  
     
//       let i = 1;
//       while (true) {
//         try {
//           const img = await faceapi.fetchImage(`/Lables/${label}_${i}.jpg`);
//           const detection = await faceapi.detectSingleFace(img,
//             new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

//           if (detection) {
//             const descriptor = detection.descriptor;
//             descriptors.push(descriptor);
//           }
//         } catch (error) {
         
//           break;
//         }
//         i++;
//       }
//       if (descriptors.length > 0) {
//         labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors));
//       }
//     }
//     return labeledDescriptors;
//  };





///code for api connection 

// async function updateDatabase(data) {
//   try {
//     for (const personData of data) {
//       console.log('Updating attendance for ID:', personData.id);
//       console.log('Time:', personData.time);

//       const response = await fetch(`http://localhost:4000/attendances/${personData.id}`, {
        
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           attendance: 1, // Incrementing by one is handled on the server
//           last_attendance_date: new Date().toISOString(),
//           last_attendance_time: personData.time,
//         }),
//       });

//       if (response.ok) {
//         console.log(`Attendance for ID ${personData.label} updated successfully`);
//       } else {
//         console.error(`Failed to update attendance for ID ${personData.label}`);
//       }
//     }
//   } catch (error) {
//     console.error('Error updating database:', error);
//   }
// }




//////////////////////////////////////////////////
//code for gif detection 





// async function loadGifDescriptors() {
//   const labeledFaceDescriptors = [];
//   const labels = ['virat12']; // Your list of labels
//   console.log('Starting loadGifDescriptors');
//   console.log(labels)
  
//   window.Uint8Array = Uint8Array;

//   for (const label of labels) {
//     const descriptors = [];

//     try {
//       const gifPath = `/Lables/${label}.gif`;


//       console.log(`Processing GIF: ${gifPath}`);
//       // Extract frames from the GIF
//       const frames = await gifFrames({ url: gifPath, frames: 'all' });
//       console.log(`Extracted ${frames.length} frames from the GIF`);
//       for (let i = 0; i < frames.length; i++) {
//         const frame = frames[i].getImage()._image;
//         const canvas = faceapi.createCanvasFromMedia(frame);
//         const displaySize = { width: frame.width, height: frame.height };

//         // Set up faceapi.js
//         const faceapiOptions = new faceapi.TinyFaceDetectorOptions();

//         const detections = await faceapi.detectAllFaces(canvas, faceapiOptions)
//           .withFaceLandmarks()
//           .withFaceDescriptors();

//         if (detections && detections.length > 0) {
//           for (const detection of detections) {
//             const descriptor = detection.descriptor;
//             descriptors.push(descriptor);
//           }
//         }
//       }
//     } catch (error) {
//       console.error(`Error loading or detecting faces in GIF ${label}:`, error);
//     }

//     if (descriptors.length > 0) {
//       labeledFaceDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors));
//     }
//   }

//   return labeledFaceDescriptors;
// }



////////////////////////////////////////////////////////////////////////////////////////////////

/// code for face detection 




const faceDetection = async () => {
  //const labeledFaceDescriptors = await loadLabeledImages();
  const labeledFaceDescriptors = await loadLabeledImages();
  console.log('labeledFaceDescriptors', labeledFaceDescriptors);

  // Initialize an array to store detected IDs
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
  }, 1000);
};

///////////////////////////////////////////////////////////////////////

// code for labeled images 



const loadLabeledImages = async () => {
  const labeledDescriptors = [];

  // const labels = ['4_01','04_02','04_03','04_04','05','05_3','05_4', '05_5','05_6','06_01','06_2','06_03','06_04','16','16_1','16_2','16_3','16_4',
//   // '16_5','16_6','16_7','16_8','16_9','16_10','17','18','19','20','21'];
 const labels =['vishal_1','vishal_2','vishal_3','vishal_4','vishal_5','vishal_6','vishal_8',
 'vijaya','abhishek','abhishekP','alok','anuja','bhargavi','bhargavi_1','kunal','kunal_2','kunal_3','kunal_4','kunal_5'
 ,'kunal_6','kunal_8','mukul_1','mukul_2','mukul_3','mukul_4','akash','jitendra','shivam','dhoni','virat','rohitS','deepak','sumit','sumit_02','sumit_3','sumit_05','sumit_06','420']


//const labels = ['vrb2','sumit']

  for (const label of labels) {
    const descriptors = [];

  //  const commonLabel = label.split('_')[0];

    try {
      const img = await faceapi.fetchImage(`/Lables/${label}.jpg`);
      const detection = await faceapi.detectSingleFace(img,
        new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptor().withFaceExpressions()
        .withAgeAndGender();

       // console.log('detection',detection)
      if (detection) {
        const descriptor = detection.descriptor;
        descriptors.push(descriptor);
      }
    } catch (error) {
      console.error(`Error loading or detecting face in image ${label}:`, error);
    }

   
    let i = 1;
    while (true) {
      try {
        const jpgImg = await faceapi.fetchImage(`/Lables/${label}_${i}.jpg`);
        const detection = await faceapi.detectSingleFace(jpgImg,
          new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

        if (detection) {
          const descriptor = detection.descriptor;
          descriptors.push(descriptor);
        }
      } catch (error) {
       
        break;
      }
      i++;
    }
    if (descriptors.length > 0) {
      labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(label, descriptors));
    }
  }
  return labeledDescriptors;
};


