const questions=[
 {q:"หัวใจมีหน้าที่สำคัญอย่างไร",a:["สูบฉีดเลือดไปทั่วร่างกาย","ย่อยอาหารในกระเพาะ","กรองอากาศที่หายใจเข้า","ควบคุมการมองเห็น"],c:0,e:"หัวใจทำหน้าที่สูบฉีดเลือดไปยังส่วนต่าง ๆ ของร่างกาย"},
 {q:"อวัยวะใดทำหน้าที่แลกเปลี่ยนก๊าซในการหายใจ",a:["หัวใจ","ปอด","สมอง","ไต"],c:1,e:"ปอดเป็นบริเวณสำคัญที่เกิดการแลกเปลี่ยนออกซิเจนและคาร์บอนไดออกไซด์"},
 {q:"สมองเกี่ยวข้องกับหน้าที่ใดมากที่สุด",a:["สูบฉีดเลือด","แลกเปลี่ยนก๊าซ","ควบคุมและประสานงานร่างกาย","ดูดซึมสารอาหารในลำไส้"],c:2,e:"สมองควบคุมและประสานงานการทำงานหลายส่วนของร่างกาย"},
 {q:"เลือดช่วยลำเลียงสิ่งใดไปยังเซลล์",a:["ออกซิเจนและสารอาหาร","เสียงและแสง","กระดูกและกล้ามเนื้อ","อากาศภายนอก"],c:0,e:"เลือดช่วยนำออกซิเจนและสารอาหารไปให้เซลล์"},
 {q:"ก๊าซใดที่ร่างกายรับเข้าสู่เลือดจากการแลกเปลี่ยนก๊าซในปอด",a:["ไนโตรเจน","ออกซิเจน","คาร์บอนไดออกไซด์","ไฮโดรเจน"],c:1,e:"ออกซิเจนจากอากาศเข้าสู่เลือดที่ปอด"},
 {q:"สมองและไขสันหลังเป็นส่วนสำคัญของระบบใด",a:["ระบบย่อยอาหาร","ระบบไหลเวียนเลือด","ระบบประสาท","ระบบหายใจ"],c:2,e:"สมองและไขสันหลังเป็นองค์ประกอบสำคัญของระบบประสาท"},
 {q:"อวัยวะใดเป็นกล้ามเนื้อที่ทำงานสูบฉีดเลือด",a:["ปอด","สมอง","หัวใจ","หลอดลม"],c:2,e:"หัวใจเป็นอวัยวะกล้ามเนื้อที่สูบฉีดเลือด"},
 {q:"การดูแลระบบหายใจที่เหมาะสมคือข้อใด",a:["อยู่ในบริเวณที่มีควันเป็นเวลานาน","หลีกเลี่ยงควันบุหรี่และมลพิษทางอากาศ","กลั้นหายใจเป็นประจำ","ไม่จำเป็นต้องออกกำลังกาย"],c:1,e:"การหลีกเลี่ยงควันและมลพิษช่วยลดการสัมผัสสิ่งระคายเคืองต่อระบบหายใจ"}
];
let qi=0,score=0,answered=false;
const start=$("#quizStart"),area=$("#quizArea"),result=$("#quizResult");
$("#beginQuiz").addEventListener("click",()=>{qi=0;score=0;start.hidden=true;result.hidden=true;area.hidden=false;renderQuestion();});
function renderQuestion(){
 answered=false;$("#questionCount").textContent=`ข้อ ${qi+1}/${questions.length}`;
 $("#quizProgress").style.width=`${qi/questions.length*100}%`;
 $("#questionText").textContent=questions[qi].q;$("#answerFeedback").textContent="";
 $("#nextQuestion").disabled=true;$("#nextQuestion").textContent=qi===questions.length-1?"ดูผลคะแนน":"ข้อต่อไป";
 const options=$("#answerOptions");options.innerHTML="";
 questions[qi].a.forEach((label,index)=>{
  const b=document.createElement("button");b.className="answer-option";b.textContent=`${["ก","ข","ค","ง"][index]}. ${label}`;
  b.addEventListener("click",()=>chooseAnswer(index,b));options.appendChild(b);
 });
}
function chooseAnswer(index,button){
 if(answered)return;answered=true;const q=questions[qi];const buttons=[...$("#answerOptions").children];
 buttons.forEach((b,i)=>{b.disabled=true;if(i===q.c)b.classList.add("correct");});
 if(index===q.c){score++;$("#answerFeedback").textContent="✓ "+q.e;}
 else{$("#answerFeedback").textContent="✦ คำอธิบาย: "+q.e;button.classList.add("wrong");}
 $("#nextQuestion").disabled=false;$("#quizProgress").style.width=`${(qi+1)/questions.length*100}%`;
}
$("#nextQuestion").addEventListener("click",()=>{if(!answered)return;qi++;if(qi<questions.length)renderQuestion();else showResult();});
function showResult(){
 area.hidden=true;result.hidden=false;const pct=Math.round(score/questions.length*100);
 result.innerHTML=`<div class="quiz-icon">🎉</div><h3>ทำแบบทดสอบเสร็จแล้ว</h3><div class="result-score">${score}/${questions.length}</div><p>คิดเป็น ${pct}%</p><p>${pct>=80?"ยอดเยี่ยม! ทบทวนความรู้ได้ดี":"ลองกลับไปอ่านบทเรียน แล้วทำแบบทดสอบอีกครั้งนะ"}</p><button class="btn primary" id="retryQuiz">ทำแบบทดสอบอีกครั้ง</button>`;
 $("#retryQuiz").addEventListener("click",()=>{$("#beginQuiz").click();});
}
