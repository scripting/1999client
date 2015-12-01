#### Client for 1999.io

This is an example client app, running in a web page, for 1999.io that uses WebSockets.

You can run it from this <a href="http://fargo.io/code/websockets3/test1999.html">web page</a> without having to download this project.. 

The server must be running <a href="https://github.com/scripting/nodeStorage">nodeStorage</a> v0.84 or greater. It's the first release with WebSockets support.

#### What you get

Every time the server updates you get a message. The first line of the message has the world update followed by a \\r. This makes it possible for other kinds of data to be returned at some time in the future.

Following the first line is a JSON structure containing all the information about a top-level message. 

Here's an <a href="http://scripting.com/liveblog/data/2015/11/30/00510.json">example</a> of such a structure. It's the JSON source for <a href="http://scripting.com/liveblog/users/davewiner/2015/11/30/0510.html">this post</a>. 

You can <a href="http://scripting.com/liveblog/users/davewiner/2015/11/26/0461.html">view</a> the JSON structure for any post. 

#### Updates 

v0.44 -- rewritten to work with new WebSockets code in nodeStorage, not yet released. 

v0.45 -- use the new 1999.io server, node2.1999.io. 

