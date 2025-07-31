const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase");
const numbercheck = document.querySelector("#numbers");
const symbolscheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '!@#$%^&*()_+-=[].{}<,>/?';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleslider();
//set strength circle color to grey
setIndicator("#ccc");

//set password length
function handleslider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbols(){
    const randNM = getRandomInteger(0,symbols.length);
    return symbols.charAt(randNM);         //charAt--->character at that index 
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercasecheck.checked) hasUpper = true;
    if (lowercasecheck.checked) hasLower = true;
    if (numbercheck.checked) hasNum = true;
    if (symbolscheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");   //set color
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");   //set color 
    } else {
      setIndicator("#f00");   //set color
    }
}

async function copycontent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    //FISHER YATES METHOD
     for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handlecheckboxchange(){
    checkCount = 0;
    allcheckbox.forEach( (checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleslider();
    }
}

allcheckbox.forEach( (checkbox)=>{
    checkbox.addEventListener('change', handlecheckboxchange);
})

inputSlider.addEventListener('input',(e) =>{
    passwordLength = e.target.value;
    handleslider();
})

copybtn.addEventListener('click', () =>{
    if(passwordDisplay.value)
        copycontent();
})

generateBtn.addEventListener('click', ()=>{
    //none of the check bocx selected
    if(checkCount == 0)
    return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleslider();
    }

    //let's start the journey to find the new password
    console.log("starting the journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes
    
    // if(uppercasecheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercasecheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbercheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolscheck.checked){
    //     password += generateSymbols();
    // }

    let funcarr = [];

    if(uppercasecheck.checked)
        funcarr.push(generateUpperCase);

    if(lowercasecheck.checked)
        funcarr.push(generateLowerCase);

    if(numbercheck.checked)
        funcarr.push(generateRandomNumber);

    if(symbolscheck.checked)
        funcarr.push(generateSymbols);

    //compulsory addition

    for(let i=0; i<funcarr.length; i++){
        password += funcarr[i]();
    }
    console.log("compulsory addition done");

    //remaining addition
    for(let i=0; i<passwordLength-funcarr.length; i++){
        let randIndex = getRandomInteger(0, funcarr.length);
        console.log("randIndex" + randIndex);
        password += funcarr[randIndex]();
    }
    //suffle the password
    password = shufflePassword(Array.from(password));
    //show in UI
    passwordDisplay.value = password;
    //calculate strength
    calcStrength();
});

