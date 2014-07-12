# <img src="http://game-icons.net/icons/lorc/originals/png/engagement-ring.png" width="32"> prom, simple node.js promises

Calls functions once a promise has been delivered.

```javascript
var prom = require('prom');

var onready = prom();
onready(console.log.bind(console, 'one'));
onready(console.log.bind(console, 'two'));

// Deliver the promise
onready.deliver('delivered-arg-1', 'delivered-arg-2').
// > one delivered-arg-1 delivered-arg-2
// > two delivered-arg-1 delivered-arg-2

// Once the promise has been delivered, the callback on next event loop.
onready(console.log.bind(console, 'three'))
// > three delivered-arg-1 delivered-arg-2
```

## License

MIT
