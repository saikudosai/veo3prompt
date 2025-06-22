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


    // --- GEMINI API INTEGRATION (MODIFIED FOR BACKEND) ---
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
             // Clean markdown and potential JSON artifacts
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

    // --- MANUAL PROMPT LOGIC ---
    function generateIndonesianPrompt() {
        let combinedActionExpression = inputs.aksi.value.trim();
        const expression = inputs.ekspresi.value.trim();
        if (combinedActionExpression && expression) combinedActionExpression += ` dengan ekspresi ${expression}`;
        else if (expression) combinedActionExpression = expression;
        const place = inputs.tempat.value.trim();
        const time = inputs.waktu.value.trim();
        let locationAndTime = (place && time) ? `${place} saat ${time}` : (place || time);
        const promptParts = [
            inputs.style.value, inputs.sudutKamera.value, inputs.kamera.value, inputs.subjek.value,
            combinedActionExpression, locationAndTime,
            inputs.pencahayaan.value.trim() ? `dengan pencahayaan ${inputs.pencahayaan.value.trim()}`: '',
            inputs.suasana.value.trim() ? `suasana ${inputs.suasana.value.trim()}`: '',
            inputs.backsound.value.trim() ? `suara ${inputs.backsound.value.trim()} dalam Bahasa Indonesia` : '',
            inputs.kalimat.value.trim() ? `kalimat diucapkan dalam Bahasa Indonesia: "${inputs.kalimat.value.trim()}"` : '',
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

    // --- CUSTOM CHARACTER CREATOR LOGIC (Modal) ---
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
                // Refund coins if user cancels the prompt
                coins += 3;
                saveCoins();
                updateCoinDisplay();
                console.log("Pembuatan karakter dibatalkan.");
                return;
            }

            const apiPromises = [];
            const selectedStyle = characterStyleSelect.value;
            
            const hairInstruction = `Deskripsikan rambut dengan sangat detail, pecah ke dalam kategori berikut:
- **Warna Rambut:** Warna Dasar (hitam, cokelat, dll.), Highlight & Lowlight, Gradasi & Akar, dan Nada Warna (hangat, dingin).
- **Tekstur & Pola Rambut:** Tipe Rambut (lurus, bergelombang, ikal, keriting), Detail Tekstur (gelombang longgar/rapat, ikal spiral/besar), Kondisi Helai (tebal/tipis), Kehalusan/Kekusutan (halus, frizzy, flyaways).
- **Panjang & Potongan Rambut:** Panjang Keseluruhan (sebatas dagu, sebahu, sebatas punggung tengah, sangat panjang), Gaya Potongan/Haircut (bob, pixie, bixie, undercut, comma hair, two block, layer, blunt cut, shaggy), Poni (poni depan, curtain bangs).
- **Gaya & Penataan Rambut:** Penataan (tergerai, ekor kuda, dikepang), Belahan Rambut (tengah, samping), dan Aksesori (jepit, bando).
- **Kesan & Karakteristik Unik:** Volume (tebal/kempes), Kilau (berkilau/kusam), dan Detail lain (uban, ujung berwarna).`;
            
            // [MODIFIED] Updated faceInstruction for the 'hair' key to request a single string.
            const faceInstruction = `Berdasarkan gambar wajah yang diunggah, analisis dan kembalikan sebuah objek JSON. Balas HANYA dengan objek JSON, tanpa teks atau format lain.
Objek JSON harus memiliki kunci-kunci berikut: "identity", "demeanor", "vibe", "face_shape", "eyes", "nose", "lips", "hair", "skin", "facial_hair".
- "identity": berikan deskripsi yang berisi jenis kelamin, perkiraan usia, dan asal negara/etnis (Contoh: "Seorang pria berusia 25 tahun dari Korea").
- "face_shape": berikan deskripsi yang mencakup bentuk wajah secara keseluruhan (oval, bulat, dll.), dahi, bentuk pipi, garis rahang, dan dagu.
- "eyes": berikan deskripsi yang mencakup warna mata (jika warnanya tidak alami tambahkan imbuhan memakai kontak lensa), bentuk mata, ukuran mata, bentuk dan ketebalan alis, serta bulu mata.
- "nose": berikan deskripsi yang mencakup Pangkal Hidung, Batang Hidung, Puncak Hidung, Lubang Hidung, Cuping Hidung.
- "lips": berikan deskripsi yang mencakup ketebalan, bentuk bibir, Proporsi Bibir Atas dan Bawah, Bentuk (Cupid's Bow), Lebar Bibir, Bentuk Sudut Bibir, Definisi Garis Bibir.
- "hair": berikan satu string tunggal yang merangkum semua detail rambut berdasarkan panduan berikut: ${hairInstruction}.
- "skin": berikan deskripsi yang mencakup warna kulit (jika tidak alami, sebutkan sebagai 'dengan make up'). Sebutkan juga tanda khusus seperti tahi lalat atau lesung pipi.
- Untuk kunci lainnya, berikan deskripsi yang sesuai.
- Gaya deskripsi harus untuk karakter '${selectedStyle}'.`;
            
            apiPromises.push(callGeminiAPI(faceInstruction, [characterImageData.face]));
            
            if (characterImageData.clothing) {
                const clothingInstruction = `Berdasarkan gambar pakaian, analisis dan kembalikan objek JSON dengan kunci "top" dan "bottom". Balas HANYA dengan objek JSON. Gaya deskripsi harus untuk karakter '${selectedStyle}'.`;
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
    
    // --- CHARACTER SHEET LOGIC ---
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
        if (!characterName) return; // User cancelled

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
    
    function loadCharacter() {
        const characters = getSavedCharacters();
        characterList.innerHTML = ''; // Clear previous list

        if (characters.length === 0) {
            characterList.innerHTML = '<p class="text-gray-400">Belum ada karakter yang disimpan.</p>';
        } else {
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
                        loadCharacter(); // Refresh list
                    }
                };
                
                charEl.appendChild(nameEl);
                charEl.appendChild(deleteBtn);
                characterList.appendChild(charEl);
            });
        }
        loadCharacterModal.classList.remove('hidden');
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
    loadCharacterBtn.addEventListener('click', loadCharacter);
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
});
