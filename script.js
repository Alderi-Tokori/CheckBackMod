var autosaveStarted = false

//Sets all variables to their base values
function reset() {
    game = {
        XP: 0,
        lostXP: 0,
        coins: 0,
        level: 1,
        highestLevel: 1,
        XPBoost: 1,
        XPBoostEffect: 1,
        buttonCooldowns: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        buttonsAvailableAt: {},
        unlocks: 0,
        totalUnlocks: 0,
        possibleUnlocks: 26,
        currentTheme: 2,
        lastSave: Date.now(),
        timeOfLastUpdate: Date.now(),
        sessionStart: Date.now(),
        pets: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        specialPets: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        enemies: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        selectedPet: 0,
        dailyRewards: 0,
        speed: 1,
        HP: 0,
        currentHP: 0,
        enemyHP: 0,
        DMG: 0,
        DEF: 0,
        items: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        itemXP: 1,
        itemStat: 1,
        itemXPBoost: 1,
        itemCooldown: 1,
        itemXPBoostEffectSoftcap: 0,
        itemUnlocks: 0,
        extraUnlocks: 0,
        itemXPBoostQoL: 0,
        itemLoot: 1,
        itemDailyXP: 1,
        extraPetAmount: 0,
        currentTab: 1,
        timePlayed: 0,
        buttonClicks: 0,
        cratesOpened: 0,
        enemiesDefeated: 0,
        petsDiscovered: 0,
    }

    buttons.forEach(button => {
        game.buttonsAvailableAt[button.selector] = 0
    })
}

reset()

//If the user confirms the hard reset, resets all variables, saves and refreshes the page
function hardReset() {
    if (confirm("Are you sure you want to reset? You will lose everything!")) {
        reset()
        save()
        location.reload()
    }
}

function save() {
    //console.log("saving")
    game.lastSave = Date.now();
    localStorage.setItem("checkBackSave", JSON.stringify(game));
}

function setAutoSave() {
    setInterval(save, 5000);
    autosaveStarted = true;
}

//setInterval(save, 5000)

function load() {
    reset()
    let loadgame = JSON.parse(localStorage.getItem("checkBackSave"))
    if (loadgame != null) {
        loadGame(loadgame)
    }
    updateSmall()
}

load()

function exportGame() {
    save()
    navigator.clipboard.writeText(btoa(JSON.stringify(game))).then(function () {
        alert("Copied to clipboard!")
    }, function () {
        alert("Error copying to clipboard, try again...")
    });
}

function importGame() {
    loadgame = JSON.parse(atob(prompt("Input your save here:")))
    if (loadgame && loadgame != null && loadgame != "") {
        reset()
        loadGame(loadgame)
        save()
        location.reload()
    } else {
        alert("Invalid input.")
    }
}

function help() {
    x = game.totalUnlocks
    console.log(x)
    if (x == 0) {
        alert("Click a button to gain xp. It has a cooldown. You check back in some time.")
    }
    if (x == 1) {
        alert("Some buttons have more rewards, but a higher cooldown.")
    }
    if (x == 2) {
        alert("Keep going, there's more than just xp buttons.")
    }
    if (x == 3) {
        alert("Keep going, there's more than just xp buttons.")
    }
    if (x == 4) {
        alert("Yes, this unlocked a new theme. But it's the one I always use so it's good - Marc")
    }
    if (x == 5) {
        alert("Almost there. Go get level 8 now.")
    }
    if (x == 6) {
        alert("The new feature is pets. Open crates and get rarer pets. Pets have stats such as you get more xp or buttons are faster.")
    }
    if (x == 7) {
        alert("Another pet crate. Some of them will give 1-2 pets from the previous crate. Also, there's daily rewards. It has 2 crates with rare pets and increasing xp rewards.")
    }
    if (x == 8) {
        alert("3 New themes... go get level 20.")
    }
    if (x == 9) {
        alert("More pets, which means that numbers go up. Each pet crate has a dragon pet, which has better stats than some of the next crate pets.")
    }
    if (x == 10) {
        alert("New xp button now. Keep going on now. Also, heads up. Keep opening your crates even if the pets won't get any better. They will have an use... eventually")
    }
    if (x == 11) {
        alert("This is the 1st pet crate that's not in Demonin's original. Same thing as before, stronger pets and slower crates.")
    }
    if (x == 12) {
        alert("So close to something new. Buttons are sorted in like tier sections, that's why the gaps in some places. But they will be filled.")
    }
    if (x == 13) {
        alert("A simple prestige feature. Resets your xp back to level 1 and, in exchange, your xp gains are increased. I suggest waiting a little bit... you'll see.")
    }
    if (x == 14) {
        alert("These new crates will cost a bit of your XPBoost, but the new pets are worth it. All future pet crates won't be free. By the way, you can scroll down to these buttons.")
    }
    if (x == 15) {
        alert("The xp buttons in this section are like (xp amount between buttons 4 and 5 with a cooldown between 3 and 4), or overall better.")
    }
    if (x == 16) {
        alert("Advanced XPBoost buttons will have a higher xp to xpboost ratio, but they do require of you to get to the unlock level to do the reset.")
    }
    if (x == 17) {
        alert("Keep going, you are doing great <3. Also, make sure to consider whenever pushing for new unlocks is better or not than farming XPBoost. I'd say to push.")
    }
    if (x == 18) {
        alert("If you are more active like person, this xp button is for you.")
    }
    if (x == 19) {
        alert("These pets also boost your XPBoost gain. Awesome, right? These pets have quick xp gain scaling too.")
    }
    if (x == 20) {
        alert("Were you lucky during the previous segment? If you really haven't grinded XPBoost, this new button is gonna be enough to bring you to the next stage of the game.")
    }
    if (x == 21) {
        alert("Fighting. There's one button that will give you stats. On the fighting menu, you can see your stats. Starting a fight automatically heals you, and the combat system is very simple. You get rewards by winning.")
    }
    if (x == 22) {
        alert("The shop. Here you buy items and unlocks. There's boosts, there's QoL and unlocks. These also require of you having opened a bunch of pet crates constantly through the playthrough.")
    }
    if (x == 23) {
        alert("Your 1st non-level unlock. You unlocked a new area. Stuff will get grindy from here, and numbers will go up fast.")
    }
    if (x == 24) {
        alert("Back to grinding XP. These new pets are gonna be expensive but useful to push further. If you haven't bought items 1-18, you should go for them. (Note: This crate still has alerts)")
    }
    if (x == 25) {
        alert("Oh, hey! More stats. Sure thing I'll be able to beat the boss soon...")
    }
    if (x == 26) {
        alert("It's just grind, grind, grind. The next feature unlock is gonna be expensive, so might as well make sure to get all upgrades and better pets")
    }
}

function loadGame(loadgame) {
    // Merge game base object and loaded game object
    game = deepMerge(game, loadgame);

    if (game.selectedPet == 0) {
        document.getElementById("selectedPet").innerHTML = "None"
        document.getElementById("selectedPetImg").classList.add("hidden")
    } else {
        document.getElementById("selectedPet").innerHTML = pets[game.selectedPet][0]
        document.getElementById("selectedPetImg").classList.remove("hidden")
        document.getElementById("selectedPetImg").src = "img/pets/" + game.selectedPet + ".png"
    }

    if (Number.isInteger(game.currentTheme)) {
        game.currentTheme = "Dark";
    }
    changeTheme(game.currentTheme)

    for (let i = 0; i < pets.length; i++) {
        if (!game.pets[i]) game.pets[i] = 0
    }
    for (let i = 0; i < enemies.length; i++) {
        if (!game.enemies[i]) game.enemies[i] = 0
    }
    for (let i = 0; i < items.length; i++) {
        if (!game.items[i]) game.items[i] = 0
    }
    for (let i = 0; i < 17; i++) {
        if (!game.specialPets[i]) game.specialPets[i] = 0
    }
    for (let i = 0; i < 17; i++) {
        if (game.specialPets[i] >= 1) {
            game.pets[i + 47] += game.specialPets[i]
            if (game.pets[i + 47] >= game.specialPets[i]) {
                game.specialPets[i] = 0
                if (game.selectedPet >= 23 && game.selectedPet <= 39) game.selectedPet = i + 47
            }
        }
    }
    if (game.pets[21] < 0) {
        game.pets[21] += 5
        game.pets[48] -= 3
        game.pets[40] -= 5
    }
    countPets()
    game.sessionStart = Date.now()
    buttons.filter(x => x.selector === ".XPTabButton").forEach(x => x.click())
}


//Updates variables and text
function updateSmall() {
    if (game.buttonCooldowns[23] > 0) {
    } else {
        autoPets()
    }

    game.level = XPToLevel(Math.max(Math.floor(game.XP), 0))
    document.getElementById("level").innerHTML = levelShort(game.level)
    //This bit is weird and gross
    //Sets the colour of the level bar, the texture of the level bar (if you're a high enough level), and your rank name
    i = 0
    while (game.level >= levelBarColours[i + 1][0]) i++
    document.getElementById("levelBar").style.backgroundColor = levelBarColours[i][1]
    if (game.level >= levelBarTextures[0]) {
        i = 0
        while (game.level >= levelBarTextures[i]) i++
        document.getElementById("levelBar").style.backgroundImage = "url('img/texture" + i + ".png')"
        document.getElementById("levelBarText").style.textShadow = "0.3vh 0.3vh rgba(0,0,0,0.6)"
        document.getElementById("levelBarRankText").style.textShadow = "0.3vh 0.3vh rgba(0,0,0,0.6)"
    }
    i = 0
    while (game.level >= ranks[i + 1][0]) i++
    document.getElementById("rank").innerHTML = ranks[i][1]
    //Sets the "XP to next level" text
    if (game.level < 1500) { //Before level 1500
        XPToNextLevel = levelToXP(game.level + 1) - levelToXP(game.level)
        ProgressToNextLevel = (game.XP - levelToXP(game.level)).toFixed(1)
        document.getElementById("XPBarText").innerHTML = "XP to next level: " + xpShort(ProgressToNextLevel) + "/" + xpShort(XPToNextLevel)
        document.getElementById("XPBarBack").style.width = (ProgressToNextLevel / XPToNextLevel * 100) + "%"
    } else if (game.unlocks < unlockLevels.length) { //After level 1500
        XPToNextUnlock = levelToXP(unlockLevels[game.unlocks]) // - levelToXP(unlockLevels[game.unlocks - 1])
        ProgressToNextUnlock = game.XP // - levelToXP(unlockLevels[game.unlocks - 1]))
        document.getElementById("XPBarText").innerHTML = "XP to next unlock: " + xpShort(ProgressToNextUnlock) + "/" + xpShort(XPToNextUnlock)
        document.getElementById("XPBarBack").style.width = (ProgressToNextUnlock / XPToNextUnlock * 100) + "%"
    } else {
        document.getElementById("XPBarText").innerHTML = "Total XP: " + numberShort(game.XP)
        document.getElementById("XPBarBack").style.width = 100 + "%"
    }
    if (game.level > game.highestLevel) {
        game.highestLevel = game.level
    }
    handleUnlocks()
}

setInterval(updateSmall, 16) //Runs the update ~60 times per second

//Updates cooldowns
function updateLarge() {
    for (i = 0; i < 27; i++) {
        if (game.buttonCooldowns[i] > 0) game.buttonCooldowns[i] -= ((Date.now() - game.timeOfLastUpdate) / (1000 / game.speed))
        if (game.buttonCooldowns[i] < 0) game.buttonCooldowns[i] = 0
    }
    if (game.timeOfLastUpdate - game.sessionStart <= 2000) {
    } else game.timePlayed += (Date.now() - game.timeOfLastUpdate) / 1000;
    game.timeOfLastUpdate = Date.now()
}

setInterval(updateLarge, 100) //Runs the update ~10 times per second

function XPToLevel(x) {
    return Math.floor((x / 5) ** 0.55) + 1
}

function levelToXP(x) {
    return Math.ceil((x - 1) ** (1 / 0.55) * 5)
}

function numberToTime(x) {
    xCeil = Math.ceil(x)
    result = ""
    if (xCeil >= 172800) result += Math.floor(xCeil / 86400) + " days "
    else if (xCeil >= 86400) result += Math.floor(xCeil / 86400) + " day "
    if (Math.floor(xCeil / 3600) % 24 == 1) result += (Math.floor(xCeil / 3600) % 24) + " hour "
    else if (Math.floor(xCeil / 3600) % 24 != 0) result += (Math.floor(xCeil / 3600) % 24) + " hours "
    if (Math.floor(xCeil / 60) % 60 == 1) result += (Math.floor(xCeil / 60) % 60) + " minute "
    else if (Math.floor(xCeil / 60) % 60 != 0) result += (Math.floor(xCeil / 60) % 60) + " minutes "
    if (xCeil % 60 == 1) result += Math.floor(xCeil % 60) + " second "
    else if (xCeil % 60 != 0) result += Math.floor(xCeil % 60) + " seconds "
    return result
}

function numberShort(x) {
    xCeil = Math.ceil(x)
    exponent = Math.floor(Math.log10(xCeil))
    result = ""
    if (exponent >= 12) result = (xCeil / 10 ** exponent).toFixed(2) + "e" + exponent
    else if (exponent >= 9) result = (xCeil / 10 ** 9).toFixed(1) + " B"
    else if (exponent >= 6) result = (xCeil / 10 ** 6).toFixed(1) + " M"
    else if (exponent >= 3) result = (xCeil / 10 ** 3).toFixed(1) + " K"
    else if (x >= 1) result = (x).toFixed(2)
    else result = (x).toFixed(3)
    return result
}

function levelShort(x) {
    xCeil = Math.ceil(x)
    exponent = Math.floor(Math.log10(xCeil))
    result = ""
    if (exponent >= 12) result = (xCeil / 10 ** exponent).toFixed(2) + "e" + exponent
    else if (exponent >= 9) result = (xCeil / 10 ** 9).toFixed(2) + " B"
    else if (exponent >= 6) result = (xCeil / 10 ** 6).toFixed(2) + " M"
    else if (exponent >= 4) result = (xCeil / 10 ** 3).toFixed(1) + " K"
    else result = xCeil
    return result
}

function xpShort(x) {
    xCeil = Math.ceil(x)
    exponent = Math.floor(Math.log10(xCeil))
    result = ""
    if (exponent >= 12) result = (xCeil / 10 ** exponent).toFixed(2) + "e" + exponent
    else if (exponent >= 9) result = (xCeil / 10 ** 9).toFixed(2) + " B"
    else if (exponent >= 6) result = (xCeil / 10 ** 6).toFixed(2) + " M"
    else if (exponent >= 4) result = (xCeil / 10 ** 3).toFixed(1) + " K"
    else result = (x)
    return result
}


//This will simply update the XPBoost display
function updateXPBoost() {
    if (game.XPBoost < 10) {
        return game.XPBoostEffect = game.XPBoost
    } else {
        return game.XPBoostEffect = 9 + (game.XPBoost - 9) ** (0.5 + game.itemXPBoostEffectSoftcap)
    }
}

//Handles unlocks (Happens 60 times a second, could definitely be optimised!) - Demonin. Reply: I believe this is better now - Marc. Reply 2: It isn't - Marc
function handleUnlocks() {
    for (i = 0; i < unlockLevels.length; i++) {
        if (game.level >= unlockLevels[i] && game.unlocks < i + 1) {
            game.unlocks = i + 1
            game.totalUnlocks = game.unlocks + game.extraUnlocks
            //Could probably use a switch
            if (i == 22) {
                game.buttonCooldowns[24] = 0
                for (let i = 0; i < 9; i++) {
                    game.pets[i + 64] = 0
                }
            }
            break
        }
    }
    game.possibleUnlocks = 26
    if (game.itemUnlocks > game.extraUnlocks) {
        game.extraUnlocks += 1
        game.totalUnlocks = game.unlocks + game.extraUnlocks
    }

    if (game.totalUnlocks == game.possibleUnlocks) {
        document.getElementById("nextUnlockLevel").innerHTML = "All unlocks have been achieved! Update WIP (100%: All upgrades/Best pet/Strongest enemy beaten)"
    } else if (game.unlocks == unlockLevels.length) {
        document.getElementById("nextUnlockLevel").innerHTML = "All XP unlocks have been achieved! But " + (game.possibleUnlocks - game.totalUnlocks) + " unlocks are missing"
    } else if (game.unlocks >= 22) {
        document.getElementById("nextUnlockLevel").innerHTML = "You will unlock something new at level " + numberShort(unlockLevels[game.unlocks]) + " or through other means!"
    } else {
        document.getElementById("nextUnlockLevel").innerHTML = "You will unlock something new at level " + unlockLevels[game.unlocks] + "!"
    }
}

function changeTheme(themeName) {
    game.currentTheme = themeName;
    document.getElementById("themeLink").href = "themes/theme" + themeName + ".css";
}

function Stats() {
    result = "Player stats: <br>"
    result += "Time played: " + numberToTime(game.timePlayed) + "<br>"
    result += "Buttons clicked: " + game.buttonClicks + "<br>"
    if (game.cratesOpened >= 1) result += "Crates opened: " + game.cratesOpened + "<br>"
    if (game.level >= 100) result += "Highest level achieved: " + levelShort(game.highestLevel) + "<br>"
    if (game.lostXP >= 1) result += "Lost XP: " + numberShort(game.lostXP) + "<br>"
    if (game.enemiesDefeated >= 1) result += "Enemies defeated: " + game.enemiesDefeated + "<br>"
    result += "<br>Unlocks achieved: " + game.totalUnlocks + "/" + game.possibleUnlocks + "<br>"
    if (game.unlocks >= 6) result += "Pet collection progress: " + countPets() + "<br>"
    if (game.unlocks >= 21) result += "Enemy collection progress: " + countEnemies() + "<br>"
    if (game.unlocks >= 22) result += "Upgrades Maxed: " + countItems() + "<br>"
    return result
}

//asdfgh

function countPets() {
    counter = 0
    for (let i = 0; i < pets.length; i++) {
        if (game.pets[i] >= 1) {
            counter++
        }
    }
    game.petsDiscovered = counter
    return counter + "/" + (pets.length - 1)
}

function countEnemies() {
    counter = 0
    for (let i = 0; i < enemies.length; i++) {
        if (game.enemies[i] >= 1) {
            counter++
        }
    }
    return counter + "/" + (enemies.length - 1)
}

function countItems() {
    counter = 0
    for (let i = 0; i < items.length; i++) {
        if (game.items[i] >= items[i][1]) {
            counter++
        }
    }
    return counter + "/" + (items.length - 1)
}

// Syncing animations
document.addEventListener("animationstart", (event) => {
    const flickeringAnimationNames = ["flickering", "dailyReward-flickering"];

    if (flickeringAnimationNames.includes(event.animationName)) {
        let animationCurrentTime;
        let anims = document.getAnimations();
        for (let i = 0; i < anims.length; i++) {
            if (flickeringAnimationNames.includes(anims[i].animationName)) {
                animationCurrentTime = anims[i].currentTime;
                break;
            }
        }

        for (let i = 0; i < anims.length; i++) {
            if (flickeringAnimationNames.includes(anims[i].animationName)) {
                if (animationCurrentTime) anims[i].currentTime = animationCurrentTime;
            }
        }
    }
});
