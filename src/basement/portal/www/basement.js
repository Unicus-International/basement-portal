var modal = document.getElementById('id01');
var modal2 = document.getElementById('id02');
var modal3 = document.getElementById('id03');
const baseURL = "https://basement.yoga.unicus.com/v0/";
var xhr;

window.onload = function(){
    hentKort();
    var kort = document.getElementById('row').getElementsByClassName('column');
    for(var i=0;i<kort.length; i++){
        if(sessionStorage.getItem((kort[i].getAttribute(('id')) + '-visible')) == 'none'){
            kort[i].style.display = 'none';
        }else{
            kort[i].style.display = 'block';
        }
    }
    sjekkLogin();
}

function hentKort(){
    xhr = new XMLHttpRequest();
    var url = baseURL + "card/list?page=0&limit=80";
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.withCredentials = true;
    var sjanger = sessionStorage.getItem('filter');
    xhr.onload = function() {
        if(xhr.status == 200){
            console.log(JSON.parse(xhr.responseText));
            var arrayOfThings = JSON.parse(xhr.responseText);
            for(var i=0;i<arrayOfThings.length;i++){
                var ooobject = arrayOfThings[i];
                if(!sjanger || ooobject.genre == sjanger){
                    var column = fillColumn_v2(ooobject);
                    var row = document.getElementById('row');
                    row.appendChild(column);
                }
            }
        }else{
            console.log(xhr.responseText);
        }
    };
    xhr.onerror = function() {
        console.log('There was an error!');
    }
    xhr.send();
}

//Setter cookie for innlogging
function setCookie(brukernavn, dato){
    let name = "basement";
    let uname = encodeURIComponent(brukernavn);
    let utgaar = "";
    if(dato){
        var date = new Date();
        date.setDate(date.getDate() + 365);
        utgaar = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + uname + utgaar;
}
//Henter cookie for innlogging
function getCookie(){
    var cooookies = document.cookie.split(';');
    for (var i = 0; i < cooookies.length; i++) {
        var name = cooookies[i].split('=')[0];
        var value = cooookies[i].split('=')[1];
        if(name == ' basement'){
            return decodeURIComponent(value);
        }
    }
    return "";
}
//Fjerner cookie for utlogging
function deleteCookie(){
    document.cookie = "basement=; expires=Fri, 2 Jan 1970 12:00:00 UTC;";
}

//Sjekker om brukeren er innlogget eller ikke
function sjekkLogin(){
    var inne = getCookie();
    if(!inne){
        document.getElementById('login-btn').innerText = "Log in/Sign up";
        document.getElementById('login-btn').style.display = "block";
        document.getElementById('usr-opt').style.display = "none";
    }else{
        document.getElementById('login-btn').innerText = "";
        sessionStorage.setItem('userName', inne)
        document.getElementById('usr-link').innerHTML = inne;
        document.getElementById('login-btn').style.display = "none";
        document.getElementById('usr-opt').style.display = "block";
    }
}

//Funksjon for å logge ut
function logOut(){
    sessionStorage.removeItem('userName');
    window.location.reload();
}
function clearSession(){
    sessionStorage.clear();
    window.location.reload();
}


//Funksjon for å logge ut
function logOut(){
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('filter');
    deleteCookie();
    window.location.reload();
}

//Funksjon for å åpne nedtrekksmeny under brukernavn
function openUsrmenu(){
    document.getElementById("usr-dropdown").classList.toggle("show");
}

//Når noen trykker utenfor vinduet, lukk det
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        clearFields("form1");
    }
    if (event.target == modal3) {
        modal3.style.display = "none";
        clearFields("form3");
    }
    if (!event.target.matches('.usr-link')) {
        var dropdowns = document.getElementsByClassName("usr-dropdown-menu");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
//Tømmer alle feltene når registrerings- eller innloggingsvinduet lukkes
function clearFields(myform){
    document.getElementById(myform).reset();
}
//Åpner registreringsvinduet og lukker innloggingsvinduet
function openReg(){
    document.getElementById('id02').style.display='block';
    modal.style.display = "none";
}
//Åpner vinduet for å registrere nytt arrangement
function openEventReg(){
    document.getElementById('id03').style.display='block';
}

//Sjekker at passordene matcher
function checkPassword(input){
    if(input.value != document.getElementById('psw1').value){
        input.setCustomValidity('Passordet matcher ikke.');
    }else{
        input.setCustomValidity('');
    }
}
//Sjekker at e-postene matcher 
function checkEmail(input){
    if(input.value != document.getElementById('email1').value){
        input.setCustomValidity('E-postadressen matcher ikke.');
    }else{
        input.setCustomValidity('');
    }
}
//Denne bare sjekker at innloggingen er riktig 
function validerLogin(user_name, pass_word, bli_inne){
    xhr = new XMLHttpRequest();
    var url = baseURL + "user/login";
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.withCredentials = true;
    var data = "username=" + user_name.value + "&password=" + pass_word.value;
    xhr.onload = function() {
        var responseText = xhr.responseText;
        if(xhr.status == 204){
            setCookie(user_name.value, bli_inne);
            document.getElementById('login-btn').innerText = "";
            window.location.reload();
        }else if(xhr.status == 403){
            user_name.setCustomValidity('Brukernavn og passord matcher ikke');
        }else{
            console.log(responseText);
        }
    };
    xhr.onerror = function() {
        console.log('There was an error!');
    };
    xhr.send(data);
}

//Dette er funksjonen for å filtrere kortene på forsiden.
function filtrerKort(input) {
    sessionStorage.setItem('filter', input);
    hentKort();
}

//Denne funksjonen setter saa alle kort hentes
function visAlleKort(){
    sessionStorage.setItem('filter', '');
    window.location.reload();
}

//Funksjon for å registrere ny bruker
function regNyBruker(user){
    var userNm = document.getElementById('uname1').value;
    userNm.setCustomValidity('');
    var psWrd1 = document.getElementById('psw1').value;
    var psWrd2 = document.getElementById('psw2').value;
    var eMail = document.getElementById('email1').value;
    xhr = new XMLHttpRequest();
    var url = baseURL + "user/register";
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.withCredentials = true;
    var data = "username=" + userNm + "&password_one=" + psWrd1 + "&password_two=" + psWrd2 + "&email_address=" + eMail;
    xhr.onload = function() {
        var responseText = xhr.responseText;
        if(xhr.status == 201){
            window.location.reload();
        }else if(xhr.status == 403){
            userNm.setCustomValidity('Brukernavnet er allerede tatt');
        }else{
            console.log(responseText);
        }
    };
    xhr.onerror = function() {
        console.log("There was an error");
    };
    xhr.send(data);        
    
    window.location.reload();
}

//Funksjon for å lage et nytt kort/arrangement
function lagKort(myform){
    if(document.getElementById('bildelink').value == ''){
        document.getElementById('bildelink').value = "https://upload.wikimedia.org/wikipedia/commons/5/50/Black_colour.jpg";
    }
    xhr = new XMLHttpRequest();
    var url = baseURL + "card/create";
    var dateNew = document.getElementById('konsertdato').value + "T16:00:00Z";
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.withCredentials = true;
    xhr.onload = function() {
        if(xhr.status == 201){
            sessionStorage.setItem('filter', '');
            hentKort();
        }else{
            console.log(xhr.responseText);
        }
    };
    xhr.onerror = function() {
        console.log("There was an error");
    };
    var data = JSON.stringify({"title":sessionStorage.getItem('userName'), "genre":document.getElementById('sjanger').value, "description":document.getElementById('merinfo').value, "date":dateNew, "location":document.getElementById('konsertsted').value, "image_url":document.getElementById('bildelink').value});
    xhr.send(data);
    myform.style.display = "none";
    clearFields("form3");
    window.location.reload();
}

//Denne trenger ikke forandring
function fillColumn(responsJson){
    var column = document.createElement('div');
    var card = document.createElement('div');
    var dato = responsJson.date.split('T');

    column.setAttribute("class", "column");
    column.setAttribute("data-genre", responsJson.genre);
    column.setAttribute("id", responsJson.id);

    var cardBody = '"/><h3>' + responsJson.title + '</h3><p>' + dato[0] + ' - ' + responsJson.location + '</p><p>' + responsJson.genre + '</p>';
    var forste;
    if(responsJson.img == ''){
        forste = '<img src="https://upload.wikimedia.org/wikipedia/commons/5/50/Black_colour.jpg' + cardBody;
    }else{
        forste = '<img src="' + responsJson.image_url + cardBody;
    }
    var innhold = new DOMParser().parseFromString(forste, "text/html");
    card = innhold.documentElement;

    card.setAttribute("class", "card");
    card.setAttribute("data-genre", responsJson.genre);
    card.setAttribute("data-img", responsJson.image_url);
    card.setAttribute("data-artist", responsJson.title);
    card.setAttribute("data-dato", dato[0]);
    card.setAttribute("data-sted", responsJson.location);
    card.setAttribute("data-info", responsJson.description);
    card.setAttribute("onClick", "openCard(this)");

    column.appendChild(card);
    return column;
}

function fillColumn_v2(responseJSON) {
    var column = document.getElementById('column_template').cloneNode(true);
    var dato = responseJSON.date.split('T');
    var card = column.querySelector('div');

    column.setAttribute("data-genre", responseJSON.genre);
    column.setAttribute("id", responseJSON.id);
    
    card.setAttribute("class", "card");
    card.setAttribute("data-genre", responseJSON.genre);
    card.setAttribute("data-img", responseJSON.image_url);
    card.setAttribute("data-artist", responseJSON.title);
    card.setAttribute("data-dato", dato[0]);
    card.setAttribute("data-sted", responseJSON.location);
    card.setAttribute("data-info", responseJSON.description);
    card.setAttribute("onclick", "openCard(this)");

    column.querySelector('img').setAttribute("src", responseJSON.image_url);
    column.querySelector('h3').textContent = responseJSON.title;
    column.querySelector('p.date').textContent = dato[0] + ' - ' + responseJSON.location;
    column.querySelector('p.genre').textContent = responseJSON.genre;
    
    return column;
}

//Funksjon for å få større utgave av arrangementet
function openCard(input){
    document.getElementById('exp-sjanger').innerHTML = '' + input.dataset.genre;
    if(input.dataset.img == "https://upload.wikimedia.org/wikipedia/commons/5/50/Black_colour.jpg"){
        document.getElementById('large-img').setAttribute("src", input.dataset.img);
        document.getElementById('X-knapp').style.color = "white";
    }else{
        document.getElementById('large-img').setAttribute("src", input.dataset.img);
        document.getElementById('X-knapp').style.color = "black";
    }
    document.getElementById('artistname').innerHTML = input.dataset.artist;
    document.getElementById('tidogsted').innerHTML = input.dataset.dato + ' - ' + input.dataset.sted;
    document.getElementById('infoarea').innerHTML = input.dataset.info;
    document.getElementById('sletteKnapp').setAttribute('data-id', input.parentElement.id);
    let kortEier = getCookie();
    if(kortEier && input.dataset.artist == kortEier){
        document.getElementById('sletteKnapp').style.display = 'block';
    }else{
        document.getElementById('sletteKnapp').style.display = 'none';
    }
    document.getElementById('id04').style.display = 'block';
}

//Funksjon som sletter kort/konsert
function slettKort(){
    var kort_id = document.getElementById('sletteKnapp').dataset.id;
    var url = baseURL + "card/" + kort_id + "/delete"
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.withCredentials = true;
    xhr.onload = function() {
        if(xhr.status == 204){
            window.location.reload();
        }else{
            console.log(xhr.responseText);
        }
    };
    xhr.onerror = function() {
        console.log("Error");
    };
    xhr.send(null);
    window.location.reload();
}


//Åpner menyen i hjørnet
function openMenu(x) {
    x.classList.toggle("change");
    if(document.getElementById('hamburg-dropdown').style.display == 'none'){
        document.getElementById('hamburg-dropdown').style.display='block';
    }else{
        document.getElementById('hamburg-dropdown').style.display='none';
    }
}
//Bare gjør at det å trykke i filter-menyen ikke lukker den
var filterMeny = document.getElementById('hamburg-dropdown');
filterMeny.addEventListener("click", function (e) {
    e.stopPropagation()
});
