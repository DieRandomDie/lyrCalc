const apikey = document.getElementById("api-key")
const toggle = document.getElementById("toggle-ratio")
const discount = document.getElementById("blacksmith")
let discountValue = 1 - Number(discount.value) / 100
const wpChant = document.getElementById("weapon-chant")
const apChant = document.getElementById("armour-chant")
const wpFest = document.getElementById("weapon-fest")
const apFest = document.getElementById("armour-fest")
const current = document.getElementsByClassName('current-equip-class')
const currentInputs = document.querySelectorAll('input.current-equip-class')
const goal = document.getElementsByClassName('goal-equip-class')
const goalInputs = document.querySelectorAll('input.goal-equip-class')
const sameGoals = document.querySelectorAll('input.same-goal-equip-class')
const costOutputs = document.querySelectorAll('output.cost-equip-class')
const currentWPOutput = document.getElementById('current-weapon-power')
const currentAPOutput = document.getElementById('current-armour-power')
const newWPOutput = document.getElementById('new-weapon-power')
const newAPOutput = document.getElementById('new-armour-power')
let equipment = {}


function setCookie() {
    let cookie = getCookie("key")
    if (cookie && cookie == apikey.value) {
        return 0
    }
    if (apikey.value.length == 32) {
        document.cookie = "key=" + apikey.value + ";Secure"
    }
    document.cookie = "wpc=" + wpChant.value + ";Secure"
    document.cookie = "apc=" + apChant.value + ";Secure"
    document.cookie = "wpf=" + wpFest.value + ";Secure"
    document.cookie = "apf=" + apFest.value + ";Secure"
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';')
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {

            console.log("Retrieved " + cname)
            return c.substring(name.length, c.length)
        }
    }
    console.log("Retrieved " + cname)
    return ""
}


function checkCookie() {
    let keyvalue = getCookie("key");
    if (keyvalue != "") {
        return true
    }
}

//Disable or enable input when the Toggle Ratio checkbox is used.
function toggleRatio() {
    if (toggle.checked) {
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

//Need to find a less retard way of doing this.
function toggleRatioUpdate() {
    if (toggle.checked) {
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

//to be ran any time everything needs to be updated at once.
function updateAllGoals() {
    let equipName
    costOutputs.forEach(e => {
        equipName = e.labels[0].innerHTML.toLowerCase()
        ecalc(equipName)
    })
}

function updateEquipPower() {
    console.log("Hello World")
}


function fetchAPI(api_key) {
    if (!apikey.value && !checkCookie()) {
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
                    res.json()
                        .then(data => {
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
                            cpcalc()
                            npcalc()
                        })
                } else {
                    console.log("EQUIPMENT FETCH FAILED. ERROR:" + res.status)
                }
            })
    } else {
        apikey.type = ""
        apikey.value = "INVALID"
        setTimeout(() => {
            apikey.type = "password"
            apikey.value = ""
        }, 1000)
    }
}


function ecalc(equip_name) {
    let current = document.getElementById("current-" + equip_name)
    let currentValue = Number(current.value)
    let goal = document.getElementById("goal-" + equip_name)
    let goalValue = Number(goal.value)
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
    npcalc()
}

function orb_boost(equip) {
    let boost = 0
    const orb = equipment[equip].orb
    switch(orb) {
        case "Poor": boost = 0.2; break
        case "Decent": boost = 0.4; break
        case "Fine": boost = 0.6; break
        case "Quality": boost = 0.8; break
        case "Flawless": boost = 1; break
        case "Exquisite": boost = 1.2; break
        case "Crystalline": boost = 1.4; break
        case "Prismatic": boost = 1.6; break
        case "Chromatic": boost = 1.8; break
        case "Perfect": boost = 2; break
    }
    return boost
}

function cpcalc() {
    let current_weapon_power = 0
    let current_armour_power = 0
    for (let equip in equipment) {
        let fest_boost = equip === "shortsword" || equip === "dagger" ? wpFest.value / 100 : apFest.value / 100
        let chant_boost = equip === "shortsword" || equip === "dagger" ? wpChant.value / 100 : apChant.value / 100
        let power = Math.round(((0.5 * equipment[equip].level * (equipment[equip].level - 1) + 1) + ((0.5 * equipment[equip].level * (equipment[equip].level - 1) + 1) * orb_boost(equip))) * (1 + fest_boost) * (1 + chant_boost))
        if (equip === "shortsword" || equip === "dagger") {
            current_weapon_power += power
        } else {
            current_armour_power += power
        }
    }
    currentWPOutput.innerHTML = current_weapon_power.toLocaleString()
    currentAPOutput.innerHTML = current_armour_power.toLocaleString()
}
function npcalc() {
    let new_weapon_power = 0
    let new_armour_power = 0
    for(let i = 0; i < 9; i++) {
        let fest_boost = i < 2 ? wpFest.value/100 : apFest.value/100
        let chant_boost = i < 2 ? wpChant.value/100 : apChant.value/100
        let power = Math.round(((0.5*goalInputs[i].value*(goalInputs[i].value-1)+1)+((0.5*goalInputs[i].value*(goalInputs[i].value-1)+1)*orb_boost(Object.keys(equipment)[i])))*(1+fest_boost)*(1+chant_boost))
        if(i < 2) {
            new_weapon_power += power
        } else {
            new_armour_power += power
        }
    }
    newWPOutput.innerHTML = new_weapon_power.toLocaleString()
    newAPOutput.innerHTML = new_armour_power.toLocaleString()
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


window.onload = function () {
    let username = "DieRandomDie"
    fetch('https://lyrania.co.uk/api/accounts.php?search=12282')
        .then(res => {
            if (res.ok && res.status === 200) {
                res.json()
                    .then(data => {
                        username = data.name
                        document.getElementById("footer").innerHTML = `Found an issue? Want to meme on me? Whisper or mail ${username} in game.`
                    })
            } else {
                console.log("USERNAME FETCH FAILED. ERROR:" + res.status + ". DEFAULT NAME WILL BE USED.")
                document.getElementById("footer").innerHTML = `Found an issue? Want to meme on me? Whisper or mail ${username} in game. (API failed to fetch my current name. Ask in main.)`
            }
        })
    if ( checkCookie() ) {
        fetchAPI(getCookie("key"))
        wpChant.value = getCookie("wpc")
        apChant.value = getCookie("apc")
        wpFest.value = getCookie("wpf")
        apFest.value = getCookie("apf")
    }
}