// ============================
// 📦 User Elements & Login Check
// ============================
let userDom = document.querySelector("#user");
let userInfo = document.querySelector("#user-info");
let links = document.querySelector("#links");
let logOut = document.querySelector("#log-out");

// تحقق من تسجيل الدخول
let check = localStorage.getItem("username");
if (check) {
    links.remove();
    userDom.style.display = "flex";
    userInfo.innerHTML = `Hello ${localStorage.getItem("username")}`;
}

// تسجيل الخروج
logOut.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.clear();
    setTimeout(() => {
        window.location = "register.html";
    }, 1500);
});
