// toc.js — danh sách tập từ API phimapi.com
// Contract: execute(url) → [{ name*, url*, host? }] (hỗ trợ {type:"section"} khi có nhiều server)
// url vào: BASE_URL + "/phim/{apiSlug}" (từ page.js)
// Chapter URL ra: BASE_URL + "/phim/{apiSlug}/k-{epSlug}" (khớp format trang xem của site, VD /k-tap-01)
load("config.js");

function execute(url) {
    var m = (url + "").match(/\/phim\/([^\/\?#]+)/);
    if (!m) return Response.error("Không tìm thấy slug trong URL: " + url);
    var slug = m[1].replace(/-\d+$/, "");

    var j = fetchMovie(slug);
    if (!j || !j.episodes || j.episodes.length === 0) {
        return Response.error("Không có dữ liệu tập phim");
    }

    var multiServer = j.episodes.length > 1;
    var chapters = [];

    j.episodes.forEach(function (server) {
        if (multiServer && server.server_name) {
            chapters.push({ name: server.server_name + "", type: "section" });
        }
        (server.server_data || []).forEach(function (ep) {
            if (!ep.slug) return;
            chapters.push({
                name: (ep.name || ep.slug) + "",
                url: BASE_URL + "/phim/" + slug + "/k-" + ep.slug,
                host: BASE_URL
            });
        });
    });

    if (chapters.length === 0) return Response.error("Không có tập nào");
    return Response.success(chapters);
}