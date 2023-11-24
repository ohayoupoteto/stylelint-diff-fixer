# Stylelint Diff Fixer

CLI tool that applies [Stylelint](https://github.com/stylelint/stylelint)'s autofix only to the diff lines in Git.

`.css` and `.scss` file formats are supported.

## Examples

### Before

```diff
.a {
    display: block;
+    color: red;
+    margin: 0px;
+    padding: 0em;
    line-height: 1.2;
}
```

### After

```diff
.a {
    display: block;
+    padding: 0;
+    margin: 0;
+    color: red;
    line-height: 1.2;
}
```

## Usage

### 1. Install

```shell
npm i -D stylelint-diff-fixer
```

### 2. Run

```shell
stylelint-diff-fixer <FILE_PATH>
```

```shell
# specific file
stylelint-diff-fixer style/001.css
FIX  style/001.css (2 hunks)

# glob pattern
stylelint-diff-fixer "style/*.css"
FIX  style/001.css (2 hunks)
FIX  style/002.css (1 hunk)

# all
stylelint-diff-fixer
FIX  style/001.css (2 hunks)
FIX  style/002.css (1 hunk)
FIX  style/sub/001.scss (1 hunk)
```

## Option

```
Arguments:
  filepath    file path to fix (default: "\"*.css\" \"*.scss\"")

Options:
  -h, --help  display help for command
```

## License

[MIT](https://github.com/ohayoupoteto/stylelint-diff-fixer/blob/main/LICENSE)