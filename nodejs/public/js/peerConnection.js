let localVideo = document.querySelector("video#localVideo")
    , remoteVideo = document.querySelector("video#remoteVideo")
    , hangupButton = document.querySelector("button#hangup")
    , callButton = document.querySelector("button#call")
    , startButton = document.querySelector("button#start")
    , answerSDPTextarea = document.querySelector("textarea#answerSDP")
    , offerSDPTextarea = document.querySelector("textarea#offerSDP")

var localStream, pc1, pc2

startButton.onclick = start
callButton.onclick = call
hangupButton.onclick = hangup


function start() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log("浏览器不支持 mediaDevices 接口")
    } else {
        let constraints = {video: true, audio: false}
        navigator.mediaDevices.getUserMedia(constraints)
            .then(gotUserMediaStream)
            // .then(getMediaDevices)
            .catch(handleError)
    }
}

function hangup() {
    pc1.close()
    pc2.close()
    pc1 = null
    pc2 = null
}

function call() {
    let configuration = {
        iceServers: [{
            urls: ["stun:220.194.69.71:3478", "trun:220.194.69.71:3478"],
            username: "trun",
            credential: "trun",
            credentialType: "password"
        }]
    };
    pc1 = new webkitRTCPeerConnection(configuration)//发送端
    pc2 = new webkitRTCPeerConnection(configuration)//接收端

    pc1.onicecandidate = (e) => {
        pc2.addIceCandidate(e.candidate).catch(handleError)
    }

    pc2.onicecandidate = (e) => {
        pc1.addIceCandidate(e.candidate).catch(handleError)
    }
    pc2.ontrack = getRemoteStream
    localStream.getTracks().forEach(t => {
        pc1.addTrack(t, localStream)
    })

    let offerOption = {
        offerToReceiveAudio: 0,
        offerToReceiveVideo: 1,
        iceRestart: true
    }
    pc1.createOffer(offerOption).then(getOffer).catch(handleError)

}

function getAnswer(desc) {
    pc2.setLocalDescription(desc)
    answerSDPTextarea.value = desc.sdp
    //发送desc到信令
    //发给对方
    //下面是第一方收到的信令
    pc1.setRemoteDescription(desc)
}

function getOffer(desc) {
    pc1.setLocalDescription(desc)
    offerSDPTextarea.value = desc.sdp
    // 发送 desc 到信令服务器
    // 发给对方
    // 下面是第二方收到后
    pc2.setRemoteDescription(desc)
    pc2.createAnswer().then(getAnswer).catch(handleError)
}

function getRemoteStream(d) {
    remoteVideo.srcObject = d.streams[0]
}

function gotUserMediaStream(stream) {
    localVideo.srcObject = stream
    localStream = stream
}


function handleError(err) {
    console.log("error:" + err.name + ":" + err.message)
}