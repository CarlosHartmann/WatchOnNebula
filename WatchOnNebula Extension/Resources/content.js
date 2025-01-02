// Debugging to confirm script load
console.log("[Nebula Checker]: Content script loaded.");

// Track the current URL
let currentUrl = window.location.href;

// Observe changes to the DOM to detect URL changes
const observer = new MutationObserver(() => {
  if (currentUrl !== window.location.href) {
    currentUrl = window.location.href;
    console.log("[Nebula Checker]: URL changed:", currentUrl);

    // Re-run the page handling logic
    handleYouTubePage();
  }
});

// Start observing the DOM
observer.observe(document.body, { childList: true, subtree: true });

// Handle YouTube page logic
let currentUrl = window.location.href;

function handleYouTubePage() {
  // Wait for DOM updates to ensure new values are loaded
  setTimeout(() => {
    const videoTitleElement = document.querySelector('meta[name="title"]');
    const creatorNameElement = document.querySelector('ytd-channel-name a');

    if (!videoTitleElement || !creatorNameElement) {
      console.log("[Nebula Checker]: Metadata not yet available. Retrying...");
      setTimeout(handleYouTubePage, 500); // Retry after a delay
      return;
    }

    const videoTitle = videoTitleElement.content;
    const creatorName = creatorNameElement.textContent.trim();

    console.log("[Nebula Checker]: Video Title:", videoTitle, "Creator Name:", creatorName);

    // Check if the creator exists on Nebula
    checkNebulaCreator(creatorName).then((exists) => {
      if (exists) {
        const nebulaUrl = generateNebulaUrl(creatorName, videoTitle);
        console.log("[Nebula Checker]: Nebula URL:", nebulaUrl);

        // Notify the background script
        browser.runtime.sendMessage({ type: "notify", url: nebulaUrl });
      }
    });
  }, 1000); // Initial delay to ensure DOM updates
}


// Observe DOM changes to detect URL changes and trigger handleYouTubePage
const observer = new MutationObserver(() => {
  if (currentUrl !== window.location.href) {
    currentUrl = window.location.href; // Update tracked URL
    console.log("[Nebula Checker]: URL changed. Running handleYouTubePage...");
    handleYouTubePage(); // Trigger detection
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial detection on page load
handleYouTubePage();

// Debugging to confirm script load
console.log("[Nebula Checker]: Content script loaded.");



// Check if a creator exists on Nebula
// Now using iframe
async function checkNebulaCreator(creator) {
  const normalizedCreator = creator.toLowerCase().replace(/\s+/g, ''); // Normalize creator name

  try {
    const response = await fetch(browser.runtime.getURL('nebula_creators.txt'));
    const creatorsList = await response.text();
    const creatorsArray = creatorsList.split('\n').map((line) => line.trim().toLowerCase().replace(/\s+/g, ''));

    if (creatorsArray.includes(normalizedCreator)) {
      console.log("[Nebula Checker]: Creator exists on Nebula:", creator);
      return true; // Creator exists
    } else {
      console.log("[Nebula Checker]: Creator not found on Nebula:", creator);
      return false; // Creator does not exist
    }
  } catch (err) {
    console.error("[Nebula Checker]: Error reading nebula_creators.txt:", err);
    return false; // Assume creator does not exist on error
  }
}



// Generate the Nebula video URL
function generateNebulaUrl(creator, title) {
  const sanitizedCreator = creator.toLowerCase().replace(/\s+/g, ''); // Remove spaces and lowercase
  const sanitizedTitle = title
    .toLowerCase() // Convert title to lowercase
    .replace(/-/g, '') // Remove existing hyphens
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-'); // Replace spaces with hyphens

  return `https://nebula.tv/videos/${sanitizedCreator}-${sanitizedTitle}`;
}

// Initial run for the current page
handleYouTubePage();


