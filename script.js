let apikey = document.getElementById("api-key")
let current = document.getElementsByClassName('current-equip-class')
const inputs = document.querySelectorAll('input.current-equip-class')
let goal = document.getElementsByClassName('goal-equip-class')
console.log(apikey.value)
let equips

apikey.addEventListener("keydown", function(event) {
    if ((event.keyCode === 9 || event.keyCode === 13) && apikey.value !== '') {
        if (event.keyCode === 13) {
            event.preventDefault()
            document.getElementById("blacksmith").focus();
        }
        equips = fetchAPI(apikey.value)
    }
});



function fetchAPI(api_key) {
    let equipment = {}

    fetch('https://lyrania.co.uk/api/accounts.php?search='+api_key)
        .then(res => {
            if (res.ok) {
                console.log("FETCH RETURNED CODE: "+res.status)
                res.json()
                    .then(data => {
                        console.log(data.equipment)
                        let x = 0
                        for (const [key, value] of Object.entries(data.equipment)) {
                            current[x].value = value
                            goal[x].value = value
                            x++
                            equipment[key.split(" ")[1]] = {
                                orb: key.split(" ")[0],
                                level: Number(value)
                            }
                        }
                        inputs.forEach(input => input.disabled = true)
                    })
            } else {
                console.log("FETCH FAILED. ERROR:" + res.status)
            }
        })
    return equipment
}