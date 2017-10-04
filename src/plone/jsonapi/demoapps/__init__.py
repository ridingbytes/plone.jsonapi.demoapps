# -*- coding: utf-8 -*-

import logging

logger = logging.getLogger("plone.jsonapi.demoapps")


def initialize(context):
    """Initializer called when used as a Zope 2 product."""
    logger.info("*** Initializing plone.jsonapi.demoapps ***")
