//This will control the tabs feature
function displayTabStats(x) {
    document.getElementById("petRarities").innerHTML = Stats()
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
