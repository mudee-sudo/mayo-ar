const $ = (s) => document.querySelector(s);
const tabs = [...document.querySelectorAll(".tab")];
function showPage(name){
  document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${name}`));
  tabs.forEach(t=>t.classList.toggle("active",t.dataset.page===name));
  window.scrollTo({top:0,behavior:"smooth"});
}
tabs.forEach(t=>t.addEventListener("click",()=>showPage(t.dataset.page)));
document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.goto)));

const viewer=$("#organModel");
const reset=$("#resetCamera");
const rotate=$("#toggleRotate");
let rotating=true;
reset.addEventListener("click",()=>{viewer.cameraOrbit="auto auto auto";viewer.cameraTarget="auto auto auto";viewer.fieldOfView="auto";});
rotate.addEventListener("click",()=>{rotating=!rotating;viewer.autoRotate=rotating;rotate.textContent=rotating?"หยุดหมุนอัตโนมัติ":"เริ่มหมุนอัตโนมัติ";});
viewer.addEventListener("error",()=>{$("#arSupportNote").textContent="โหลด heart.glb ไม่สำเร็จ ตรวจสอบว่าไฟล์ heart.glb อยู่ในโฟลเดอร์หลักเดียวกับ index.html และชื่อไฟล์ตรงกัน";});
viewer.addEventListener("load",()=>{if(!viewer.canActivateAR){$("#arSupportNote").textContent="อุปกรณ์หรือเบราว์เซอร์อาจไม่รองรับการวาง AR โดยตรง แต่ยังดู หมุน และซูมโมเดล 3 มิติได้";}});

document.querySelectorAll(".organ-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    if(btn.disabled)return;
    document.querySelectorAll(".organ-btn").forEach(x=>x.classList.remove("selected"));
    btn.classList.add("selected");
  });
});

// MindAR image tracking. The .mind target file must be compiled from the supplied target image first.
let mindarInstance=null;
const startBtn=$("#startScan"), stopBtn=$("#stopScan"), scanWrap=$("#scanWrap"), scanStatus=$("#scanStatus");
function loadScript(src){
  return new Promise((resolve,reject)=>{
    if([...document.scripts].some(s=>s.src===new URL(src,location.href).href)){resolve();return;}
    const s=document.createElement("script");s.src=src;s.onload=resolve;s.onerror=()=>reject(new Error("โหลดไลบรารี AR ไม่สำเร็จ"));document.head.appendChild(s);
  });
}
startBtn.addEventListener("click",async()=>{
  showPage("ar");scanWrap.hidden=false;startBtn.disabled=true;scanStatus.textContent="กำลังเตรียมระบบสแกนภาพ…";
  try{
    const response=await fetch("./targets/heart.mind",{method:"HEAD",cache:"no-store"});
    if(!response.ok)throw new Error("ยังไม่พบไฟล์ targets/heart.mind กรุณาทำตามขั้นตอนใน README ก่อน");
    await loadScript("https://aframe.io/releases/1.5.0/aframe.min.js");
    await loadScript("https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js");
    const host=$("#mindar-container");
    host.innerHTML=`<a-scene mindar-image="imageTargetSrc: ./targets/heart.mind; autoStart: false; uiScanning: yes; uiLoading: no" embedded color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">
      <a-assets><a-asset-item id="heartAsset" src="./heart.glb"></a-asset-item></a-assets>
      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
      <a-entity mindar-image-target="targetIndex: 0">
        <a-gltf-model src="#heartAsset" position="0 0 0.1" rotation="0 0 0" scale="0.45 0.45 0.45"></a-gltf-model>
      </a-entity>
    </a-scene>`;
    const scene=host.querySelector("a-scene");
    await new Promise((resolve,reject)=>{
      if(scene.hasLoaded)return resolve();
      scene.addEventListener("loaded",resolve,{once:true});
      setTimeout(()=>reject(new Error("เตรียมฉาก AR ไม่สำเร็จ กรุณาลองใหม่")),15000);
    });
    mindarInstance=scene.systems["mindar-image-system"];
    await mindarInstance.start();
    scanStatus.textContent="กำลังสแกน… หันกล้องไปยังบัตรภาพหัวใจ";
  }catch(err){
    scanStatus.textContent=err.message||"ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการใช้กล้องและเปิดผ่าน HTTPS";
    stopBtn.textContent="ปิด";
  }finally{startBtn.disabled=false;}
});
async function stopImageScan(){
  try{if(mindarInstance){await mindarInstance.stop();mindarInstance=null;}}catch(e){}
  const host=$("#mindar-container");if(host)host.innerHTML="";
  scanWrap.hidden=true;scanStatus.textContent="ปิดกล้องแล้ว";
}
stopBtn.addEventListener("click",stopImageScan);
document.addEventListener("visibilitychange",()=>{if(document.hidden&&mindarInstance)stopImageScan();});
