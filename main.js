// // @ts-check

// TODO: BUTTON TO EXPORT PRESENCE LIST
// TODO: A USER COULD BE VERIFIED BY THEIR data-participant-id

// Looks like a valid id
// data-participant-id has a different ID every meet?
// I guess it does

class user_data{
    constructor(name, present, last_present_time){
        this.name = name,
        this.present = present,
        this.last_present_time = last_present_time
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
            updated_names[x] =updated_users[x].textContent
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
        return this.users.push(new user_data(user.name, user.present, user.last_present_time))
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

    update_users_states(){
        
        let updated_users = this.get_updated_users()

        if(!updated_users.length){
            // click in the list of people
            let el = document.getElementsByClassName("r6xAKc")
            if(el.length){
                
                this.createButton()

                let el2 = el[1].children[0].children[0]
                
                setTimeout(() => {
                    console.log("Clicking in the button")
                    el2.click()
                    setTimeout(() => {
                        console.log("Clicking in the button again")
                        el2.click()
                    }, 500)
                }, 500)
            }else{
                console.log("Waiting for you enter in a meet")
            }
            
            return
        }
        
        if(updated_users.length == 1){ 
            return console.log("Just you")
        }

        let current_time = this.get_time()
        let all_users = this.get_all_users()
        let all_usernames = this.get_all_usernames(all_users)

        let updated_usernames = this.get_updated_usernames(updated_users)

        if(!all_usernames.length){ 
            console.log("The first user entered")
            for(let n of updated_usernames){
                this.add_user({
                    "name":n,
                    "present": true,
                    "last_present_time": current_time
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
                    "last_present_time": current_time
                })
            }else if(all_users[i]["present"] === false){ // if find it in the array, but the user was not present
                console.log("A user has came back!" + updated_username)
                all_users[i]["present"] = true
                all_users[i]["last_present_time"] = current_time
            }
        }

        // checking if someone has quit
        // and setting presence
        for (let x=0; x<all_users.length; x++){
            
            // if don't find the user in the updated array AND it is set has present
            if(updated_usernames.indexOf(all_users[x]["name"]) === -1 && all_users[x]["present"] === true){ 
                // not present for the 1º update
                console.log("A user has quit " + all_users[x]["name"])
                all_users[x]["present"] = false
            }
            // if find the user in the updated array AND it is set has present
            else if(all_users[x]["present"] === true){
                all_users[x]["last_present_time"] = current_time
            }
            // the user entered once, but he isn't here anymore
            else{
                
            }
        }

        // update the user list
        this.users = all_users
        
    }

    export_presence_list = class {
        PDF(){
            alert("generating pdf!")
        }
        CSV(){
    
        }
        XLS(){
    
        }
        JSON(){
    
        }
    }


    createButton(){
        let insert_point =  document.querySelectorAll('[jsaction="rcuQ6b:npT2md;L3AHvb:FPkrPd;vqeE2:n3KREd;Gi6Dsf:xOekre;PRvZvb:wfXS6;C8MBwd:vaj4Sb"]')[0]
        insert_point.insertAdjacentHTML('beforebegin',this.escapeHTMLPolicy.createHTML(`<div class="nod4rf PjGUeb" data-use-fullscreen="false" data-show-automatic-dialog="true"><div class="GKGgdd" data-is-muted="false" data-capture-type="sI3MNd" style=""><span data-is-tooltip-wrapper="true"><button class="super_id VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ tWDL4c uaILN bPEdgb qIiG8c FTMc0c N2RpBe jY9Dbb" data-disable-idom="true" aria-label="Presence List" data-tooltip-enabled="true" data-tooltip-id="tt-c2" data-tooltip-x-position="3" data-tooltip-y-position="2" role="button" data-is-muted="true" style="--mdc-ripple-fg-size:24px; --mdc-ripple-fg-scale:1.66667; --mdc-ripple-left:8px; --mdc-ripple-top:8px;"><div class="VfPpkd-Bz112c-Jh9lGc"></div><div class="SUtDBe a7Zbzb"><div aria-hidden="true" data-icon-type="4" class="IYwVEf uB7U9e"><div class="oTVIqe BcUQQ" aria-hidden="true"></div><span class="DPvwYc cR8Azd bkl1qf" aria-hidden="true">
        <svg width="16px" height="16px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16ZM11.7069 6.70739C12.0975 6.31703 12.0978 5.68386 11.7074 5.29318C11.3171 4.9025 10.6839 4.90224 10.2932 5.29261L6.99765 8.58551L5.70767 7.29346C5.31746 6.90262 4.6843 6.90212 4.29346 7.29233C3.90262 7.68254 3.90212 8.3157 4.29233 8.70654L6.28912 10.7065C6.47655 10.8943 6.7309 10.9998 6.99619 11C7.26147 11.0002 7.51595 10.8949 7.70361 10.7074L11.7069 6.70739Z" fill="#ffffff"></path>
        </svg>
        </span><span class="DPvwYc zYrqtc thO1y" aria-hidden="true"><svg focusable="false" width="24" height="24" viewBox="0 0 24 24" class="Hdh4hc cIGbvc NMm5M"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"></path><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"></path></svg></span></div><div aria-hidden="true" data-icon-type="5" class="IYwVEf aC0Bke"><div class="oTVIqe BcUQQ" aria-hidden="true"></div><span class="DPvwYc cR8Azd bkl1qf" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="#000000" class="Hdh4hc cIGbvc"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span><span class="DPvwYc zYrqtc thO1y" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="#000000" class="Hdh4hc cIGbvc"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path><path d="M0 0h24v24H0z" fill="none"></path></svg></span></div></div></button><div class="EY8ABd-OWXEXe-TAWMXe" role="tooltip" aria-hidden="true" id="tt-c2">Presence List</div></span></div></div>
        `))

        let inserted_button =  document.getElementsByClassName('super_id')[0]
        console.log()
        
        inserted_button.addEventListener("click", (e) => {
            e.preventDefault()
            alert("Here you go, Pablo");
            // export_presence.PDF()
        })

    }
        
}



var google_meet_presence_list = new presence_list
var export_presence = new google_meet_presence_list.export_presence_list

var ext_export_presence_list = () => {
    alert(123)
    export_presence.PDF()
}
setInterval(() => {
    google_meet_presence_list.update_users_states()
}, 5000) // each 5 seconds, it calls update()
