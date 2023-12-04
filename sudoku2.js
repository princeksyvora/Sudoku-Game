function display(row, col,mtrx){
   const cellid = `${row} ${col}`;
   const cellInput = document.getElementById(cellid);
   if (cellInput) {
    const [i, j] = cellid.split(' ').map(Number);
    let cellValue = mtrx[i][j];
    if(mtrx[i][j] === 0){
        cellInput.value='';
    }
    else{
        cellInput.value=cellValue;
        cellInput.readOnly = true;
    }
  }
}


function createGridInsideBox() {
    const main = document.getElementById('main');
    
    for (let i = 0; i <9; i++) {
        
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            const input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('id', `${i} ${j}`); 
            input.classList.add('input');

            cell.appendChild(input);
            main.appendChild(cell);

        }
    }
}
createGridInsideBox();


function fillDiagonal(mtrx, N, M) {
        for (let i = 0; i < N; i += M) {
            fillBox(mtrx, i, i, M);
        }
    }
    
function unUsedInBox(mtrx, rowStart, colStart, num, M) {
        // console.log("Used in box fn", M,mtrx, rowStart, colStart, num);

        for (let i = 0; i < M; i++) {
            for (let j = 0; j < M; j++) {
                if (mtrx[rowStart + i][colStart + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }
    
function fillBox(mtrx, row, col, M) {
        let num = 0;
        const N = mtrx.length;
        for (let i = 0; i < M; i++) {
            for (let j = 0; j < M; j++) {
                while (true) {
                    num = randomGenerator(N);
                    if (unUsedInBox(mtrx, row, col, num, M)) {
                        break;
                    }
                }
                mtrx[row + i][col + j] = num;
            }
        }
    }
    
function randomGenerator(num) {
        return Math.floor(Math.random() * num + 1);
    }
    
function unUsedInRow(mtrx, i, num) {
        const N = mtrx.length;
        // console.log("Used in row fn", N,mtrx,i, num);
        for (let j = 0; j < N; j++) {
            if (mtrx[i][j] === num) {
                return false;
            }
        }
        return true;
    }
    
function unUsedInCol(mtrx, j, num) {
        const N = mtrx.length;
        // console.log("Used in col fn", N,mtrx, j, num);

        for (let i = 0; i < N; i++) {
            if (mtrx[i][j] === num) {
                return false;
            }
        }
        return true;
    }
    
function checkIfSafe(mtrx, i, j, num, M) {
        return (
            unUsedInRow(mtrx, i, num) &&
            unUsedInCol(mtrx, j, num) &&
            unUsedInBox(mtrx, i - (i % M), j - (j % M), num, M)
        );
    }
    
function fillRemaining(mtrx, N, M, i = 0, j = 0) {
        if (i === N - 1 && j === N) {
            return true;
        }
    
        if (j === N) {
            i += 1;
            j = 0;
        }
    
        if (mtrx[i][j] !== 0) {
            return fillRemaining(mtrx, N, M, i, j + 1);
        }
    
        for (let num = 1; num <= N; num++) {
            if (checkIfSafe(mtrx, i, j, num, M)) {
                mtrx[i][j] = num;
                if (fillRemaining(mtrx, N, M, i, j + 1)) {
                    return true;
                }
                mtrx[i][j] = 0;
            }
        }
    
        return false;
    }
    
function removeKDigits(mtrx) {
        let count = Math.floor(Math.random() * (40 - 35 + 1)) + 35;
        const N = mtrx.length;
    
        while (count !== 0) {
            let i = Math.floor(Math.random() * N);
            let j = Math.floor(Math.random() * N);
            if (mtrx[i][j] !== 0) {
                count--;
                mtrx[i][j] = 0;
            }
        }
    }
   
let Fmtrx;
let Fmtrx2;
function deepCopyMatrix(mtrx){
    return mtrx.map(row=> [...row]);
}


function generateSudoku(N) {
        const M = Math.floor(Math.sqrt(N));
    
        const mtrx = Array.from({ length: N }, () => Array.from({ length: N }, () => 0));
    
        fillDiagonal(mtrx, N, M);
        fillRemaining(mtrx, N, M);
        Fmtrx = deepCopyMatrix(mtrx);
        console.log("copied matrix", Fmtrx);
        removeKDigits(mtrx);
        Fmtrx2 = deepCopyMatrix(mtrx);
        // console.log("copied matrix2", Fmtrx2);
    
        return mtrx;
}


var sudokuContainer = document.getElementById('main');
sudokuContainer.addEventListener('input', function(event) {
    const M = 3;
    var target = event.target;
    if (target.classList.contains('input')) {
        var cellid = event.target.id;
        target.style.color = 'yellow';
        const [R, C] = cellid.split(' ').map(Number);
        const row = R;
        const col = C;
        var enteredValue = parseInt(target.value);
        // console.log(row, col, enteredValue);
        if(!checkIfSafe(Fmtrx2, row, col, enteredValue, M)){
            alert("This number is already used either in 3x3 Grid or Row or Column. Try other number !!");
            target.value='';
        }
        else{
            Fmtrx2[row][col]=enteredValue;
        }
    }
});
 
let startTime;
let timerInterval;

function updateTimer(){
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timer').innerText = `Timer: ${formattedTime}`;
}

function newGame(){
    startTime= new Date().getTime();
    timerInterval = setInterval(updateTimer, 1000);
    const N = 9;
    const sudoku = generateSudoku(N);
    
//  Printing Sudoku
    for (let i = 0; i < N; i++) {
    console.log(sudoku[i].join(" "));
    }
    // console.log("Hello");

    for (let i = 0; i <9; i++) {
        for (let j = 0; j < 9; j++) {
            display(i, j, sudoku);
        }
    }
}   

function is3x3GridFilled(Fmtrx2, startRow, startCol) {
    const nums = new Set();
    // console.log("result", Fmtrx2);
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (Fmtrx2[i][j] === 0) {
                return false;
            }
            nums.add(Fmtrx[i][j]);
        }
    }
    return nums.size === 9;
}

function checkResult() {
    clearInterval(timerInterval);
    function check3x3GridsFilled(Fmtrx2) {
        for (let i = 0; i < 9; i += 3) {
            for (let j = 0; j < 9; j += 3) {
                if (!is3x3GridFilled(Fmtrx2, i, j)) {
                    return false;
                }
            }
        }
        return true;
    }

    if (check3x3GridsFilled(Fmtrx2)) {
        alert("Hurray! You did it! Congratulations !!");
    }
    else{
        alert("You didn't filled the grid completely !! ");
    }
}
