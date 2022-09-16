function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function product(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    const accuracy = 4;
    const multiplier = 10 ** accuracy;
    if (num2 === 0) {
        disableBtns(true, [...numBtns, ...operatorBtns, ...specialBtns]);
        disableBtns(false, [clearBtn]);
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
        case "*":
            return product(prevNum, thisNum);
        case "/":
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
    display.innerText = currentDisplay;
}

function resetCurrentDisplay() {
    currentDisplay = "0";
}

function calculate() {
    // Calculates current input and outputs in Display
    calcMemory.prevNum = calcMemory.operator === null ?
        calcMemory.prevNum = +currentDisplay :
        calcMemory.prevNum = operate(calcMemory, +currentDisplay);

    currentDisplay = new String(calcMemory.prevNum);
    updateDisplay();
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
                calcMemory.operator = "*";
                break
            case "divide":
                calcMemory.operator = "/";
                break
        }

        resetCurrentDisplay();
        disableBtns(false, [...numBtns, ...operatorBtns, delBtn]);
        disableBtns(true, [btn]);
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
                disableBtns(true, [delBtn]);
                calcMemory.operator = null;
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


// TODO: Add memory in UI
// TODO: Enable changing operations