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

License
----
Copyright (c) 2014 VividCortex, licensed under the MIT license. Please see the LICENSE file for details.

Cat picture
---
![](http://streetcouch.com/wp-content/uploads/2011/02/business-cat-14.jpg)
