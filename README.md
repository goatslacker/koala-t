# koala-t

Tool for checking code quality and for use in continuous integration.

`koala-t` will

* lint your files using [JSHint](https://github.com/jshint/jshint)
* run your unit tests
* check code coverage

and pass your build if all requirements are met.

## Install

With npm

    $ npm install koala-t -g

you can then use `koala-t` to test your projects locally

## Adding to CI

### Travis

In your `package.json` file add the following:

    "scripts": {
      "test": "koala-t"
    },

    "devDependencies": {
      "koala-t": "latest"
    }

### Jenkins

In your `ci_build` script run `koala-t`

    koala-t -q

## koala.json

`koala.json` is an important file that should be located in your project's root. This JSON config file
defines which files will be linted, tested and if coverage will be used.

A sample `koala.json` can be found in this repository since `koala-t` runs `koala-t` on itself.

The basic configuration looks like this:

    {
      "lint": ["lib/"],
      "test": ["test/my_test.js"]
    }

This configuration will lint all `.js` files in the `lib/` folder and will use the test runner in
the file `test/my_test.js`.

## CLI Help

    Usage: koala-t [options]

    Options:

      -h, --help                 output usage information
      -c, --coverage [file]      Instrument a file for coverage
      -l, --lint [file|dir]      Lint specific file or directory
      -p, --percentage [number]  The amount of code coverage required to pass
      -q, --quiet                Keep things quiet.
      -t, --test [file|dir]      Test specific file or directory

# License

[MIT LICENSE](http://josh.mit-license.org)

Copyright 2012 Josh Perez, www.goatslacker.com
