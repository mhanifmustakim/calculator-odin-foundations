const accuracy = 4;
const multiplier = 10 ** accuracy;

function add(num1, num2) {
    return Math.round(num1 * multiplier + num2 * multiplier) / multiplier;
}

function subtract(num1, num2) {
    return Math.round(num1 * multiplier - num2 * multiplier) / multiplier;
}

function product(num1, num2) {
    return Math.round(num1 * multiplier * num2) / multiplier;
}

function divide(num1, num2) {
    if (num2 === 0) {
        return "UNDEFINED :(";
    }
    return Math.round(num1 * multiplier / num2) / multiplier;
}

function operate({ prevNum, operator }, thisNum) {
    switch (operator) {
        case "+":
            return add(prevNum, thisNum);
        case "-":
            return subtract(prevNum, thisNum);
        case "×":
            return product(prevNum, thisNum);
        case "÷":
            return divide(prevNum, thisNum);
    }
}

const numBtns = document.querySelectorAll(".num-btn");
const operatorBtns = document.querySelectorAll(".operator-btn");
const clearBtn = document.querySelector("#clear-btn");
const delBtn = document.querySelector("#del-btn");
const equalBtn = document.querySelector("#equal-btn");
const specialBtns = [clearBtn, delBtn, equalBtn];
const display = document.querySelector("#display");
let currentDisplay = "0";
let calcMemory = {
    prevNum: null,
    operator: null,
};

function updateDisplay() {
    const mainDisplay = display.querySelector("#main-display");

    mainDisplay.innerText = currentDisplay;
    updateMemoryDisplay();
}

function updateMemoryDisplay(input = null) {
    const memoryDisplay = display.querySelector("#memory-display");

    if (input) {
        memoryDisplay.innerText = input;
        return
    }

    memoryDisplay.innerText = 0;
    if (calcMemory.prevNum !== null) memoryDisplay.innerText = calcMemory.prevNum;
    if (calcMemory.operator !== null) memoryDisplay.innerText += " " + calcMemory.operator;
}

function resetCurrentDisplay() {
    currentDisplay = "0";
}

function calculate() {
    // Calculates current input and outputs in Display
    const currentCalculation = `${calcMemory.prevNum} ${calcMemory.operator} ${currentDisplay} =`;

    calcMemory.prevNum = calcMemory.operator === null ?
        calcMemory.prevNum = +currentDisplay :
        calcMemory.prevNum = operate(calcMemory, +currentDisplay);

    currentDisplay = new String(calcMemory.prevNum);
    updateDisplay();

    if (calcMemory.prevNum && calcMemory.operator) {
        updateMemoryDisplay(currentCalculation);
    }
}

function handleDivisionBy0() {
    const mainDisplay = display.querySelector("#main-display");

    if (mainDisplay.innerText === "UNDEFINED :(") {
        disableBtns(true, [...numBtns, ...operatorBtns, ...specialBtns]);
        disableBtns(false, [clearBtn]);
    }
}

function disableBtns(disabled, btns) {
    btns.forEach((btn) => {
        if (disabled) {
            btn.setAttribute("disabled", "");
            btn.classList.add("disabled");
        } else {
            btn.removeAttribute("disabled");
            btn.classList.remove("disabled");
        }
    })
}

function resetCalc() {
    calcMemory.prevNum = null;
    calcMemory.operator = null;
    disableBtns(false, [...numBtns, ...specialBtns, ...operatorBtns]);
    resetCurrentDisplay();
    updateDisplay();
}

numBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const btnValue = e.target.getAttribute("data-value");
        switch (btnValue) {
            case "decimal":
                currentDisplay += !currentDisplay.includes(".") ? "." : "";
                break
            default:
                if (currentDisplay === "0") {
                    currentDisplay = btnValue;
                } else {
                    currentDisplay += btnValue;
                }
        }

        disableBtns(false, [...operatorBtns]);
        updateDisplay();
    })
})

operatorBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const operatorValue = e.target.getAttribute("data-value");
        calculate();

        switch (operatorValue) {
            case "add":
                calcMemory.operator = "+";
                break
            case "subtract":
                calcMemory.operator = "-";
                break
            case "product":
                calcMemory.operator = "×";
                break
            case "divide":
                calcMemory.operator = "÷";
                break
        }

        resetCurrentDisplay();
        disableBtns(false, [...numBtns, ...operatorBtns, ...specialBtns]);
        disableBtns(true, [btn]);
        handleDivisionBy0();
    })
})

specialBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const thisBtn = e.target.getAttribute("data-value");

        switch (thisBtn) {
            case "equalTo":
                calculate();
                const status = calcMemory.operator === null ? false : true;
                disableBtns(status, [...numBtns]);
                disableBtns(false, [...operatorBtns]);
                disableBtns(true, [delBtn, equalBtn]);
                calcMemory.operator = null;
                handleDivisionBy0();
                return
            case "clear":
                resetCalc();
                return
            case "delete":
                currentDisplay.length > 1 ?
                    currentDisplay = currentDisplay.slice(0, currentDisplay.length - 1) :
                    resetCurrentDisplay();
                updateDisplay();
                return
        }
    })
})