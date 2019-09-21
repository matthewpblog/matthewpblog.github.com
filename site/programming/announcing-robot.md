---
layout: post.njk
title: Announcing Robot
date: 2019-09-21
tags: post
permalink: programming/announcing-robot.html
description: Robot is a new library for building finite state machines, in only 1kB.
---

__[Robot](https://thisrobot.life/)__ is a new library for building [finite state machines](https://en.wikipedia.org/wiki/Finite-state_machine) in only __1.3kB__. Here's an obligatory toggle machine example:

```js
import { createMachine, state, transition } from 'robot3';

const machine = createMachine({
  inactive: state(
    transition('toggle', 'active')
  ),
  active: state(
    transition('toggle', 'inactive')
  )
});
```

One of the main goals of Robot is to enable [function composition](https://thisrobot.life/guides/composition.html) so common tasks can be broken up. The above toggle machine does something common, the `toggle` event causes a transition to another state. So we can extract this to a function:

```js
import { createMachine, state, transition } from 'robot3';

const toggleTo = to => state(
  transition('toggle', to)
);

const machine = createMachine({
  inactive: toggleTo('active'),
  active: toggleTo('inactive')
});
```

And of course, a toggle machine is a *super* common type of state machine. So we probably want to make that into its own function itself. Let's do that:

```js
import { createMachine, state, transition } from 'robot3';

const toggleTo = to => state(
  transition('toggle', to)
);

const toggleMachine = () => createMachine({
  inactive: toggleTo('active'),
  active: toggleTo('inactive')
});

const bold = toggleMachine();
const italic = toggleMachine();
const underline = toggleMachine();
```

Finite state machines are a *great* way to write stateful UIs. You can think about FSM as the static typing for state. If you declaratively lay out the possible states you'll avoid bugs like incompatible states.

One of the great things that has happened in programming over the last several years has been the migration toward declarative UIs with libraries like React. However, we still write the stateful logic in our components with imperative code like this:

```js
function resetState() {
  setValidating(false);
  setSaving(false);
  setBlurred(false);
  setEditing(false);
  if(!focused) setTouched(false);
  setDirty(true);
}
```

This is gross! Finite state machines fixes this. See [Why Finite State Machines](https://thisrobot.life/#why-finite-state-machines) for a larger argument for why you should use FSMs in your app.

## Integrations

Robot has integrations with a variety of popular view libraries including:

* [Preact](https://thisrobot.life/integrations/preact-robot.html)
* [Haunted](https://thisrobot.life/integrations/haunted-robot.html)
* [React](https://thisrobot.life/integrations/react-robot.html)
* [LitElement](https://thisrobot.life/integrations/lit-robot.html)

Here's an example of using Robot in a [React](https://reactjs.org) app:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { createMachine, state, transition } from 'robot3';
import { useMachine } from 'react-robot';

const machine = createMachine({
  off: state(
    transition('toggle', 'on')
  ),
  on: state(
    transition('toggle', 'off')
  )
});

function App() {
  const [current, send] = useMachine(machine);

  return (
    <>
      <div>State: {current.name}</div>
      <button onClick={() => send('toggle')}>
        Toggle
      </button>
    </>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
```

That's it! I'm more excited about Robot than any project I've been in a quite a long time. I think the combination of small size and the power of composition is going to make it easier and fun to build apps again. Check out [thisrobot.life](https://thisrobot.life) for more information and file an issue!