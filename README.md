# hCaptcha - Vanilla Web Component

<img width="300px" src="https://assets-global.website-files.com/5c73e7ea3f8bb2a85d2781db/5c73e7ea3f8bb23b4c278261_hcaptcha-logo-landscape.svg" alt="hCaptcha logo" title="hCaptcha logo" />  

**0** dependencies. **<1kb** gzipped. Integrates well with Vue.JS, React, Angular, etc.

## Install

```bash
yarn add vanilla-hcaptcha
```

```html

<script src="https://cdn.jsdelivr.net/npm/vanilla-hcaptcha"></script>
```

## Usage

Being a vanilla web component, it is relatively [easy](https://custom-elements-everywhere.com) to integrate in
mainstream web frameworks such as: React, Vue.js, Angular, Stencil.js, etc. See below some examples.

* [Vue.JS](#vuejs)
* [React](#reactjs)
* [Angular 2+](#angular)
* [Angular.JS](#angularjs)
* [Vanilla](#vanillajs)

### Vue.JS

> Example: display invisible hCaptcha and render programmatically.

1. Import once in application (`main.js`). Ignore the custom element.
    ```js
    import "vanilla-hcaptcha";
    
    Vue.config.ignoredElements = [
      "h-captcha"
    ];
    ```
2. Add handling methods
    ```js
    methods: {
        onCaptchaLoaded(e) {
          console.log("Captcha is loaded");
          e.target.render(); // Show captcha programmatically
        },
        onCaptchaVerified(e) {
          console.log("Captcha is verified", { key: e.key });
        }
    }
    ```

3. Integrate in your vue component
    ```html
    <template>
        ...
        <h-captcha site-key="10000000-ffff-ffff-ffff-000000000001"
                   size="invisible"
                   @loaded="onCaptchaLoaded"
                   @verified="onCaptchaVerified"></h-captcha>
        ...
    </template>
    ```

### React.JS

> Example: display normal size hCaptcha with dark theme.

1. Import once in application (`index.js`).
    ```js
    import 'vanilla-hcaptcha';
    ```

2. Add event handler after mount
   ```js
   componentDidMount() {
       const signupCaptcha = document.getElementById('signupCaptcha');
       signupCaptcha.addEventListener('verified', (e) => {
         console.log('verified event', { key: e.key });
       });
   }
   ```

3. Integrate in your html template
   ```html
    <h-captcha id="signupCaptcha"
               site-key="10000000-ffff-ffff-ffff-000000000001"
               size="normal"
               theme="dark"></h-captcha>
   ```

### Angular

> Example: display default hCaptcha.

1. Import once in application (`main.ts`).
    ```js
    import 'vanilla-hcaptcha';
    ```
2. Add [`CUSTOM_ELEMENTS_SCHEMA`](https://angular.io/api/core/CUSTOM_ELEMENTS_SCHEMA) to `@NgModule.schemas`

3. Integrate in your html template
   ```html
    <h-captcha [attr.site-key]="siteKey"
               (verified)="onCaptchaVerified($event)"></h-captcha>
    
   ```

### Angular.JS

> Example: display compact hCaptcha with dark theme.

```html
<!doctype html>
<html ng-app="angularjsApp">
<head>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vanilla-hcaptcha"></script>

    <script>
        angular.module('angularjsApp', [])
                .controller('ExampleController', function () {
                    this.siteKey = "10000000-ffff-ffff-ffff-000000000001";
                    this.onCaptchaVerified = function (e) {
                        console.log('verified event', {key: e.key});
                    };
                    this.onCaptchaError = function (e) {
                        console.log('error event', {error: e.error});
                    };
                });
    </script>
</head>
<body>
<div ng-controller="ExampleController as ctrl">
    <h-captcha site-key="{{ctrl.siteKey}}"
               size="compact"
               theme="dark"
               ng-on-verified="ctrl.onCaptchaVerified($event)"
               ng-on-error="ctrl.onCaptchaError($event)"
    ></h-captcha>
</div>
</body>
</html>
```

### Vanilla.JS

> Example: display normal size hCaptcha accessible by keyboard (see [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)).

```html

<script src="https://cdn.jsdelivr.net/npm/vanilla-hcaptcha"></script>

<h-captcha id="signupCaptcha"
           site-key="10000000-ffff-ffff-ffff-000000000001"
           size="normal"
           tabindex="0"></h-captcha>

<script>
    const signupCaptcha = document.getElementById('signupCaptcha');

    signupCaptcha.addEventListener('verified', (e) => {
        console.log('verified event', {key: e.key});
    });
    signupCaptcha.addEventListener('error', (e) => {
        console.log('error event', {error: e.error});
    });
</script>
```

## Attributes

The web component allows specifying attributes. These are split into two categories: render and api attributes.

### Render Attributes

Conveniently you can set the render properties as attributes to the web component.
If you would like to programmatically call the `render()` method, you can set `auto-render="false"` property.

| Attribute             | Values/Type                         | Default  | Description                                                                                                                               |
|-----------------------|-------------------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `auto-render`         | Boolean                             | `true`   | When "false" it prevents automatic rendering of the checkbox.                                                                             |
| `sitekey` (required)  | String                              | -        | Your sitekey. Please visit [hCaptcha](https://www.hcaptcha.com) and sign up to get a sitekey.                                             |
| `size`                | String (normal, compact, invisible) | `normal` | This specifies the "size" of the checkbox. hCaptcha allows you to decide how big the component will appear on render. Defaults to normal. |
| `theme`               | String (light, dark)                | `light`  | hCaptcha supports both a light and dark theme. If no theme is set, the API will default to light.                                         |
| `tabindex`            | Integer                             | `0`      | Set the tabindex of the widget and popup. When appropriate, this can make navigation of your site more intuitive.                         |
| `hl`                  | String (ISO 639-2 code)             | -        | hCaptcha auto-detects language via the user's browser. This overrides that to set a default UI language.                                  |
| `challenge-container` | String                              | -        | A custom element ID to render the hCaptcha challenge.                                                                                     |
| `rqdata`              | String                              | -        | See Enterprise docs.                                                                                                                      |

### API Attributes

These attributes are optional.

| Attribute         | Values/Type                | Default | Description                                                                                                        |
|-------------------|----------------------------|---------|--------------------------------------------------------------------------------------------------------------------|
| `reCaptchaCompat` | Boolean                    | `true`  | Disable drop-in replacement for reCAPTCHA with `false` to prevent hCaptcha from injecting into window.grecaptcha.  |
| `hl`              | String (ISO 639-2 code)    | -       | hCaptcha auto-detects language via the user's browser. This overrides that to set a default UI language.           |
| `jsapi`           | String                     | -       | See Enterprise docs.                                                                                               |
| `endpoint`        | String                     | -       | See Enterprise docs.                                                                                               |
| `reportapi`       | String                     | -       | See Enterprise docs.                                                                                               |
| `assethost`       | String                     | -       | See Enterprise docs.                                                                                               |
| `imghost`         | String                     | -       | See Enterprise docs.                                                                                               |
| `sentry`          | Boolean                    | -       | See Enterprise docs.                                                                                               |


## Events

Depending on the use case, you can or not listen to the following events.

| Event                | Params         | Description                                                               |
|----------------------|----------------|---------------------------------------------------------------------------|
| `error`              | `err`          | When an error occurs. Component will reset immediately after an error.    |
| `verified`           | `token, eKey`  | When challenge is completed. The `token` and the `eKey` are passed along. |
| `expired`            | -              | When the current token expires.                                           |
| `challenge-expired`  | -              | When the unfinished challenge expires.                                    |
| `opened`             | -              | When the challenge is opened.                                             |
| `closed`             | -              | When the challenge is closed.                                             |

## Methods

The following methods allow for programmatic control, necessary only in case of a custom hCaptcha verification flow.

| Method           | Description                                                                                                              |
|------------------|--------------------------------------------------------------------------------------------------------------------------|
| `render(config)` | Renders the checkbox. Must pass the full render config, no attributes are injected.                                      |
| `execute()`      | Triggers a verification request.                                                                                         |
| `executeAsync()` | Triggers a verification request and receive a Promise which resolved with the token results or throws in case of errors. |
| `reset()`        | Resets the hCaptcha which requires user to fill captcha again.                                                           |

## Develop & Test

* `yarn build`
  > Build a production version of the component.

* `yarn dev`
  > Build dev version with hot reload.

* `yarn test`
  > Runs unit tests.
