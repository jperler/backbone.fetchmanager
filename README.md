FetchManager
=====================

An object fetch manager for backbone.layoutmanager.

### Overview

Backbone.fetchmanager is a plugin for [backbone.layoutmanager](https://github.com/tbranyen/backbone.layoutmanager) that enables a clean organization of view objects and view fetch methods. It recursively fetches view objects and adds references to a their respective views and nested views. I will refer to Backbone models &amp; collections as Backbone objects.

I tend to end up in the following situation all of the time:

```
$.when(model.fetch(), collection.fetch(), ...).then(function() {
  new View({
    model: model
    collection: collection
  });
});
```
This library attempts to simplify router code and organizes backbone models and collections in their respective views. On top of the general functionality, there are a couple of extras included in the library as described below.

### Documentation

#### Backbone.Layout.objects
An object of named Backbone object instances. Instances can be added while building your views or while instantiating your views.

```
Backbone.Layout.extend({
  objects: {
    model: new Backbone.Model()
  }
});

new Backbone.Layout({
  objects: {
    model: new Backbone.Model()
  }
});
```


#### Backbone.Layout.fetchObjects()
Recursively fetches all view and nested view objects and adds each object's reference to all of its children.

```
var view = Backbone.Layout.extend({
  views: {
    '.nested-view': new NestedView({
      objects: {
        nested_model: new Backbone.Model()
      }
    })
  },
  objects: {
    model: new Backbone.Model()
  }
});
```
The following objects will be accessible:
```
view.options.model
view.getView('.nested-view').options.model
view.getView('.nested-view').options.nested_model
```

### Support
Please let me know what you think of this approach and if you have any thoughts suggestions!
