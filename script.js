let apikey = document.getElementById("api-key")
let current = document.getElementsByClassName('current-equip-class')
const currentInputs = document.querySelectorAll('input.current-equip-class')
let goal = document.getElementsByClassName('goal-equip-class')
const goalInputs = document.querySelectorAll('input.goal-equip-class')
const costOutputs = document.querySelectorAll('output.cost-equip-class')
console.log(apikey.value)
let equipment = {}


function toggleRatio() {
}

function updateAllGoals() {
    let equipName
    costOutputs.forEach(e => {
        equipName = e.labels[0].innerHTML.toLowerCase()
        ecalc(equipName)
    })
}


function fetchAPI(api_key) {
    if (!apikey.value) {
        currentInputs.forEach(input => {
            input.disabled = false
            input.value = 1
        })
        updateAllGoals()
        return
    }

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
                        currentInputs.forEach(input => input.disabled = true)
                    })
            } else {
                console.log("FETCH FAILED. ERROR:" + res.status)
            }
        })
}


function ecalc(equip_name) {
    let current = document.getElementById("current-" + equip_name)
    let currentValue = Number(current.value)
    let goal = document.getElementById("goal-" + equip_name)
    let goalValue = Number(goal.value)
    let discount = document.getElementById("blacksmith")
    let discountValue = 1 - Number(discount.value) / 100
    let result = document.getElementById("cost-" + equip_name)
    let cost = 0
    if (goalValue > 10000) {
        goalValue = 10000
        goal.value = 10000
    }
    if (discountValue < .5) {
        discountValue = .5
        discount.value = 50
    }
    for (let i = currentValue + 1; i <= goalValue; i++) {
        cost += ((0.005 * (i ** 2)) - .0101 * i + .0052) * discountValue
    }
    result.value = Math.ceil(cost).toLocaleString() + "p"
}