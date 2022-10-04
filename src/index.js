// this is index.js
// DECLARATIONS
const missionsUrl = "http://localhost:3000/missions/"
const completeIcon = "assets/icon-complete.png"
const missionLink = document.getElementById("mission-link")
let allMissions = []
let assignedMissions = []
let selectedMission
document.getElementById("mission-collection").addEventListener("click",(e) => showDetail(e))
document.getElementById("mission-complete").addEventListener("click", (e) => markComplete(e))
document.getElementById("gimme").addEventListener("click", () => resetMissions())

function getAllMissions() {
    fetch(missionsUrl)
    .then(resp => resp.json())
    .then((missions) => initialize(missions))
    .catch(err => alert(err))
    // *** the get new missions button just has to PATCH
    // *** all the assigned missions to UNASSIGNED
    // *** and call this funciton (i think)
}

function initialize(missions) {
    allMissions = missions
    allMissions.forEach((mission) => checkAssigned(mission))
    // checkAssigned pushes into assignedMissions if they aren't unassigned.
    if (assignedMissions.length === 0) {
        shuffleMissions(allMissions)
        // *** shuffleMissions must push into assignedMissions via assignMission(mission)
    }
        assignedMissions.forEach((mission) => displayNav(mission))
    
    // // if (missions.length > 0) {
    //     assignedMissions = missions
    //     assignedMissions.forEach((mission) => displayNav(mission))
    // } else {
    //     getMissionsFromLibrary()
    }

function checkAssigned(mission) {
    console.log("checkAssigned()")
    if (mission.status != "unassigned") {
        assignedMissions.push(mission)
        console.log("mission pushed")
    }
}

// function getMissionsFromLibrary() {
//     fetch(libraryUrl)
//     .then(resp => resp.json())
//     .then((missions) => shuffleMissions(missions))
//     // .catch(err => alert(err))
// }

function shuffleMissions(missions) { 
    console.log("shuffleMissions()") // i got this array shuffle function from stackoverflow
        // let currentIndex = missions.length,  randomIndex;
      
        // // While there remain elements to shuffle.
        // while (currentIndex != 0) {
      
        //   // Pick a remaining element.
        //   randomIndex = Math.floor(Math.random() * currentIndex);
        //   currentIndex--;
      
        //   // And swap it with the current element.
        //   [missions[currentIndex], missions[randomIndex]] = [
        //     missions[randomIndex], missions[currentIndex]];
        // }

      
        for (x=assignedMissions.length; x<5; x++) {
            const randomMission = Math.floor(Math.random()*missions.length)
            if (missions[randomMission].status === "unassigned") {
                assignMission(x, missions[randomMission])
            } else {
                shuffleMissions(missions)
            }
        }
        // *** assign mission should PATCH CORRECTLY to missionsUrl ***
        // initialize should call displayNav
        // for (let index=0; index < assignedMissions.length; index++) {
        // displayNav(assignedMissions[index], index)
        // }
    }
    
    function assignMission(x, mission) {
        // where x is the index for assignedMissions[] and missions.id is the database ID number
    //     console.log("assignMission")
    assignedMissions[x] = allMissions[mission.id]
    // // assignedMissions[x].id = x+1
    const date = getTodaysDate()
    assignedMissions[x].status = `assigned: ${date}`
    const configObject = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            status: `assigned ${date}`
        })
        }
        fetch(`${missionsUrl}${mission.id}`, configObject)
        .catch(err => alert(err))
    }

    function displayNav(mission) {
        console.log("displayNav")
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
    if (e.target.id != "mission-collection") {
        if (parseInt(e.target.id) > 0) {
            selectedMission = e.target.id
        } else {
            selectedMission = e.target.parentElement.id
        }
        const thisMission = allMissions[selectedMission-1]
        const detailImg = document.getElementById("detail-image")
        detailImg.src = thisMission.image
        detailImg.alt = thisMission.type
        document.getElementById("mission-name").textContent = thisMission.name
        document.getElementById("mission-status").textContent = thisMission.status
        document.getElementById("mission-complete").style.display = "block"
        document.getElementById("mission-mod-menu").style.display = "block"
        if (thisMission.link != "") {
            missionLink.style.display = "block"
            missionLink.href = allMissions[selectedMission].link
        } else {
            missionLink.style.display = "none"
        }
        if (thisMission.status === "complete") {
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
    thisMission = allMissions[selectedMission]
    // change status of assignedMission[?]
    // how to get index number from database id number??
    // assignedMissions[selectedMission-1].status = "complete" // this is not the way
    assignedMissions.forEach(mission => {
        if (mission.id = selectedMission) {
            mission.status = "complete"
        }
    })
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
    fetch(`${missionsUrl}${selectedMission}`, configObject)
    .catch(err => alert(err))
    // change nav icon
    const navImg = document.getElementById(selectedMission).getElementsByTagName("img")[0]
    navImg.src = completeIcon
    // change status in detail
    document.getElementById("mission-status").textContent = "complete"
    // hide mission-mod-menu
    document.getElementById("mission-mod-menu").style.display = "none"
}

function resetMissions() {
    console.log("resetMissions()")
}

getAllMissions()