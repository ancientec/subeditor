//dark and light mode:
function setColorMode(colorMode) {
    localStorage.setItem('colorMode', colorMode);
    if(colorMode === 'dark' && !document.body.classList.contains('darkmode')) {
        document.body.classList.add('darkmode');
    } else if(colorMode !== 'dark') {
        document.body.classList.remove('darkmode');
    }
}
function inEditor(el) {
    var p = el;
    while(p = p.parentElement) {
      if(p.classList.contains("SubEditor")) return true;
    }
    return false;
}
  
document.addEventListener("DOMContentLoaded", () => {
    var colorMode = localStorage.getItem('colorMode');
    setColorMode(colorMode === "light" ? "light" : "dark");
    
    window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", function (e) {console.log(e);
        setColorMode(e.matches ? "dark" : "light");
    });
    document.querySelectorAll("aside ul li a").forEach(s => {
        s.classList.remove("is-active");
        if(s.getAttribute("href") === location.pathname) s.classList.add("is-active");
      });
      document.querySelectorAll("table").forEach(t => {
        if(!inEditor(t) && !t.classList.contains("table")) t.classList.add("table");
      });
      document.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(t => {
        if(!inEditor(t) && !t.classList.contains("title")) {
          t.classList.add("title");
          t.classList.add("is-"+t.nodeName.replace("H",""));
        }
      });
});
