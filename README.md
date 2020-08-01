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

Being a vanilla web component, it is relatively [easy](https://custom-elements-everywhere.com) to integrate in mainstream web frameworks such as: React, Vue.js, Angular, Stencil.js, etc. See below some examples.


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
               dark
               onVerified="onCaptchaVerified"></h-captcha>
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


### Vanilla.JS
> Example: display normal size hCaptcha accessible by keyboard (see [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)). 

1. 
    ```html
    <script src="https://cdn.jsdelivr.net/npm/vanilla-hcaptcha"></script>

    <h-captcha id="signupCaptcha"
               site-key="10000000-ffff-ffff-ffff-000000000001"
               size="normal"
               tabindex="0"></h-captcha>
    
    <script>
        const signupCaptcha = document.getElementById('signupCaptcha');
        
        signupCaptcha.addEventListener('verified', (e) => {
            console.log('verified event', { key: e.key });
        });
        signupCaptcha.addEventListener('error', (e) => {
            console.log('error event', { error: e.error });
        });
    </script>
    ```

## Docs

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

#### Methods

|Method|Description|
|---|---|
|`reset()`|Resets the hCaptcha which requires user to fill captcha again.|
|`remove()`|Removes the component from DOM.|


## Develop & Test

```
yarn build
```

```
yarn test
```
