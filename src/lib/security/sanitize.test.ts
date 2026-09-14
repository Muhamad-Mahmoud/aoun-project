import { sanitizeHtml, sanitizeUrl, sanitizeText } from './sanitize';

describe('sanitizeHtml', () => {
    it('escapes the 5 HTML-significant chars', () => {
        expect(sanitizeHtml('<script>alert("x")</script>')).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
        expect(sanitizeHtml("it's & that")).toBe('it&#x27;s &amp; that');
    });

    it('does NOT escape forward slashes (URLs stay intact)', () => {
        expect(sanitizeHtml('https://a.com/b/c')).toBe('https://a.com/b/c');
    });

    it('returns empty string for empty input', () => {
        expect(sanitizeHtml('')).toBe('');
    });
});

describe('sanitizeUrl', () => {
    it.each([
        ['https://example.com/x', 'https://example.com/x'],
        ['http://127.0.0.1:5204/api', 'http://127.0.0.1:5204/api'],
        ['mailto:a@b.com', 'mailto:a@b.com'],
        ['tel:+20100', 'tel:+20100'],
        ['/dashboard/family', '/dashboard/family'],
        ['#section', '#section'],
    ])('allows %p', (input, expected) => {
        expect(sanitizeUrl(input)).toBe(expected);
    });

    it.each([['javascript:alert(1)'], ['data:text/html,<h1>x</h1>'], ['vbscript:msgbox'], ['ftp://host/x']])(
        'blocks %p',
        (input) => {
            expect(sanitizeUrl(input)).toBe('#');
        },
    );
});

describe('sanitizeText', () => {
    it('trims and escapes', () => {
        expect(sanitizeText('  <b>hi</b>  ', 100)).toBe('&lt;b&gt;hi&lt;/b&gt;');
    });

    it('truncates after escaping', () => {
        expect(sanitizeText('  <b>hi</b>  ', 10)).toHaveLength(10);
    });
});
