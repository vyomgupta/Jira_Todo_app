let createBtn = document.querySelector(".create");
let body = document.querySelector("body");
let grid = document.querySelector(".grid");
let color = ["pink", "green", "blue", "black"];


let allFilersChildern = document.querySelectorAll(".filter div");
for(let i = 0; i < allFilersChildern.length; i++){
    let par = allFilersChildern[i].parentElement;

    par.addEventListener("click", (e) => {
        let parentDiv = e.currentTarget.children[0];
        console.log(parentDiv.classList);
        for(let j = 0; j < allFilersChildern.length; j++){
            let selcetedPar = allFilersChildern[j].parentElement;
            if(selcetedPar.classList.contains("selectedFilter")){
                selcetedPar.classList.remove("selectedFilter");
            }
        }
        if(parentDiv.classList.contains("color-selected")){
            parentDiv.classList.remove("color-selected");
            par.classList.remove("selectedFilter");
            loadTasks();
            return;
        }
        else{
            parentDiv.classList.add("color-selected");
            // parentDiv.classList.add("selected");
            par.classList.add("selectedFilter");
            // console.log(parentDiv.target)
        }
        console.log(parentDiv.classList[0]);
        let currentFilerColor = parentDiv.classList[0];
        loadTasks(currentFilerColor)
    })
}


let deletBtn = document.querySelector(".delete");
let materialIcons = document.querySelector(".material-icons");
let deleteMode = false;

if(localStorage.getItem("AllTickets") == undefined){
    let allTickets = {};
    allTickets = JSON.stringify(allTickets);
    localStorage.setItem("AllTickets", allTickets);
}
// when we first open the page then it will be run for first time
loadTasks();

deletBtn.addEventListener("click", (e) => {
    console.log(e.currentTarget.classList);
    if(e.currentTarget.classList.contains("delete-selected")){
        e.currentTarget.classList.remove("delete-selected");
        deleteMode = false;
    }
    else{
        e.currentTarget.classList.add("delete-selected");
        deleteMode = true;
    }
});


createBtn.addEventListener("click",()=>{
    // delete btn
    deletBtn.classList.remove("delete-selected");
    deleteMode = false;

    let isModalPresent = document.querySelector(".modal");
    if(isModalPresent != null){
        return;
    }

    let div = document.createElement("div");
    div.classList.add("modal");
    div.innerHTML = `<div class="text-section">
                        <div class="task-inner-cointainer" contenteditable="true"></div>
                    </div>
                    <div class="modal-priority-section">
                         <div class="priority-inner-container">
                            <div class="modal-priority pink"></div>
                            <div class="modal-priority green"></div>
                            <div class="modal-priority blue"></div>
                            <div class="modal-priority black selected"></div>
                        </div>
                    </div>`

    let allModalPriority = div.querySelectorAll(".modal-priority");
    let ticketColour = "black";

    for(let i = 0; i < allModalPriority.length; i++){
        allModalPriority[i].addEventListener('click', (e)=>{
            for(let j = 0; j < allModalPriority.length; j++){
                allModalPriority[j].classList.remove("selected");
            }
            e.target.classList.add("selected");
            ticketColour = e.target.classList[1];
            // console.log(ticketColour);
        })
    }

    let taskInnerCointainer = div.querySelector(".task-inner-cointainer");
    taskInnerCointainer.addEventListener("keydown", (e)=>{
        // console.log(e.key);
        // console.log(e);
        if(e.key == "Enter"){
            let id = uid();
            let task = e.target.innerText;

            // LOCAL STORAGE
            //STEP 1 -> get all tickets from local storage
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            // STEP 2 -> update the new ticket into an object
            let ticketOBJ = {
                color : ticketColour,
                taskValue : task,
            }
            allTickets[id] = ticketOBJ;

            // STEP 3 -> update the current AllTicket into local Storage
            allTickets = JSON.stringify(allTickets);
            localStorage.setItem("AllTickets", allTickets);

            let ticketDiv = document.createElement("div");
            ticketDiv.classList.add("ticket");
            ticketDiv.setAttribute("data-id", id);
            
            ticketDiv.innerHTML = ` <div data-id = "${id}" class="ticket-color ${ticketColour}"></div>
                                    <div class="ticket-id">
                                        #${id}
                                    </div>
                                    <div data-id = "${id}" class="actual-task" contenteditable = "true" >       ${task}
                                    </div>`

            grid.append(ticketDiv);
            div.remove();   
            
            

            let ticketcolor = ticketDiv.querySelector(".ticket-color");
            let actualTaskDiv = ticketDiv.querySelector(".actual-task");

            actualTaskDiv.addEventListener("input", (e) => {
                let updatedTask = e.currentTarget.innerText;
                let currentTicketId = e.currentTarget.getAttribute("data-id");
                // =========================  create and update the local storage  =========================
                // LOCAL STORAGE
                //STEP 1 -> get all tickets from local storage
                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

                // STEP 2 -> update the new ticket into an object
                allTickets[currentTicketId].taskValue = updatedTask;

                // STEP 3 -> update the current AllTicket into local Storage
                allTickets = JSON.stringify(allTickets);
                localStorage.setItem("AllTickets", allTickets);

                // ===============================================================================

            })

            ticketcolor.addEventListener("click", (e)=>{
                let currentTicketId = e.currentTarget.getAttribute("data-id");
                // console.log(currentTicketId);
                let currColor = e.target.classList[1];
                let index = color.indexOf(currColor);
                // for(let i = 0; i < 4; i++){
                //     if(color[i] == currColor){
                //         index = i;
                //     }
                // }
                index++;
                index %= 4;
                let newColor = color[index];

                // =========================  create and update the local storage  =========================
                // LOCAL STORAGE
                //STEP 1 -> get all tickets from local storage
                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

                // STEP 2 -> update the new ticket into an object
                let ticketOBJ = {
                    color : newColor,
                    taskValue : task,
                }
                allTickets[currentTicketId] = ticketOBJ;

                // STEP 3 -> update the current AllTicket into local Storage
                allTickets = JSON.stringify(allTickets);
                localStorage.setItem("AllTickets", allTickets);

                // ===============================================================================
                
                e.target.classList.remove(currColor);
                e.target.classList.add(newColor);
            })

            ticketDiv.addEventListener("click", (e) =>{
                if(deleteMode){
                    let currentTicketId = e.currentTarget.getAttribute("data-id");
                    e.currentTarget.remove();
                    // =======================  create and update the local storage =========================
                    // LOCAL STORAGE
                    //STEP 1 -> get all tickets from local storage
                    let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

                    // STEP 2 -> update the new ticket into an object
                    delete allTickets[currentTicketId];

                    // STEP 3 -> update the current AllTicket into local Storage
                    allTickets = JSON.stringify(allTickets);
                    localStorage.setItem("AllTickets", allTickets);
                }
            })

        }
        else if(e.key == "Escape"){
            div.remove();
        }
    })

    body.append(div);
})

function loadTasks(colorOfTic){

    let ticketsOnUI = document.querySelectorAll(".ticket");
    for(let i = 0; i < ticketsOnUI.length; i++){
        ticketsOnUI[i].remove();
    }

    // 1 -> fetch all ticket data
    let allTickets = JSON.parse(localStorage.getItem("AllTickets"));
    // console.log(allTickets);
    
    for(x in allTickets){
        let currentTicketID = x;
        let currentTicketOBJ = allTickets[x];

        if(colorOfTic && colorOfTic != currentTicketOBJ.color){
            continue;
        }

        // 2 -> create ticket UI for each Ticket
        let ticketDiv = document.createElement("div");
        ticketDiv.classList.add("ticket");
        ticketDiv.setAttribute("data-id", currentTicketID);
        
        ticketDiv.innerHTML = ` <div data-id = "${currentTicketID}" class="ticket-color ${currentTicketOBJ.color}"></div>
                                <div class="ticket-id">
                                    #${currentTicketID}
                                </div>
                                <div data-id = "${currentTicketID}" class="actual-task" contenteditable = "true" >       ${currentTicketOBJ.taskValue}
                                </div>`

        // 3 -> Attach required listners
        let ticketcolor = ticketDiv.querySelector(".ticket-color");
        let actualTaskDiv = ticketDiv.querySelector(".actual-task");
        
        actualTaskDiv.addEventListener("input", (e) => {
            let updatedTask = e.currentTarget.innerText;
            let currentTicketId = e.currentTarget.getAttribute("data-id");
            // =========================  create and update the local storage  =========================
            // LOCAL STORAGE
            //STEP 1 -> get all tickets from local storage
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            // STEP 2 -> update the new ticket into an object
            allTickets[currentTicketId].taskValue = updatedTask;

            // STEP 3 -> update the current AllTicket into local Storage
            allTickets = JSON.stringify(allTickets);
            localStorage.setItem("AllTickets", allTickets);

            // ===============================================================================

        })

        ticketcolor.addEventListener("click", (e)=>{
            let currentTicketId = e.currentTarget.getAttribute("data-id");
            // console.log(currentTicketId);
            let currColor = e.target.classList[1];
            console.log(color.indexOf(currColor));
            let index = color.indexOf(currColor);
            // for(let i = 0; i < 4; i++){
            //     if(color[i] == currColor){
            //         index = i;
            //     }
            // }
            index++;
            index %= 4;
            let newColor = color[index];

            // =========================  create and update the local storage  =========================
            // LOCAL STORAGE
            //STEP 1 -> get all tickets from local storage
            let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

            // STEP 2 -> update the new ticket into an object
            let ticketOBJ = {
                color : newColor,
                taskValue : currentTicketOBJ.taskValue,
            }
            allTickets[currentTicketId] = ticketOBJ;

            // STEP 3 -> update the current AllTicket into local Storage
            allTickets = JSON.stringify(allTickets);
            localStorage.setItem("AllTickets", allTickets);

            // ===============================================================================
            
            e.target.classList.remove(currColor);
            e.target.classList.add(newColor);
        })

        ticketDiv.addEventListener("click", (e) =>{
            if(deleteMode){
                let currentTicketId = e.currentTarget.getAttribute("data-id");
                e.currentTarget.remove();
                // =======================  create and update the local storage =========================
                // LOCAL STORAGE
                //STEP 1 -> get all tickets from local storage
                let allTickets = JSON.parse(localStorage.getItem("AllTickets"));

                // STEP 2 -> update the new ticket into an object
                delete allTickets[currentTicketId];

                // STEP 3 -> update the current AllTicket into local Storage
                allTickets = JSON.stringify(allTickets);
                localStorage.setItem("AllTickets", allTickets);
            }
        })

        // 4 -> Add tickets in the grid section of UI.
        grid.append(ticketDiv);

    }

}