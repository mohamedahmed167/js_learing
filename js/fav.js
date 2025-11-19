let noProducts = document.querySelector(".noProducts");
let productDom = document.querySelector(".products");

function drawFavoriteUI(allProducts = []) {
    // نقرأ البيانات من localStorage بأمان
    let favoriteData = JSON.parse(localStorage.getItem("prFavorite")) || allProducts;

    // لو مفيش بيانات خالص
    if (!favoriteData || favoriteData.length === 0) {
        noProducts.innerHTML = "There are no items in the favorite list";
        productDom.innerHTML = ""; // نفرغ المنتجات
        return; // نوقف التنفيذ هنا
    } else {
        noProducts.innerHTML = ""; // نخليها فاضية لو في منتجات
    }

    // نرسم المنتجات في الصفحة
    let productsUi = favoriteData.map((item) => {
        return `
            <div class="product-item">
                <img src="${item.imgUrl}" alt="headphone" class="product-item-image">
                <div class="product-item-decs">
                    <h2>${item.title}</h2>
                    <p>${item.desc}</p>
                    <span>Size: ${item.size}</span><br>
                    <span>Quantity: ${item.qty}</span>
                </div>
                <div class="product-item-actions">
                    <a class="add-to-cart" onclick="removeItemfromCart(${item.id})">
                        Remove from Favorite
                    </a>
                </div>
            </div>
        `;
    });

    productDom.innerHTML = productsUi.join("");
}

// أول مرة نرسم فيها الصفحة
drawFavoriteUI();

function removeItemfromCart(id) {
    let favoriteData = JSON.parse(localStorage.getItem("prFavorite")) || [];

    // نحذف العنصر المطلوب
    let filteredItems = favoriteData.filter((item) => item.id !== parseInt(id));

    // نحفظ البيانات الجديدة
    localStorage.setItem("prFavorite", JSON.stringify(filteredItems));

    // نعيد الرسم
    drawFavoriteUI(filteredItems);
}
