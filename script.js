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
const playhead = document.getElementById('playhead');
const previewFile = document.getElementById('previewFile');
const previewRole = document.getElementById('previewRole');
const previewFrame = document.getElementById('previewFrame');
const tlTc = document.getElementById('tlTc');
const tlStatus = document.getElementById('tlStatus');

window.addEventListener('load', () => {
  const totalDuration = 5900;
  const playbackStart = 1550;
  const playbackEnd = 4550;
  const playbackDuration = playbackEnd - playbackStart;

  const timelineShell = document.getElementById('timelineShell');
  const shellRect = () => timelineShell.getBoundingClientRect();

  const cuts = [
    { start: 0.00, end: 0.18, file:'V_001', role:'FULL PRODUCTION',
      bg:'linear-gradient(135deg,#1d1013,#070707 55%,#5e2530)' },
    { start: 0.18, end: 0.41, file:'V_009', role:'EDITOR',
      bg:'radial-gradient(circle at 68% 30%,#6c4435,transparent 22%),linear-gradient(135deg,#080808,#191516)' },
    { start: 0.41, end: 0.56, file:'V_016', role:'FULL PRODUCTION',
      bg:'linear-gradient(120deg,#080808,#35131a 48%,#050505)' },
    { start: 0.56, end: 0.85, file:'V_004', role:'FULL PRODUCTION',
      bg:'radial-gradient(circle at 42% 52%,#66615c,transparent 12%),linear-gradient(145deg,#050505,#171214)' },
    { start: 0.85, end: 1.00, file:'V_003', role:'FULL PRODUCTION',
      bg:'linear-gradient(145deg,#0b0b0b,#251317 55%,#090909)' }
  ];

  const startTime = performance.now();

  setTimeout(() => {
    boot.classList.add('ready');
    tlStatus.textContent = 'ASSEMBLING TIMELINE...';
  }, 250);

  setTimeout(() => {
    boot.classList.add('built');
    tlStatus.textContent = 'SEQUENCE READY';
  }, 900);

  function setPreview(cut){
    if (previewFile.textContent !== cut.file){
      previewFile.textContent = cut.file;
      previewRole.textContent = cut.role;
      previewFrame.style.background = cut.bg;
    }
  }

  function frame(now){
    const elapsed = now - startTime;

    if (elapsed >= playbackStart && elapsed <= playbackEnd){
      const p = Math.max(0, Math.min(1, (elapsed - playbackStart) / playbackDuration));
      const rect = shellRect();
      const leftPad = 42;
      const usable = rect.width - leftPad;
      playhead.style.transform = `translateX(${usable * p}px)`;

      const current = cuts.find(c => p >= c.start && p < c.end) || cuts[cuts.length - 1];
      setPreview(current);

      const totalFrames = Math.floor(p * 6 * 24);
      const sec = Math.floor(totalFrames / 24);
      const fr = totalFrames % 24;
      tlTc.textContent = `00:00:0${sec}:${String(fr).padStart(2,'0')}`;
      tlStatus.textContent = 'PLAYING SEQUENCE';
    }

    if (elapsed < totalDuration) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

  setTimeout(() => {
    tlStatus.textContent = 'CONFORMING TO FAYTANA ARCHIVE';
  }, 4600);

  setTimeout(() => {
    boot.classList.add('bleeding');
  }, 4850);

  setTimeout(() => {
    boot.classList.add('home-bleed');
    document.body.classList.add('home-reveal');
  }, 5200);

  // At this point the intro has already become transparent.
  // Remove it without another opacity fade so there is only ONE visual handoff.
  setTimeout(() => {
    boot.classList.add('gone');
  }, 5550);
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


/* ===== REAL MEDIA + FILM LIGHTBOX ===== */
document.querySelectorAll('.work-bg video').forEach(video => {
  const holder = video.closest('.work-bg');

  video.addEventListener('loadeddata', () => {
    holder.classList.add('has-media');
  });

  video.addEventListener('error', () => {
    holder.classList.remove('has-media');
  });
});

document.querySelectorAll('.frame img').forEach(img => {
  const frame = img.closest('.frame');

  if (img.complete && img.naturalWidth > 0) {
    frame.classList.add('has-media');
  }

  img.addEventListener('load', () => frame.classList.add('has-media'));
  img.addEventListener('error', () => frame.classList.remove('has-media'));
});

function syncPreviewVideos(activeIndex){
  document.querySelectorAll('.work-bg').forEach((bg, i) => {
    const video = bg.querySelector('video');
    if (!video) return;

    if (i === activeIndex && bg.classList.contains('has-media')) {
      const playAttempt = video.play();
      if (playAttempt && typeof playAttempt.catch === 'function') {
        playAttempt.catch(() => {});
      }
    } else {
      video.pause();
    }
  });
}

const originalActivate = activate;
activate = function(index){
  originalActivate(index);
  syncPreviewVideos(index);
};

const filmLightbox = document.getElementById('filmLightbox');
const filmPlayer = document.getElementById('filmPlayer');
const filmLightboxCode = document.getElementById('filmLightboxCode');
const filmLightboxTitle = document.getElementById('filmLightboxTitle');
const filmLightboxCategory = document.getElementById('filmLightboxCategory');
const filmLightboxRole = document.getElementById('filmLightboxRole');

function normalizeYouTubeId(value){
  if (!value) return '';
  const trimmed = value.trim();

  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.split('/').filter(Boolean)[0] || '';
    }
    if (url.searchParams.get('v')) {
      return url.searchParams.get('v');
    }
    const parts = url.pathname.split('/').filter(Boolean);
    const embedIndex = parts.indexOf('embed');
    if (embedIndex !== -1 && parts[embedIndex + 1]) {
      return parts[embedIndex + 1];
    }
    const shortsIndex = parts.indexOf('shorts');
    if (shortsIndex !== -1 && parts[shortsIndex + 1]) {
      return parts[shortsIndex + 1];
    }
  } catch (e) {}

  return '';
}

function openFilm(project){
  const youtubeId = normalizeYouTubeId(project.dataset.youtube);

  if (!youtubeId) {
    return;
  }

  const code = project.querySelector('.code')?.textContent.trim() || '';
  const title = project.querySelector('.title')?.textContent.trim() || '';
  const category = project.querySelector('.type')?.textContent.trim() || '';
  const role = project.querySelector('.role')?.textContent.trim() || '';

  filmLightboxCode.textContent = code;
  filmLightboxTitle.textContent = title;
  filmLightboxCategory.textContent = category;
  filmLightboxRole.textContent = role;

  filmPlayer.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
  filmLightbox.classList.add('open');
  filmLightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('film-open');
}

function closeFilm(){
  filmLightbox.classList.remove('open');
  filmLightbox.setAttribute('aria-hidden', 'true');
  filmPlayer.src = '';
  document.body.classList.remove('film-open');
}

projects.forEach(project => {
  project.addEventListener('click', () => openFilm(project));
});

document.querySelectorAll('[data-close-film]').forEach(el => {
  el.addEventListener('click', closeFilm);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && filmLightbox.classList.contains('open')) {
    closeFilm();
  }
});
