/**
 * Interactive exam engine: timer, auto-submit, scoring, locked solution dropdowns.
 * Requirements:
 * - Each scorable element has data-correct="expected" and data-points="1.5".
 * - For radio groups, put data-correct and data-points on the row container (.tf-row); engine finds :checked.
 * - Body or .container can have data-exam-duration="3000" (seconds) and data-exam-total-points="36".
 * - Open-ended (textarea without data-correct) are excluded from score; list them in the results.
 */
(function () {
  'use strict';

  const CONFIG = {
    duration: parseInt(document.body.dataset.examDuration, 10) || 50 * 60,
    totalPoints: parseFloat(document.body.dataset.examTotalPoints, 10) || 36,
  };

  let state = {
    submitted: false,
    timeRemaining: CONFIG.duration,
    running: false,
    intervalId: null,
  };

  const timerEl = document.getElementById('timer');
  const timerBtn = document.getElementById('timerBtn');
  const timerBar = document.querySelector('.timer-bar');

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return pad2(m) + ':' + pad2(s);
  }

  function updateTimerDisplay() {
    if (!timerEl) return;
    timerEl.textContent = formatTime(state.timeRemaining);
    timerEl.classList.remove('warning', 'danger');
    if (state.timeRemaining <= 300) timerEl.classList.add('danger');
    else if (state.timeRemaining <= 600) timerEl.classList.add('warning');
  }

  function stopTimer() {
    state.running = false;
    if (state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }
    if (timerBtn) {
      timerBtn.textContent = 'Submitted';
      timerBtn.disabled = true;
    }
  }

  function startTimer() {
    if (state.running || state.submitted) return;
    state.running = true;
    if (timerBtn) {
      timerBtn.textContent = 'Pause';
      timerBtn.classList.remove('paused');
    }
    state.intervalId = setInterval(function () {
      state.timeRemaining--;
      updateTimerDisplay();
      if (state.timeRemaining <= 0) {
        stopTimer();
        state.timeRemaining = 0;
        updateTimerDisplay();
        submitExam();
      }
    }, 1000);
  }

  function pauseTimer() {
    if (!state.running || state.submitted) return;
    state.running = false;
    if (state.intervalId) {
      clearInterval(state.intervalId);
      state.intervalId = null;
    }
    if (timerBtn) {
      timerBtn.textContent = 'Resume';
      timerBtn.classList.add('paused');
    }
  }

  function toggleTimer() {
    if (state.submitted) return;
    if (state.running) pauseTimer();
    else startTimer();
  }

  function normalizeAnswer(val) {
    if (val == null || val === undefined) return '';
    return String(val).trim().toLowerCase();
  }

  function normalizeCorrect(correct) {
    if (correct == null || correct === undefined) return '';
    return String(correct).trim().toLowerCase();
  }

  /** Accept comma-separated or single value; compare normalized. */
  function isCorrect(userVal, correctAttr) {
    const u = normalizeAnswer(userVal);
    const c = normalizeCorrect(correctAttr);
    if (u === c) return true;
    const alternatives = c.split(',').map(function (s) { return s.trim().toLowerCase(); });
    return alternatives.some(function (alt) { return u === alt; });
  }

  function getScorableElements() {
    const withCorrect = document.querySelectorAll('[data-correct][data-points]');
    const out = [];
    withCorrect.forEach(function (el) {
      const points = parseFloat(el.getAttribute('data-points'), 10);
      if (isNaN(points)) return;
      let userVal = null;
      if (el.matches('input[type="text"], input[type="number"], textarea')) {
        userVal = el.value;
      } else if (el.matches('select')) {
        userVal = el.value;
      } else if (el.matches('input[type="radio"]')) {
        const name = el.name;
        const checked = document.querySelector('input[name="' + CSS.escape(name) + '"]:checked');
        userVal = checked ? checked.value : '';
      } else {
        const radio = el.querySelector('input[type="radio"]:checked');
        const sel = el.querySelector('select');
        if (radio) userVal = radio.value;
        else if (sel) userVal = sel.value;
        else userVal = null;
      }
      out.push({ el: el, points: points, userVal: userVal, correct: el.getAttribute('data-correct') });
    });
    return out;
  }

  function computeScore() {
    const items = getScorableElements();
    var earned = 0;
    var maxAuto = 0;
    items.forEach(function (item) {
      maxAuto += item.points;
      if (isCorrect(item.userVal, item.correct)) earned += item.points;
    });
    return { earned: earned, maxAuto: maxAuto, items: items };
  }

  function getManualGradingLabels() {
    const labels = [];
    document.querySelectorAll('.question').forEach(function (q) {
      const qTitle = q.querySelector('.q-title');
      const qLabel = qTitle ? qTitle.textContent.trim() : (q.id || '');
      q.querySelectorAll('.subq').forEach(function (subq) {
        const hasTextarea = subq.querySelector('textarea');
        const textareaNotScored = subq.querySelector('textarea:not([data-correct])');
        if (hasTextarea && textareaNotScored) {
          const subLabel = subq.querySelector('.subq-label');
          labels.push((subLabel ? subLabel.textContent.trim() : qLabel) + ' (written)');
        }
      });
    });
    return labels;
  }

  function disableInputs() {
    document.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.disabled = true;
    });
  }

  function lockDetails(lock) {
    document.querySelectorAll('details').forEach(function (d) {
      if (lock) {
        d.setAttribute('data-locked', 'true');
        d.removeAttribute('open');
      } else {
        d.removeAttribute('data-locked');
      }
    });
  }

  function injectScorePanelStyles() {
    if (document.getElementById('exam-engine-styles')) return;
    const style = document.createElement('style');
    style.id = 'exam-engine-styles';
    style.textContent = '.exam-score-panel{background:linear-gradient(135deg,rgba(21,128,61,.12),rgba(47,91,255,.08));border:1px solid var(--border,#dbe2f1);border-radius:12px;padding:20px;margin-bottom:24px;box-shadow:0 8px 24px rgba(15,23,42,.1)}.exam-score-panel h3{margin:0 0 10px;color:var(--green,#15803d);font-size:1.25em}.exam-score-note,.exam-score-manual{font-size:.95em;color:var(--dim,#616a84);margin:8px 0 0}.exam-score-manual{margin-top:12px;padding-top:12px;border-top:1px solid var(--border,#dbe2f1)}';
    (document.head || document.documentElement).appendChild(style);
  }

  function showScorePanel(result, manualLabels) {
    injectScorePanelStyles();
    const panel = document.createElement('div');
    panel.className = 'exam-score-panel';
    panel.setAttribute('role', 'alert');
    let html = '<h3>Score: ' + result.earned.toFixed(1) + ' / ' + result.maxAuto.toFixed(1) + ' (auto-graded)</h3>';
    if (CONFIG.totalPoints > result.maxAuto && result.maxAuto > 0) {
      html += '<p class="exam-score-note">Total exam points: ' + CONFIG.totalPoints + '. The remaining points are from written/explanation questions.</p>';
    }
    if (manualLabels.length > 0) {
      html += '<p class="exam-score-manual"><strong>Manual grading:</strong> The following parts are not auto-scored. Open each solution dropdown, grade your answer, and add any points to your total: ' + manualLabels.join('; ') + '.</p>';
    }
    panel.innerHTML = html;
    const container = document.querySelector('.container');
    if (container) {
      const header = container.querySelector('header');
      const after = header ? header.nextElementSibling : container.firstElementChild;
      if (after) container.insertBefore(panel, after);
      else container.appendChild(panel);
    } else {
      document.body.insertBefore(panel, document.body.firstChild);
    }
  }

  function submitExam() {
    if (state.submitted) return;
    state.submitted = true;
    stopTimer();
    if (state.timeRemaining <= 0 && timerEl) {
      timerEl.textContent = '00:00';
      timerEl.className = 'timer-display danger';
    }
    lockDetails(false);
    disableInputs();
    const result = computeScore();
    const manualLabels = getManualGradingLabels();
    showScorePanel(result, manualLabels);
  }

  function injectSubmitButton() {
    if (!timerBar || document.getElementById('examSubmitBtn')) return;
    const submitBtn = document.createElement('button');
    submitBtn.id = 'examSubmitBtn';
    submitBtn.className = 'timer-btn';
    submitBtn.textContent = 'Submit exam';
    submitBtn.style.background = 'var(--green, #15803d)';
    submitBtn.style.marginLeft = '8px';
    submitBtn.onclick = function () {
      if (!state.submitted) submitExam();
    };
    const rightDiv = timerBar.querySelector('div:last-child');
    if (rightDiv) rightDiv.appendChild(submitBtn);
    else timerBar.appendChild(submitBtn);
  }

  function initDetailsLock() {
    document.querySelectorAll('details').forEach(function (d) {
      const sum = d.querySelector('summary');
      if (!sum) return;
      sum.addEventListener('click', function (e) {
        if (d.getAttribute('data-locked') === 'true') {
          e.preventDefault();
          alert('Submit the exam first to view solutions.');
        }
      });
    });
  }

  function init() {
    updateTimerDisplay();
    lockDetails(true);
    initDetailsLock();
    if (timerBtn) {
      timerBtn.addEventListener('click', toggleTimer);
      timerBtn.textContent = 'Start Timer';
    }
    injectSubmitButton();
  }

  window.toggleTimer = toggleTimer;
  window.toggleRef = function () {
    const p = document.getElementById('refPanel') || document.querySelector('.ref-panel');
    if (p) p.classList.toggle('open');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
