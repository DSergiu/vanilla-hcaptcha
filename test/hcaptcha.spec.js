require('../dist/hcaptcha-component.min.js');

describe('hCaptcha Vanilla Web Component', () => {
    const mockCaptchaId = 42069;
    const mockToken = 'mock-hcaptcha-token';
    const mockEkey = 'mock-hcaptcha-ekey';
    let spyOptions = null;

    beforeEach(() => {
        window.hcaptcha = {
            render: (el, opt) => {
                spyOptions = opt;
                return mockCaptchaId;
            },
            getResponse: () => (mockToken),
            getRespKey: () => (mockEkey),
            execute: () => {},
            reset: () => {},
            remove: () => {}
        };
        document.body.innerHTML = `
            <h-captcha id="signupCaptcha"
                       site-key="10000000-ffff-ffff-ffff-000000000001"></h-captcha>`;
    });

    test('Loaded event emission and set of hcaptchaId', () => {
        const spyExecute = jest.spyOn(window.hcaptcha, 'execute');
        const signupCaptcha = document.getElementById('signupCaptcha');
        signupCaptcha.execute();
        expect(spyExecute).toHaveBeenCalledWith(mockCaptchaId);
        spyExecute.mockRestore();
    });

    test('Verified event emission', (done) => {
        const signupCaptcha = document.getElementById('signupCaptcha');
        signupCaptcha.addEventListener('verified', (e) => {
            expect(e.key).toBe(mockToken);
            expect(e.token).toBe(mockToken);
            expect(e.eKey).toBe(mockEkey);
            done();
        });
        spyOptions.callback();
    });

    test('Error event emission', (done) => {
        const mockError = 'invalid-site-key';
        const signupCaptcha = document.getElementById('signupCaptcha');
        signupCaptcha.addEventListener('error', (e) => {
            expect(e.error).toBe(mockError);
            done();
        });
        spyOptions['error-callback'](mockError);
    });

    test('Expired event emission', (done) => {
        const signupCaptcha = document.getElementById('signupCaptcha');
        signupCaptcha.addEventListener('expired', () => {
            done();
        });
        spyOptions['expired-callback']();
    });

    test('Proxy reset method', () => {
        const spyReset = jest.spyOn(window.hcaptcha, 'reset');
        const signupCaptcha = document.getElementById('signupCaptcha');
        signupCaptcha.reset();
        expect(spyReset).toHaveBeenCalledWith(mockCaptchaId);
        spyReset.mockRestore();
    });

    test('Proxy remove method', () => {
        const spyRemove = jest.spyOn(window.hcaptcha, 'remove');
        const signupCaptcha = document.getElementById('signupCaptcha');
        signupCaptcha.remove();
        expect(spyRemove).toHaveBeenCalledWith(mockCaptchaId);
        spyRemove.mockRestore();
    });
});
