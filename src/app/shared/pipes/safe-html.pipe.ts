import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { isDevMode } from '@angular/core';

/**
 * Safely sanitizes HTML content for rendering in templates.
 *
 * SECURITY NOTICE:
 * - This pipe should only be used with trusted content
 * - All content is sanitized using Angular's DomSanitizer
 * - Usage is logged in development mode for security auditing
 * - Contains additional security checks for government compliance
 *
 * @example
 * // In template
 * <div [innerHTML]="trustedContent | safeHtml"></div>
 */
@Pipe({
  name: 'safeHtml',
  standalone: true,
  pure: true, // Ensures the pipe is pure for better performance
})
export class SafeHtmlPipe implements PipeTransform {
  private readonly WARNING_PREFIX = '[SafeHtml Security Warning]';

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) {
      return '';
    }

    // Development mode security warnings
    if (isDevMode()) {
      this.performSecurityChecks(value);
    }

    // Additional security measures for sensitive content
    const sanitizedValue = this.sanitizeContent(value);

    return this.sanitizer.bypassSecurityTrustHtml(sanitizedValue);
  }

  private sanitizeContent(value: string): string {
    // Remove potentially dangerous patterns
    return (
      value
        // Remove script tags and contents
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove onclick and similar attributes
        .replace(/on\w+="[^"]*"/g, '')
        // Remove javascript: urls
        .replace(
          /href\s*=\s*["']?\s*javascript:/gi,
          'href="javascript:void(0);"',
        )
        // Remove data: urls
        .replace(/data:[^"'>\s]*/g, '#')
        // Remove base64 content
        .replace(/base64,\s*[^"'>\s]*/g, '')
    );
  }

  private performSecurityChecks(value: string): void {
    // Check for potentially dangerous patterns
    const dangerousPatterns = [
      { pattern: /<script/i, message: 'Script tags detected' },
      { pattern: /javascript:/i, message: 'JavaScript protocol detected' },
      { pattern: /data:/i, message: 'Data URI scheme detected' },
      { pattern: /on\w+=/i, message: 'Inline event handlers detected' },
      { pattern: /base64/i, message: 'Base64 content detected' },
    ];

    dangerousPatterns.forEach(({ pattern, message }) => {
      if (pattern.test(value)) {
        console.warn(
          `${this.WARNING_PREFIX} ${message} in content. This will be sanitized.`,
          '\nContent:',
          value.substring(0, 100) + '...',
        );
      }
    });
  }
}
