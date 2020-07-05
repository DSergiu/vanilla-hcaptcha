# hCaptcha - Vanilla Web Component

**0** dependencies. **<1kb** gzipped. Integrates well with Vue.JS.

## Install
```
yarn add vanilla-hcaptcha
```
```
<script src="https://cdn.jsdelivr.net/npm/vanilla-hcaptcha"></script>
```

## Usage Vue.JS

#### main.js
Import once in application. Ignore the custom element.
```
import "vanilla-hcaptcha";

Vue.config.ignoredElements = [
  "h-captcha"
];
```

#### Integrate in your component
```
<template>
    ...
    <h-captcha id="signupCaptcha"
               site-key="10000000-ffff-ffff-ffff-000000000001"
               size="normal"
               dark
               tabindex="0"
               @loaded="onCaptchaLoaded"
               @verified="onCaptchaVerified"
               @expired="onCaptchaExpired"
               @error="onCaptchaError" />
</template>

export default {
    name: ...
    methods: {
        onCaptchaLoaded(e) {
          console.log("Captcha is loaded");
          e.target.render(); // Show captcha
        },
        onCaptchaVerified(e) {
          console.log("Captcha is verified", { key: e.key });
        },
        onCaptchaExpired() {
          console.log("The verified captcha expired");
        },
        onCaptchaError(e) {
          console.log("Captcha error", { error: e.error });
        }
    }
}
```

## Usage Vanilla.JS
```
<h-captcha id="signupCaptcha"
           site-key="10000000-ffff-ffff-ffff-000000000001"
           size="normal"
           dark
           tabindex="0" />

const signupCaptcha = document.getElementById('signupCaptcha');

signupCaptcha.addEventListener('loaded', () => {
    signupCaptcha.render(); // Show captcha
});
signupCaptcha.addEventListener('verified', (e) => {
    console.log('verified event', { key: e.key });
});
signupCaptcha.addEventListener('expired', () => {
    console.log('expired event');
});
signupCaptcha.addEventListener('error', (e) => {
    console.log('error event', { error: e.error });
});
```

## Docs
It loads `hcaptcha.min.js` if not already present on dom.

#### Attributes

|Attribute|Description|
|---|---|
|`site-key`|The site key generated in [hCaptcha dashboard](https://dashboard.hcaptcha.com).|
|`size`|One of: normal, compact, invisible|
|`dark`|To use the dark theme|
|`tabindex`|Set the tabindex of the hCaptcha popup.|


#### Events

|Event|Data|Description|
|---|---|---|
|`loaded`|`null`|Emitted when component is ready to show captcha. This is necessary if `window.hcaptcha` is not already in the dom.|
|`verified`|`key` - verification key to be checked on backend side|Event emitted after captcha was successfully verified.|
|`expired`|`null`|Emitted when a captcha was verified but it expired.|
|`error`|`error`|Emitted when an error happened.|


## Develop & Test

```
yarn build
```

```
yarn test
```
