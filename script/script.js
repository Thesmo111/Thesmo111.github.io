const header = document.querySelector(".navbar");
const navButton = document.querySelector(".navbar-toggler");

window.onscroll = function() {
    var top = window.scrollY;
    if(top >=100) {
        header.classList.add('navbarbg');
    }
    else {
        header.classList.remove('navbarbg');
    }
}
