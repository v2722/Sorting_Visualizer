let array = [];
let moves = [];
const barsContainer = document.getElementById("bars-container");
const n = 20;

function init() {
    array = Array.from({ length: n }, () => Math.random());
    showBars();
}

function play(algorithm) {
    let copy = [...array];
    switch (algorithm) {
        case 'heap':
            moves = heapSort(copy);
            break;
        case 'bubble':
            moves = bubbleSort(copy);
            break;
        case 'selection':
            moves = selectionSort(copy);
            break;
        case 'insertion':
            moves = insertionSort(copy);
            break;
        case 'quick':
            moves = quickSort(copy);
            break;
    }
    animate();
}

function showBars(move) {
    barsContainer.innerHTML = '';
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("bar");
        if (move && move.indices.includes(i)) {
            bar.style.background = move.type === "swap" ? "red" : "blue";
        }
        barsContainer.appendChild(bar);
    }
}

function animate() {
    if (moves.length === 0) {
        showBars();
        return;
    }
    const move = moves.shift();
    const [i, j] = move.indices;
    if (move.type === "swap") {
        [array[i], array[j]] = [array[j], array[i]];
    }
    showBars(move);
    setTimeout(animate, 200);
}

function heapSort(arr) {
    const moves = [];

    function heapify(arr, N, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;

        if (left < N) {
            moves.push({ indices: [left, largest], type: "comp" });
            if (arr[left] > arr[largest]) largest = left;
        }
        if (right < N) {
            moves.push({ indices: [right, largest], type: "comp" });
            if (arr[right] > arr[largest]) largest = right;
        }
        if (largest !== i) {
            moves.push({ indices: [i, largest], type: "swap" });
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            heapify(arr, N, largest);
        }
    }

    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
        heapify(arr, arr.length, i);
    }

    for (let i = arr.length - 1; i > 0; i--) {
        moves.push({ indices: [0, i], type: "swap" });
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }

    return moves;
}

function bubbleSort(arr) {
    const moves = [];
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            moves.push({ indices: [j, j + 1], type: "comp" });
            if (arr[j] > arr[j + 1]) {
                moves.push({ indices: [j, j + 1], type: "swap" });
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return moves;
}

function selectionSort(arr) {
    const moves = [];
    for (let i = 0; i < arr.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
            moves.push({ indices: [j, minIdx], type: "comp" });
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        if (i !== minIdx) {
            moves.push({ indices: [i, minIdx], type: "swap" });
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        }
    }
    return moves;
}

function insertionSort(arr) {
    const moves = [];
    for (let i = 1; i < arr.length; i++) {
        let j = i;
        while (j > 0 && arr[j] < arr[j - 1]) {
            moves.push({ indices: [j, j - 1], type: "comp" });
            moves.push({ indices: [j, j - 1], type: "swap" });
            [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
            j--;
        }
    }
    return moves;
}

function quickSort(arr) {
    const moves = [];

    function partition(low, high) {
        const pivot = arr[low];
        let i = low, j = high;
        while (i < j) {
            while (arr[i] <= pivot && i < high) i++;
            while (arr[j] > pivot) j--;
            if (i < j) {
                moves.push({ indices: [i, j], type: "swap" });
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
        moves.push({ indices: [low, j], type: "swap" });
        [arr[low], arr[j]] = [arr[j], arr[low]];
        return j;
    }

    function qs(low, high) {
        if (low < high) {
            const p = partition(low, high);
            qs(low, p - 1);
            qs(p + 1, high);
        }
    }

    qs(0, arr.length - 1);
    return moves;
}

init();
