// detail.js — thông tin phim từ API phimapi.com (hệ sinh thái KKPhim của phimmoi.film)
// Contract: execute(url) → { name*, cover, host, author, description, ongoing:bool*, genres? }
load("config.js");

function execute(url) {
    var slug = apiSlugFromUrl(url);
    if (!slug) return Response.error("Không tìm thấy slug trong URL: " + url);

    var j = fetchMovie(slug);
    if (!j) return Response.error("API không trả dữ liệu cho: " + slug);

    var mv = j.movie;

    // Ưu tiên poster (dọc); fallback thumb
    var cover = (mv.poster_url || mv.thumb_url || "") + "";

    // Nội dung: API trả text thuần hoặc HTML
    var description = (mv.content || "") + "";
    var originName = (mv.origin_name || "") + "";
    var meta = [];
    if ((mv.time || "") + "") meta.push(mv.time + "");
    if ((mv.quality || "") + "") meta.push(mv.quality + "");
    if ((mv.lang || "") + "") meta.push(mv.lang + "");
    if (originName && meta.length) description = "<p>" + originName + " — " + meta.join(" · ") + "</p>" + description;
    else if (originName) description = "<p>" + originName + "</p>" + description;

    // status: ongoing | completed
    var ongoing = ((mv.status || "") + "").indexOf("ongoing") !== -1;

    // Thể loại + quốc gia → link trang listing tương ứng trên phimmoi.film
    var genres = [];
    (mv.category || []).forEach(function (c) {
        if (c && c.slug && c.name) {
            genres.push({
                title: c.name + "",
                input: BASE_URL + "/the-loai/" + c.slug + "?page={{page}}",
                script: "gen.js"
            });
        }
    });
    (mv.country || []).forEach(function (c) {
        if (c && c.slug && c.name) {
            genres.push({
                title: c.name + "",
                input: BASE_URL + "/quoc-gia/" + c.slug + "?page={{page}}",
                script: "gen.js"
            });
        }
    });

    return Response.success({
        name: (mv.name || "") + "",
        cover: cover,
        host: BASE_URL,
        author: originName,
        description: description,
        ongoing: ongoing,
        genres: genres
    });
}