const intro=document.getElementById('intro');
const projects=[...document.querySelectorAll('.project')];
const backgrounds=[...document.querySelectorAll('.work-bg')];
const timecode=document.getElementById('timecode');
const frames=['00:37:14:08','00:14:08:22','00:02:41:16','00:19:33:04','00:07:52:11'];

window.addEventListener('load',()=>setTimeout(()=>intro.classList.add('gone'),1500));

function activate(index){
  projects.forEach((p,i)=>p.classList.toggle('active',i===index));
  backgrounds.forEach((b,i)=>b.classList.toggle('active',i===index));
  timecode.textContent=frames[index]||'00:00:00:00';
}
projects.forEach(p=>{
  const i=Number(p.dataset.index);
  p.addEventListener('mouseenter',()=>activate(i));
  p.addEventListener('click',()=>activate(i));
});
