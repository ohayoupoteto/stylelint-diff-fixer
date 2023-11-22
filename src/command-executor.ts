import { execSync } from 'child_process';

export class CommandExecutor {
  gitAddUncommittedFile(): void {
    this.exec('git add --intent-to-add .');
  }

  gitDiff(filepath: string): string {
    return this.exec(
      `git --no-pager diff HEAD -U0 ${this.getFilepathPattern(filepath)}`,
    );
  }

  gitDiffNameonly(filepath: string): string {
    return this.exec(
      `git --no-pager diff HEAD --name-only ${this.getFilepathPattern(
        filepath,
      )}`,
    );
  }

  /**
   * Gitのルートへのフルパスを取得
   */
  gitRootPath(): string {
    return this.exec('git rev-parse --show-toplevel').trimEnd();
  }

  private exec(command: string): string {
    try {
      return execSync(command).toString();
    } catch (e: unknown) {
      if (this.hasStderr(e)) process.exit(1);
      throw e;
    }
  }

  private hasStderr(err: any): err is { stderr: Buffer } {
    return !!err.stderr;
  }

  private getFilepathPattern(filepath: string): string {
    return filepath || '"*.css" "*.scss"';
  }
}
