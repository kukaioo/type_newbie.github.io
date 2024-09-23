const words = 'In the quiet, dimly lit corner of the old library, where the dust-covered bookshelves stood like ancient sentinels, Amelia sat with her fingers gently tracing the worn pages of a forgotten manuscript, the soft sound of paper rustling breaking the profound silence, as her mind wandered through the centuries-old stories and legends that seemed to come alive with each word, transporting her to distant lands and times long past, where heroes and villains alike shaped the fate of kingdoms, and where magic and mystery intertwined with reality in the most unexpected ways Her eyes flickered with fascination as she uncovered tales of great battles fought under crimson skies, of whispered secrets hidden within the walls of grand castles, and of love stories so profound that they transcended time itself. As the hours slipped by unnoticed, the outside world seemed to fade away, leaving Amelia completely immersed in the rich history and vivid imaginations that these ancient texts held. Each turn of the page brought new discoveries, new characters, and new adventures, filling her heart with a sense of wonder and excitement that only stories from a bygone era could evoke. Even as the shadows in the library grew longer, she felt no desire to leave, for it was here, among these forgotten words, that she found herself truly alive.'.split(' ');
const wordsTH = 'ในมุมหนึ่งของห้องสมุดเก่าแก่ที่เงียบสงัดและมีแสงสลัว สายตาของอมีเลียจับจ้องไปยังหนังสือที่ปกคลุมด้วยฝุ่นซึ่งเรียงรายอยู่บนชั้นวางเก่าๆ ราวกับเป็นยามเฝ้าประวัติศาสตร์เก่าแก่ที่ถูกลืมเลือน เธอค่อยๆ ลูบไล้ไปตามหน้ากระดาษที่เก่าคร่ำคร่าในหนังสือเล่มหนึ่ง เสียงกระดาษที่ขยับเล็กน้อยเมื่อเธอพลิกหน้าเป็นเสียงเดียวที่ทำลายความเงียบสงบ ณ ขณะนั้น ขณะที่ความคิดของเธอเดินทางผ่านเรื่องราวและตำนานโบราณที่เหมือนจะฟื้นคืนชีพขึ้นมาต่อหน้าต่อตา พาเธอไปยังดินแดนและช่วงเวลาที่ห่างไกลออกไป ซึ่งมีทั้งวีรบุรุษและผู้ร้ายที่ร่วมกันเปลี่ยนแปลงชะตากรรมของอาณาจักร และที่ซึ่งเวทมนตร์กับความลึกลับผสมผสานเข้ากับความเป็นจริงในแบบที่ไม่คาดคิด '.split(' ');  // คำที่ใช้ในภาษาไทย
let currentWords = words;  // ตั้งค่าเริ่มต้นเป็นภาษาอังกฤษ


const wordsCount = words.length;
const gameTime = 60 * 1000;
window.timer = null;
window.gameStart = null;
window.mistakesCount = 0;
window.charsTyped = 0;

function addClass(el, name) {
    el.className += ' ' + name;
}

function removeClass(el, name) {
    el.className = el.className.replace(name, '');
}

function randomWord() {
    const randomIndex = Math.ceil(Math.random() * currentWords.length);
    return currentWords[randomIndex - 1];
}

function formatWord(word) {
    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
    document.getElementById('words').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('words').innerHTML += formatWord(randomWord()) + '';
    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    document.getElementById('infowpm').innerHTML = 'wpm:' + (gameTime / 1000);
    document.getElementById('infocpm').innerHTML = 'CPM: 0';
    window.timer = null;
    window.mistakesCount = 0;
    window.charsTyped = 0;
    document.getElementById('mistakes').innerHTML = `Mistakes: 0`;
}

document.getElementById('switchLangButton').addEventListener('click', function() {
    if (currentWords === words) {
        currentWords = wordsTH;  // เปลี่ยนเป็นภาษาไทย
        document.getElementById('switchLangButton').innerText = 'Switch to English';
    } else {
        currentWords = words;  // เปลี่ยนกลับเป็นภาษาอังกฤษ
        document.getElementById('switchLangButton').innerText = 'Switch to Thai';
    }
    newGame();  // เรียกใช้เกมใหม่
});

function getWpm() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
        const correctLetters = letters.filter(letter => letter.className.includes('correct'));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });
    return correctWords.length / gameTime * 60000;
}

// ฟังก์ชันนับจำนวนตัวอักษรที่พิมพ์ทั้งหมด (CPM)
function getCpm() {
    const typedLetters = [...document.querySelectorAll('.letter.correct, .letter.incorrect')];
    return (typedLetters.length / gameTime) * 60000;
}

function countMistakes(currentWord) {
    const incorrectLetters = [...currentWord.querySelectorAll('.letter.incorrect')];
    if (incorrectLetters.length > 0) { // ถ้ามีตัวอักษรที่ผิดในคำนี้
        window.mistakesCount += 1;
        document.getElementById('mistakes').innerHTML = `Mistakes: ${window.mistakesCount}`;
    }
}

function gameover() {
    clearInterval(window.timer);
    addClass(document.getElementById('game'), 'over');
    const resultWpm = getWpm();
    const resultCpm = getCpm();
    document.getElementById('infowpm').innerHTML = `WPM: ${resultWpm}`;
    document.getElementById('infocpm').innerHTML = `CPM: ${resultCpm}`;
}

function reloadPage() {
    location.reload();
}


// obj
document.getElementById('game').addEventListener('keyup', ev => {
    const key = ev.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;

    if (document.querySelector('#game.over')) {
        return;
    }

    console.log({ key, expected });

    if (!window.timer && isLetter) {
        window.timer = setInterval(() => {
            if (!window.gameStart) {
                window.gameStart = (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();
            const msPassed = currentTime - window.gameStart;
            const sPassed = Math.round(msPassed / 1000);
            const sLeft = Math.round((gameTime / 1000) - sPassed);
            if (sLeft < 0) {
                gameover();
                return;
            }
            document.getElementById('info').innerHTML = sLeft + '';
        }, 1000);
    }

    // true/not
    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, 'current');
            }
        } else {
            const incorrectLetter = document.createElement('span');
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = 'letter incorrect extra';
            currentWord.appendChild(incorrectLetter);
        }
        // เพิ่มการนับตัวอักษรที่พิมพ์
        window.charsTyped++;
        document.getElementById('infocpm').innerHTML = `CPM: ${getCpm()}`;

        // นับคำผิดทันทีเมื่อพิมพ์ตัวอักษรผิด
        countMistakes(currentWord);
    }

    // new words
    if (isSpace) {
        if (expected !== ' ') {
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            });
        }
        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling, 'current');
        if (currentLetter) {
            removeClass(currentLetter, 'current');
        }
        addClass(currentWord.nextSibling.firstChild, 'current');
    }
    // backspace
    if (isBackspace) {
        if (currentLetter && isFirstLetter) {
            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            addClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'incorrect');
            removeClass(currentWord.previousSibling.lastChild, 'correct');
        }
        if (currentLetter && !isFirstLetter) {
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'incorrect');
            removeClass(currentLetter.previousSibling, 'correct');
        }
        if (!currentLetter) {
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');
        }
    }
    // line
    if (currentWord.getBoundingClientRect().top > 250) {
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin - 35) + 'px';
    }
    // move cursor text
    const nextLetter = document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
  });

  newGame();
