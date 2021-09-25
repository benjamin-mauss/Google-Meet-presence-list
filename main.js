// // @ts-check

// TODO: A USER COULD BE VERIFIED BY THEIR data-participant-id
// TODO: 'SORT BY' OPTION TO THE EXPORT

class user_data{
    constructor(name, present, last_time_present){
        this.name = name,
        this.present = present,
        this.last_time_present = last_time_present,
        this.spent_time = 0,
        this.entry_time = last_time_present
    }
}

class presence_list{
    
    constructor(){
        this.users = []

        // this is necessary to avoid CSP errors
        this.escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
            createHTML: (to_escape) => to_escape
        })
    }

    get_time(){
        let moment = new Date();
        return moment.getFullYear()+'-'+(moment.getMonth()+1)+'-'+moment.getDate() + "|" +moment.getHours() + ":" + moment.getMinutes() + ":" + moment.getSeconds();
    }

    get_updated_users(){
        return document.querySelectorAll('[jsmodel="cZWlhe QUjYIe"]')
        
        
    }

    get_updated_usernames(updated_users){ // updated_users = get_updated_users()
        // popullating updated_names
        
        let updated_names = []
        for (let x=0;x<updated_users.length;x++){ 
            updated_names[x] = updated_users[x].firstElementChild.children[1].firstElementChild.firstElementChild.textContent
        }
        return updated_names
    }
    
    get_all_users(){
        return this.users
    }

    get_all_usernames(users){ // users = get_all_users()
        let usernames = []
        for (let u of users) usernames.push(u.name)
        return usernames
    }

    add_user(user){
        return this.users.push(new user_data(user.name, user.present, user.last_time_present))
    }

    // this is not intent to be used
    remove_user(username){
        // usernames and users have the same length
        let usernames = this.get_all_usernames()
        let i = usernames.indexOf(username)
        if(i){
            this.users.splice(i)
            return true
        }        
        return false
    }

    update_users_states(automatic){
        
        // it is called every X seconds and it updates the users array
        let updated_users = this.get_updated_users()

        if(!updated_users.length){
            // click in the list of people
            let el = document.getElementsByClassName("r6xAKc")
            if(el.length){
                
                this.createButton()

                let el2 = el[1].children[0].children[0]
                
                setTimeout(() => {
                    // console.log("Clicking in the button")
                    el2.click()
                    setTimeout(() => {
                        // console.log("Clicking in the button again")
                        el2.click()
                    }, 500)
                }, 500)
            }else{
                // console.log("Waiting for you enter in a meet")
            }
            
            return
        }
        
        if(updated_users.length == 1 && !this.get_all_users().length){ 
            return // console.log("Just you")
        }

        let current_time = this.get_time()
        let all_users = this.get_all_users()
        let all_usernames = this.get_all_usernames(all_users)

        let updated_usernames = this.get_updated_usernames(updated_users)

        if(!all_usernames.length){ 
            // console.log("The first user entered")
            for(let n of updated_usernames){
                this.add_user({
                    "name":n,
                    "present": true,
                    "last_time_present": current_time
                })
            }
            return
        }

        // checking if someone new has entered
        for(let updated_username of updated_usernames){
            let i = all_usernames.indexOf(updated_username)
            
            if(i === -1){ // if don't find it in the array all_usernames, it means that it is new user
                console.log("A new user has entered " + updated_username)
                this.add_user({
                    "name":updated_username,
                    "present": true,
                    "last_time_present": current_time
                })
            }else if(all_users[i]["present"] === false){ // if find it in the array, but the user was not present
                console.log("A user has came back!" + updated_username)
                all_users[i]["present"] = true
                all_users[i]["last_time_present"] = current_time
            }
        }

        // checking if someone has quit
        // and setting presence
        for (let x=0; x<all_users.length; x++){
            
            // if don't find the user in the updated array AND it is set has present
            if(updated_usernames.indexOf(all_users[x]["name"]) === -1 && all_users[x]["present"] === true){ 
                // not present for the 1º update
                // console.log("A user has quit " + all_users[x]["name"])
                all_users[x]["present"] = false
            }
            // if find the user in the updated array AND it is set has present
            else if(all_users[x]["present"] === true){
                all_users[x]["last_time_present"] = current_time
                // console.log(all_users[x])
                if(automatic){
                    all_users[x]["spent_time"] += time_between_updates/1000 // we want it to become seconds
                }
            }
            // the user entered once, but he isn't here anymore
            else{
                
            }
        }

        // update the user list
        this.users = all_users
        
    }

    async get_storaged_file(filename){
        let response = await fetch(chrome.runtime.getURL("resources/" + filename))
        let r = await response.text()
        return r
    }
    
    async createButton(){

        // creating the button

        let insert_point =  document.querySelectorAll('[jsaction="rcuQ6b:npT2md;L3AHvb:FPkrPd;vqeE2:n3KREd;Gi6Dsf:xOekre;PRvZvb:wfXS6;C8MBwd:vaj4Sb"]')[0]
        
        let button_content = await this.get_storaged_file("button.html")
        let popup_content = await this.get_storaged_file("popup.html")
        let style_content = await this.get_storaged_file("style.css")
        
        insert_point.insertAdjacentHTML('beforebegin',this.escapeHTMLPolicy.createHTML(`
        <!-- Start of Google Meet Presence List extension -->
            <!-- Start of Button -->
            ${button_content}
            <!-- End of Button -->

            <!-- Start of Popup-->
            ${popup_content}
            <!-- End of Popup-->

            <!-- Start of Style-->
            <style>
            ${style_content}
            </style>
            <!-- End of Style -->
        <!-- End of Google Meet Presence List extension -->
        `))
        
        
        let inserted_button =  document.getElementsByClassName('super_id')[0]
        
        // creating the popup js code
        const openModalButtons = document.querySelectorAll('[data-modal-target]')
        const closeModalButtons = document.querySelectorAll('[data-close-button]')
        const overlay = document.getElementById('overlay')

        openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            export_presence.update_preview()
            const modal = document.querySelector(button.dataset.modalTarget)
            openModal(modal)
        })
        })

        overlay.addEventListener('click', () => {
        const modals = document.querySelectorAll('.modal.active')
        modals.forEach(modal => {
            closeModal(modal)
        })
        })

        closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal')
            closeModal(modal)
        })
        })

        function openModal(modal) {
        if (modal == null) return
            modal.classList.add('active')
            overlay.classList.add('active')
        }

        function closeModal(modal) {
        if (modal == null) return
            modal.classList.remove('active')
            overlay.classList.remove('active')
        }

        document.getElementById("exportToTEXT").addEventListener('click', () => {
            export_presence.TEXT()
        })
        // document.getElementById("exportToXLS").addEventListener('click', () => {
        //     export_presence.XLS()
        // })
        document.getElementById("exportToJSON").addEventListener('click', () => {
            export_presence.JSON()
        })
        document.getElementById("exportToCSV").addEventListener('click', () => {
            export_presence.CSV()
        })





    }
        
}

// I an repeating too much code, I should fix that
class export_presence_list {
    TEXT(){
        google_meet_presence_list.update_users_states()
        let user_list = google_meet_presence_list.get_all_users()
        // console.log(user_list)
        if(!this.check_users(user_list)){
            return
        }

        let lines = ""
        
        if(document.getElementById("name").checked){
            lines += "name,"
        }
        if(document.getElementById("entry_time").checked){
            lines += "entry_time,"
        }
        if(document.getElementById("last_time").checked){
            lines += "last_time,"
        }
        if(document.getElementById("spent_time").checked){
            lines += "spent_time,"
        }
        
        lines = lines.substr(0,lines.length-1) // removes the comma in the end
        for(let i = 0; i < user_list.length; i++){
            let line = "\n"
                       
            if(document.getElementById("name").checked){
                line += user_list[i]["name"] + ","
            }
            if(document.getElementById("entry_time").checked){
                line += user_list[i]["entry_time"] + ","
            }
            if(document.getElementById("last_time").checked){
                line += user_list[i]["last_time_present"] + ","
            }
            if(document.getElementById("spent_time").checked){
                line += user_list[i]["spent_time"] + ","
            }
            line = line.substr(0,line.length-1) // removes the comma in the end
            lines += line
        }
        this.downloadFile(lines, "presence_list.txt", "text/plain") 

    }
   
    CSV(){
        google_meet_presence_list.update_users_states()
        let user_list = google_meet_presence_list.get_all_users()
        // console.log(user_list)
        if(!this.check_users(user_list)){
            return
        }

        let lines = ""
        
        if(document.getElementById("name").checked){
            lines += "name,"
        }
        if(document.getElementById("entry_time").checked){
            lines += "entry_time,"
        }
        if(document.getElementById("last_time").checked){
            lines += "last_time,"
        }
        if(document.getElementById("spent_time").checked){
            lines += "spent_time,"
        }
        
        lines = lines.substr(0,lines.length-1) // removes the comma in the end
        for(let i = 0; i < user_list.length; i++){
            let line = "\n"
                       
            if(document.getElementById("name").checked){
                line += user_list[i]["name"] + ","
            }
            if(document.getElementById("entry_time").checked){
                line += user_list[i]["entry_time"] + ","
            }
            if(document.getElementById("last_time").checked){
                line += user_list[i]["last_time_present"] + ","
            }
            if(document.getElementById("spent_time").checked){
                line += user_list[i]["spent_time"] + ","
            }
            lines += line.substr(0,line.length-1) // removes the comma in the end
        }
        this.downloadFile(lines, "presence_list.csv", "text/csv") 

    }
    update_preview(sort_type){ // creates/updates preview html
        
        document.getElementById("table_preview").innerHTML = google_meet_presence_list.escapeHTMLPolicy.createHTML(
        `<table id="table_preview">
            <tr id="header-table">
                <th>Name</th>
                <th>Entry time</th>
                <th>Spent time</th>
            </tr>
        </table>`)
        let html = ""

        google_meet_presence_list.update_users_states()
        let user_list = google_meet_presence_list.get_all_users()

        // sort(user_list)

        for(let x=0;x<user_list.length;x++){
            html +=
            `<tr>
                <td class="item_preview">${user_list[x]["name"]}</td>
                <td class="item_preview">${user_list[x]["entry_time"]}</td>
                <td class="item_preview">${user_list[x]["last_time_present"]}</td>
            </tr>`
        }

        document.getElementById("header-table").insertAdjacentHTML("afterend",google_meet_presence_list.escapeHTMLPolicy.createHTML(html))
    }

    JSON(){
        google_meet_presence_list.update_users_states()
        let user_list = google_meet_presence_list.get_all_users()
        if(!this.check_users(user_list)){
            return
        }
        let user_list_output = []
        for(let u=0;u < user_list.length; u++){
            let tmp = {}
            if(document.getElementById("name").checked){
                tmp["name"] = user_list[u]["name"]
            }
            if(document.getElementById("entry_time").checked){
                tmp["entry_time"] = user_list[u]["entry_time"]
            }
            if(document.getElementById("last_time").checked){
                tmp["last_time"] = user_list[u]["last_time_present"]
            }
            if(document.getElementById("spent_time").checked){
                tmp["spent_time"] = user_list[u]["spent_time"]
            }
            
            // console.log(tmp)
            user_list_output.push(tmp)
        }
        
        this.downloadFile(JSON.stringify(user_list_output, null, 2), "presence_list.json", "application/json")
    }
    
    check_users(user_list){
        
        if(!user_list.length){
            // console.log("No one besider you")
            let m = document.getElementById("message")
            m.innerText = "There is no one, besides yourself, in this room"
            setTimeout((m) => {
                // console.log(m)
                m.innerText = ""
            }, 3000,m)
            return false
        }else{
            // console.log("aee")
            return true
        }
        
    }

    downloadFile(data, filename, type) { 
        
        // https://stackoverflow.com/questions/13405129/javascript-create-and-save-file#answer-30832210
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }
}

var google_meet_presence_list = new presence_list
var export_presence = new export_presence_list
google_meet_presence_list.update_users_states()

var time_between_updates = 5000 // 5 seconds

setInterval(() => {
    google_meet_presence_list.update_users_states(true)
}, time_between_updates) // each 5 seconds, it calls update()

