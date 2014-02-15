pm-web
====
A web frontend for [pm](https://github.com/VividCortex/pm).

![](http://i.imgur.com/fTVlL5W.png)

Getting started
----
This is a front-end for [pm](https://github.com/VividCortex/pm), a process manager for Go programs.

First, get pm using `go get`: `go get github.com/VividCortex/pm`. The `server.go` file contains a
mock server which uses pm.

Start several mock server from the command line like so:
```sh
$ go run server.go -port :8081 &
$ go run server.go -port :8082 &
$ go run server.go -port :8083 &
```

The easiest way to use pm-web is to just use the page hosted on github:
http://vividcortex.github.io/pm-web/app/index.html#/procs?host=localhost:8081,localhost:8082

Alternatively, you can view the webapp by first running the server `./web-server.js` then view
the pm web app at http://localhost:8000/app/index.html?#/procs


Inspiration
----
The structure was heavily informed by the [Angular
tutorial](http://docs.angularjs.org/tutorial).


License
----
Copyright (c) 2014 VividCortex, licensed under the MIT license. Please see the LICENSE file for details.

Cat picture
---
![](http://i.imgur.com/6DRYIwHm.jpg)
