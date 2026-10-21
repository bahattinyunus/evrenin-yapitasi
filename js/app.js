// Main Application Controller for Evrenin Yapıtaşı
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Background Canvas
  if (window.initCosmicCanvas) {
    window.initCosmicCanvas();
  }

  // State
  let currentLang = 'tr';
  let activeEraFilter = 'all';
  let activeGlossaryCategory = 'all';
  let activeLab = 'atom';

  // DOM Elements
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = document.getElementById('sound-text');
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const timelineContainer = document.getElementById('timeline-cards-container');
  const timelineFilterBtns = document.querySelectorAll('.timeline-filter-btn');
  const timelineSearchInput = document.getElementById('timeline-search');
  const glossaryContainer = document.getElementById('glossary-container');
  const glossaryFilterBtns = document.querySelectorAll('.glossary-filter-btn');
  const modalOverlay = document.getElementById('event-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // Sound Toggle Handler
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const isPlaying = window.CosmicAudio.toggleAmbient();
      if (isPlaying) {
        soundIcon.textContent = '🔊';
        soundText.textContent = currentLang === 'tr' ? 'Ses Açık (432Hz)' : 'Sound On (432Hz)';
        soundToggleBtn.classList.add('border-quantum-cyan', 'text-quantum-cyan');
      } else {
        soundIcon.textContent = '🔇';
        soundText.textContent = currentLang === 'tr' ? 'Kozmik Ses' : 'Cosmic Sound';
        soundToggleBtn.classList.remove('border-quantum-cyan', 'text-quantum-cyan');
      }
    });
  }

  // Language Toggle Handler
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'tr' ? 'en' : 'tr';
      langToggleBtn.textContent = currentLang === 'tr' ? '🇹🇷 TR | EN' : '🇬🇧 EN | TR';
      updatePageLanguage();
      renderTimeline();
      renderComparisonMatrix();
      renderGlossary();
      renderArticles();
      renderQuiz();
      initOrResumeLab(activeLab);
      if (window.CosmicAudio) {
        window.CosmicAudio.playQuantumPing(640);
      }
    });
  }

  function updatePageLanguage() {
    document.querySelectorAll('[data-tr]').forEach(el => {
      const trText = el.getAttribute('data-tr');
      const enText = el.getAttribute('data-en');
      if (currentLang === 'tr' && trText) {
        el.textContent = trText;
      } else if (currentLang === 'en' && enText) {
        el.textContent = enText;
      }
    });

    document.querySelectorAll('[data-tr-placeholder]').forEach(el => {
      const trPl = el.getAttribute('data-tr-placeholder');
      const enPl = el.getAttribute('data-en-placeholder');
      el.placeholder = currentLang === 'tr' ? trPl : enPl;
    });
  }

  // Render Timeline Cards
  function renderTimeline() {
    if (!timelineContainer) return;
    const searchTerm = (timelineSearchInput ? timelineSearchInput.value : '').toLowerCase().trim();
    
    const events = window.APP_DATA.timeline.filter(item => {
      const matchesEra = activeEraFilter === 'all' || item.era === activeEraFilter;
      const title = (currentLang === 'tr' ? item.title : item.titleEn).toLowerCase();
      const thinker = item.thinker.toLowerCase();
      const summary = (currentLang === 'tr' ? item.summary : item.summaryEn).toLowerCase();
      const matchesSearch = !searchTerm || title.includes(searchTerm) || thinker.includes(searchTerm) || summary.includes(searchTerm);
      return matchesEra && matchesSearch;
    });

    timelineContainer.innerHTML = '';

    if (events.length === 0) {
      timelineContainer.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-400">
          <p class="text-lg">${currentLang === 'tr' ? 'Aramanızla eşleşen olay bulunamadı.' : 'No timeline events found matching your criteria.'}</p>
        </div>
      `;
      return;
    }

    events.forEach(evt => {
      const card = document.createElement('div');
      card.className = 'glass-panel p-6 rounded-2xl cursor-pointer hover:border-cyan-400/50 hover:bg-slate-900/80 transition-all-300 transform hover:-translate-y-1 relative group flex flex-col justify-between';
      
      const eraBadgeColors = {
        ancient: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        classical: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        quantum: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        digital: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
      };

      const title = currentLang === 'tr' ? evt.title : evt.titleEn;
      const summary = currentLang === 'tr' ? evt.summary : evt.summaryEn;
      const tag = evt.tag;

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${eraBadgeColors[evt.era]}">
              ${evt.year}
            </span>
            <span class="text-xs text-slate-400 font-mono bg-slate-800/60 px-2 py-0.5 rounded">
              ${tag}
            </span>
          </div>
          <h3 class="text-lg font-bold text-white mb-1 group-hover:text-quantum-cyan transition-colors">
            ${title}
          </h3>
          <p class="text-xs font-semibold text-quantum-purple mb-3">
            👤 ${evt.thinker}
          </p>
          <p class="text-sm text-slate-300 line-clamp-3 mb-4">
            ${summary}
          </p>
        </div>

        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-quantum-cyan font-medium">
          <span>${currentLang === 'tr' ? 'Detaylı İncele →' : 'Explore Details →'}</span>
          <span class="opacity-0 group-hover:opacity-100 transition-opacity">⚡</span>
        </div>
      `;

      card.addEventListener('click', () => {
        openModal(evt);
        if (window.CosmicAudio) window.CosmicAudio.playQuantumPing(700);
      });

      timelineContainer.appendChild(card);
    });
  }

  // Filter Buttons for Timeline
  timelineFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timelineFilterBtns.forEach(b => b.classList.remove('bg-cyan-500/20', 'text-quantum-cyan', 'border-quantum-cyan/50'));
      btn.classList.add('bg-cyan-500/20', 'text-quantum-cyan', 'border-quantum-cyan/50');
      activeEraFilter = btn.getAttribute('data-era') || 'all';
      renderTimeline();
    });
  });

  if (timelineSearchInput) {
    timelineSearchInput.addEventListener('input', () => {
      renderTimeline();
    });
  }

  // Modal Open/Close
  function openModal(evt) {
    if (!modalOverlay) return;
    const titleEl = document.getElementById('modal-title');
    const thinkerEl = document.getElementById('modal-thinker');
    const yearEl = document.getElementById('modal-year');
    const quoteEl = document.getElementById('modal-quote');
    const quoteAuthorEl = document.getElementById('modal-quote-author');
    const quoteBox = document.getElementById('modal-quote-box');
    const descEl = document.getElementById('modal-desc');
    const conceptsEl = document.getElementById('modal-concepts');
    const impactEl = document.getElementById('modal-impact');
    const formulaEl = document.getElementById('modal-formula');
    const formulaBox = document.getElementById('modal-formula-box');

    const title = currentLang === 'tr' ? evt.title : evt.titleEn;
    const desc = currentLang === 'tr' ? evt.fullDescription : evt.fullDescriptionEn;
    const impact = currentLang === 'tr' ? evt.impact : evt.impactEn;

    if (titleEl) titleEl.textContent = title;
    if (thinkerEl) thinkerEl.textContent = evt.thinker;
    if (yearEl) yearEl.textContent = evt.year;
    if (descEl) descEl.textContent = desc;
    if (impactEl) impactEl.textContent = impact;

    if (quoteEl && evt.quote) {
      quoteBox.classList.remove('hidden');
      quoteEl.textContent = `"${evt.quote}"`;
      if (quoteAuthorEl) quoteAuthorEl.textContent = `— ${evt.quoteAuthor || evt.thinker}`;
    } else if (quoteBox) {
      quoteBox.classList.add('hidden');
    }

    if (formulaEl && evt.formula) {
      formulaBox.classList.remove('hidden');
      formulaEl.textContent = evt.formula;
    } else if (formulaBox) {
      formulaBox.classList.add('hidden');
    }

    if (conceptsEl && evt.keyConcepts) {
      conceptsEl.innerHTML = evt.keyConcepts.map(c => `
        <span class="px-2.5 py-1 bg-slate-800 text-cyan-300 rounded-lg text-xs font-mono border border-cyan-500/20">
          # ${c}
        </span>
      `).join('');
    }

    modalOverlay.classList.remove('hidden');
    modalOverlay.classList.add('flex');
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.add('hidden');
      modalOverlay.classList.remove('flex');
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Render Comparison Matrix
  function renderComparisonMatrix() {
    const tableBody = document.getElementById('comparison-table-body');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    window.APP_DATA.comparisonMatrix.forEach(row => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-800/80 hover:bg-slate-900/50 transition-colors';
      const feature = currentLang === 'tr' ? row.feature : row.featureEn;
      const matter = currentLang === 'tr' ? row.matter : row.matterEn;
      const energy = currentLang === 'tr' ? row.energy : row.energyEn;
      const info = currentLang === 'tr' ? row.information : row.informationEn;

      tr.innerHTML = `
        <td class="p-4 font-semibold text-cyan-300 font-mono text-xs md:text-sm bg-slate-950/40">${feature}</td>
        <td class="p-4 text-slate-300 text-xs md:text-sm">${matter}</td>
        <td class="p-4 text-slate-300 text-xs md:text-sm bg-purple-950/20">${energy}</td>
        <td class="p-4 text-slate-300 text-xs md:text-sm bg-cyan-950/20 font-medium text-white">${info}</td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Render Cosmic Glossary
  const glossarySearchInput = document.getElementById('glossary-search');
  function renderGlossary() {
    if (!glossaryContainer || !window.APP_DATA.glossary) return;
    glossaryContainer.innerHTML = '';

    const searchQ = (glossarySearchInput ? glossarySearchInput.value : '').toLowerCase().trim();

    const terms = window.APP_DATA.glossary.filter(item => {
      const catMatch = activeGlossaryCategory === 'all' || item.category === activeGlossaryCategory;
      const tTr = (item.term || '').toLowerCase();
      const tEn = (item.termEn || '').toLowerCase();
      const dTr = (item.defTr || '').toLowerCase();
      const dEn = (item.defEn || '').toLowerCase();
      const searchMatch = !searchQ || tTr.includes(searchQ) || tEn.includes(searchQ) || dTr.includes(searchQ) || dEn.includes(searchQ);
      return catMatch && searchMatch;
    });

    if (terms.length === 0) {
      glossaryContainer.innerHTML = `
        <div class="col-span-full py-10 text-center text-slate-400">
          <p class="text-sm">${currentLang === 'tr' ? 'Aramanızla eşleşen kavram bulunamadı.' : 'No glossary terms found matching your search.'}</p>
        </div>
      `;
      return;
    }

    const catBadgeColors = {
      ancient: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      quantum: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      information: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      cosmology: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    };

    const catLabels = {
      ancient: currentLang === 'tr' ? 'Antik Felsefe' : 'Ancient Philosophy',
      quantum: currentLang === 'tr' ? 'Kuantum Fiziği' : 'Quantum Physics',
      information: currentLang === 'tr' ? 'Bilgi Teorisi' : 'Information Theory',
      cosmology: currentLang === 'tr' ? 'Kozmoloji & Holografi' : 'Cosmology & Holography'
    };

    terms.forEach(item => {
      const card = document.createElement('div');
      card.className = 'glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between';
      
      const termTitle = currentLang === 'tr' ? item.term : item.termEn;
      const def = currentLang === 'tr' ? item.defTr : item.defEn;

      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between gap-2 mb-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-mono border ${catBadgeColors[item.category] || 'border-slate-700'}">
              ${catLabels[item.category] || item.category}
            </span>
          </div>
          <h3 class="text-base md:text-lg font-bold text-white mb-2 text-quantum-cyan">
            ${termTitle}
          </h3>
          <p class="text-xs md:text-sm text-slate-300 leading-relaxed">
            ${def}
          </p>
        </div>
      `;

      glossaryContainer.appendChild(card);
    });
  }

  // Glossary Filter Buttons & Search
  glossaryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      glossaryFilterBtns.forEach(b => b.classList.remove('bg-cyan-500/20', 'text-quantum-cyan', 'border-quantum-cyan/50'));
      btn.classList.add('bg-cyan-500/20', 'text-quantum-cyan', 'border-quantum-cyan/50');
      activeGlossaryCategory = btn.getAttribute('data-cat') || 'all';
      renderGlossary();
    });
  });
  if (glossarySearchInput) {
    glossarySearchInput.addEventListener('input', () => renderGlossary());
  }

  // Render Academic Theory & Article Compendium (6 Chapters)
  function renderArticles() {
    const container = document.getElementById('theory-cards-container');
    if (!container || !window.APP_DATA.articles) return;
    container.innerHTML = '';

    const colorMap = {
      amber: { badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20', border: 'hover:border-amber-500/40', foot: 'text-amber-300' },
      purple: { badge: 'text-purple-400 bg-purple-500/10 border-purple-500/20', border: 'hover:border-purple-500/40', foot: 'text-purple-300' },
      cyan: { badge: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', border: 'hover:border-cyan-500/40', foot: 'text-cyan-300' },
      emerald: { badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', border: 'hover:border-emerald-500/40', foot: 'text-emerald-300' },
      pink: { badge: 'text-pink-400 bg-pink-500/10 border-pink-500/20', border: 'hover:border-pink-500/40', foot: 'text-pink-300' },
      gold: { badge: 'text-amber-300 bg-amber-500/10 border-amber-400/20', border: 'hover:border-amber-400/40', foot: 'text-amber-200' }
    };

    window.APP_DATA.articles.forEach(art => {
      const st = colorMap[art.badgeColor] || colorMap.cyan;
      const card = document.createElement('div');
      card.className = `glass-panel p-6 rounded-2xl border border-slate-800 ${st.border} transition-all cursor-pointer transform hover:-translate-y-1 flex flex-col justify-between group`;

      const title = currentLang === 'tr' ? art.titleTr : art.titleEn;
      const summary = currentLang === 'tr' ? art.summaryTr : art.summaryEn;
      const pages = currentLang === 'tr' ? art.pagesTr : art.pagesEn;

      card.innerHTML = `
        <div>
          <span class="text-xs font-mono px-2.5 py-1 rounded-full border ${st.badge}">${art.path}</span>
          <h3 class="text-lg font-bold text-white mt-3 mb-2 group-hover:text-quantum-cyan transition-colors">${title}</h3>
          <p class="text-xs text-slate-300 leading-relaxed mb-4">${summary}</p>
        </div>
        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono ${st.foot} font-semibold">
          <span>${pages}</span>
          <span>${currentLang === 'tr' ? 'Makaleyi Oku →' : 'Read Chapter →'}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        openModal({
          year: pages,
          thinker: art.path,
          title: art.titleTr,
          titleEn: art.titleEn,
          fullDescription: art.contentTr,
          fullDescriptionEn: art.contentEn,
          formula: art.formula,
          impact: currentLang === 'tr' ? 'Tam metin repo içindeki ' + art.path + ' dosyasında yer almaktadır.' : 'Full markdown document is available at ' + art.path,
          impactEn: 'Full markdown document is available at ' + art.path,
          keyConcepts: [art.path, 'Teori Kütüphanesi', 'Akademik İnceleme']
        });
        if (window.CosmicAudio) window.CosmicAudio.playQuantumPing(680);
      });

      container.appendChild(card);
    });
  }

  // Interactive Quiz Engine
  let quizCurrentIndex = 0;
  let quizScore = 0;
  let quizSelectedAnswers = {};

  function renderQuiz() {
    const quizCard = document.getElementById('quiz-card');
    if (!quizCard) return;
    const questions = window.APP_DATA.quiz;

    if (quizCurrentIndex >= questions.length) {
      // Finished
      const pct = Math.round((quizScore / questions.length) * 100);
      let rankTr = 'Kozmik Başlangıç Seviyesi';
      let rankEn = 'Cosmic Apprentice';
      if (pct >= 80) { rankTr = 'Kozmik Enformasyon Mimarı 🌌'; rankEn = 'Cosmic Information Architect 🌌'; }
      else if (pct >= 60) { rankTr = 'Kuantum Alan Kaşifi ⚡'; rankEn = 'Quantum Field Explorer ⚡'; }

      quizCard.innerHTML = `
        <div class="text-center py-8">
          <div class="text-5xl mb-4">🏆</div>
          <h3 class="text-2xl font-bold text-white mb-2">
            ${currentLang === 'tr' ? 'Test Tamamlandı!' : 'Quiz Completed!'}
          </h3>
          <p class="text-quantum-cyan font-mono text-xl mb-4">
            ${currentLang === 'tr' ? `Puanınız: %${pct} (${quizScore} / ${questions.length})` : `Score: ${pct}% (${quizScore} / ${questions.length})`}
          </p>
          <div class="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/40 rounded-xl text-purple-300 font-semibold mb-6">
            ${currentLang === 'tr' ? `Unvan: ${rankTr}` : `Title: ${rankEn}`}
          </div>
          <p class="text-sm text-slate-300 max-w-md mx-auto mb-6">
            ${currentLang === 'tr' ? 'Maddeden Enerjiye, Enerjiden Enformasyona uzanan kozmik yolculuğu başarıyla test ettiniz.' : 'You have explored the cosmic journey from Matter to Energy to Information.'}
          </p>
          <button id="restart-quiz-btn" class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all">
            ${currentLang === 'tr' ? 'Tekrar Çöz' : 'Restart Quiz'}
          </button>
        </div>
      `;

      const restartBtn = document.getElementById('restart-quiz-btn');
      if (restartBtn) {
        restartBtn.addEventListener('click', () => {
          quizCurrentIndex = 0;
          quizScore = 0;
          quizSelectedAnswers = {};
          renderQuiz();
        });
      }
      return;
    }

    const q = questions[quizCurrentIndex];
    const qText = currentLang === 'tr' ? q.question : q.questionEn;
    const explanation = currentLang === 'tr' ? q.explanation : q.explanationEn;
    const hasAnswered = quizSelectedAnswers[quizCurrentIndex] !== undefined;
    const selectedIdx = quizSelectedAnswers[quizCurrentIndex];

    quizCard.innerHTML = `
      <div>
        <div class="flex items-center justify-between text-xs font-mono text-slate-400 mb-4 pb-2 border-b border-slate-800">
          <span>${currentLang === 'tr' ? `Soru ${quizCurrentIndex + 1} / ${questions.length}` : `Question ${quizCurrentIndex + 1} / ${questions.length}`}</span>
          <span class="text-quantum-purple font-semibold">${q.category || ''}</span>
          <span>${currentLang === 'tr' ? `Puan: ${quizScore}` : `Score: ${quizScore}`}</span>
        </div>
        <h3 class="text-base md:text-lg font-bold text-white mb-6">
          ${qText}
        </h3>
        <div class="space-y-3 mb-6" id="quiz-options-container">
          ${q.options.map((opt, idx) => {
            const optText = currentLang === 'tr' ? opt.text : opt.textEn;
            let optClass = 'glass-panel p-4 rounded-xl border border-slate-700/60 hover:border-cyan-400/50 cursor-pointer text-sm transition-all flex items-start gap-3';
            if (hasAnswered) {
              if (opt.isCorrect) {
                optClass = 'bg-emerald-950/60 border border-emerald-500 text-emerald-200 p-4 rounded-xl text-sm flex items-start gap-3';
              } else if (idx === selectedIdx && !opt.isCorrect) {
                optClass = 'bg-red-950/60 border border-red-500 text-red-200 p-4 rounded-xl text-sm flex items-start gap-3';
              } else {
                optClass = 'opacity-40 p-4 rounded-xl border border-slate-800 text-sm flex items-start gap-3';
              }
            }
            return `
              <div class="${optClass}" data-opt-idx="${idx}">
                <span class="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center font-mono text-xs flex-shrink-0 mt-0.5">
                  ${String.fromCharCode(65 + idx)}
                </span>
                <span>${optText}</span>
              </div>
            `;
          }).join('')}
        </div>

        ${hasAnswered ? `
          <div class="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 text-xs md:text-sm text-cyan-200 mb-6 animate-modal">
            <strong>💡 ${currentLang === 'tr' ? 'Açıklama' : 'Explanation'}:</strong> ${explanation}
          </div>
          <div class="flex justify-end">
            <button id="next-question-btn" class="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white font-semibold text-sm shadow-md hover:shadow-cyan-500/30">
              ${quizCurrentIndex + 1 === questions.length ? (currentLang === 'tr' ? 'Sonuçları Gör' : 'See Results') : (currentLang === 'tr' ? 'Sonraki Soru →' : 'Next Question →')}
            </button>
          </div>
        ` : ''}
      </div>
    `;

    if (!hasAnswered) {
      document.querySelectorAll('#quiz-options-container > div').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.getAttribute('data-opt-idx') || '0', 10);
          quizSelectedAnswers[quizCurrentIndex] = idx;
          if (q.options[idx].isCorrect) {
            quizScore++;
            if (window.CosmicAudio) window.CosmicAudio.playQuantumPing(880);
          } else {
            if (window.CosmicAudio) window.CosmicAudio.playQuantumPing(220);
          }
          renderQuiz();
        });
      });
    } else {
      const nextBtn = document.getElementById('next-question-btn');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          quizCurrentIndex++;
          renderQuiz();
        });
      }
    }
  }

  // -------------------------------------------------------------
  // SIMULATION LABS CONTROLLERS (8 LABS)
  // -------------------------------------------------------------
  const labNavBtns = document.querySelectorAll('.lab-nav-btn');
  const labViews = document.querySelectorAll('.lab-view');

  labNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      labNavBtns.forEach(b => b.classList.remove('bg-cyan-500/20', 'text-quantum-cyan', 'border-quantum-cyan/50'));
      btn.classList.add('bg-cyan-500/20', 'text-quantum-cyan', 'border-quantum-cyan/50');
      activeLab = btn.getAttribute('data-lab') || 'atom';
      labViews.forEach(v => v.classList.add('hidden'));
      const activeView = document.getElementById(`lab-${activeLab}`);
      if (activeView) activeView.classList.remove('hidden');
      initOrResumeLab(activeLab);
      if (window.CosmicAudio) window.CosmicAudio.playQuantumPing(550);
    });
  });

  function initOrResumeLab(labKey) {
    if (labKey === 'atom') initAtomLab();
    else if (labKey === 'doubleslit') initDoubleSlitLab();
    else if (labKey === 'cellular') initCellularLab();
    else if (labKey === 'qubit') initQubitLab();
    else if (labKey === 'blackhole') initBlackHoleLab();
    else if (labKey === 'bostrom') initBostromLab();
    else if (labKey === 'entanglement') initEntanglementLab();
    else if (labKey === 'scales') initScalesLab();
    else if (labKey === 'landauer') initLandauerLab();
    else if (labKey === 'adscft') initAdSCFTLab();
  }

  // LAB 1: Atom & Quantum Orbitals Lab
  let atomCanvas, atomCtx, atomModel = 'schrodinger', atomEnergy = 2, atomAngle = 0;
  function initAtomLab() {
    atomCanvas = document.getElementById('atom-canvas');
    if (!atomCanvas) return;
    atomCtx = atomCanvas.getContext('2d');
    atomCanvas.width = atomCanvas.parentElement.clientWidth || 500;
    atomCanvas.height = 340;

    const atomModelSelect = document.getElementById('atom-model-select');
    if (atomModelSelect) {
      atomModelSelect.onchange = (e) => {
        atomModel = e.target.value;
      };
    }

    const exciteBtn = document.getElementById('atom-excite-btn');
    if (exciteBtn) {
      exciteBtn.onclick = () => {
        atomEnergy = (atomEnergy % 4) + 1;
        if (window.CosmicAudio) window.CosmicAudio.playQuantumPing(400 + atomEnergy * 150);
      };
    }

    if (!window._atomAnimStarted) {
      window._atomAnimStarted = true;
      function renderAtom() {
        if (activeLab === 'atom' && atomCtx) {
          atomCtx.clearRect(0, 0, atomCanvas.width, atomCanvas.height);
          const cx = atomCanvas.width / 2;
          const cy = atomCanvas.height / 2;
          atomAngle += 0.02;

          if (atomModel === 'democritus') {
            // Indivisible solid sphere
            atomCtx.beginPath();
            atomCtx.arc(cx, cy, 60, 0, Math.PI * 2);
            atomCtx.fillStyle = '#64748b';
            atomCtx.fill();
            atomCtx.strokeStyle = '#94a3b8';
            atomCtx.lineWidth = 3;
            atomCtx.stroke();
            atomCtx.fillStyle = '#ffffff';
            atomCtx.font = '12px Inter';
            atomCtx.textAlign = 'center';
            atomCtx.fillText('Atomos (Sert Küre)', cx, cy + 5);
          } else if (atomModel === 'bohr') {
            // Nucleus
            atomCtx.beginPath();
            atomCtx.arc(cx, cy, 14, 0, Math.PI * 2);
            atomCtx.fillStyle = '#f72585';
            atomCtx.fill();

            // Energy levels
            for (let n = 1; n <= 4; n++) {
              const r = n * 35;
              atomCtx.beginPath();
              atomCtx.arc(cx, cy, r, 0, Math.PI * 2);
              atomCtx.strokeStyle = n === atomEnergy ? '#00f2fe' : 'rgba(255,255,255,0.15)';
              atomCtx.lineWidth = n === atomEnergy ? 2 : 1;
              atomCtx.setLineDash(n === atomEnergy ? [] : [4, 4]);
              atomCtx.stroke();
              atomCtx.setLineDash([]);
            }

            // Electron on current orbit
            const er = atomEnergy * 35;
            const ex = cx + Math.cos(atomAngle * (5 - atomEnergy)) * er;
            const ey = cy + Math.sin(atomAngle * (5 - atomEnergy)) * er;
            atomCtx.beginPath();
            atomCtx.arc(ex, ey, 6, 0, Math.PI * 2);
            atomCtx.fillStyle = '#00f2fe';
            atomCtx.shadowBlur = 10;
            atomCtx.shadowColor = '#00f2fe';
            atomCtx.fill();
            atomCtx.shadowBlur = 0;
          } else {
            // Schrödinger Quantum Probability Cloud
            const cloudPoints = 600;
            const spread = atomEnergy * 28;
            for (let i = 0; i < cloudPoints; i++) {
              const r = (Math.random() + Math.random() + Math.random()) / 3 * spread * 2;
              const th = Math.random() * Math.PI * 2;
              const px = cx + Math.cos(th + atomAngle * 0.2) * r;
              const py = cy + Math.sin(th + atomAngle * 0.2) * r;
              atomCtx.beginPath();
              atomCtx.arc(px, py, 1.2, 0, Math.PI * 2);
              atomCtx.fillStyle = 'rgba(0, 242, 254, 0.45)';
              atomCtx.fill();
            }
            // Nucleus
            atomCtx.beginPath();
            atomCtx.arc(cx, cy, 8, 0, Math.PI * 2);
            atomCtx.fillStyle = '#f72585';
            atomCtx.fill();
          }
        }
        requestAnimationFrame(renderAtom);
      }
      renderAtom();
    }
  }

  // LAB 2: Double Slit Experiment
  let dsCanvas, dsCtx, dsObserver = false, dsPhotons = [], dsHits = [];
  function initDoubleSlitLab() {
    dsCanvas = document.getElementById('doubleslit-canvas');
    if (!dsCanvas) return;
    dsCtx = dsCanvas.getContext('2d');
    dsCanvas.width = dsCanvas.parentElement.clientWidth || 500;
    dsCanvas.height = 340;

    const obsToggle = document.getElementById('ds-observer-toggle');
    if (obsToggle) {
      obsToggle.onchange = (e) => {
        dsObserver = e.target.checked;
        dsHits = [];
        if (window.CosmicAudio) window.CosmicAudio.playQuantumPing(dsObserver ? 300 : 700);
      };
    }

    const clearBtn = document.getElementById('ds-clear-btn');
    if (clearBtn) {
      clearBtn.onclick = () => { dsHits = []; };
    }

    if (!window._dsAnimStarted) {
      window._dsAnimStarted = true;
      function renderDoubleSlit() {
        if (activeLab === 'doubleslit' && dsCtx) {
          const w = dsCanvas.width;
          const h = dsCanvas.height;
          dsCtx.clearRect(0, 0, w, h);

          // Emitter barrier at left (x = 30)
          dsCtx.fillStyle = '#00f2fe';
          dsCtx.fillRect(10, h / 2 - 15, 10, 30);

          // Double slit barrier at x = w * 0.4
          const bx = w * 0.4;
          dsCtx.fillStyle = '#334155';
          dsCtx.fillRect(bx, 0, 8, h / 2 - 40);
          dsCtx.fillRect(bx, h / 2 - 20, 8, 40);
          dsCtx.fillRect(bx, h / 2 + 40, 8, h / 2 - 40);

          // Detector indicator if active
          if (dsObserver) {
            dsCtx.fillStyle = '#f72585';
            dsCtx.font = '11px Inter';
            dsCtx.fillText(currentLang === 'tr' ? '👁️ Gözlemci Dedektörü AÇIK' : '👁️ Observer Detector ON', bx - 30, 25);
          }

          // Screen at right: x = w - 40
          const sx = w - 40;
          dsCtx.fillStyle = '#1e293b';
          dsCtx.fillRect(sx, 10, 10, h - 20);

          // Emit new photons
          if (Math.random() < 0.6) {
            dsPhotons.push({
              x: 25,
              y: h / 2 + (Math.random() - 0.5) * 10,
              vx: 4,
              passedSlit: false,
              targetY: 0
            });
          }

          // Update photons
          for (let i = dsPhotons.length - 1; i >= 0; i--) {
            const p = dsPhotons[i];
            p.x += p.vx;

            if (!p.passedSlit && p.x >= bx) {
              p.passedSlit = true;
              if (dsObserver) {
                // Collapses to one slit and travels like a particle
                const slitY = Math.random() > 0.5 ? h / 2 - 30 : h / 2 + 30;
                p.y = slitY;
                p.vy = (Math.random() - 0.5) * 1.5;
              } else {
                // Wave interference distribution at screen
                const interference = Math.sin(Math.random() * Math.PI * 4);
                p.vy = interference * 2.2;
              }
            }

            if (p.passedSlit) {
              p.y += p.vy || 0;
            }

            if (p.x >= sx) {
              dsHits.push(p.y);
              if (dsHits.length > 300) dsHits.shift();
              dsPhotons.splice(i, 1);
              continue;
            }

            dsCtx.beginPath();
            dsCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            dsCtx.fillStyle = dsObserver ? '#f72585' : '#00f2fe';
            dsCtx.fill();
          }

          // Draw hit accumulation pattern on screen
          dsHits.forEach(hy => {
            dsCtx.fillStyle = 'rgba(0, 242, 254, 0.25)';
            dsCtx.fillRect(sx + 12, hy - 1, 15, 2);
          });
        }
        requestAnimationFrame(renderDoubleSlit);
      }
      renderDoubleSlit();
    }
  }

  // LAB 3: Cellular Automata (Wolfram)
  let caCanvas, caCtx, caGrid = [], caRule = 30;
  function initCellularLab() {
    caCanvas = document.getElementById('cellular-canvas');
    if (!caCanvas) return;
    caCtx = caCanvas.getContext('2d');
    caCanvas.width = caCanvas.parentElement.clientWidth || 500;
    caCanvas.height = 320;

    const ruleSelect = document.getElementById('ca-rule-select');
    if (ruleSelect) {
      ruleSelect.onchange = (e) => {
        caRule = parseInt(e.target.value, 10);
        resetCellular();
      };
    }

    const resetBtn = document.getElementById('ca-reset-btn');
    if (resetBtn) {
      resetBtn.onclick = () => resetCellular();
    }

    function resetCellular() {
      caCtx.fillStyle = '#030712';
      caCtx.fillRect(0, 0, caCanvas.width, caCanvas.height);
      const cols = Math.floor(caCanvas.width / 4);
      caGrid = new Array(cols).fill(0);
      caGrid[Math.floor(cols / 2)] = 1; // single center seed
      window._caRow = 0;
    }

    resetCellular();

    if (!window._caAnimStarted) {
      window._caAnimStarted = true;
      setInterval(() => {
        if (activeLab === 'cellular' && caCtx && window._caRow < caCanvas.height / 4) {
          const cellSize = 4;
          const cols = caGrid.length;
          for (let x = 0; x < cols; x++) {
            if (caGrid[x] === 1) {
              caCtx.fillStyle = caRule === 30 ? '#00f2fe' : caRule === 110 ? '#9d4edd' : '#06d6a0';
              caCtx.fillRect(x * cellSize, window._caRow * cellSize, cellSize - 0.5, cellSize - 0.5);
            }
          }
          // Step 1D Wolfram
          const next = new Array(cols);
          for (let i = 0; i < cols; i++) {
            const left = caGrid[(i - 1 + cols) % cols];
            const center = caGrid[i];
            const right = caGrid[(i + 1) % cols];
            next[i] = window.PhysicsEngine.evaluateWolfram(caRule, left, center, right);
          }
          caGrid = next;
          window._caRow++;
        }
      }, 50);
    }
  }

  // LAB 4: Qubit & Bloch Sphere (6 Universal Quantum Gates)
  let qubitCanvas, qubitCtx, theta = 0, phi = 0;
  function initQubitLab() {
    qubitCanvas = document.getElementById('qubit-canvas');
    if (!qubitCanvas) return;
    qubitCtx = qubitCanvas.getContext('2d');
    qubitCanvas.width = qubitCanvas.parentElement.clientWidth || 400;
    qubitCanvas.height = 260;

    const gates = [
      { id: 'gate-h', code: 'H' },
      { id: 'gate-x', code: 'X' },
      { id: 'gate-y', code: 'Y' },
      { id: 'gate-z', code: 'Z' },
      { id: 'gate-s', code: 'S' },
      { id: 'gate-t', code: 'T' },
      { id: 'gate-reset', code: 'RESET' }
    ];

    gates.forEach(g => {
      const btn = document.getElementById(g.id);
      if (btn) {
        btn.onclick = () => {
          const next = window.PhysicsEngine.applyQubitGate(g.code, theta, phi);
          theta = next.theta;
          phi = next.phi;
          updateBloch();
          if (window.CosmicAudio) window.CosmicAudio.playQuantumPing(g.code === 'RESET' ? 360 : 620);
        };
      }
    });

    function updateBloch() {
      if (!qubitCtx) return;
      const w = qubitCanvas.width;
      const h = qubitCanvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const r = 85;

      qubitCtx.clearRect(0, 0, w, h);

      // Draw sphere circle & equator ellipse
      qubitCtx.beginPath();
      qubitCtx.arc(cx, cy, r, 0, Math.PI * 2);
      qubitCtx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      qubitCtx.lineWidth = 1.5;
      qubitCtx.stroke();

      qubitCtx.beginPath();
      qubitCtx.ellipse(cx, cy, r, r * 0.35, 0, 0, Math.PI * 2);
      qubitCtx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
      qubitCtx.stroke();

      // Z, X, Y axes
      qubitCtx.beginPath();
      qubitCtx.moveTo(cx, cy - r - 12);
      qubitCtx.lineTo(cx, cy + r + 12);
      qubitCtx.moveTo(cx - r - 12, cy);
      qubitCtx.lineTo(cx + r + 12, cy);
      qubitCtx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      qubitCtx.lineWidth = 1;
      qubitCtx.stroke();

      // Labels |0>, |1>, |+>, |->
      qubitCtx.fillStyle = '#00f2fe';
      qubitCtx.font = '12px Fira Code, monospace';
      qubitCtx.textAlign = 'center';
      qubitCtx.fillText('|0⟩', cx, cy - r - 16);
      qubitCtx.fillText('|1⟩', cx, cy + r + 24);
      qubitCtx.fillStyle = '#94a3b8';
      qubitCtx.fillText('|+⟩', cx + r + 20, cy + 4);
      qubitCtx.fillText('|-⟩', cx - r - 20, cy + 4);

      // Bloch vector (x, y, z)
      const bx = Math.sin(theta) * Math.cos(phi);
      const by = Math.sin(theta) * Math.sin(phi);
      const bz = Math.cos(theta);

      // Project onto 2D canvas with slight 3D perspective from y
      const vx = cx + r * (bx * 0.9 + by * 0.35);
      const vy = cy - r * bz + r * 0.35 * by * 0.5;

      // Dashed shadow on equator
      const eqX = cx + r * (bx * 0.9 + by * 0.35);
      const eqY = cy + r * 0.35 * by * 0.5;
      qubitCtx.beginPath();
      qubitCtx.moveTo(cx, cy);
      qubitCtx.lineTo(eqX, eqY);
      qubitCtx.lineTo(vx, vy);
      qubitCtx.strokeStyle = 'rgba(157, 78, 221, 0.45)';
      qubitCtx.setLineDash([3, 3]);
      qubitCtx.stroke();
      qubitCtx.setLineDash([]);

      // State vector line
      qubitCtx.beginPath();
      qubitCtx.moveTo(cx, cy);
      qubitCtx.lineTo(vx, vy);
      qubitCtx.strokeStyle = '#f72585';
      qubitCtx.lineWidth = 3;
      qubitCtx.stroke();

      qubitCtx.beginPath();
      qubitCtx.arc(vx, vy, 6, 0, Math.PI * 2);
      qubitCtx.fillStyle = '#f72585';
      qubitCtx.shadowBlur = 12;
      qubitCtx.shadowColor = '#f72585';
      qubitCtx.fill();
      qubitCtx.shadowBlur = 0;

      // Update state display text
      const prob0 = (Math.cos(theta / 2) ** 2) * 100;
      const prob1 = (Math.sin(theta / 2) ** 2) * 100;
      const degTheta = Math.round((theta * 180) / Math.PI);
      const degPhi = Math.round((phi * 180) / Math.PI);

      const stateTxt = document.getElementById('qubit-state-text');
      const coordsTxt = document.getElementById('qubit-coords-text');
      const prob0Label = document.getElementById('qubit-prob0-label');
      const prob1Label = document.getElementById('qubit-prob1-label');
      const probBar0 = document.getElementById('qubit-prob0-bar');
      const probBar1 = document.getElementById('qubit-prob1-bar');

      if (stateTxt) {
        stateTxt.textContent = `|Ψ⟩ = ${Math.cos(theta / 2).toFixed(2)}|0⟩ + ${Math.sin(theta / 2).toFixed(2)} e^(i·${degPhi}°)|1⟩`;
      }
      if (coordsTxt) {
        coordsTxt.textContent = `Bloch (x, y, z) = (${bx.toFixed(2)}, ${by.toFixed(2)}, ${bz.toFixed(2)}) | θ = ${degTheta}°, φ = ${degPhi}°`;
      }
      if (prob0Label) prob0Label.textContent = `P(|0⟩): %${prob0.toFixed(1)}`;
      if (prob1Label) prob1Label.textContent = `P(|1⟩): %${prob1.toFixed(1)}`;
      if (probBar0) probBar0.style.width = `${prob0}%`;
      if (probBar1) probBar1.style.width = `${prob1}%`;
    }

    updateBloch();
  }

  // LAB 5: Black Hole, Kerr Ergosphere & Holographic Calculator
  let bhCanvas, bhCtx, bhCurrentSpin = 0, bhCurrentMass = 1, bhAnimAngle = 0;
  function initBlackHoleLab() {
    const massSlider = document.getElementById('bh-mass-slider');
    const spinSlider = document.getElementById('bh-spin-slider');
    const presetSelect = document.getElementById('bh-preset-select');
    const massValEl = document.getElementById('bh-mass-val');
    const spinValEl = document.getElementById('bh-spin-val');
    const rsEl = document.getElementById('bh-rs-val');
    const areaEl = document.getElementById('bh-area-val');
    const entropyEl = document.getElementById('bh-entropy-val');
    const bitsEl = document.getElementById('bh-bits-val');
    const penroseEl = document.getElementById('bh-penrose-val');
    const tempEl = document.getElementById('bh-temp-val');

    bhCanvas = document.getElementById('bh-canvas');
    if (bhCanvas) {
      bhCtx = bhCanvas.getContext('2d');
      bhCanvas.width = bhCanvas.parentElement.clientWidth || 360;
      bhCanvas.height = 176;
    }

    function updateFromSliders() {
      const mSun = massSlider ? parseFloat(massSlider.value) : 1;
      const spin = spinSlider ? parseFloat(spinSlider.value) : 0;
      renderValues(mSun, spin);
    }

    function renderValues(mSun, spin) {
      bhCurrentMass = mSun;
      bhCurrentSpin = spin;
      const massKg = mSun * 1.98847e30;

      if (massValEl) massValEl.textContent = `${mSun.toLocaleString('tr-TR')} M☉ (${massKg.toExponential(2)} kg)`;
      if (spinValEl) {
        spinValEl.textContent = spin === 0
          ? '0.00 (Schwarzschild Statik)'
          : `${spin.toFixed(2)} (Kerr Dönen Kara Delik)`;
      }

      const info = window.PhysicsEngine.calculateBlackHoleInfo(massKg);
      const kerr = window.PhysicsEngine.calculateKerrBlackHole(massKg, spin);

      if (rsEl) {
        const rPlusKm = (kerr.rPlus / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 2 });
        const rErgoKm = (kerr.rErgoEquator / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 2 });
        rsEl.textContent = spin > 0 ? `r₊=${rPlusKm} km (Ergo: ${rErgoKm} km)` : `${rPlusKm} km`;
      }
      if (areaEl) areaEl.textContent = `${window.PhysicsEngine.formatSciNum(kerr.area)} m²`;
      if (entropyEl) entropyEl.textContent = `${window.PhysicsEngine.formatSciNum(kerr.entropyJK)} J/K`;
      if (bitsEl) bitsEl.textContent = `${window.PhysicsEngine.formatSciNum(kerr.bits)} bit`;
      if (penroseEl) {
        penroseEl.textContent = spin > 0
          ? `%${kerr.penroseEfficiency.toFixed(2)} (${window.PhysicsEngine.formatSciNum(kerr.penroseEnergyJoules)} J)`
          : '%0.00 (Dönme Yok)';
      }
      if (tempEl) tempEl.textContent = `${window.PhysicsEngine.formatSciNum(info.hawkingTempK)} K`;
    }

    if (presetSelect) {
      presetSelect.onchange = (e) => {
        const val = parseFloat(e.target.value);
        if (massSlider && val <= 100) massSlider.value = val;
        const spin = spinSlider ? parseFloat(spinSlider.value) : 0;
        renderValues(val, spin);
      };
    }

    if (massSlider) massSlider.oninput = updateFromSliders;
    if (spinSlider) spinSlider.oninput = updateFromSliders;
    updateFromSliders();

    if (!window._bhAnimStarted) {
      window._bhAnimStarted = true;
      function animateBlackHole() {
        if (activeLab === 'blackhole' && bhCtx && bhCanvas) {
          const w = bhCanvas.width;
          const h = bhCanvas.height;
          const cx = w / 2;
          const cy = h / 2;
          bhCtx.clearRect(0, 0, w, h);
          bhAnimAngle += 0.015 + bhCurrentSpin * 0.08;

          const baseR = 36;
          const rPlusRatio = (1 + Math.sqrt(Math.max(0, 1 - bhCurrentSpin ** 2))) / 2;
          const rHorizon = baseR * Math.max(0.55, rPlusRatio);
          const rErgoX = baseR * 1.15;
          const rErgoY = rHorizon;

          // Relativistic accretion disk glow
          const grad = bhCtx.createRadialGradient(cx, cy, rHorizon * 0.8, cx, cy, baseR * 2.1);
          grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
          grad.addColorStop(0.45, 'rgba(247, 37, 133, 0.55)');
          grad.addColorStop(0.75, 'rgba(0, 242, 254, 0.25)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          bhCtx.fillStyle = grad;
          bhCtx.beginPath();
          bhCtx.arc(cx, cy, baseR * 2.1, 0, Math.PI * 2);
          bhCtx.fill();

          // Frame-dragging swirl streams when spinning
          if (bhCurrentSpin > 0.02) {
            for (let i = 0; i < 6; i++) {
              const a = bhAnimAngle + (i * Math.PI) / 3;
              bhCtx.beginPath();
              bhCtx.arc(cx, cy, rErgoX + 6 + (i % 2) * 5, a, a + 0.65);
              bhCtx.strokeStyle = 'rgba(0, 242, 254, 0.5)';
              bhCtx.lineWidth = 1.5;
              bhCtx.stroke();
            }
            // Ergosphere boundary (oblate spheroid)
            bhCtx.beginPath();
            bhCtx.ellipse(cx, cy, rErgoX, rErgoY, 0, 0, Math.PI * 2);
            bhCtx.strokeStyle = '#9d4edd';
            bhCtx.setLineDash([4, 3]);
            bhCtx.lineWidth = 1.5;
            bhCtx.stroke();
            bhCtx.setLineDash([]);
          }

          // Event Horizon Shadow (Black Core)
          bhCtx.beginPath();
          bhCtx.arc(cx, cy, rHorizon, 0, Math.PI * 2);
          bhCtx.fillStyle = '#02040a';
          bhCtx.fill();
          bhCtx.strokeStyle = '#00f2fe';
          bhCtx.lineWidth = 2;
          bhCtx.stroke();

          // Labels
          bhCtx.fillStyle = '#e2e8f0';
          bhCtx.font = '10px Fira Code, monospace';
          bhCtx.textAlign = 'center';
          bhCtx.fillText(
            bhCurrentSpin > 0 ? `Kerr (a/M=${bhCurrentSpin.toFixed(2)}) + Ergoküre` : 'Schwarzschild Olay Ufku (r_s)',
            cx,
            h - 8
          );
        }
        requestAnimationFrame(animateBlackHole);
      }
      animateBlackHole();
    }
  }

  // LAB 6: Bostrom Simulation Calculator
  function initBostromLab() {
    const fpSlider = document.getElementById('bostrom-fp-slider');
    const niSlider = document.getElementById('bostrom-ni-slider');
    const fpValEl = document.getElementById('bostrom-fp-val');
    const niValEl = document.getElementById('bostrom-ni-val');
    const probEl = document.getElementById('bostrom-prob-val');
    const barEl = document.getElementById('bostrom-prob-bar');

    function update() {
      if (!fpSlider || !niSlider) return;
      const fp = parseFloat(fpSlider.value);
      const ni = parseFloat(niSlider.value);
      if (fpValEl) fpValEl.textContent = fp.toFixed(2);
      if (niValEl) niValEl.textContent = ni.toLocaleString('tr-TR');

      const prob = window.PhysicsEngine.calculateBostromSimProb(fp, ni);
      const pct = (prob * 100).toFixed(4);
      if (probEl) probEl.textContent = `%${pct}`;
      if (barEl) barEl.style.width = `${Math.min(prob * 100, 100)}%`;
    }

    if (fpSlider && niSlider) {
      fpSlider.oninput = update;
      niSlider.oninput = update;
      update();
    }
  }

  // LAB 7: Quantum Entanglement & Bell Inequality
  let bellCanvas, bellCtx;
  function initEntanglementLab() {
    bellCanvas = document.getElementById('bell-canvas');
    if (!bellCanvas) return;
    bellCtx = bellCanvas.getContext('2d');
    bellCanvas.width = bellCanvas.parentElement.clientWidth || 360;
    bellCanvas.height = 200;

    const angleASlider = document.getElementById('bell-angle-a-slider');
    const angleBSlider = document.getElementById('bell-angle-b-slider');
    const angleAVal = document.getElementById('bell-angle-a-val');
    const angleBVal = document.getElementById('bell-angle-b-val');
    const corrVal = document.getElementById('bell-corr-val');
    const chshVal = document.getElementById('bell-chsh-val');
    const badge = document.getElementById('bell-status-badge');

    function updateBell() {
      if (!angleASlider || !angleBSlider) return;
      const degA = parseFloat(angleASlider.value);
      const degB = parseFloat(angleBSlider.value);
      const radA = (degA * Math.PI) / 180;
      const radB = (degB * Math.PI) / 180;

      if (angleAVal) angleAVal.textContent = `${degA}°`;
      if (angleBVal) angleBVal.textContent = `${degB}°`;

      const corr = window.PhysicsEngine.calculateBellCorrelation(radA, radB);
      if (corrVal) corrVal.textContent = corr.toFixed(4);

      // Evaluate CHSH with standard optimal test angles relative to A and B
      const chsh = window.PhysicsEngine.calculateCHSH(radA, radA + Math.PI / 4, radB, radB + Math.PI / 4);
      if (chshVal) chshVal.textContent = chsh.S.toFixed(3);

      if (badge) {
        if (chsh.violatesLocalRealism) {
          badge.className = 'mt-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
          badge.textContent = currentLang === 'tr' ? '⚡ Yerel Gerçekçilik İhlal Edildi (Kuantum Dolanık)' : '⚡ Local Realism Violated (Entangled)';
        } else {
          badge.className = 'mt-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40';
          badge.textContent = currentLang === 'tr' ? 'Klasik Sınır İçinde (S ≤ 2)' : 'Within Classical Bound (S <= 2)';
        }
      }

      drawBellGraphic(degA, degB, corr);
    }

    function drawBellGraphic(degA, degB, corr) {
      if (!bellCtx) return;
      const w = bellCanvas.width;
      const h = bellCanvas.height;
      bellCtx.clearRect(0, 0, w, h);

      const cx1 = w * 0.28;
      const cx2 = w * 0.72;
      const cy = h / 2;
      const r = 38;

      // Source photon emission in center
      bellCtx.beginPath();
      bellCtx.arc(w / 2, cy, 8, 0, Math.PI * 2);
      bellCtx.fillStyle = '#f72585';
      bellCtx.fill();
      bellCtx.font = '10px monospace';
      bellCtx.fillStyle = '#ffffff';
      bellCtx.textAlign = 'center';
      bellCtx.fillText('|Ψ⁺⟩', w / 2, cy - 14);

      // Entanglement link line
      bellCtx.beginPath();
      bellCtx.moveTo(cx1, cy);
      bellCtx.lineTo(cx2, cy);
      bellCtx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
      bellCtx.lineWidth = 2;
      bellCtx.setLineDash([4, 4]);
      bellCtx.stroke();
      bellCtx.setLineDash([]);

      // Alice polarizer circle
      bellCtx.beginPath();
      bellCtx.arc(cx1, cy, r, 0, Math.PI * 2);
      bellCtx.strokeStyle = 'rgba(0, 242, 254, 0.6)';
      bellCtx.stroke();
      const ax = cx1 + r * Math.cos((degA * Math.PI) / 180);
      const ay = cy - r * Math.sin((degA * Math.PI) / 180);
      bellCtx.beginPath();
      bellCtx.moveTo(cx1, cy);
      bellCtx.lineTo(ax, ay);
      bellCtx.strokeStyle = '#00f2fe';
      bellCtx.lineWidth = 3;
      bellCtx.stroke();
      bellCtx.fillText(`Alice (${degA}°)`, cx1, cy + r + 16);

      // Bob polarizer circle
      bellCtx.beginPath();
      bellCtx.arc(cx2, cy, r, 0, Math.PI * 2);
      bellCtx.strokeStyle = 'rgba(157, 78, 221, 0.6)';
      bellCtx.stroke();
      const bx = cx2 + r * Math.cos((degB * Math.PI) / 180);
      const by = cy - r * Math.sin((degB * Math.PI) / 180);
      bellCtx.beginPath();
      bellCtx.moveTo(cx2, cy);
      bellCtx.lineTo(bx, by);
      bellCtx.strokeStyle = '#9d4edd';
      bellCtx.lineWidth = 3;
      bellCtx.stroke();
      bellCtx.fillText(`Bob (${degB}°)`, cx2, cy + r + 16);
    }

    if (angleASlider && angleBSlider) {
      angleASlider.oninput = updateBell;
      angleBSlider.oninput = updateBell;
      updateBell();
    }
  }

  // LAB 8: Cosmic Scales & Seth Lloyd Matrix
  function initScalesLab() {
    const scaleSlider = document.getElementById('scale-slider');
    const nameVal = document.getElementById('scale-name-val');
    const sizeVal = document.getElementById('scale-size-val');
    const massVal = document.getElementById('scale-mass-val');
    const bitsVal = document.getElementById('scale-bits-val');
    const descVal = document.getElementById('scale-desc-val');

    function updateScale() {
      if (!scaleSlider || !window.PhysicsEngine.COSMIC_SCALES) return;
      const idx = parseInt(scaleSlider.value, 10);
      const item = window.PhysicsEngine.COSMIC_SCALES[idx];
      if (!item) return;

      if (nameVal) nameVal.textContent = `${idx + 1}. ${currentLang === 'tr' ? item.nameTr : item.nameEn}`;
      if (sizeVal) sizeVal.textContent = `${window.PhysicsEngine.formatSciNum(item.sizeMeters)} m`;
      if (massVal) massVal.textContent = `${window.PhysicsEngine.formatSciNum(item.massKg)} kg`;
      if (bitsVal) bitsVal.textContent = `${window.PhysicsEngine.formatSciNum(item.bits)} bit`;
      if (descVal) descVal.textContent = currentLang === 'tr' ? item.descTr : item.descEn;
    }

    if (scaleSlider) {
      scaleSlider.oninput = updateScale;
      updateScale();
    }
  }

  // LAB 9: Landauer Bit Erasure & Maxwell's Demon Thermodynamic Simulator
  let landauerCanvas, landauerCtx, landauerHeatWaves = [], landauerCurrentBits = '0110101100110101';
  function initLandauerLab() {
    const bitInput = document.getElementById('landauer-bitstream-input');
    const tempSlider = document.getElementById('landauer-temp-slider');
    const tempVal = document.getElementById('landauer-temp-val');
    const shannonVal = document.getElementById('landauer-shannon-val');
    const singleVal = document.getElementById('landauer-single-val');
    const totalVal = document.getElementById('landauer-total-val');
    const randomBtn = document.getElementById('landauer-random-btn');
    const eraseBtn = document.getElementById('landauer-erase-btn');

    landauerCanvas = document.getElementById('landauer-canvas');
    if (landauerCanvas) {
      landauerCtx = landauerCanvas.getContext('2d');
      landauerCanvas.width = landauerCanvas.parentElement.clientWidth || 360;
      landauerCanvas.height = 200;
    }

    function updateLandauer() {
      const rawBits = bitInput ? bitInput.value.replace(/[^01]/g, '') || '0' : '01101011';
      landauerCurrentBits = rawBits;
      const tempK = tempSlider ? parseFloat(tempSlider.value) : 300;

      if (tempVal) {
        let label = '';
        if (tempK < 5) label = ' (Kozmik Mikrodalga Arka Plan)';
        else if (tempK >= 290 && tempK <= 310) label = ' (Oda Sıcaklığı)';
        tempVal.textContent = `${tempK.toFixed(1)} K${label}`;
      }

      const res = window.PhysicsEngine.calculateLandauerStream(rawBits, tempK);
      if (shannonVal) shannonVal.textContent = `${res.shannonEntropy.toFixed(4)} bit (${res.bitCount} bit dizi)`;
      if (singleVal) singleVal.textContent = `${window.PhysicsEngine.formatSciNum(res.singleBitEnergy)} J`;
      if (totalVal) {
        totalVal.textContent = `${window.PhysicsEngine.formatSciNum(res.totalJoules)} J (${window.PhysicsEngine.formatSciNum(res.totalEv)} eV)`;
      }
    }

    if (randomBtn && bitInput) {
      randomBtn.onclick = () => {
        let s = '';
        for (let i = 0; i < 16; i++) s += Math.random() > 0.5 ? '1' : '0';
        bitInput.value = s;
        updateLandauer();
        if (window.CosmicAudio) window.CosmicAudio.playQuantumPing(580);
      };
    }

    if (eraseBtn && bitInput) {
      eraseBtn.onclick = () => {
        updateLandauer();
        // Spawn thermal dissipation wave in canvas
        landauerHeatWaves.push({ r: 15, alpha: 1.0 });
        bitInput.value = '0'.repeat(Math.min(16, Math.max(8, landauerCurrentBits.length)));
        updateLandauer();
        if (window.CosmicAudio) window.CosmicAudio.playQuantumPing(320);
      };
    }

    if (bitInput) bitInput.oninput = updateLandauer;
    if (tempSlider) tempSlider.oninput = updateLandauer;
    updateLandauer();

    if (!window._landauerAnimStarted) {
      window._landauerAnimStarted = true;
      const molecules = Array.from({ length: 24 }, () => ({
        x: Math.random() * 320 + 20,
        y: Math.random() * 110 + 20,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        hot: Math.random() > 0.5
      }));

      function renderLandauerCanvas() {
        if (activeLab === 'landauer' && landauerCtx && landauerCanvas) {
          const w = landauerCanvas.width;
          const h = landauerCanvas.height;
          landauerCtx.clearRect(0, 0, w, h);

          // Chamber divider (Maxwell's Demon gate)
          const midX = w / 2;
          landauerCtx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
          landauerCtx.setLineDash([5, 5]);
          landauerCtx.beginPath();
          landauerCtx.moveTo(midX, 10);
          landauerCtx.lineTo(midX, h - 52);
          landauerCtx.stroke();
          landauerCtx.setLineDash([]);

          // Molecules
          molecules.forEach(m => {
            m.x += m.vx;
            m.y += m.vy;
            if (m.x < 12 || m.x > w - 12) m.vx *= -1;
            if (m.y < 12 || m.y > h - 58) m.vy *= -1;

            landauerCtx.beginPath();
            landauerCtx.arc(m.x, m.y, 4, 0, Math.PI * 2);
            landauerCtx.fillStyle = m.hot ? '#f72585' : '#00f2fe';
            landauerCtx.fill();
          });

          // Draw bit memory cells at bottom
          const bits = landauerCurrentBits.slice(0, 16).split('');
          const cellW = Math.min(20, (w - 24) / Math.max(1, bits.length));
          const startX = (w - bits.length * cellW) / 2;
          const cellY = h - 38;

          bits.forEach((b, idx) => {
            const x = startX + idx * cellW;
            landauerCtx.fillStyle = b === '1' ? 'rgba(0, 242, 254, 0.25)' : 'rgba(30, 41, 59, 0.8)';
            landauerCtx.strokeStyle = b === '1' ? '#00f2fe' : '#475569';
            landauerCtx.lineWidth = 1;
            landauerCtx.fillRect(x, cellY, cellW - 2, 24);
            landauerCtx.strokeRect(x, cellY, cellW - 2, 24);

            landauerCtx.fillStyle = b === '1' ? '#00f2fe' : '#94a3b8';
            landauerCtx.font = '11px Fira Code, monospace';
            landauerCtx.textAlign = 'center';
            landauerCtx.fillText(b, x + (cellW - 2) / 2, cellY + 16);
          });

          // Thermal dissipation waves on erasure
          for (let i = landauerHeatWaves.length - 1; i >= 0; i--) {
            const hw = landauerHeatWaves[i];
            hw.r += 3.5;
            hw.alpha -= 0.025;
            if (hw.alpha <= 0) {
              landauerHeatWaves.splice(i, 1);
              continue;
            }
            landauerCtx.beginPath();
            landauerCtx.arc(midX, cellY, hw.r, Math.PI, Math.PI * 2);
            landauerCtx.strokeStyle = `rgba(247, 37, 133, ${hw.alpha})`;
            landauerCtx.lineWidth = 2.5;
            landauerCtx.stroke();
          }
        }
        requestAnimationFrame(renderLandauerCanvas);
      }
      renderLandauerCanvas();
    }
  }

  // LAB 10: AdS/CFT & Ryu-Takayanagi Holographic Entanglement Simulator
  let rtCanvas, rtCtx;
  function initAdSCFTLab() {
    const angleSlider = document.getElementById('rt-angle-slider');
    const chargeSlider = document.getElementById('rt-charge-slider');
    const angleVal = document.getElementById('rt-angle-val');
    const chargeVal = document.getElementById('rt-charge-val');
    const geodesicVal = document.getElementById('rt-geodesic-val');
    const entropyVal = document.getElementById('rt-entropy-val');
    const qubitsVal = document.getElementById('rt-qubits-val');

    rtCanvas = document.getElementById('rt-canvas');
    if (rtCanvas) {
      rtCtx = rtCanvas.getContext('2d');
      rtCanvas.width = rtCanvas.parentElement.clientWidth || 360;
      rtCanvas.height = 240;
    }

    function updateRT() {
      const deg = angleSlider ? parseFloat(angleSlider.value) : 120;
      const c = chargeSlider ? parseFloat(chargeSlider.value) : 12;
      const rad = (deg * Math.PI) / 180;

      if (angleVal) angleVal.textContent = `${deg}°`;
      if (chargeVal) chargeVal.textContent = c.toFixed(1);

      const rt = window.PhysicsEngine.calculateRyuTakayanagi(rad, c, 1.0, 0.01);
      if (geodesicVal) geodesicVal.textContent = rt.geodesicLength.toFixed(3);
      if (entropyVal) entropyVal.textContent = `${rt.entropy.toFixed(3)} k_B`;
      if (qubitsVal) qubitsVal.textContent = `${rt.bits.toFixed(2)} Qubit`;

      drawPoincareDisk(deg, c);
    }

    function drawPoincareDisk(deg, c) {
      if (!rtCtx || !rtCanvas) return;
      const w = rtCanvas.width;
      const h = rtCanvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.42;

      rtCtx.clearRect(0, 0, w, h);

      // Draw hyperbolic MERA-like tensor network web inside AdS bulk
      const rings = [0.35, 0.68, 1.0];
      const nodesPerRing = [6, 12, 24];
      const ringCoords = [];

      rings.forEach((ratio, rIdx) => {
        const count = nodesPerRing[rIdx];
        const r = R * ratio;
        const pts = [];
        for (let i = 0; i < count; i++) {
          const a = (i * 2 * Math.PI) / count;
          pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
        }
        ringCoords.push(pts);
      });

      rtCtx.strokeStyle = 'rgba(148, 163, 184, 0.16)';
      rtCtx.lineWidth = 1;
      for (let rIdx = 0; rIdx < ringCoords.length - 1; rIdx++) {
        const inner = ringCoords[rIdx];
        const outer = ringCoords[rIdx + 1];
        inner.forEach((p1, i) => {
          const p2 = outer[(i * 2) % outer.length];
          const p3 = outer[(i * 2 + 1) % outer.length];
          rtCtx.beginPath();
          rtCtx.moveTo(p1.x, p1.y);
          rtCtx.lineTo(p2.x, p2.y);
          rtCtx.moveTo(p1.x, p1.y);
          rtCtx.lineTo(p3.x, p3.y);
          rtCtx.stroke();
        });
      }

      // Draw full AdS boundary circle (CFT boundary)
      rtCtx.beginPath();
      rtCtx.arc(cx, cy, R, 0, Math.PI * 2);
      rtCtx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      rtCtx.lineWidth = 2;
      rtCtx.stroke();

      // Boundary subsystem A arc centered at top (-PI/2)
      const halfAngle = ((deg * Math.PI) / 180) / 2;
      const a1 = -Math.PI / 2 - halfAngle;
      const a2 = -Math.PI / 2 + halfAngle;

      rtCtx.beginPath();
      rtCtx.arc(cx, cy, R, a1, a2);
      rtCtx.strokeStyle = '#00f2fe';
      rtCtx.lineWidth = 4;
      rtCtx.shadowBlur = 10;
      rtCtx.shadowColor = '#00f2fe';
      rtCtx.stroke();
      rtCtx.shadowBlur = 0;

      // Endpoints of subsystem A on boundary
      const x1 = cx + R * Math.cos(a1);
      const y1 = cy + R * Math.sin(a1);
      const x2 = cx + R * Math.cos(a2);
      const y2 = cy + R * Math.sin(a2);

      // Ryu-Takayanagi Minimal Geodesic Curve gamma_A in Poincaré disk
      const depth = Math.cos(halfAngle);
      const ctrlX = cx;
      const ctrlY = cy - R * depth * 0.45;

      rtCtx.beginPath();
      rtCtx.moveTo(x1, y1);
      rtCtx.quadraticCurveTo(ctrlX, ctrlY, x2, y2);
      rtCtx.strokeStyle = '#f72585';
      rtCtx.lineWidth = 3;
      rtCtx.shadowBlur = 12;
      rtCtx.shadowColor = '#f72585';
      rtCtx.stroke();
      rtCtx.shadowBlur = 0;

      // Endpoint dots
      [
        { x: x1, y: y1 },
        { x: x2, y: y2 }
      ].forEach(pt => {
        rtCtx.beginPath();
        rtCtx.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
        rtCtx.fillStyle = '#00f2fe';
        rtCtx.fill();
      });

      // Labels
      rtCtx.fillStyle = '#00f2fe';
      rtCtx.font = '11px Fira Code, monospace';
      rtCtx.textAlign = 'center';
      rtCtx.fillText(`Sınır CFT Bölgesi A (${deg}°)`, cx, cy - R - 10);
      rtCtx.fillStyle = '#f72585';
      rtCtx.fillText('γ_A (Minimal Yüzey)', cx, ctrlY + 16);
    }

    if (angleSlider) angleSlider.oninput = updateRT;
    if (chargeSlider) chargeSlider.oninput = updateRT;
    updateRT();
  }

  // Initial App Render
  renderTimeline();
  renderComparisonMatrix();
  renderGlossary();
  renderArticles();
  renderQuiz();
  initOrResumeLab('atom');

  // Trigger KaTeX auto-render when ready
  window.addEventListener('load', () => {
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  });
});
