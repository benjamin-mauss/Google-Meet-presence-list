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
}

var google_meet_presence_list = new presence_list

setInterval(() => {
    google_meet_presence_list.update_users_states()
}, 5000) // each 5 seconds, it calls update()