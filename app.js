const tileDisplay = document.querySelector('.tile-container');
const keyboard = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');

let wordle;
const fetchWord = () => {
    fetch('http://localhost:8000/word')
    .then(response => response.json())
    .then(data => { 
        console.log(data);
        wordle = data.toUpperCase();
    })
    .catch(error => console.error(error));
};
fetchWord();

const keys = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'ENTER', 'Z', "X", 'C', 'V', 'B', 'N', 'M', '«',
];

const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
];

guessRows.forEach((guessRow, rowIdx) => {
    const row = document.createElement('div');
    row.setAttribute('id', 'guessRow-' + rowIdx);
    guessRow.forEach((guess, tileIdx) => { 
        const tile = document.createElement('div');
        tile.setAttribute('id', 'guessRow-' + rowIdx + '-tile-' + tileIdx);
        tile.setAttribute('class', 'tile');
        row.appendChild(tile);
    });
    tileDisplay.appendChild(row);
});

const handleClick = (key) => {
    if (key === '«' || key === 'BACKSPACE') {
        deleteLetter();
    } else if (key === 'ENTER') {
        checkRow();
    } else if ((/[a-zA-Z]/).test(key)) {
        addLetter(key);
    }
};

keys.forEach(key => {
    const button = document.createElement('button');
    button.textContent = key;
    button.setAttribute('id', key);
    button.addEventListener('click', () => handleClick(key));
    keyboard.appendChild(button);
});

document.addEventListener('keydown', (e) => { handleClick(e.key.toUpperCase()); });

let currentRow = 0;
let currentTile = 0;

const addLetter = (letter) => {
    if (currentTile == 5 || currentRow == 6) return;

    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
    tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter;
    tile.setAttribute('data', letter);
    currentTile++;
};

const deleteLetter = () => {
    if (currentTile == 0) return;

    currentTile--;
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile);
    tile.textContent = '';
    guessRows[currentRow][currentTile] = '';
    tile.setAttribute('data', '');
};

const checkRow = () => {
    if (currentTile < 5) return;

    const guess = guessRows[currentRow].join('');
    fetch(`http://localhost:8000/check/?word=${guess}`)
        .then(response => response.json())
        .then(data => {
            if (data === 'Entry word not found') {
                showMessage('Not a valid word');
                return;
            }
            
            flipTiles();
            if (guess === wordle) {
                showMessage('You win!');
            } else if (currentRow < 5) {
                currentRow++;
                currentTile = 0;
            } else {
                showMessage('You lose!');
            }
        }).catch(error => console.error(error));
    };

const showMessage = (message) => {
    const messageElem = document.createElement('p');
    messageElem.textContent = message;
    messageDisplay.appendChild(messageElem);
    setTimeout(() => { messageDisplay.removeChild(messageElem); }, 2500);
};

const flipTiles = () => {
    const rowTiles = document.getElementById('guessRow-' + currentRow).childNodes
    let checkWordle = wordle;
    const guess = [];

    rowTiles.forEach(tile => {
        guess.push({letter: tile.getAttribute('data'), color: 'grey-overlay'})
    });

    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]) {
            guess.color = 'green-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    });

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)) {
            guess.color = 'yellow-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    });

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColourToKey(guess[index].letter, guess[index].color)
        }, 500 * index)
    });
};

const addColourToKey = (key, colour) => {
    const keyElem = document.getElementById(key);
    keyElem.classList.add(colour);
};