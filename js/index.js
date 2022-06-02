
const videoContainer = document.querySelector(`#video-container`);
const videoElem = document.querySelector("#camera");
const takePictureButton = document.querySelector("#take-picture");
const photoContainer = document.querySelector(`#photo-container`);
const canvas = document.querySelector("#picture");
const newPictureBtn = document.querySelector(`#new-picture`);
const galleryElem = document.querySelector("#gallery");
const ctx = canvas.getContext("2d");
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
canvas.width = 400;
canvas.height = 300;
let stream;
const API_KEY = `$2b$10$B4pgJUy1IF2F8RDvh8Q7V.McYS1fOgcykXJj8k9jT8x4HrYNXLliq`
let newarr = [];
let allbtns = [];
const connected = navigator.onLine;
// klar
async function isOnline(){
  if (connected)
  {
    const response = await fetch('https://api.jsonbin.io/b/62987bf6402a5b380219b3a5/latest', { 
    headers: {
        'X-Master-Key': API_KEY
    }
    })
    const data = await response.json()
    const images = data
    var offlineImages = JSON.parse(localStorage.getItem("cameraToGallery"));
  for (let i = 0; i < offlineImages.length; i++) {
  images.push(offlineImages[i])
}
    UpdateJson(images)
}
  else{
console.log("ur offline")
  }
}

 isOnline()
/// show videostream
async function showVideo() {
    if ("mediaDevices" in navigator) {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      videoElem.srcObject = stream;
      videoElem.width = 400;
  videoElem.height = 300;
    }
  }
  showVideo();

////show captured image or video 
function showOrHide() {
    videoContainer.style.display = "none";
    photoContainer.style.display = "flex";
  }
  
  newPictureBtn.addEventListener(`click`, () => {
    videoContainer.style.display = "flex";
    photoContainer.style.display = "none";
  });



  
async function showGallery(){
    const response = await fetch('https://api.jsonbin.io/b/62987bf6402a5b380219b3a5/latest', { 
    headers: {
        'X-Master-Key': API_KEY
    }
    })
    const data = await response.json() 
     const images = data
    ShowJsonGallery(images)
  }
  ///picture to json
  takePictureButton.addEventListener("click", () => {
    ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
  showOrHide();
  if (connected)
  { 
newImageToJson(imageData)
  }
  else{
  var images = JSON.parse(localStorage.getItem("cameraToGallery")) || [];
  var newImage = {
    id: images.length,
    image: imageData,}
  images.push(newImage);
  saveToLocalStorage(images);
  createnewImage(newImage);
  }

});
async function newImageToJson(imageData){
  const response = await fetch('https://api.jsonbin.io/b/62987bf6402a5b380219b3a5/latest', { 
  headers: {
      'X-Master-Key': API_KEY
  }
  })
  const data = await response.json()
  const images = data
  var newImage = {
    id: images.length,
    image: imageData,}
  images.push(newImage);
  updateImagesJson(images)
  console.log(newImage)
  createnewJSONImage(newImage);
}
async function updateImagesJson (images) {
  showOrHide();
   const response = await fetch('https://api.jsonbin.io/b/62987bf6402a5b380219b3a5', { 
  method: `PUT`, 
  body: JSON.stringify(images),
  headers: {
      'Content-Type': `application/json`,
          'X-Master-Key': API_KEY
      }
      })
      const data = await response.json()
      console.log(data);


}


function saveToLocalStorage(images) {
    notis();
    localStorage.setItem("cameraToGallery", JSON.stringify(images));
  }

  function notis(params) {
    Notification.requestPermission().then((permisson) => {
      console.log(permisson);
      if (permisson === "granted") {
        createNotification();
      }
  
      function createNotification() {
        const text = "du sparade en bild till galleriet";
        const notification = new Notification("Notis", { body: text });
      }
    });
  }
////check
  function createnewImage(image) {
     const divImg = document.createElement("div");
     const imageElem = document.createElement("img");
     imageElem.setAttribute("src", image.image);
     galleryElem.appendChild(divImg);
     divImg.appendChild(imageElem);
     newarr.push(imageElem);
     createbtnpic(divImg);
  }
///check
  function createnewJSONImage(image) {
    console.log(image)
    const divImg = document.createElement("div");
    const imageElem = document.createElement("img");
    imageElem.setAttribute("src", image.image);
    galleryElem.appendChild(divImg);
    divImg.appendChild(imageElem);
    newarr.push(imageElem);
    createbtnpic(divImg);
  }

  function getOfflineGallery(image) {
    console.log(image)
    const divImg = document.createElement("div");
    const imageElem = document.createElement("img");
    imageElem.setAttribute("src", image.image);
    galleryElem.appendChild(divImg);
    divImg.appendChild(imageElem);
    newarr.push(imageElem);
    createbtnpic(divImg);
  }

  function ShowJsonGallery(image) {
    for (let i = 0; i < image.length; i++) {
    const divImg = document.createElement("div");
    const imageElem = document.createElement("img");
    imageElem.setAttribute("src", image[i].image);
    galleryElem.appendChild(divImg);
    divImg.appendChild(imageElem);
    newarr.push(imageElem);
    createbtnpic(divImg);
    }
    
  }

  //buttons to gallery images both json and offline 
function createbtnpic(divImg) {
    var btnn = document.createElement("button");
    divImg.appendChild(btnn);
    allbtns.push(btnn);
    btnn.onclick = removeImg;

  }
  function removeImg(e) {
    const n = Array.from(allbtns).indexOf(e.target);
    if (connected) {
        for (let i = 0; i < newarr.length; i++) {
            if (i === n) {
              allbtns[n].parentElement.remove();
          deleteImagesJson(n)
          
            }
          }
    }
    else
 {    
    var images = JSON.parse(localStorage.getItem("cameraToGallery"));
  for (let i = 0; i < newarr.length; i++) {
  if (i === n) {
    allbtns[n].parentElement.remove();
    const deletedImg = images.find(x => x.id === images[n]);
    console.log(images[n])
    console.log(deletedImg)
    images.splice(deletedImg, 1);

    localStorage.setItem("cameraToGallery", JSON.stringify(images));
  }
}}

    }




//delete json images from gallery 
async function deleteImagesJson(n){
  const response = await fetch('https://api.jsonbin.io/b/62987bf6402a5b380219b3a5/latest', { 
  headers: {
      'X-Master-Key': API_KEY
  }
  })
  const data = await response.json()
  console.log(data);
  const images = data
  const deletedImg = images.find(x => x.id === images[n]);
  images.splice(deletedImg, 1);
  console.log(images)
  UpdateJson(images)

}


async function UpdateJson(images) {
  console.log(images)
  const response = await fetch('https://api.jsonbin.io/b/62987bf6402a5b380219b3a5', { 
    method: `PUT`, 
    body: JSON.stringify(images),
    headers: {
        'Content-Type': `application/json`,
            'X-Master-Key': API_KEY
        }
        })
        const data = await response.json()
        showGallery()

}



    function getImages() {
        if(connected) {
            console.log("images from json")
        }
        else
      {  const images = JSON.parse(localStorage.getItem("cameraToGallery"));
        if (images == null) {
          console.log("Gallery is empty");
        } else {
          for (const image of images) {
            getOfflineGallery(image);
          }
        }}
      }
      getImages();


btn.onclick = function () {
    modal.style.display = "flex";
  
  };
  
  span.onclick = function () {
    modal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  
  
  
  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("../serviceworker.js")
        .then(() => {
          console.log("Registered service worker");
        })
        .catch(() => {
          console.log("Could not register service worker");
        });
    }
  }
  
  registerServiceWorker();
  
