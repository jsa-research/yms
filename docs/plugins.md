## Functions
<dl>
<dt><a href="#closure">closure()</a> ⇒ <code>stream.Transform</code></dt>
<dd><p>Wraps code in a simple JS closure.</p>
</dd>
<dt><a href="#combine.format">combine.format(data)</a> ⇒ <code>stream.Transform</code></dt>
<dd><p>Wraps modules in closures and joins them into a single output file.</p>
</dd>
<dt><a href="#combine.src">combine.src(data)</a> ⇒ <code>stream.Transform</code></dt>
<dd><p>Loads requested modules into stream from disk or local cache.
Maps files names from aliases.</p>
</dd>
<dt><a href="#contents">contents(data)</a> ⇒ <code>stream.Transform</code></dt>
<dd><p>Replaces Vinyl files in stream with their contents.</p>
</dd>
<dt><a href="#init.setupAsync">init.setupAsync(data)</a> ⇒ <code>stream.Transform</code></dt>
<dd><p>Adds code for calling <code>setupAsync</code> function of <code>init.js</code> file with current request and environment params.
Generates representation of <code>data.env</code> content and provides it as a parameter for function call.
Properties of <code>data.env</code> may be both primitives and <code>promise</code>-objects: plugin will wait for them to be resolved.</p>
</dd>
<dt><a href="#init.src">init.src(data)</a> ⇒ <code>stream.Transform</code></dt>
<dd><p>Loads <code>init.js</code> into stream.</p>
</dd>
<dt><a href="#jsonp">jsonp(data)</a> ⇒ <code>stream.Transform</code></dt>
<dd><p>Wraps code with a JSONP callback with a specified name.</p>
</dd>
<dt><a href="#util.pipeChain">util.pipeChain()</a> ⇒ <code>stream.Transform</code></dt>
<dd><p>Allows to create a chain of plugins where streams will be piped from one plugin to another.
Later this chain can be injected anywhere in a pipeline,
so pipeline contents will get inside the first plugin and the go out from the last one.</p>
</dd>
</dl>
<a name="closure"></a>
## closure() ⇒ <code>stream.Transform</code>
Wraps code in a simple JS closure.

**Kind**: global function  
**Returns**: <code>stream.Transform</code> - Stream  
<a name="combine.format"></a>
## combine.format(data) ⇒ <code>stream.Transform</code>
Wraps modules in closures and joins them into a single output file.

**Kind**: global function  
**Returns**: <code>stream.Transform</code> - Stream  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Cross-plugin request data |

<a name="combine.src"></a>
## combine.src(data) ⇒ <code>stream.Transform</code>
Loads requested modules into stream from disk or local cache.
Maps files names from aliases.

**Kind**: global function  
**Returns**: <code>stream.Transform</code> - Stream  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Cross-plugin request data |

<a name="contents"></a>
## contents(data) ⇒ <code>stream.Transform</code>
Replaces Vinyl files in stream with their contents.

**Kind**: global function  
**Returns**: <code>stream.Transform</code> - Stream  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Cross-plugin request data |

<a name="init.setupAsync"></a>
## init.setupAsync(data) ⇒ <code>stream.Transform</code>
Adds code for calling `setupAsync` function of `init.js` file with current request and environment params.
Generates representation of `data.env` content and provides it as a parameter for function call.
Properties of `data.env` may be both primitives and `promise`-objects: plugin will wait for them to be resolved.

**Kind**: global function  
**Returns**: <code>stream.Transform</code> - Stream  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Cross-plugin request data |

<a name="init.src"></a>
## init.src(data) ⇒ <code>stream.Transform</code>
Loads `init.js` into stream.

**Kind**: global function  
**Returns**: <code>stream.Transform</code> - Stream  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Cross-plugin request data |

<a name="jsonp"></a>
## jsonp(data) ⇒ <code>stream.Transform</code>
Wraps code with a JSONP callback with a specified name.

**Kind**: global function  
**Returns**: <code>stream.Transform</code> - Stream  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Cross-plugin request data |

<a name="util.pipeChain"></a>
## util.pipeChain() ⇒ <code>stream.Transform</code>
Allows to create a chain of plugins where streams will be piped from one plugin to another.
Later this chain can be injected anywhere in a pipeline,
so pipeline contents will get inside the first plugin and the go out from the last one.

**Kind**: global function  
**Returns**: <code>stream.Transform</code> - Stream  
