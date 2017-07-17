const Parent = window.DDG.base.Model
const backgroundPage = chrome.extension.getBackgroundPage()

function Whitelist (attrs) {
  this.setWhitelistFromSettings()
  Parent.call(this, attrs)
}

Whitelist.prototype = $.extend({},
  Parent.prototype,
  {

    modelName: 'whitelist',

    removeDomain (itemIndex) {
      var domain = this.list[itemIndex]
      console.log(`whitelist: remove ${domain}`)

      backgroundPage.tabManager.whitelistDomain({
        list: 'whitelisted',
        domain: domain,
        value: false
      })

      this.setWhitelistFromSettings()
    },

    setWhitelistFromSettings: function () {
      var wlist = backgroundPage.settings.getSetting('whitelisted') || {}
      this.list = Object.keys(wlist)
      this.list.sort()
    }

  }
)

module.exports = Whitelist
