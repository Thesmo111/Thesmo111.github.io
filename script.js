import savedQualities from "./qualities.json" assert {type: "json"};
import savedPowers from "./powers.json" assert{type:"json"};
import enchantment from "./enchantment.json" assert{type:"json"};

savedQualities.qualities.forEach(entry => createDivs(entry,"qualities"));
savedPowers.powers.forEach(entry => createDivs(entry,"powers"));

///Calls the "levelDisplay" option which creates and displays elements
levelDisplay(enchantment.powerLevel, "Power Level");
levelDisplay(enchantment.enchantLevels, "Enchanment Level");
levelDisplay(enchantment.multipliers, "Multiplier");
levelDisplay(enchantment.linkedItem, "Linked Item");

equalWrapper();

///Global attributes used for storing data. 
var currentEnchantments = [];

///Creates Divs for Qualities and Powers. Requests function "createOptions". Selects the first radio button and checks it
function createDivs(entry, displayName){
    
    ///Creates a div which will house all the generated elements
    let display = document.createElement("div");
    display.className = "entryDiv";
    display.id = entry.name;

    ///Creates text which tells the user what the options refer to. Appends it as a child to the display div
    let paragraph = document.createElement("p");
    paragraph.className = "optionNames";
    paragraph.appendChild(document.createTextNode(entry.name));
    display.appendChild(paragraph);

    ///Calls the "creatOptions" function while sending all the information it needs
    display.appendChild(createOptions(entry, displayName));

    ///Appends the display with all its elements onto a wrapper created using HTML
    document.getElementById(displayName).appendChild(display);

    ///Checks the first option in the radio buttons
    document.getElementById(entry.name + "0").checked = true;

}

///Creates Radio buttons to be used for selecting the various options. Returns a div element
function createOptions(entry, displayName){
    
    ///Creates a new wrapper for all the generated elements
    let optionWrapper = document.createElement("div");
    optionWrapper.className = "optionWrapper";

    ///A loop which will occur 4 times, which is the numbers of items in the array
    for(let i=0; i<=3; i++){
        if(entry.options[i].name != null){

            ///Creates a label element and gives it attributes
            let option = document.createElement("label");
            option.className = "options";
            option.innerText = entry.options[i].name;
            option.setAttribute("for", entry.name + i);
            optionWrapper.appendChild(option);

            ///Creates an input element and specifies that it is a radio button
            let radio = document.createElement("input");
            radio.type = "radio";
            radio.name = (entry.name);
            radio.id = entry.name + i;
            radio.value = displayName + i;
            radio.addEventListener("change", function (event){changeMadeOption(event.target)});
            option.appendChild(radio);
        } 
    }
    return(optionWrapper);
}

///Creates elements and creates radio buttons for options.
function levelDisplay(jsonEntry, DisplayType){
    let display = document.getElementById("levelDisplay");

    ///Creates bold text which helps the user understand the options
    let enchantmentPower = document.createElement("div");
    enchantmentPower.innerHTML = "<p style='font-weight: bold'>" + DisplayType + "</p>";
    enchantmentPower.className = "enchantmentOptions";
    display.appendChild(enchantmentPower);

    let i = 0;

    ///For each entry in the array, creates labels and radio buttons, linking them together
    jsonEntry.forEach(entry => {
        let option = document.createElement("label");
        option.className = "otherOptions";
        option.innerText = entry.name;
        //console.log(entry.name);
        option.setAttribute("for", DisplayType + i);
        enchantmentPower.appendChild(option);

        //Creates an input element and specifies that it is a radio button
        let radio = document.createElement("input");
        radio.type = "radio";
        radio.name = DisplayType;
        radio.id = DisplayType + i;
        radio.value = entry.name;
        radio.addEventListener("change", function (){calculateTime()});
        option.appendChild(radio);

        i++;
    });

    document.getElementById(DisplayType + "0").checked = true;
}

///Makes the selected options div and the power level options equal in height. Done for aesthetic. 
function equalWrapper(){
    let selectedDisplay = document.getElementById("selectedDisplay");
    let levelDisplay = document.getElementById("levelDisplay");

    if (selectedDisplay.offsetHeight < levelDisplay.offsetHeight){
        selectedDisplay.style.height = (levelDisplay.offsetHeight - 15) + "px";
        //console.log("changed Selected Display height");
    }else{
        levelDisplay.style.height = (selectedDisplay.offsetHeight -15) + "px";
        //console.log("changed Level Display Height");
    }
}

///Changes the total points for both qualities and powers.
function changeMadeOption(event){
    let value = event.value.slice(0, event.value.length - 1);
    let points = parseInt(event.value.slice(event.value.length -1, event.value.length));
    //console.log(points);
    
    //Checks for the type of enchantment chosen. Creates an object with the information to be used later
    if (value == "qualities"){
        let selection = savedQualities.qualities.find(({name})=> name === (event.id.slice(0, event.id.length - 1)))
        var selectedEnchant = {name:selection.name, cost:selection.options[points].cost, type: value};

    } else if (value == "powers"){
        let selection = savedPowers.powers.find(({name})=> name === (event.id.slice(0, event.id.length - 1)))
        var selectedEnchant = {name:selection.name, cost:selection.options[points].cost, type: value};
    }

    let existingIndex = currentEnchantments.findIndex(elmt => elmt.name == selectedEnchant.name);
    //console.log(currentEnchantments);
    //console.log(existingIndex);

    //Removes an entry in the array if the same type already exists
    if(existingIndex != -1){
        currentEnchantments.splice(existingIndex, 1);
        //console.log(removedObject);
    }
    
    //pushes the object into an array
    currentEnchantments.push(selectedEnchant);

    //if the last option costed 0 points, it is removed from the end of the array
    if(selectedEnchant.cost == 0){
        currentEnchantments.pop();
        calculateTime();
    }

    calculateTime();
}

//Uses the information it can get from the global array and calculates time based on the entries
function calculateTime(){

    let totalQualityPoints = 0;
    let totalPowerPoints = 0;
    let qualityTime = 0;
    let powerTime = 0;
    let totalTime = 0;

    // Loops through each enchantment in the currentEnchantments array and calculates total quality points and power points
    currentEnchantments.forEach(enchant => {
        if(enchant.type == "qualities"){
            totalQualityPoints += enchant.cost;
        }else{
            totalPowerPoints += enchant.cost;
        }
    });

    // Gets the selected enchantment level
    let checkedLevel = document.querySelector("input[name = 'Enchanment Level']:checked");
    let enchantLevel = (enchantment.enchantLevels.find(item => item.name === checkedLevel.value));
    let enchantMultiplier = enchantment.enchantLevels[enchantment.enchantLevels.findIndex(elmt => elmt.name === enchantLevel.name)].multiplier;

    // Gets the selected power level
    let checkedPower = document.querySelector("input[name='Power Level']:checked");
    let powerLevel = (enchantment.powerLevel.find(item => item.name === checkedPower.value));
    let powerIndex = enchantment.powerLevel.findIndex(elmt => elmt.name === powerLevel.name);
    let powerSets = enchantment.powerLevel[powerIndex];

    // Gets the selected multiplier level
    let multiplierRadio = document.querySelector("input[name = 'Multiplier']:checked");
    let multiplierLevel = (enchantment.multipliers.find(item => item.name === multiplierRadio.value));

    // Gets the selected linked item
    let linkedRadio = document.querySelector("input[name = 'Linked Item']:checked");
    let linkedItem = (enchantment.linkedItem.find(item => item.name === linkedRadio.value));

    // Calculates the quality time and power time based on total quality points, total power points, and enchant multiplier
    qualityTime = (totalQualityPoints * enchantMultiplier);
    powerTime = (totalPowerPoints * enchantMultiplier);

    // Calculates quality time and power time based on the selected enchantment level and power level
    if (enchantLevel.name == "Shape Gossamer Material"){
        qualityTime = (qualityTime * powerSets.shapeGossamer[0].qualityTime);
        powerTime = (powerTime * powerSets.shapeGossamer[1].powerTime);
    }else if (enchantLevel.name == "Empowerment"){
        qualityTime = (qualityTime * powerSets.empowerment[0].qualityTime);
        powerTime = (powerTime * powerSets.empowerment[1].powerTime);
    }else{
        qualityTime = (qualityTime * powerSets.leveled[0].qualityTime);
        powerTime = (powerTime * powerSets.leveled[1].powerTime);
    }

    // Calculates the total time based on quality time and power time, then multiplies by the selected multiplier and linked item multipliers
    totalTime = qualityTime + powerTime;
    totalTime = (totalTime * multiplierLevel.multiplier);
    totalTime = (totalTime * linkedItem.multiplier);

    // Calls the displayTime and displaySelection functions with appropriate parameters
    displayTime(enchantLevel.prepTime * linkedItem.multiplier, totalTime);
    displaySelection(multiplierLevel);
}


// This function is used to display the enchantment time and preparation required for an item
function displayTime(prepTime, totalTime){
    // Get the element where the time will be displayed
    let display = document.getElementById("timeDisplayText")

    // Calculate the days, hours, and minutes for the total time
    let days = Math.floor(totalTime / 1440);
    let hours = Math.floor((totalTime % 1440)/60);
    let minutes = (totalTime % 60);

    // Calculate the days and hours for the preparation time
    let prepDays = Math.floor(prepTime / 24);
    let prepHours = 0;
    if((prepTime % 24) != 0){
        prepHours = Math.floor(prepTime % 24) ;
    }

    // Set the display text to show the total time and preparation time
    display.innerText = "Enchantment time: " + days +" days " + hours + " hours " + minutes+ " minutes \nPreperation Required: " +prepDays + " days " + prepHours + " hours";
}

// Get the tbody element where the enchantment selections will be displayed
const tableBody = document.getElementById("tableBody");

// This function is used to display the current enchantment selections
function displaySelection(multiplierLevel){
    // Clear the existing content of the tbody element
    tableBody.innerHTML = "";

    // Create a row for the multiplier level
    var trMulti = document.createElement("tr");
    trMulti.id = "tableRowMultiplier"

    var tdMulti1 = document.createElement("td");
    var tdMulti2 = document.createElement("td");

    // Add the name and multiplier to the multiplier row
    tdMulti1.appendChild(document.createTextNode(multiplierLevel.name));
    tdMulti2.appendChild(document.createTextNode("x"+multiplierLevel.multiplier));

    // Set the class names for the multiplier row
    tdMulti1.className = "enchantCell";
    tdMulti2.className = "costCell";

    // Add the multiplier row to the tbody element
    trMulti.appendChild(tdMulti1);
    trMulti.appendChild(tdMulti2);
    tableBody.appendChild(trMulti);

    // Loop through each current enchantment and create a row for it
    currentEnchantments.forEach(enchant =>{
        var tr = document.createElement("tr");
        tr.id = "tableRow";

        var td1 = document.createElement("td");
        var td2 = document.createElement("td");

        // Set the class names for the enchantment row
        td1.className = "enchantCell";
        td2.className = "costCell";

        // Add the name and cost of the enchantment to the row
        td1.appendChild(document.createTextNode(enchant.name));
        td2.appendChild(document.createTextNode(enchant.cost));

        // Add the enchantment row to the tbody element
        tr.appendChild(td1);
        tr.appendChild(td2);
        tableBody.appendChild(tr);
    });
}
