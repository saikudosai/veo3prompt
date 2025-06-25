// Prompt Generator - Versi 1.1.0
// Disimpan pada: Senin, 23 Juni 2025

// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENT SELECTORS (Grouped for clarity) ---

    // General UI
    const coinCountEl = document.getElementById('coinCount');
    const addCoinBtn = document.getElementById('addCoinBtn');
    const noCoinsNotification = document.getElementById('noCoinsNotification');
    
    // Modals and their controls
    const guideBtn = document.getElementById('guideBtn');
    const guideModal = document.getElementById('guideModal');
    const closeGuideBtn = document.getElementById('closeGuideBtn');
    const openCharacterCreatorBtn = document.getElementById('openCharacterCreatorBtn');
    const characterCreatorModal = document.getElementById('characterCreatorModal');
    const closeCharacterCreatorBtn = document.getElementById('closeCharacterCreatorBtn');
    const loadCharacterModal = document.getElementById('loadCharacterModal');
    const closeLoadCharacterBtn = document.getElementById('closeLoadCharacterBtn');
    const characterList = document.getElementById('characterList');

    // --- Scene Mode Selectors ---
    const singleSceneBtn = document.getElementById('singleSceneBtn');
    const conversationSceneBtn = document.getElementById('conversationSceneBtn');
    const singleSceneModeContainer = document.getElementById('singleSceneModeContainer');
    const conversationSceneModeContainer = document.getElementById('conversationSceneModeContainer');
    const sceneCharactersList = document.getElementById('sceneCharactersList');
    const addSceneCharacterBtn = document.getElementById('addSceneCharacterBtn');
    const dialogueEditor = document.getElementById('dialogueEditor');
    const addDialogueLineBtn = document.getElementById('addDialogueLineBtn');

    // Manual Prompt Form
    const inputs = {
        subjek: document.getElementById('subjek'),
        aksi: document.getElementById('aksi'),
        ekspresi: document.getElementById('ekspresi'),
        tempat: document.getElementById('tempat'),
        waktu: document.getElementById('waktu'),
        sudutKamera: document.getElementById('sudutKamera'),
        kamera: document.getElementById('kamera'),
        pencahayaan: document.getElementById('pencahayaan'),
        style: document.getElementById('style'),
        suasana: document.getElementById('suasana'),
        backsound: document.getElementById('backsound'),
        kalimat: document.getElementById('kalimat'),
        detail: document.getElementById('detail'),
    };
    const generateBtn = document.getElementById('generateBtn');
    const saveCharacterBtn = document.getElementById('saveCharacterBtn');
    const loadCharacterBtn = document.getElementById('loadCharacterBtn');
    
    // Prompt Output & Actions
    const promptIndonesia = document.getElementById('promptIndonesia');
    const promptEnglish = document.getElementById('promptEnglish');
    const copyBtnId = document.getElementById('copyBtnId');
    const copyBtnEn = document.getElementById('copyBtnEn');
    const openGeminiIdBtn = document.getElementById('openGeminiIdBtn');
    const openGeminiEnBtn = document.getElementById('openGeminiEnBtn');
    const fixPromptIdBtn = document.getElementById('fixPromptIdBtn');
    const fixPromptEnBtn = document.getElementById('fixPromptEnBtn');

    // Single Image Description Elements
    const imageUploadInput = document.getElementById('imageUploadInput');
    const imagePreview = document.getElementById('imagePreview');
    const imageUploadIcon = document.getElementById('imageUploadIcon');
    const imageUploadContainer = document.getElementById('imageUploadContainer');
    const describeSubjectBtn = document.getElementById('describeSubjectBtn');
    const describePlaceBtn = document.getElementById('describePlaceBtn');

    // Character Creator Modal Elements
    const createCharacterBtn = document.getElementById('createCharacterBtn');
    const characterStyleSelect = document.getElementById('characterStyle');
    const characterUploads = {
        face: {
            input: document.getElementById('input-face'),
            preview: document.getElementById('preview-face'),
            icon: document.getElementById('icon-face'),
            container: document.getElementById('upload-container-face')
        },
        clothing: {
            input: document.getElementById('input-clothing'),
            preview: document.getElementById('preview-clothing'),
            icon: document.getElementById('icon-clothing'),
            container: document.getElementById('upload-container-clothing')
        },
        accessories: {
            input: document.getElementById('input-accessories'),
            preview: document.getElementById('preview-accessories'),
            icon: document.getElementById('icon-accessories'),
            container: document.getElementById('upload-container-accessories')
        }
    };
    
    // --- STATE MANAGEMENT ---
    let coins = 0;
    let isWaitingForAdReward = false;
    let adOpenedTime = null;
    let singleUploadedImageData = null; 
    let characterImageData = { face: null, clothing: null, accessories: null };
    let currentSceneMode = 'single';
    let selectedCharacters = [];
    let dialogueLines = [];


    // --- COIN SYSTEM ---
    function saveCoins() {
        localStorage.setItem('userVeoCoins', coins);
    }

    function updateButtonState() {
        if (generateBtn.disabled) return;
        generateBtn.textContent = (coins < 1) ? 'Koin Habis' : 'Generate Prompt';
        if (createCharacterBtn) {
            if (coins < 3) {
                 createCharacterBtn.textContent = 'Koin Kurang (Butuh 3)';
                 createCharacterBtn.disabled = true;
            } else {
                 createCharacterBtn.textContent = 'Buat Karakter & Isi Subjek';
                 createCharacterBtn.disabled = !characterImageData.face;
            }
        }
    }

    function updateCoinDisplay() {
        coinCountEl.textContent = coins;
        updateButtonState();
    }

    function loadCoins() {
        const savedCoins = localStorage.getItem('userVeoCoins');
        coins = (savedCoins === null) ? 5 : parseInt(savedCoins, 10);
        saveCoins();
        updateCoinDisplay();
    }

    function handleAddCoinClick() {
        if (isWaitingForAdReward) return;
        
        isWaitingForAdReward = true;
        adOpenedTime = Date.now();
        noCoinsNotification.classList.add('hidden');
        
        addCoinBtn.disabled = true;
        addCoinBtn.title = 'Tunggu 5 detik di tab baru, lalu kembali untuk mendapatkan koin';
        addCoinBtn.textContent = '...';

        window.open('https://shopee.co.id/-PROMO-MURAH-Celana-Cargo-Panjang-Pria-Dewasa-Bahan-Adem-Tidak-Panas-Nyaman-Untuk-Sehari-Bekerja-i.102427008.29765835450', '_blank');
    }

    function handleWindowFocus() {
        if (isWaitingForAdReward && adOpenedTime) {
            const timeElapsed = Date.now() - adOpenedTime;
            const requiredTime = 5000;

            isWaitingForAdReward = false;
            adOpenedTime = null;
            
            addCoinBtn.disabled = false;
            addCoinBtn.title = 'Tambah 5 Koin';
            addCoinBtn.textContent = '+';

            if (timeElapsed >= requiredTime) {
                coins += 5;
                saveCoins();
                updateCoinDisplay();

                const coinContainer = coinCountEl.parentElement;
                coinContainer.classList.add('bg-green-600', 'transition-colors', 'duration-300');
                setTimeout(() => coinContainer.classList.remove('bg-green-600'), 1500);
            }
        }
    }

    // --- UI & UTILITY FUNCTIONS ---
    function showCopyFeedback(button, text = 'Berhasil Disalin!') {
        const originalText = button.textContent;
        const originalColorClasses = Array.from(button.classList).filter(c => c.startsWith('bg-') || c.startsWith('hover:bg-'));
        button.textContent = text;
        button.classList.remove(...originalColorClasses);
        button.classList.add('bg-green-600', 'hover:bg-green-700');
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('bg-green-600', 'hover:bg-green-700');
            button.classList.add(...originalColorClasses);
        }, 2000);
    }
    
    function fallbackCopyText(textarea, button, feedbackText = 'Berhasil Disalin!') {
        textarea.select();
        textarea.setSelectionRange(0, 99999);
        try {
            document.execCommand('copy');
            showCopyFeedback(button, feedbackText);
        } catch (err) {
            console.error('Fallback: Gagal menyalin', err);
        }
    }

    function copyText(textarea, button) {
        const promptText = textarea.value.trim();
        if (!promptText) return;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(promptText).then(() => showCopyFeedback(button)).catch(() => fallbackCopyText(textarea, button));
        } else {
           fallbackCopyText(textarea, button);
        }
    }

    function openInGemini(textarea, button) {
        const promptText = textarea.value.trim();
        const geminiUrl = `https://gemini.google.com/app`;
        if (promptText) {
             if (navigator.clipboard) {
                navigator.clipboard.writeText(promptText).then(() => {
                    showCopyFeedback(button, 'Disalin!');
                    window.open(geminiUrl, '_blank');
                }).catch(() => fallbackCopyText(textarea, button, 'Disalin!'));
            } else {
                fallbackCopyText(textarea, button, 'Disalin!');
            }
        }
        window.open(geminiUrl, '_blank');
    }
    
    function flashButtonText(button, message, duration = 2000) {
        if (button.dataset.isFlashing) return;

        const originalText = button.textContent;
        button.dataset.isFlashing = 'true';
        button.textContent = message;

        setTimeout(() => {
            button.textContent = originalText;
            delete button.dataset.isFlashing;
        }, duration);
    }


    // --- GEMINI API INTEGRATION ---
    async function callGeminiAPI(instruction, imageDataArray = []) {
        const parts = [{ text: instruction }];
        imageDataArray.forEach(imgData => {
            if (imgData) {
                parts.push({ inline_data: { mime_type: imgData.type, data: imgData.data } });
            }
        });
        
        const apiUrl = `/api/apigemini`;
        const payload = { contents: [{ parts: parts }] };
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Backend API Error Response:", errorBody);
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
            return text.replace(/```json/g, '').replace(/```/g, '').trim();
        } else {
            console.log("No valid response text found, full response:", result);
            throw new Error("Invalid or empty response structure from API.");
        }
    }

    // --- ACTION HANDLERS ---
    const allActionButtons = [generateBtn, fixPromptIdBtn, fixPromptEnBtn, describeSubjectBtn, describePlaceBtn, createCharacterBtn, saveCharacterBtn, loadCharacterBtn];
    function setActionsDisabled(disabled) {
        allActionButtons.forEach(btn => { if(btn) btn.disabled = disabled; });
        if (!disabled) {
            if(describeSubjectBtn) describeSubjectBtn.disabled = !singleUploadedImageData;
            if(describePlaceBtn) describePlaceBtn.disabled = !singleUploadedImageData;
            if (createCharacterBtn) createCharacterBtn.disabled = !characterImageData.face;
            updateButtonState();
        }
    }

    async function handleApiInteraction(button, cost, apiFunction) {
        if (coins < cost) {
            noCoinsNotification.classList.remove('hidden');
            setTimeout(() => noCoinsNotification.classList.add('hidden'), 3000);
            return;
        }
        const originalButtonText = button.textContent;
        setActionsDisabled(true);
        button.textContent = 'Memproses...';
        coins -= cost;
        saveCoins();
        updateCoinDisplay();
        try {
            await apiFunction();
        } catch (error) {
            console.error("API Interaction Error:", error);
            alert("Terjadi kesalahan saat memproses permintaan. Lihat console untuk detail.");
            coins += cost; // Refund coins on failure
            saveCoins();
            updateCoinDisplay();
        } finally {
            setActionsDisabled(false);
            button.textContent = originalButtonText;
        }
    }
    
    // --- SCENE MODE LOGIC ---
    function switchSceneMode(mode) {
        currentSceneMode = mode;
        if (mode === 'single') {
            singleSceneModeContainer.classList.remove('hidden');
            conversationSceneModeContainer.classList.add('hidden');
            singleSceneBtn.classList.replace('bg-gray-600', 'bg-indigo-600');
            singleSceneBtn.classList.replace('hover:bg-gray-700', 'hover:bg-indigo-700');
            conversationSceneBtn.classList.replace('bg-indigo-600', 'bg-gray-600');
            conversationSceneBtn.classList.replace('hover:bg-indigo-700', 'hover:bg-gray-700');
            inputs.kalimat.parentElement.classList.remove('hidden');

        } else if (mode === 'conversation') {
            singleSceneModeContainer.classList.add('hidden');
            conversationSceneModeContainer.classList.remove('hidden');
            conversationSceneBtn.classList.replace('bg-gray-600', 'bg-indigo-600');
            conversationSceneBtn.classList.replace('hover:bg-gray-700', 'hover:bg-indigo-700');
            singleSceneBtn.classList.replace('bg-indigo-600', 'bg-gray-600');
            singleSceneBtn.classList.replace('hover:bg-indigo-700', 'hover:bg-gray-700');
            inputs.kalimat.parentElement.classList.add('hidden');
        }
    }

    // --- MANUAL PROMPT LOGIC ---
    // [MODIFIED] Function now generates prompts for both modes.
    function generateIndonesianPrompt() {
        if (currentSceneMode === 'conversation') {
            const sceneContextParts = [
                inputs.tempat.value.trim() ? `di ${inputs.tempat.value.trim()}` : '',
                inputs.waktu.value.trim() ? `saat ${inputs.waktu.value.trim()}`: '',
                inputs.pencahayaan.value.trim() ? `dengan pencahayaan ${inputs.pencahayaan.value.trim()}`: '',
                inputs.suasana.value.trim() ? `suasana ${inputs.suasana.value.trim()}`: '',
            ].filter(Boolean);
            const sceneContext = sceneContextParts.length > 0 ? `// --- Scene Context ---\n${sceneContextParts.join(', ')}` : '';

            const charactersBlock = selectedCharacters.length > 0 ? `// --- Characters in Scene ---\n${selectedCharacters.map(c => c.description).join('\n')}` : '';

            const dialogueBlock = dialogueLines.length > 0 ? `// --- Dialogue ---\n${dialogueLines.map(d => `${d.speaker || 'N/A'}: "${d.line || ''}" ${d.tone ? `(${d.tone})` : ''}`.trim()).join('\n')}` : '';
            
            const promptParts = [
                inputs.style.value,
                inputs.sudutKamera.value,
                inputs.kamera.value,
                sceneContext,
                charactersBlock,
                dialogueBlock,
                inputs.backsound.value.trim() ? `// --- Audio ---\ndengan suara ${inputs.backsound.value.trim()}` : '',
                inputs.detail.value
            ];

            return promptParts.filter(part => part && part.trim()).join(',\n');
        }
        
        // --- Single Scene Logic (Unchanged) ---
        const subjectValue = inputs.subjek.value.trim();
        if (subjectValue.includes('// MASTER PROMPT / CHARACTER SHEET')) {
            const promptParts = [
                inputs.style.value,
                inputs.sudutKamera.value,
                inputs.kamera.value,
                subjectValue,
                inputs.aksi.value.trim() ? `// --- Action/Scene ---\n${inputs.aksi.value.trim()}` : '',
                inputs.ekspresi.value.trim() ? `dengan ekspresi ${inputs.ekspresi.value.trim()}` : '',
                inputs.tempat.value.trim() ? `di ${inputs.tempat.value.trim()}` : '',
                inputs.waktu.value.trim() ? `saat ${inputs.waktu.value.trim()}`: '',
                inputs.pencahayaan.value.trim() ? `dengan pencahayaan ${inputs.pencahayaan.value.trim()}`: '',
                inputs.suasana.value.trim() ? `suasana ${inputs.suasana.value.trim()}`: '',
                inputs.backsound.value.trim() ? `dengan suara ${inputs.backsound.value.trim()}` : '',
                inputs.kalimat.value.trim() ? `mengucapkan kalimat: "${inputs.kalimat.value.trim()}"` : '',
                inputs.detail.value
            ];
            return promptParts.filter(part => part && part.trim()).join(',\n');
        }

        let sceneDescription = `sebuah adegan tentang ${subjectValue || 'seseorang'}`;
        const action = inputs.aksi.value.trim();
        const expression = inputs.ekspresi.value.trim();
        if (action && expression) {
            sceneDescription += ` yang sedang ${action} dengan ekspresi ${expression}`;
        } else if (action) {
            sceneDescription += ` yang sedang ${action}`;
        } else if (expression) {
            sceneDescription += ` dengan ekspresi ${expression}`;
        }

        const place = inputs.tempat.value.trim();
        if (place) {
            sceneDescription += ` di ${place}`;
        }
        
        const time = inputs.waktu.value.trim();
        if (time) {
            sceneDescription += ` saat ${time}`;
        }
        
        const promptParts = [
            inputs.style.value,
            inputs.sudutKamera.value,
            inputs.kamera.value,
            sceneDescription,
            inputs.pencahayaan.value.trim() ? `dengan pencahayaan ${inputs.pencahayaan.value.trim()}`: '',
            inputs.suasana.value.trim() ? `suasana ${inputs.suasana.value.trim()}`: '',
            inputs.backsound.value.trim() ? `dengan suara ${inputs.backsound.value.trim()}` : '',
            inputs.kalimat.value.trim() ? `mengucapkan kalimat: "${inputs.kalimat.value.trim()}"` : '',
            inputs.detail.value
        ];

        return promptParts.filter(part => part && part.trim()).join(', ');
    }
    
    function createAndTranslatePrompt() {
        handleApiInteraction(generateBtn, 1, async () => {
            const indonesianPrompt = generateIndonesianPrompt();
            promptIndonesia.value = indonesianPrompt;
            promptEnglish.value = 'Menerjemahkan...';
            if (!indonesianPrompt) {
                promptEnglish.value = '';
                return;
            }
            const instruction = `Translate the following creative video prompt from Indonesian to English. Keep the structure and comma separation. Be concise and direct. Respond only with the translated prompt. Text to translate: "${indonesianPrompt}"`;
            promptEnglish.value = await callGeminiAPI(instruction);
        });
    }

    // --- SINGLE IMAGE DESCRIPTION LOGIC ---
    function handleSingleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.classList.remove('hidden');
            imageUploadIcon.classList.add('hidden');
            singleUploadedImageData = { type: file.type, data: e.target.result.split(',')[1] };
            describeSubjectBtn.disabled = false;
            describePlaceBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
    
    function describeSingleImage(type) {
        if (!singleUploadedImageData) {
            alert("Silakan unggah gambar pada bagian 'Deskripsikan dari Gambar' terlebih dahulu.");
            return;
        }
        const button = type === 'subject' ? describeSubjectBtn : describePlaceBtn;
        handleApiInteraction(button, 1, async () => {
            const instruction = type === 'subject'
                ? "Analisis secara spesifik hanya orang/subjek utama dalam gambar ini. Abaikan sepenuhnya latar belakang atau tempat. Berikan deskripsi mendetail dalam Bahasa Indonesia yang mencakup detail wajah, warna dan gaya rambut, pakaian dan aksesoris, warna kulit, dan perkiraan usia. Gabungkan semuanya menjadi satu frasa deskriptif yang kohesif. Balas HANYA dengan frasa deskriptif ini, tanpa teks atau format lain."
                : "Anda adalah seorang prompt engineer. Analisis gambar ini dan buatlah deskripsi prompt yang sinematik untuk latar belakangnya dalam Bahasa Indonesia. Fokus pada suasana, elemen visual kunci, dan mood. Abaikan orang atau subjek utama. Balas HANYA dengan deskripsi prompt ini, tanpa teks pembuka.";
            const description = await callGeminiAPI(instruction, [singleUploadedImageData]);
            const targetInput = type === 'subject' ? inputs.subjek : inputs.tempat;
            targetInput.value = description;
        });
    }

    // --- CUSTOM CHARACTER CREATOR LOGIC ---
    function handleCharacterImageUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            characterUploads[type].preview.src = e.target.result;
            characterUploads[type].preview.classList.remove('hidden');
            characterUploads[type].icon.classList.add('hidden');
            characterImageData[type] = { type: file.type, data: e.target.result.split(',')[1] };
            if (createCharacterBtn) createCharacterBtn.disabled = !characterImageData.face;
        };
        reader.readAsDataURL(file);
    }

    function createCharacterDescription() {
        if (!characterImageData.face) {
            alert("Silakan unggah foto Wajah terlebih dahulu di dalam pop-up.");
            return;
        }
        
        handleApiInteraction(createCharacterBtn, 3, async () => {
            const characterName = prompt("Masukkan nama untuk karakter ini:", "Karakter Baru");
            if (!characterName) {
                coins += 3;
                saveCoins();
                updateCoinDisplay();
                console.log("Pembuatan karakter dibatalkan.");
                return;
            }

            const apiPromises = [];
            const selectedStyle = characterStyleSelect.value;
            
            const hairInstruction = `Deskripsikan rambut dengan sangat detail, pecah ke dalam kategori berikut:
- **Warna Rambut:** Warna Rambut (jika warnanya tidak alami tambahkan imbuhan diwarnai).
- **Tekstur & Pola Rambut:** Tipe Rambut (lurus, bergelombang, ikal, keriting), Detail Tekstur (gelombang longgar/rapat, ikal spiral/besar), Kondisi Helai (tebal/tipis), Kehalusan/Kekusutan (halus, frizzy, flyaways).
- **Panjang & Potongan Rambut:** Panjang Keseluruhan (sebatas dagu (sekitar 15-25 cm), sebahu (sekitar 25-40 cm), sebatas punggung tengah (sekitar 40-60 cm), sangat panjang (lebih dari 60 cm)), Gaya Potongan/Haircut (bob, pixie, bixie, undercut, comma hair, two block, layer, blunt cut, shaggy), Poni (poni depan, curtain bangs).
- **Gaya & Penataan Rambut:** Penataan (tergerai, ekor kuda, dikepang), Belahan Rambut (tengah, samping), dan Aksesori (jepit, bando).
- **Kesan & Karakteristik Unik:** Volume (tebal/kempes), Kilau (berkilau/kusam), dan Detail lain (uban, ujung berwarna).`;
            
            let vibeInstruction;
            let styleGuideline = "";
            if (selectedStyle === 'Fiksi') {
                vibeInstruction = `- "vibe": berikan deskripsi kesan atau "vibe" keseluruhan, dan tambahkan kata yang mengandung unsur fantasi (contoh: mystical, ethereal, otherworldly).`;
            } else { 
                vibeInstruction = `- "vibe": berikan deskripsi kesan atau "vibe" keseluruhan, dan pastikan TIDAK ADA kata yang mengandung unsur fantasi (contoh: professional, casual, sporty).`;
                styleGuideline = `PENTING: Untuk semua deskripsi, gunakan gaya bahasa yang harfiah, objektif, dan apa adanya seperti laporan identifikasi. Hindari penggunaan metafora, perumpamaan, atau bahasa puitis.`;
            }
            
            const faceInstruction = `Berdasarkan gambar wajah yang diunggah, analisis dan kembalikan sebuah objek JSON. Balas HANYA dengan objek JSON, tanpa teks atau format lain.
${styleGuideline}
Objek JSON harus memiliki kunci-kunci berikut: "identity", "demeanor", "vibe", "face_shape", "eyes", "nose", "lips", "hair", "skin", "facial_hair".
- "identity": berikan deskripsi yang berisi jenis kelamin, perkiraan usia, dan asal negara/etnis (Contoh: "Seorang pria berusia 25 tahun dari Korea").
- "face_shape": berikan deskripsi yang mencakup bentuk wajah secara keseluruhan (oval, bulat, dll.), dahi, bentuk pipi, garis rahang, dan dagu.
- "eyes": berikan deskripsi yang mencakup warna mata (jika warnanya tidak alami tambahkan imbuhan memakai kontak lensa), bentuk mata, ukuran mata, bentuk dan ketebalan alis, serta bulu mata.
- "nose": berikan deskripsi yang mencakup Pangkal Hidung, Batang Hidung, Puncak Hidung, Lubang Hidung, Cuping Hidung.
- "lips": berikan deskripsi yang mencakup ketebalan, bentuk bibir, Proporsi Bibir Atas dan Bawah, Bentuk (Cupid's Bow), Lebar Bibir, Bentuk Sudut Bibir, Definisi Garis Bibir.
- "hair": berikan satu string tunggal yang merangkum semua detail rambut berdasarkan panduan berikut: ${hairInstruction}.
- "skin": berikan deskripsi yang mencakup warna kulit (jika tidak alami, sebutkan sebagai 'dengan make up'). Sebutkan juga tanda khusus seperti tahi lalat atau lesung pipi.
${vibeInstruction}
- Untuk kunci lainnya ("demeanor", "facial_hair"), berikan deskripsi yang sesuai.`;
            
            apiPromises.push(callGeminiAPI(faceInstruction, [characterImageData.face]));
            
            if (characterImageData.clothing) {
                let clothingInstruction;
                if (selectedStyle === 'Fiksi') {
                    clothingInstruction = `Berdasarkan gambar pakaian, analisis dan kembalikan objek JSON dengan kunci "top" dan "bottom". Pastikan deskripsi mengandung unsur fantasi (contoh: jubah ajaib, armor elf). Balas HANYA dengan objek JSON.`;
                } else {
                    clothingInstruction = `Berdasarkan gambar pakaian, analisis dan deskripsikan sebagai sebuah "pakaian" atau "busana" dalam objek JSON dengan kunci "top" dan "bottom". Balas HANYA dengan objek JSON.`;
                }
                apiPromises.push(callGeminiAPI(clothingInstruction, [characterImageData.clothing]));
            } else {
                apiPromises.push(Promise.resolve('{}'));
            }

            if (characterImageData.accessories) {
                const accessoriesInstruction = `Berdasarkan gambar aksesori, analisis dan kembalikan objek JSON dengan kunci "accessory". Balas HANYA dengan objek JSON. Jika tidak ada aksesori, nilai harus "none".`;
                apiPromises.push(callGeminiAPI(accessoriesInstruction, [characterImageData.accessories]));
            } else {
                apiPromises.push(Promise.resolve('{}'));
            }
            
            const [faceResult, clothingResult, accessoriesResult] = await Promise.all(apiPromises);

            try {
                const faceData = JSON.parse(faceResult);
                const clothingData = JSON.parse(clothingResult);
                const accessoriesData = JSON.parse(accessoriesResult);

                const finalDescription = `// MASTER PROMPT / CHARACTER SHEET: ${characterName} (v2.0)
(
    ${characterName.toLowerCase().replace(/ /g, '_')}:
    identity: ${faceData.identity || 'not specified'}.
    demeanor: ${faceData.demeanor || 'not specified'}.
    vibe: ${faceData.vibe || 'not specified'}.

    // --- Physical Appearance ---
    face_shape: ${faceData.face_shape || 'not specified'}.
    eyes: ${faceData.eyes || 'not specified'}.
    nose: ${faceData.nose || 'not specified'}.
    lips: ${faceData.lips || 'not specified'}.
    hair: (${faceData.hair || 'not specified'}:1.2).
    skin: ${faceData.skin || 'not specified'}.
    facial_hair: (${faceData.facial_hair || 'none'}:1.5).

    // --- Attire & Accessories ---
    attire:
        top: ${clothingData.top || 'not specified'}.
        bottom: ${clothingData.bottom || 'not specified'}.
    accessory: (${accessoriesData.accessory || 'none'}:1.3).
)`.trim();
                
                inputs.subjek.value = finalDescription;
                characterCreatorModal.classList.add('hidden');

            } catch(e) {
                console.error("Gagal mem-parsing JSON dari API. Response:", {faceResult, clothingResult, accessoriesResult}, "Error:", e);
                throw new Error("Gagal membuat Character Sheet karena respons API tidak valid.");
            }
        });
    }
    
    // --- CHARACTER SHEET & DIALOGUE LOGIC ---
    function getSavedCharacters() {
        return JSON.parse(localStorage.getItem('promptGenCharacters')) || [];
    }

    function saveCharacter() {
        const subject = inputs.subjek.value.trim();
        if (!subject) {
            alert("Kolom Subjek kosong, tidak ada yang bisa disimpan.");
            return;
        }

        let defaultName = "Karakter Baru";
        const nameMatch = subject.match(/\/\/\s*MASTER PROMPT\s*\/\s*CHARACTER SHEET:\s*(.*?)\s*\(v2.0\)/);
        if (nameMatch && nameMatch[1]) {
            defaultName = nameMatch[1].trim();
        }

        const characterName = prompt("Masukkan nama untuk karakter ini:", defaultName);
        if (!characterName) return;

        const characters = getSavedCharacters();
        const existingIndex = characters.findIndex(c => c.name === characterName);
        if (existingIndex > -1) {
            if (!confirm(`Karakter dengan nama "${characterName}" sudah ada. Apakah Anda ingin menimpanya?`)) {
                return;
            }
            characters[existingIndex].description = subject;
        } else {
            characters.push({ name: characterName, description: subject });
        }

        localStorage.setItem('promptGenCharacters', JSON.stringify(characters));
        flashButtonText(saveCharacterBtn, "Karakter Tersimpan!");
    }
    
    function populateCharacterModal(mode = 'single') {
        const characters = getSavedCharacters();
        characterList.innerHTML = ''; 
        
        const existingFooter = loadCharacterModal.querySelector('.modal-footer');
        if (existingFooter) {
            existingFooter.remove();
        }

        if (characters.length === 0) {
            characterList.innerHTML = '<p class="text-gray-400">Belum ada karakter yang disimpan.</p>';
            return;
        }
        
        if (mode === 'single') {
            characters.forEach((char, index) => {
                const charEl = document.createElement('div');
                charEl.className = 'flex justify-between items-center p-3 bg-gray-700 rounded-lg';
                
                const nameEl = document.createElement('span');
                nameEl.textContent = char.name;
                nameEl.className = 'cursor-pointer hover:text-indigo-400';
                nameEl.onclick = () => {
                    inputs.subjek.value = char.description;
                    loadCharacterModal.classList.add('hidden');
                };

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Hapus';
                deleteBtn.className = 'text-xs bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    if(confirm(`Apakah Anda yakin ingin menghapus karakter "${char.name}"?`)) {
                        characters.splice(index, 1);
                        localStorage.setItem('promptGenCharacters', JSON.stringify(characters));
                        populateCharacterModal(mode);
                    }
                };
                
                charEl.appendChild(nameEl);
                charEl.appendChild(deleteBtn);
                characterList.appendChild(charEl);
            });
        } else if (mode === 'conversation') {
             characters.forEach((char, index) => {
                const charEl = document.createElement('div');
                charEl.className = 'flex items-center p-3 bg-gray-700 rounded-lg';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `char-${index}`;
                checkbox.value = char.name;
                if (selectedCharacters.some(sc => sc.name === char.name)) {
                    checkbox.checked = true;
                }
                checkbox.className = 'h-4 w-4 text-indigo-600 bg-gray-600 border-gray-500 rounded focus:ring-indigo-500';
                
                const label = document.createElement('label');
                label.htmlFor = `char-${index}`;
                label.textContent = char.name;
                label.className = 'ml-3 block text-sm font-medium text-gray-300';
                
                charEl.appendChild(checkbox);
                charEl.appendChild(label);
                characterList.appendChild(charEl);
            });
            
            const footer = document.createElement('div');
            footer.className = 'modal-footer mt-4 pt-4 border-t border-gray-700';
            const addButton = document.createElement('button');
            addButton.textContent = 'Tambahkan ke Adegan';
            addButton.className = 'w-full text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors';
            addButton.onclick = () => {
                const selectedCheckboxes = characterList.querySelectorAll('input[type="checkbox"]:checked');
                const newSelectedNames = Array.from(selectedCheckboxes).map(cb => cb.value);
                
                selectedCharacters = characters.filter(char => newSelectedNames.includes(char.name));

                renderSceneCharacters();
                renderDialogueEditor();
                loadCharacterModal.classList.add('hidden');
            };

            footer.appendChild(addButton);
            loadCharacterModal.querySelector('.bg-gray-800').appendChild(footer);
        }
        
        loadCharacterModal.classList.remove('hidden');
    }

    // --- Functions for Conversation Mode ---
    function renderSceneCharacters() {
        sceneCharactersList.innerHTML = '';
        if (selectedCharacters.length === 0) {
            sceneCharactersList.innerHTML = '<p class="text-sm text-gray-400">Belum ada karakter yang ditambahkan.</p>';
            return;
        }
        
        selectedCharacters.forEach(char => {
            const charEl = document.createElement('div');
            charEl.className = 'flex items-center justify-between bg-gray-700 px-3 py-2 rounded-lg';
            charEl.textContent = char.name;
            sceneCharactersList.appendChild(charEl);
        });
    }

    function addDialogueLine() {
        dialogueLines.push({ speaker: '', line: '', tone: ''});
        renderDialogueEditor();
    }

    function removeDialogueLine(index) {
        dialogueLines.splice(index, 1);
        renderDialogueEditor();
    }
    
    // [MODIFIED] Dialogue editor now saves user input to state
    function renderDialogueEditor() {
        dialogueEditor.innerHTML = '';
        if (selectedCharacters.length === 0) {
            dialogueEditor.innerHTML = '<p class="text-sm text-gray-400 text-center">Tambahkan karakter terlebih dahulu untuk memulai dialog.</p>';
            return;
        }
        
        dialogueLines.forEach((dialogue, index) => {
            const lineEl = document.createElement('div');
            lineEl.className = 'grid grid-cols-1 md:grid-cols-3 gap-2 items-center';

            const speakerSelect = document.createElement('select');
            speakerSelect.className = 'bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5';
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Pilih Pembicara...';
            speakerSelect.appendChild(defaultOption);

            selectedCharacters.forEach(char => {
                const option = document.createElement('option');
                option.value = char.name;
                option.textContent = char.name;
                if (dialogue.speaker === char.name) {
                    option.selected = true;
                }
                speakerSelect.appendChild(option);
            });
            speakerSelect.onchange = (e) => { dialogueLines[index].speaker = e.target.value; };

            const lineInput = document.createElement('input');
            lineInput.type = 'text';
            lineInput.value = dialogue.line;
            lineInput.placeholder = 'Dialog...';
            lineInput.className = 'md:col-span-2 bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5';
            lineInput.oninput = (e) => { dialogueLines[index].line = e.target.value; };
            
            const actionContainer = document.createElement('div');
            actionContainer.className = 'md:col-span-3 grid grid-cols-3 gap-2';

            const toneInput = document.createElement('input');
            toneInput.type = 'text';
            toneInput.value = dialogue.tone;
            toneInput.placeholder = 'Nada/Ekspresi (opsional)...';
            toneInput.className = 'col-span-2 bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5';
            toneInput.oninput = (e) => { dialogueLines[index].tone = e.target.value; };
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Hapus';
            deleteBtn.className = 'col-span-1 text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 text-center';
            deleteBtn.onclick = () => removeDialogueLine(index);
            
            actionContainer.appendChild(toneInput);
            actionContainer.appendChild(deleteBtn);

            lineEl.appendChild(speakerSelect);
            lineEl.appendChild(lineInput);
            lineEl.appendChild(actionContainer);
            dialogueEditor.appendChild(lineEl);
        });
    }

    // --- EVENT LISTENERS INITIALIZATION ---
    loadCoins();
    addCoinBtn.addEventListener('click', handleAddCoinClick);
    window.addEventListener('focus', handleWindowFocus);
    generateBtn.addEventListener('click', createAndTranslatePrompt);
    copyBtnId.addEventListener('click', () => copyText(promptIndonesia, copyBtnId));
    copyBtnEn.addEventListener('click', () => copyText(promptEnglish, copyBtnEn));
    openGeminiIdBtn.addEventListener('click', () => openInGemini(promptIndonesia, openGeminiIdBtn));
    openGeminiEnBtn.addEventListener('click', () => openInGemini(promptEnglish, openGeminiEnBtn));
    
    fixPromptIdBtn.addEventListener('click', () => {
        if (fixPromptIdBtn.disabled) return;
        flashButtonText(fixPromptIdBtn, 'Segera Hadir!');
    });
    fixPromptEnBtn.addEventListener('click', () => {
         if (fixPromptEnBtn.disabled) return;
        flashButtonText(fixPromptEnBtn, 'Segera Hadir!');
    });

    // --- Scene Mode Listeners ---
    singleSceneBtn.addEventListener('click', () => switchSceneMode('single'));
    conversationSceneBtn.addEventListener('click', () => switchSceneMode('conversation'));
    addSceneCharacterBtn.addEventListener('click', () => populateCharacterModal('conversation'));
    addDialogueLineBtn.addEventListener('click', addDialogueLine);


    // Listeners for single image description
    imageUploadInput.addEventListener('change', handleSingleImageUpload);
    describeSubjectBtn.addEventListener('click', () => describeSingleImage('subject'));
    describePlaceBtn.addEventListener('click', () => describeSingleImage('place'));

    // Modal Listeners
    guideBtn.addEventListener('click', () => guideModal.classList.remove('hidden'));
    closeGuideBtn.addEventListener('click', () => guideModal.classList.add('hidden'));
    guideModal.addEventListener('click', (e) => { if(e.target === guideModal) guideModal.classList.add('hidden'); });
    
    openCharacterCreatorBtn.addEventListener('click', () => characterCreatorModal.classList.remove('hidden'));
    closeCharacterCreatorBtn.addEventListener('click', () => characterCreatorModal.classList.add('hidden'));
    characterCreatorModal.addEventListener('click', (e) => { if(e.target === characterCreatorModal) characterCreatorModal.classList.add('hidden'); });
    
    // Character Sheet Listeners
    saveCharacterBtn.addEventListener('click', saveCharacter);
    loadCharacterBtn.addEventListener('click', () => populateCharacterModal('single'));
    closeLoadCharacterBtn.addEventListener('click', () => loadCharacterModal.classList.add('hidden'));
    loadCharacterModal.addEventListener('click', (e) => { if (e.target === loadCharacterModal) loadCharacterModal.classList.add('hidden') });

    // Listeners for uploads inside the character creator modal
    createCharacterBtn.addEventListener('click', createCharacterDescription);
    Object.keys(characterUploads).forEach(type => {
        const { input, container } = characterUploads[type];
        input.addEventListener('change', (e) => handleCharacterImageUpload(e, type));
        container.addEventListener('dragover', (e) => { e.preventDefault(); container.classList.add('border-indigo-500'); });
        container.addEventListener('dragleave', (e) => { e.preventDefault(); container.classList.remove('border-indigo-500'); });
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            container.classList.remove('border-indigo-500');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                input.files = files;
                handleCharacterImageUpload({ target: input }, type);
            }
        });
    });

    // Drag and Drop for the original single image upload
    imageUploadContainer.addEventListener('dragover', (e) => { e.preventDefault(); imageUploadContainer.parentElement.classList.add('border-indigo-500'); });
    imageUploadContainer.addEventListener('dragleave', (e) => { e.preventDefault(); imageUploadContainer.parentElement.classList.remove('border-indigo-500'); });
    imageUploadContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadContainer.parentElement.classList.remove('border-indigo-500');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            imageUploadInput.files = files;
            handleSingleImageUpload({ target: imageUploadInput });
        }
    });

    // Initialize the default view
    switchSceneMode('single');
    renderDialogueEditor();
});
