// ==UserScript==
// @name         Iwara Hydrus
// @namespace    https://twitter.com/goawaynowgan
// @version      1624211422
// @description  Send Iwara stuff to Hydrus Network
// @author       Ganbat
// @match        https://ecchi.iwara.tv/videos/*
// @icon         https://www.google.com/s2/favicons?domain=iwara.tv
// @updateURL    https://github.com/GoAwayNow/Iwara-Hydrus/raw/master/iwarahydrus.user.js
// @downloadURL  https://github.com/GoAwayNow/Iwara-Hydrus/raw/master/iwarahydrus.user.js
// @supportURL   https://github.com/GoAwayNow/Iwara-Hydrus/issues
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

const hydruslogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAAAAABWESUoAAABvklEQVQ4y31TPWsVQRQ9Z3bebBAl8lr1RbOQIlYKFjYq+g9shBSSWFj4A/wBdpZiZaNoGgvbkGAlaQJiYcD2NZtCLIJV0P2aY7FfM8/oFMvOncO55957LvdmJfGvI5fbWRYBhOjmYMuyCEKcoPIhvLQkzXC1Rx9wf6UeWDxpo5T26LluZFWYxcaiONGCZNvGFaTtPxR7AEUoeAcAouUyLYMXwYGcBOVbWgtASPLXP7W+mXZCirffON26UqtnQDNd2dneGdTXu9u7l6cN+hSkX966g6VReopbm8ueHKuocX7UBwjnGt9W0XeRJgRgVGzakv46ZBc2p495/A1S+D5M38BxAWDO4qToOs7yBNNEEUB2hh/HRu2Mj78jSxYY/PUL+eeJESDjvuRr15oYwGp9Ay/3mBIOH1/g0WrVFdr5gbJPmneP77pCb17t22cP+2mDh1lhIFBJdbg/zw90c3Xt9lV6CoRP5y0AAkWn5NMDvb9XowQFAj6d29Ft+u3PJEDS/DLkYH8zdFaggQjBMFgPO1qscyIYDSd2NVVJp7h6eK8vPsWlOhouv2bR6lnW4eqlc+tcvK6YRMvrbI7/r/8f1R6rKq2yFyMAAAAASUVORK5CYII='

GM_config.init(
{
    'id': 'HydrusConf', // The id used for this instance of GM_config
    'title': 'Hydrus Configuration',
    'fields': // Fields object
    {
        'HyURL': // This is the id of the field
        {
            'label': 'API URL', // Appears next to field
            'type': 'text', // Makes this setting a text field
            'default': 'http://127.0.0.1:45869/' // Default value if user doesn't change it
        },
        'HyKey':
        {
            'label': 'API Key',
            'type': 'text',
            'default': ''
        },
        'HyTagService':
        {
            'label': 'Tag Service',
            'type': 'text',
            'default': 'my tags'
        },
        'HyPageName':
        {
            'label': 'Destination Page Name',
            'type': 'text',
            'default': 'Iwara'
        },
        'HyCatTags':
        {
            'label': 'Add categories as unnamespaced tags', // Appears next to field
            'type': 'checkbox', // Makes this setting a checkbox input
            'default': false // Default value if user doesn't change it
        },
        'HyRequestKey':
        {
            'label': 'Request API Key', // Appears on the button
            'type': 'button', // Makes this setting a button input
            'size': 100, // Control the size of the button (default is 25)
            'click': function() { // Function to call when button is clicked
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: GM_config.get("HyURL")+'request_new_permissions?name=Hydrus%20Iwara&basic_permissions=[0,2]',
                    onload: function(response){
                        if (response.status == 200){
                            GM_config.set('HyKey', JSON.parse(response.responseText).access_key);
                        } else if (response.responseText.startsWith("The permission registration")){
                            alert(response.responseText);
                        } else {
                            alert('Abnormal or no response from Hydrus. Is your client running?');
                            console.log(response.responseText);
                        }
                    }
                });
            }
        }
    },
    'css': `
        #HydrusConf .config_info {
            font-size: 12px;
            font-weight: bold;
            margin: 0px 0px 4px 16px;
        }
        #HydrusConf .config_info p {
            margin: 0px;
        }
    `
});

GM_config.onOpen = function(document, window, frame){
    var hyConfWrapper = document.querySelector("#HydrusConf_wrapper")
    var hyKeyInfo = document.createElement('div');
    hyKeyInfo.innerHTML = '<p>Requires Add Tags and Add URLs permissions.</p>';
    hyKeyInfo.setAttribute('class', 'config_info');
    hyConfWrapper.insertBefore(hyKeyInfo, hyConfWrapper.childNodes[3]);
}

var pathsArray = window.location.pathname.split('/');
var siteBody = document.getElementsByTagName("BODY")[0]
var siteHeader = document.querySelector("#wrapper > header")
var siteButtons = document.querySelector("div.content > div.node-buttons")
var vidTitle = document.querySelector("div.content > div.node-info > div.submitted > h1").textContent
var vidAuthor = document.querySelector("div.content > div.node-info > div.submitted > a").textContent
var hydrusSendSuccess = false

//TODO: Either generate tag array in a function later or make an onSave function to regenerate it.
var hydrusSend = {destination_page_name: GM_config.get("HyPageName")};
hydrusSend.service_names_to_additional_tags = {[GM_config.get("HyTagService")]: []};
hydrusSend.service_names_to_additional_tags[GM_config.get("HyTagService")][0] = 'title:'+vidTitle
hydrusSend.service_names_to_additional_tags[GM_config.get("HyTagService")][1] = 'creator:'+vidAuthor

if (GM_config.get("HyCatTags")){
    var vidCategories = document.querySelector("div.field-name-field-categories").getElementsByClassName("field-item");
    var indexVidCat
    for (indexVidCat = 0; indexVidCat < vidCategories.length; indexVidCat++){
        if (vidCategories[indexVidCat].innerText == "Other" || vidCategories[indexVidCat].innerText == "Uncategorized") continue;
        hydrusSend.service_names_to_additional_tags[GM_config.get("HyTagService")].push(vidCategories[indexVidCat].innerText);
    }
}
console.log(JSON.stringify(hydrusSend));

var configButton = document.createElement('a');
configButton.innerHTML = '<img src="'+hydruslogo+'">';
configButton.setAttribute('href', '#');
configButton.setAttribute('id', 'HydConfIcon');
configButton.addEventListener("click", function(e){
    e.preventDefault()
    GM_config.open();
}, false);
siteHeader.insertBefore(configButton, siteHeader.childNodes[0]);

var hydrusButton = document.createElement('a');
hydrusButton.setAttribute('href', '#');
hydrusButton.setAttribute('class', 'btn btn-primary');
hydrusButton.setAttribute('id', 'hydrus-button');
hydrusButton.innerHTML = '<span class="glyphicon hydrusicon"></span> Send to Hydrus';

//I would test URLs before this to prevent accidental second downloads,
//but that's unfortunately impossible for now. File urls change with each
//request and post page urls can only be added after for the file to
//finish importing, which isn't something that's feasible.
//If an option to associate other urls is ever added to the add_url endpoint,
//I will be all over that shit.

GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://ecchi.iwara.tv/api/video/'+pathsArray[2],
    onload: function(response){
        if (response.status == 200){
            if (response.responseText == '[]'){
                //console.log('skip youtube');
                return;
            }
            var iwaAPIJSON = JSON.parse(response.responseText);
            hydrusSend.url = 'https:'+iwaAPIJSON[0].uri;
            hydrusButton.addEventListener("click", function(e){
                e.preventDefault()
                if (!hydrusSendSuccess){
                    hydrusAPITest(hydrusSend);
                }
            }, false);
            siteButtons.appendChild(hydrusButton);
        } else {
            alert('Iwara API could not be contacted. Refresh and try again.');
            return;
        }
        //console.log(JSON.stringify(hydrusSend));
        //console.log(iwaAPIJSON);
        //console.log(response.status);
    }
});

function hydrusAPITest(payload){
    if (!GM_config.get("HyKey")){
        alert('Hydrus API Key missing! Please set the API key in the options dialogue.');
        return;
    }
    GM_xmlhttpRequest({
        method: 'GET',
        url: GM_config.get("HyURL")+'verify_access_key',
        headers: {
            "Hydrus-Client-API-Access-Key": GM_config.get("HyKey")
        },
        onload: function(response){
            if (response.status == 200){
                var hyVerif = JSON.parse(response.responseText);
                //var apiSucText = document.querySelector("#apiSuccessText")
                console.log(hyVerif.human_description);
                if (hyVerif.basic_permissions.includes(0) && hyVerif.basic_permissions.includes(2)){
                    //console.log(JSON.stringify(payload));
                    hydrusAPISend(payload)
                } else {
                    alert('API Key does not provide necessary permissions. See configuration panel for more info.');
                    return;
                }
            } else if (response.status == 401||response.status == 403||response.status == 419){
                alert(response.responseText);
                return;
            } else {
                alert('An error has occurred. Ensure your API key is correct and your client is running.');
                return;
            }
        }
    });
}

function hydrusAPISend(payload){
    GM_xmlhttpRequest({
        method: 'POST',
        url: GM_config.get("HyURL")+'add_urls/add_url',
        data: JSON.stringify(payload),
        headers: {
            "Hydrus-Client-API-Access-Key": GM_config.get("HyKey"),
            "Content-Type" : "application/json"
        },
        onload: function(response){
            if (response.status == 200 && JSON.parse(response.responseText).human_result_text.includes("successfully")){
                //actions taken upon success
                hydrusSendSuccess = true
                hydrusButton.style.backgroundColor = "grey";
                hydrusButton.innerHTML = '<span class="glyphicon hydrusicon"></span> URL Added Successfully';
            } else {
                console.error(response.responseText);
                alert('Failed to add url to Hydrus. Full response has been printed to the console.');
            }
        }
    });
}

GM_addStyle ( `
    #HydConfIcon {
        float:left;
        padding:6px;
    }
    .hydrusicon {
        font-family:cambria,caladea,helvetica,calibri;
        font-size: 17px;
        top: -1px;
    }
    .hydrusicon:before {
        content:'\\03C8';
    }
` );
