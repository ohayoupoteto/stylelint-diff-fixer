import { execSync } from 'child_process';

export class CommandExecutor {
  gitAddUncommittedFile(): void {
    execSync('git add --intent-to-add .');
  }

  gitDiff(filepath: string): string {
    return execSync(
      `git --no-pager diff HEAD -U0 "*.css" "*.scss" ${filepath}`,
    ).toString();
  }

  gitDiffNameonly(filepath: string): string {
    return execSync(
      `git diff --name-only "*.css" "*.scss" ${filepath}`,
    ).toString();
  }

  /**
   * Gitのルートへのフルパスを取得
   */
  gitRootPath(): string {
    return execSync('git rev-parse --show-toplevel').toString().trimEnd();
  }
}
