/**
 * Abstract base Button class
 */
class Button {
    constructor(
        selector,
        isVisible = () => true,
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
        game.buttonsAvailableAt[this.selector] = Date.now() + this.calculateTotalCooldown() * 1000;

        this.updateDisplay();
    }

    isReady() {
        return game.buttonsAvailableAt[this.selector] <= Date.now();
    }

    innerHtml() {
        if (!this.isReady()) {
            return "Check back in " + numberToTime((game.buttonsAvailableAt[this.selector] - Date.now()) / 1000);
        }

        return "Gain " + numberShort(this.calculateTotalXp()) + " XP";
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
        game.buttonsAvailableAt[this.selector] = Date.now() + this.calculateTotalCooldown() * 1000;

        game.buttonClicks += 1

        this.updateDisplay();
    }

    isReady() {
        return game.buttonsAvailableAt[this.selector] <= Date.now() && game.level >= this.requiredLevel;
    }

    innerHtml() {
        if (game.buttonsAvailableAt[this.selector] > Date.now()) {
            return "Check back in " + numberToTime((game.buttonsAvailableAt[this.selector] - Date.now()) / 1000);
        }

        if (game.level < this.requiredLevel) {
            return "Check back at level " + this.requiredLevel;
        }

        if (game.items[12] === 0) {
            return "Gain " + numberShort(this.calculateTotalXpBoost()) + " XPBoost, but reset XP"
        }

        return "Gain " + numberShort(this.calculateTotalXpBoost()) + " XPBoost, but lose " + numberShort(levelToXP(this.requiredLevel)) + " XP"
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

        game.buttonsAvailableAt[this.selector] = Date.now() + this.baseCooldown * 1000;

        game.buttonClicks += 1

        this.updateDisplay();
    }

    isReady() {
        return game.buttonsAvailableAt[this.selector] <= Date.now();
    }

    innerHtml() {
        if (!this.isReady()) {
            return "Check back in " + numberToTime((game.buttonsAvailableAt[this.selector] - Date.now()) / 1000);
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

    calculateTotalCooldown() {
        return this.baseCooldown / (pets[game.selectedPet][3] * game.itemCooldown);
    }

    click() {
        unboxPet(this.petRarityIndex, this.calculateNumberOfPetsToUnbox());
        game.buttonsAvailableAt[this.selector] = Date.now() + this.calculateTotalCooldown() * 1000;

        this.updateDisplay();
    }

    mouseOver() {
        displayPetRarities(this.petRarityIndex);
    }

    mouseOut() {
        displayPetRarities(0);
    }

    isReady() {
        return game.buttonsAvailableAt[this.selector] <= Date.now() && (game.XPBoost - this.xpBoostCost >= 1) && (game.coins - this.coinCost >= 0);
    }

    innerHtml() {
        if (game.buttonsAvailableAt[this.selector] > Date.now()) {
            return "Check back in " + numberToTime((game.buttonsAvailableAt[this.selector] - Date.now()) / 1000);
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

// TabButton class
class TabButton extends Button {
    constructor(selector, isVisible, tabName, tabClass, clickBehavior) {
        super(selector, isVisible, tabName, clickBehavior);
        this.tabClass = tabClass;
    }

    click() {
        super.click();

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

// ModalButton class
class ModalButton extends Button {
    constructor(selector, isVisible, modalButtonName, modalId, clickBehavior) {
        super(selector, isVisible, modalButtonName, clickBehavior);
        this.modalId = modalId;
    }

    click() {
        document.getElementById(this.modalId).classList.toggle("hidden");

        super.click();
    }
}

class FightingModalButton extends ModalButton {
    constructor(selector, isVisible, modalButtonName, modalId, clickBehavior) {
        super(selector, isVisible, modalButtonName, modalId, clickBehavior);
    }

    updateDisplay() {
        super.updateDisplay();

        document.querySelectorAll("#fightingDiv .modalActionButtons .button:not(.hidden):not([disabled])").length > 0 ?
            document.querySelectorAll(this.selector).forEach((element) => element.classList.add("flickering")) :
            document.querySelectorAll(this.selector).forEach((element) => element.classList.remove("flickering"));
    }
}

// DailyRewardModalButton class
class DailyRewardModalButton extends Button {
    constructor(selector, isVisible) {
        super(selector, isVisible, "Daily Reward");
    }

    click() {
        document.getElementById("dailyRewardDiv").classList.toggle("hidden");

        if (! document.getElementById("dailyRewardDiv").classList.contains("hidden")) {
            displayDailyRewards();
        }
    }

    updateDisplay() {
        super.updateDisplay();

        document.querySelectorAll("#claimDailyRewardButton:not([disabled])").length > 0 ?
            document.querySelectorAll(this.selector).forEach((element) => element.classList.add("flickering")) :
            document.querySelectorAll(this.selector).forEach((element) => element.classList.remove("flickering"));
    }
}

class ClaimDailyRewardButton extends Button {
    constructor(selector) {
        super(selector);
        this.baseCooldown = 86400;
    }

    calculateTotalCooldown() {
        return this.baseCooldown / game.itemCooldown;
    }

    click() {
        claimDailyReward();
        game.buttonsAvailableAt[this.selector] = Date.now() + this.calculateTotalCooldown() * 1000;

        this.updateDisplay();
    }

    isReady() {
        return game.buttonsAvailableAt[this.selector] <= Date.now();
    }

    innerHtml() {
        if (!this.isReady()) {
            return "Check back in " + numberToTime((game.buttonsAvailableAt[this.selector] - Date.now()) / 1000);
        }

        return "Claim daily reward";
    }
}

class AreaFightButton extends Button {
    constructor(selector, isVisible, areaIndex, baseCooldown) {
        super(selector, isVisible);
        this.areaIndex = areaIndex;
        this.baseCooldown = baseCooldown;
    }

    calculateTotalCooldown() {
        return this.baseCooldown / game.itemCooldown;
    }

    click() {
        startFight(this.areaIndex);
        game.buttonsAvailableAt[this.selector] = Date.now() + this.calculateTotalCooldown() * 1000;

        this.updateDisplay();
    }

    mouseOver() {
        displayEnemiesFightRarities(this.areaIndex);
    }

    mouseOut() {
        displayEnemiesFightRarities(0);
    }

    isReady() {
        return game.buttonsAvailableAt[this.selector] <= Date.now();
    }

    innerHtml() {
        if (!this.isReady()) {
            return "Check back in " + numberToTime((game.buttonsAvailableAt[this.selector] - Date.now()) / 1000);
        }

        return "Fight an area " + this.areaIndex + " foe";
    }
}

const buttons = [
    new TabButton(".XPTabButton", () => game.highestLevel >= 8, "XP Buttons", "XPTab", () => {
        document.getElementById("petRarities").innerHTML = "XP multipliers: " + XPmultis();
    }),
    new TabButton(".UnboxPetsTabButton", () => game.highestLevel >= 8, "Unbox new pets", "UnboxPetsTab", () => {
        document.getElementById("petRarities").innerHTML = "Crate cooldown modifiers:" + CrateMultis();
    }),
    new TabButton(".XPBoostTabButton", () => game.highestLevel >= 100, "XP Boost Buttons", "XPBoostTab", () => {
        document.getElementById("petRarities").innerHTML = "XPBoost: "+ XPBoostMultis();
    }),
    new TabButton(".StatsTabButton", () => game.highestLevel >= 500, "Stat Buttons", "StatsTab", () => {
        document.getElementById("petRarities").innerHTML = "Stat gain multipliers: "+ StatMultis();
    }),
    new ModalButton(".petsModalButton", () => game.highestLevel >= 8, "Pets", "petsDiv", () => {
        if (! document.getElementById("petsDiv").classList.contains("hidden")) {
            displayPets();
        }
    }),
    new ModalButton(".enemiesModalButton", () => game.highestLevel >= 500, "Enemies", "enemiesDiv", () => {
        if (! document.getElementById("enemiesDiv").classList.contains("hidden")) {
            displayEnemies();
        }
    }),
    new FightingModalButton(".fightingModalButton", () => game.highestLevel >= 500, "Fighting", "fightingDiv", () => {
        if (! document.getElementById("fightingDiv").classList.contains("hidden")) {
            displayStats();
            document.querySelectorAll(".dropBox").forEach((element) => {
                element.innerHTML = "";
            });
        }
    }),
    new ModalButton(".shopModalButton", () => game.highestLevel >= 1500, "Shop", "shopDiv", () => {
        if (! document.getElementById("shopDiv").classList.contains("hidden")) {
            displayItems();
        }
    }),
    new DailyRewardModalButton(".dailyRewardButton", () => game.highestLevel >= 8),
    new ClaimDailyRewardButton("#claimDailyRewardButton"),
    new XPButton(".XPButton1", () => true, 1, 60),
    new XPButton(".XPButton2", () => game.highestLevel >= 2, 2, 300),
    new XPButton(".XPButton3", () => game.highestLevel >= 3, 5, 1800),
    new XPButton(".XPButton4", () => game.highestLevel >= 4, 10, 7200),
    new XPButton(".XPButton5", () => game.highestLevel >= 6, 25, 43200),
    new XPButton(".XPButton6", () => game.highestLevel >= 35, 50, 172800),
    new XPButton(".XPButton7", () => game.highestLevel >= 70, 250, 604800),
    new XPButton(".XPButton8", () => game.highestLevel >= 150, 100, 86400),
    new XPButton(".XPButton9", () => game.highestLevel >= 250, 33, 21600),
    new XPButton(".XPButton10", () => game.highestLevel >= 300, 15, 3600),
    new UnboxPetButton(".unboxBasicPetsButton", () => game.highestLevel >= 8, 7200, 0, 0, 3, "basic"),
    new UnboxPetButton(".unboxAdvancedPetsButton", () => game.highestLevel >= 12, 21600, 0, 0, 4, "advanced"),
    new UnboxPetButton(".unboxEpicPetsButton", () => game.highestLevel >= 20, 64800, 0, 0, 5, "epic"),
    new UnboxPetButton(".unboxLegendaryPetsButton", () => game.highestLevel >= 50, 172800, 0, 0, 6, "legendary"),
    new UnboxPetButton(".unboxPrestigePetsButton", () => game.highestLevel >= 125, 3600, 0.1, 0, 7, "prestige"),
    new UnboxPetButton(".unboxTranscendantPetsButton", () => game.highestLevel >= 350, 3600, 0.25, 0, 8, "transcendant"),
    new UnboxPetButton(".unboxUniversalPetsButton", () => game.highestLevel >= 20000, 43200, 0, 250, 9, "universal"),
    new XPBoostButton(".XPBoostButton1", () => game.highestLevel >= 100, 0.2, 3600, 100),
    new XPBoostButton(".XPBoostButton2", () => game.highestLevel >= 200, 1, 3600, 200),
    new XPBoostButton(".XPBoostButton3", () => game.highestLevel >= 400, 4, 3600, 400),
    new StatButton(".StatsButton1", () => game.highestLevel >= 500, 5, 3600),
    new StatButton(".StatsButton2", () => game.highestLevel >= 50000, 20, 21600),
    new AreaFightButton("#fight1Button", () => game.highestLevel >= 500, 1, 3600),
    new AreaFightButton("#fight2Button", () => game.items[6] > 0, 2, 21600),
    new AreaFightButton("#fight3Button", () => game.highestLevel >= 100000, 3, 86400),
];

onDomReady(function () {
    // Bind events for all buttons
    buttons.forEach((button) => {
        button.bindEvents();
    });

    // Update the display of the buttons every 100ms
    setInterval(() => {
        buttons.forEach((button) => {
            button.updateDisplay();
        });

        // Checks if we should display selectedPetText
        document.querySelectorAll(".UnboxPetsTab .button:not(.hidden):not([disabled])").length > 0 ?
            document.getElementById("selectedPetText").classList.remove("hidden") :
            document.getElementById("selectedPetText").classList.add("hidden");
    }, 100);
});
