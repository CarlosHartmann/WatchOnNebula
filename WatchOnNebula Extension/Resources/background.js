browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "notify") {
    const nebulaUrl = message.url;

    // Show a browser notification
    browser.notifications.create({
      type: "basic",
      iconUrl: "icons/icon-128.png",
      title: "Nebula Checker",
      message: "The creator exists on Nebula! Click to visit.",
    });

    // Add a click event to open the Nebula URL
    browser.notifications.onClicked.addListener(() => {
      browser.tabs.create({ url: nebulaUrl });
    });
  }
});
