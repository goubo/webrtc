if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia()) {
    console.log("浏览器不支持 mediaDevices 接口")
} else {
    var constraints = {
        video: true,
        audio: true
    }
    navigator.mediaDevices.getUserMedia(constraints)
        .then(getMediaDevices)
        .catch(handleError);
}
var videlPlayer = document.querySelector("video#player")

function handleError(err) {
    console.log("error:" + err.name + ":" + err.message)
}

function gotUserMedieStream(stream) {
    videlPlayer.srcObject = stream
}