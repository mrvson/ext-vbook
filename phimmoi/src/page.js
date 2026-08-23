// page.js (video) — Nhận URL detail, trả về mảng URL cho toc.js
// Mục lục lấy từ API nên page.js chỉ cần chuyển tiếp URL gốc.
load("config.js");

function execute(url) {
    var slug = apiSlugFromUrl(url);
    if (!slug) return Response.error("Không tìm thấy slug trong URL: " + url);
    return Response.success([BASE_URL + "/phim/" + slug]);
}