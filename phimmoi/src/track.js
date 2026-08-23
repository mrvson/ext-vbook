// track.js — Xử lý data (URL stream server / iframe) từ chap.js thành luồng cho player
// Contract: execute(url) → { data*, type*, headers?:Object, host?:string, timeSkip?:[{startTime, endTime}] }
// LƯU Ý: url vào là link m3u8 của CDN bên ngoài (kkphimplayer/streamvsmov) →
// KHÔNG được rewrite domain về BASE_URL, giữ nguyên URL gốc.
load('config.js');

function execute(url) {
    // Link m3u8/mp4 trực tiếp → native player
    if (url.indexOf(".mp4") !== -1 || url.indexOf(".m3u8") !== -1 || url.indexOf(".m3u9") !== -1) {
        return Response.success({
            data: url,
            type: "native",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
            },
            host: BASE_URL,
            timeSkip: []
        });
    }

    // Link iframe nhúng → WebView tự bắt stream
    return Response.success({
        data: url,
        type: "auto",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            "Referer": BASE_URL + "/"
        },
        host: BASE_URL,
        timeSkip: []
    });
}