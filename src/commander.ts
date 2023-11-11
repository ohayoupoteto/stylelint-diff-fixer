import { execSync } from 'child_process';

export class Commander {
  gitDiff(): string {
    return execSync('git diff -U0').toString();
  }

  gitDiffNameonly(): string {
    return execSync('git diff --name-only').toString();
  }
}
