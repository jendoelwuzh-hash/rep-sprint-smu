// src/api/ai.js

async function fileToBase64(file) {
    const buf = await file.arrayBuffer();
    let bin = "";
    new Uint8Array(buf).forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin);
}

async function shrinkImage(file, maxSide = 1600) {
    try {
        const bmp = await createImageBitmap(file);
        const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(bmp.width * scale);
        canvas.height = Math.round(bmp.height * scale);
        canvas.getContext("2d").drawImage(bmp, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.85));
        return blob || file;
    }
    catch (e) {
        return file;
    }
}

export async function callClaude(turns, opts) {
    opts = opts || {};
    const body = {};
    if (typeof turns === "string") {
        body.messages = [{ role: "user", content: turns }];
    }
    else {
        body.system = turns[0].content;
        let rest = turns.slice(1);
        while (rest.length && rest[0].role !== "user")
            rest = rest.slice(1);
        body.messages = rest;
    }
    if (opts.images) {
        const small = await shrinkImage(opts.images);
        body.imageBase64 = await fileToBase64(small);
        body.imageType = small.type || "image/jpeg";
    }
    let r;
    try {
        r = await fetch("/api/chat", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
        });
    }
    catch (e) {
        throw { code: "network", text: "Tidak bisa terhubung ke server. Cek koneksi internet." };
    }
    if (r.status === 429)
        throw { code: "rate_limited" };
    if (r.status === 413)
        throw { code: "image_rejected" };
    if (!r.ok)
        throw { code: "network", text: "Server AI sedang bermasalah, coba lagi sebentar." };
    const data = await r.json();
    if (!data.text)
        throw { code: "empty_completion" };
    return { text: data.text };
}

export async function callVision(prompt, imageFile) {
    const small = await shrinkImage(imageFile);
    const imageBase64 = await fileToBase64(small);
    const body = { prompt, imageBase64, imageType: small.type || "image/jpeg" };
    console.log("Calling Vision API at: /api/vision");
    let r;
    try {
        r = await fetch("/api/vision", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
        });
    }
    catch (e) {
        console.error("Fetch error:", e);
        throw { code: "network", text: "Tidak bisa terhubung ke server visi." };
    }
    if (!r.ok) {
        const errText = await r.text();
        console.error("Vision API Error:", r.status, errText);
        throw { code: "network", text: "Server Visi bermasalah." };
    }
    const data = await r.json();
    return data.text;
}
