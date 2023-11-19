import { execSync } from 'child_process';

export class CommandExecutor {
  gitAddUncommittedFile(): void {
    execSync('git add --intent-to-add .');
  }

  gitDiff(): string {
    return execSync('git --no-pager diff HEAD -U0 "*.css" "*.scss"').toString();
  }

  gitDiffNameonly(): string {
    return execSync('git diff --name-only "*.css" "*.scss"').toString();
  }

  /**
   * Gitのルートへのフルパスを取得
   */
  gitRootPath(): string {
    return execSync('git rev-parse --show-toplevel').toString().trimEnd();
  }
}
