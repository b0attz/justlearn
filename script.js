// ข้อมูลคำถามและคำตอบที่ถูกต้อง (แก้ไขตามความสัมพันธ์ของคุณ)
const questions = [
    {
        question: "เราเจอกันครั้งแรกที่ไหน?",
        options: ["โรงเรียน", "ร้านกาแฟ", "ในงานเลี้ยง", "ออนไลน์"],
        correctAnswer: "โรงเรียน"
    },
    {
        question: "สีโปรดของฉันคือสีอะไร?",
        options: ["ฟ้า", "ม่วง", "ขาว", "ดำ"],
        correctAnswer: "ม่วง"
    },
    {
        question: "สัตว์ที่ฉันกลัวที่สุดคืออะไร?",
        options: ["งู", "แมลงสาบ", "จิ้งจก", "หนู"],
        correctAnswer: "งู"
    }
];

const quizArea = document.getElementById('quiz-area');
const resultArea = document.getElementById('result-area');
const failArea = document.getElementById('fail-area');
const container = document.querySelector('.container');
const submitBtn = document.getElementById('submit-btn');

// --- ตัวแปรสำหรับนับจำนวนครั้งที่ผิด และค่า IG ---
const MAX_ATTEMPTS = 3; // จำนวนครั้งที่ตอบผิดได้สูงสุด
const YOUR_IG_USERNAME = "phithak1nkham"; // IG ของคุณ
const SECRET_CODE = "ILOVEWHO?"; // รหัสลับสำหรับคุณเท่านั้น

let incorrectAttempts = localStorage.getItem('attempts') ? parseInt(localStorage.getItem('attempts')) : 0;
// --------------------------------------------------------

function loadQuestions() {
    // โหลดและแสดงคำถาม
    questions.forEach((q, index) => {
        const qBox = document.createElement('div');
        qBox.className = 'question-box';
        qBox.innerHTML = `<p><strong>คำถามที่ ${index + 1}:</strong> ${q.question}</p>`;
        
        q.options.forEach(option => {
            qBox.innerHTML += `
                <label>
                    <input type="radio" name="q${index}" value="${option}">
                    ${option}
                </label>
            `;
        });
        quizArea.appendChild(qBox);
    });
    
    // อัปเดตและแสดงจำนวนครั้งที่เหลือ
    const attemptsLeftElement = document.getElementById('attempts-left');
    if (attemptsLeftElement) {
        attemptsLeftElement.textContent = MAX_ATTEMPTS - incorrectAttempts;
    }

    // ตรวจสอบการล็อกทันทีที่โหลดหน้าเว็บ
    checkLockStatus(); 
}

function checkLockStatus() {
    if (incorrectAttempts >= MAX_ATTEMPTS) {
        // หากจำนวนครั้งที่ผิดถึงกำหนด ให้ล็อกหน้าจอโดยแทนที่เนื้อหาใน container
        container.innerHTML = `
            <div id="locked-area">
                <h2>⚠️ ถูกล็อกแล้ว! ⚠️</h2>
                <p>คุณตอบผิดครบ ${MAX_ATTEMPTS} ครั้งแล้ว ต้องทักมาขอปลดล็อกเท่านั้น!</p>
                <p><strong>วิธีปลดล็อก:</strong> ทัก Instagram มาหาฉันด่วนที่:</p>
                <a href="https://www.instagram.com/${YOUR_IG_USERNAME}" target="_blank" class="ig-link">@${YOUR_IG_USERNAME}</a>
                <p class="small-text">ถ้าฉันใจอ่อน... อาจจะรีเซ็ตให้ใหม่นะ 😉</p>
            </div>
        `;
    }
}

function checkAnswers() {
    let score = 0;
    const totalQuestions = questions.length;
    
    // ตรวจสอบว่าหน้าถูกล็อกอยู่หรือไม่
    if (incorrectAttempts >= MAX_ATTEMPTS) {
        return; 
    }

    // ตรวจสอบคำตอบ
    questions.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
        if (selectedOption && selectedOption.value === q.correctAnswer) {
            score++;
        }
    });

    // ซ่อนผลลัพธ์เก่าทั้งหมด
    resultArea.classList.add('hidden');
    failArea.classList.add('hidden');
    
    if (score === totalQuestions) {
        // ตอบถูกทั้งหมด: แสดงข้อความรัก (โอกาสจะไม่ถูกรีเซ็ต)
        resultArea.classList.remove('hidden');
        quizArea.classList.add('hidden'); 
        submitBtn.classList.add('hidden');
        
        const attemptsInfo = document.getElementById('attempts-info');
        if (attemptsInfo) {
             attemptsInfo.classList.add('hidden'); // ซ่อนตัวนับเมื่อสำเร็จ
        }
        
    } else {
        // ตอบผิด: เพิ่มจำนวนครั้งที่ผิด
        incorrectAttempts++;
        localStorage.setItem('attempts', incorrectAttempts);
        
        failArea.classList.remove('hidden');
        
        // อัปเดตจำนวนครั้งที่เหลือ
        const attemptsLeftElement = document.getElementById('attempts-left');
        if (attemptsLeftElement) {
            attemptsLeftElement.textContent = MAX_ATTEMPTS - incorrectAttempts;
        }

        // ตรวจสอบการล็อกหลังจากการตอบผิด
        checkLockStatus();
    }
}

// ********* ฟังก์ชันสำหรับแอดมิน *********

// ฟังก์ชันนี้ถูกเรียกเมื่อกดปุ่มรีเซ็ต (ซึ่งซ่อนอยู่)
function resetAllAttempts() {
    const confirmation = prompt("คุณแน่ใจว่าต้องการรีเซ็ตโอกาสตอบสำหรับทุกคนที่เคยเข้าเว็บนี้หรือไม่? \n(พิมพ์ 'RESETALL' เพื่อยืนยัน)");
    
    if (confirmation === 'RESETALL') {
        // ล้างค่าในเครื่องของคุณ
        localStorage.removeItem('attempts');
        alert("✅ การรีเซ็ตทั้งหมดสมบูรณ์! คุณได้สิทธิในการตอบใหม่แล้ว \n\nโปรดจำไว้: คุณต้องแจ้งผู้เล่นที่ถูกล็อกให้ลองเข้าเว็บใหม่ด้วยตัวเอง");
        window.location.reload(); 
    } else {
        alert("❌ ยกเลิกการรีเซ็ต หรือรหัสยืนยันไม่ถูกต้อง");
    }
}

// ฟังก์ชันตรวจสอบรหัสลับ (ใช้เรียกใน Console)
function checkSecretCode() {
    // *** แก้ไข: ย้ายการค้นหาปุ่มมาไว้ในฟังก์ชัน เพื่อให้มั่นใจว่าปุ่มถูกโหลดแล้ว ***
    const adminResetBtn = document.getElementById('admin-reset-btn');
    
    const code = prompt("ใส่รหัสลับของคุณเพื่อเปิดใช้งานปุ่มรีเซ็ต:");
    
    if (!adminResetBtn) {
         alert("❌ เกิดข้อผิดพลาด: ไม่พบปุ่มรีเซ็ตใน HTML");
         return;
    }

    if (code === SECRET_CODE) {
        adminResetBtn.classList.remove('hidden');
        alert("🎉 รหัสถูกต้อง! ปุ่มรีเซ็ตถูกเปิดใช้งานแล้ว (มุมขวาล่าง)");
    } else {
        alert("❌ รหัสลับไม่ถูกต้อง!");
    }
}

// ********************************************

// เริ่มต้นโหลดคำถามและตรวจสอบสถานะล็อก
window.onload = () => {
    loadQuestions();
    
    // โค้ดสำหรับคุณ: ให้คุณเปิด Console (F12) แล้วพิมพ์ checkSecretCode()
    console.log("🛠️ สำหรับคุณเท่านั้น: เปิดปุ่มรีเซ็ตโดยพิมพ์ 'checkSecretCode()' ใน Console นี้");
};