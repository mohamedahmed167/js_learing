let productName = document.getElementById("productName");
let productdesc = document.getElementById("productdesc");
let productSize = document.getElementById("productSize");
let CreateForm = document.getElementById("createForm");
let fileImage = document.getElementById("uploadImage");

let productSizeValue;
let productImage;

function getProductSizeValue(e) {
    productSizeValue = e.target.value;
}

function createProductFun(e) {
    e.preventDefault();

    let allProducts = JSON.parse(localStorage.getItem("products")) || productDB;
    let nameValue = productName.value;
    let descValue = "Lorem ipsum dolor sit amet. Large";

    if (nameValue && descValue) {
        let obj = {
            id: allProducts ? allProducts.length + 1 : 1,
            qty: 1,
            imgUrl: productImage,
            size: productSizeValue,
            title: nameValue,
            desc: descValue,
            isMe: "Y"
        };

        let newProducts = allProducts ? [...allProducts, obj] : [obj];
        localStorage.setItem("products", JSON.stringify(newProducts));

        productName.value = "";
        productdesc.value = "";
        productSize.value = "";

        setTimeout(() => {
            window.location = "/html/index.html";
        }, 500);
    } else {
        alert("enter the information");
    }
}

function uploadeImage() {
    let file = this.files[0];
    console.log(file);

    let types = ["image/png", "image/jpeg"];

    if (types.indexOf(file.type) === -1) {
        alert("This file type is not supported");
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        alert("The size is too large");
        return;
    }

    // بعد التحقق نقرأ الصورة
    getImageBase64(file);

    productImage = URL.createObjectURL(file);
    console.log("Image URL:", productImage);
}

productSize.addEventListener("change", getProductSizeValue);
CreateForm.addEventListener("submit", createProductFun);
fileImage.addEventListener("change", uploadeImage);

function getImageBase64(file) {
    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function () {
        console.log("Base64:", reader.result);
    };

    reader.onerror = function () {
        alert("Error reading file!");
    };
}
