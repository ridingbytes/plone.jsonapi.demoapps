# -*- coding: utf-8 -*-

from plone.jsonapi.core import router


@router.add_route("/hello/<string:name>", "hello", methods=["GET"])
def hello(context, request, name="world"):
    return {"hello": name}
