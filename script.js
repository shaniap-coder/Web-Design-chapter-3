let name="", batch="";
let startI=0, endI=0;
let qi=0, score=0;
let answers=[];
let sec=0, timer;

function startQuiz(){
  name=username.value.trim();
  batch=document.getElementById("batch").value.trim();
  const range=document.querySelector('input[name="range"]:checked');

  if(!name||!batch||!range){
    alert("Please fill all details");
    return;
  }

  [startI,endI]=range.value.split("-").map(Number);

  show("quiz");
  welcomeText.innerText="Welcome, "+name;
  startTimer();
  loadQ();
}

function show(id){
  document.querySelectorAll(".card").forEach(c=>c.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function startTimer(){
  clearInterval(timer);
  timer=setInterval(()=>{
    sec++;
    time.innerText=
      String(Math.floor(sec/60)).padStart(2,"0")+":"+
      String(sec%60).padStart(2,"0");
  },1000);
}

function shuffle(q){
  const ans=q.options[q.answer];
  q.options=[...q.options].sort(()=>Math.random()-0.5);
  q.answer=q.options.indexOf(ans);
}

function loadQ(){
  const q=quizData[startI+qi];
  shuffle(q);

  qno.innerText=`Question ${qi+1} of ${endI-startI}`;
  question.innerText=q.q;
  options.innerHTML="";

  q.options.forEach((o,i)=>{
    const b=document.createElement("button");
    b.innerText=o;

    if(answers[qi]!==undefined){
      b.disabled=true;
      if(i===q.answer) b.classList.add("correct");
      if(answers[qi]===i && i!==q.answer) b.classList.add("wrong");
    }

    b.onclick=()=>selectOption(b,i,q.answer);
    options.appendChild(b);
  });
}

function selectOption(btn,i,ans){
  if(answers[qi]!==undefined) return;
  answers[qi]=i;

  document.querySelectorAll(".options button").forEach((b,bi)=>{
    b.disabled=true;
    if(bi===ans) b.classList.add("correct");
  });

  if(i===ans) score++;
  else btn.classList.add("wrong");
}

function nextQ(){
  if(qi<endI-startI-1){
    qi++;
    loadQ();
  }else{
    showResult();
  }
}

function prevQ(){
  if(qi>0){
    qi--;
    loadQ();
  }
}

function showResult(){
  clearInterval(timer);
  show("result");

  const total=endI-startI;
  const skipped=answers.filter(a=>a===undefined).length;

  rname.innerText=name;
  rbatch.innerText=batch;
  rtotal.innerText=total;
  rcorrect.innerText=score;
  rwrong.innerText=total-score-skipped;
  rskip.innerText=skipped;
  rtime.innerText=time.innerText;
}
