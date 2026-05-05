// متغيرات عامة
let currentQuestion = 0;
let userAnswers = [];
let timeLeft = 150;
let timerInterval;

// اظهار واجهة الترحيب
function renderWelcome() {
  let content = `
    <div class="container">
      <h1>اختبار DOM/BOM</h1>
      <form>
        <label>اسم الطالب</label>
        <input id="user-name" type="text"/><br>
        <p id="error-message" style="display:none;color:red;">الاسم مطلوب</p>
        <button id="btn-start" type="button">ابدا</button>
      </form>
    </div>
  `;
  document.getElementById("app").innerHTML = content;

  let btnStart = document.getElementById("btn-start");
  let userName = document.getElementById("user-name");
  let errorMsg = document.getElementById("error-message");

  btnStart.addEventListener("click", () => {
    if (userName.value.trim() == "") {
      errorMsg.style.display = "block";
      return;
    }
    errorMsg.style.display = "none";
    localStorage.setItem("user", JSON.stringify(userName.value));
    startQuiz();
  });
}

renderWelcome();

// الشريط السفلي
document.getElementById("meta").innerHTML = `
<div class="meta-box">
<p> وضع العرض: عادي</p>
<p> الحجم: ${window.innerWidth} × ${window.innerHeight}</p>
<p> الرابط: ${document.URL}</p>
</div>
`;

// الأسئلة
let question = [
  {
    id: 1,
    title: "ما وظيفة localStorage؟",
    options: ["تخزين مؤقت للتبويب", "تخزين دائم نسبيًا", "إدارة الأحداث"],
    answer: 1,
  },
  {
    id: 2,
    title: "أي حدث مناسب لمنع إرسال فورم؟",
    options: ["click", "submit", "load"],
    answer: 1,
  },
  {
    id: 3,
    title: "ما دور history.pushState؟",
    options: [
      "إعادة تحميل الصفحة",
      "تعديل سجل التنقل دون Reload",
      "حذف الرابط",
    ],
    answer: 1,
  },
  {
    id: 4,
    title: "ما الفرق بين target و currentTarget؟",
    options: [
      "لا فرق",
      "target العنصر الأصلي للحدث",
      "currentTarget لا يعمل مع delegation",
    ],
    answer: 1,
  },
];

// بداية الاختبار
function startQuiz() {
  clearInterval(timerInterval);

  let q = question[currentQuestion];

  let optionHtml = "";
  q.options.forEach((opt, index) => {
    optionHtml += `<div class="option" onclick="check(this, ${index})">${opt}</div>`;
  });

  let content = `
  <div class="card container">
    <div class="heade-quiz">
      <h2>
        ${JSON.parse(localStorage.getItem("user"))} 
        - سؤال ${currentQuestion + 1} / ${question.length}
      </h2>
      <div class="timer"></div>
    </div>

    <p>${q.title}</p>

    ${optionHtml}

    <button id="prev">السابق</button>
    <button id="next">التالي</button>
  </div>
  `;

  document.getElementById("app").innerHTML = content;

  document.getElementById("prev").addEventListener("click", () => {
    clearInterval(timerInterval);
    if (currentQuestion > 0) {
      currentQuestion--;
      startQuiz();
    }
  });

  document.getElementById("next").addEventListener("click", () => {
    clearInterval(timerInterval);

    if (currentQuestion == question.length - 1) {
      showResult();
      return;
    }

    currentQuestion++;
    startQuiz();
  });

  startTimer();
}

// المؤقت
function startTimer() {
  timeLeft = 150;
  let timerElement = document.querySelector(".timer");
  timerInterval = setInterval(() => {
    timeLeft--;

    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    timerElement.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    if (timeLeft <= 30) {
      timerElement.style.color = "red";
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showResult();
    }
  }, 1000);
}
// اختيار الإجابة
function check(element, selectedIndex) {
  let options = element.parentElement.querySelectorAll(".option");

  options.forEach((opt) => (opt.style.background = ""));

  element.style.background = "#cce5ff";

  userAnswers[currentQuestion] = selectedIndex;
}

// عرض النتيجة
function showResult() {
  clearInterval(timerInterval);
  let score = 0;
  question.forEach((q, index) => {
    if (userAnswers[index] === q.answer) {
      score++;
    }
  });

  let content = `
    <div class="container">
      <h2>النتيجة النهائية</h2>
      <p>عدد الإجابات الصحيحة: ${score} من ${question.length}</p>
      <button id="btn-try">اعادة المحاولة</button>
      <button id="btn-home">الصفحة الرئيسية</button>
    </div>
  `;

  document.getElementById("app").innerHTML = content;

  document.getElementById("btn-try").addEventListener("click", () => {
    currentQuestion = 0;
    userAnswers = [];
    startQuiz();
  });

  document.getElementById("btn-home").addEventListener("click", () => {
    currentQuestion = 0;
    userAnswers = [];
    renderWelcome();
  });
}
