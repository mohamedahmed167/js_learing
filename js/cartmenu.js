// دالة لتحديث شارة السلة (تعمل في أي صفحة)
function updateCartBadge() {
  // البحث عن العنصر في كل مرة للتأكد من وجوده
  let badge = document.querySelector(".badge");
  if (!badge) return;

  let productsInCart = JSON.parse(localStorage.getItem("productsInCart")) || [];
  let totalItems = productsInCart.reduce((sum, item) => sum + (item.qty || 1), 0);

  badge.style.display = totalItems > 0 ? "block" : "none";
  badge.innerHTML = totalItems;
}

// دالة لتحديث قائمة السلة
function updateCartMenu() {
  let cartsProductDivDom = document.querySelector(".carts-products div");
  if (!cartsProductDivDom) return;

  let addItem = JSON.parse(localStorage.getItem("productsInCart")) || [];

  if (addItem.length > 0) {
    cartsProductDivDom.innerHTML = "";
    addItem.forEach((item) => {
      const qty = item.qty || 1;
      cartsProductDivDom.innerHTML += `<p>${item.title} (${qty})</p>`;
    });
  } else {
    cartsProductDivDom.innerHTML = "<p>السلة فارغة</p>";
  }
}

// دالة لفتح/إغلاق قائمة السلة
function openmenu() {
  let cartsProductmenu = document.querySelector(".carts-products");
  if (cartsProductmenu) {
    cartsProductmenu.style.display =
      cartsProductmenu.style.display === "block" ? "none" : "block";
  }
}

// انتظار تحميل DOM قبل تنفيذ الكود
document.addEventListener("DOMContentLoaded", function () {
  // البحث عن العناصر
  let spann = document.querySelector(".badge");
  let shoping = document.querySelector(".shopping");
  let cartsProductmenu = document.querySelector(".carts-products");
  let cartsProductDivDom = document.querySelector(".carts-products div");

  // إضافة event listener للقائمة إذا كانت موجودة
  if (shoping && cartsProductmenu) {
    shoping.addEventListener("click", openmenu);
  }

  // تحديث قائمة السلة إذا كانت موجودة
  if (cartsProductDivDom) {
    updateCartMenu();
  }

  // تحديث شارة السلة (تعمل دائماً إذا كان العنصر موجوداً)
  updateCartBadge();
});
