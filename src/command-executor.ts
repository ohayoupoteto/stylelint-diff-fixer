import { execSync } from 'child_process';

export class CommandExecutor {
  gitAddUncommittedFile(): void {
    execSync('git add --intent-to-add .');
  }

  gitDiff(): string {
    return execSync('git --no-pager diff HEAD -U0 "*.css" "*.scss"').toString();
  }

  gitDiffNameonly(): string {
    return execSync(
      'git --no-pager diff --name-only --line-prefix=$(git rev-parse --show-toplevel)/ "*.css" "*.scss"',
    ).toString();
  }
}
