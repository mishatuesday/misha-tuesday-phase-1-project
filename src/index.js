// this is index.js
// DECLARATIONS
const missionsUrl = "http://localhost:3000/missions/"
const completeIcon = "assets/icon-complete.png"
const missionName = document.getElementById("mission-name")
const detailImg = document.getElementById("detail-image")
const missionLink = document.getElementById("mission-link")
const statusBar = document.getElementById("mission-status")
const navBar = document.getElementById("mission-collection")
const refreshingImg = "assets/radar.gif"
let allMissions = []
let assignedMissions = []
let selectedMission
let completedMissions = 0
let radar
navBar.addEventListener("click",(e) => showDetail(e))
document.getElementById("mission-complete").addEventListener("click", (e) => markComplete(e))
document.getElementById("gimme").addEventListener("click", () => resetMissions())
document.getElementById("add-custom-image").addEventListener("submit", (e) => addCustomImage(e))

function getAllMissions() {
    fetch(missionsUrl)
    .then(resp => resp.json())
    .then((missions) => initialize(missions))
    .catch(err => alert(err))
}

function initialize(missions) {
    allMissions = missions
    allMissions.forEach((mission) => checkAssigned(mission))
    // checkAssigned pushes into assignedMissions if they aren't unassigned.
    if (assignedMissions.length < 5) {
        shuffleMissions(allMissions)
        // *** shuffleMissions must push into assignedMissions via assignMission(mission)
    }
    assignedMissions.forEach((mission) => displayNav(mission))
    canReset()
}

function checkAssigned(mission) {
    if (mission.status != "unassigned") {
        assignedMissions.push(mission)
    }
}

// function getMissionsFromLibrary() {
    //     fetch(libraryUrl)
    //     .then(resp => resp.json())
    //     .then((missions) => shuffleMissions(missions))
    //     // .catch(err => alert(err))
    // }
    
    function shuffleMissions(missions) { 
        
        
        for (x=assignedMissions.length-completedMissions; x<5; x++) {
            const randomMission = Math.floor(Math.random()*missions.length)
            if (missions[randomMission].status === "unassigned") {
                assignMission(x, missions[randomMission])
            } else {
                shuffleMissions(missions)
            }
        }

    }
        
        function assignMission(x, mission) {
            // where x is the index for assignedMissions[] and missions.id is the database ID number
            //     console.log("assignMission")
            assignedMissions[x] = allMissions[mission.id-1]
            /// WTFF is wrong with this???? It's assigning wrong missions!!!! off by one!
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
            if (mission.status === "complete") completedMissions++
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
            navBar.appendChild(newMission)
        }
        
        function showDetail(e) {
            if (e.target.id != "mission-collection") {
                if (parseInt(e.target.id) > 0) {
                    selectedMission = e.target.id
                } else {
                    selectedMission = e.target.parentElement.id
                }
                displayDetail(selectedMission)
            }
        }
        
        function displayDetail(selectedMission) {
            const thisMission = allMissions[selectedMission-1]
            detailImg.src = thisMission.image
            detailImg.alt = thisMission.type
            missionName.textContent = thisMission.name
            statusBar.textContent = thisMission.status
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
                statusBar.style.color = "green"
            } else {
                document.getElementById("mission-mod-menu").style.display = "block"
                statusBar.style.color = "gray"
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
            completedMissions++
            thisMission = allMissions[selectedMission]
            // change status of assignedMission[?]
            // how to get index number from database id number??
            // assignedMissions[selectedMission-1].status = "complete" // this is not the way
            assignedMissions.forEach(mission => {
                if (mission.id === parseInt(selectedMission)) {
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
            displayDetail(selectedMission)
            canReset()
        }
        
        function addCustomImage(e) {
            e.preventDefault()
            const newImg = document.getElementById("add-url").value
            //add to nav
            document.getElementById(selectedMission).getElementsByTagName("img")[0].src = newImg
            // add to assignedMissions AND allMissions 
            assignedMissions.forEach((mission, index) => {
                console.log(mission, index, selectedMission)
                if (mission.id === parseInt(selectedMission)) {
                    console.log("it's a hit!")
                    assignedMissions[index].image = newImg
                    allMissions[selectedMission].image = newImg
                }
            })
            /// PATCH database
            // ****
            const configObject = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    image: newImg
                })
            }
            fetch(`${missionsUrl}${selectedMission}`, configObject)
            .catch(err => alert(err))
            // change nav icon
            
            
            // ****
            // redisplay
            displayDetail(selectedMission)
            e.target.reset()
        }
        
        function canReset() {
            if (completedMissions / assignedMissions.length > .49) document.getElementById("gimme").style.display = "block"
        }
        
        function resetMissions() {
            // forEach assignedMissions >>
            // set allMissions[id-1].status = "unassigned"
            assignedMissions.forEach((mission) => {
                allMissions[mission.id-1].status = "unassigned"
                const configObject = {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        status: "unassigned"
                    })
                }
                // PATCH missionsUrl/id status: "unassigned"
                fetch(`${missionsUrl}${mission.id}`, configObject)
                .catch(err => alert(err))
            })
            assignedMissions = []
            completedMissions = 0
            // radar.style.visibility = "visible"
            detailImg.src = refreshingImg
            missionName.textContent = ""
            statusBar.textContent = ""
            missionLink.style.display = "none"
            document.getElementById("headline").textContent = "Refreshing Missions"
            setTimeout(refreshPage, 3000)
            // *** and call getAllMissions (i think)
            
        }
        
        function refreshPage() {
            document.getElementById("headline").textContent = "Random Acts of Random"
            // radar.style.visibility = "hidden"
            detailImg.src = "assets/RAoR.png"
            document.getElementById("gimme").style.display = "none"
            // delete mission-collection children
            while (navBar.firstChild) {
                navBar.firstChild.remove()
            // start new game
            }
        getAllMissions()
        }

        getAllMissions()