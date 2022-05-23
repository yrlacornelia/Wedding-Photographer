
window.addEventListener('load', async () => {
    if('serviceWorker' in navigator){
        try {
            await navigator.serviceWorker.register('service-worker.js');
        } catch(err) {
            console.error('Whooopsie!', err)
        }
    }
});



/// 
const cameraButton = document.querySelector('#start-camera');
const videoElem = document.querySelector('#camera');
const takePictureButton = document.querySelector('#take-picture');
const canvas = document.querySelector('#picture');
const galleryElem = document.querySelector('#gallery');

const ctx = canvas.getContext('2d');
let stream;
const images = [];

cameraButton.addEventListener('click', async () => {
    if ('mediaDevices' in navigator) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        console.log(stream);
        videoElem.srcObject = stream;
    }
});

takePictureButton.addEventListener('click', () => {
    ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png'); // Konverterar det till en png-bild

    images.push({
        id: images.length,
        image: imageData        
    });

     localStorage.setItem('cameraApp', JSON.stringify(images));
});

function createImage(image) {
    const imageElem = document.createElement('img');
    imageElem.setAttribute('src', image.image);

    galleryElem.append(imageElem);
}

function getImages() {
    const images = JSON.parse(localStorage.getItem('cameraApp'));

    for(const image of images) {
        createImage(image);
    }
}

getImages();

