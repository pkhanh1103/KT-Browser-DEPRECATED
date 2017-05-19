var recognizer = new webkitSpeechRecognition();
recognizer.lang = "vi";

recognizer.continuous = false;

recognizer.onstart = function () {
    getSelectedTab().instance.bar.micBtn.html('<i3 id="micicon" class="material-icons" style="font-size: 18px;">mic</i3>')
};

recognizer.onerror = function (event) {
    alert(event.error)
    getSelectedTab().instance.bar.micBtn.html('<i3 id="micicon" class="material-icons" style="font-size: 18px;">settings_voice</i3>')
};

recognizer.onresult = function (event) {
    if (event.results.length > 0) {
        var result = event.results[event.results.length - 1];
        if (result.isFinal) {
            getSelectedTab().instance.bar.searchInput.val(result[0].transcript);
            getSelectedTab().instance.bar.micBtn.html('<i3 id="micicon" class="material-icons" style="font-size: 18px;">mic_none</i3>')
            getSelectedTab().instance.bar.searchInput.trigger({
                type: 'keypress',
                which: 13,
                keyCode: 13
            })
        }
    }

    recognizer.onend = function () {
        getSelectedTab().instance.bar.micBtn.html('<i3 id="micicon" class="material-icons" style="font-size: 18px;">mic_none</i3>')
    };
};