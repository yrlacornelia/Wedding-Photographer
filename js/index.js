const videoContainer = document.querySelector(`#video-container`);
const videoElem = document.querySelector("#camera");
const takePictureButton = document.querySelector("#take-picture");

const photoContainer = document.querySelector(`#photo-container`);
const canvas = document.querySelector("#picture");
const newPictureBtn = document.querySelector(`#new-picture`);

const galleryElem = document.querySelector("#gallery");
const ctx = canvas.getContext("2d");
canvas.width = 500;
    canvas.height = 375;
    canvas.style.width = 500;
    canvas.style.height = 375;

let stream;

const images = [];

// show video
async function showVideo() {
  if ("mediaDevices" in navigator) {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    videoElem.srcObject = stream;
  }
}
showVideo();

//video or pic

function showOrHide() {
  videoContainer.style.display = "none";
  photoContainer.style.display = "flex";
}

newPictureBtn.addEventListener(`click`, () => {
  videoContainer.style.display = "flex";
  photoContainer.style.display = "none";
});

// get pic

takePictureButton.addEventListener("click", () => {
  ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL("image/png");
  var images = JSON.parse(localStorage.getItem("cameraToGallery")) || [];
  var newImage = {
    id: images.length,
    image: imageData,
  };

  images.push(newImage);
  showOrHide();
  saveToLocalStorage(images);
createnewImage(newImage)
});


function saveToLocalStorage(images) {
  notis()
  localStorage.setItem("cameraToGallery", JSON.stringify(images));
}
function notis(params) {
  Notification.requestPermission().then((permisson) => {
    //permission om användaren svara ja eller nej till notis
    console.log(permisson)
if (permisson === 'granted')
{
createNotification()
}
function createNotification() {
  const text = 'du sparade en bild till galleriet'
  const notification = new Notification('Notis', {body: text
  })
}
});
}

let newarr = [];
function createnewImage(image) {
  const divImg = document.createElement("div");
  const imageElem = document.createElement("img");
  imageElem.setAttribute("src", image.image);
  galleryElem.appendChild(divImg);
  divImg.appendChild(imageElem);
  // imageElem.setAttribute("height", "58");
  // imageElem.setAttribute("width", "14");
  newarr.push(imageElem);
  console.log(newarr);
  createbtnpic(divImg);
}
function createImage(image) { 
  const divImg = document.createElement("div");
  const imageElem = document.createElement("img");
  imageElem.setAttribute("src", image.image);
  galleryElem.appendChild(divImg);
  divImg.appendChild(imageElem);
  // imageElem.setAttribute("height", "58");
  // imageElem.setAttribute("width", "14");
  newarr.push(imageElem);
  console.log(newarr);
  createbtnpic(divImg);
}
let allbtns = [];
function createbtnpic(divImg) {
  var btnn = document.createElement("button");
  divImg.appendChild(btnn);
  allbtns.push(btnn);
  btnn.onclick = lool;
}

function lool(e) {
  const n = Array.from(allbtns).indexOf(e.target);
  for (let i = 0; i < newarr.length; i++) {
    if (i === n) {
      allbtns[n].remove();
      newarr[i].remove();
      var images = JSON.parse(localStorage.getItem("cameraToGallery"));
      for (var d = 0; d < images.length; d++) {
        if (images[d].id == n) {
          images.splice(d, 1);

          images = JSON.stringify(images);
          localStorage.setItem("cameraToGallery", images);
        }
      }
    }
  }
}
function getImages() {

  const images = JSON.parse(localStorage.getItem("cameraToGallery"));
  if (images == null) {
   console.log("Gallery is empty");
   
  } else {
    for (const image of images) {
      createImage(image);
    }
  }
}  

var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
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

getImages();
// service worker
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

//localStorage.clear()
