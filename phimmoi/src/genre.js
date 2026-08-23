// genre.js — danh sách thể loại từ menu của phimmoi.film
// Contract: execute() → [{ title, input, script }]
load("config.js");

function execute() {
    var res = fetch(BASE_URL + "/");
    if (!res.ok) return Response.error("Cannot load: " + res.status);

    var html = res.text() + "";
    var genres = [];
    var seen = {};

    var re = /href="(\/the-loai\/[^"#?]+)"[^>]*>([^<]{1,50})</g;
    var m;
    while ((m = re.exec(html))) {
        var href = m[1];
        var title = m[2].trim();
        if (!title || seen[href]) continue;
        seen[href] = 1;
        genres.push({
            title: title,
            input: BASE_URL + href + "?page={{page}}",
            script: "gen.js"
        });
    }

    if (genres.length === 0) return Response.error("Không tìm thấy thể loại");
    return Response.success(genres);
}