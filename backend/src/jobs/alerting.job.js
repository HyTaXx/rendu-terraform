// Si vous séparez la logique d’alerte (ex: recalc 24h depuis DB) :
async function run() {
  // Lire dernier snapshot par id, recalculer variation vs J-1, alerter si besoin.
}
module.exports = { run };
