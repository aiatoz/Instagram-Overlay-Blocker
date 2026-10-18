const toggle = document.getElementById('enabledToggle');
const toggleLabel = document.getElementById('toggleLabel');
const status = document.getElementById('status');

function renderToggle(on) {
  toggle.checked = on;
  toggleLabel.innerText = on ? 'Blocker is ON' : 'Blocker is OFF';
  toggleLabel.className = on ? 'on' : 'off';
}

function flash(msg) {
  status.innerText = msg;
  setTimeout(() => { status.innerText = ''; }, 2500);
}

// Load saved settings
chrome.storage.local.get(['targetSelector', 'enabled'], (result) => {
  if (result.targetSelector) {
    document.getElementById('classInput').value = result.targetSelector;
  }
  renderToggle(result.enabled !== false);
});

// On/off switch
toggle.addEventListener('change', () => {
  const on = toggle.checked;
  chrome.storage.local.set({ enabled: on }, () => {
    renderToggle(on);
    flash(on ? 'Blocking resumed.' : 'Paused. Reload page to restore removed pop-ups.');
  });
});

// Save selector
document.getElementById('saveBtn').addEventListener('click', () => {
  const newSelector = document.getElementById('classInput').value.trim();
  chrome.storage.local.set({ targetSelector: newSelector }, () => {
    flash('Configuration Saved!');
  });
});
