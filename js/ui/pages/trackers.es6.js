const Parent = window.DDG.base.Page;
const mixins = require('./mixins/index.es6.js');

const TrackerListView = require('./../views/trackerlist-truncated.es6.js');
const TrackerListModel = require('./../models/trackerlist-top-blocked.es6.js');
const trackerListTemplate = require('./../templates/trackerlist-truncated.es6.js');

const SiteView = require('./../views/site.es6.js');
const SiteModel = require('./../models/site.es6.js');
const siteTemplate = require('./../templates/site.es6.js');

const SearchView = require('./../views/search.es6.js');
const SearchModel = require('./../models/search.es6.js');
const searchTemplate = require('./../templates/search.es6.js');

const LinkableView = require('./../views/linkable.es6.js');
const LinkableModel = require('./../models/linkable.es6.js');
const linkableTemplate = require('./../templates/linkable.es6.js');

const AutocompleteView = require('./../views/autocomplete.es6.js');
const AutocompleteModel = require('./../models/autocomplete.es6.js');
const autocompleteTemplate = require('./../templates/autocomplete.es6.js');

const backgroundPage = chrome.extension.getBackgroundPage();

/*
* Firefox doesn't let us redirect option page requests. Instead we can
* open the options page in a new tab (simlar to how chrome does it)
*
* LEGACY_V1 remove me later
*/
function openOptionsPage() {
    if (backgroundPage.browser === "moz") {
        return (() => chrome.tabs.create({url: backgroundPage.version.firefoxOptionPage}));
    }
    else {
        return chrome.runtime.openOptionsPage;
    }
}

const FailoverView = require('./../views/failover.es6.js');
const failoverTemplate = require('./../templates/failover.es6.js');

function Trackers (ops) {
    this.$parent = $('#trackers-container');
    Parent.call(this, ops);
};

Trackers.prototype = $.extend({},
    Parent.prototype,
    mixins.setBrowserClassOnBodyTag,
    {

        pageName: 'trackers',

        ready: function() {

            Parent.prototype.ready.call(this);

            // some browsers (Firefox) don't allow access to background
            // page in private browsing mode
            // if that's the case, exit here and render failover view
            if (!backgroundPage) return this.failover();

            this.setBrowserClassOnBodyTag();

            this.views.search = new SearchView({
                pageView: this,
                model: new SearchModel({searchText:''}), // TODO proper location of remembered query
                appendTo: this.$parent,
                template: searchTemplate
            });

            this.views.site = new SiteView({
                pageView: this,
                model: new SiteModel({
                    domain: '-',
                    isWhitelisted: false,
                    siteRating: 'B',
                    trackerCount: 0
                }),
                appendTo: this.$parent,
                template: siteTemplate
            });

            this.views.trackerlist = new TrackerListView({
                pageView: this,
                model: new TrackerListModel({ numCompanies: 4 }),
                appendTo: this.$parent,
                template: trackerListTemplate,
            });

            this.views.options = new LinkableView({
                pageView: this,
                model: new LinkableModel({
                    text: 'Settings',
                    id: 'options-link',
                    link: openOptionsPage(),
                    klass: 'link-secondary',
                    spanClass: 'icon icon__settings pull-right'
                }),
                appendTo: this.$parent,
                template: linkableTemplate
            });

            // TODO: hook up model query to actual ddg ac endpoint.
            // For now this is just here to demonstrate how to
            // listen to another component via model.set() +
            // store.subscribe()
            this.views.autocomplete = new AutocompleteView({
                pageView: this,
                model: new AutocompleteModel({suggestions: []}),
                // appendTo: this.views.search.$el,
                appendTo: null,
                template: autocompleteTemplate
            });

        },

        failover: function () {
            this.views.failover = new FailoverView({
                appendTo: this.$parent,
                template: failoverTemplate,
                message: `We cannot display this info in private browsing mode`
            })
        }
    }
);

// kickoff!
window.DDG = window.DDG || {};
window.DDG.page = new Trackers();
