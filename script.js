document.addEventListener("DOMContentLoaded", () => {
    applyAdminSettings();
    renderIdBundles();
    renderAccountBundles();
    renderMemberships();
    renderForSaleAccounts();
    renderReviews();
    setup3DMascot();
    setupDrawer();
    setupModal();
    setupStarRating();
});

function applyAdminSettings() {
    const topbarText = localStorage.getItem("bebo_topbar");
    if (topbarText) {
        const topBarEl = document.querySelector(".top-bar span");
        if (topBarEl) topBarEl.innerText = topbarText;
    }
}

function getWhatsappNumber() {
    return localStorage.getItem("bebo_whatsapp") || "201003142035";
}

function renderIdBundles() {
    const container = document.getElementById("idProductsGrid");
    if (!container) return;
    const bundles = JSON.parse(localStorage.getItem("bebo_id_bundles")) || [
        { name: "110 جوهرة (عن طريق ID)", price: 60, tag: "فوري", img: "images/diamonds.jpg" },
        { name: "231 جوهرة (عن طريق ID)", price: 110, tag: "", img: "images/diamonds.jpg" },
        { name: "341 جوهرة (عن طريق ID)", price: 165, tag: "", img: "images/diamonds.jpg" },
        { name: "460 جوهرة (عن طريق ID)", price: 230, tag: "", img: "images/diamonds.jpg" },
        { name: "583 جوهرة (عن طريق ID)", price: 265, tag: "الأكثر طلباً", img: "images/diamonds.jpg" },
        { name: "1188 جوهرة (عن طريق ID)", price: 530, tag: "توفير ممتاز", img: "images/diamonds.jpg" }
    ];

    container.innerHTML = bundles.map((item, index) => `
        <div class="card product-card">
            ${item.tag ? `<span class="product-tag">${item.tag}</span>` : ''}
            <img src="${item.img || 'images/diamonds.jpg'}" alt="Diamonds" class="product-img">
            <h3>${item.name}</h3>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">شحن فوري مباشر عبر ID اللاعب.</p>
            <div class="product-price">${item.price} ج.م</div>
            <button class="btn btn-primary full-width" onclick="openOrderModal('${item.name}', ${item.price}, true)">شحن الآن</button>
        </div>
    `).join('');
}

function renderAccountBundles() {
    const container = document.getElementById("accountProductsGrid");
    if (!container) return;
    const bundles = JSON.parse(localStorage.getItem("bebo_account_bundles")) || [
        { name: "100 جوهرة (شحن بالحساب)", price: 45, tag: "", img: "images/diamonds.jpg" },
        { name: "310 جوهرة (شحن بالحساب)", price: 130, tag: "سعر خاص", img: "images/diamonds.jpg" },
        { name: "520 جوهرة (شحن بالحساب)", price: 210, tag: "", img: "images/diamonds.jpg" },
        { name: "1060 جوهرة (شحن بالحساب)", price: 410, tag: "توفير ممتاز", img: "images/diamonds.jpg" }
    ];

    container.innerHTML = bundles.map((item, index) => `
        <div class="card product-card">
            ${item.tag ? `<span class="product-tag">${item.tag}</span>` : ''}
            <img src="${item.img || 'images/diamonds.jpg'}" alt="Diamonds" class="product-img">
            <h3>${item.name}</h3>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">شحن آمن عبر بيانات الحساب.</p>
            <div class="product-price">${item.price} ج.م</div>
            <button class="btn btn-primary full-width" onclick="openOrderModal('${item.name}', ${item.price}, false)">اطلب الآن</button>
        </div>
    `).join('');
}

function renderMemberships() {
    const container = document.getElementById("membershipsGrid");
    if (!container) return;
    const memberships = JSON.parse(localStorage.getItem("bebo_memberships")) || [
        { name: "العضوية الشهرية (الذهبية)", price: 550, tag: "الأفضل قيمة", desc: "تفعيل العضوية الشهرية المكثفة لمدة 30 يوم.", img: "images/membership-gold.jpg" },
        { name: "العضوية الأسبوعية (البنفسجية)", price: 125, tag: "أسبوعي", desc: "تفعيل العضوية الأسبوعية الأساسية على ID.", img: "images/membership-purple.jpg" },
        { name: "العضوية الأسبوعية المخفضة (الزرقاء)", price: 90, tag: "عرض خاص", desc: "تفعيل العضوية الأسبوعية المخففة على ID.", img: "images/membership-weekly.jpg" }
    ];

    container.innerHTML = memberships.map((item, index) => `
        <div class="card product-card">
            ${item.tag ? `<span class="product-tag">${item.tag}</span>` : ''}
            <img src="${item.img || 'images/membership-gold.jpg'}" alt="Membership" class="product-img">
            <h3>${item.name}</h3>
            <p style="font-size: 12px; color: #94a3b8; margin: 8px 0;">${item.desc || 'تفعيل العضوية فوراً.'}</p>
            <div class="product-price">${item.price} ج.م</div>
            <button class="btn btn-primary full-width" onclick="openOrderModal('${item.name}', ${item.price}, true)">تفعيل العضوية</button>
        </div>
    `).join('');
}

function renderForSaleAccounts() {
    const parentSection = document.querySelector("#accounts .container");
    if (!parentSection) return;

    const accounts = JSON.parse(localStorage.getItem("bebo_for_sale_accounts")) || [];

    let gridDiv = document.getElementById("accountsGridDynamic");
    if (!gridDiv) {
        gridDiv = document.createElement("div");
        gridDiv.id = "accountsGridDynamic";
        gridDiv.className = "grid-products";
        parentSection.appendChild(gridDiv);
    }

    if (accounts.length === 0) {
        gridDiv.innerHTML = `<div class="empty-box" style="grid-column: 1/-1;"><p>لا توجد حسابات معروضة حاليًا، تابعنا قريبًا أو تواصل معنا عبر واتساب.</p></div>`;
    } else {
        gridDiv.innerHTML = accounts.map(acc => {
            const images = acc.images && acc.images.length > 0 ? acc.images : ['images/bebo-logo.jpg'];
            return `
                <div class="card product-card">
                    <span class="product-tag">حساب للبيع</span>
                    <div class="account-slider" style="position: relative; overflow: hidden; border-radius: 10px; margin-bottom: 12px; height: 160px; background: #000;">
                        <img src="${images[0]}" id="accImg_${acc.id}" style="width: 100%; height: 100%; object-fit: cover;">
                        ${images.length > 1 ? `
                            <button onclick="changeAccImage(${acc.id}, -1)" style="position: absolute; right: 5px; top: 45%; background: rgba(0,0,0,0.6); color: #00f2ff; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">❮</button>
                            <button onclick="changeAccImage(${acc.id}, 1)" style="position: absolute; left: 5px; top: 45%; background: rgba(0,0,0,0.6); color: #00f2ff; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">❯</button>
                        ` : ''}
                    </div>
                    <h3>${acc.title}</h3>
                    <div class="product-price">${acc.price} ج.م</div>
                    <button class="btn btn-primary full-width" onclick="openOrderModal('شراء حساب: ${acc.title}', ${acc.price}, false)">شراء الحساب</button>
                </div>
            `;
        }).join('');
    }
}

function changeAccImage(accId, dir) {
    const accounts = JSON.parse(localStorage.getItem("bebo_for_sale_accounts")) || [];
    const acc = accounts.find(a => a.id === accId);
    if (!acc || !acc.images || acc.images.length <= 1) return;

    const imgEl = document.getElementById(`accImg_${accId}`);
    let currentIndex = acc.images.indexOf(imgEl.src);
    if (currentIndex === -1) currentIndex = 0;

    let newIndex = currentIndex + dir;
    if (newIndex >= acc.images.length) newIndex = 0;
    if (newIndex < 0) newIndex = acc.images.length - 1;

    imgEl.src = acc.images[newIndex];
}

function renderReviews() {
    const container = document.getElementById("reviewsContainer");
    if (!container) return;
    const defaultReviews = [
        { name: "محمود احمد", comment: "اخونا بيبو مضمون سريع رخيص افضل العروض افضل الأسعار", stars: 5, date: "14 أكتوبر 2026" },
        { name: "علي محمد حسن", comment: "ارجل واحسن وتضمن استور في مصر بالنسبة للأسعار دي اسعار ضرب نار", stars: 5, date: "14 أكتوبر 2026" },
        { name: "نضال", comment: "بأمانه والله العظيم اجمد وأسرع وأضمن متجر انا جربته", stars: 5, date: "14 أكتوبر 2026" }
    ];
    const savedReviews = JSON.parse(localStorage.getItem("bebo_reviews")) || defaultReviews;

    container.innerHTML = savedReviews.map(rev => `
        <div class="card" style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <strong>${rev.name}</strong>
                <small style="color: #94a3b8;">${rev.date}</small>
            </div>
            <div style="color: #f59e0b; margin-bottom: 6px;">${'★'.repeat(rev.stars)}</div>
            <p style="font-size: 14px;">${rev.comment}</p>
        </div>
    `).join('');
}

function setup3DMascot() {
    const mascot = document.getElementById("mascot3D");
    if (!mascot) return;
    window.addEventListener("mousemove", (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 35;
        const y = (e.clientY / window.innerHeight - 0.5) * 35;
        mascot.style.transform = `translate(${x}px, ${y}px)`;
    });
}

function setupDrawer() {
    const drawer = document.getElementById("drawer");
    const overlay = document.getElementById("drawerOverlay");
    const openBtn = document.getElementById("openMenuBtn");
    const closeBtn = document.getElementById("closeMenuBtn");
    
    if (!drawer || !overlay) return;
    if (openBtn) openBtn.onclick = () => { drawer.classList.add("active"); overlay.classList.add("active"); };
    if (closeBtn) closeBtn.onclick = () => { drawer.classList.remove("active"); overlay.classList.remove("active"); };
    overlay.onclick = () => { drawer.classList.remove("active"); overlay.classList.remove("active"); };
}

function openOrderModal(title, price, requireId) {
    document.getElementById("itemTitle").value = title;
    document.getElementById("itemPrice").value = price;
    document.getElementById("modalTitle").innerText = `طلب: ${title}`;
    document.getElementById("modalPrice").innerText = `${price} ج.م`;
    
    const idGroup = document.getElementById("idInputGroup");
    if (!requireId) {
        idGroup.style.display = "none";
    } else {
        idGroup.style.display = "block";
    }

    document.getElementById("orderModal").classList.add("active");
}

function setupModal() {
    const modal = document.getElementById("orderModal");
    const closeBtn = document.getElementById("closeModalBtn");
    if (!modal) return;
    
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove("active");

    const form = document.getElementById("checkoutForm");
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const title = document.getElementById("itemTitle").value;
            const price = document.getElementById("itemPrice").value;
            const name = document.getElementById("custName").value;
            const id = document.getElementById("playerId").value;
            const pay = document.getElementById("paymentMethod").value;
            const whatsappNumber = getWhatsappNumber();

            let msg = `مرحباً بيبو استور 👋%0Aأرغب في شراء: *${title}*%0Aالسعر: *${price} ج.م*%0A%0A👤 الاسم: ${name}`;
            if (id && id.trim() !== "") msg += `%0A🎮 ID اللاعب: ${id}`;
            msg += `%0A💳 طريقة الدفع: ${pay}`;

            window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
            modal.classList.remove("active");
        };
    }
}

function setupStarRating() {
    const stars = document.querySelectorAll("#starInput i");
    stars.forEach(star => {
        star.onclick = () => {
            const val = parseInt(star.getAttribute("data-val"));
            stars.forEach((s, idx) => {
                if (idx < val) s.classList.add("active");
                else s.classList.remove("active");
            });
        };
    });

    const reviewForm = document.getElementById("addReviewForm");
    if (reviewForm) {
        reviewForm.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById("revName").value;
            const comment = document.getElementById("revComment").value;
            const starsActive = document.querySelectorAll("#starInput i.active").length;

            const defaultReviews = [
                { name: "محمود احمد", comment: "اخونا بيبو مضمون سريع رخيص افضل العروض افضل الأسعار", stars: 5, date: "14 أكتوبر 2026" },
                { name: "علي محمد حسن", comment: "ارجل واحسن وتضمن استور في مصر بالنسبة للأسعار دي اسعار ضرب نار", stars: 5, date: "14 أكتوبر 2026" },
                { name: "نضال", comment: "بأمانه والله العظيم اجمد وأسرع وأضمن متجر انا جربته", stars: 5, date: "14 أكتوبر 2026" }
            ];

            const savedReviews = JSON.parse(localStorage.getItem("bebo_reviews")) || defaultReviews;
            savedReviews.unshift({ id: Date.now(), name, comment, stars: starsActive, date: "الآن" });
            localStorage.setItem("bebo_reviews", JSON.stringify(savedReviews));

            alert("تم إضافة تقييمك بنجاح وسوف يظهر في المتجر!");
            e.target.reset();
            renderReviews();
        };
    }
}