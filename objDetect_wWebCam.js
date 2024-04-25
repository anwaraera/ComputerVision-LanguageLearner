
// Set reference to key elments
const video = document.getElementById('webcam');                     // video element, renders the video stream of webcam
const liveView = document.getElementById('liveView');                // button and video div container
const demosSection = document.getElementById('demos');               // section element with id of demos
const enableWebcamButton = document.getElementById('webcamButton');  // reference to button

// Check if browser allows accessing the webcam stream via getUserMedia  
function getUserMediaSupported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia); // !! cast to boolean value
}

  // Add an event listener so that the web camera can be enabled when the button is pushed.
  // Once the button is pushed the method enableCam will be invoked
  if (getUserMediaSupported()) {
    enableWebcamButton.addEventListener('click', enableCam);
  } else {
    console.warn('getUserMedia() is not supported by your browser');
  }
  

  // Enable the live webcam view and start classification.
function enableCam(event) {
    // Only continue if the COCO-SSD has finished loading.
    if (!model) {
      return;          // return if model is not loaded
    }
    
    // Hide the button once clicked.
    event.target.classList.add('removed');  
    
    // getUsermedia parameters to force video but not audio.
    const constraints = {
      video: true                   // only want video stream
    };
  
    // Activate the webcam stream with asynchronous call, thus the use of then. Then we use an anonymous inline function takes stream as argument
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      video.srcObject = stream;
      video.addEventListener('loadeddata', predictWebcam);   // Register method predictWebcam
    });
  }

// Store the resulting model in the global scope of our app.
var model = undefined;

// Before we can use COCO-SSD class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment 
// to get everything needed to run.
// Note: cocoSsd is an external object loaded from our index.html
cocoSsd.load().then(function (loadedModel) {
  model = loadedModel;
  // Show demo section now model is ready to use.
  demosSection.classList.remove('invisible');
});


////////////////////////////////////////////////
// Prediction - Classifying a frame from the webcam
////////////////////////////////////////////////

var children = [];  // will hold all the html elements that will be drawn to the screen to highlight the objects found

// Animation Loop
function predictWebcam() {
  // Classify a frame in the video stream
  model.detect(video).then(function (predictions) {        // *** performs machine learning inference, and returns some results  
    // Remove any highlighting we did previous frame.
    for (let i = 0; i < children.length; i++) {            // Clear page of previous draw elements, before drawing any new ones
      liveView.removeChild(children[i]);
    }
    children.splice(0);                                    // Delete the array contents
    
    // Now lets loop through predictions and draw the bounding boxes to the live view if
    // they have a high confidence score.
    for (let n = 0; n < predictions.length; n++) {
      // If we are over 66% sure we are sure we classified it right, draw it!
      if (predictions[n].score > 0.66) {
        const p = document.createElement('p');                      // Create a new paragraph element in memory
        p.innerText = predictions[n].class  + ' - with '            // Set paragraph inner text, class is the object (cat, dog, etc.)
            + Math.round(parseFloat(predictions[n].score) * 100)    // prediction score
            + '% confidence.';
        p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
            + (predictions[n].bbox[1] - 10) + 'px; width: '              // Bbox array of 4 elements, (x1,y1), width, height
            + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

        const highlighter = document.createElement('div');         // div element 
        highlighter.setAttribute('class', 'highlighter');          // with semi-transparent background, and white border
        highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
            + predictions[n].bbox[1] + 'px; width: ' 
            + predictions[n].bbox[2] + 'px; height: '
            + predictions[n].bbox[3] + 'px;';

        liveView.appendChild(highlighter);                        // append div to the liveView container to add it to the html page and make it visible
        liveView.appendChild(p);                                  // append paragraph to the live View container to add it to the html page and make it visible
        children.push(highlighter);                               // add to children array for quick referrence for deletion   
        children.push(p);                                         // add to children array for quick referrence for deletion
      }
    }
    
    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
  });
}