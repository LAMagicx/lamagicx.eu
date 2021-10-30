
function load() {
    if (localStorage.getItem("email") !== null) {
        document.getElementById("email").value = localStorage.getItem("email");
    }
    if (localStorage.getItem("subject") !== null) {
        document.getElementById("subject").value = localStorage.getItem("subject");
    }
    if (localStorage.getItem("message") !== null) {
        document.getElementById("message").value = localStorage.getItem("message");
    }
}


function send() {
    var email = document.getElementById("email").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;
    localStorage.setItem("email", email);
    localStorage.setItem("subject", subject);
    localStorage.setItem("message", message);
    var data = new FormData();
    data.append("email", email);
    data.append("subject", subject);
    data.append("message", message);
    data.append("func", "sendmail");

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "sendmail");
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let res = this.responseText;
            console.log(res);
        }
    }
    xhttp.send(data);
}
