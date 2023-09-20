const api = $('#api-key')
const toggle = $('#toggle-ratio')
const equip = $('.equip')
const equipcost = $('.cost')
const blacksmith = $('#blacksmith')
let plat = 0
async function getData(a) {
    await fetch('https://lyrania.co.uk/api/accounts.php?search=' + a)
    .then(res => {
        if (res.ok) {
            res.json()
                .then(data => {
                    dataUpdate(data)
                    updateAll()
                })
        } else {
            api.val("Error")
            setTimeout(()=>{api.val('')},2000)
        }
    })

}
function dataUpdate(p) {
    plat = parseInt((p.currency.money).split('p')[0].replaceAll(',',''))
    console.log(plat)
    const e = p.equipment
    $("#current-shortsword").val(parseInt(e.Shortsword.level))
    $("#current-dagger").val(parseInt(e.Dagger.level))
    $("#current-helmet").val(parseInt(e.Helmet.level))
    $("#current-shoulders").val(parseInt(e.Shoulders.level))
    $("#current-wrists").val(parseInt(e.Wrist.level))
    $("#current-gloves").val(parseInt(e.Gloves.level))
    $("#current-chestpiece").val(parseInt(e.Chestpiece.level))
    $("#current-leggings").val(parseInt(e.Leggings.level))
    $("#current-boots").val(parseInt(e.Boots.level))
}

function cost(c, g) {
    let cost = 0
    for (let i = parseInt(c)+1; i<=parseInt(g); i++) {
        cost += (((i - 1) ** 2) * 50 - (i - 2)) * (1 - (parseInt(blacksmith.val())/100))
    }
    return cost
}
function update(e) {
    let c = cost($('#current-'+e).val(),$('#goal-'+e).val())
    $('#cost-'+e).val(Math.round(c/10000).toLocaleString()+'p')
    let t = 0
    equipcost.each(i => {
        t+=parseInt((equipcost[i].value).replaceAll(',',''))
    })
    $('#total-cost').val(t.toLocaleString()+'p')
    let n = (t-plat) >= 0 ? t-plat : 0
    $('#total-needed').val(n.toLocaleString()+'p')
}
function updateAll() {
    equipcost.each(i => {
        update(equipcost[i].id.split('-')[1])
    })
}
api.on("focusout", function() {
    if (api.val().length === 32) {
        getData(api.val())
    } else {
        api.val("Invalid")
        setTimeout(()=>{api.val('')},2000)
    }
})
blacksmith.on("input", function () {
    if(this.value>50) {this.value = 50}
    if(this.value<0) {this.value = 0}
    updateAll()
})
toggle.on("change", function () {
    $('.goal-weapon').val($('#goal-shortsword').val())
    $('.goal-armor').val($('#goal-helmet').val())
    equipcost.each(i => {
        update(equipcost[i].id.split('-')[1])
    })
    if(this.checked) {
        $('.toggle').prop('disabled',true)
        $('.toggle').css('visibility','hidden')
    } else {
        $('.toggle').prop('disabled',false)
        $('.toggle').css('visibility','visible')
    }
})
equip.on("input", function() {
    if (this.value > 25000) {this.value = 25000}
    if (this.value < 0) {this.value = 0}
    if (toggle.is(':checked') && this.classList.contains('goal')) {
        let c = $('.'+this.classList[0])
        c.each(i => {
            c[i].value = this.value
            update(c[i].id.split('-')[1])
        })
    } else {
        update(this.id.split('-')[1])
    }
})

window.onload = function () {
    let username = "DieRandomDie"
    fetch('https://lyrania.co.uk/api/accounts.php?search=12282')
    .then(res => {
        if (res.ok && res.status === 200) {
            res.json()
                .then(data => {
                    username = data.name
                    $("#footer").text(`Found an issue? Want to meme on me? Whisper or mail ${username} in game.`)
                })
        } else {
            console.log("USERNAME FETCH FAILED. ERROR:" + res.status + ". DEFAULT NAME WILL BE USED.")
            $("#footer").text(`Found an issue? Want to meme on me? Whisper or mail ${username} in game. (API failed to fetch my current name. Ask in main.)`)
        }
    })
}
