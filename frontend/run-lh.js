const { execSync } = require('child_process');
const fs = require('fs');

for (let i = 1; i <= 3; i++) {
  console.log(`Running audit ${i}...`);
  try {
    execSync(`npx --yes lighthouse http://localhost:3000 --chrome-flags="--incognito --headless" --only-categories=performance --output=json --output-path=report${i}.json`);
    const report = JSON.parse(fs.readFileSync(`report${i}.json`));
    const score = report.categories.performance.score;
    const tbt = report.audits['total-blocking-time'].displayValue;
    const tbtMs = report.audits['total-blocking-time'].numericValue;
    console.log(`Run ${i}: Score = ${score}, TBT = ${tbt} (${tbtMs} ms)`);
  } catch(e) {
    console.error(`Error in run ${i}`);
  }
}
