pm-web
====
A web frontend for [pm](https://github.com/VividCortex/pm).

![](http://i.imgur.com/fTVlL5W.png)

Getting started
----
This is a front-end for [pm](https://github.com/VividCortex/pm), a process manager for Go programs.

First, get pm using `go get`: `go get github.com/VividCortex/pm`. The `server.go` file contains a
mock server which uses pm.

Start the mock server with `go run server.go`. It listens on `localhost:8081` by default. Next,
open `index.html` in your web browser and add `localhost:8081` as a host, as shown in the screenshot.

That's all! You'll be able to cancel processes running on pm-enabled hosts, as well as add additional
hosts using the UI.

View the webapp by first running the server `./web-server.js` then view
the pm web app at http://localhost:8000/app/index.html?#/list. Use the
host parameter (a comma delimited array) to see particular hosts.
Example
http://localhost:8000/app/index.html?#/list?host=localhost:8081,localhost:8082

If you need example data, start the example server on a couple of
different ports
```
go run server.go -port :8081
go run server.go -port :8082
go run server.go -port :8083
```

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
