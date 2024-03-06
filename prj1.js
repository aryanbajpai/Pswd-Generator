const inputSlider = document.querySelector("[data-lengthSlider]");  //33
const lengthDisplay = document.querySelector("[data-lengthnumber]");   //28
const passwordDisplay = document.querySelector("[data-passwordDisplay]");  //15
const copyBtn = document.querySelector("[data-copy]");  //17
const copyMsg = document.querySelector("[data-copyMsg]");  //18
const uppercaseCheck = document.querySelector("#uc");  //37
const numberCheck = document.querySelector("#no");   //41
const lowercaseCheck = document.querySelector("#lc");  //45
const specialCharCheck = document.querySelector("#spc");  //49
const indicator = document.querySelector("[data-indicator]");  //56
const generateBtn = document.querySelector(".generateBtn");  //60
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password = "";  
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

//Sets Password Length  //reflect PasswordLength on UI
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%" 
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

//find random int in min-max range
function getRndmInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRndmNum() {
    return getRndmInteger(0,9);
}
function generateLowerCase() {
    return String.fromCharCode(getRndmInteger(97,123))  //ASCI values into Character
}

function generateUpperCase() {
    return String.fromCharCode(getRndmInteger(65,91))   //ASCI values into Character
}

function generateSym() {
    const randNo = getRndmInteger(0, symbols.length);
    return symbols.charAt(randNo);
}

//watch for checked and unchecked boxes and according to their status set Indicators color
function calcStrength() {
    let hasUpper = false;
    let hasNum = false;
    let hasLower = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(numberCheck.checked) hasNum = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(specialCharCheck.checked) hasSym = true;

    //conditions for the Strength-Indicator
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

//copies i/p in Password in clipboard using writeText method
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy span visible
    copyMsg.classList.add("active");
    
    setTimeout( () => {
        copyMsg.classList.remove("active")
    },2000);
}

function shufflePassword(array) {
    //Fisher Yates Method is applied on an Array and it shuffles the array
      //Range of i are the INDEXES of Array
    for(let i=array.length - 1; i>0; i--) {
        //1. Find a random j in the Array
        const j=Math.floor(Math.random() * (i + 1));
        //2. Swaps j with i
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special case
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

//add E.L. on checkbox to keep updating
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

//input changing in inputSlider
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click', () => {
    //no chkbx selected
    if(checkCount == 0) {
        return;
    } 

    //special case
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //start journey to find new password
    console.log("Starting the Journey");
      //remove old password
      password = "";

      //fulfill checkboxes conditions
      
       /*if(uppercaseCheck.checked) {
         password += generateUpperCase();
       }
       if(numberCheck.checked) {
         password += generateRndmNum();
       }
       if(lowercaseCheck.checked) {
         password += generateLowerCase();
       }
       if(specialCharCheck.checked) {
         password += generateSym();
       }*/

      //By ARRAY :
        let funcArr = [];

       if(uppercaseCheck.checked) {
         funcArr.push(generateUpperCase);
       }
       if(numberCheck.checked) {
        funcArr.push(generateRndmNum);
       }
       if(lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
       }
       if(specialCharCheck.checked) {
        funcArr.push(generateSym);
       }

       //compulsory addition
       for(let i=0; i<funcArr.length; i++) {
         password += funcArr[i]();
       }
       console.log("Compulsory Addition Done.");

       //remaining addition
       for(let i=0; i<passwordLength-funcArr.length; i++) {
         let randIndex = getRndmInteger(0, funcArr.length);
         console.log("randIndex" + randIndex);
         password += funcArr[randIndex]();
       }
       console.log("Remaining Addition Done.");

    //shuffle password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling Done.");

    //show password on ui
    passwordDisplay.value = password;
    console.log("UI Addition Done.");
    //calcStrength
    calcStrength();
});