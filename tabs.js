//This will control the tabs feature
function tab(x) {
    game.currentTab = x
 displayStuff()
 if (x == 2) {document.getElementById("petRarities").innerHTML = "Crate cooldown modifiers:" + CrateMultis()}
}

function displayStuff() {
  if (game.currentTab <= 1) {document.getElementById("XPbutton1").style.display = "block" }
   else document.getElementById("XPbutton1").style.display = "none"
  if (game.currentTab <= 1 && game.unlocks >= 1) {document.getElementById("XPbutton2").style.display = "block" }
   else document.getElementById("XPbutton2").style.display = "none"
  if (game.currentTab <= 1 && game.unlocks >= 2) {document.getElementById("XPbutton3").style.display = "block" }
   else document.getElementById("XPbutton3").style.display = "none"
  if (game.currentTab <= 1 && game.unlocks >= 3) {document.getElementById("XPbutton4").style.display = "block" }
   else document.getElementById("XPbutton4").style.display = "none"
  if (game.currentTab <= 1 && game.unlocks >= 5) {document.getElementById("XPbutton5").style.display = "block" }
   else document.getElementById("XPbutton5").style.display = "none"
  if (game.currentTab <= 1 && game.unlocks >= 10) {document.getElementById("XPbutton6").style.display = "block" }
   else document.getElementById("XPbutton6").style.display = "none"
  if (game.currentTab <= 1 && game.unlocks >= 12) {document.getElementById("XPbutton7").style.display = "block" }
   else document.getElementById("XPbutton7").style.display = "none"
  if (game.currentTab <= 1 && game.unlocks >= 15) {document.getElementById("XPbutton8").style.display = "block" }
   else document.getElementById("XPbutton8").style.display = "none"
  if (game.currentTab <= 1 && game.unlocks >= 17) {document.getElementById("XPbutton9").style.display = "block" }
   else document.getElementById("XPbutton9").style.display = "none"
  if (game.currentTab <= 1 && game.unlocks >= 18) {document.getElementById("XPbutton10").style.display = "block" }
   else document.getElementById("XPbutton10").style.display = "none"
  if (game.currentTab == 2 && game.unlocks >= 6) {document.getElementById("unboxButton1").style.display = "block" }
   else document.getElementById("unboxButton1").style.display = "none"
  if (game.currentTab == 2 && game.unlocks >= 7) {document.getElementById("unboxButton2").style.display = "block" }
   else document.getElementById("unboxButton2").style.display = "none"
  if (game.currentTab == 2 && game.unlocks >= 9) {document.getElementById("unboxButton3").style.display = "block" }
   else document.getElementById("unboxButton3").style.display = "none"
  if (game.currentTab == 2 && game.unlocks >= 11) {document.getElementById("unboxButton4").style.display = "block" }
   else document.getElementById("unboxButton4").style.display = "none"
  if (game.currentTab == 2 && game.unlocks >= 14) {document.getElementById("unboxButton5").style.display = "block" }
   else document.getElementById("unboxButton5").style.display = "none"
  if (game.currentTab == 2 && game.unlocks >= 19) {document.getElementById("unboxButton6").style.display = "block" }
   else document.getElementById("unboxButton6").style.display = "none"
  if (game.currentTab == 2 && game.unlocks >= 23) {document.getElementById("unboxButton7").style.display = "block" }
   else document.getElementById("unboxButton7").style.display = "none"
  if (game.currentTab == 3 && game.unlocks >= 13) {document.getElementById("XPBbutton1").style.display = "block" }
   else document.getElementById("XPBbutton1").style.display = "none"
  if (game.currentTab == 3 && game.unlocks >= 16) {document.getElementById("XPBbutton2").style.display = "block" }
   else document.getElementById("XPBbutton2").style.display = "none"
  if (game.currentTab == 3 && game.unlocks >= 20) {document.getElementById("XPBbutton3").style.display = "block" }
   else document.getElementById("XPBbutton3").style.display = "none"
  if (game.currentTab == 4 && game.unlocks >= 21) {document.getElementById("StatButton1").style.display = "block" }
   else document.getElementById("StatButton1").style.display = "none"
  if (game.currentTab == 4 && game.unlocks >= 24) {document.getElementById("StatButton2").style.display = "block" }
   else document.getElementById("StatButton2").style.display = "none"
  displayTabStats(game.currentTab)
}

function displayTabStats(x) {
   if (x == 0) {
    document.getElementById("petRarities").innerHTML = Stats()
   }
   if (x == 1) {
    document.getElementById("petRarities").innerHTML = "XP multipliers: " + XPmultis()
   }
   if (x == 2) {
     
   }
   if (x == 3) {
    document.getElementById("petRarities").innerHTML = "XPBoost: "+ XPBoostMultis()
   }
   if (x == 4) {
    document.getElementById("petRarities").innerHTML = "Stat gain multipliers: "+ StatMultis()
   }
}

function XPmultis() {
  result = "<br>"
  if (game.selectedPet >= 1) {result += "x" + numberShort(pets[game.selectedPet][1]) + " From pets<br>"}
  if (game.petsDiscovered >= 1) {result += "x" + numberShort(1 + game.petsDiscovered / 100) + " From pet collection<br>"}
  if (game.XPBoostEffect > 1) {result += "x" + numberShort(game.XPBoostEffect) + " From XPBoost<br>"}
  if (game.itemXP > 1) {result += "x" + numberShort(game.itemXP) + " From items<br>"}
  result += "Total: x" + numberShort((pets[game.selectedPet][1] * game.XPBoostEffect * game.itemXP * (1 + game.petsDiscovered / 100))) + "<br><br> Cooldown modifiers: <br>"
  if (game.selectedPet >= 1) {result += "/" + numberShort(pets[game.selectedPet][2]) + " From pets<br>"}
  if (game.itemCooldown > 1) {result += "/" + numberShort(game.itemCooldown) + " From items<br>"}
  result += "Total: /" + numberShort((pets[game.selectedPet][2] * game.itemCooldown))
  return result
}

function CrateMultis() {
  result = "<br>"
  if (pets[game.selectedPet][3] > 1) {result += "/" + numberShort(pets[game.selectedPet][3]) + " From pets<br>"}
  if (game.itemCooldown > 1) {result += "/" + numberShort(game.itemCooldown) + " From items<br>"}
  result += "Total: /" + numberShort((pets[game.selectedPet][3] * game.itemCooldown)) + "<br><br>"
  if (game.items[16] >= 1) {result += "Extra normal crates: 1 <br>"}
  return result
}

function XPBoostMultis() {
  result = numberShort(game.XPBoost) + "<br>"
  if (game.XPBoost > 10) {result += "Effective boost: " + numberShort(game.XPBoostEffect) + "<br> Softcap: ^" + (0.5 + game.itemXPBoostEffectSoftcap) + "<br>" }
  result += "<br> XPBoost gain multipliers: <br>"
  if (pets[game.selectedPet][4] > 1) {result += "x" + numberShort(pets[game.selectedPet][4]) + " From pets<br>"}
  if (game.itemXPBoost > 1) {result += "x" + numberShort(game.itemXPBoost) + " From items<br>"}
  result += "Total: x" + numberShort((pets[game.selectedPet][4] * game.itemXPBoost))
  if (game.itemCooldown > 1) {result += "<br><br>Button cooldown<br>/" + numberShort(game.itemCooldown) + " From items<br>"}
  return result
}

function StatMultis() {
  result = "<br>"
  if (game.itemStat > 1) {result += "x" + numberShort(game.itemStat) + " from items <br>"}
  result += "Total: x" + numberShort(game.itemStat)
  if (game.itemCooldown > 1) {result += "<br><br>Button cooldown<br>/" + numberShort(game.itemCooldown) + " From items<br>"}
  return result
}
