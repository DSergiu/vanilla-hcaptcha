import { loadApiEndpointIfNotAlready } from './hcaptcha-script';

class HCaptcha extends HTMLElement {

    connectedCallback() {
        this.config = {
            sitekey: this.getAttribute('sitekey') || this.getAttribute('site-key'),
            theme: this.getAttribute('theme') || this.getAttribute('dark') !== null ? 'dark' : undefined,
            size: this.getAttribute('size'),
            tabindex: this.getAttribute('tabindex'),
            language: this.getAttribute('language'),
            reCaptchaCompat: this.getAttribute('reCaptchaCompat') === "false",
            challengeContainer: this.getAttribute('challengeContainer'),
            rqdata: this.getAttribute('rqdata'),
            sentry: this.getAttribute('sentry') === "true",
            apiEndpoint: this.getAttribute('apiendpoint') || 'https://hcaptcha.com/1/api.js',
            endpoint: this.getAttribute('endpoint'),
            reportapi: this.getAttribute('reportapi'),
            assethost: this.getAttribute('assethost'),
            imghost: this.getAttribute('imghost'),
        };
        loadApiEndpointIfNotAlready(this.config).then(this._apiLoaded.bind(this)).catch(this.onError.bind(this));
    }

    $emit(eventName, obj) {
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

    _apiLoaded() {
        this.hcaptcha = window.hcaptcha;
        this.$emit('loaded');
        this.render();
    }

    render() {
        if (this.hcaptchaId) {
            console.warn("hCaptcha was already rendered.");
            return;
        }
        if (!this.hcaptcha) {
            this.$emit('error', {
                error: 'hCaptcha was not loaded yet. Please wait for `loaded` event to safely call `render`.'
            });
            return;
        }
        const opt = {
            sitekey: this.config.sitekey,
            theme: this.config.theme,
            size: this.config.size,
            tabindex: this.config.tabindex,
            'callback': this.onVerify.bind(this),
            'expired-callback': this.onExpired.bind(this),
            'chalexpired-callback': this.onChallengeExpired.bind(this),
            'error-callback': this.onError.bind(this),
            'open-callback': this.onOpen.bind(this),
            'close-callback': this.onClose.bind(this)
        };
        if (this.config.challengeContainer) {
            opt['challenge-container'] = this.config.challengeContainer;
        }
        this.hcaptchaId = this.hcaptcha.render(this, opt);
        if (this.rqdata) {
            this.hcaptcha.setData(this.hcaptchaId, { rqdata: this.rqdata });
        }
        this.onRendered();
    }

    execute() {
        if (!this.hcaptcha) {
            this.$emit('error', {
                error: 'hCaptcha was not rendered yet. Please wait for `rendered` event to safely call `execute`.'
            });
            return;
        }
        this.hcaptcha.execute(this.hcaptchaId);
        this.onExecuted();
    }

    reset() {
        if (!this.hcaptcha) {
            this.$emit('error', {
                error: 'hCaptcha was not rendered yet. Please wait for `rendered` event to safely call `reset`.'
            });
            return;
        }
        this.hcaptcha.reset(this.hcaptchaId);
        this.onReset();
    }

    remove() {
        if (!this.hcaptcha) {
            this.$emit('error', {
                error: 'hCaptcha was not rendered yet. Please wait for `rendered` event to safely call `remove`.'
            });
            return;
        }
        this.hcaptcha.remove(this.hcaptchaId);
        this.onReset();
    }

    onRendered() {
        this.$emit('rendered');
    }

    onExecuted() {
        this.$emit('executed');
    }

    onReset() {
        this.$emit('reset');
    }

    onError(error) {
        this.$emit('error', { error });
        this.reset();
    }

    onVerify() {
        const token = this.hcaptcha.getResponse(this.hcaptchaId);
        const eKey = this.hcaptcha.getRespKey(this.hcaptchaId);
        this.$emit('verified', { token, eKey, key: token });
    }

    onExpired() {
        this.$emit('expired');
    }

    onChallengeExpired() {
        this.$emit('challengeExpired');
    }

    onOpen() {
        this.$emit('opened');
    }

    onClose() {
        this.$emit('closed');
    }
}

customElements.define('h-captcha', HCaptcha);
