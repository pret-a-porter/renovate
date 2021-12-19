export interface CommitMessageJSON {
  body?: string;
  footer?: string;
  subject?: string;
}

/**
 * @see https://git-scm.com/docs/git-commit#_discussion
 *
 * [optional prefix]: <suject>
 * [optional body]
 * [optional footer]
 */
export abstract class CommitMessage {
  static readonly SEPARATOR: string = ':';
  private static readonly EXTRA_WHITESPACES = /\s+/g;

  private body?: string;
  private footer?: string;
  private subject?: string;

  toString(): string {
    const parts: ReadonlyArray<string | undefined> = [
      this.title,
      this.body,
      this.footer,
    ];

    return parts.filter(Boolean).join('\n\n');
  }

  get title(): string {
    return [this.formatPrefix(), this.formatSubject()].join(' ').trim();
  }

  toJSON(): CommitMessageJSON {
    return {
      body: this.body,
      footer: this.footer,
      subject: this.subject,
    };
  }

  setBody(body?: string): void {
    this.body = body?.trim();
  }

  setFooter(footer?: string): void {
    this.footer = footer?.trim();
  }

  setSubject(subject?: string): void {
    this.subject = subject?.trim();
    this.subject = this.subject?.replace(CommitMessage.EXTRA_WHITESPACES, ' ');
  }

  formatPrefix(): string {
    if (!this.prefix) {
      return '';
    }

    if (this.prefix.endsWith(CommitMessage.SEPARATOR)) {
      return this.prefix;
    }

    return `${this.prefix}${CommitMessage.SEPARATOR}`;
  }

  formatSubject(): string {
    if (!this.subject) {
      return '';
    }

    if (this.prefix) {
      return this.subject.charAt(0).toLowerCase() + this.subject.slice(1);
    }

    return this.subject.charAt(0).toUpperCase() + this.subject.slice(1);
  }

  protected abstract get prefix(): string;
}
