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

navButton.addEventListener("click", () =>{
    const expanded = navButton.getAttribute("aria-expanded") === "true";
    navButton.setAttribute("aria-expanded", !expanded);
});