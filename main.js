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
    return num1 / num2;
}

function operate(num1, num2, operator) {
    switch (operator) {
        case "+":
            return add(num1, num2);
        case "-":
            return subtract(num1, num2);
        case "*":
            return product(num1, num2);
        case "/":
            return divide(num1, num2);
    }
}

const numBtns = document.querySelectorAll(".num-btn");
const operatorBtns = document.querySelectorAll(".operator-btn");
const display = document.querySelector("#display");
let currentDisplay = "0";

function updateDisplay() {
    display.innerText = currentDisplay;
}

numBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const btnValue = e.target.getAttribute("data-value");
        if (currentDisplay === "0") {
            currentDisplay = btnValue;
        } else {
            currentDisplay += btnValue;
        }

        updateDisplay();
    })
})