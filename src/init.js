// this is init.js
const getUrl = "https://www.boredapi.com/api/activity" // Bored API will feed one random activity ('mission') at a time
const postUrl = "http://localhost:3000/missions/"
let numberToAdd
document.getElementById("qty-form").addEventListener("submit", (e) => handleForm(e))


function handleForm(e) {
    e.preventDefault()
    console.log("handling form")
    numberToAdd = document.getElementById("qty").value
    addMissionToDb()
}

function addMissionToDb() {
    console.log("fetching")
    fetch(getUrl)
    .then(resp => resp.json())
    .then((mission) => sendToDb(mission))
}

function doAnother () {
    if (numberToAdd > 1) {
        setTimeout(addMissionToDb(), 3000)
        numberToAdd--
    } else {
        location.reload()
    }
}

function sendToDb(mission) {
    // TODO: switch on mission.type to get default icon
    // OOPS i populated db.json without finishing this one
    // therefore I will have to write a script to do it!
    let missionImage
    let missionType
    switch(mission.type) {
        case "relaxation":
            missionImage = "assets/icon-relaxation.png"
            missionType = "Relaxation"
            break;
        case "education":
            missionImage = "assets/icon-education.png"
            missionType = "Education"
            break
        case "charity":
            missionImage = "assets/icon-charity.png"
            missionType = "Charity"
            break
        case "busywork":
            missionImage = "assets/icon-life-maintenance.png"
            missionType = "Life Maintenance"
            break
        case "recreational":
            missionImage = "assets/icon-recreation.png"
            missionType = "Recreation"
            break
        case "social":
            missionImage = "assets/icon-social.png"
            missionType = "Social"
            break
        case "cooking":
            missionImage = "assets/icon-cooking.png"
            missionType = "Cooking"
            break
        case "music":
            missionImage = "assets/icon-music.png"
            missionType = "Music"
            break
        case "diy":
            missionImage = "assets/icon-diy.png"
            missionType = "D.I.Y."
            
    }
    const missionObject = {
        // mission data in db.json format
        name: mission.activity,
        link: mission.link,
        image: missionImage,
        type: missionType
        status: "unassigned"
    }
    const configObject = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(missionObject)
    }
    // fetch goes here, but first let's try:
    fetch(postUrl, configObject)
    .then(resp => resp.json())
    .then(() => logResp())
    .catch(err => alert(err))
}

function logResp() {
    const report = document.createElement("p")
    report.textContent = "Adding..."
    document.getElementById("report").appendChild(report)
    doAnother()
}

// add the while that lets you clear a whole element by 
// killing all the children


