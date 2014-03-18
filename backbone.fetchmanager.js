(function() {
  'backbone.fetchmanager.js\nCopyright 2014, Justin Perler (@jperler)\nbackbone.fetchmanager.js may be freely distributed under the MIT license.';
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
      addReferences: function() {
        var addNestedReferences;
        addNestedReferences = function(view, instance, property) {
          view.options[property] = instance;
          return view.getViews().each(function(v) {
            addNestedReferences(v, instance, property);
            return v.addReferences();
          });
        };
        return _.each(this.getObjects(), (function(_this) {
          return function(instance, property) {
            return addNestedReferences(_this, instance, property);
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

}).call(this);
