let currentUrl = window.location.href;

const observer = new MutationObserver(() => {
  if (currentUrl !== window.location.href) {
    currentUrl = window.location.href;
    console.log("URL changed:", currentUrl);

    handleYouTubePage();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

function handleYouTubePage() {
  const videoTitleElement = document.querySelector('meta[name="title"]');
  const creatorNameElement = document.querySelector('ytd-channel-name a');

  if (!videoTitleElement || !creatorNameElement) {
    console.log("Metadata not yet available.");
    return;
  }

  const videoTitle = videoTitleElement.content;
  const creatorName = creatorNameElement.textContent.trim();

  console.log("Video Title:", videoTitle, "Creator Name:", creatorName);

  checkNebulaCreator(creatorName).then((exists) => {
    if (exists) {
      const nebulaUrl = generateNebulaUrl(creatorName, videoTitle);
      console.log("Nebula URL:", nebulaUrl);

      browser.runtime.sendMessage({ type: "notify", url: nebulaUrl });
    }
  });
}

async function checkNebulaCreator(creator) {
  const nebulaCreatorUrl = `https://nebula.tv/${creator}`;
  try {
    const response = await fetch(nebulaCreatorUrl, { method: 'HEAD' });
    return response.ok;
  } catch (err) {
    console.error('Error checking Nebula:', err);
    return false;
  }
}

function generateNebulaUrl(creator, title) {
  const sanitizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return `https://nebula.tv/videos/${creator}-${sanitizedTitle}`;
}

handleYouTubePage();

// for debugging
console.log("Nebula Checker content script loaded.");
