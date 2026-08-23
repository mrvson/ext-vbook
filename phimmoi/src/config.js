let BASE_URL = "https://phimmoi.film";
try { if (CONFIG_URL) BASE_URL = CONFIG_URL; } catch (e) {}

// Public API của hệ sinh thái KKPhim/OPhim mà phimmoi.film sử dụng.
// Trả JSON đầy đủ: movie info + episodes[].server_data[] có sẵn link_m3u8.
let API_BASE = "https://phimapi.com";

/**
 * URL phim trên site: /phim/{slug}-{id} → slug API là phần bỏ đuôi -số.
 * VD: /phim/hoa-khai-cam-tu-1786276909 → hoa-khai-cam-tu
 */
function apiSlugFromUrl(url) {
    var m = (url + "").match(/\/phim\/([^\/\?#]+)/);
    if (!m) return null;
    return m[1].replace(/-\d+$/, "");
}

/** Gọi API phimapi cho 1 slug, trả object {movie, episodes} hoặc null */
function fetchMovie(slug) {
    var res = fetch(API_BASE + "/phim/" + slug, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    try {
        var j = res.json();
        if (!j || !j.movie) return null;
        return j;
    } catch (e) { return null; }
}