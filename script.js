// ข้อมูลคำถามและคำตอบที่ถูกต้อง (ใช้ข้อมูลเดิมที่คุณตั้งค่าไว้)
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

// --- ตัวแปรสำหรับนับจำนวนครั้งที่ผิด และค่า IG / Session ID ---
const MAX_ATTEMPTS = 3; 
const YOUR_IG_USERNAME = "phithak1nkham"; 
const SECRET_CODE = "ILOVEWHO?"; 

// **** สำคัญมาก: ตัวแปรควบคุมการรีเซ็ต ****
// รหัสนี้จะเปลี่ยนทุกครั้งที่คุณกดรีเซ็ต
let currentSessionId = localStorage.getItem('masterSession') || generateUniqueId();

// ตรวจสอบและอัพเดทค่า Master Session ID ในเครื่องของคุณ
localStorage.setItem('masterSession', currentSessionId);

// ค่า Attempts และ Session ID เฉพาะเครื่องของผู้เล่น
let incorrectAttempts = localStorage.getItem('attempts') ? parseInt(localStorage.getItem('attempts')) : 0;
let playerSessionId = localStorage.getItem('playerSession') || null;

// --------------------------------------------------------

// ฟังก์ชันสร้าง ID สุ่ม
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// *** ฟังก์ชันใหม่: ตรวจสอบสถานะ Session ***
function checkSessionStatus() {
    // 1. ตรวจสอบว่าผู้เล่นเคยถูกล็อกด้วย Session ID เก่าหรือไม่
    if (playerSessionId !== currentSessionId) {
        // ถ้า Session ID ไม่ตรงกัน หมายความว่า Admin ได้ทำการรีเซ็ตแล้ว 
        // หรือผู้เล่นเข้าเล่นเป็นครั้งแรก (ต้องตั้งค่า Session ใหม่)
        
        if (playerSessionId !== null) {
            // นี่คือการรีเซ็ตจริง (ผู้เล่นเคยมี Session เก่า)
            localStorage.removeItem('attempts');
            incorrectAttempts = 0; // รีเซ็ตค่า attempts
            
            // ไม่ต้องแจ้งเตือนผู้เล่น เพราะไม่ต้องการให้รู้ว่าคุณรีเซ็ตให้
            // alert("โอกาสตอบถูกรีเซ็ตแล้ว! ลองเล่นใหม่นะ"); 
        }
        
        // ตั้งค่า Session ID ใหม่ให้กับเครื่องของผู้เล่น
        localStorage.setItem('playerSession', currentSessionId);
        playerSessionId = currentSessionId;
        
        // รีโหลดหน้าเพื่อให้ค่า Attempts แสดงผลถูกต้อง
        if (document.getElementById('attempts-left')) {
             document.getElementById('attempts-left').textContent = MAX_ATTEMPTS - incorrectAttempts;
        }
    }
}


function loadQuestions() {
    // 1. ตรวจสอบและรีเซ็ต Session ก่อนโหลดคำถาม
    checkSessionStatus();
    
    // 2. โหลดและแสดงคำถาม
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
    
    // 3. อัปเดตและแสดงจำนวนครั้งที่เหลือ
    const attemptsLeftElement = document.getElementById('attempts-left');
    if (attemptsLeftElement) {
        attemptsLeftElement.textContent = MAX_ATTEMPTS - incorrectAttempts;
    }

    // 4. ตรวจสอบการล็อกทันทีที่โหลดหน้าเว็บ
    checkLockStatus(); 
}

function checkLockStatus() {
    // โค้ดส่วนนี้เหมือนเดิม
    if (incorrectAttempts >= MAX_ATTEMPTS) {
        // หากจำนวนครั้งที่ผิดถึงกำหนด ให้ล็อกหน้าจอ
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
    // โค้ดส่วนนี้เหมือนเดิม
    let score = 0;
    const totalQuestions = questions.length;
    
    // ตรวจสอบว่าหน้าถูกล็อกอยู่หรือไม่
    if (incorrectAttempts >= MAX_ATTEMPTS) {
        return; 
    }

    // ตรวจสอบคำตอบ... (โค้ดเดิม)

    // ซ่อนผลลัพธ์เก่าทั้งหมด... (โค้ดเดิม)
    
    if (score === totalQuestions) {
        // ตอบถูกทั้งหมด: แสดงข้อความรัก 
        resultArea.classList.remove('hidden');
        quizArea.classList.add('hidden'); 
        submitBtn.classList.add('hidden');
        
        const attemptsInfo = document.getElementById('attempts-info');
        if (attemptsInfo) {
             attemptsInfo.classList.add('hidden'); 
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
        // *** การเปลี่ยนแปลงที่สำคัญ: สร้าง Session ID ใหม่ และบันทึกใน Master Session ***
        const newSessionId = generateUniqueId();
        localStorage.setItem('masterSession', newSessionId);
        currentSessionId = newSessionId;

        // ล้างค่า Attempts ในเครื่องของคุณ (และตั้งค่า Player Session ให้ตรงกับ Master Session)
        localStorage.removeItem('attempts');
        localStorage.setItem('playerSession', newSessionId);
        
        alert("✅ การรีเซ็ตทั้งหมดสมบูรณ์! คุณได้สร้างรหัสรอบเกมใหม่แล้ว \n\nโปรดบอกผู้เล่นที่ถูกล็อกว่า 'ลองเข้าเว็บใหม่' หรือ 'รีเฟรชหน้าเว็บ' เพื่อให้ระบบของเขาทำงาน");
        window.location.reload(); 
    } else {
        alert("❌ ยกเลิกการรีเซ็ต หรือรหัสยืนยันไม่ถูกต้อง");
    }
}

// ฟังก์ชันตรวจสอบรหัสลับ (ใช้เรียกใน Console)
function checkSecretCode() {
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