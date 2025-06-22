// Serverless function yang akan bertindak sebagai backend aman.
// IMPORTANT: This file should be placed inside an 'api' folder in your project root.
// For example: /api/apigemini.js

export default async function handler(req, res) {
    // Hanya izinkan metode POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // Ambil API Key dari environment variable yang aman di server
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "API Key tidak dikonfigurasi di server." });
    }

    try {
        const model = "gemini-1.5-flash-latest";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        // Teruskan payload dari frontend ke Google API
        const googleResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body) // req.body berisi { contents: [{ parts: [...] }] }
        });

        // Tangani jika respons dari Google tidak berhasil
        if (!googleResponse.ok) {
            const errorBody = await googleResponse.text();
            console.error("Google API Error:", errorBody);
            // Kembalikan status error dan pesan dari Google ke frontend
            return res.status(googleResponse.status).json({ 
                error: `Google API error: ${googleResponse.statusText}`,
                details: errorBody 
            });
        }

        const data = await googleResponse.json();

        // Kirim kembali respons yang berhasil dari Google ke frontend
        res.status(200).json(data);

    } catch (error) {
        console.error('Internal Server Error:', error);
        res.status(500).json({ error: "Terjadi kesalahan internal di server." });
    }
}
