# Iwara-Hydrus
A userscript to simplify sending Iwara videos to Hydrus Network.  
Made using Tampermonkey v4.13.

## Installation
1. Install a userscript manager if you don't have one.  
[Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) for Chromium-based browsers.  
[Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) for Firefox (untested).
2. [Click here to install](https://github.com/GoAwayNow/Iwara-Hydrus/raw/main/iwarahydrus.user.js) this userscript.

## Configuration
This userscript uses [GM_config](https://github.com/sizzlemctwizzle/GM_config/) to make configuration simple and easy.  
After installing the script, go to any Iwara video page. On the left edge of the header, you will now see the Hydrus Network logo. Click this to open the configuration dialogue.  
All options other than API key will have default values. If any of these are incorrect for your system, be sure to update them.  
If you have created an API key yourself, you can paste it into the labeled box. If not, the script can request one for you.

1. In your client, open the "Review Services" dialogue and select the "Client API" tab.
2. At the bottom, click "Add" and select "from api request".
3. In the script's settings dialogue, click "Request API Key".

If everything worked, the API key will appear in the appropriate field automatically. Save the new settings in the script and in your client and you should be ready to go.

If you toggle the "Add categories as unnamespaced tags" option, the page will need to be reloaded in order to update the tags.

## Use
Once the script is configured, all you have to do is click the new "Send to Hydrus" button, which appears directly next to the download button. If everything works, the button will update to let you know that the URL was successfully sent to your client.

__Note:__ The script does not work with embedded Youtube videos. Configuration is still available from these pages, but no other functions will work.
