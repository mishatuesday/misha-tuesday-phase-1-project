// this is index.js

const libraryUrl = "http://localhost:3000/missions/"
const assignedMissionsUrl = "http://localhost:3000/assigned/"
let assignedMissions = []
document.getElementById("mission-collection").addEventListener("click",(e) => showDetail(e))

function getAssingedMissions() {
    fetch(assignedMissionsUrl)
    .then(resp => resp.json())
    .then((missions) => initializeMenu(missions))
    // .catch(err => alert(err))
}

function initializeMenu(missions) {
    if (missions.length > 0) {
        assignedMissions = missions
        assignedMissions.forEach((mission) => displayNav(mission))
    } else {
        getMissionsFromLibrary()
    }
}

function getMissionsFromLibrary() {
    fetch(libraryUrl)
    .then(resp => resp.json())
    .then((missions) => shuffleMissions(missions))
    // .catch(err => alert(err))
}

function shuffleMissions(missions) { // i got this array shuffle function from stackoverflow
        let currentIndex = missions.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex != 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [missions[currentIndex], missions[randomIndex]] = [
            missions[randomIndex], missions[currentIndex]];
        }
      
        for (x=0; x<6; x++) {
            assignedMissions[x] = missions[x]
            assignedMissions[x].id = x+1
            const configObject = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(assignedMissions[x])
                }
                fetch(assignedMissionsUrl, configObject)
                .catch(err => alert(err))
        }
        // *** POST to assignedMissionsUrl ***
            assignedMissions.forEach((mission) => displayNav(mission))
        }


function displayNav(mission) {
    const newMission = document.createElement("p")
    const newImg = document.createElement("img")
    const newName = document.createElement("span")
    newImg.src = mission.image
    newImg.id = mission.id
    newImg.className = "nav-icon"
    newName.textContent = mission.name
    newName.id = mission.id 
    newMission.id = mission.id
    newMission.onmouseover = function() {this.style.background = "#FFFFAA"}
    newMission.onmouseout = function() {this.style.background = "white"}
    newMission.appendChild(newImg)
    newMission.appendChild(newName)
    document.getElementById("mission-collection").appendChild(newMission)
}

function showDetail(e) {
    if (e.target.id !== "mission-collection") {
        document.getElementById("detail-image").src = assignedMissions[e.target.id-1].image
        
    }
}

getAssingedMissions()