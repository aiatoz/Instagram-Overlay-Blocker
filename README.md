# Instagram-Overlay-Blocker
This is a browser extension designed for chromium based browsers, and it will remove Instagram popup overlay and enables seamless scrolling

How to use it :

1. Open Google Chrome/Brave and type chrome://extensions/ into the URL bar
2. Turn on Developer mode using the toggle switch in the top right hand corner
3. Click the Load unpacked button
4. Select the Instagram-Overlay-Blocker folder

An alternate way would be, enabling dev mode on the corresponding tab and pasting this and run it on console itself.

    (function() {
        console.log("Instagram Anti-Popup Interceptor Active.");
    
        // Function to kill the element and force-unlock scrolling
        function nukeOverlay() {
            const overlays = document.querySelectorAll('.x1n2onr6.xzkaem6');
            if (overlays.length > 0) {
                overlays.forEach(el => el.remove());
            }
            // Permanently force the document to allow scrolling
            if (document.body.style.overflow !== 'unset' || document.documentElement.style.overflow !== 'unset') {
                document.body.style.setProperty('overflow', 'unset', 'important');
                document.documentElement.style.setProperty('overflow', 'unset', 'important');
            }
        }
    
        // Create an observer instance to watch the HTML DOM body for changes
        const observer = new MutationObserver((mutations) => {
            nukeOverlay();
        });
    
        // Start observing the page for any added elements
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    
        // Run once immediately on injection
        nukeOverlay();
    })();
