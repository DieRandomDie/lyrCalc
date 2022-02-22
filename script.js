apikey = document.getElementsByClassName("api-key")[0]
current = document.getElementsByClassName('current')[0].children
goal = document.getElementsByClassName('goal')[0].children
console.log(apikey.value)
let equips
let sameToggle = false

var apiKey = document.getElementsByClassName("api-key")[0];
apiKey.addEventListener("keydown", function(event) {
    if ((event.keyCode === 9 || event.keyCode === 13) /*&& apikey.value != ''*/) {
        if (event.keyCode === 13) {
            event.preventDefault()
            document.getElementsByClassName("blacksmith")[0].focus();
        }
        equips = fetchAPI(apiKey.value)
    }
});

var equalToggle = document.getElementsByClassName("check")[0];
equalToggle.addEventListener("change", function(event) {
    if(console.log(equalToggle.checked)) {
        sameToggle = true
        
    }
})

function fetchAPI(api_key) {
    let equipment = {"orbs":[],"levels":[]}

    fetch('https://lyrania.co.uk/api/accounts.php?search='+api_key)
        .then(res => {
            if (res.ok) {
                console.log("FETCH RETURNED CODE: "+res.status)
                res.json()
                    .then(data => {
                        let x = 0
                        let replace = document.createElement('div')
                        for (const [key, value] of Object.entries(data.equipment)) {
                            current[x].value = value
                            replace.innerHTML = current[x].value
                            goal[x].value = value
                            x++
                            //equipment.orbs.push(key.split(" ")[0])
                            //equipment.levels.push(value)
                        }

                    })
            } else {
                console.log("FETCH FAILED. ERROR:" + res.status)
            }
        })
    return equipment
}