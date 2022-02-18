apikey = document.getElementsByClassName("api-key")[0]
console.log(apikey.value)

var apikey = document.getElementsByClassName("api-key")[0];
apikey.addEventListener("keydown", function(event) {
    if ((event.keyCode === 9 || 13) /*&& apikey.value != ''*/) {
        if (event.keyCode === 13) {
            document.getElementsByClassName("blacksmith")[0].focus();
        }
        console.log("event");
    }
});