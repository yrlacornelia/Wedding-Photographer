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
const API_KEY = `$2b$10$UUd79Qokx0FtowYto6w1AesmhK5pfjAyIi7EOGLRV0rSkt/JTcWbC`
let newarr = [];
const images = [];
let allbtns = [];
// show video

async function getImagesJson(){
  const response = await fetch('https://api.jsonbin.io/b/628e1adb05f31f68b3a6a398/latest', { 
  headers: {
      'X-Master-Key': API_KEY
  }
  })
  const data = await response.json()
  console.log(data);

}

getImagesJson()

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
  createnewImage(newImage);
});
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


function createnewImage(image) {
  const divImg = document.createElement("div");
  const imageElem = document.createElement("img");
  imageElem.setAttribute("src", image.image);
  galleryElem.appendChild(divImg);
  divImg.appendChild(imageElem);
  newarr.push(imageElem);
  createbtnpic(divImg);
}
function createImage(image) {
  const divImg = document.createElement("div");
  const imageElem = document.createElement("img");
  imageElem.setAttribute("src", image.image);
  galleryElem.appendChild(divImg);
  divImg.appendChild(imageElem);
  newarr.push(imageElem);
  createbtnpic(divImg);
}
function createbtnpic(divImg) {
  var btnn = document.createElement("button");
  divImg.appendChild(btnn);
  allbtns.push(btnn);
  btnn.onclick = removeImg;
}

function removeImg(e) {
  const n = Array.from(allbtns).indexOf(e.target);
  for (let i = 0; i < newarr.length; i++) {
    if (i === n) {
      allbtns[n].parentElement.remove();
      var images = JSON.parse(localStorage.getItem("cameraToGallery"));
      for (var d = 0; d < images.length; d++) {
        if (images[d].id == n  || d == n ) {
          images.splice(d, 1);
          images = JSON.stringify(images);
          localStorage.setItem("cameraToGallery", images);
        }
      }
    }
  }
  // images.splice(n, 1); 
  // images = JSON.stringify(images);
  // localStorage.setItem("cameraToGallery", images);

  } 
//   let images = JSON.parse(localStorage.getItem("cameraToGallery"));
//   const element = images[n];
//     allbtns[n].remove();
//       newarr[n].remove();
//   console.log(element, n )
// console.log([n])
// images.splice(n, 1); 
//  images = JSON.stringify(images);
//     localStorage.setItem("cameraToGallery", images);
  


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

