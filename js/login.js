let userName = document.querySelector("#username");
let pass = document.querySelector("#passowerd");
let sign_in = document.querySelector("#sign-in");
let getUser = localStorage.getItem("username");
let getPass = localStorage.getItem("password");

sign_in.addEventListener("click", login);
function login(e){
    {
        e.preventDefault();

        if (userName.value === "" || pass.value === "") {
          alert("Please enter your information");
        } else {
          if ((getUser &&getUser.trim()===userName.value.trim()) && getPass && getPass ===pass.value.trim()   ) {
            console.log("Login successful ✅");
              setTimeout(()=>{
                  window.location="/html/index.html";
              },1500)


          } else {
            console.log("Username or password is wrong ❌");
          }
        }
      }
}