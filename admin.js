let accountUploadedImages = [];

// كلمة المرور الافتراضية
const DEFAULT_PASS = "bebo123";

document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    setupAuthListeners();
});

function checkAuth() {
    const isLoggedIn = sessionStorage.getItem("bebo_admin_logged_in");
    const overlay = document.getElementById("loginOverlay");
    const mainContent = document.getElementById("adminMainContent");

    if (isLoggedIn === "true") {
        if (overlay) overlay.style.display = "none";
        if (mainContent) mainContent.style.display = "block";
        initAdminDashboard();
    } else {
        if (overlay) overlay.style.display = "flex";
        if (mainContent) mainContent.style.display = "none";
    }
}

function setupAuthListeners() {
    const loginForm = document.getElementById("adminLoginForm");
    const logoutBtn = document.getElementById("logoutBtn");
    const errorMsg = document.getElementById("loginErrorMsg");

    if (loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            const inputPass = document.getElementById("adminPasswordInput").value;
            const currentPass = localStorage.getItem("bebo_admin_password") || DEFAULT_PASS;

            if (inputPass === currentPass) {
                sessionStorage.setItem("bebo_admin_logged_in", "true");
                errorMsg.style.display = "none";
                checkAuth();
            } else {
                errorMsg.style.display = "block";
            }
        };
    }

    if (logoutBtn) {
        logoutBtn.onclick = () => {
            sessionStorage.removeItem("bebo_admin_logged_in");
            checkAuth();
        };
    }
}

function initAdminDashboard() {
    loadSettings();
    renderAllProductsTable();
    loadAdminAccounts();
    loadAdminReviews();
    setupImageUploader();

    // تغيير الباسورد
    const changePassForm = document.getElementById("changePassForm");
    if (changePassForm) {
        changePassForm.onsubmit = (e) => {
            e.preventDefault();
            const newPass = document.getElementById("newPassInput").value;
            if (newPass.trim().length < 4) {
                alert("يرجى كتابة كلمة مرور مكونة من 4 أرقام/حروف على الأقل.");
                return;
            }
            localStorage.setItem("bebo_admin_password", newPass);
            alert("تم تغيير كلمة مرور الأدمن بنجاح!");
            e.target.reset();
        };
    }

    document.getElementById("settingsForm").onsubmit = (e) => {
        e.preventDefault();
        const whatsapp = document.getElementById("adminWhatsapp").value;
        const topbar = document.getElementById("adminTopBar").value;
        
        localStorage.setItem("bebo_whatsapp", whatsapp);
        localStorage.setItem("bebo_topbar", topbar);
        alert("تم حفظ إعدادات المتجر ورقم التواصل بنجاح!");
    };

    document.getElementById("addProductForm").onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById("newProdName").value;
        const price = parseFloat(document.getElementById("newProdPrice").value);
        const tag = document.getElementById("newProdTag").value;
        const category = document.getElementById("newProdCategory").value;

        let img = "images/diamonds.jpg";
        if (category === "membership") {
            img = "images/membership-gold.jpg";
        }

        const newItem = { name, price, tag, img };

        let key = "bebo_id_bundles";
        if (category === "account") key = "bebo_account_bundles";
        if (category === "membership") key = "bebo_memberships";

        let list = JSON.parse(localStorage.getItem(key)) || getDefaultBundles(category);
        list.push(newItem);
        localStorage.setItem(key, JSON.stringify(list));

        alert("تمت إضافة الباقة بنجاح!");
        e.target.reset();
        renderAllProductsTable();
    };

    document.getElementById("addAccountForm").onsubmit = (e) => {
        e.preventDefault();
        const title = document.getElementById("accTitle").value;
        const price = parseFloat(document.getElementById("accPrice").value);

        if (accountUploadedImages.length === 0) {
            accountUploadedImages.push("images/bebo-logo.jpg");
        }

        let accounts = JSON.parse(localStorage.getItem("bebo_for_sale_accounts")) || [];
        accounts.push({ id: Date.now(), title, price, images: [...accountUploadedImages] });
        localStorage.setItem("bebo_for_sale_accounts", JSON.stringify(accounts));

        alert("تم نشر الحساب مع الصور بنجاح!");
        e.target.reset();
        accountUploadedImages = [];
        document.getElementById("imagePreviewContainer").innerHTML = "";
        loadAdminAccounts();
    };
}

function loadSettings() {
    const whatsapp = localStorage.getItem("bebo_whatsapp") || "201003142035";
    const topbar = localStorage.getItem("bebo_topbar") || "⚡ الشحن الفوري متاح الآن · الدفع والتأكيد عبر واتساب";
    
    document.getElementById("adminWhatsapp").value = whatsapp;
    document.getElementById("adminTopBar").value = topbar;
}

function setupImageUploader() {
    const input = document.getElementById("accImagesInput");
    const preview = document.getElementById("imagePreviewContainer");
    if (!input || !preview) return;

    input.onchange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const src = event.target.result;
                accountUploadedImages.push(src);

                const imgBox = document.createElement("div");
                imgBox.style.cssText = "position: relative; width: 80px; height: 80px; border: 1px solid #00f2ff; border-radius: 8px; overflow: hidden;";
                imgBox.innerHTML = `
                    <img src="${src}" style="width: 100%; height: 100%; object-fit: cover;">
                    <button onclick="this.parentElement.remove()" style="position: absolute; top: 2px; right: 2px; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 10px;">✕</button>
                `;
                preview.appendChild(imgBox);
            };
            reader.readAsDataURL(file);
        });
    };
}

function renderAllProductsTable() {
    const tbody = document.getElementById("adminProductsTable");
    if (!tbody) return;

    const idBundles = JSON.parse(localStorage.getItem("bebo_id_bundles")) || getDefaultBundles("id");
    const accountBundles = JSON.parse(localStorage.getItem("bebo_account_bundles")) || getDefaultBundles("account");
    const memberships = JSON.parse(localStorage.getItem("bebo_memberships")) || getDefaultBundles("membership");

    let rowsHtml = "";

    idBundles.forEach((item, index) => {
        rowsHtml += generateTableRow(item.name, item.price, item.tag || '-', "شحن ID", "bebo_id_bundles", index);
    });

    accountBundles.forEach((item, index) => {
        rowsHtml += generateTableRow(item.name, item.price, item.tag || '-', "شحن للحساب", "bebo_account_bundles", index);
    });

    memberships.forEach((item, index) => {
        rowsHtml += generateTableRow(item.name, item.price, item.tag || '-', "عضوية", "bebo_memberships", index);
    });

    tbody.innerHTML = rowsHtml;
}

function generateTableRow(name, price, tag, categoryText, key, index) {
    return `
        <tr>
            <td><strong>${name}</strong></td>
            <td>${price} ج.م</td>
            <td><span class="product-tag" style="position:static;">${tag}</span></td>
            <td>${categoryText}</td>
            <td>
                <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px; margin-left: 4px;" onclick="editProduct('${key}', ${index})"><i class="fa-solid fa-pen"></i> تعديل</button>
                <button class="danger-btn" style="padding: 4px 8px; font-size: 12px;" onclick="deleteProduct('${key}', ${index})"><i class="fa-solid fa-trash"></i> حذف</button>
            </td>
        </tr>
    `;
}

function editProduct(key, index) {
    let list = JSON.parse(localStorage.getItem(key)) || getDefaultBundles(key.replace("bebo_", "").replace("_bundles", ""));
    const item = list[index];

    const newName = prompt("تعديل اسم الباقة:", item.name);
    if (newName === null) return;

    const newPrice = prompt("تعديل السعر:", item.price);
    if (newPrice === null) return;

    const newTag = prompt("تعديل الوسم (Tag):", item.tag || "");

    item.name = newName;
    item.price = parseFloat(newPrice) || item.price;
    item.tag = newTag;

    list[index] = item;
    localStorage.setItem(key, JSON.stringify(list));
    renderAllProductsTable();
}

function deleteProduct(key, index) {
    if (!confirm("هل أنت تأكد من إزالة هذه الباقة؟")) return;
    let list = JSON.parse(localStorage.getItem(key)) || [];
    list.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(list));
    renderAllProductsTable();
}

function loadAdminAccounts() {
    const tbody = document.getElementById("adminAccountsTable");
    if (!tbody) return;
    let accounts = JSON.parse(localStorage.getItem("bebo_for_sale_accounts")) || [];
    
    if (accounts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #94a3b8;">لا توجد حسابات معروضة حالياً</td></tr>`;
        return;
    }

    tbody.innerHTML = accounts.map(acc => `
        <tr>
            <td>
                <div style="display: flex; gap: 4px; overflow-x: auto;">
                    ${(acc.images || []).map(img => `<img src="${img}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">`).join('')}
                </div>
            </td>
            <td>${acc.title}</td>
            <td>${acc.price} ج.م</td>
            <td><button class="danger-btn" onclick="deleteAccount(${acc.id})">حذف</button></td>
        </tr>
    `).join('');
}

function deleteAccount(id) {
    let accounts = JSON.parse(localStorage.getItem("bebo_for_sale_accounts")) || [];
    accounts = accounts.filter(acc => acc.id !== id);
    localStorage.setItem("bebo_for_sale_accounts", JSON.stringify(accounts));
    loadAdminAccounts();
}

function loadAdminReviews() {
    const tbody = document.getElementById("adminReviewsTable");
    if (!tbody) return;

    const defaultReviews = [
        { name: "محمود احمد", comment: "اخونا بيبو مضمون سريع رخيص افضل العروض افضل الأسعار", stars: 5, date: "14 أكتوبر 2026" },
        { name: "علي محمد حسن", comment: "ارجل واحسن وتضمن استور في مصر بالنسبة للأسعار دي اسعار ضرب نار", stars: 5, date: "14 أكتوبر 2026" },
        { name: "نضال", comment: "بأمانه والله العظيم اجمد وأسرع وأضمن متجر انا جربته", stars: 5, date: "14 أكتوبر 2026" }
    ];
    let reviews = JSON.parse(localStorage.getItem("bebo_reviews")) || defaultReviews;

    tbody.innerHTML = reviews.map((rev, index) => `
        <tr>
            <td>${rev.name}</td>
            <td>${'★'.repeat(rev.stars)}</td>
            <td>${rev.comment}</td>
            <td><button class="danger-btn" onclick="deleteReview(${index})">حذف</button></td>
        </tr>
    `).join('');
}

function deleteReview(index) {
    let reviews = JSON.parse(localStorage.getItem("bebo_reviews")) || [];
    reviews.splice(index, 1);
    localStorage.setItem("bebo_reviews", JSON.stringify(reviews));
    loadAdminReviews();
}

function getDefaultBundles(type) {
    if (type === "id" || type === "id_bundles") {
        return [
            { name: "110 جوهرة (عن طريق ID)", price: 60, tag: "فوري", img: "images/diamonds.jpg" },
            { name: "231 جوهرة (عن طريق ID)", price: 110, tag: "", img: "images/diamonds.jpg" },
            { name: "341 جوهرة (عن طريق ID)", price: 165, tag: "", img: "images/diamonds.jpg" },
            { name: "460 جوهرة (عن طريق ID)", price: 230, tag: "", img: "images/diamonds.jpg" },
            { name: "583 جوهرة (عن طريق ID)", price: 265, tag: "الأكثر طلباً", img: "images/diamonds.jpg" },
            { name: "1188 جوهرة (عن طريق ID)", price: 530, tag: "توفير ممتاز", img: "images/diamonds.jpg" }
        ];
    }
    if (type === "account" || type === "account_bundles") {
        return [
            { name: "100 جوهرة (شحن بالحساب)", price: 45, tag: "", img: "images/diamonds.jpg" },
            { name: "310 جوهرة (شحن بالحساب)", price: 130, tag: "سعر خاص", img: "images/diamonds.jpg" },
            { name: "520 جوهرة (شحن بالحساب)", price: 210, tag: "", img: "images/diamonds.jpg" },
            { name: "1060 جوهرة (شحن بالحساب)", price: 410, tag: "توفير ممتاز", img: "images/diamonds.jpg" }
        ];
    }
    return [
        { name: "العضوية الشهرية (الذهبية)", price: 550, tag: "الأفضل قيمة", desc: "تفعيل العضوية الشهرية المكثفة لمدة 30 يوم.", img: "images/membership-gold.jpg" },
        { name: "العضوية الأسبوعية (البنفسجية)", price: 125, tag: "أسبوعي", desc: "تفعيل العضوية الأسبوعية الأساسية على ID.", img: "images/membership-purple.jpg" },
        { name: "العضوية الأسبوعية المخفضة (الزرقاء)", price: 90, tag: "عرض خاص", desc: "تفعيل العضوية الأسبوعية المخففة على ID.", img: "images/membership-weekly.jpg" }
    ];
}