let apikey = document.getElementById("api-key")
let current = document.getElementsByClassName('current-equip-class')
const inputs = document.querySelectorAll('input.current-equip-class')
let goal = document.getElementsByClassName('goal-equip-class')
console.log(apikey.value)
let equipment = {}


function fetchAPI(api_key) {
    fetch('https://lyrania.co.uk/api/accounts.php?search=' + api_key)
        .then(res => {
            if (res.ok) {
                console.log("FETCH RETURNED CODE: " + res.status)
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
}


function ecalc(equip_name) {
    let current = Number(document.getElementById("current-" + equip_name).value)
    let goal = Number(document.getElementById("goal-" + equip_name).value)
    let result = document.getElementById("cost-" + equip_name)
    let discount = 1 - Number(document.getElementById("blacksmith").value)/100
    let cost = 0
    for (let i = current+1; i <= goal; i++) {
        cost += ((0.005 * (i ** 2)) - .0101 * i + .0052) * discount
    }
    result.value = Math.ceil(cost).toLocaleString() + "p"
}