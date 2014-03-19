(function() {
  'backbone.fetchmanager.js\nCopyright 2014, Justin Perler (@jperler)\nbackbone.fetchmanager.js may be freely distributed under the MIT license.';
  var _configure;

  (function(Backbone) {
    return _.extend(Backbone.Layout.prototype, {
      fetchObjects: function() {
        var deferred, getPromises, instance_collections;
        deferred = new $.Deferred().resolve();
        instance_collections = this.buildInstanceCollections();
        this.addReferences();
        if (!instance_collections.length) {
          return deferred;
        }
        getPromises = function(instances) {
          return _.map(instances, function(instance) {
            return instance.fetch();
          });
        };
        _.each(instance_collections, function(instances) {
          return deferred = deferred.then(function() {
            return $.when.apply($, getPromises(instances));
          });
        });
        return deferred;
      },
      getObjects: function() {
        return _.extend({}, this.objects, this.options.objects);
      },
      addReferences: function(objects) {
        objects = objects || this.getObjects();
        _.extend(this[this.fetchOptions.attr], objects);
        return this.getViews().each((function(_this) {
          return function(v) {
            v.addReferences(objects);
            return v.addReferences();
          };
        })(this));
      },
      buildInstanceCollections: function() {
        var addInstances, instances;
        instances = [];
        addInstances = function(view) {
          instances.push(_.values(view.getObjects()));
          return view.getViews().each(function(v) {
            return addInstances(v);
          });
        };
        addInstances(this);
        return _.filter(instances, function(i) {
          return i.length;
        });
      }
    });
  })(Backbone);

  _configure = Backbone.Layout.configure;

  Backbone.Layout.configure = function(options) {
    var defaults;
    _configure.apply(this, arguments);
    defaults = {
      attr: 'refs'
    };
    Backbone.Layout.prototype.fetchOptions = _.extend({}, defaults, options.fetchOptions);
    return Backbone.Layout.prototype[Backbone.Layout.prototype.fetchOptions.attr] = Backbone.Layout.prototype[Backbone.Layout.prototype.fetchOptions.attr] || {};
  };

}).call(this);
