// TODO: BUTTON TO EXPORT PRESENCE LIST
// TODO: A USER COULD BE VERIFIED BY THEIR data-participant-id

// Looks like a valid id
// data-participant-id="spaces/Orf-m6YEa7AB/devices/064dc09e-13f1-4548-b70d-9b9e17f9d041"
// data-participant-id="spaces/Orf-m6YEa7AB/devices/70d23bdf-65ac-4dd4-901c-dbe6054b80b9"
/***
 * 
 * 
 */

var old_users_data = [];


// compare the array of users with the old array
// if there is new user, we add them and set enter_time = current_time 

// if there is no changes, we set last_present_time to current_time

// if user has quit, we set the flag present=false
//      and set the quit_time to the current time

function verify_users(){

    // array with the current users' data
    let updated_users = document.querySelectorAll('[jsmodel="cZWlhe QUjYIe"]')
    let updated_names = []

    // avoid problems while we wait for loading
    if(!updated_users.length){ 
        let el = document.getElementsByClassName("r6xAKc")
        if(el.length){
            let el2 = el[1].children[0].children[0]
            el2.click()
            setTimeout(()=>{
                el2.click()
            }, 500)
        }
        return
    }

    if(updated_users.length == 1){ 
         return console.log("just us")
    }

    // popullating updated_names
    for (let x=0;x<updated_users.length;x++){ 
        updated_names[x] =updated_users[x].textContent
    }

        // getting current_time
    let moment = new Date();
    let current_time = moment.getFullYear()+'-'+(moment.getMonth()+1)+'-'+moment.getDate() + "|" +moment.getHours() + ":" + moment.getMinutes() + ":" + moment.getSeconds();
    
    let old_names = [ ]

    // popullating old_names
    for (let x=0;x<old_users_data.length;x++){ 
        old_names[x] = old_users_data[x]["name"]
    }
    
    // if it is the first time
    if(!old_names.length){ 
        console.log("FIRST TIME")
        for(n of updated_names){ // [index, name]
            old_users_data.push({
                "name":n,
                "present": true,
                "last_present_time": current_time
            })
        }
        return
    }
    // checking if someone new has entered
    // we can't just check if the array is bigger and old_names, cuz someone could have quit while someone has join
    for(let n of updated_names){ // [index, name]
        let tmp = old_names.indexOf(n)
        if(tmp === -1){ // if we don't find it in the array, it means that it is new
            console.log("A NEW USER!" + n)
            old_users_data.push({
                "name":n,
                "present": true,
                "last_present_time": current_time
            })
        }else if(old_users_data[tmp]["present"] === false){
            console.log("A USER HAS CAME BACK!" + n)
            old_users_data[tmp]["present"] = true
        }
    }

    // checking if someone has quit
    for (let x=0;x<old_users_data.length;x++){ // we wanna ignore the 1º one, cuz it is us

        // search for the old values in the new array
        // if a old value is not in there 
        // AND the flag `present` wasn't set to false
        // means that the users quited
        // and we need to set the user to present = false
        if(updated_names.indexOf(old_users_data[x]["name"]) === -1 && old_users_data[x]["present"] === true){ 
            // not present for the 1º update
            console.log("A USER HAS QUIT!" + old_users_data[x]["name"])
            old_users_data[x]["present"] = false

        }else if(old_users_data[x]["present"] === true){
            old_users_data[x]["last_present_time"] = current_time
        }else{
            // not present 
        }
    }
    console.log(old_users_data)
}

function export_presence_list(){
    
}


setInterval(verify_users, 5000) // each 5 seconds, it calls verify_user()