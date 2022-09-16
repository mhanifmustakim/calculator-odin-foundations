// Controls the accuracy of the calculator of up to {accuracy} decimal points
const accuracy = 4;
const multiplier = 10 ** accuracy;

// Functions to return value correct to {accuracy} decimal points
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
    // Updates mainDisplay & followed by memoryDisplay
    const mainDisplay = display.querySelector("#main-display");

    mainDisplay.innerText = currentDisplay;
    updateMemoryDisplay();
}

function updateMemoryDisplay(input = null) {
    // Only updates memoryDisplay, if given arguments, directly puts into memoryDisplay
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
    // Saves the current calculation to be put in memoryDisplay
    const currentCalculation = `${calcMemory.prevNum} ${calcMemory.operator} ${currentDisplay} =`;

    // Performs calculation
    calcMemory.prevNum = calcMemory.operator === null ?
        calcMemory.prevNum = +currentDisplay :
        calcMemory.prevNum = operate(calcMemory, +currentDisplay);

    // Display results of the calculation
    currentDisplay = new String(calcMemory.prevNum);
    updateDisplay();

    // Updates memoryDisplay if successful calculation performed
    if (calcMemory.prevNum && calcMemory.operator) {
        updateMemoryDisplay(currentCalculation);
    }
}

function handleDivisionBy0() {
    // Disables all buttons except Clear button
    const mainDisplay = display.querySelector("#main-display");

    if (mainDisplay.innerText === "UNDEFINED :(") {
        disableBtns(true, [...numBtns, ...operatorBtns, ...specialBtns]);
        disableBtns(false, [clearBtn]);
    }
}

function disableBtns(disabled, btns) {
    // disables buttons given in {btns} and update the classList
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

        // Prevents clicking the same button twice
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

                // Checks if an actual calculation is performed
                const status = calcMemory.operator === null ? false : true;

                // If yes, this disables manually updating answer using the numBtns
                disableBtns(status, [...numBtns]);
                // Prevents deleting digits from answer, and pressing equal twice without extra input
                disableBtns(true, [delBtn, equalBtn]);


                disableBtns(false, [...operatorBtns]);
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