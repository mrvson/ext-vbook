// chap.js — lấy stream (m3u8) cho 1 tập
// Contract: execute(url) → [{ title*, data* }]
// url vào: BASE_URL + "/phim/{apiSlug}/k-{epSlug}"
// → gọi API phimapi, tìm tập theo slug, trả link_m3u8 (nếu có) hoặc link_embed
load("config.js");

function execute(url) {
    var m = (url + "").match(/\/phim\/([^\/\?#]+)(?:\/k-([^\/\?#]+))?/);
    if (!m) return Response.error("Không phân tích được URL: " + url);
    var slug = m[1].replace(/-\d+$/, "");
    var epSlug = m[2] || null;

    var j = fetchMovie(slug);
    if (!j || !j.episodes) return Response.error("API không trả dữ liệu cho: " + slug);

    var tracks = [];

    j.episodes.forEach(function (server) {
        (server.server_data || []).forEach(function (ep) {
            // Nếu URL chỉ định tập thì lọc đúng tập; nếu không (phim lẻ) lấy tất cả
            if (epSlug && ep.slug !== epSlug) return;

            var streamUrl = (ep.link_m3u8 || "") + "";
            if (!streamUrl) {
                // Fallback: link_embed dạng player.phimapi.com/player/?url={m3u8}
                var em = ((ep.link_embed || "") + "").match(/url=([^&]+)/);
                if (em) streamUrl = decodeURIComponent(em[1]);
            }
            if (!streamUrl) return;

            tracks.push({
                title: (j.episodes.length > 1 && server.server_name ? server.server_name + " · " : "") + "m3u8",
                data: streamUrl
            });
        });
    });

    if (tracks.length === 0) return Response.error("Không tìm thấy stream cho tập này");
    return Response.success(tracks);
}