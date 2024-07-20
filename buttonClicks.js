/**
 * Abstract base Button class
 */
class Button {
    constructor(
        selector,
        isVisible,
        defaultInnerHtml = "",
        clickBehavior = () => {},
        mouseOverBehavior = () => {},
        mouseOutBehavior = () => {}
    ) {
        this.selector = selector;
        this.isVisible = isVisible;
        this.defaultInnerHtml = defaultInnerHtml;
        this.clickBehavior = clickBehavior;
        this.mouseOverBehavior = mouseOverBehavior;
        this.mouseOutBehavior = mouseOutBehavior;
        this.availableAt = 0;
    }

    bindEvents() {
        document.querySelectorAll(this.selector).forEach((element) => {
            element.addEventListener("click", () => this.click());
            element.addEventListener("mouseover", () => this.mouseOver());
            element.addEventListener("mouseout", () => this.mouseOut());
        });
    }

    // Will define the behaviour of the button when clicked
    click() {
        this.clickBehavior();
    }

    mouseOver() {
        this.mouseOverBehavior();
    }

    mouseOut() {
        this.mouseOutBehavior();
    }

    // Will determine if the button is ready to be clicked
    isReady() {
        return true;
    }

    // Returns the text to display on the button
    innerHtml() {
        return this.defaultInnerHtml;
    }

    // Update the button's display
    updateDisplay() {
        document.querySelectorAll(this.selector).forEach((element) => {
            this.isVisible() ? element.classList.remove("hidden") : element.classList.add("hidden");
            element.disabled = !this.isReady();
            element.innerHTML = this.innerHtml();
        });
    }
}

// XPButton class
class XPButton extends Button {
    constructor(selector, isVisible, baseXp, baseCooldown) {
        super(selector, isVisible);
        this.baseXp = baseXp;
        this.baseCooldown = baseCooldown;
    }

    calculateTotalXp() {
        return this.baseXp * (pets[game.selectedPet][1] * game.XPBoostEffect * game.itemXP * (1 + game.petsDiscovered / 100));
    }

    calculateTotalCooldown() {
        return this.baseCooldown / (pets[game.selectedPet][2] * game.itemCooldown);
    }

    click() {
        game.buttonClicks += 1;
        game.XP += this.calculateTotalXp();
        this.availableAt = Date.now() + this.calculateTotalCooldown() * 1000;

        this.updateDisplay();
    }

    isReady() {
        return this.availableAt <= Date.now();
    }

    innerHtml() {
        if (!this.isReady()) {
            return "Check back in " + numberToTime((this.availableAt - Date.now()) / 1000);
        }

        return "Gain " + numberShort(this.calculateTotalXp()) + "&nbsp;XP";
    }
}

// XPBoostButton class
class XPBoostButton extends Button {
    constructor(selector, isVisible, baseXpBoost, baseCooldown, requiredLevel) {
        super(selector, isVisible);
        this.baseXpBoost = baseXpBoost;
        this.baseCooldown = baseCooldown;
        this.requiredLevel = requiredLevel;
    }

    calculateTotalXpBoost() {
        return this.baseXpBoost * pets[game.selectedPet][4] * game.itemXPBoost;
    }

    calculateTotalCooldown() {
        return this.baseCooldown / (game.itemCooldown);
    }

    click() {
        if (game.items[12] === 1) { // Depends if you have the "xpboost buttons substract xp rather than resetting them"
            game.lostXP += levelToXP(this.requiredLevel)
            game.XP -= levelToXP(this.requiredLevel)
        }
        else {
            game.lostXP += game.XP
            game.XP = 0
        }

        game.XPBoost += this.calculateTotalXpBoost()
        this.availableAt = Date.now() + this.calculateTotalCooldown() * 1000;

        game.buttonClicks += 1

        this.updateDisplay();
    }

    isReady() {
        return this.availableAt <= Date.now() && game.level >= this.requiredLevel;
    }

    innerHtml() {
        if (this.availableAt > Date.now()) {
            return "Check back in " + numberToTime((this.availableAt - Date.now()) / 1000);
        }

        if (game.level < this.requiredLevel) {
            return "Check back at level " + this.requiredLevel;
        }

        if (game.items[12] === 0) {
            return "Gain " + numberShort(this.calculateTotalXpBoost()) + " XPBoost, but reset XP"
        }

        return "Gain " + numberShort(this.calculateTotalXpBoost()) + " XPBoost, but lose " + numberShort(levelToXP(this.requiredLevel)) + "&nbsp;XP"
    }
}

// StatButton class
class StatButton extends Button {
    constructor(selector, isVisible, baseStatGain, baseCooldown) {
        super(selector, isVisible);
        this.baseStatGain = baseStatGain;
        this.baseCooldown = baseCooldown;
    }

    calculateTotalHPGain() {
        return 1 * this.baseStatGain * game.itemStat;
    }

    calculateTotalDamageGain() {
        return 0.1 * this.baseStatGain * game.itemStat;
    }

    calculateTotalDefenseGain() {
        return 0.01 * this.baseStatGain * game.itemStat;
    }

    click() {
        game.HP += this.calculateTotalHPGain();
        game.DMG += this.calculateTotalDamageGain();
        game.DEF += this.calculateTotalDefenseGain();

        this.availableAt = Date.now() + this.baseCooldown * 1000;

        game.buttonClicks += 1

        this.updateDisplay();
    }

    isReady() {
        return this.availableAt <= Date.now();
    }

    innerHtml() {
        if (!this.isReady()) {
            return "Check back in " + numberToTime((this.availableAt - Date.now()) / 1000);
        }

        return "Gain " + numberShort(this.calculateTotalHPGain()) + " HP, " + numberShort(this.calculateTotalDamageGain()) + " DMG and " + numberShort(this.calculateTotalDefenseGain()) + " DEF";
    }
}

// UnboxPetButton class
class UnboxPetButton extends Button {
    constructor(selector, isVisible, baseCooldown, xpBoostCost, coinCost, petRarityIndex, petRarityName) {
        super(selector, isVisible);
        this.baseCooldown = baseCooldown;
        this.xpBoostCost = xpBoostCost;
        this.coinCost = coinCost;
        this.petRarityIndex = petRarityIndex;
        this.petRarityName = petRarityName;
    }

    calculateNumberOfPetsToUnbox() {
        if (this.petRarityIndex < 7) {
            return 1;
        }

        return 1 + game.extraPetAmount;
    }

    click() {
        unboxPet(this.petRarityIndex, this.calculateNumberOfPetsToUnbox());
    }

    mouseOver() {
        displayPetRarities(this.petRarityIndex);
    }

    mouseOut() {
        displayPetRarities(0);
    }

    isReady() {
        return this.availableAt <= Date.now() && (game.XPBoost - this.xpBoostCost >= 1) && (game.coins - this.coinCost >= 0);
    }

    innerHtml() {
        if (this.availableAt > Date.now()) {
            return "Check back in " + numberToTime((this.availableAt - Date.now()) / 1000);
        }

        if (game.XPBoost - this.xpBoostCost < 1) {
            return "Check back when you have at least " + numberShort(1 + this.xpBoostCost) + " XPBoost";
        }

        if (game.coins - this.coinCost < 0) {
            return "Check back when you have at least " + numberShort(this.coinCost) + " coins";
        }

        let innerTextStr = "Unbox ";

        if (this.calculateNumberOfPetsToUnbox() === 1) {
            innerTextStr += "a ";
        } else {
            innerTextStr += this.calculateNumberOfPetsToUnbox() + " ";
        }

        innerTextStr += "random " + this.petRarityName + " pet";

        let costStr = "";
        if (this.xpBoostCost > 0) {
            costStr += " for " + numberShort(this.xpBoostCost) + " XPBoost";
        }

        if (this.coinCost > 0) {
            if (costStr !== "") {
                costStr += " and ";
            } else {
                costStr += " for ";
            }
            costStr += numberShort(this.coinCost) + " coins";
        }

        innerTextStr += costStr;

        return innerTextStr;
    }
}

// DailyRewardButton class
class DailyRewardButton extends Button {
    constructor(selector, isVisible) {
        super(selector, isVisible);
    }

    click() {
        openCloseDailyRewardTab();
    }

    innerHtml() {
        return "Daily Reward";
    }
}

// TabButton class
class TabButton extends Button {
    constructor(selector, isVisible, tabName, tabClass) {
        super(selector, isVisible, tabName);
        this.tabClass = tabClass;
    }

    click() {
        document.querySelectorAll(".buttonsTab:not(." + this.tabClass + ")").forEach((tab) => {
            tab.classList.add("hidden");
        });

        document.querySelector("." + this.tabClass).classList.remove("hidden");
    }

    updateDisplay() {
        super.updateDisplay();

        document.querySelectorAll("." + this.tabClass + " .button:not(.hidden):not([disabled])").length > 0 ?
            document.querySelectorAll(this.selector).forEach((element) => element.classList.add("flickering")) :
            document.querySelectorAll(this.selector).forEach((element) => element.classList.remove("flickering"));
    }
}

const buttons = [
    new TabButton(".XPTabButton", () => game.level >= 8, "XP Buttons", "XPTab"),
    new TabButton(".UnboxPetsTabButton", () => game.level >= 8, "Unbox new pets", "UnboxPetsTab"),
    new TabButton(".XPBoostTabButton", () => game.level >= 100, "XP Boost Buttons", "XPBoostTab"),
    new TabButton(".StatsTabButton", () => game.level >= 500, "XP Buttons", "StatsTab"),
    new DailyRewardButton(".dailyRewardButton", () => game.level >= 8),
    new XPButton(".XPButton1", () => true, 1, 60),
    new XPButton(".XPButton2", () => game.level >= 2, 2, 300),
    new XPButton(".XPButton3", () => game.level >= 3, 5, 1800),
    new XPButton(".XPButton4", () => game.level >= 4, 10, 7200),
    new XPButton(".XPButton5", () => game.level >= 6, 25, 43200),
    new XPButton(".XPButton6", () => game.level >= 35, 50, 172800),
    new XPButton(".XPButton7", () => game.level >= 70, 250, 604800),
    new XPButton(".XPButton8", () => game.level >= 150, 100, 86400),
    new XPButton(".XPButton9", () => game.level >= 250, 33, 21600),
    new XPButton(".XPButton10", () => game.level >= 300, 15, 3600),
    new UnboxPetButton(".unboxBasicPetsButton", () => game.level >= 8, 7200, 0, 0, 3, "basic"),
    new UnboxPetButton(".unboxAdvancedPetsButton", () => game.level >= 12, 21600, 0, 0, 4, "advanced"),
    new UnboxPetButton(".unboxEpicPetsButton", () => game.level >= 20, 64800, 0, 0, 5, "epic"),
    new UnboxPetButton(".unboxLegendaryPetsButton", () => game.level >= 50, 172800, 0, 0, 6, "legendary"),
    new UnboxPetButton(".unboxPrestigePetsButton", () => game.level >= 125, 3600, 0, 0, 7, "prestige"),
    new UnboxPetButton(".unboxTranscendantPetsButton", () => game.level >= 350, 3600, 0, 0, 8, "transcendant"),
    new UnboxPetButton(".unboxUniversalPetsButton", () => game.level >= 20000, 43200, 0, 0, 9, "universal"),
    new XPBoostButton(".XPBoostButton1", () => game.level >= 100, 0.2, 3600, 100),
    new XPBoostButton(".XPBoostButton2", () => game.level >= 200, 1, 3600, 200),
    new XPBoostButton(".XPBoostButton3", () => game.level >= 400, 4, 3600, 400),
    new StatButton(".StatButton1", () => game.level >= 500, 5, 3600),
    new StatButton(".StatButton2", () => game.level >= 50000, 20, 21600),
];

onDomReady(function () {
    // Bind events for all buttons
    buttons.forEach((button) => {
        console.log(button);
        button.bindEvents();
    });

    // Update the display of the buttons every 100ms
    setInterval(() => {
        buttons.forEach((button) => {
            button.updateDisplay();
        });
    }, 100);
});








// const XPButtons = [ //The stats of every single xp button
//   {name: "Test", xp: 0, cooldown: 0, cooldownID: 0, unlock: 0},
//   {name: "XPbutton1", xp: 1, cooldown: 60, cooldownID: 0, unlock: 0, testFunction: () => {console.log(this.xp)}},
//   {name: "XPbutton2", xp: 2, cooldown: 300, cooldownID: 1, unlock: 1},
//   {name: "XPbutton3", xp: 5, cooldown: 1800, cooldownID: 2, unlock: 2},
//   {name: "XPbutton4", xp: 10, cooldown: 7200, cooldownID: 3, unlock: 3},
//   {name: "XPbutton5", xp: 25, cooldown: 43200, cooldownID: 4, unlock: 5},
//   {name: "XPbutton6", xp: 50, cooldown: 172800, cooldownID: 5, unlock: 10},
//   {name: "XPbutton7", xp: 250, cooldown: 604800, cooldownID: 11, unlock: 12},
//   {name: "XPbutton8", xp: 100, cooldown: 86400, cooldownID: 14, unlock: 15},
//   {name: "XPbutton9", xp: 33, cooldown: 21600, cooldownID: 16, unlock: 17},
//   {name: "XPbutton10", xp: 15, cooldown: 3600, cooldownID: 17, unlock: 18},
// ]
//
// //The code for any of the xp buttons
// function clickXpButton(x) {
//     if (game.buttonCooldowns[XPButtons[x].cooldownID] == 0) { //Checks the proper button is off cooldown
//         game.buttonClicks += 1
//         game.XP += XPButtons[x].xp * (pets[game.selectedPet][1] * game.XPBoostEffect * game.itemXP * (1 + game.petsDiscovered / 100)) //Assigns the xp that you have to get
//         game.buttonCooldowns[XPButtons[x].cooldownID] = XPButtons[x].cooldown / (pets[game.selectedPet][2] * game.itemCooldown) //Selects the cooldownID and the cooldown of the button, and sets them to one
//     }
//     updateSmall()
//   }
//
// const XPBoostButtons = [ //Stats of the xpboost buttons
//   {name: "Test", level: 0, xpboost: 0, cooldown: 60, cooldownID: 0, unlock: 0},
//   {name: "XPBbutton1", level: 100, xpboost: 0.2, cooldown: 3600, cooldownID: 12, unlock: 13},
//   {name: "XPBbutton2", level: 200, xpboost: 1, cooldown: 3600, cooldownID: 15, unlock: 16},
//   {name: "XPBbutton3", level: 400, xpboost: 4, cooldown: 3600, cooldownID: 19, unlock: 20},
// ]
//
//   function clickXpBoostButton(x) { //Will work for any of them individually
//   if (game.XP >= levelToXP(XPBoostButtons[x].level) && game.buttonCooldowns[XPBoostButtons[x].cooldownID] == 0) { //Checks if the button is ready and got enough XP
//       if (game.items[12] == 1) { //Depends if you have the "xpboost buttons substract xp rather than resetting them"
//         game.lostXP += levelToXP(XPBoostButtons[x].level)
//         game.XP -= levelToXP(XPBoostButtons[x].level)
//         game.XPBoost += XPBoostButtons[x].xpboost * pets[game.selectedPet][4] * game.itemXPBoost
//         game.buttonCooldowns[XPBoostButtons[x].cooldownID] = XPBoostButtons[x].cooldown / (game.itemCooldown) //1h
//       }
//       else {
//         game.lostXP += game.XP
//         game.XP = 0
//         game.XPBoost += XPBoostButtons[x].xpboost * pets[game.selectedPet][4] * game.itemXPBoost
//         game.buttonCooldowns[XPBoostButtons[x].cooldownID] = XPBoostButtons[x].cooldown / (game.itemCooldown) //1h
//       }
//       game.buttonClicks += 1
//     }
//       else {
//         alert("Button not ready or below level of unlock")
//       }
//       updateSmall()
//     }
//
// const StatButtons = [
//   {name: "Test", stats: 0, cooldown: 60, cooldownID: 0, unlock: 0},
//   {name: "StatButton1", stats: 5, cooldown: 3600, cooldownID: 20, unlock: 21},
//   {name: "StatButton2", stats: 20, cooldown: 21600, cooldownID: 25, unlock: 24},
// ]
//
//   function clickStatsButton(x) {
//     if (game.buttonCooldowns[StatButtons[x].cooldownID] == 0) {
//       game.HP += 1 * StatButtons[x].stats * game.itemStat
//       game.DMG += 0.1 * StatButtons[x].stats * game.itemStat
//       game.DEF += 0.01 * StatButtons[x].stats * game.itemStat
//       game.buttonCooldowns[StatButtons[x].cooldownID] = StatButtons[x].cooldown / (game.itemCooldown) //1h
//       game.buttonClicks += 1
//   }
//   updateSmall()
// }
