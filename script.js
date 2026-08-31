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
  '00:03:07:00', '00:02:45:00', '00:02:23:00', '00:03:18:00', '00:02:35:00', '00:03:00:00', '00:01:58:00', '00:03:28:00', '00:02:41:00', '00:01:23:00', '00:04:50:00', '00:11:44:00', '00:05:55:00', '00:02:09:00', '00:02:47:00', '00:02:14:00', '00:01:06:00', '00:02:45:00', '00:06:52:00', '00:20:17:00', '00:04:59:00'
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


/* ===== REAL THUMBNAILS + FAYTANA EDIT SUITE ===== */
document.querySelectorAll('.frame img').forEach(img => {
  const frame = img.closest('.frame');
  if (img.complete && img.naturalWidth > 0) frame.classList.add('has-media');
  img.addEventListener('load', () => frame.classList.add('has-media'));
  img.addEventListener('error', () => frame.classList.remove('has-media'));
});

const suite = document.getElementById('editSuite');
const suiteTimelineScroll = document.getElementById('suiteTimelineScroll');
const suiteTimelineContent = document.getElementById('suiteTimelineContent');
const suiteVideoTrack = document.getElementById('suiteVideoTrack');
const suiteAudioTrack = document.getElementById('suiteAudioTrack');
const suiteRuler = document.getElementById('suiteRuler');
const suitePlayhead = document.getElementById('suitePlayhead');
const suitePlayheadHead = document.getElementById('suitePlayheadHead');

const suiteMonitor = document.getElementById('suiteMonitor');
const suitePreviewImage = document.getElementById('suitePreviewImage');
const suiteYouTube = document.getElementById('suiteYouTube');
const suiteExternalFallback = document.getElementById('suiteExternalFallback');
const suiteExternalLink = document.getElementById('suiteExternalLink');
const suiteExternalTitle = document.getElementById('suiteExternalTitle');

const suiteProjectCode = document.getElementById('suiteProjectCode');
const suiteProjectTitle = document.getElementById('suiteProjectTitle');
const suiteClient = document.getElementById('suiteClient');
const suiteCategory = document.getElementById('suiteCategory');
const suiteRole = document.getElementById('suiteRole');
const suiteRuntime = document.getElementById('suiteRuntime');
const suiteYear = document.getElementById('suiteYear');
const suiteTopCode = document.getElementById('suiteTopCode');
const suiteTimecode = document.getElementById('suiteTimecode');
const suiteStatusText = document.getElementById('suiteStatusText');
const suiteMonitorCode = document.getElementById('suiteMonitorCode');
const suiteMonitorMode = document.getElementById('suiteMonitorMode');
const suiteEmptyCode = document.getElementById('suiteEmptyCode');
const suiteProgramTitle = document.getElementById('suiteProgramTitle');
const suiteProgramRole = document.getElementById('suiteProgramRole');

let suiteProjects = [];
let suiteSelectedIndex = 0;
let suiteHoverIndex = 0;
let suiteDragging = false;
let suiteOpen = false;
let lastScrubIndex = -1;
let scrubLoadTimer = null;

function normalizeYouTubeId(value){
  if (!value) return '';
  const trimmed = value.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('youtu.be')) return url.pathname.split('/').filter(Boolean)[0] || '';
    if (url.searchParams.get('v')) return url.searchParams.get('v');
    const parts = url.pathname.split('/').filter(Boolean);
    const embedIndex = parts.indexOf('embed');
    if (embedIndex !== -1 && parts[embedIndex + 1]) return parts[embedIndex + 1];
    const shortsIndex = parts.indexOf('shorts');
    if (shortsIndex !== -1 && parts[shortsIndex + 1]) return parts[shortsIndex + 1];
  } catch (e) {}
  return '';
}

function projectData(project, index){
  const code = project.querySelector('.code')?.textContent.trim() || `V_${String(index + 1).padStart(3,'0')}`;
  return {
    element: project,
    index,
    code,
    title: project.querySelector('.title')?.textContent.trim() || 'UNTITLED PROJECT',
    category: project.querySelector('.type')?.textContent.trim() || 'MOTION',
    role: project.querySelector('.role')?.textContent.trim() || '—',
    client: project.dataset.client?.trim() || '—',
    runtime: project.dataset.runtime?.trim() || '—',
    year: project.dataset.year?.trim() || '—',
    youtube: project.dataset.youtube?.trim() || '',
    externalOnly: project.dataset.externalOnly === 'true',
    thumb: `/public/media/motion/v${String(index + 1).padStart(3,'0')}-thumb.webp`
  };
}

function rebuildSuiteProjectData(){
  suiteProjects = Array.from(projects).map(projectData);
}

function clipWidth(){
  const value = getComputedStyle(suiteTimelineContent).getPropertyValue('--clip-w').trim();
  return parseFloat(value) || 180;
}

function makeWaveform(index){
  let bars = '';
  for (let i = 0; i < 48; i++) {
    const value = 8 + ((i * 17 + index * 23) % 29);
    bars += `<i style="height:${value}px"></i>`;
  }
  return bars;
}

function buildSuiteTimeline(){
  rebuildSuiteProjectData();
  suiteVideoTrack.innerHTML = '';
  suiteAudioTrack.innerHTML = '';
  suiteRuler.innerHTML = '';

  suiteProjects.forEach((item, index) => {
    const ruler = document.createElement('div');
    ruler.className = 'suite-ruler-segment';
    ruler.innerHTML = `<span>${String(index).padStart(2,'0')}:00</span>`;
    suiteRuler.appendChild(ruler);

    const clip = document.createElement('button');
    clip.type = 'button';
    clip.className = 'suite-clip';
    clip.dataset.index = String(index);
    clip.setAttribute('aria-label', `${item.code} ${item.title}`);
    clip.innerHTML = `
      <span class="suite-clip-thumb" style="--clip-bg:url('${item.thumb}')"></span>
      <span class="suite-clip-grid"></span>
      <span class="suite-clip-info">
        <span class="suite-clip-code">${item.code}</span>
        <span class="suite-clip-title">${item.title}</span>
      </span>
    `;
    clip.addEventListener('click', () => commitSuiteProject(index, true));
    suiteVideoTrack.appendChild(clip);

    const audio = document.createElement('div');
    audio.className = 'suite-audio-clip';
    audio.innerHTML = `<div class="suite-wave">${makeWaveform(index)}</div>`;
    suiteAudioTrack.appendChild(audio);
  });

  suitePlayhead.setAttribute('aria-valuemax', String(suiteProjects.length));
}

function setClipSelection(index){
  suiteVideoTrack.querySelectorAll('.suite-clip').forEach((clip, i) => {
    clip.classList.toggle('selected', i === index);
  });
}

function setPlayheadForIndex(index, animate = false){
  const width = clipWidth();
  const x = index * width + width * 0.5;
  if (animate) {
    suitePlayhead.style.transition = 'transform .22s cubic-bezier(.2,.75,.25,1)';
    requestAnimationFrame(() => suitePlayhead.style.transform = `translateX(${x}px)`);
    setTimeout(() => suitePlayhead.style.transition = '', 240);
  } else {
    suitePlayhead.style.transform = `translateX(${x}px)`;
  }
  suitePlayhead.setAttribute('aria-valuenow', String(index + 1));
}

function updateSuiteMetadata(index){
  const item = suiteProjects[index];
  if (!item) return;
  suiteProjectCode.textContent = item.code;
  suiteProjectTitle.textContent = item.title;
  suiteClient.textContent = item.client;
  suiteCategory.textContent = item.category;
  suiteRole.textContent = item.role;
  suiteRuntime.textContent = item.runtime;
  suiteYear.textContent = item.year;
  suiteTopCode.textContent = item.code;
  suiteMonitorCode.textContent = item.code;
  suiteEmptyCode.textContent = item.code;
  suiteProgramTitle.textContent = item.title;
  suiteProgramRole.textContent = item.role;
  suiteTimecode.textContent = `00:${String(index).padStart(2,'0')}:00:${String((index * 13) % 24).padStart(2,'0')}`;
}

function stopYouTube(){
  suiteYouTube.src = '';
  suiteMonitor.classList.remove('youtube-mode','external-only');
  if (suiteExternalFallback) suiteExternalFallback.setAttribute('aria-hidden','true');
}

function showStillPreview(index){
  const item = suiteProjects[index];
  if (!item) return;
  stopYouTube();
  suitePreviewImage.src = item.thumb;
  suitePreviewImage.alt = `${item.title} preview`;
  suiteMonitor.classList.add('previewing','has-output');
  suiteMonitorMode.textContent = 'SCRUB PREVIEW';
  suiteStatusText.textContent = 'SCRUBBING ARCHIVE';
}

function showProgram(index, autoplay = true){
  const item = suiteProjects[index];
  if (!item) return;
  const youtubeId = normalizeYouTubeId(item.youtube);

  suiteMonitor.classList.remove('previewing','external-only');
  suiteMonitorMode.textContent = 'PROGRAM';

  if (item.externalOnly) {
    stopYouTube();
    suitePreviewImage.src = item.thumb;
    suitePreviewImage.alt = `${item.title} preview`;
    suiteMonitor.classList.add('previewing','has-output','external-only');
    suiteMonitorMode.textContent = 'EXTERNAL PLAYBACK';
    suiteStatusText.textContent = 'YOUTUBE RESTRICTION';
    if (suiteExternalTitle) suiteExternalTitle.textContent = item.title;
    if (suiteExternalLink) suiteExternalLink.href = `https://www.youtube.com/watch?v=${youtubeId}`;
    if (suiteExternalFallback) suiteExternalFallback.setAttribute('aria-hidden','false');
    return;
  }

  if (youtubeId) {
    suiteYouTube.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1`;
    suiteMonitor.classList.add('youtube-mode','has-output');
    suiteStatusText.textContent = 'PROGRAM ONLINE';
  } else {
    showStillPreview(index);
    suiteMonitorMode.textContent = 'PREVIEW';
    suiteStatusText.textContent = 'YOUTUBE LINK NOT ROUTED';
  }
}

function ensureClipVisible(index){
  const width = clipWidth();
  const targetCenter = index * width + width / 2;
  const desired = targetCenter - suiteTimelineScroll.clientWidth / 2;
  const max = Math.max(0, suiteTimelineScroll.scrollWidth - suiteTimelineScroll.clientWidth);
  suiteTimelineScroll.scrollTo({left: Math.max(0, Math.min(desired, max)), behavior:'smooth'});
}

function commitSuiteProject(index, center = false){
  index = Math.max(0, Math.min(index, suiteProjects.length - 1));
  suiteSelectedIndex = index;
  suiteHoverIndex = index;
  lastScrubIndex = index;
  updateSuiteMetadata(index);
  setClipSelection(index);
  setPlayheadForIndex(index, true);
  showProgram(index, true);
  if (center) ensureClipVisible(index);
}

function previewSuiteProject(index){
  index = Math.max(0, Math.min(index, suiteProjects.length - 1));
  if (index === lastScrubIndex) return;
  lastScrubIndex = index;
  suiteHoverIndex = index;
  updateSuiteMetadata(index);
  setClipSelection(index);
  showStillPreview(index);
}

function openSuite(project){
  if (!suiteProjects.length) buildSuiteTimeline();
  const index = Number(project.dataset.index || 0);
  suiteOpen = true;
  suite.classList.add('open');
  suite.setAttribute('aria-hidden','false');
  document.body.classList.add('suite-open');
  suiteSelectedIndex = index;
  suiteHoverIndex = index;
  lastScrubIndex = index;
  updateSuiteMetadata(index);
  setClipSelection(index);
  requestAnimationFrame(() => {
    setPlayheadForIndex(index, false);
    ensureClipVisible(index);
    showProgram(index, true);
  });
}

function closeSuite(){
  suiteOpen = false;
  suiteDragging = false;
  clearTimeout(scrubLoadTimer);
  suite.classList.remove('open');
  suite.setAttribute('aria-hidden','true');
  document.body.classList.remove('suite-open');
  stopYouTube();
  suitePreviewImage.src = '';
  suiteMonitor.classList.remove('previewing');
}

function timelineIndexFromClientX(clientX){
  const rect = suiteTimelineContent.getBoundingClientRect();
  const localX = clientX - rect.left;
  const width = clipWidth();
  return Math.max(0, Math.min(Math.floor(localX / width), suiteProjects.length - 1));
}

function movePlayheadRaw(clientX){
  const rect = suiteTimelineContent.getBoundingClientRect();
  const totalWidth = clipWidth() * suiteProjects.length;
  const x = Math.max(0, Math.min(clientX - rect.left, totalWidth));
  suitePlayhead.style.transform = `translateX(${x}px)`;
  previewSuiteProject(timelineIndexFromClientX(clientX));
}

suitePlayheadHead.addEventListener('pointerdown', event => {
  if (!suiteOpen) return;
  suiteDragging = true;
  suitePlayheadHead.setPointerCapture(event.pointerId);
  stopYouTube();
  event.preventDefault();
});
suitePlayheadHead.addEventListener('pointermove', event => {
  if (suiteDragging) movePlayheadRaw(event.clientX);
});
function finishScrub(event){
  if (!suiteDragging) return;
  suiteDragging = false;
  if (event && suitePlayheadHead.hasPointerCapture(event.pointerId)) {
    suitePlayheadHead.releasePointerCapture(event.pointerId);
  }
  suiteSelectedIndex = suiteHoverIndex;
  setPlayheadForIndex(suiteSelectedIndex, true);
  setClipSelection(suiteSelectedIndex);
  clearTimeout(scrubLoadTimer);
  scrubLoadTimer = setTimeout(() => showProgram(suiteSelectedIndex, true), 180);
}
suitePlayheadHead.addEventListener('pointerup', finishScrub);
suitePlayheadHead.addEventListener('pointercancel', finishScrub);

suitePlayhead.addEventListener('keydown', event => {
  if (!suiteOpen || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
  event.preventDefault();
  commitSuiteProject(suiteSelectedIndex + (event.key === 'ArrowRight' ? 1 : -1), true);
});

suiteTimelineContent.addEventListener('pointerdown', event => {
  if (event.target.closest('.suite-clip') || event.target === suitePlayheadHead) return;
  commitSuiteProject(timelineIndexFromClientX(event.clientX), false);
});

projects.forEach(project => project.addEventListener('click', () => openSuite(project)));
document.querySelectorAll('[data-close-suite]').forEach(el => el.addEventListener('click', closeSuite));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && suite.classList.contains('open')) closeSuite();
});
window.addEventListener('resize', () => {
  if (suiteOpen) setPlayheadForIndex(suiteSelectedIndex, false);
});

buildSuiteTimeline();
