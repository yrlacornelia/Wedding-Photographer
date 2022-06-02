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
let newarr = [];
const images = [];
let allbtns = [];
// show video
const connected = navigator.onLine;

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
  console.log(imageElem)
  createbtnpic(divImg);
}

function createImage(image) {
  console.log(image)
  const divImg = document.createElement("div");
  const imageElem = document.createElement("img");
  imageElem.setAttribute("src", image.image);
  galleryElem.appendChild(divImg);
  divImg.appendChild(imageElem);
  newarr.push(imageElem);
  console.log(imageElem)
  createbtnpic(divImg);
}



function createbtnpic(divImg) {
  var btnn = document.createElement("button");
  divImg.appendChild(btnn);
  allbtns.push(btnn);
  btnn.onclick = removeImg;
}
// offline 
function removeImg(e) {
  const n = Array.from(allbtns).indexOf(e.target);
  for (let i = 0; i < newarr.length; i++) {
    if (i === n) {
      allbtns[n].parentElement.remove();
      var images = JSON.parse(localStorage.getItem("cameraToGallery"));
      const deletedImg = images.find(x => x.id === images[n]);
      console.log(images[n])
      console.log(deletedImg)
      images.splice(deletedImg, 1);
      console.log(images)
      localStorage.setItem("cameraToGallery", JSON.stringify(images));

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
getImages();
btn.onclick = function () {
  modal.style.display = "flex";
  // if (connected ) {
  // }

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
