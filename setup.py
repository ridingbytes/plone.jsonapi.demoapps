# -*- coding: utf-8 -*-

from setuptools import setup, find_packages

version = '1.0.0'

long_description = (
    open('README.rst').read()
    + '\n' +
    open(os.path.join('docs', 'HISTORY.rst')).read()
    + '\n')

setup(
    name='plone.jsonapi.demoapps',
    version=version,
    description="Demo App for plone.jsonapi.routes",
    long_description=long_description,
    # Get more strings from
    # http://pypi.python.org/pypi?:action=list_classifiers
    classifiers=[
        "Programming Language :: Python",
        "Framework :: Plone",
        "Framework :: Zope2",
    ],
    keywords='',
    author='Ramon Bartl',
    author_email='rb@ridingbytes.com',
    url='https://github.com/senaite/plon.jsonapi.demoapp',
    license='GPLv3',
    packages=find_packages('src', exclude=['ez_setup']),
    package_dir={'': 'src'},
    namespace_packages=['plone', 'plone.jsonapi'],
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'setuptools',
        'plone.jsonapi.core',
        'plone.jsonapi.routes',
    ],
    extras_require={
        'test': [
            'Products.PloneTestCase',
            'Products.SecureMailHost',
            'plone.app.robotframework',
            'plone.app.testing',
            'robotframework-debuglibrary',
            'robotframework-selenium2library',
            'robotsuite',
            'unittest2',
        ]
    },
    entry_points="""
      # -*- Entry points: -*-
      [z3c.autoinclude.plugin]
      target = plone
      """,
)
