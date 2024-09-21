const words = 'In the quiet, dimly lit corner of the old library, where the dust-covered bookshelves stood like ancient sentinels, Amelia sat with her fingers gently tracing the worn pages of a forgotten manuscript, the soft sound of paper rustling breaking the profound silence, as her mind wandered through the centuries-old stories and legends that seemed to come alive with each word, transporting her to distant lands and times long past, where heroes and villains alike shaped the fate of kingdoms, and where magic and mystery intertwined with reality in the most unexpected ways Her eyes flickered with fascination as she uncovered tales of great battles fought under crimson skies, of whispered secrets hidden within the walls of grand castles, and of love stories so profound that they transcended time itself. As the hours slipped by unnoticed, the outside world seemed to fade away, leaving Amelia completely immersed in the rich history and vivid imaginations that these ancient texts held. Each turn of the page brought new discoveries, new characters, and new adventures, filling her heart with a sense of wonder and excitement that only stories from a bygone era could evoke. Even as the shadows in the library grew longer, she felt no desire to leave, for it was here, among these forgotten words, that she found herself truly alive.'.split(' ');
const wordsCount = words.length;
const gameTime = 60 * 1000;
window.timer = null;
window.gameStart = null;

function addClass(el,name) {
    el.className += ' '+name;
}
function removeClass(el,name) {
    el.className = el.className.replace(name, '');
}

function randomWord() {
    const randomIndex = Math.ceil( Math.random() * wordsCount); 
    return words[randomIndex - 1]; 
}

function formatWord(word) {
    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
    document.getElementById('words').innerHTML = '';
    for (let i = 0; i < 200; i++) {
        document.getElementById('words').innerHTML += formatWord(randomWord()) + '';
    }
    addClass(document.querySelector('.word'),  'current');
    addClass(document.querySelector('.letter'), 'current');
    window.timer = null;
}

function gameover() {
    clearInterval(window.timer);
    addClass(document.getElementById('game'), 'over');
    const result = getWpm();
    document.getElementById('info').innerHTML = `WPM: ${result}`;
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

    console.log({key,expected});

    if (!window.timer && isLetter) {
        window.timer = setInterval( () => {
            if(!window.gameStart) {
                window.gameStart = (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();
            const msPassed = currentTime - window.gameStart;
            const sPassed = Math.round(msPassed / 1000);
            const sLeft = Math.round((gameTime / 1000) - sPassed);
            if (sLeft <= 0) {
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
            if (currentLetter.nextSibling){
                addClass(currentLetter.nextSibling, 'current');
            }
        } else {
            const incorrectLetter = document.createElement('span');
            incorrectLetter.innerHTML = key;
            incorrectLetter.className = 'letter incorrect extra';
            currentWord.appendChild(incorrectLetter);
        }
    }
    //new words
    if (isSpace){
        if (expected !== ' '){
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
            removeClass(currentLetter, 'current')
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
    // move cusor text
    const nextLetter =  document.querySelector('.letter.current');
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor');
    cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
    cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
});

newGame();
