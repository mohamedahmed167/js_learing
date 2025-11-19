let product=JSON.parse(localStorage.getItem("products"))
let productId=localStorage.getItem("productDetiles")
let itemDom=document.querySelector(".item-detils")
let productDetiles=product.find(item=> item.id ==productId);
console.log(productDetiles);
itemDom.innerHTML+=`
<img src="${productDetiles.imgUrl}" alt="">
<h2>${productDetiles.title}</h2>
<p> ${productDetiles.decs}</p>
<span> size: ${productDetiles.size}</span><br>
<span> quntity: ${productDetiles.qty}</span><br>
<button onclick="editProduct(${productId})" >Edit product</button>
`
function editProduct(id){
    localStorage.setItem("editProduct",id);
    setTimeout(()=>{
        window.location="/html/edit.html";
    },500)


}