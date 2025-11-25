let product = JSON.parse(localStorage.getItem("products")) || productDB;
let productId = JSON.parse(localStorage.getItem("editProduct"));
let getProduct = product.find((i) => i.id === productId);
console.log("before updata",getProduct)
let productName = document.getElementById("productName");
let productdesc = document.getElementById("productdesc");
let productSize = document.getElementById("productSize");
let updataForm = document.getElementById("updataForm");
let fileImage = document.getElementById("uploadImage");

let productSizeValue;
let productImage;

productName.value = getProduct.title;
productdesc.value = getProduct.desc;
productSize.value = getProduct.size;
productImage = getProduct.imgUrl;

function getProductSizeValue(e) {
    productSizeValue = e.target.value;
}

function updataProductFun(e) {
    e.preventDefault();
    console.log("new product ",productName.value)
    getProduct.title=productName.value;
    getProduct.desc=productdesc.value;
    getProduct.size=productSize.value;
    getProduct.imgUrl=productImage;
    localStorage.setItem("products", JSON.stringify(product));
    console.log("After updata",getProduct)
    setTimeout(()=>{
        window.location="/index.html"
    },500);
}

function uploadeImage() {
    let file = this.files[0];
    console.log(file);

    let types = ["image/png", "image/jpeg"];
    if (types.indexOf(file.type) === -1) {
        alert("this file is not supported");
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        alert("the size is very large");
        return;
    }

    productImage = URL.createObjectURL(file);
    console.log("o", productImage);
    getImageBase64(file);
}

function getImageBase64(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        console.log(reader.result);
    };
    reader.onerror = function () {
        alert("error !!");
    };
}

productSize.addEventListener("change", getProductSizeValue);
updataForm.addEventListener("submit", updataProductFun);
fileImage.addEventListener("change", uploadeImage);
