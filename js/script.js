// let spann = document.querySelector(".badge");
let productDom = document.querySelector(".products");
// let cartsProductmenu = document.querySelector(".carts-products");
// let shoping = document.querySelector(".shopping");
let product = productDB;
let input = document.querySelector("#search");
let drawProductsUI;

// دالة مساعدة لجمع جميع المنتجات من localStorage و productDB
function getAllProducts() {
  try {
    let productsFromStorage = JSON.parse(localStorage.getItem("products")) || [];
    let allProducts = [];
    let existingIds = new Set();

    // إضافة جميع منتجات productDB أولاً (إذا كانت موجودة)
    if (typeof productDB !== 'undefined' && productDB && productDB.length > 0) {
      productDB.forEach(item => {
        allProducts.push({ ...item });
        existingIds.add(item.id);
      });
    }

    // إضافة/تحديث المنتجات من localStorage
    if (productsFromStorage.length > 0) {
      productsFromStorage.forEach(item => {
        if (existingIds.has(item.id)) {
          // إذا كان المنتج موجوداً في productDB، نستخدم النسخة من localStorage (قد تكون معدلة)
          let index = allProducts.findIndex(p => p.id === item.id);
          if (index !== -1) {
            allProducts[index] = item;
          }
        } else {
          // إضافة منتج جديد من localStorage
          allProducts.push(item);
          existingIds.add(item.id);
        }
      });
    }

    // إذا لم تكن هناك منتجات، نستخدم productDB فقط
    if (allProducts.length === 0 && typeof productDB !== 'undefined' && productDB && productDB.length > 0) {
      return [...productDB];
    }

    return allProducts;
  } catch (error) {
    console.error("خطأ في getAllProducts:", error);
    // في حالة الخطأ، نحاول استخدام localStorage أو productDB
    try {
      let productsFromStorage = JSON.parse(localStorage.getItem("products")) || [];
      if (productsFromStorage.length > 0) {
        return productsFromStorage;
      }
    } catch (e) {
      console.error("خطأ في قراءة localStorage:", e);
    }

    // استخدام productDB كبديل
    if (typeof productDB !== 'undefined' && productDB && productDB.length > 0) {
      return [...productDB];
    }

    return [];
  }
}

drawProductsUI = function (product = []) {
  // التأكد من وجود productDom
  if (!productDom) {
    productDom = document.querySelector(".products");
  }

  if (!productDom) {
    console.error("عنصر .products غير موجود");
    return;
  }

  // إذا لم يتم تمرير منتجات، نستخدم getAllProducts
  if (product.length === 0) {
    product = getAllProducts();
  }

  if (!product || product.length === 0) {
    console.log("لا توجد منتجات للعرض");
    productDom.innerHTML = "";
    return;
  }

  let productsUi = product.map((item) => {
    return `
      <div class="product-item" style="border: ${item.isMe === "Y" ? "2px solid #bd6ff1" : "1px solid #ddd"};">
          <img src="${item.imgUrl}" alt="${item.title}" class="product-item-image"'">
          <div class="product-item-decs">
            <a onclick="saveItemData(${item.id})" class="product-title">${item.title}</a>
            <h2 style="display: none;">${item.title}</h2>
            <p class="product-desc">${item.desc || "No description available"}</p>
            <span class="product-size">Size: ${item.size}</span>
            ${item.isMe === "Y" ? `
              <div style="margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap;">
                <button class='edit-item' onclick='editProduct(${item.id})'>
                  <i class="fa fa-edit"></i> Edit
                </button>
                <button class='delet-item' onclick='deletProduct(${item.id})'>
                  <i class="fa fa-trash"></i> Delete
                </button>
              </div>
            ` : ""}
          </div>
          <div class="product-item-actions">
            <a class="add-to-cart" onclick="addToCard(${item.id})">
              <i class="fa fa-shopping-cart"></i> Add to Cart
            </a>
            <i class="fa-regular fa-heart favorite-icon"
               style="color: ${item.liked == true ? "#ff0000" : "#999"}"
               onclick="addToFavroite(${item.id})"
               title="${item.liked == true ? "Remove from favorites" : "Add to favorites"}">
            </i>
          </div>
      </div>`;
  });
  productDom.innerHTML = productsUi.join("");

  // إخفاء noProducts إذا كانت هناك منتجات
  let noProducts = document.querySelector(".noProducts");
  if (noProducts) {
    if (product.length > 0) {
      noProducts.innerHTML = "";
    } else {
      noProducts.innerHTML = "<p style='text-align: center; padding: 40px; color: #999; font-size: 18px;'>No products found</p>";
    }
  }
};

// انتظار تحميل DOM قبل رسم المنتجات
document.addEventListener("DOMContentLoaded", function () {
  // التأكد من وجود productDom
  if (!productDom) {
    productDom = document.querySelector(".products");
  }

  // رسم المنتجات عند تحميل الصفحة
  let allProducts = getAllProducts();
  console.log("المنتجات المحملة عند بدء الصفحة:", allProducts.length);
  drawProductsUI(allProducts);
});
function addToCard(id) {
  if (localStorage.getItem("username")) {
    // استخدام getAllProducts للحصول على جميع المنتجات
    let allProducts = getAllProducts();
    let products = allProducts.find((item) => item.id === id);

    // قراءة المنتجات من السلة من localStorage
    let addItem = JSON.parse(localStorage.getItem("productsInCart")) || [];

    // إضافة خاصية qty إذا لم تكن موجودة
    if (!products.qty) {
      products.qty = 1;
    }

    let isProductInCart = addItem.some(i => i.id === products.id);

    if (isProductInCart) {
      addItem = addItem.map(p => {
        if (p.id === products.id) {
          p.qty = (p.qty || 1) + 1;
        }
        return p;
      });
    } else {
      addItem.push(products);
    }

    // حفظ البيانات في localStorage
    localStorage.setItem("productsInCart", JSON.stringify(addItem));

    // تحديث واجهة السلة إذا كانت الدوال متاحة
    if (typeof updateCartMenu === 'function') {
      updateCartMenu();
    }
    if (typeof updateCartBadge === 'function') {
      updateCartBadge();
    }
  } else {
    alert("Please log in first!");
  }
}
function getUniqueArr(arr, filterType) {
  let unique = arr.map((item) => item[filterType])
    .map((item, i, final) => final.indexOf(item) === i && i)
    .filter((item) => arr[item])
    .map((item) => arr[item])
  return unique;
}


// function openmenu() {
//   if (cartsProductDivDom.innerHTML !== "") {
//     cartsProductmenu.style.display =
//       cartsProductmenu.style.display === "block" ? "none" : "block";
//   }
// }
// shoping.addEventListener("click", openmenu);
function saveItemData(id) {
  localStorage.setItem("productDetiles", id);
  window.location = "/html/cardDetails.html";
}

input.addEventListener("keyup", function (e) {
  let value = e.target.value.trim();
  let allProducts = getAllProducts();

  // الحصول على القيمة المحددة من فلتر الحجم
  let sizeFilter = document.querySelector("#size-filter");
  let selectedSize = sizeFilter ? sizeFilter.value : "";

  // تطبيق فلتر الحجم أولاً
  let filteredBySize = allProducts;
  if (selectedSize && selectedSize !== "all" && selectedSize !== "") {
    let searchSize = selectedSize.toLowerCase().trim();
    filteredBySize = allProducts.filter(i => {
      if (!i.size) return false;
      let itemSize = String(i.size).toLowerCase().trim();
      return itemSize === searchSize;
    });
  }

  // ثم تطبيق البحث بالاسم
  if (value === "") {
    drawProductsUI(filteredBySize);
  } else {
    let searchValue = value.trim().toLowerCase();
    let filteredByName = filteredBySize.filter((item) =>
      item.title.toLowerCase().includes(searchValue)
    );
    drawProductsUI(filteredByName);
  }
});

function search(title, myArray) {
  let searchValue = title.trim().toLowerCase(); // نحول النص لحروف صغيرة ونشيل المسافات
  let arr = myArray.filter((item) => item.title.toLowerCase().includes(searchValue));
  drawProductsUI(arr);
}

let Favorite = localStorage.getItem("prFavorite") ?
  JSON.parse(localStorage.getItem("prFavorite")) : [];

function addToFavroite(id) {
  if (localStorage.getItem("username")) {
    // 1. الحصول على جميع المنتجات
    let allProducts = getAllProducts();

    // 2. تحديث حالة الإعجاب (liked) داخل جميع المنتجات
    allProducts = allProducts.map(item => {
      if (item.id === id) {
        item.liked = true;
      }
      return item;
    });

    // 3. حفظ مصفوفة المنتجات المحدثة في localStorage
    localStorage.setItem("products", JSON.stringify(allProducts));

    // 4. إيجاد المنتج المراد إضافته
    let productsToAdd = allProducts.find((item) => item.id === id);

    // 4. التحقق مما إذا كان المنتج موجودًا بالفعل في قائمة Favorite
    let isProductInFav = Favorite.some(i => i.id === productsToAdd.id);

    if (!isProductInFav) {
      // 5. إضافة المنتج إلى قائمة Favorite إذا لم يكن موجوداً
      Favorite.push(productsToAdd);
      // لضمان وجود حالة الإعجاب عليه في مصفوفة المفضلة أيضًا
      productsToAdd.liked = true;
    }

    // 6. حفظ قائمة المفضلة المحدثة في localStorage
    localStorage.setItem("prFavorite", JSON.stringify(Favorite));

    // 7. إعادة رسم واجهة المستخدم لتظهر علامة القلب باللون الأحمر
    drawProductsUI(allProducts);
  } else {
    alert("Please log in first!");
  }
}
// filter products by size
function SearchBysize(e) {
  if (!e || !e.target) return;

  let val = e.target.value;
  console.log("البحث بالحجم المحدد:", val);

  // استخدام دالة getAllProducts لجمع جميع المنتجات
  let allProducts = getAllProducts();
  console.log("عدد جميع المنتجات قبل الفلترة:", allProducts.length);

  // الحصول على قيمة البحث بالاسم
  let searchInput = document.querySelector("#search");
  let searchValue = searchInput ? searchInput.value.trim() : "";

  // فلترة المنتجات حسب الحجم
  let filteredItems = allProducts;
  if (val === "all" || val === "" || !val) {
    // لا نطبق فلتر الحجم
    filteredItems = allProducts;
  } else {
    // تطبيق فلتر الحجم (مقارنة غير حساسة لحالة الأحرف)
    let searchSize = val.toLowerCase().trim();
    filteredItems = allProducts.filter(i => {
      if (!i.size) return false;
      let itemSize = String(i.size).toLowerCase().trim();
      return itemSize === searchSize;
    });
  }

  // تطبيق البحث بالاسم إذا كان موجوداً
  if (searchValue !== "") {
    let searchLower = searchValue.toLowerCase();
    filteredItems = filteredItems.filter((item) =>
      item.title.toLowerCase().includes(searchLower)
    );
  }

  console.log("عدد المنتجات بعد الفلترة:", filteredItems.length);
  console.log("المنتجات المفلترة:", filteredItems.map(p => ({ title: p.title, size: p.size })));

  // عرض المنتجات المفلترة
  if (filteredItems.length > 0) {
    drawProductsUI(filteredItems);
  } else {
    // إذا لم توجد منتجات، نعرض رسالة
    if (productDom) {
      productDom.innerHTML = `<p style="text-align:end; color:#bd6ff1">there is no item to show it</p>`;
    }
  }
}

// انتظار تحميل DOM قبل إضافة event listener
document.addEventListener("DOMContentLoaded", function () {
  let size = document.querySelector("#size-filter");
  if (size) {
    console.log("تم إضافة event listener للفلتر");
    size.addEventListener("change", SearchBysize);
  } else {
    console.error("عنصر #size-filter غير موجود");
  }
});

// أيضاً محاولة إضافة event listener مباشرة (في حالة تحميل DOM مسبقاً)
let size = document.querySelector("#size-filter");
if (size) {
  size.addEventListener("change", SearchBysize);
}
// function  edit
function editProduct(id) {
  localStorage.setItem("editProduct", id)
  setTimeout(() => {
    window.location = "/html/edit.html";
  }, 500)
}