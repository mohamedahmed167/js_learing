let productDom;
let noProducts;
let drawProductsUI;

// انتظار تحميل DOM قبل تنفيذ الكود
document.addEventListener("DOMContentLoaded", function () {
  productDom = document.querySelector(".products");
  noProducts = document.querySelector(".noProducts");

  // رسم المنتجات عند تحميل الصفحة
  drawProductsUI();
});

drawProductsUI = function (product = []) {
  // التأكد من وجود العناصر
  if (!productDom || !noProducts) {
    productDom = document.querySelector(".products");
    noProducts = document.querySelector(".noProducts");
  }

  if (!productDom || !noProducts) {
    console.error("عناصر DOM غير موجودة");
    return;
  }

  // إذا لم يتم تمرير منتجات، نقرأها من localStorage
  if (product.length === 0) {
    product = JSON.parse(localStorage.getItem("products")) || [];
  }

  let myProducts = product.filter((i) => i.isMe === "Y");

  if (myProducts.length != 0) {
    let productsUi = myProducts.map((item) => {
      console.log("eee", item)
      return `
        <div class="product-item" style="border: ${item.isMe === "Y" ? "1px solid #bd6ff1" : "none"};">
            <img src="${item.imgUrl}" alt="product" class="product-item-image">
              <div class="product-item-decs">
              <a onclick="saveItemData(${item.id})">${item.title}</a>
              <h2>${item.title}</h2>
              <p>${item.desc}</p>
              <span>size: ${item.size}</span>
              <div>
              <button class='edit-item' onclick='editProduct(${item.id})'> Edit product</button>
              </div>
              <div>
              <button class='delet-item' onclick='deletProduct(${item.id})'> Delet product</button>
              </div>
              </div>
        </div>
      `
    });
    productDom.innerHTML = productsUi.join("");
    noProducts.innerHTML = "";
  } else {
    noProducts.innerHTML = "No products";
    productDom.innerHTML = "";
  }
};
function editProduct(id) {
  localStorage.setItem("editProduct", id)
  setTimeout(() => {
    window.location = "/html/edit.html";
  }, 500)
}

function saveItemData(id) {
  localStorage.setItem("productDetiles", id);
  window.location = "/html/cardDetails.html";
}




function deletProduct(id) {
  // تأكيد من المستخدم قبل الحذف
  if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
    return;
  }

  // تحويل id إلى رقم لضمان المطابقة
  id = parseInt(id);

  // جلب جميع المنتجات من localStorage أو من productDB
  let product = JSON.parse(localStorage.getItem("products")) || productDB;

  // حذف المنتج من المصفوفة الأصلية حسب id
  product = product.filter((i) => i.id !== id);

  // حفظ التغييرات في localStorage
  localStorage.setItem("products", JSON.stringify(product));

  // حذف المنتج من السلة إذا كان موجوداً فيها
  let productsInCart = JSON.parse(localStorage.getItem("productsInCart")) || [];
  productsInCart = productsInCart.filter((i) => i.id !== id);
  localStorage.setItem("productsInCart", JSON.stringify(productsInCart));

  // حذف المنتج من المفضلة إذا كان موجوداً فيها
  let favorites = JSON.parse(localStorage.getItem("prFavorite")) || [];
  favorites = favorites.filter((i) => i.id !== id);
  localStorage.setItem("prFavorite", JSON.stringify(favorites));

  // إعادة رسم المنتجات الخاصة بالمستخدم الحالي مع تمرير البيانات المحدثة
  drawProductsUI(product);

  // تحديث واجهة السلة إذا كانت الدوال متاحة
  if (typeof updateCartMenu === 'function') {
    updateCartMenu();
  }
  if (typeof updateCartBadge === 'function') {
    updateCartBadge();
  }
}
