### Please use this command to compile this file into the parent `js` directory:
    coffee --no-header -w -o ../js -c todo.coffee
###

require [
  '++resource++static/js/jquery-1.12.4.min.js'
  '++resource++static/js/backbone-min.js'
  '++resource++static/js/underscore-min.js'
], () ->

  console.log "jQuery Version=", jQuery.fn.jquery
  console.log "Backbone=", Backbone.VERSION
  console.log "Underscore=", _.VERSION

  ### MODELS ###

  Backbone.emulateHTTP = yes

  class Todo extends Backbone.Model
    urlRoot: '@@API/plone/api/1.0/document'
    idAttribute: 'uid'

    defaults:
      uid: ""
      url: ""
      title: ""
      description: ""
      parent_path: "/Plone/todos"
      review_state: "private"

    isNew: ->
      _.isEmpty @get "uid"

    parse: (response, options) ->
      if response.items?.length is 1
        return response.items[0]
      return response

    isDone: ->
      if @get("review_state") is "private" then yes else no

    toggleState: ->
      transition = if @get("review_state") is "published" then "retract" else "publish"
      @save
        transition: transition
      ,
        success: (model, response, options) ->
          return unless response.count is 1
          model.set response.items[0]


  ### COLLECTIONS ###
  class Todos extends Backbone.Collection
    model: Todo
    url: '@@API/plone/api/1.0/document?path=/Plone/todos&depth=1&sort_on=created'

    parse: (response, options) ->
      return response.items

    remaining: ->
      return @where review_state: "published"


  ### VIEWS ###
  class TodoView extends Backbone.View
    tagName: "li"

    template: _.template $("#todo-item").html()

    initialize: ->
      @listenTo @model, "change", @render
      @listenTo @model, "destroy", @remove

    events:
      "click .destroy": "clear"
      "click .toggleState": "toggleState"
      "dblclick .view": "edit"
      "keypress .edit": "updateOnEnter"
      "keypress .description": "updateDescriptionOnEnter"
      "blur .description": "close"
      "blur .edit": "close"

    clear: (event) ->
      @model.destroy()

    edit: ->
      @$el.addClass("editing")
      @title.select()

    close: ->
      title = @title.val()
      description = @description.val()
      if (!title)
        @clear()
      else
        @model.save({title: title, description: description})
        @$el.removeClass("editing")

    updateOnEnter: (event) ->
      if (event.keyCode == 13) then @close()

    updateDescriptionOnEnter: (event) ->
      return unless (event.keyCode == 13)
      @model.save description: @description.val()

    toggleState: (event) ->
      @model.toggleState()

    render: ->
      @$el.html @template @model.toJSON()
      @$el.toggleClass "done", @model.isDone()
      # remember the title box
      @title = @$('.edit')
      @description = @$('.description')
      return @


  class App extends Backbone.View
    el: "#todoapp"

    todo_folder: "/Plone/todos"

    statsTemplate: _.template $('#stats-template').html()

    events:
      "keypress #new-todo": "createOnEnter"

    initialize: ->
      console.debug "App.initialize"

      @todos = new Todos()
      @todos.fetch path: @todo_folder

      @todo_list = $("#todo-list")

      @todos.on 'add', @addOne, @
      @todos.on 'reset', @addAll, @
      @todos.on 'all', @render, @

      @new_todo = @$("#new-todo")
      @footer = @$('footer');

    addOne: (todo) ->
      view = new TodoView model:todo
      @todo_list.prepend view.render().el

    addAll: ->
      console.log "App.addAll"
      @todos.each @addOne, @

    createOnEnter: (event) ->
      return unless event.keyCode == 13
      return unless @new_todo.val()
      todo = new Todo()
      todo.save
        title: @new_todo.val()
        transition: "publish"
      ,
        success: (model, response, options) ->
          return unless response.items.length is 1
          model.set response.items[0]
        # add the todo to the collection
      @todos.add todo
      @new_todo.val ""

    render: ->
      remaining = @todos.remaining().length
      @footer.html @statsTemplate remaining: remaining
      return @

  # window.todos = new Todos()
  window.app = new App()
