function loadHCaptcha(cb) {
    const script = document.createElement('script');
    script.src = 'https://hcaptcha.com/1/api.js?render=explicit';
    script.async = true;
    script.addEventListener('load', cb, true);
    document.head.append(script);
}

function createEvent(eventName) {
    let event;
    if (typeof(Event) === 'function') {
        event = new Event(eventName);
    } else {
        event = document.createEvent('Event');
        event.initEvent(eventName, false, false);
    }
    return event;
}

class HCaptcha extends HTMLElement {
    connectedCallback() {
        const setCaptchaId = () => {
            const opt = {
                sitekey: this.getAttribute('site-key'),
                theme: this.getAttribute('dark') !== null ? 'dark' : 'light',
                size: this.getAttribute('size'),
                tabindex: this.getAttribute('tabindex'),
                callback: (key) => {
                    const event = createEvent('verified');
                    event.key = key;
                    this.dispatchEvent(event);
                },
                "expired-callback": () => {
                    const event = createEvent('expired');
                    this.dispatchEvent(event);
                },
                "error-callback": (error) => {
                    const event = createEvent('error');
                    event.error = error;
                    this.dispatchEvent(event);
                }
            }
            const hcaptchaId = window.hcaptcha.render(this, opt);
            this.render = () => {
                window.hcaptcha.execute(hcaptchaId);
            };
            const event = createEvent('loaded');
            event.hcaptchaId = hcaptchaId;
            this.dispatchEvent(event);
        }

        if (!window.hcaptcha) {
            loadHCaptcha(setCaptchaId.bind(this));
        } else {
            setCaptchaId();
        }
    }
}

customElements.define('h-captcha', HCaptcha);

try {
    module.exports = HCaptcha;
} catch(_) {
}
