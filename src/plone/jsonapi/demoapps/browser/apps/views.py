# -*- coding: utf-8 -*-

from Products.Five.browser import BrowserView
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile


class TodoView(BrowserView):
    """Todo view
    """
    template = ViewPageTemplateFile("templates/todo.pt")

    def __init__(self, context, request):
        request.set('disable_border', 1)
        self.context = context
        self.request = request

    def __call__(self):
        return self.template()
