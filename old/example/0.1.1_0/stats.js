(function() {
  var Site, unlinked;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  this.visitsHash = {};
  unlinked = {};
  this.MAX = 2147483647;
  Site = (function() {
    function Site(hItem, nodeName) {
      this.nodeName = nodeName;
      this.id = hItem.id;
      this.items = [hItem];
      this.visitsArr = [];
      this.linked = false;
    }
    Site.prototype.hasLink = function() {
      return this.linked = true;
    };
    Site.prototype.addItem = function(item) {
      return this.items.push(item);
    };
    Site.prototype.updateVisits = function(callback) {
      return this.items.forEach(__bind(function(item, i) {
        return chrome.history.getVisits({
          url: item.url
        }, __bind(function(visits) {
          visits.forEach(_.bind(this.addVisit, this));
          if (i === this.items.length - 1) {
            return callback();
          }
        }, this));
      }, this));
    };
    Site.prototype.addVisit = function(visit) {
      visitsHash[visit.visitId] = this;
      return this.visitsArr.push(visit);
    };
    Site.prototype.getPageViews = function() {
      return this.items.length;
    };
    Site.prototype.getVisits = function() {
      return this.visitsArr;
    };
    Site.prototype.visualize = function() {
      if (this.daysByYr != null) {
        return this.daysByYr;
      }
      this.daysByYr = {};
      this.visitsArr.forEach(__bind(function(v) {
        var d, yr, _base, _ref;
        d = new Date(v.visitTime);
        yr = d.getFullYear();
        return ((_ref = (_base = this.daysByYr)[yr]) != null ? _ref : _base[yr] = []).push(Utils.dayOnYear(d));
      }, this));
      return this.daysByYr;
    };
    return Site;
  })();
  this.Stats = (function() {
    function Stats(config, callback) {
      this.callback = callback;
      this.data = {
        pageViews: null,
        sites: 0,
        pagesPerSite: null,
        searchQueries: null,
        bounceRate: null
      };
      this.sites = {};
      this.search(config);
    }
    Stats.prototype.search = function(config) {
      this.settings = {
        text: '',
        startTime: config.startTime,
        endTime: config.endTime,
        maxResults: MAX
      };
      return chrome.history.search(this.settings, __bind(function(res) {
        return this.analyze(res);
      }, this));
    };
    Stats.prototype.analyze = function(historyItems) {
      this.data.pageViews = historyItems.length;
      historyItems.forEach(__bind(function(item) {
        this.updateSites(item);
        this.updateSearch(item);
        return this.updateMisc(item);
      }, this));
      return this.callback(this);
    };
    Stats.prototype.updateSites = function(item) {
      var host, pagePath, _ref;
      _ref = Utils.parseUrl(item.url), host = _ref.hostName, pagePath = _ref.path;
      if (this.sites[host] != null) {
        return this.sites[host].addItem(item);
      } else {
        this.data.sites++;
        return this.sites[host] = new Site(item, host);
      }
    };
    Stats.prototype.updateSearch = function(item) {
      if (/^https?:\/\/(www\.)?(google|yahoo|bing)/.test(item.url)) {
        return this.data.searchQueries++;
      }
    };
    Stats.prototype.updateMisc = function(item) {};
    Stats.prototype.relations = function(callback) {
      var ct, links, sitesArr;
      sitesArr = [];
      links = [];
      ct = 0;
      return _.each(this.sites, __bind(function(site) {
        site.index = (sitesArr.push(site)) - 1;
        return site.updateVisits(__bind(function() {
          ct++;
          site.getVisits().forEach(__bind(function(visit, i, arr) {
            var ref, refId;
            refId = visit.referringVisitId;
            ref = visitsHash[refId];
            if ((ref != null) && ref !== site) {
              ref.hasLink();
              site.hasLink();
              return links.push({
                source: ref,
                target: site
              });
            } else if (ref !== site) {
              if (unlinked[refId]) {
                return unlinked[refId].push(site);
              } else {
                return unlinked[refId] = [site];
              }
            }
          }, this));
          if (ct === this.data.sites) {
            return this.jitNormalize(unlinked, sitesArr, links, callback);
          }
        }, this));
      }, this));
    };
    Stats.prototype.jitNormalize = function(unlinked, sites, links, callback) {
      var cache, retSites;
      _.each(unlinked, function(unlinks, id) {
        if (visitsHash[id] != null) {
          visitsHash[id].hasLink();
          return unlinks.forEach(function(link) {
            link.hasLink();
            return links.push({
              source: visitsHash[id],
              target: link
            });
          });
        }
      });
      retSites = [];
      sites.forEach(function(site) {
        if (site.linked) {
          return site.index = retSites.push(site) - 1;
        }
      });
      cache = {};
      links = links.filter(function(link) {
        var cached;
        link.source = link.source.index;
        link.target = link.target.index;
        link.value = 1;
        cached = cache[link.source + ',' + link.target];
        if (cached) {
          cached.value++;
          return false;
        } else {
          cache[link.source + ',' + link.target] = link;
          return true;
        }
      });
      return callback({
        nodes: retSites,
        links: links
      });
    };
    return Stats;
  })();
}).call(this);
