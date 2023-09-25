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
                    power('current')
                    power('goal')
                })
        } else {
            api.val("Error")
            setTimeout(()=>{api.val('')},2000)
        }
    })

}
function orb(o) {
    switch(o) {
        case 'Poor': return 20;
        case 'Decent': return 40;
        case 'Fine': return 60;
        case 'Quality': return 80;
        case 'Flawless': return 100;
        case 'Exquisite': return 120;
        case 'Crystalline': return 140;
        case 'Prismatic': return 160;
        case 'Chromatic': return 180;
        case 'Perfect': return 200;
        default: return 0;
    }
}

function dataUpdate(p) {
    plat = parseInt((p.currency.money).split('p')[0].replaceAll(',',''))
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
    $("#orb-shortsword").val(parseInt(orb(e.Shortsword.orb)))
    $("#orb-dagger").val(parseInt(orb(e.Dagger.orb)))
    $("#orb-helmet").val(parseInt(orb(e.Helmet.orb)))
    $("#orb-shoulders").val(parseInt(orb(e.Shoulders.orb)))
    $("#orb-wrists").val(parseInt(orb(e.Wrist.orb)))
    $("#orb-gloves").val(parseInt(orb(e.Gloves.orb)))
    $("#orb-chestpiece").val(parseInt(orb(e.Chestpiece.orb)))
    $("#orb-leggings").val(parseInt(orb(e.Leggings.orb)))
    $("#orb-boots").val(parseInt(orb(e.Boots.orb)))
}

function cost(c, g) {
    let cost = 0
    for (let i = parseInt(c)+1; i<=parseInt(g); i++) {
        cost += (((i - 1) ** 2) * 50 - (i - 2)) * (1 - (parseInt(blacksmith.val())/100))
    }
    return cost
}

function power(c) {
    let wp = 0
    let ap = 0
    let wf = parseInt($('#weapon-fest').val())/50
    let af = parseInt($('#armour-fest').val())/50
    let wc = parseInt($('#weapon-chant').val())/100
    let ac = parseInt($('#armour-chant').val())/100
    $('input.'+c).each(i=>{
        let l = parseInt($('input.' + c)[i].value)
        let o = (parseInt($('select')[i].value)/100)
        let fest = i>1 ? af : wf
        let chant = i>1 ? ac : wc
        let p = Math.round(((0.5 * l * (l - 1) + 1) + ((0.5 * l * (l - 1) + 1) * o)) * (1 + fest) * (1 + chant))
        wp += i>1 ? 0 : p
        ap += i>1 ? p : 0
    })
    $(`#${c}-weapon-power`).val(wp.toLocaleString())
    $(`#${c}-armour-power`).val(ap.toLocaleString())
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
    power('goal')
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
    power(this.id.split('-')[0])
})

$('.boost').on('input', function(){
    if (this.value > 200) {this.value = 200}
    if (this.value < 0) {this.value = 0}
    power('current')
    power('goal')
})

window.onload = function () {
    $('select').each(i=>{
        $('select')[i].innerHTML = `<option value="0">None</option><option value="20">Poor</option><option value="40">Decent</option><option value="60">Fine</option><option value="80">Quality</option><option value="100">Flawless</option><option value="120">Exquisite</option><option value="140">Crystalline</option><option value="160">Prismatic</option><option value="180">Chromatic</option><option value="200">Perfect</option>`
    })
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
            $("#footer").text(`Found an issue? Want to meme on me? Whisper or mail ${username} in game. (API failed to fetch my current name. Ask in main.)`)
        }
    })
    power('current')
    power('goal')
}