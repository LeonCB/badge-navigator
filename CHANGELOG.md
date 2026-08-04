# Changelog

Versioning scheme: `yyyy.m.d` — year, month, day of the commit (not a semantic-version
counter). Multiple releases on the same calendar day are not expected to occur; if they
do, bump the day forward rather than reusing it.

## 2026.8.2

- Badge height fixed at 36px, icon backgrounds at 24px, icons at 18x18px.
- Fixed vertical icon alignment (`ha-icon` defaults to `inline-block`, which offset it
  within the 24px circle — switched to `display: flex` with centering).
- Added a `spacing` config option (pixels between icons), default `12`.

## 2026.8.1

- Initial version, as `nav-badge`: single badge rendering a row of navigation
  shortcuts with the active view highlighted.
