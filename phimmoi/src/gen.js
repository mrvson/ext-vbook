// gen.js (video) — danh sách phim từ HTML server-render của phimmoi.film
// Contract: execute(url, page) → [{name*, link*, cover?, description?, host?}], nextPage?
// Item block: <a title="{tên}" href="/phim/{slug}-{id}"> ... <img ... src="/storage/images/...-poster.webp">
// Badge: Vietsub/FHD + "Hoàn Tất (18/18)" hoặc "Tập xx"
load("config.js");

function execute(url, page) {
    if (!page) page = "1";

    var pageUrl = url.replace(/{{page}}/g, page);
    // Đảm bảo có ?page= khi template không chứa {{page}}
    if (pageUrl.indexOf("page=") === -1) {
        pageUrl += (pageUrl.indexOf("?") === -1 ? "?" : "&") + "page=" + page;
    }

    var res = fetch(pageUrl);
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var html = res.text() + "";

    var data = [];
    var seen = {};

    // Mỗi item: <a title="..." href="/phim/{slug}-{id}"> ... </a> chứa <img src="...">
    var re = /<a[^>]*title="([^"]+)"[^>]*href="(\/phim\/[^"#?]+)"([\s\S]{0,3000}?)<\/a>/g;
    var m;
    while ((m = re.exec(html))) {
        var name = m[1].trim();
        var href = m[2];
        var block = m[3];

        if (!href || seen[href]) continue;
        seen[href] = true;

        // Poster: src/data-src trong block (ưu tiên _next image?url= rồi tới /storage/)
        var cover = "";
        var im = block.match(/(?:src|data-src)="([^"]*(?:storage|phimimg|uploads)[^"]*)"/i) ||
                 block.match(/(?:src|data-src)="(https?:\/\/[^"]+\.(?:webp|jpg|jpeg|png)[^"]*)"/i);
        if (im) {
            cover = im[1];
            if (cover.indexOf("//") === 0) cover = "https:" + cover;
            else if (cover.indexOf("/") === 0) cover = BASE_URL + cover;
        }

        // Badge mô tả: trạng thái tập (Tập xx / Hoàn Tất (n/n)) + chất lượng
        var badges = [];
        var bre = />([^<>]{2,40})</g; var t;
        while ((t = bre.exec(block))) {
            var s = t[1].trim();
            if (!s || badges.indexOf(s) !== -1) continue;
            if (/^(?:Tập |Hoàn Tất|Full|Vietsub|Thuyết minh|Lồng tiếng|HD|FHD|SD|4K|Trailer)/i.test(s)) badges.push(s);
        }

        data.push({
            name: name,
            link: BASE_URL + href,
            cover: cover,
            description: badges.join(" · "),
            host: BASE_URL
        });
    }

    if (data.length === 0) return Response.error("Không tìm thấy phim nào");

    return Response.success(data, String(parseInt(page, 10) + 1));
}