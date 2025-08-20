// Nirvana Tech Fest 2025 – Interactivity
(function() {
    function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

    function applyTheme(theme) {
        const root = document.documentElement;
        if (theme === 'light') root.setAttribute('data-theme', 'light');
        else root.removeAttribute('data-theme');
        localStorage.setItem('theme', theme);
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            const isLight = theme === 'light';
            toggle.setAttribute('aria-pressed', String(isLight));
            toggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
            // Swap logo color based on theme if we detect white/color SVGs
            document.querySelectorAll('.logo').forEach(img => {
                const lightLogo = 'New folder/color.svg';
                const darkLogo = 'New folder/white.svg';
                img.src = isLight ? lightLogo : darkLogo;
            });
        }
    }

    function initTheme() {
        const stored = localStorage.getItem('theme');
        if (stored === 'light' || stored === 'dark') {
            applyTheme(stored);
        } else {
            const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
            applyTheme(prefersLight ? 'light' : 'dark');
        }
        const toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                const current = localStorage.getItem('theme') || 'dark';
                applyTheme(current === 'light' ? 'dark' : 'light');
            });
        }
    }

    function initSplash() {
        if (!/landing\.html$/i.test(location.pathname)) return;
        const enterBtn = document.getElementById('enterBtn');
        const targetUrl = 'index.html';
        function go() { location.href = targetUrl; }
        if (enterBtn) enterBtn.addEventListener('click', go);

        // Build background video wall
        const videosEl = document.getElementById('splashVideos');
        const sources = [
            // Add/replace with your local MP4/WebM clips for tech vibe
            { src: 'https://cdn.coverr.co/videos/coverr-typing-on-a-laptop-typing-on-a-laptop-9543/1080p.mp4', type: 'video/mp4' },
            { src: 'https://cdn.coverr.co/videos/coverr-programming-typing-9715/1080p.mp4', type: 'video/mp4' },
            { src: 'https://cdn.coverr.co/videos/coverr-server-room-3870/1080p.mp4', type: 'video/mp4' }
        ];
        if (videosEl) {
            sources.forEach((s, i) => {
                const v = document.createElement('video');
                v.src = s.src;
                v.autoplay = true;
                v.muted = true;
                v.loop = true;
                v.playsInline = true;
                v.style.opacity = i === 0 ? '1' : '0';
                v.style.transition = 'opacity 1s ease';
                videosEl.appendChild(v);
            });
            // Crossfade
            const vids = Array.from(videosEl.querySelectorAll('video'));
            let idx = 0;
            setInterval(() => {
                const next = (idx + 1) % vids.length;
                vids[idx].style.opacity = '0';
                vids[next].style.opacity = '1';
                idx = next;
            }, 7000);
        }

        // Constellation canvas
        const canvas = document.getElementById('splashCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let w, h, particles;
            function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
            function spawn() {
                particles = Array.from({ length: 90 }, () => ({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - .5) * .4,
                    vy: (Math.random() - .5) * .4,
                    r: Math.random() * 1.6 + .4
                }));
            }
            function step() {
                ctx.clearRect(0,0,w,h);
                ctx.fillStyle = 'rgba(255,255,255,.8)';
                particles.forEach(p => {
                    p.x += p.vx; p.y += p.vy;
                    if (p.x < 0 || p.x > w) p.vx *= -1;
                    if (p.y < 0 || p.y > h) p.vy *= -1;
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
                });
                // lines
                for (let i=0;i<particles.length;i++) {
                    for (let j=i+1;j<particles.length;j++) {
                        const a = particles[i], b = particles[j];
                        const dx = a.x - b.x, dy = a.y - b.y; const d = Math.hypot(dx,dy);
                        if (d < 120) {
                            ctx.strokeStyle = `rgba(139,92,246,${(1 - d/120) * .35})`;
                            ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
                        }
                    }
                }
                requestAnimationFrame(step);
            }
            resize(); spawn(); step();
            window.addEventListener('resize', () => { resize(); spawn(); });
        }

        // Ticker
        const track = document.getElementById('tickerTrack');
        if (track) {
            const items = ['Hackathon','Workshops','Robotics','Gaming Arena','Drone Race','Science Exhibition','Quiz Bowl'];
            const row = items.concat(items).map(label => `<span class="ticker-item"><span class=\"ticker-dot\"></span>${label}</span>`).join('');
            track.innerHTML = row + row; // extra for seamless loop
        }

        // Countdown (set your fest start date here)
        const countdown = document.getElementById('countdown');
        if (countdown) {
            const startsAt = new Date('2025-03-07T10:00:00');
            const tick = () => {
                const diff = startsAt - new Date();
                if (diff <= 0) { countdown.textContent = 'We are live!'; return; }
                const d = Math.floor(diff/86400000);
                const h = Math.floor(diff%86400000/3600000);
                const m = Math.floor(diff%3600000/60000);
                const s = Math.floor(diff%60000/1000);
                countdown.textContent = `${d}d ${h}h ${m}m ${s}s`;
            };
            tick(); setInterval(tick, 1000);
        }

        // Magnetic button hover
        const magnetic = document.querySelector('.magnetic');
        if (magnetic) {
            magnetic.addEventListener('mousemove', (e) => {
                const rect = magnetic.getBoundingClientRect();
                magnetic.style.setProperty('--mx', `${e.clientX - rect.left}px`);
                magnetic.style.setProperty('--my', `${e.clientY - rect.top}px`);
            });
        }
        // Floating particles
        const beams = document.querySelector('.splash-beams');
        if (beams) {
            for (let i = 0; i < 20; i++) {
                const p = document.createElement('span');
                p.style.position = 'absolute';
                p.style.left = Math.random() * 100 + '%';
                p.style.top = Math.random() * 100 + '%';
                p.style.width = p.style.height = Math.random() * 3 + 1 + 'px';
                p.style.background = 'rgba(255,255,255,.35)';
                p.style.borderRadius = '999px';
                p.style.filter = 'blur(0.5px)';
                p.style.animation = `float ${6 + Math.random() * 6}s ease-in-out ${Math.random()}s infinite`;
                beams.appendChild(p);
            }
        }
    }

    const EVENTS = {
        science_exhibition: {
            title: 'Science Exhibition',
            description: 'Showcase innovative projects and experiments across physics, chemistry, biology, and beyond. Open to school teams with exciting prizes.',
            date: 'March 7, 2025',
            time: '10:00 AM – 3:00 PM',
            venue: 'Atrium Hall A',
            image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1600&auto=format&fit=crop',
            rules: [
                'Teams of up to 3 students.',
                'Working models preferred; posters allowed.',
                'Setup time: 45 minutes; Presentation: 5 minutes + Q&A.',
                'Bring your own materials. Power supply available.'
            ],
            eligibility: 'Open to school students (grades 8–12).'
        },
        quiz_bowl: {
            title: 'Quiz Bowl',
            description: 'Rapid-fire rounds on science, tech, and general knowledge. Qualifiers followed by finals on stage.',
            date: 'March 7, 2025',
            time: '1:00 PM – 4:00 PM',
            venue: 'Auditorium 2',
            image: 'https://images.unsplash.com/photo-1518085250887-2f903c200fee?q=80&w=1600&auto=format&fit=crop',
            rules: [
                'Teams of 2–3 participants.',
                'No electronic devices during the event.',
                'Tie-breakers as per quizmaster’s discretion.'
            ],
            eligibility: 'Open to school students.'
        },
        project_presentation: {
            title: 'Project Presentation',
            description: 'Pitch your STEM project to mentors and judges. Receive feedback and mentorship opportunities.',
            date: 'March 8, 2025',
            time: '11:00 AM – 2:00 PM',
            venue: 'Innovation Hub',
            image: 'New folder/presentation.jpg',
            rules: [
                'Solo or teams up to 3.',
                '10 minutes per team (7 min presentation + 3 min Q&A).',
                'Slides optional; bring on USB or personal laptop.'
            ],
            eligibility: 'Open to school students.'
        },
        school_coding: {
            title: 'School Coding Competition',
            description: 'Fast-paced coding rounds focused on logic and problem-solving for school participants.',
            date: 'March 7, 2025',
            time: '11:00 AM – 1:00 PM',
            venue: 'Lab Block 1',
            image: 'New folder/coding.jpg',
            rules: [
                'Solo participation.',
                'No internet access during rounds.',
                'Language choice allowed among C/C++/Java/Python.'
            ],
            eligibility: 'Open to school students (grades 8–12).'
        },
        school_workshop: {
            title: 'School Workshop',
            description: 'Introductory STEM hands-on workshop designed for school students.',
            date: 'March 7, 2025',
            time: '2:30 PM – 4:00 PM',
            venue: 'Innovation Lab',
            image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1600&auto=format&fit=crop',
            rules: [
                'Bring your school ID.',
                'Basic familiarity with computers recommended.'
            ],
            eligibility: 'Open to school students.'
        },
        hackathon: {
            title: 'Hackathon',
            description: '24-hour product sprint to build impactful solutions. Mentors on-site, real-world problem statements, and exciting prizes.',
            date: 'March 8–9, 2025',
            time: '10:00 AM (Sat) – 10:00 AM (Sun)',
            venue: 'CTF Lab + Main Hall',
            image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop',
            rules: [
                'Teams of 2–4.',
                'Fresh code only. Open-source libraries allowed.',
                'All submissions via provided repo link before deadline.',
                'Judging: innovation, impact, usability, and technical depth.'
            ],
            eligibility: 'Open to college students with valid ID.'
        },
        college_workshop: {
            title: 'College Workshop & Seminar',
            description: 'Expert-led talks and hands-on labs on modern stacks and career pathways.',
            date: 'March 7, 2025',
            time: '10:00 AM – 4:00 PM',
            venue: 'Auditorium + Lab Block 3',
            image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop',
            rules: [
                'Pre-registration required for lab access.',
                'Bring your own laptop.'
            ],
            eligibility: 'Open to college students.'
        },
        ctf: {
            title: 'Capture the Flag (CTF)',
            description: 'Compete in jeopardy-style CTF challenges covering web, crypto, forensics, and more.',
            date: 'March 8, 2025',
            time: '10:00 AM – 6:00 PM',
            venue: 'CTF Lab',
            image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1600&auto=format&fit=crop',
            rules: [
                'Teams of up to 4.',
                'No attacks on infrastructure.',
                'Flag format specified on scoreboard.'
            ],
            eligibility: 'Open to college students.'
        },
        aws_study_jam: {
            title: 'AWS Study Jam',
            description: 'Guided AWS labs to learn cloud fundamentals, compute, and serverless basics.',
            date: 'March 8, 2025',
            time: '11:00 AM – 2:00 PM',
            venue: 'Cloud Lab',
            image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop',
            rules: [
                'Bring your laptop.',
                'AWS Educate account recommended.'
            ],
            eligibility: 'Open to college students.'
        },
        robotics: {
            title: 'Robotics Challenge',
            description: 'Design, build, and program robots to complete arena tasks. Precision and autonomy score high.',
            date: 'March 8, 2025',
            time: '2:00 PM – 6:00 PM',
            venue: 'Sports Arena',
            image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1600&auto=format&fit=crop',
            rules: [
                'Teams of up to 4.',
                'Robot size and weight limits announced one week prior.',
                'Custom or kit-based bots allowed; disclose components.'
            ],
            eligibility: 'Open to college students.'
        },
        coding_workshop: {
            title: 'Hands-on Coding Workshop',
            description: 'Fast-paced workshop covering modern frameworks, testing, and deployment best practices.',
            date: 'March 7, 2025',
            time: '11:00 AM – 1:30 PM',
            venue: 'Lab Block 3',
            image: 'New folder/coding.jpg',
            rules: [
                'Bring your own laptop.',
                'Basic programming knowledge recommended.',
                'Install prerequisites as mailed pre-event.'
            ],
            eligibility: 'Open to college students; limited seats.'
        },
        dj_night: {
            title: 'DJ Night',
            description: 'Celebrate innovation with an electrifying night of music, lights, and community.',
            date: 'March 9, 2025',
            time: '7:00 PM – 10:00 PM',
            venue: 'Open Air Theater',
            image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1600&auto=format&fit=crop',
            rules: [
                'Entry with fest pass only.',
                'Follow campus safety guidelines.',
                'Outside food/drinks not allowed.'
            ],
            eligibility: 'Open to registered participants and guests.'
        },
        gaming_arena: {
            title: 'Gaming Arena',
            description: 'LAN tournaments and VR experiences in a high-energy outdoor setup.',
            date: 'March 9, 2025',
            time: '12:00 PM – 6:00 PM',
            venue: 'Courtyard B',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
            rules: [
                'Bring your controller if preferred.',
                'Fair play and sportsmanship required.'
            ],
            eligibility: 'Open to all attendees.'
        },
        drone_race: {
            title: 'Drone Race',
            description: 'Navigate a high-speed aerial circuit featuring gates, turns, and time trials.',
            date: 'March 8, 2025',
            time: '3:00 PM – 5:30 PM',
            venue: 'Athletics Ground',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1600&auto=format&fit=crop',
            rules: [
                'Pilots must pass safety briefing.',
                'Frequency coordination by organizers.',
                'Use of prop guards recommended.'
            ],
            eligibility: 'Open to college students; limited slots.'
        },
        stalls: {
            title: 'Stalls',
            description: 'Explore food, merchandise, and interactive stalls across campus.',
            date: 'March 7–9, 2025',
            time: 'All Day',
            venue: 'Main Courtyard',
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop',
            rules: [
                'Follow queue and hygiene guidelines.'
            ],
            eligibility: 'Open to all attendees.'
        },
        treasure_hunt: {
            title: 'Treasure Hunt',
            description: 'Solve clues scattered across campus to win exciting prizes.',
            date: 'March 9, 2025',
            time: '10:00 AM – 1:00 PM',
            venue: 'Campus Grounds',
            image: 'New folder/tresurehunt.jpg',
            rules: [
                'Teams of 2–3.',
                'Respect campus property and rules.'
            ],
            eligibility: 'Open to all attendees.'
        },
        cultural_events: {
            title: 'Cultural Events',
            description: 'An evening of performances and showcases celebrating talent and diversity.',
            date: 'March 9, 2025',
            time: '6:00 PM – 9:00 PM',
            venue: 'Open Air Theater',
            image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop',
            rules: [
                'Entry allowed with fest pass.'
            ],
            eligibility: 'Open to registered participants and guests.'
        }
    };

    // MEDIA SOURCES: Replace these with your downloaded SharePoint asset paths
    // Save your files under /assets/poster/ and /assets/media/ for easy use.
    let POSTER_IMAGES = [
        'New folder/TechFest_A4.png',
        'New folder/Nirvana Tech Fest.png',
        'New folder/Nirvana Tech Fest_Schools.png',
        'New folder/Nirvana Tech Fest_College.png',
        'New folder/Nirvana Tech Fest_GEHU.png'
    ];
    let GALLERY_IMAGES = [
        'New folder/For Website.png',
        'New folder/landing.jpg',
        'New folder/Nirvana Tech Fest_GEHU.png',
        'New folder/Nirvana Tech Fest_College.png',
        'New folder/Nirvana Tech Fest_Schools.png'
    ];

    function buildCarousel(containerId, images, intervalMs) {
        const container = document.getElementById(containerId);
        if (!container || !images || images.length === 0) return;

        const track = document.createElement('div');
        track.className = 'carousel-track';
        images.forEach(src => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            const img = document.createElement('img');
            img.src = src;
            img.loading = 'lazy';
            img.alt = 'carousel image';
            slide.appendChild(img);
            track.appendChild(slide);
        });
        container.appendChild(track);

        // Dots
        const controls = document.createElement('div');
        controls.className = 'carousel-controls';
        const dots = images.map((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.type = 'button';
            dot.setAttribute('aria-label', `Go to slide ${i+1}`);
            dot.addEventListener('click', () => goTo(i));
            controls.appendChild(dot);
            return dot;
        });
        container.appendChild(controls);

        let index = 0;
        let timer = null;

        function goTo(i) {
            index = (i + images.length) % images.length;
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach((d, di) => d.classList.toggle('active', di === index));
        }

        function start() {
            stop();
            timer = setInterval(() => goTo(index + 1), intervalMs);
        }

        function stop() { if (timer) clearInterval(timer); }

        container.addEventListener('mouseenter', stop);
        container.addEventListener('mouseleave', start);
        start();
    }

    function buildCardsCarousel(rootId, images) {
        const root = document.getElementById(rootId);
        if (!root) return;
        const track = document.createElement('div');
        track.className = 'cc-track';
        if (images && images.length) {
            images.forEach(src => {
                const card = document.createElement('article');
                card.className = 'cc-card reveal';
                const img = document.createElement('img');
                img.src = src; img.loading = 'lazy';
                const cap = document.createElement('div');
                cap.className = 'cc-caption';
                cap.textContent = 'Nirvana Moments';
                card.appendChild(img); card.appendChild(cap);
                track.appendChild(card);
            });
        }
        root.appendChild(track);
        // duplicate for seamless auto scroll
        const clone = track.cloneNode(true); root.appendChild(clone); root.classList.add('auto');
        const btns = root.querySelectorAll('.cc-btn');
        btns.forEach(btn => btn.addEventListener('click', () => {
            const dir = Number(btn.dataset.dir || '1');
            const firstTrack = root.querySelector('.cc-track');
            firstTrack.scrollBy({ left: dir * 300, behavior: 'smooth' });
        }));
    }

    async function tryLoadManifest(path, fallbackArray) {
        try {
            const res = await fetch(path, { cache: 'no-store' });
            if (!res.ok) return fallbackArray;
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) return data;
            if (data && Array.isArray(data.images)) return data.images;
            return fallbackArray;
        } catch (_) {
            return fallbackArray;
        }
    }

    async function initCarousels() {
        // Prefer local manifests inside "New folder" if present, else fall back to assets manifests, else arrays
        POSTER_IMAGES = await tryLoadManifest('New folder/posters.json', POSTER_IMAGES);
        POSTER_IMAGES = await tryLoadManifest('assets/poster/manifest.json', POSTER_IMAGES);
        GALLERY_IMAGES = await tryLoadManifest('New folder/gallery.json', GALLERY_IMAGES);
        GALLERY_IMAGES = await tryLoadManifest('assets/media/manifest.json', GALLERY_IMAGES);
        buildCarousel('posterCarousel', POSTER_IMAGES, 3500);
        buildCarousel('galleryCarousel', GALLERY_IMAGES, 2800);
    }

    function initNav() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        if (!hamburger || !navMenu) return;
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', String(isOpen));
        });
        navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));
    }

    function initReveal() {
        const revealEls = Array.from(document.querySelectorAll('.reveal'));
        if (!('IntersectionObserver' in window)) {
            revealEls.forEach(el => el.classList.add('visible'));
            return;
        }
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
        revealEls.forEach(el => io.observe(el));
        // Apply slight variation
        document.querySelectorAll('.card, .gallery-grid img').forEach(el => el.classList.add('scale-in'));

        // Add subtle parallax tilt to gallery items
        const grid = document.querySelector('.gallery-grid');
        if (grid) {
            // On hover, fetch the linked event title to show as overlay
            grid.querySelectorAll('img[data-event]').forEach(img => {
                const key = img.getAttribute('data-event');
                if (EVENTS[key]) img.setAttribute('data-title', EVENTS[key].title);
            });
            grid.addEventListener('mousemove', (e) => {
                const target = e.target.closest('img');
                if (!target) return;
                const rect = target.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                target.style.setProperty('--ry', `${x * 10}deg`);
                target.style.setProperty('--rx', `${-y * 10}deg`);
            });
            grid.addEventListener('mouseleave', () => {
                grid.querySelectorAll('img').forEach(img => { img.style.removeProperty('--ry'); img.style.removeProperty('--rx'); });
            });
            // Click through to event detail if data-event exists
            grid.addEventListener('click', (e) => {
                const target = e.target.closest('img[data-event]');
                if (!target) return;
                const key = target.getAttribute('data-event');
                if (EVENTS[key]) location.href = `event-detail.html?event=${encodeURIComponent(key)}`;
            });
        }
    }

    function getParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    function populateEventDetail() {
        if (!/event-detail\.html/i.test(location.pathname)) return;
        const key = (getParam('event') || '').trim();
        const data = EVENTS[key];

        const titleEl = document.getElementById('eventTitle');
        const descEl = document.getElementById('eventDescription');
        const dateEl = document.getElementById('eventDate');
        const timeEl = document.getElementById('eventTime');
        const venueEl = document.getElementById('eventVenue');
        const rulesList = document.getElementById('rulesList');
        const eligibilityText = document.getElementById('eligibilityText');
        const heroBg = document.getElementById('eventHeroBg');

        if (!data) {
            titleEl.textContent = 'Event Not Found';
            descEl.textContent = 'We could not find details for this event. Please go back to the events page and try again.';
            dateEl.textContent = '—';
            timeEl.textContent = '—';
            venueEl.textContent = '—';
            rulesList.innerHTML = '';
            eligibilityText.textContent = '';
            heroBg.style.backgroundImage = 'linear-gradient(135deg, rgba(139,92,246,.5), rgba(0,229,255,.4))';
            return;
        }

        document.title = data.title + ' • Nirvana Tech Fest 2025';
        titleEl.textContent = data.title;
        descEl.textContent = data.description;
        dateEl.textContent = data.date || 'TBA';
        timeEl.textContent = data.time || 'TBA';
        venueEl.textContent = data.venue || 'TBA';
        rulesList.innerHTML = '';
        (data.rules || []).forEach(rule => {
            const li = document.createElement('li');
            li.textContent = rule;
            rulesList.appendChild(li);
        });
        eligibilityText.textContent = data.eligibility || '';
        heroBg.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,.6), rgba(0,0,0,.6)), url('${data.image}')`;
    }

    ready(function() {
        initNav();
        initReveal();
        initTheme();
        initSplash();
        populateEventDetail();
        initCarousels();
        // Rolling highlights cards (no images needed)
        const hl = document.getElementById('highlightsCarousel');
        if (hl) {
            const track = hl.querySelector('.cc-track');
            const clone = track.cloneNode(true); hl.appendChild(clone); hl.classList.add('auto');
            hl.querySelectorAll('.cc-btn').forEach(btn => btn.addEventListener('click', () => {
                const dir = Number(btn.dataset.dir || '1');
                hl.querySelector('.cc-track').scrollBy({ left: dir * 280, behavior: 'smooth' });
            }));
        }
    });
})();


