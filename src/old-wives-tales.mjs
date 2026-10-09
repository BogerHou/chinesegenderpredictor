import {icon,previewPicture} from './templates.mjs';

const sources = {
  bump: 'https://pubmed.ncbi.nlm.nih.gov/10655817/',
  heart: 'https://pubmed.ncbi.nlm.nih.gov/25754210/',
  nausea: 'https://pubmed.ncbi.nlm.nih.gov/33098451/',
  glow: 'https://health.clevelandclinic.org/pregnancy-glow',
  cravings: 'https://www.nhs.uk/best-start-in-life/pregnancy/week-by-week-guide-to-pregnancy/1st-trimester/week-5/',
  ring: 'https://pubmed.ncbi.nlm.nih.gov/34607165/',
  calendar: 'https://pubmed.ncbi.nlm.nih.gov/20618730/',
  scan: 'https://www.nhs.uk/pregnancy/your-pregnancy-care/ultrasound-scans/'
};

const cite = (key, label) => `<a href="${sources[key]}" target="_blank" rel="noopener">${label}</a>`;

export function oldWivesTalesBody(){return `
<h2 id="quick-answer">Can old wives’ tales predict a baby’s gender?</h2>
<p><strong>Old wives’ tales gender prediction is a collection of folklore guesses, not a reliable way to establish a baby’s sex.</strong> Stories about cravings, bump shape, heartbeat and a swinging ring can be a lighthearted conversation starter. A matching guess does not make a story a dependable test.</p>
<p>This guide explains eight common tales, what the linked evidence can tell us, and how to use a blank printable sheet as a party game. The familiar phrase “gender prediction” refers here to boy/girl guesses about sex; these activities do not predict a child’s future gender identity.</p>

<div class="download-box" id="download">
  <h2>Free old wives’ tales gender reveal game</h2>
  <p>Print an eight-row record sheet and let guests make their own guesses. The observation spaces are optional. You can play without dates, heart-rate numbers, symptoms or any personal pregnancy information.</p>
  <div class="download-actions">
    <a class="button primary small" href="/downloads/old-wives-tales-game-a4.pdf" download>${icon('download-simple')}Download A4 game</a>
    <a class="button secondary small" href="/downloads/old-wives-tales-game-letter.pdf" download>${icon('download-simple')}Download US Letter game</a>
  </div>
  <p class="small-copy">Free for personal, noncommercial events. No account or email required. Choose the matching paper size and print at actual size or 100% scale.</p>
</div>
<figure class="game-preview">${previewPicture('old-wives-tales','Blank printable sheet for eight optional folklore guesses, with observation spaces and Boy, Girl or Surprise choices.')}<figcaption>The optional record sheet contains no symptom-to-sex rules or medical questionnaire.</figcaption></figure>

<h2 id="common-tales">Eight common pregnancy tales, with their limits</h2>
<p>Families may tell different versions of the same story. The table describes the idea rather than prescribing a boy/girl rule. None of these rows should be used to interpret a symptom or replace prenatal care.</p>
<div class="table-wrap" tabindex="0" role="region" aria-label="Eight old wives’ tales and the evidence">
<table class="month-table folklore-table">
  <caption>Folklore ideas and what the sources actually support</caption>
  <thead><tr><th scope="col">Tale</th><th scope="col">Common idea</th><th scope="col">Evidence and limits</th></tr></thead>
  <tbody>
    <tr><th scope="row">Food cravings</th><td>Sweet or salty preferences are treated as clues.</td><td>The NHS describes pregnancy cravings in relation to hormone-related changes in taste and smell. That explanation is not a boy/girl prediction rule. ${cite('cravings','NHS guide to week 5')}.</td></tr>
    <tr><th scope="row">Bump shape</th><td>Carrying high or low, or looking round or pointed, is assigned a guess.</td><td>A 1999 questionnaire study of 104 pregnant women found no systematic relationship between abdominal shape and fetal sex. It was a small study, not proof about every possible body measurement. ${cite('bump','Perry and colleagues, 1999')}.</td></tr>
    <tr><th scope="row">Heart rate</th><td>A faster or slower fetal heartbeat is said to indicate a boy or girl.</td><td>A study of 655 pregnancies found no significant difference between male and female fetal heart rates at 8-13 weeks. It does not support the usual first-trimester heartbeat guess. ${cite('heart','Bracero and colleagues, 2016')}.</td></tr>
    <tr><th scope="row">Morning sickness</th><td>The amount of nausea is read as a clue.</td><td>Some research finds a group-level association with fetal sex. This does not make nausea a reliable home test for one pregnancy. See the explanation below and ${cite('nausea','Young and colleagues, 2021')}.</td></tr>
    <tr><th scope="row">Skin changes</th><td>Pregnancy glow or acne is used to make a guess.</td><td>Cleveland Clinic explains that hormones and increased blood flow can affect skin during pregnancy. Its obstetrician’s explanation does not endorse glow or acne as a sex predictor. ${cite('glow','Cleveland Clinic, 2023')}.</td></tr>
    <tr><th scope="row">Hair changes</th><td>Thicker or different-looking hair is treated as a sign.</td><td>Hormone-related hair changes are described in the same Cleveland Clinic guide. A change in appearance is not an established prediction method. ${cite('glow','Read the explanation of hair changes')}.</td></tr>
    <tr><th scope="row">Ring swing</th><td>A ring on a string moves in a circle or a line, and a guess is assigned to the direction.</td><td>A 2021 motion-capture experiment showed how small finger movements can drive a hand-held pendulum. This was a movement study, not a fetal-sex study; it does not validate a ring prediction. ${cite('ring','Cantergi and colleagues, 2021')}.</td></tr>
    <tr><th scope="row">Chinese calendar</th><td>A traditional chart combines lunar age and lunar conception month.</td><td>A 2010 study of 2,840,755 singleton births found no predictive agreement beyond chance for the calendar method. ${cite('calendar','Villamor and colleagues, 2010')}. Our <a href="/accuracy/">calendar accuracy guide</a> also discusses a 2023 study.</td></tr>
  </tbody>
</table>
</div>

<h2 id="morning-sickness">Does more morning sickness mean a girl?</h2>
<p>It is too strong to say there is never an association. A retrospective survey of 4,320 pregnancies found somewhat more first-trimester nausea and vomiting on average with female fetuses. The 2021 paper, published online in 2020, relied on recalled self-reports and did not validate an individual prediction rule. ${cite('nausea','Read the original study abstract')}.</p>
<p><strong>An average difference between groups does not give an answer for one person.</strong> Having nausea, or having none, does not establish that someone is carrying a girl or boy. Questions about symptoms belong with the person’s maternity care team.</p>

<h2 id="tradition-and-evidence">A tradition, a tally and a test are different things</h2>
<p>A tradition tells you how a family or community plays a guessing game. A tally records those guesses. A reliable prediction method needs evidence showing how well it performs, including the times it is wrong. Eight folklore guesses do not become a validated result because most of them point the same way.</p>
<p>The Chinese chart has a repeatable lookup: convert dates, find the age row and month column, and read a cell. That makes its process explainable; it does not establish predictive accuracy. Our <a href="/how-it-works/">Chinese gender calendar method</a> names the chart version, lunar-age convention and leap-month rule. The <a href="/">Chinese gender predictor</a> shows the same calculation in your browser.</p>
<p>One party sheet can be a keepsake, but it cannot estimate an accuracy rate. Guests may share the same story or copy each other’s guess. Comparing the sheet with information the parents later choose to share is part of the game, not a medical study.</p>

<h2 id="how-to-play">How to play the printable guessing game</h2>
<p><strong>Players:</strong> any number, one sheet per guest or small group. <strong>Time:</strong> about 5 minutes. <strong>Materials:</strong> printed sheets and pens. No physical tests or medical information are needed.</p>
<ol>
  <li><strong>Let the parents set the boundaries.</strong> Decide whether this is a pre-announcement game or simply a conversation activity. Skip any subject they do not want discussed.</li>
  <li><strong>Make optional observations.</strong> Use only a detail the parents have already chosen to share, or leave that column blank. Do not ask guests to inspect someone’s body or report health information.</li>
  <li><strong>Write a guess.</strong> Each row can say Boy, Girl or Surprise. You may skip rows. The sheet deliberately has no printed symptom-to-sex rules or scoring formula.</li>
  <li><strong>Collect the sheets.</strong> If the parents share an announcement, guests can compare their guesses. An overall tally is only a tally of guesses; there is no need to name a winner.</li>
</ol>
<p>For the ring row, you can write a guess without using a ring. If a host uses a pendulum as a party prop, keep it above a clear table, away from anyone’s body. Do not suspend objects over a pregnant person or baby. For a game without pregnancy observations, try the <a href="/gender-reveal-games/">printable Bingo, word scramble and other party games</a>.</p>

<h2 id="questions">Questions about old wives’ tales</h2>
<h3>Which old wives’ tale is the most accurate?</h3>
<p>We cannot name a reliable winner from these stories. Evidence for one method does not establish the accuracy of another, and a match in a previous pregnancy does not validate a prediction for the next. This guide does not rank folklore by a made-up percentage.</p>
<h3>Can the ring test tell me my baby’s gender?</h3>
<p>We use it only as a folklore guess. The ${cite('ring','2021 pendulum experiment')} explains movement generated by the person holding the string; it did not test pregnancies or establish a ring’s ability to determine fetal sex. Circle-versus-line rules are game conventions, not test results.</p>
<h3>Can I use these guesses for a gender reveal announcement?</h3>
<p>Keep them as activities before or after the announcement. The announcement should use only information the parents have chosen to share, not a result from folklore or this website. The NHS explains that fetal sex may sometimes be visible during a mid-pregnancy scan, depending on hospital policy and the baby’s position, and that the sonographer cannot be 100% certain. ${cite('scan','Read the NHS ultrasound guidance')}.</p>
<h3>Can I play without sharing pregnancy details?</h3>
<p>Yes. Leave every observation space blank, write a few playful guesses, or choose Surprise. The PDF is a blank file, and the page has no symptom questionnaire. Anything you write on a printed copy stays on that copy.</p>

<h2 id="sources">Sources and editorial approach</h2>
<p>We compared the claims above with the linked research abstracts and official patient guidance. Each source has a limited scope: heartbeat findings do not validate bump shape, and a pendulum-motion experiment does not measure pregnancy outcomes. The printable is an original activity for entertainment, not a research instrument.</p>
<ul class="source-list">
  <li>${cite('bump','Perry DF, DiPietro J, Costigan K. Pregnancy folklore study')}. <em>Birth</em>, 1999;26(3):172-177. PMID 10655817.</li>
  <li>${cite('heart','Bracero LA and colleagues. First-trimester fetal heart rate study')}. <em>Journal of Maternal-Fetal &amp; Neonatal Medicine</em>, 2016;29(5):803-806. Published online in 2015. PMID 25754210.</li>
  <li>${cite('nausea','Young NR and colleagues. Retrospective nausea and vomiting study')}. <em>Archives of Gynecology and Obstetrics</em>, 2021;303(5):1161-1166. Published online in 2020. PMID 33098451.</li>
  <li>${cite('ring','Cantergi D, Awasthi B, Friedman J. Hand-held pendulum-motion experiment')}. <em>Human Movement Science</em>, 2021;80:102879. PMID 34607165.</li>
  <li>${cite('calendar','Villamor E and colleagues. Chinese lunar-calendar study')}. <em>Paediatric and Perinatal Epidemiology</em>, 2010;24(4):398-400. PMID 20618730.</li>
  <li>${cite('glow','Cleveland Clinic: Pregnancy glow')}, December 6, 2023. ${cite('cravings','NHS: Week 5 pregnancy guide')}. ${cite('scan','NHS: Ultrasound scans in pregnancy')}, last reviewed November 13, 2023.</li>
</ul>
<p class="updated">Sources checked October 9, 2026. This page has not been reviewed or endorsed by a medical professional. <a href="/about/">About the site and corrections</a> · <a href="/terms/">Printable use terms</a>.</p>
`;}
