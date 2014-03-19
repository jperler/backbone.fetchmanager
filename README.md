FetchManager
=====================

An object fetch manager for [backbone.layoutmanager](https://github.com/tbranyen/backbone.layoutmanager).

### Overview

Backbone.fetchmanager is a plugin for [backbone.layoutmanager](https://github.com/tbranyen/backbone.layoutmanager) that enables a clean organization of view objects and view fetch methods. It recursively fetches view objects and adds references to their respective views and nested views. I will refer to Backbone models &amp; collections as Backbone objects.

I tend to end up in the following situation all of the time:

```
$.when(model.fetch(), collection.fetch(), ...).then(function() {
  new View({
    model: model
    collection: collection
  });
});
```
I thought it could be nice to have a library to alleviate this as well as adding instance references. Here's what it simplifies your router code to:
```
var view = new View();
$.when(view.fetchObjects()).then(function() { 
  view.render();
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
Backbone.Layout.configure({
  fetchOptions: {
    // refs is the default but this can be overriden
    attr: 'refs'
  }  
});

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
$.when(view.fetchObjects()).then(function() {
  console.log(view.refs.model);
  console.log(view.getView('.nested-view').refs.model);
  console.log(view.getView('.nested-view').refs.nested_model);
});
```

#### Backbone.Layout.fetched() (optional)
Callback function after all promises are fetched. This is useful to prep views with data since instances aren't fetched yet at the point of instantiating views.
```
new Backbone.View.extend({
  objects: {
    model: new Backbone.Model()
  },
  fetched: function() {
    @model = @refs.model;
  },
  serialize: function() {
    return @model.toJSON();
  }
})
```

### Support
Please let me know what you think of this approach and if you have any thoughts and/or suggestions!
