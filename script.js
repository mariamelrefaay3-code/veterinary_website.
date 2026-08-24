// =====================================================
// SUPER SEARCH & FILTER - INTEGRATED
// =====================================================

(function () {

    // 1. دالة تنظيف النص وتوحيد شكل الحروف
    function normalizeSearch(text) {
        return String(text || "")
            .toLowerCase()
            .trim()
            .replace(/[أإآ]/g, "ا")
            .replace(/ة/g, "ه")
            .replace(/ى/g, "ي")
            .replace(/\s+/g, " ");
    }

    // 2. دالة البحث الرئيسية والتوجيه بين الصفحات
    async function searchEverything() {
        const input = document.getElementById("searchInput");
        if (!input) return;

        const original = input.value.trim();
        if (!original) return;

        const query = normalizeSearch(original);
        const pages = ["products.html", "food.html"];

        for (const page of pages) {
            try {
                const response = await fetch(page);
                if (!response.ok) continue;

                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, "text/html");
                const pageText = normalizeSearch(doc.body.textContent || "");

                // إذا وُجد النص في محتوى الصفحة، يتم الانتقال إليها حاملة كلمة البحث
                if (pageText.includes(query)) {
                    window.location.href = ${page}?search=${encodeURIComponent(original)};
                    return;
                }
            } catch (e) {
                console.error("Page Search Error:", e);
            }
        }

        // إظهار رسالة عدم العثور على المنتجات في حال عدم وجود نتائج
        showNotFound();
    }

    // دالة عرض رسالة "لم يتم العثور"
    function showNotFound() {
        const result = document.getElementById("searchResult");
        if (result) {
            result.innerHTML = `
                <div class="search-not-found" style="text-align: center; padding: 20px;">
                    <h3>لم يتم العثور على هذا المنتج</h3>
                    <p>جربي كتابة اسم المنتج بطريقة مختلفة</p>
                </div>
            `;
        } else {
            alert("لم يتم العثور على هذا المنتج");
        }
    }

    // 3. قراءة معلمة البحث عند تحميل الصفحة وتطبيق الفلترة على العناصر المعروضة
    function handlePageSearchOnLoad() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');

        if (!searchQuery) return;

        // وضع النص المبحوث عنه داخل الخانة
        const input = document.getElementById("searchInput");
        if (input) {
            input.value = searchQuery;
        }

        const normalizedQuery = normalizeSearch(searchQuery);

        // افتراض أن بطاقات المنتجات تستخدم الكلاس .product-card وتمر على العناوين .product-title
        const productCards = document.querySelectorAll(".product-card");
        let hasMatches = false;

        if (productCards.length > 0) {
            productCards.forEach((card) => {
                const titleElement = card.querySelector(".product-title") || card;
                const cardText = normalizeSearch(titleElement.textContent);

                if (cardText.includes(normalizedQuery)) {
                    card.style.display = ""; // إظهار المنتج
                    hasMatches = true;
                } else {
                    card.style.display = "none"; // إخفاء المنتج
                }
            });

            if (!hasMatches) {
                showNotFound();
            }
        }
    }

    // 4. ربط الأحداث (Event Listeners)
    document.addEventListener("DOMContentLoaded", handlePageSearchOnLoad);

    // حدث الضغط على زر البحث
    document.addEventListener("click", function (event) {
        const button = event.target.closest(".search-mini button, #searchButton");
        if (!button) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        searchEverything();
    }, true);

    // حدث الضغط على Enter
    document.
    addEventListener("keydown", function (event) {
        if (event.key !== "Enter") return;

        const input = document.getElementById("searchInput");
        if (!input || document.activeElement !== input) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        searchEverything();
    }, true);

})();