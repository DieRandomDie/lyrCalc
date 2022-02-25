let apikey = document.getElementById("api-key")
let toggle = document.getElementById("toggle-ratio")
let current = document.getElementsByClassName('current-equip-class')
const currentInputs = document.querySelectorAll('input.current-equip-class')
let goal = document.getElementsByClassName('goal-equip-class')
const goalInputs = document.querySelectorAll('input.goal-equip-class')
const sameGoals = document.querySelectorAll('input.same-goal-equip-class')
const costOutputs = document.querySelectorAll('output.cost-equip-class')
console.log(apikey.value)
let equipment = {}


function toggleRatio() {
    if(toggle.checked) {
        toggleRatioUpdate()
        sameGoals.forEach(goal => {
            goal.disabled = true
            goal.style.visibility = "hidden"
        })
    } else {
        goalInputs.forEach(goal => {
            goal.disabled = false
            goal.style.visibility = "visible"
        })
    }
}


function toggleRatioUpdate() {
    if(toggle.checked) {
        goalInputs[1].value = goalInputs[0].value
        goalInputs[3].value = goalInputs[2].value
        goalInputs[4].value = goalInputs[2].value
        goalInputs[5].value = goalInputs[2].value
        goalInputs[6].value = goalInputs[2].value
        goalInputs[7].value = goalInputs[2].value
        goalInputs[8].value = goalInputs[2].value
        updateAllGoals()
    }
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
    if (api_key.length === 32) {
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
                            updateAllGoals()
                        })
                } else {
                    console.log("FETCH FAILED. ERROR:" + res.status)
                }
            })
    } else {
        apikey.type = ""
        apikey.value = "INVALID"
        setTimeout(() => {
            apikey.type = "password"
            apikey.value = ""
            apikey.focus(apikey.select())
        }, 1000)
    }
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
    totalCost()
}


function totalCost() {
    let total = document.getElementById("total-cost")
    let totalValue = 0
    let rval = 0
    costOutputs.forEach(result => {
        rval = Number(result.innerHTML.replace(/,|p/g, ''))
        totalValue += rval
    })
    total.innerHTML = totalValue.toLocaleString() + "p"
}


window.onload = function() {
    let username = "DieRandomDie"
    fetch('https://lyrania.co.uk/api/accounts.php?search=12282')
        .then(res => {
            if (res.ok && res.status === 200) {
                console.log("FETCH RETURNED CODE: " + res.status)
                res.json()
                    .then(data => {
                        console.log(data.name)
                        username = data.name
                        document.getElementById("footer").innerHTML = `Found an issue? Want to meme on me? Whisper or mail ${username} in game.`
                    })
            } else {
                console.log("FETCH FAILED. ERROR:" + res.status)
                document.getElementById("footer").innerHTML = `Found an issue? Want to meme on me? Whisper or mail ${username} in game. (API failed to fetch my current name. Ask in main.)`
            }
        })
}


let power = ((0.5*level*(level-1)+1)+((0.5*level*(level-1)+1)*orbPercent))*(1+enchantPercent)*(1+festPercent)