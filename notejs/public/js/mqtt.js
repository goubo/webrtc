let roomNumberInput = document.querySelector("input#roomNumberInput")
    , userNameInput = document.querySelector("input#userNameInput")
    , joinButton = document.querySelector("button#joinButton")
    , sendButton = document.querySelector("button#sendButton")
    // , leaveButton = document.querySelector("button#leaveButton")
    , textPre = document.querySelector("pre#textPre")
    , textarea = document.querySelector("input#textarea")

var userName, roomNumber, baseTopic = 'mqtt/dome/im/', num = 1, client

sendButton.disable = true

function start() {
    userName = userNameInput.value
    roomNumber = roomNumberInput.value
    if (!userName || !roomNumber) {
        return
    }

    joinButton.disabled = true
    sendButton.disable = false
    // var willPayload = {"type": "leave", "userName": userName}
    // client = mqtt.connect('ws://v.goujinbo.com:61614')
    client = mqtt.connect('wss://v.goujinbo.com:61617')
    //mqtt 连接
    client.on("message", function (topic, payload) {
        gotPayload(payload)
    })

    let joinMessage = {
        "type": "join",
        "userName": userName
    }
    client.publish(baseTopic + "page/" + roomNumber, JSON.stringify(joinMessage))
    client.subscribe([baseTopic + "server/" + roomNumber], baseTopic + "server/" + roomNumber + "/" + userName)


}

function gotPayload(payload) {
    var payloadObject = JSON.parse(payload)
    if (!payloadObject) return
    console.log(payloadObject)
    if (payloadObject.type === 'disContent') {
        joinButton.disabled = false
        sendButton.disable = true
        client.unsubscribe(baseTopic + "server/" + roomNumber)
        client.unsubscribe(baseTopic + "server/" + roomNumber + "/" + userName)
        client.end()
        textPre.prepend(name + "加入聊天室失败，原因：" + payloadObject.message + "\n")
    } else if (payloadObject.type === 'joined') {
        textPre.prepend(payloadObject.userName + "加入聊天室\n")
    } else if (payloadObject.type === 'message') {
        textPre.prepend(payloadObject.userName + ":" + payloadObject.data + "\n")
    } else if (payloadObject.type === 'refreshData') {


    }
}

function sendMessage() {
    var message = textarea.value
    textarea.value = ""
    var payload = {"type": "message", "userName": userName, "data": message}
    client.publish(baseTopic + "server/" + roomNumber, JSON.stringify(payload))
}

function leave() {
    client.end()
}

joinButton.onclick = start
sendButton.onclick = sendMessage
// leaveButton.onclick = leave