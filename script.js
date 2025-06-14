// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENT SELECTORS ---
    const coinCountEl = document.getElementById('coinCount');
    const addCoinBtn = document.getElementById('addCoinBtn');
    const noCoinsNotification = document.getElementById('noCoinsNotification');
    const generateBtn = document.getElementById('generateBtn');
    const promptIndonesia = document.getElementById('promptIndonesia');
    const promptEnglish = document.getElementById('promptEnglish');
    const copyBtnId = document.getElementById('copyBtnId');
    const copyBtnEn = document.getElementById('copyBtnEn');
    const openGeminiIdBtn = document.getElementById('openGeminiIdBtn');
    const openGeminiEnBtn = document.getElementById('openGeminiEnBtn');
    const fixPromptIdBtn = document.getElementById('fixPromptIdBtn');
    const fixPromptEnBtn = document.getElementById('fixPromptEnBtn');
    const guideBtn = document.getElementById('guideBtn');
    const guideModal = document.getElementById('guideModal');
    const closeGuideBtn = document.getElementById('closeGuideBtn');
    const imageUploadInput = document.getElementById('imageUploadInput');
    const imagePreview = document.getElementById('imagePreview');
    const describeSubjectBtn = document.getElementById('describeSubjectBtn');
    const describePlaceBtn = document.getElementById('describePlaceBtn');
    const imageUploadIcon = document.getElementById('imageUploadIcon');
    const imageUploadContainer = document.getElementById('imageUploadContainer');

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

    // --- STATE MANAGEMENT ---
    let coins = 0;
    let isWaitingForAdReward = false;
    let uploadedImageData = null;
    let adOpenedTime = null; // NEW: To store the timestamp when the ad tab is opened

    // --- COIN SYSTEM ---
    function saveCoins() {
        localStorage.setItem('userVeoCoins', coins);
    }

    function updateButtonState() {
        if (generateBtn.disabled) return;
        generateBtn.textContent = (coins < 1) ? 'Koin Habis' : 'Generate Prompt';
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
        adOpenedTime = Date.now(); // MODIFIED: Record the current time
        noCoinsNotification.classList.add('hidden');
        
        addCoinBtn.disabled = true;
        // MODIFIED: Updated title to inform the user about the timer
        addCoinBtn.title = 'Tunggu 5 detik di tab baru, lalu kembali untuk mendapatkan koin';
        addCoinBtn.textContent = '...';

        window.open('https://shopee.co.id/-PROMO-MURAH-Celana-Cargo-Panjang-Pria-Dewasa-Bahan-Adem-Tidak-Panas-Nyaman-Untuk-Sehari-Bekerja-i.102427008.29765835450', '_blank');
    }

    function handleWindowFocus() {
        // MODIFIED: Added timer logic
        if (isWaitingForAdReward && adOpenedTime) {
            const timeElapsed = Date.now() - adOpenedTime;
            const requiredTime = 5000; // 5 seconds in milliseconds

            // Reset state immediately to prevent multiple triggers
            isWaitingForAdReward = false;
            adOpenedTime = null;
            
            // Re-enable the button immediately
            addCoinBtn.disabled = false;
            addCoinBtn.title = 'Tambah 5 Koin';
            addCoinBtn.textContent = '+';

            if (timeElapsed >= requiredTime) {
                // Grant coins only if enough time has passed
                coins += 5;
                saveCoins();
                updateCoinDisplay();

                // Visual feedback for success
                const coinContainer = coinCountEl.parentElement;
                coinContainer.classList.add('bg-green-600', 'transition-colors', 'duration-300');
                setTimeout(() => {
                    coinContainer.classList.remove('bg-green-600');
                }, 1500);
            } else {
                // Silently fail if the user comes back too early.
                // A custom notification could be added here for better UX.
                console.log("Returned too quickly, no coins awarded.");
            }
        }
    }

    // --- PROMPT GENERATOR SYSTEM ---
    function showCopyFeedback(button, text = 'Berhasil Disalin!') {
        const originalText = button.textContent;
        button.textContent = text;
        const originalColorClasses = Array.from(button.classList).filter(c => c.startsWith('bg-') || c.startsWith('hover:bg-'));
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
            navigator.clipboard.writeText(promptText).then(() => {
                showCopyFeedback(button);
            }).catch(err => {
                console.warn('Gagal menyalin dengan API modern, mencoba metode fallback.', err);
                fallbackCopyText(textarea, button);
            });
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
                }).catch(() => {
                    fallbackCopyText(textarea, button, 'Disalin!');
                     window.open(geminiUrl, '_blank');
                });
            } else {
                fallbackCopyText(textarea, button, 'Disalin!');
                window.open(geminiUrl, '_blank');
            }
        } else {
             window.open(geminiUrl, '_blank');
        }
    }

    function generateIndonesianPrompt() {
        let combinedActionExpression = inputs.aksi.value.trim();
        const expression = inputs.ekspresi.value.trim();
        if (combinedActionExpression && expression) {
            combinedActionExpression += ` dengan ekspresi ${expression}`;
        } else if (expression) {
            combinedActionExpression = expression;
        }

        const place = inputs.tempat.value.trim();
        const time = inputs.waktu.value.trim();
        let locationAndTime = '';
        if (place && time) {
            locationAndTime = `${place} saat ${time}`;
        } else {
            locationAndTime = place || time;
        }

        const promptParts = [
            inputs.style.value,
            inputs.sudutKamera.value,
            inputs.kamera.value,
            inputs.subjek.value,
            combinedActionExpression,
            locationAndTime,
            inputs.pencahayaan.value.trim() ? `dengan pencahayaan ${inputs.pencahayaan.value.trim()}`: '',
            inputs.suasana.value.trim() ? `suasana ${inputs.suasana.value.trim()}`: '',
            inputs.backsound.value.trim() ? `suara ${inputs.backsound.value.trim()} dalam Bahasa Indonesia` : '',
            inputs.kalimat.value.trim() ? `kalimat diucapkan dalam Bahasa Indonesia: "${inputs.kalimat.value.trim()}"` : '',
            inputs.detail.value
        ];
        
        return promptParts.filter(part => part && part.trim()).join(', ');
    }

    // --- GEMINI API INTEGRATION ---
    async function callGeminiAPI(instruction, imageData = null) {
        // WARNING: Your API key is exposed here. Move this to a backend server for security.
        const apiKey = "AIzaSyBmL1kWfXwhOc9vd1xFslrj_qdz3nF8U1U"; 
        const model = "gemini-1.5-flash-latest"; // Using a consistent, recent model
        
        const parts = [{ text: instruction }];
        if(imageData) {
            parts.push({
                inline_data: {
                    mime_type: imageData.type,
                    data: imageData.data
                }
            });
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const payload = {
            contents: [{ parts: parts }]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorBody = await response.text();
            console.error("API Error Response:", errorBody);
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        
        // Safely access the response text
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
            return text;
        } else {
            console.log("No valid response text found, full response:", result);
            throw new Error("Invalid or empty response structure from API.");
        }
    }

    async function createAndTranslatePrompt() {
        if (coins < 1) {
            noCoinsNotification.classList.remove('hidden');
            setTimeout(() => noCoinsNotification.classList.add('hidden'), 3000); 
            return;
        }
        
        noCoinsNotification.classList.add('hidden');
        generateBtn.disabled = true;
        generateBtn.textContent = 'Membuat Prompt...';
        
        const indonesianPrompt = generateIndonesianPrompt();
        promptIndonesia.value = indonesianPrompt;
        promptEnglish.value = 'Menerjemahkan...';

        if (!indonesianPrompt) {
            generateBtn.disabled = false;
            updateButtonState();
            promptEnglish.value = '';
            return;
        }
        
        coins--;
        saveCoins();
        updateCoinDisplay();
        
        try {
            const instruction = `Translate the following creative video prompt from Indonesian to English. Keep the structure and comma separation. Be concise and direct. Respond only with the translated prompt, without any introductory text. Text to translate: "${indonesianPrompt}"`;
            const translatedText = await callGeminiAPI(instruction);
            promptEnglish.value = translatedText.trim();
        } catch (error) {
            console.error("Translation Error:", error);
            promptEnglish.value = 'Gagal menerjemahkan. Periksa API Key atau koneksi.';
        } finally {
            generateBtn.disabled = false;
            updateButtonState();
        }
    }
    
    // --- UTILITY FUNCTIONS & EVENT HANDLERS ---
    
    // Universal function to handle API calls with button state changes
    async function handleApiInteraction(button, apiFunction) {
        if (coins < 1) {
            noCoinsNotification.classList.remove('hidden');
            setTimeout(() => noCoinsNotification.classList.add('hidden'), 3000);
            return;
        }

        const originalButtonText = button.textContent;
        const allButtons = [generateBtn, fixPromptIdBtn, fixPromptEnBtn, describeSubjectBtn, describePlaceBtn];
        allButtons.forEach(btn => btn.disabled = true);
        button.textContent = 'Memproses...';

        coins--;
        saveCoins();
        updateCoinDisplay();

        try {
            await apiFunction();
        } catch (error) {
            console.error("API Interaction Error:", error);
            // You can add user-facing error messages here, e.g., in a notification area
            alert("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            allButtons.forEach(btn => btn.disabled = false);
            // Re-enable describe buttons only if an image is present
            describeSubjectBtn.disabled = !uploadedImageData;
            describePlaceBtn.disabled = !uploadedImageData;
            button.textContent = originalButtonText;
            updateButtonState();
        }
    }
    
    function fixAndSyncPrompt(sourceTextarea, targetTextarea, button, sourceLang) {
        const apiFunction = async () => {
            const originalPrompt = sourceTextarea.value;
            if (!originalPrompt) return;

            button.textContent = 'Memperbaiki...';
            const targetLang = sourceLang === 'id' ? 'English' : 'Bahasa Indonesia';
            const fixInstruction = `Analyze and fix this prompt for a video AI generator. Make it more effective and compliant. Focus on natural language, remove contradictions, and ensure it's a high-quality, descriptive prompt. The prompt is: "${originalPrompt}". Respond only with the improved prompt in ${sourceLang === 'id' ? 'Indonesian' : 'English'}, without any introductory text.`;
            const fixedPrompt = await callGeminiAPI(fixInstruction);
            sourceTextarea.value = fixedPrompt.trim();

            button.textContent = 'Menerjemahkan...';
            const translateInstruction = `Translate the following creative video prompt to ${targetLang}. Be concise and direct. Respond only with the translated prompt. Text to translate: "${fixedPrompt}"`;
            const translatedText = await callGeminiAPI(translateInstruction);
            targetTextarea.value = translatedText.trim();
        };

        handleApiInteraction(button, apiFunction);
    }
    
    function describeImage(type) {
        const apiFunction = async () => {
             if (!uploadedImageData) {
                alert("Silakan unggah gambar terlebih dahulu.");
                return;
            }

            const button = type === 'subject' ? describeSubjectBtn : describePlaceBtn;
            button.textContent = 'Menganalisis...';
            
            const instruction = type === 'subject'
                ? "Analisis secara spesifik hanya orang/subjek utama dalam gambar ini. Abaikan sepenuhnya latar belakang atau tempat. Berikan deskripsi mendetail dalam Bahasa Indonesia yang mencakup detail wajah, warna dan gaya rambut, pakaian dan aksesoris, warna kulit, dan perkiraan usia. Gabungkan semuanya menjadi satu frasa deskriptif yang kohesif. Balas HANYA dengan frasa deskriptif ini, tanpa teks atau format lain."
                : "Anda adalah seorang prompt engineer. Analisis gambar ini dan buatlah deskripsi prompt yang sinematik untuk latar belakangnya dalam Bahasa Indonesia. Fokus pada suasana, elemen visual kunci, dan mood. Abaikan orang atau subjek utama. Balas HANYA dengan deskripsi prompt ini, tanpa teks pembuka.";
            
            const description = await callGeminiAPI(instruction, uploadedImageData);
            const targetInput = type === 'subject' ? inputs.subjek : inputs.tempat;
            targetInput.value = description.trim();
        };
        
        const buttonToUpdate = type === 'subject' ? describeSubjectBtn : describePlaceBtn;
        handleApiInteraction(buttonToUpdate, apiFunction);
    }


    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.classList.remove('hidden');
            imageUploadIcon.classList.add('hidden');
            uploadedImageData = {
                type: file.type,
                data: e.target.result.split(',')[1] // Get base64 part
            };
            describeSubjectBtn.disabled = false;
            describePlaceBtn.disabled = false;
        };
        reader.readAsDataURL(file);
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
    fixPromptIdBtn.addEventListener('click', () => fixAndSyncPrompt(promptIndonesia, promptEnglish, fixPromptIdBtn, 'id'));
    fixPromptEnBtn.addEventListener('click', () => fixAndSyncPrompt(promptEnglish, promptIndonesia, fixPromptEnBtn, 'en'));

    imageUploadInput.addEventListener('change', handleImageUpload);
    describeSubjectBtn.addEventListener('click', () => describeImage('subject'));
    describePlaceBtn.addEventListener('click', () => describeImage('place'));

    guideBtn.addEventListener('click', () => guideModal.classList.remove('hidden'));
    closeGuideBtn.addEventListener('click', () => guideModal.classList.add('hidden'));
    guideModal.addEventListener('click', (e) => {
        if(e.target === guideModal) {
            guideModal.classList.add('hidden');
        }
    });

    // Drag and Drop for Image Upload
    imageUploadContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadContainer.parentElement.classList.add('border-indigo-500');
    });
    imageUploadContainer.addEventListener('dragleave', (e) => {
        e.preventDefault();
        imageUploadContainer.parentElement.classList.remove('border-indigo-500');
    });
    imageUploadContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadContainer.parentElement.classList.remove('border-indigo-500');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            imageUploadInput.files = files;
            handleImageUpload({ target: imageUploadInput });
        }
    });
});
