const btn = document.querySelector('#roll-button');
const dice = document.querySelector('#dice');
let rollHistory = [];

function rollDice() {
   const roll = Math.floor(Math.random() * 6) + 1;
     const diceFaces = getDiceFace(roll);
        dice.innerHTML = diceFaces;
        rollHistory.push(roll);
        updateHistory();
}
function updateHistory() {
         const rollHistoryList = document.querySelector('#roll-history');
         rollHistoryList.innerHTML = '';
            rollHistory.forEach((roll,index) => {
             const listItem = document.createElement('li');
             listItem.innerHTML = `Roll ${index + 1}: <span> ${getDiceFace(roll)}</span>`;
             rollHistoryList.appendChild(listItem);
         });
}


function getDiceFace(roll) {
    switch(roll){
case 1:
        return '&#9856;'; // ⚀
    case 2:
        return '&#9857;'; 
    case 3:
        return '&#9858;';
    case 4:
        return '&#9859;';
    case 5:
        return '&#9860;';
    case 6:
        return '&#9861;'; 

        default:
        return '&#9856;'; 
    }
           
}

btn.addEventListener('click', () => {
    // Your code to roll the dice goes here
    dice.classList.add('roll-animation');
    setTimeout(() => {
        dice.classList.remove('roll-animation');
        rollDice();
    }, 1500);
});