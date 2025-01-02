// Debugging to confirm script load
console.log("[Nebula Checker]: Content script loaded.");

// Track the current URL
let currentUrl = window.location.href;

// Handle YouTube page logic
function handleYouTubePage() {
  // Extract video title from document title
  const videoTitle = document.title.replace(" - YouTube", "").trim();
  const creatorNameElement = document.querySelector('ytd-channel-name a');

  if (!creatorNameElement) {
    console.log("[Nebula Checker]: Creator name not yet available. Retrying...");
    setTimeout(handleYouTubePage, 500); // Retry after a delay
    return;
  }

  const creatorName = creatorNameElement.textContent.trim();

  console.log("[Nebula Checker]: Video Title:", videoTitle, "Creator Name:", creatorName);

  // Check if the creator exists on Nebula
  checkNebulaCreator(creatorName).then((exists) => {
    if (exists) {
      const nebulaUrl = generateNebulaUrl(creatorName, videoTitle);
      console.log("[Nebula Checker]: Nebula URL:", nebulaUrl);

      // Notify the background script
      browser.runtime.sendMessage({ type: "notify", url: nebulaUrl });
    } else {
      console.log("[Nebula Checker]: Creator not found on Nebula:", creatorName);
    }
  });
}

// MutationObserver to watch for changes in the video title and creator
function monitorMetadataChanges() {
  const titleElement = document.querySelector('h1.title yt-formatted-string') || document.querySelector('meta[name="title"]');
  const creatorElement = document.querySelector('ytd-channel-name a');

  if (!titleElement || !creatorElement) {
    console.log("[Nebula Checker]: Title or creator not found. Retrying...");
    setTimeout(monitorMetadataChanges, 500); // Retry after a delay
    return;
  }

  const observer = new MutationObserver(() => {
    if (currentUrl !== window.location.href) {
      console.log("[Nebula Checker]: URL changed. Waiting for DOM updates...");
      currentUrl = window.location.href; // Update the current URL
      handleYouTubePage(); // Trigger detection
    }
  });

  // Observe both the title and creator elements
  observer.observe(titleElement, { childList: true, subtree: true });
  observer.observe(creatorElement, { childList: true, subtree: true });

  console.log("[Nebula Checker]: Monitoring metadata changes.");
}

// Check if a creator exists on Nebula
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

// Initialize the script: handle the first load and set up monitoring
console.log("[Nebula Checker]: Initializing...");
handleYouTubePage(); // Handle the initial load
monitorMetadataChanges(); // Start monitoring metadata changes
