// this is index.js

const libraryUrl = "http://localhost:3000/missions/"
const assignedMissionsUrl = "http://localhost:3000/assigned/"
const completeIcon = "assets/icon-complete.png"
const missionLink = document.getElementById("mission-link")
let assignedMissions = []
let selectedMission
document.getElementById("mission-collection").addEventListener("click",(e) => showDetail(e))
document.getElementById("mission-complete").addEventListener("click", (e) => markComplete(e))

function getAssingedMissions() {
    fetch(assignedMissionsUrl)
    .then(resp => resp.json())
    .then((missions) => initializeMenu(missions))
    .catch(err => alert(err))
    // the get new missions button just has to delete
    // all the assigned missions from db.json
    // and call this funciton (i think)
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
            assignMission(x, missions)
        }
        // *** POST to assignedMissionsUrl ***
        assignedMissions.forEach((mission) => displayNav(mission))
    }
    
    function assignMission(x, missions) {
    assignedMissions[x] = missions[x]
    assignedMissions[x].id = x+1
    const date = getTodaysDate()
    assignedMissions[x].status = `assigned: ${date}`
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

    function displayNav(mission) {
        const newMission = document.createElement("p")
        const newImg = document.createElement("img")
        const newName = document.createElement("span")
        newName.textContent = mission.name
        // newName.id = mission.id 
        if (mission.status === "complete") {
            newImg.src = completeIcon
        } else {
            newImg.src = mission.image
        }
        newImg.className = "nav-icon"
        newImg.alt = mission.type
        // newImg.id = mission.id
        
        newMission.id = mission.id
        newMission.onmouseover = function() {this.style.background = "#FFFFAA"}
        newMission.onmouseout = function() {this.style.background = "white"}
        newMission.appendChild(newImg)
        newMission.appendChild(newName)
        document.getElementById("mission-collection").appendChild(newMission)
}

function showDetail(e) {
    if (e.target.id !== "mission-collection") {
        if (parseInt(e.target.id) > 0) {
            selectedMission = e.target.id
        } else {
            selectedMission = e.target.parentElement.id
        }
        // selectedMission = e.target.id
        const detailImg = document.getElementById("detail-image")
        detailImg.src = assignedMissions[selectedMission-1].image
        detailImg.alt = assignedMissions[selectedMission-1].type
        document.getElementById("mission-name").textContent = assignedMissions[selectedMission-1].name
        document.getElementById("mission-status").textContent = assignedMissions[selectedMission-1].status
        document.getElementById("mission-complete").style.display = "block"
        document.getElementById("mission-mod-menu").style.display = "block"
        if (assignedMissions[selectedMission-1].link != "") {
            missionLink.style.display = "block"
            missionLink.href = assignedMissions[selectedMission-1].link
        } else {
            missionLink.style.display = "none"
        }
        if (assignedMissions[selectedMission-1].status === "complete") {
            document.getElementById("mission-mod-menu").style.display = "none"
        } else {
            document.getElementById("mission-mod-menu").style.display = "block"
        }
    }
}

function getTodaysDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear() - 2000;
    today = mm + '/' + dd + '/' + yyyy;
    return today
}

function markComplete() {
    // change status of assignedMissions[selectedMission-1]
    assignedMissions[selectedMission-1].status = "complete"
    const configObject = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            status: "complete"
        })
    }
    fetch(`${assignedMissionsUrl}${selectedMission}`, configObject)
    .catch(err => alert(err))
    // change nav icon
    const navImg = document.getElementById(selectedMission).getElementsByTagName("img")[0]
    navImg.src = completeIcon
    // change status in detail
    document.getElementById("mission-status").textContent = "complete"
    // hide mission-mod-menu
    document.getElementById("mission-mod-menu").style.display = "none"
}


getAssingedMissions()