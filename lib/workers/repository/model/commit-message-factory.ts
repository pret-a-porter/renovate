import type { RenovateSharedConfig } from '../../../config/types';
import type { CommitMessage } from './commit-message';
import { CustomCommitMessage } from './custom-commit-message';
import { SemanticCommitMessage } from './semantic-commit-message';

type CommitMessageConfig = Pick<
  RenovateSharedConfig,
  | 'commitMessagePrefix'
  | 'semanticCommits'
  | 'semanticCommitScope'
  | 'semanticCommitType'
>;

export class CommitMessageFactory {
  private readonly config: CommitMessageConfig;

  constructor(config: CommitMessageConfig) {
    this.config = config;
  }

  create(): CommitMessage {
    const message = this.areSemanticCommitsEnabled
      ? this.createSemanticCommitMessage()
      : this.createCustomCommitMessage();

    return message;
  }

  private createSemanticCommitMessage(): SemanticCommitMessage {
    const message = new SemanticCommitMessage();

    message.setType(this.config.semanticCommitType);
    message.setScope(this.config.semanticCommitScope);

    return message;
  }

  private createCustomCommitMessage(): CustomCommitMessage {
    const message = new CustomCommitMessage();
    message.setPrefix(this.config.commitMessagePrefix);

    return message;
  }

  private get areSemanticCommitsEnabled(): boolean {
    return (
      !this.config.commitMessagePrefix &&
      this.config.semanticCommits === 'enabled'
    );
  }
}
