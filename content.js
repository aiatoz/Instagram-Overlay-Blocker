let targetSelector = '.x1n2onr6.xzkaem6'; // Fallback base rule
let isEnabled = true;
let observing = false;

function scanAndIntercept() {
    if (!isEnabled || !targetSelector) return;

    try {
        document.querySelectorAll(targetSelector).forEach(element => element.remove());
    } catch (selectorParsingError) {
        console.error("Invalid target selector:", targetSelector);
    }

    // Force scrolling back on
    if (document.body) {
        document.body.style.setProperty('overflow', 'unset', 'important');
        document.documentElement.style.setProperty('overflow', 'unset', 'important');
    }
}

const structuralObserver = new MutationObserver(() => scanAndIntercept());

function startBlocking() {
    if (observing) return;
    const begin = () => {
        structuralObserver.observe(document.body, { childList: true, subtree: true });
        observing = true;
        scanAndIntercept();
    };
    if (document.body) {
        begin();
    } else {
        const bodyWaiter = new MutationObserver(() => {
            if (document.body) {
                bodyWaiter.disconnect();
                if (isEnabled) begin();
            }
        });
        bodyWaiter.observe(document.documentElement, { childList: true });
    }
}

function stopBlocking() {
    structuralObserver.disconnect();
    observing = false;
    // Hand scroll control back to Instagram
    if (document.body) document.body.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('overflow');
}

// Initial load
chrome.storage.local.get(['targetSelector', 'enabled'], (config) => {
    if (config.targetSelector) targetSelector = config.targetSelector;
    isEnabled = config.enabled !== false; // on by default
    if (isEnabled) startBlocking();
});

// React instantly when the popup toggle or selector changes
chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes.targetSelector) {
        targetSelector = changes.targetSelector.newValue || '';
        scanAndIntercept();
    }
    if (changes.enabled) {
        isEnabled = changes.enabled.newValue !== false;
        isEnabled ? startBlocking() : stopBlocking();
    }
});
