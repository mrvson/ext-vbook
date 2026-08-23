// search.js — tìm kiếm qua /search?q={key} của phimmoi.film (HTML server-render)
// Contract: execute(key, page) → [{name*, link*, cover?, description?, host?}], nextPage?
load("config.js");

function execute(key, page) {
    if (!page) page = "1";

    var pageUrl = BASE_URL + "/search?q=" + encodeURIComponent(key) + "&page=" + page;

    var res = fetch(pageUrl);
    if (!res.ok) return Response.error("Search failed: " + res.status);

    var html = res.text() + "";
    var data = [];
    var seen = {};

    var re = /<a[^>]*title="([^"]+)"[^>]*href="(\/phim\/[^"#?]+)"([\s\S]{0,3000}?)<\/a>/g;
    var m;
    while ((m = re.exec(html))) {
        var name = m[1].trim();
        var href = m[2];
        var block = m[3];

        if (!href || seen[href]) continue;
        seen[href] = true;

        var cover = "";
        var im = block.match(/(?:src|data-src)="([^"]*(?:storage|phimimg|uploads)[^"]*)"/i) ||
                 block.match(/(?:src|data-src)="(https?:\/\/[^"]+\.(?:webp|jpg|jpeg|png)[^"]*)"/i);
        if (im) {
            cover = im[1];
            if (cover.indexOf("//") === 0) cover = "https:" + cover;
            else if (cover.indexOf("/") === 0) cover = BASE_URL + cover;
        }

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

    if (data.length === 0) return Response.error("Không có kết quả");

    var p = parseInt(page, 10);
    if (isNaN(p)) p = 1;
    return Response.success(data, String(p + 1));
}