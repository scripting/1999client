#### Client for 1999.io

1999.io is my new liveblogging project. It's the software I use to edit <a href="http://scripting.com/">Scripting News</a>. When you reply to a post on my blog you are using 1999.io. 

The server is running <a href="https://github.com/scripting/nodeStorage">nodeStorage</a>, which is an open source project, that provides simple storage services for browser-based JavaScript apps, using Twitter-hosted identity.

nodeStorage has a WebSockets interface, which we use in this app to get a stream of updates from the server. 

I wrote a <a href="http://scripting.com/liveblog/users/davewiner/2015/11/30/0510.html">blog post</a> that explains why I provided this app, and an overview of how to test it. 

#### It's a demo app

When you run the <a href="http://fargo.io/code/websockets3/test1999.html">demo app</a>, you will get an update for each new post, comment, or edit to a post or comment on Scripting News. 

It also maintains a JavaScript data structure which is a mirror of the most recent posts on my blog, as a JavaScript object. 

#### Details

Every time the server updates you get a message. 

The first line of the message has the world <i>update</i> followed by a \\r. This makes it possible for other kinds of data to be returned at some time in the future.

Following the first line is a JSON structure containing all the information about a top-level message. 

Here's an <a href="http://scripting.com/liveblog/data/2015/11/30/00510.json">example</a> of such a structure. It's the JSON source for <a href="http://scripting.com/liveblog/users/davewiner/2015/11/30/0510.html">this post</a>. 

You can <a href="http://scripting.com/liveblog/users/davewiner/2015/11/26/0461.html">view</a> the JSON structure for any post. 

#### Updates 

v0.44 -- rewritten to work with new WebSockets code in nodeStorage, not yet released. 

v0.45 -- use the new 1999.io server, node2.1999.io. 

