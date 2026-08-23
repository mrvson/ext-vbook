// home.js (video) — các danh sách phim chủ lực của phimmoi.film
// Contract: execute() → [{ title, input, script }]
load("config.js");

function execute() {
    return Response.success([
        { title: "Phim Bộ", input: BASE_URL + "/danh-sach/phim-bo?page={{page}}", script: "gen.js" },
        { title: "Phim Lẻ", input: BASE_URL + "/danh-sach/phim-le?page={{page}}", script: "gen.js" },
        { title: "Phim Chiếu Rạp", input: BASE_URL + "/danh-sach/phim-chieu-rap?page={{page}}", script: "gen.js" },
        { title: "Phim Thuyết Minh", input: BASE_URL + "/danh-sach/phim-thuyet-minh?page={{page}}", script: "gen.js" },
        { title: "Phim Lồng Tiếng", input: BASE_URL + "/danh-sach/phim-long-tieng?page={{page}}", script: "gen.js" },
        { title: "Phim Hot Tuần", input: BASE_URL + "/danh-sach/phim-hot-tuan?page={{page}}", script: "gen.js" },
        { title: "Phim Hot Tháng", input: BASE_URL + "/danh-sach/phim-hot-thang?page={{page}}", script: "gen.js" }
    ]);
}