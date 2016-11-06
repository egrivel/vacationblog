# Vacation Blog - Page Structure

## App.js

At the root of the page structure is the `App.jsx` application object. It
contains the header and footer, and in-between displays the content. Note
that the menu bar is considered part of the header.

## CSS Structure

The global page structure is set out in `index.html`, (found in the `site`
folder), which provides for the surrounding HTML structure. It also defines
the `react-root` element into which `boot.js` will render the application.

```
<body>
  <div id="react-root">
    ... application content ...
  </div>
</body>
```

The application content is defined in `App.jsx`, consisting of a _body_ with
in it a _header_, a _content_ and a _footer_ div. The header and footer are
rendered by the respective elements. The actual content depends of the route.

```
<div class="body">
  ... Header ...
  <div class="content">
    ... content ...
  </div>
  ... Footer ...
</div>
```

The header structure is defined in `Header.jsx` and `Menu.jsx`:

```
<div class="header">
  <h1>... title ...</h1>
  <span class="userName">
    <a class="login-link">
      ... Login / user name ...
      <i ... icon ...></i>
    </a>
    ... input form, if any
  </span>
  <div>
    <ul class="main-menu">
      <li>
        <a href="... target ...">... item ...</a>
      </li>
      ... other menu items
    </ul>
    <div class="clear"></div>
  </div>
</div>
```

