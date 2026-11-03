(function () {
  'use strict';

  // ============================================
  // COMMON: Burger Menu + Header Scroll
  // ============================================
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const header = document.getElementById('header');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ============================================
  // COMMON: Reveal on Scroll
  // ============================================
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    reveals.forEach(el => revealObserver.observe(el));
  }

  // ============================================
  // INDEX: Accordion
  // ============================================
  document.querySelectorAll('.acc-header').forEach(headerEl => {
    headerEl.addEventListener('click', () => {
      const item = headerEl.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ============================================
  // INDEX: Animated Counters
  // ============================================
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.target);
          const isDecimal = el.dataset.decimal;
          const duration = 1800;
          const start = performance.now();

          const update = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const value = target * ease;
            el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString('ru-RU');
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('ru-RU');
          };
          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // ============================================
  // TRAINING: Filter system
  // ============================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card');

  if (filterBtns.length && programCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        programCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            setTimeout(() => card.classList.add('active'), 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // ============================================
  // TRAINING: 3D Tilt on cards
  // ============================================
  document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 18;
      const rotateY = (centerX - x) / 18;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ============================================
  // TRAINING: Demo Timer
  // ============================================
  const timerDisplay = document.getElementById('timerDisplay');
  const timerBar = document.getElementById('timerBar');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');

  if (timerDisplay && startBtn) {
    let timeLeft = 45;
    let totalTime = 45;
    let timerInterval = null;
    let isRunning = false;

    function updateDisplay() {
      const min = Math.floor(timeLeft / 60).toString().padStart(2, '0');
      const sec = (timeLeft % 60).toString().padStart(2, '0');
      timerDisplay.textContent = `${min}:${sec}`;
      if (timerBar) {
        const progress = ((totalTime - timeLeft) / totalTime) * 100;
        timerBar.style.width = progress + '%';
      }
    }

    startBtn.addEventListener('click', () => {
      if (isRunning) return;
      isRunning = true;
      timerInterval = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateDisplay();
        } else {
          clearInterval(timerInterval);
          isRunning = false;
          timerDisplay.style.animation = 'pulse 0.5s ease 3';
        }
      }, 1000);
    });

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        isRunning = false;
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        isRunning = false;
        timeLeft = totalTime;
        updateDisplay();
      });
    }

    updateDisplay();
  }

  // ============================================
  // WEEK: Workouts data + rendering
  // ============================================
  const workoutPanel = document.getElementById('workoutPanel');
  if (workoutPanel) {
    const workouts = [
      {
        title: "Грудь + Трицепс",
        time: "55–65 мин",
        level: "Средний",
        focus: "Жимовые",
        desc: "Классический день на верх тела. Фокус на жимовые движения и изоляцию трицепса. Работай в диапазоне 8–12 повторений, последний подход — до отказа.",
        exercises: [
          { name: "Жим штанги лёжа", details: "Разминка 2×12 → рабочие", sets: "4 × 8–10" },
          { name: "Жим гантелей на наклонной", details: "Угол 30–35°", sets: "3 × 10–12" },
          { name: "Разводка гантелей", details: "Контроль негатива", sets: "3 × 12–15" },
          { name: "Отжимания на брусьях", details: "С весом или без", sets: "3 × 8–12" },
          { name: "Французский жим", details: "Лёжа или сидя", sets: "3 × 10–12" },
          { name: "Разгибания на блоке", details: "Канат или прямая рукоять", sets: "3 × 12–15" }
        ]
      },
      {
        title: "Спина + Бицепс",
        time: "55–65 мин",
        level: "Средний",
        focus: "Тяговые",
        desc: "Тяговый день. Следи за сведением лопаток и полным растяжением в нижней точке. Бицепс — после спины, пока есть силы.",
        exercises: [
          { name: "Подтягивания / Тяга верхнего блока", details: "Широкий хват", sets: "4 × 6–10" },
          { name: "Тяга штанги в наклоне", details: "Хват на ширине плеч", sets: "4 × 8–10" },
          { name: "Тяга гантели одной рукой", details: "Опора на скамью", sets: "3 × 10–12" },
          { name: "Горизонтальная тяга блока", details: "К поясу", sets: "3 × 10–12" },
          { name: "Подъём штанги на бицепс", details: "Стоя, без читинга", sets: "3 × 8–12" },
          { name: "Молотковые сгибания", details: "Гантели", sets: "3 × 10–12" }
        ]
      },
      {
        title: "Ноги",
        time: "60–75 мин",
        level: "Высокий",
        focus: "Квадрицепс + задняя",
        desc: "Самый тяжёлый день недели. Не экономь силы на разминке. Глубина приседа — приоритет. После тренировки — растяжка и белок.",
        exercises: [
          { name: "Приседания со штангой", details: "До параллели или ниже", sets: "4 × 6–10" },
          { name: "Жим ногами", details: "Стопы на ширине плеч", sets: "4 × 10–12" },
          { name: "Выпады с гантелями", details: "Попеременно", sets: "3 × 10 на ногу" },
          { name: "Румынская тяга", details: "Чуть согнутые колени", sets: "3 × 8–12" },
          { name: "Разгибания ног", details: "Изоляция квадрицепса", sets: "3 × 12–15" },
          { name: "Сгибания ног лёжа", details: "Задняя поверхность", sets: "3 × 10–12" },
          { name: "Подъёмы на носки", details: "Стоя или сидя", sets: "4 × 12–15" }
        ]
      },
      { rest: true, title: "День отдыха", desc: "Активное восстановление. Можно лёгкую прогулку, мобилити или просто полный отдых. Сон и питание сегодня особенно важны." },
      {
        title: "Плечи + Пресс",
        time: "45–55 мин",
        level: "Средний",
        focus: "Дельты + кор",
        desc: "Объёмный день на плечи. Не гонись за весом — техника и жжение важнее. Пресс в конце, когда силы ещё есть.",
        exercises: [
          { name: "Жим гантелей сидя", details: "До уровня ушей", sets: "4 × 8–12" },
          { name: "Тяга к подбородку", details: "Узкий хват", sets: "3 × 10–12" },
          { name: "Махи в стороны", details: "Локти чуть согнуты", sets: "4 × 12–15" },
          { name: "Махи в наклоне", details: "Задняя дельта", sets: "3 × 12–15" },
          { name: "Планка", details: "Статика", sets: "3 × 40–60 сек" },
          { name: "Скручивания", details: "Контроль", sets: "3 × 15–20" }
        ]
      },
      {
        title: "Full Body",
        time: "50–60 мин",
        level: "Средний",
        focus: "Всё тело",
        desc: "Комплексная тренировка. Меньше изоляции, больше базовых движений. Отличный вариант, если пропустил день в середине недели.",
        exercises: [
          { name: "Приседания / Гоблет", details: "С гантелью или штангой", sets: "3 × 10–12" },
          { name: "Жим гантелей лёжа", details: "Горизонтальная скамья", sets: "3 × 8–12" },
          { name: "Тяга гантелей в наклоне", details: "Двумя руками", sets: "3 × 10–12" },
          { name: "Жим гантелей стоя", details: "Плечи", sets: "3 × 10–12" },
          { name: "Выпады", details: "На месте или в движении", sets: "3 × 10 на ногу" },
          { name: "Планка + скручивания", details: "Кор", sets: "3 круга" }
        ]
      },
      { rest: true, title: "День отдыха", desc: "Полное восстановление перед новой неделей. Можно сделать лёгкую растяжку или йогу 20–30 минут. Подготовь еду на понедельник." }
    ];

    let currentDay = 0;
    let completed = JSON.parse(localStorage.getItem('nf_completed') || '{}');

    function renderWorkout(dayIndex) {
      const data = workouts[dayIndex];

      if (data.rest) {
        workoutPanel.innerHTML = `
          <div class="rest-day">
            <i class="fas fa-spa"></i>
            <h3>${data.title}</h3>
            <p>${data.desc}</p>
          </div>`;
        return;
      }

      const dayKey = 'day' + dayIndex;
      if (!completed[dayKey]) completed[dayKey] = {};

      let html = `
        <div class="workout-header">
          <div>
            <h2>${data.title}</h2>
            <div class="meta">
              <span><i class="fas fa-clock"></i>${data.time}</span>
              <span><i class="fas fa-signal"></i>${data.level}</span>
              <span><i class="fas fa-bullseye"></i>${data.focus}</span>
            </div>
          </div>
        </div>
        <p class="workout-desc">${data.desc}</p>
        <div class="exercise-list">`;

      data.exercises.forEach((ex, i) => {
        const isDone = completed[dayKey][i] === true;
        html += `
          <div class="exercise ${isDone ? 'done' : ''}" data-day="${dayIndex}" data-ex="${i}">
            <div class="check-box"><i class="fas fa-check"></i></div>
            <div class="ex-info">
              <div class="ex-name">${ex.name}</div>
              <div class="ex-details">${ex.details}</div>
            </div>
            <div class="ex-sets">${ex.sets}</div>
            <button class="ex-timer-btn" data-time="90" data-name="${ex.name}">⏱ 1:30</button>
          </div>`;
      });

      html += `</div>`;
      workoutPanel.innerHTML = html;

      workoutPanel.querySelectorAll('.exercise').forEach(el => {
        el.addEventListener('click', (e) => {
          if (e.target.closest('.ex-timer-btn')) return;
          toggleExercise(el);
        });
      });

      workoutPanel.querySelectorAll('.ex-timer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          openTimer(btn.dataset.name, parseInt(btn.dataset.time));
        });
      });

      updateProgress();
    }

    function toggleExercise(el) {
      const day = el.dataset.day;
      const ex = el.dataset.ex;
      const key = 'day' + day;
      if (!completed[key]) completed[key] = {};

      completed[key][ex] = !completed[key][ex];
      el.classList.toggle('done', completed[key][ex]);

      localStorage.setItem('nf_completed', JSON.stringify(completed));
      updateProgress();

      el.style.transform = 'scale(0.98)';
      setTimeout(() => el.style.transform = '', 150);
    }

    function updateProgress() {
      let done = 0, total = 0, daysDone = 0;

      workouts.forEach((w, di) => {
        if (w.rest) return;
        const key = 'day' + di;
        const exs = w.exercises.length;
        total += exs;
        let dayComplete = 0;
        if (completed[key]) {
          Object.values(completed[key]).forEach(v => { if (v) { done++; dayComplete++; } });
        }
        if (dayComplete === exs) daysDone++;
      });

      const doneEl = document.getElementById('doneCount');
      const totalEl = document.getElementById('totalCount');
      const dayDoneEl = document.getElementById('dayDone');
      const percentEl = document.getElementById('progressPercent');
      const circle = document.getElementById('progressCircle');

      if (doneEl) doneEl.textContent = done;
      if (totalEl) totalEl.textContent = total;
      if (dayDoneEl) dayDoneEl.textContent = daysDone + '/5';

      const percent = total ? Math.round((done / total) * 100) : 0;
      if (percentEl) percentEl.textContent = percent + '%';

      if (circle) {
        const circumference = 2 * Math.PI * 48;
        circle.style.strokeDashoffset = circumference - (percent / 100) * circumference;
      }
    }

    // Day selector
    document.querySelectorAll('.day-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentDay = parseInt(btn.dataset.day);
        renderWorkout(currentDay);
      });
    });

    // Mini timer
    let miniInterval = null;
    let miniLeft = 90;

    function openTimer(name, seconds) {
      const box = document.getElementById('miniTimer');
      if (!box) return;
      document.getElementById('timerTitle').textContent = name + ' · отдых';
      miniLeft = seconds;
      updateMiniDisplay();
      box.classList.add('show');
      clearInterval(miniInterval);
    }

    function updateMiniDisplay() {
      const el = document.getElementById('miniTime');
      if (!el) return;
      const m = Math.floor(miniLeft / 60).toString().padStart(2, '0');
      const s = (miniLeft % 60).toString().padStart(2, '0');
      el.textContent = m + ':' + s;
    }

    const miniStart = document.getElementById('miniStart');
    const miniStop = document.getElementById('miniStop');

    if (miniStart) {
      miniStart.addEventListener('click', () => {
        clearInterval(miniInterval);
        miniInterval = setInterval(() => {
          if (miniLeft > 0) {
            miniLeft--;
            updateMiniDisplay();
          } else {
            clearInterval(miniInterval);
            const t = document.getElementById('miniTime');
            if (t) t.style.animation = 'pulse 0.4s ease 3';
          }
        }, 1000);
      });
    }

    if (miniStop) {
      miniStop.addEventListener('click', () => {
        clearInterval(miniInterval);
        const box = document.getElementById('miniTimer');
        if (box) box.classList.remove('show');
      });
    }

    // Init
    renderWorkout(0);
    updateProgress();
  }

  // ============================================
  // PROFILE: Tabs + Toggles + Animations
  // ============================================
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const tab = document.getElementById(btn.dataset.tab);
      if (tab) tab.classList.add('active');
      if (btn.dataset.tab === 'overview') animateBars();
    });
  });

  document.querySelectorAll('[data-toggle]').forEach(t => {
    t.addEventListener('click', () => t.classList.toggle('on'));
  });

  function animateCountersProfile() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count);
      const duration = 1500;
      const start = performance.now();
      const update = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(target * ease);
        if (p < 1) requestAnimationFrame(update);
        else el.textContent = target;
      };
      requestAnimationFrame(update);
    });
  }

  function animateBars() {
    document.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.width = '0';
      setTimeout(() => {
        bar.style.width = (bar.dataset.width || 0) + '%';
      }, 100);
    });
  }

  if (document.querySelector('[data-count]')) {
    setTimeout(() => {
      animateCountersProfile();
      animateBars();
    }, 300);
  }

  // ============================================
  // CHALLENGES: Quiz + Filters + Join
  // ============================================
  const quizBox = document.querySelector('.quiz-box');
  if (quizBox) {
    const answers = {};
    let currentStep = 1;
    const totalSteps = 4;

    const recommendations = {
      strength: { name: '30 дней силы', desc: 'Каждый день — силовая тренировка. Идеально для набора силы и дисциплины.', id: 'ch-strength' },
      cardio: { name: 'Жиросжигание 21', desc: '21 день HIIT и кардио. Максимум эффекта за минимум времени.', id: 'ch-cardio' },
      habit: { name: 'Утренняя мобилити', desc: '15 минут каждый день. Мягкий старт и отличная привычка.', id: 'ch-habit' }
    };

    document.querySelectorAll('.quiz-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const step = opt.closest('.quiz-step');
        step.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        answers[currentStep] = opt.dataset.value;
        const nextBtn = step.querySelector('.quiz-btn.next');
        if (nextBtn) nextBtn.disabled = false;
      });
    });

    document.querySelectorAll('.quiz-btn.next').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
          document.querySelector(`.quiz-step[data-step="${currentStep}"]`).classList.remove('active');
          currentStep++;
          document.querySelector(`.quiz-step[data-step="${currentStep}"]`).classList.add('active');
          const bar = document.getElementById('quizBar');
          if (bar) bar.style.width = (currentStep / totalSteps * 100) + '%';
        } else {
          document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
          const bar = document.getElementById('quizBar');
          if (bar) bar.style.width = '100%';

          const goal = answers[1] || 'strength';
          const rec = recommendations[goal] || recommendations.strength;

          const nameEl = document.getElementById('resultName');
          const descEl = document.getElementById('resultDesc');
          if (nameEl) nameEl.textContent = rec.name;
          if (descEl) descEl.textContent = rec.desc;

          document.getElementById('quizResult').classList.add('active');
          window.recommendedId = rec.id;
          createConfetti();
        }
      });
    });

    document.querySelectorAll('[data-back]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelector(`.quiz-step[data-step="${currentStep}"]`).classList.remove('active');
        currentStep--;
        document.querySelector(`.quiz-step[data-step="${currentStep}"]`).classList.add('active');
        const bar = document.getElementById('quizBar');
        if (bar) bar.style.width = (currentStep / totalSteps * 100) + '%';
      });
    });

    const scrollBtn = document.getElementById('scrollToChallenge');
    if (scrollBtn) {
      scrollBtn.addEventListener('click', () => {
        const el = document.getElementById(window.recommendedId || 'ch-strength');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.style.boxShadow = '0 0 50px rgba(255,94,0,0.45)';
          setTimeout(() => el.style.boxShadow = '', 2000);
        }
      });
    }
  }

  function createConfetti() {
    const colors = ['#ff5e00', '#00e5ff', '#39ff14', '#ffd700'];
    for (let i = 0; i < 36; i++) {
      const el = document.createElement('div');
      el.className = 'confetti';
      el.innerHTML = `<i class="fas fa-circle" style="color:${colors[i % 4]};left:${Math.random() * 100}vw;top:-10px;animation-delay:${Math.random() * 0.4}s"></i>`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1400);
    }
  }

  // Challenges filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    // Only if we are on challenges page (has .ch-card)
    if (!document.querySelector('.ch-card')) return;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.ch-card').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.category.includes(filter)) ? 'flex' : 'none';
      });
    });
  });

  // Challenges join
  const joined = JSON.parse(localStorage.getItem('nf_challenges') || '{}');
  document.querySelectorAll('.btn-join').forEach(btn => {
    const id = btn.dataset.id;
    const card = btn.closest('.ch-card');
    if (!card) return;

    if (joined[id]) {
      btn.textContent = '✓ Ты в деле';
      btn.classList.add('joined');
      card.classList.add('joined');
      const fill = card.querySelector('.ch-bar-fill');
      const text = card.querySelector('.prog-text');
      if (fill && joined[id].progress) {
        fill.style.width = joined[id].progress + '%';
        if (text) text.textContent = joined[id].label || text.textContent;
      }
    }

    btn.addEventListener('click', () => {
      if (btn.classList.contains('joined')) return;

      btn.textContent = '✓ Ты в деле';
      btn.classList.add('joined');
      card.classList.add('joined');

      const progress = Math.floor(Math.random() * 28) + 12;
      const fill = card.querySelector('.ch-bar-fill');
      const text = card.querySelector('.prog-text');
      if (fill) setTimeout(() => fill.style.width = progress + '%', 60);
      if (text) {
        const total = text.textContent.split('/')[1];
        const cur = Math.round(progress / 100 * parseInt(total));
        text.textContent = cur + '/' + total;
      }

      joined[id] = { progress, label: text ? text.textContent : '' };
      localStorage.setItem('nf_challenges', JSON.stringify(joined));

      createConfetti();
      card.style.transform = 'scale(1.03)';
      setTimeout(() => card.style.transform = '', 300);
    });
  });

})();