import { SafeHtmlPipe } from './safe-html.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { SecurityContext } from '@angular/core';

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;
  let sanitizer: DomSanitizer;
  let consoleSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SafeHtmlPipe],
    });

    sanitizer = TestBed.inject(DomSanitizer);
    pipe = new SafeHtmlPipe(sanitizer);
    consoleSpy = spyOn(console, 'warn');
  });

  afterEach(() => {
    consoleSpy.calls.reset();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null/undefined input', () => {
    expect(sanitizer.sanitize(SecurityContext.HTML, pipe.transform(''))).toBe(
      '',
    );
    expect(
      sanitizer.sanitize(SecurityContext.HTML, pipe.transform(null!)),
    ).toBe('');
    expect(
      sanitizer.sanitize(SecurityContext.HTML, pipe.transform(undefined!)),
    ).toBe('');
  });

  it('should allow safe HTML content', () => {
    const safeHtml = '<p>Hello</p><strong>World</strong>';
    const result = pipe.transform(safeHtml);
    expect(sanitizer.sanitize(SecurityContext.HTML, result)).toBe(safeHtml);
  });

  it('should sanitize script tags', () => {
    const dangerous = '<p>Hello</p><script>alert("hack")</script>';
    const result = pipe.transform(dangerous);
    expect(sanitizer.sanitize(SecurityContext.HTML, result)).toBe(
      '<p>Hello</p>',
    );
  });

  it('should remove inline event handlers', () => {
    const dangerous = '<button onclick="alert()">Click</button>';
    const result = pipe.transform(dangerous);
    expect(sanitizer.sanitize(SecurityContext.HTML, result)).toBe(
      '<button>Click</button>',
    );
  });

  it('should sanitize javascript: URLs', () => {
    const dangerous = '<a href="javascript:alert()">Link</a>';
    const result = pipe.transform(dangerous);
    expect(sanitizer.sanitize(SecurityContext.HTML, result)).toBe(
      '<a href="javascript:void(0);">Link</a>',
    );
  });

  it('should remove data: URLs', () => {
    const dangerous = '<img src="data:image/jpeg;base64,AAAA">';
    const result = pipe.transform(dangerous);
    expect(sanitizer.sanitize(SecurityContext.HTML, result)).toBe(
      '<img src="#">',
    );
  });

  it('should remove base64 content', () => {
    const dangerous = 'content:base64,R0lGODlhAQABAIAAAAAAAP';
    const result = pipe.transform(dangerous);
    expect(sanitizer.sanitize(SecurityContext.HTML, result)).toBe('content:');
  });

  it('should warn about dangerous content in development mode', () => {
    const dangerous = '<script>alert("hack")</script>';
    pipe.transform(dangerous);

    expect(consoleSpy).toHaveBeenCalledWith(
      jasmine.stringContaining('[SafeHtml Security Warning]'),
      jasmine.any(String),
      jasmine.any(String),
    );
  });

  it('should handle complex nested HTML structures', () => {
    const complex = `
      <div class="container">
        <h1>Title</h1>
        <p onclick="hack()">Text</p>
        <script>alert()</script>
        <img src="data:image/jpeg;base64,AAAA">
        <a href="javascript:alert()">Link</a>
      </div>
    `;
    const result = pipe.transform(complex);
    const sanitized = sanitizer.sanitize(SecurityContext.HTML, result);

    expect(sanitized).toContain('<div class="container">');
    expect(sanitized).toContain('<h1>Title</h1>');
    expect(sanitized).toContain('<p>Text</p>');
    expect(sanitized).not.toContain('onclick');
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('data:image');
    expect(sanitized).not.toContain('javascript:alert()');
  });

  describe('Government Compliance', () => {
    it('should maintain HTML structure required for government documents', () => {
      const govDoc = `
        <div class="gov-header">
          <img src="/assets/gov-logo.png" alt="Government Logo">
          <h1 class="gov-title">Official Document</h1>
        </div>
        <div class="gov-content">
          <p>Official content</p>
          <table class="gov-table">
            <tr><td>Data</td></tr>
          </table>
        </div>
      `;
      const result = pipe.transform(govDoc);
      expect(sanitizer.sanitize(SecurityContext.HTML, result)).toBe(
        govDoc.trim(),
      );
    });

    it('should preserve accessibility attributes', () => {
      const accessible = '<button aria-label="Close" role="button">×</button>';
      const result = pipe.transform(accessible);
      expect(sanitizer.sanitize(SecurityContext.HTML, result)).toBe(accessible);
    });
  });
});
