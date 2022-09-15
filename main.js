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
    if (num2 === 0) {
        return "UNDEFINED :(";
    }
    return num1 / num2;
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
const specialBtns = document.querySelectorAll(".special-btn");
const display = document.querySelector("#display");
let currentDisplay = "0";
let numbersDisabled = false;
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
    calcMemory.prevNum = calcMemory.operator === null ?
        calcMemory.prevNum = +currentDisplay :
        calcMemory.prevNum = operate(calcMemory, +currentDisplay);

    currentDisplay = new String(calcMemory.prevNum);
    updateDisplay();
}

function updateNumberBtns() {
    numBtns.forEach((btn) => {
        numbersDisabled ? btn.classList.add("disabled") : btn.classList.remove("disabled");
    })
}

function resetCalc() {
    calcMemory.prevNum = null;
    calcMemory.operator = null;
    numbersDisabled = false;
    resetCurrentDisplay();
    updateNumberBtns();
    updateDisplay();
}

numBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        if (numbersDisabled) {
            return
        }

        const btnValue = e.target.getAttribute("data-value");
        if (currentDisplay === "0") {
            currentDisplay = btnValue;
        } else {
            currentDisplay += btnValue;
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
        if (numbersDisabled) {
            numbersDisabled = false;
            updateNumberBtns()
        }
    })
})

specialBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const thisBtn = e.target.getAttribute("data-value");

        switch (thisBtn) {
            case "equalTo":
                calculate();
                numbersDisabled = calcMemory.operator === null ? false : true;
                calcMemory.operator = null;
                updateNumberBtns();
                return
            case "clear":
                resetCalc();
                return
        }
    })
})