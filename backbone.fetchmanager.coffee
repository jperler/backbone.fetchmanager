'''
backbone.fetchmanager.js
Copyright 2014, Justin Perler (@jperler)
backbone.fetchmanager.js may be freely distributed under the MIT license.
'''

do (Backbone) -> _.extend Backbone.Layout.prototype,

    # A view fetch method that takes everything inside view.objects and
    # view.options.objects, fetches them and drops references inside each
    # nested view recursively.
    fetchObjects: ->
        # Initialize a resolved deffered object for chaining.
        deferred = new $.Deferred().resolve()
        instance_collections = @buildInstanceCollections()

        # Adds nested references.
        @addReferences()

        # Make sure we resolve the deferred if the view has no objects.
        if not instance_collections.length then return deferred

        # Helper function that maps the fetch method to all objects.
        getPromises = (instances) ->
            _.map instances, (instance) -> instance.fetch()

        # Add each collection as a list of promises and fetch them in
        # order starting from the outermost collection.
        _.each instance_collections, (instances) ->
            deferred = deferred.then ->
                $.when.apply $, getPromises(instances)

        # Returns a deferred object so we know when fetching is done.
        deferred

    # Accessor method to ensure that all object are accounted for.
    getObjects: -> _.extend {}, @objects, @options.objects

    # Adds instance references to the view and all of its nested views
    # inside view.options
    addReferences: ->
        # Recursive method to add references to all a view's nested views.
        addNestedReferences = (view, instance, property) ->
            view.options[property] = instance
            view.getViews().each (v) ->
                addNestedReferences v, instance, property
                v.addReferences()
        # Iterate through each object to add references.
        _.each @getObjects(), (instance, property) =>
            addNestedReferences @, instance, property

    # Builds an array of arrays of objects to be passed to the deferred
    # methods. This method is used to ensure that the outermost objects
    # are done fetching before any nested objects.
    buildInstanceCollections: ->
        instances = []
        # Recursive method to build instances array.
        addInstances = (view) ->
            instances.push _.values(view.getObjects())
            view.getViews().each (v) -> addInstances v
        addInstances @
        # only consider values that contain instances
        _.filter instances, (i) -> i.length
