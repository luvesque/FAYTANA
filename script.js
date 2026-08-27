const projects = [...document.querySelectorAll('.project')];
const backgrounds = [...document.querySelectorAll('.work-bg')];
const filters = [...document.querySelectorAll('.filter')];
const timecode = document.getElementById('timecode');
const form = document.getElementById('contactForm');
const studioWords = [...document.querySelectorAll('.studio-word')];
const scrambleHeading = document.getElementById('scrambleHeading');
const scrambleWords = [...document.querySelectorAll('.scramble-word')];
const emptyState = document.getElementById('emptyState');

const frames = [
  '00:37:14:08','00:14:08:22','00:02:41:16','00:19:33:04',
  '00:07:52:11','00:09:14:02','00:16:44:19','00:04:31:07',
  '00:01:20:12','00:03:08:04','00:00:54:18','00:05:19:09',
  '00:02:47:21','00:06:03:15','00:01:12:05','00:08:42:11'
];

const boot = document.getElementById('boot');
const vfTc = document.getElementById('vfTc');
const focusLabel = document.getElementById('focusLabel');

window.addEventListener('load', () => {
  let f=0;
  const timer=setInterval(()=>{ f++; vfTc.textContent=`00:00:00:${String(f%24).padStart(2,'0')}`; },42);
  setTimeout(()=>{ boot.classList.add('focused'); focusLabel.textContent='FOCUS LOCKED'; },650);
  setTimeout(()=>{ focusLabel.textContent='● RECORDING'; },1450);
  setTimeout(()=>boot.classList.add('recording'),1850);
  setTimeout(()=>{ clearInterval(timer); boot.classList.add('gone'); },2450);
});

function activate(index) {
  projects.forEach((p, i) => p.classList.toggle('active', i === index));
  backgrounds.forEach((b, i) => b.classList.toggle('active', i === index));
  timecode.textContent = frames[index] || '00:00:00:00';
}

projects.forEach(project => {
  const index = Number(project.dataset.index);
  project.addEventListener('mouseenter', () => activate(index));
  project.addEventListener('focus', () => activate(index));
  project.addEventListener('click', () => activate(index));
});

filters.forEach(filter => {
  filter.addEventListener('click', () => {
    const value = filter.dataset.filter;
    filters.forEach(f => f.classList.toggle('active', f === filter));

    let visibleCount = 0;
    projects.forEach(project => {
      const show = value === 'all' || project.dataset.category === value;
      project.hidden = !show;
      if (show) visibleCount++;
    });

    emptyState.classList.toggle('show', visibleCount === 0);

    const firstVisible = projects.find(p => !p.hidden);
    if (firstVisible) activate(Number(firstVisible.dataset.index));
  });
});

/* STUDIO portal rotating words */
let studioWordIndex = 0;
setInterval(() => {
  studioWords.forEach((word, i) => word.classList.toggle('active', i === studioWordIndex));
  studioWordIndex = (studioWordIndex + 1) % studioWords.length;
}, 1200);

/* WE MAKE IMAGES MOVE — physical scramble on hover */
let scrambleTimer = null;

function scrambleOnce() {
  scrambleWords.forEach((word, i) => {
    const x = (Math.random() * 22 - 11).toFixed(1);
    const y = (Math.random() * 18 - 9).toFixed(1);
    const r = (Math.random() * 4 - 2).toFixed(1);
    const ls = (Math.random() * 0.035).toFixed(3);
    word.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
    word.style.letterSpacing = `${ls}em`;
    if (i === 2) word.style.color = '#e8e3da';
  });
}

function resetScramble() {
  scrambleWords.forEach(word => {
    word.style.transform = '';
    word.style.letterSpacing = '';
    word.style.color = '';
  });
}

scrambleHeading.addEventListener('mouseenter', () => {
  scrambleHeading.classList.add('scrambling');
  scrambleOnce();
  scrambleTimer = setInterval(scrambleOnce, 150);
});

scrambleHeading.addEventListener('mouseleave', () => {
  scrambleHeading.classList.remove('scrambling');
  clearInterval(scrambleTimer);
  scrambleTimer = null;
  resetScramble();
});

/* Contact form */
form.addEventListener('submit', event => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const projectType = document.getElementById('projectType').value;
  const message = document.getElementById('message').value.trim();

  const subject = encodeURIComponent(`FAYTANA Inquiry — ${projectType}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nProject Type: ${projectType}\n\n${message}`
  );

  window.location.href = `mailto:faytanafilms@gmail.com?subject=${subject}&body=${body}`;
});
