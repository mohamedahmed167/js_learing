let noProducts = document.querySelector(".noProducts");
let productDom = document.querySelector(".products");

function drawCartProductsIUI(allProducts = []) {
    if (!productDom) {
        productDom = document.querySelector(".products");
    }
    if (!noProducts) {
        noProducts = document.querySelector(".noProducts");
    }

    let productsInCart = JSON.parse(localStorage.getItem("productsInCart")) || [];

    if (productsInCart.length === 0) {
        if (noProducts) {
            noProducts.innerHTML = "there is no items in the product";
        }
        if (productDom) {
            productDom.innerHTML = "";
        }
        return;
    }

    if (noProducts) {
        noProducts.innerHTML = "";
    }

    let products = productsInCart.length > 0 ? productsInCart : allProducts;
    let productsUi = products.map((item) => {
        return `
            <div class="product-item">
                <img src="${item.imgUrl}" alt="headphone" class="product-item-image">
                <div class="product-item-decs">
                    <h2>${item.title}</h2>
                    <p>${item.desc}</p>
                    <span>size: ${item.size}</span><br>
                    <span>quntity: ${item.qty || 1}</span>
                </div>
                <div class="product-item-actions">
                    <a class="add-to-cart" onclick="removeItemfromCart('${item.id}')">
                        remove from cart
                    </a>
                </div>
            </div>
        `;
    });

    if (productDom) {
        productDom.innerHTML = productsUi.join("");
    }
}

// انتظار تحميل DOM
document.addEventListener("DOMContentLoaded", function () {
    drawCartProductsIUI();
});
function removeItemfromCart(id) {
    let productsInCart = localStorage.getItem("productsInCart");
    if (productsInCart) {
        let items = JSON.parse(productsInCart)
        let filteredItem = items.filter((item) => item.id !== parseInt(id))
        localStorage.setItem("productsInCart", JSON.stringify(filteredItem))
        drawCartProductsIUI(filteredItem);

        // تحديث شارة السلة
        if (typeof updateCartBadge === 'function') {
            updateCartBadge();
        }
        if (typeof updateCartMenu === 'function') {
            updateCartMenu();
        }
    }
}
