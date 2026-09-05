const audio = document.getElementById('bgMusic');
let isMusicPlaying = false;

function toggleMusic() {
  const btn = document.getElementById('musicBtn');
  if (isMusicPlaying) {
    audio.pause();
    isMusicPlaying = false;
    btn.textContent = '🎵 Play';
  } else {
    audio.play().then(() => {
      isMusicPlaying = true;
      btn.textContent = '⏸ Pause';
    }).catch(e => console.log(e));
  }
}

function createFloating() {
  const container = document.getElementById('floating');
  if (!container) return;
  const symbols = ['❤️', '💖', '✨', '🌸', '🤍', '💋'];
  setInterval(() => {
    const el = document.createElement('div');
    el.innerText = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.position = 'absolute';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = '105vh';
    el.style.fontSize = (Math.random() * 15 + 15) + 'px';
    el.style.opacity = Math.random() * 0.5 + 0.3;
    el.style.transition = 'transform 6s linear, opacity 6s linear';
    container.appendChild(el);

    setTimeout(() => {
      el.style.transform = `translateY(-110vh) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = '0';
    }, 50);

    setTimeout(() => { el.remove(); }, 6500);
  }, 500);
}
createFloating();

function openLetter() {
  const letter = document.getElementById('letterText');
  letter.classList.toggle('active');
}

let chatStarted = false;
function startChat() {
  if (chatStarted) return;
  chatStarted = true;
  const msgs = document.querySelectorAll('.chat-msg');
  msgs.forEach((msg, idx) => {
    setTimeout(() => {
      msg.classList.add('visible');
    }, idx * 800);
  });
}

function unwrapAndOpenHeroGift(element, src, caption) {
  const cover = element.querySelector('.gift-box-cover');
  if (!isMusicPlaying) {
    audio.play().then(() => {
      isMusicPlaying = true;
      document.getElementById('musicBtn').textContent = '⏸ Pause';
    }).catch(e => console.log(e));
  }

  if (cover && !cover.classList.contains('unwrapping')) {
    cover.classList.add('unwrapping');
    confettiBurst(25);
    setTimeout(() => {
      openPhoto(src, caption);
    }, 500);
  } else {
    openPhoto(src, caption);
  }
}

function unwrapAndOpen(element, src, caption) {
  const cover = element.querySelector('.gift-box-cover');
  if (cover && !cover.classList.contains('unwrapping')) {
    cover.classList.add('unwrapping');
    confettiBurst(25);
    setTimeout(() => {
      openPhoto(src, caption);
    }, 500);
  } else {
    openPhoto(src, caption);
  }
}

function openPhoto(src, caption) {
  const modal = document.getElementById('modal');
  const modalArt = document.getElementById('modalArt');
  const modalTitle = document.getElementById('modalTitle');

  if (src.includes('.') || src.includes('/')) {
    modalArt.innerHTML = `<img src="${src}" alt="${caption}">`;
  } else {
    modalArt.innerHTML = `<div style="font-size: 5rem;">${src}</div>`;
  }

  modalTitle.textContent = caption;
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('active');
}

// Games Hub Modal Logic
function openGamesHubModal() {
  document.getElementById('gamesHubModal').classList.add('active');
  backToGameHub();
}

function closeGamesHubModal() {
  document.getElementById('gamesHubModal').classList.remove('active');
}

function launchGame(gameType) {
  document.getElementById('gameHubMenuView').style.display = 'none';
  if (gameType === 'match') {
    document.getElementById('matchGameView').style.display = 'block';
    resetMemoryMatch();
  } else if (gameType === 'vsGame') {
    document.getElementById('vsGameView').style.display = 'block';
    startVsGame();
  } else if (gameType === 'truthDare') {
    document.getElementById('truthDareGameView').style.display = 'block';
    startTruthDareGame();
  }
}

function backToGameHub() {
  document.getElementById('gameHubMenuView').style.display = 'block';
  document.getElementById('matchGameView').style.display = 'none';
  document.getElementById('vsGameView').style.display = 'none';
  document.getElementById('truthDareGameView').style.display = 'none';
}

// Game 1: Love Memory Match
const gameEmojis = ['💖', '🌸', '🧸', '💍', '✨', '🍫'];
let matchCards = [];
let flippedCards = [];
let matchedPairs = 0;
let matchMoves = 0;
let isCheckingMatch = false;

function resetMemoryMatch() {
  const grid = document.getElementById('memoryGrid');
  grid.innerHTML = '';
  document.getElementById('matchWinMessage').style.display = 'none';
  matchMoves = 0;
  matchedPairs = 0;
  document.getElementById('matchMoves').textContent = matchMoves;
  
  matchCards = [...gameEmojis, ...gameEmojis]
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }));

  matchCards.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.classList.add('memory-card');
    cardEl.dataset.id = card.id;

    const innerEl = document.createElement('div');
    innerEl.classList.add('memory-card-inner');

    const frontEl = document.createElement('div');
    frontEl.classList.add('memory-card-front');
    frontEl.textContent = '❤️';

    const backEl = document.createElement('div');
    backEl.classList.add('memory-card-back');
    backEl.textContent = card.emoji;

    innerEl.appendChild(frontEl);
    innerEl.appendChild(backEl);
    cardEl.appendChild(innerEl);

    cardEl.addEventListener('click', () => handleCardClick(card.id, cardEl));
    grid.appendChild(cardEl);
  });
}

function handleCardClick(id, cardEl) {
  if (isCheckingMatch) return;
  const card = matchCards.find(c => c.id === id);
  if (card.flipped || card.matched) return;

  card.flipped = true;
  cardEl.classList.add('flipped');
  flippedCards.push({ id, emoji: card.emoji, element: cardEl });

  if (flippedCards.length === 2) {
    matchMoves++;
    document.getElementById('matchMoves').textContent = matchMoves;
    isCheckingMatch = true;

    if (flippedCards[0].emoji === flippedCards[1].emoji) {
      flippedCards.forEach(c => {
        matchCards.find(card => card.id === c.id).matched = true;
        c.element.classList.add('matched');
      });
      matchedPairs++;
      flippedCards = [];
      isCheckingMatch = false;

      if (matchedPairs === gameEmojis.length) {
        document.getElementById('winText').textContent = `🎉 You won in ${matchMoves} moves! You're amazing! ❤️`;
        document.getElementById('matchWinMessage').style.display = 'block';
        confettiBurst(40);
      }
    } else {
      setTimeout(() => {
        flippedCards.forEach(c => {
          matchCards.find(card => card.id === c.id).flipped = false;
          c.element.classList.remove('flipped');
        });
        flippedCards = [];
        isCheckingMatch = false;
      }, 700);
    }
  }
}

// Game 2: You 💙 VS Me 🩷
const vsQuestions = [
  "1. Who is more romantic?",
  "2. Who fell for the other first?",
  "3. Who caught feelings first?",
  "4. Who is more likely to miss the other?",
  "5. Who is more affectionate?",
  "6. Who gets jealous more easily?",
  "7. Who is more protective?",
  "8. Who is more likely to text first after an argument?",
  "9. Who says “I love you” more often?",
  "10. Who is more likely to say “I miss you” first?",
  "11. Who gives better compliments?",
  "12. Who gives better hugs?",
  "13. Who loves cuddling more?",
  "14. Who is more clingy?",
  "15. Who is more likely to want to spend all day together?",
  "16. Who gets more excited to see the other?",
  "17. Who is more likely to plan a surprise date?",
  "18. Who gives better gifts?",
  "19. Who remembers the little things better?",
  "20. Who is more likely to write a cute message for the other?",
  "21. Who is more likely to make the other blush?",
  "22. Who gets shy around the other sometimes?",
  "23. Who is more likely to stare at the other when they aren't looking?",
  "24. Who is more likely to randomly kiss the other?",
  "25. Who gets jealous but hides it?",
  "26. Who is more likely to apologize first?",
  "27. Who forgives faster?",
  "28. Who is more likely to overthink after an argument?",
  "29. Who is more likely to start a silly argument just for attention?",
  "30. Who is more dramatic?",
  "31. Who is more stubborn?",
  "32. Who is more likely to tease the other?",
  "33. Who is more likely to make the other laugh when they’re upset?",
  "34. Who knows the other better?",
  "35. Who remembers more details about the relationship?",
  "36. Who is more likely to make a cute couple plan for the future?",
  "37. Who is more likely to imagine your future together?",
  "38. Who would plan the better date?",
  "39. Who is more likely to randomly say something romantic?",
  "40. Who is more likely to get butterflies around the other?",
  "41. Who is more likely to fall asleep while talking to the other?",
  "42. Who is more likely to send random selfies?",
  "43. Who is more likely to call just because they miss the other?",
  "44. Who is more likely to make the first move?",
  "45. Who loves the other more? 👀",
  "46. Who is more obsessed with the other? 😂❤️",
  "47. Who is more likely to make the biggest sacrifice for the relationship?",
  "48. Who is more likely to remember exactly how you first met?",
  "49. Who is more likely to know exactly what makes the other happy?",
  "50. Who is more likely to turn an ordinary day into a special one? ❤️"
];

let currentVsIndex = 0;

function startVsGame() {
  currentVsIndex = 0;
  document.getElementById('vsCardContainer').style.display = 'block';
  document.getElementById('vsResultContainer').style.display = 'none';
  loadVsQuestion();
}

function loadVsQuestion() {
  const container = document.getElementById('vsCardContainer');
  container.classList.remove('animating');
  
  document.getElementById('vsProgressIndicator').textContent = `Question ${currentVsIndex + 1} of ${vsQuestions.length}`;
  document.getElementById('vsQuestion').textContent = vsQuestions[currentVsIndex];
  
  const optionsContainer = document.getElementById('vsOptions');
  optionsContainer.innerHTML = '';

  const options = [
    { text: "Moksh 💙", value: "me" },
    { text: "Shrish 🩷", value: "you" },
    { text: "both 💞", value: "both" }
  ];

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.classList.add('vs-option-btn');
    btn.innerHTML = opt.text;
    btn.addEventListener('click', (e) => handleVsChoice(e));
    optionsContainer.appendChild(btn);
  });
}

function handleVsChoice(e) {
  const container = document.getElementById('vsCardContainer');
  container.classList.add('animating');
  confettiBurst(15, e.clientX, e.clientY);

  setTimeout(() => {
    currentVsIndex++;
    if (currentVsIndex < vsQuestions.length) {
      loadVsQuestion();
    } else {
      document.getElementById('vsCardContainer').style.display = 'none';
      document.getElementById('vsResultContainer').style.display = 'block';
      confettiBurst(45);
    }
  }, 400);
}

function restartVsGame() {
  startVsGame();
}

// Game 3: Truth & Dare
const truthQuestionsPool = [
  "What was the first thing you noticed about me?",
  "What is one thing about me that always makes you smile?",
  "What is the funniest thing you think I do? 😂",
  "What is one habit of mine that secretly annoys you?",
  "What is your favorite memory of us so far?",
  "When do you feel closest to me?",
  "What is one thing about me that you hope never changes?",
  "What is something I do that makes you feel special?",
  "If you had to describe our relationship in three words, what would they be?",
  "What is one silly thing you would love for us to do together someday?",
  "Who do you think is more stubborn — you or me? Be honest. 😂",
  "What is something you’ve always wanted to tell me but never found the right moment for?",
  "What is the cutest thing I have ever done without realizing it?",
  "What is one thing you think we are really good at as a couple?",
  "If our relationship had a movie title, what would you call it?",
  "What is one moment with me that you wish you could experience again?",
  "What is something about me that makes you feel safe or comfortable?",
  "If you could plan our perfect day together, what would we do?",
  "What is one thing you want us to experience together in the future?",
  "What is the most random thing that reminds you of me?",
  "What is something about me that didn’t expect but ended up loving?",
  "If you could keep one memory of us forever, which one would you choose?",
  "What is one thing you think I don’t realize about how much you care about me?",
  "What is your favorite little thing about being “us”? ❤️",
  "If you had to tell me one beautiful thing from your heart right now, what would you say? 💗"
];

const dareQuestionsPool = [
  "Send me your cutest selfie right now. 📸",
  "Send me a 10-second voice note saying “I love you” in the most dramatic way possible. 😂",
  "Describe me using only 5 emojis.",
  "Do your best impression of me. 😂",
  "Give me a completely ridiculous nickname and explain why.",
  "Send me a voice note singing the first song that comes to your mind. 🎶",
  "Make me laugh using only one sentence.",
  "Write a tiny 2-line poem about us. ❤️",
  "Send me a voice note saying my name in your sweetest voice.",
  "Create a fake movie title about our relationship and give me the movie plot. 😂",
  "Tell me three things you genuinely love about me.",
  "Send me the first emoji that comes to your mind when you think of me.",
  "Pretend you’re accepting an award for “Best Girlfriend” and give a 20-second speech. 🏆",
  "Send me a message as if we are meeting for the first time.",
  "Make up a ridiculous rule that should officially exist in our relationship. 😂",
  "Tell me one thing you want us to do together someday.",
  "Send me a voice note trying to make me blush without actually saying “I love you.” 😏",
  "Describe our relationship like a sports commentator. 😂",
  "Send me a completely random compliment that I wouldn’t expect.",
  "Finish this sentence: “I knew you were special when…” ❤️",
  "Pretend you’re angry at me because I stole your food and give me a 15-second lecture. 😂",
  "Write a one-line message that would instantly make my day.",
  "Tell me what our future “old couple” argument would probably be about. 😂",
  "Close your eyes, think of me for 5 seconds, then tell me the first thing that comes to your mind.",
  "If you could give me one kiss, one hug, and one sentence from your heart right now, what would they be? ❤️🥹"
];

let tdCurrentRound = 1;
let tdCurrentTurn = 1;
let tdAvailableTruths = [];
let tdAvailableDares = [];
let tdCurrentType = '';
let tdCurrentQuestion = '';
let tdRoundAnswers = [];

function startTruthDareGame() {
  tdCurrentRound = 1;
  tdCurrentTurn = 1;
  tdRoundAnswers = [];
  tdAvailableTruths = [...truthQuestionsPool].sort(() => Math.random() - 0.5);
  tdAvailableDares = [...dareQuestionsPool].sort(() => Math.random() - 0.5);
  
  document.getElementById('tdChoiceContainer').style.display = 'block';
  document.getElementById('tdQuestionContainer').style.display = 'none';
  document.getElementById('tdRoundSummaryContainer').style.display = 'none';
  document.getElementById('tdGameOverContainer').style.display = 'none';
  updateTdIndicator();
}

function updateTdIndicator() {
  document.getElementById('tdRoundIndicator').textContent = `Round ${tdCurrentRound} of 5 (Turn ${tdCurrentTurn}/5)`;
}

function chooseTruthOrDare(type) {
  tdCurrentType = type;
  if (type === 'truth') {
    tdCurrentQuestion = tdAvailableTruths.pop() || "Tell me a sweet secret about us! ❤️";
    document.getElementById('tdBadge').textContent = '💗 Truth';
    document.getElementById('tdBadge').style.color = '#d90429';
  } else {
    tdCurrentQuestion = tdAvailableDares.pop() || "Send me your sweetest smile! ✨";
    document.getElementById('tdBadge').textContent = '🔥 Dare';
    document.getElementById('tdBadge').style.color = '#1d3557';
  }

  document.getElementById('tdQuestionText').textContent = tdCurrentQuestion;
  document.getElementById('tdAnswerInput').value = '';
  
  document.getElementById('tdChoiceContainer').style.display = 'none';
  document.getElementById('tdQuestionContainer').style.display = 'block';
  confettiBurst(15);
}

function submitTdAnswer() {
  const answerText = document.getElementById('tdAnswerInput').value.trim() || "(No typed answer provided / Sent via WhatsApp)";
  
  tdRoundAnswers.push({
    round: tdCurrentRound,
    turn: tdCurrentTurn,
    type: tdCurrentType,
    question: tdCurrentQuestion,
    answer: answerText
  });

  if (tdCurrentTurn < 5) {
    tdCurrentTurn++;
    updateTdIndicator();
    document.getElementById('tdQuestionContainer').style.display = 'none';
    document.getElementById('tdChoiceContainer').style.display = 'block';
  } else {
    showTdRoundSummary();
  }
}

function showTdRoundSummary() {
  document.getElementById('tdQuestionContainer').style.display = 'none';
  document.getElementById('tdRoundSummaryContainer').style.display = 'block';
  document.getElementById('tdSummaryTitle').textContent = `Round ${tdCurrentRound} Complete! 🌸`;
  
  const listContainer = document.getElementById('tdSummaryList');
  listContainer.innerHTML = '';

  const currentRoundItems = tdRoundAnswers.filter(item => item.round === tdCurrentRound);
  currentRoundItems.forEach((item, idx) => {
    const itemEl = document.createElement('div');
    itemEl.style.padding = '10px';
    itemEl.style.background = 'var(--pink)';
    itemEl.style.borderRadius = '10px';
    itemEl.style.fontSize = '0.9rem';
    itemEl.innerHTML = `<strong>Q${idx + 1} [${item.type.toUpperCase()}]:</strong> ${item.question}<br><span style="color:#d90429;"><strong>Answer:</strong> ${item.answer}</span>`;
    listContainer.appendChild(itemEl);
  });

  const nextBtn = document.getElementById('tdNextRoundBtn');
  if (tdCurrentRound === 5) {
    nextBtn.textContent = 'Finish Game 🎉';
  } else {
    nextBtn.textContent = 'Start Next Round 🚀';
  }
  confettiBurst(30);
}

function startNextTdRound() {
  if (tdCurrentRound < 5) {
    tdCurrentRound++;
    tdCurrentTurn = 1;
    updateTdIndicator();
    document.getElementById('tdRoundSummaryContainer').style.display = 'none';
    document.getElementById('tdChoiceContainer').style.display = 'block';
  } else {
    document.getElementById('tdRoundSummaryContainer').style.display = 'none';
    document.getElementById('tdGameOverContainer').style.display = 'block';
    confettiBurst(50);
  }
}

function restartTruthDareGame() {
  startTruthDareGame();
}

function confettiBurst(count = 20, clientX, clientY) {
  const container = document.getElementById('floating');
  if (!container) return;
  const symbols = ['🎉', '💖', '✨', '❤️', '🌸'];
  const startX = clientX !== undefined ? clientX : window.innerWidth / 2;
  const startY = clientY !== undefined ? clientY : window.innerHeight / 2;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.innerText = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.position = 'fixed';
    el.style.left = startX + 'px';
    el.style.top = startY + 'px';
    el.style.fontSize = (Math.random() * 20 + 15) + 'px';
    el.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    container.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 180 + 30;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;

    setTimeout(() => {
      el.style.transform = `translate(${tx}px, ${ty}px) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = '0';
    }, 50);

    setTimeout(() => { el.remove(); }, 1050);
  }
}

document.addEventListener('click', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
  confettiBurst(10, e.clientX, e.clientY);
});

function toggleBucket(item) {
  item.classList.toggle('checked');
}

function loveMeter() {
  const bar = document.getElementById('loveBar');
  const text = document.getElementById('loveText');
  bar.style.width = '100%';
  text.textContent = "Error: Love level is infinity and beyond calculation! ❤️";
}

function openGift() {
  const msg = document.getElementById('giftMessage');
  msg.style.display = 'block';
  confettiBurst(30);
}

function openSecretRoom() {
  document.getElementById('secretModal').classList.add('active');
}
function closeSecretRoom() {
  document.getElementById('secretModal').classList.remove('active');
  document.getElementById('secretPwd').value = '';
  document.getElementById('secretError').style.display = 'none';
  document.getElementById('secretReveal').style.display = 'none';
}
function checkPassword() {
  const pwd = document.getElementById('secretPwd').value.trim();
  const error = document.getElementById('secretError');
  const reveal = document.getElementById('secretReveal');

  if (pwd === 'KlovesS') {
    error.style.display = 'none';
    reveal.style.display = 'block';
    confettiBurst(40);
  } else {
    error.style.display = 'block';
    reveal.style.display = 'none';
  }
}

function finalSurprise() {
  document.getElementById('finalSurprise').classList.add('active');
  confettiBurst(50);
}
function closeFinal() {
  document.getElementById('finalSurprise').classList.remove('active');
}

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
});
