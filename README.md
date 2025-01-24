# Computer Vision Final Project
## Language Learner Using Object Detection
- Web application that allows users to learn languages through object detection by:
  - Allowing users to choose two languages from two lists
  - Detecting objects real-time in a live webcam
  - Displaying detected label of object in both chosen languages
- Techonologies Used:
  - Coco-SSD: pre-trained model for object detection
  - Microsoft Azure Text Translator: API to send detected labels and get a translation
  - NodeJS: Allows for communication to external API calls

### Instructions to Run Project:
- Install nodeJS to get npm
- Ppen powershell window in folder and run "npm install" command to get the node_modules folder to access the api
- Run command "py -m http.server" to start server and run application
