let name = "", batch = "";
let startI = 0, endI = 0;
let qi = 0, score = 0;
let answers = [];
let sec = 0, timer;

// ================= START QUIZ =================
function startQuiz() {
  name = username.value.trim();
  batch = document.getElementById("batch").value.trim();
  const range = document.querySelector('input[name="range"]:checked');

  if (!name || !batch || !range) {
    alert("Please fill all details");
    return;
  }

  [startI, endI] = range.value.split("-").map(Number);

  // ✅ Shuffle questions ONLY ONCE
  for (let i = startI; i < endI; i++) {
    shuffle(quizData[i]);
  }

  qi = 0;
  score = 0;
  answers = [];
  sec = 0;

  show("quiz");
  welcomeText.innerText = "Welcome, " + name;

  startTimer();
  loadQ();
}

// ================= SHOW CARD =================
function show(id) {
  document.querySelectorAll(".card").forEach(c =>
    c.classList.remove("active")
  );
  document.getElementById(id).classList.add("active");
}

// ================= TIMER =================
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    sec++;
    time.innerText =
      String(Math.floor(sec / 60)).padStart(2, "0") + ":" +
      String(sec % 60).padStart(2, "0");
  }, 1000);
}

// ================= SHUFFLE (ONCE) =================
function shuffle(q) {
  if (q.shuffled) return;

  const correct = q.options[q.answer];
  q.options = [...q.options].sort(() => Math.random() - 0.5);
  q.answer = q.options.indexOf(correct);

  q.shuffled = true;
}

// ================= LOAD QUESTION =================
function loadQ() {
  const q = quizData[startI + qi];

  qno.innerText = `Question ${qi + 1} of ${endI - startI}`;
  question.innerText = q.q;
  options.innerHTML = "";

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.innerText = opt;

    // ✅ restore previous answer
    if (answers[qi] !== undefined) {
      btn.disabled = true;
      if (i === q.answer) btn.classList.add("correct");
      if (answers[qi] === i && i !== q.answer)
        btn.classList.add("wrong");
    }

    btn.onclick = () => selectOption(btn, i, q.answer);
    options.appendChild(btn);
  });
}

// ================= SELECT OPTION =================
function selectOption(btn, i, ans) {
  if (answers[qi] !== undefined) return;

  answers[qi] = i;

  document.querySelectorAll(".options button").forEach((b, bi) => {
    b.disabled = true;
    if (bi === ans) b.classList.add("correct");
  });

  if (i === ans) score++;
  else btn.classList.add("wrong");
}

// ================= NEXT =================
function nextQ() {
  if (qi < endI - startI - 1) {
    qi++;
    loadQ();
  } else {
    showResult();
  }
}

// ================= PREVIOUS =================
function prevQ() {
  if (qi > 0) {
    qi--;
    loadQ();
  }
}

// ================= RESULT =================
function showResult() {
  clearInterval(timer);
  show("result");

  const total = endI - startI;
  const skipped = answers.filter(a => a === undefined).length;

  rname.innerText = name;
  rbatch.innerText = batch;
  rtotal.innerText = total;
  rcorrect.innerText = score;
  rwrong.innerText = total - score - skipped;
  rskip.innerText = skipped;
  rtime.innerText = time.innerText;
}
