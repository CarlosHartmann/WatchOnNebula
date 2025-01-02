browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "notify") {
    console.log("Nebula URL detected:", message.url);

    // Display a notification (optional)
    browser.notifications.create({
      type: "basic",
      title: "Nebula Checker",
      message: `The creator is on Nebula!`,
      iconUrl: "icons/icon-128.png"
    });

    // Optionally open the Nebula URL
    browser.tabs.create({ url: message.url });
  }
});
