'use strict';

function SearchField(element) {
    this.elem = $(element);
    this.inputElem = this.elem.find('.search-field');
    this.inputElem.on('focus', this.handleFocusIn.bind(this));
    this.inputElem.on('blur', this.handleFocusOut.bind(this));
    this.inputElem.on('input', this.handleInput.bind(this));
    this.results = [];

    this.resultElem = this.elem.find('.search-results');
    this.state = this.STATE.DEFAULT;
}

SearchField.prototype = {
    STATE: {
        DEFAULT: 'state-default',
        SEARCH: 'state-search',
        NOT_FOUND: 'state-not-found',
        RESULTS: 'state-results'
    },
    set state(value) {
        this.elem.addClass(value);
        this.elem.removeClass(this._state);
        this._state = value;
        if (value === this.STATE.SEARCH) {
            stats.searchUsers(this.value, { limit: 7 }).then(function (data) {
                if (data && data.length) {
                    this.results = data;
                    this.state = this.STATE.RESULTS;
                }
                else {
                    this.results = [];
                    this.state = this.STATE.NOT_FOUND;
                }
            }.bind(this))
        }
        else if (value === this.STATE.RESULTS) {
            this.renderResults();
        }

    },
    get state() {
        return this._state;
    },

    set value(newValue) {
        this.inputElem.val(newValue)
    },

    get value() {
        return this.inputElem.val()
    },

    handleFocusIn: function () {
        // this.state = this.STATE.RESULTS
    },

    handleFocusOut: function () {
        this.state = this.STATE.DEFAULT
    },

    handleInput: function () {
        this.state = this.STATE.SEARCH
    },

    renderResults: function() {
        var resultsHtml = this.results.map(function (user) {
            return '<li class="result-item">' + user.nickname + '</li>'
        })
        this.resultElem.append(resultsHtml);
    },
};