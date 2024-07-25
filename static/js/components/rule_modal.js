// *** rule_modal.js *** //
const ruleModal = document.getElementById("rule-modal");
const ruleBtn1 = document.getElementById("rule-step-1");
const ruleBtn2 = document.getElementById("rule-step-2");
const ruleBtn3 = document.getElementById("rule-step-3");
const ruleBtn4 = document.getElementById("rule-step-4");

const rule_content1 = document.getElementById("rule-content1");
const rule_content2 = document.getElementById("rule-content2");
const rule_content3 = document.getElementById("rule-content3");
const rule_content4 = document.getElementById("rule-content4");

ruleBtn1.onclick = function () {
    rule_content1.style.display = 'none';
    rule_content2.style.display = 'flex';
}

ruleBtn2.onclick = function () {
    rule_content2.style.display = 'none';
    rule_content3.style.display = 'flex';
}

ruleBtn3.onclick = function () {
    rule_content3.style.display = 'none';
    rule_content4.style.display = 'flex';
}

ruleBtn4.onclick = function () {
    rule_content4.style.display = 'none';
    ruleModal.style.display = 'none';
    document.getElementById('character-card').style.display = 'flex';
}

