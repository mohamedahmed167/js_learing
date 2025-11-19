const text=document.querySelector(".text");
const email=document.querySelector(".email")
const pass=document.querySelector(".pass")
const enter=document.querySelector(".enter")
enter.addEventListener("click",register)
function register(e){
        e.preventDefault();
    if(pass.value===""  || email.value==="" || text.value===""){
        alert("please enter your information")
    }else{
        localStorage.setItem("username",text.value)
        localStorage.setItem("email",email.value)
        localStorage.setItem("password",pass.value)
        setTimeout(()=>{
            window.location="login.html";
        },1500)
    }
    }
