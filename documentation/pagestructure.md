# Vacation Blog - Page Structure

## App.js

At the root of the page structure is the `App.jsx` application object. It
contains the header and footer, and in-between displays the content. Note
that the menu bar is considered part of the header.

## CSS Structure

The global page structure is set out in `index.html`:

```
<body>
  <div id="body">
    ... application content ...
  </div>
</body>
```

The application content is defined in `App.jsx`:

```
<div>
  ... Header ...
  ... content ...
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
