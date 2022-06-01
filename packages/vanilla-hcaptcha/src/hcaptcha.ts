import { loadJsApiIfNotAlready } from './api-loader';

class VanillaHCaptchaError extends Error {
    constructor(msg: string) {
        super(`[hcaptcha-web-component]: ${msg}`);
        Object.setPrototypeOf(this, VanillaHCaptchaError.prototype);
    }
}

export interface VanillaHCaptchaJsApiConfig {

    /**
     * The hCaptcha JS API.
     * Default: "https://js.hcaptcha.com/1/api.js"
     */
    jsapi?: string;

    /**
     * Default: true
     */
    sentry: boolean;

    /**
     * Disable drop-in replacement for reCAPTCHA with false to prevent
     * hCaptcha from injecting into window.grecaptcha.
     * Default: true
     */
    reCaptchaCompat: boolean;

    /**
     * hCaptcha auto-detects language via the user's browser.
     * This overrides that to set a default UI language.
     */
    hl?: string;

    endpoint?: string;
    reportapi?: string;
    assethost?: string;
    imghost?: string;
    host?: string;
}

type VanillaHCaptchaRenderConfig = Omit<ConfigRender,
    "callback" |
    "expired-callback" |
    "chalexpired-callback" |
    "error-callback" |
    "open-callback" |
    "close-callback">;

export class VanillaHCaptchaWebComponent extends HTMLElement {

    private hcaptchaId: HCaptchaId;

    connectedCallback() {
        const jsApiConfig: VanillaHCaptchaJsApiConfig = {
            host: this.getAttribute('host'),
            hl: this.getAttribute('hl'),
            sentry: this.getAttribute('sentry') !== "false",
            reCaptchaCompat: this.getAttribute('reCaptchaCompat') === "false",
            jsapi: this.getAttribute('jsapi') || 'https://js.hcaptcha.com/1/api.js',
            endpoint: this.getAttribute('endpoint'),
            reportapi: this.getAttribute('reportapi'),
            assethost: this.getAttribute('assethost'),
            imghost: this.getAttribute('imghost'),
        };

        loadJsApiIfNotAlready(jsApiConfig)
            .then(this.onApiLoaded.bind(this))
            .catch(this.onError.bind(this));
    }

    private onApiLoaded(): void {
        this.$emit('loaded');

        const autoRender = this.getAttribute('auto-render') !== "false";

        const renderConfig: VanillaHCaptchaRenderConfig = {
            sitekey: this.getAttribute('sitekey') || this.getAttribute('site-key'),
            // @ts-ignore
            theme: this.getAttribute('theme'),
            // @ts-ignore
            size: this.getAttribute('size'),
            hl: this.getAttribute('hl'),
            tplinks: this.getAttribute('tplinks') === "off" ? "off" : "on",
            tabindex: parseInt(this.getAttribute('tabindex')),
            custom: this.getAttribute('custom') === "true",
        };

        const attrChallengeContainer = this.getAttribute('challenge-container');
        if (attrChallengeContainer) {
            renderConfig["challenge-container"] = attrChallengeContainer;
        }

        const rqdata = this.getAttribute('rqdata');

        if (autoRender) {
            // Check required attributes are set when auto render is enabled
            if (!renderConfig.sitekey) {
                // Frontend frameworks might render the component with empty attributes when binding a value.
                // To avoid errors, simply stop the rendering process.
                // throw new VanillaHCaptchaError('Missing "sitekey" attribute. ');
                return;
            }
        }

        if (autoRender) {
            this.render(renderConfig);
            this.setData(rqdata);
        }
    }

    private assertApiLoaded(fnName: string) {
        if (!hcaptcha) {
            throw new VanillaHCaptchaError(`hCaptcha JS API was not loaded yet. Please wait for \`loaded\` event to safely call "${fnName}".`);
        }
    }

    private assertRendered() {
        if (!this.hcaptchaId) {
            throw new VanillaHCaptchaError(`hCaptcha was not yet rendered. Please call "render()" first.`);
        }
    }

    private onError(error: Error | string) {
        console.error(error);
        this.$emit('error', { error });
    }

    private $emit(eventName: string, obj?: object) {
        let event;
        if (typeof(Event) === 'function') {
            event = new Event(eventName);
        } else {
            event = document.createEvent('Event');
            event.initEvent(eventName, false, false);
        }
        obj && Object.assign(event, obj);
        this.dispatchEvent(event);
    }

    /**
     * Programmatically render the hCaptcha checkbox.
     * The config object must specify all required properties.
     * The web component attributes are ignored for more explicit behavior.
     * @param config
     */
    render(config: VanillaHCaptchaRenderConfig): void {
        this.assertApiLoaded('render');
        if (this.hcaptchaId) {
            console.warn("hCaptcha was already rendered. You may want to call 'reset()' first.");
            return;
        }
        this.hcaptchaId = hcaptcha.render(this, {
            ...config,
            'callback': () => {
                const token = hcaptcha.getResponse(this.hcaptchaId);
                const eKey = hcaptcha.getRespKey(this.hcaptchaId);
                this.$emit('verified', { token, eKey, key: token });
            },
            'expired-callback': () => {
                this.$emit('expired');
            },
            'chalexpired-callback': () => {
                this.$emit('challenge-expired');
            },
            'error-callback': this.onError.bind(this),
            'open-callback': () => {
                this.$emit('opened');
            },
            'close-callback': () => {
                this.$emit('closed');
            },
        });
    }

    /**
     * Sets the rqdata.
     * @param rqdata
     */
    setData(rqdata: string | null): void {
        this.assertRendered();
        hcaptcha.setData(this.hcaptchaId, { rqdata });
    }

    /**
     * Triggers hCaptcha verification.
     */
    execute(): void {
        this.assertApiLoaded('execute');
        this.assertRendered();
        hcaptcha.execute(this.hcaptchaId);
    }

    /**
     * Triggers a verification request.
     * Returns a Promise which resolved with the token results or throws in case of errors.
     */
    executeAsync(): Promise<HCaptchaResponse> {
        this.assertApiLoaded('execute');
        this.assertRendered();
        // @ts-ignore
        return hcaptcha.execute(this.hcaptchaId, { async: true });
    }

    /**
     * Resets the hCaptcha verification.
     */
    reset(): void {
        this.assertApiLoaded('reset');
        this.assertRendered();
        hcaptcha.reset(this.hcaptchaId);
    }

}
