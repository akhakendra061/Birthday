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
  "Who is more romantic?",
  "Who is more annoying?",
  "Who gets angry faster?",
  "Who is more dramatic?",
  "Who is more likely to steal the other’s food?",
  "Who takes longer to get ready?",
  "Who says “I’m not hungry” and then eats the other person’s food?",
  "Who is more stubborn?",
  "Who starts random arguments for no reason?",
  "Who apologizes first after an argument?",
  "Who says “nothing” when something is definitely wrong?",
  "Who laughs at the worst possible moment?",
  "Who is more likely to fall asleep during a movie?",
  "Who sends more random messages?",
  "Who is more likely to say “one more episode” and watch five?",
  "Who gets jealous more easily?",
  "Who is more likely to forget something important?",
  "Who takes longer to decide what to eat?",
  "Who would survive longer without their phone?",
  "Who is more likely to make a stupid decision and say “trust me”?",
  "Who talks more?",
  "Who is more likely to interrupt the other while talking?",
  "Who gets distracted more easily?",
  "Who is more likely to steal the blanket?",
  "Who would survive longer in a zombie apocalypse?",
  "Who would panic first if we got lost?",
  "Who is more likely to get us into trouble?",
  "Who is more likely to laugh after saying something serious?",
  "Who checks the fridge even though they know there’s nothing inside?",
  "Who says “I don’t care” while definitely caring?",
  "Who is more likely to start a pillow fight?",
  "Who would win a staring contest?",
  "Who is more likely to send a message and immediately regret it?",
  "Who takes more selfies?",
  "Who says “I’m coming” while still getting ready?",
  "Who is more likely to secretly eat snacks?",
  "Who is more likely to forget where they put their phone?",
  "Who is more likely to laugh just because the other person laughed?",
  "Who can turn a 2-minute story into a 30-minute story?",
  "Who says “I’m fine” and then gives a whole speech?",
  "Who is more likely to make the other laugh when they’re trying to stay serious?",
  "Who gets hungry five minutes after eating?",
  "Who is more likely to spend money on something completely unnecessary?",
  "Who can turn a normal conversation into complete nonsense?",
  "Who says “I have a plan” without actually having a plan?",
  "Who gets offended by a joke and then makes an even worse joke?",
  "Who is more likely to start dancing for absolutely no reason?",
  "Who is more likely to make the other one blush?",
  "Who is more likely to randomly say “I miss you”?",
  "Who is more likely to make the other laugh on a bad day?",
  "Who is secretly the softest one?",
  "Who is luckier to have the other?"
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
    { text: "Khakendra 💙", value: "me" },
    { text: "Smarika 🩷", value: "you" }
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
