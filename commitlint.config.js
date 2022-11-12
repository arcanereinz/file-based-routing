// @see https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional
// @see https://commitlint.js.org/#/reference-api
// @see https://eslint.org/docs/latest/developer-guide/contributing/pull-requests
// @see https://github.com/conventional-changelog/commitlint/issues/1016
module.exports = {
  extends: ['@commitlint/config-conventional'],
  helpUrl: `https://github.com/conventional-changelog/commitlint/#what-is-commitlint

    * Bad commit message *

    Message must be in the format "[jira-ticket]: [tag]([scope-optional]): [subject]"
      ENG-1234: convert app to itn for api paths
      ENG-1235: fix: drop-down does not appear [tag with fix to indicate bug fix]
      ENG-1236: test(cadence): fix broken test for getToken [changes scoped to cadence]
      ENG-1237: feat(business-sms)!: fetch messages in bulk [use exclamation for major changes]

    List of tags (use ! after tag for major changes, eg. "feat!: msg" or "feat(scope)!: msg")
      fix - for a bug fix.
      feat - either for a backwards-compatible enhancement or for a rule change that adds reported problems.
      docs - changes to documentation only.
      chore - for changes that aren't user-facing.
      build - changes to build process only.
      refactor - a change that doesn't affect APIs or user experience.
      test - just changes to test files.
      ci - changes to our CI configuration files and scripts.
      test - changes to unit, integration, or end-to-end tests.
      revert - revert previous commit.
      style - changes to css or page layout.
      perf - a code change that improves performance.`,
  parserPreset: {
    parserOpts: {
      headerPattern: /^(?:[A-Z]{1,4}-[0-9]{1,4}:?\s*)?(\w+)?(?:\((.*)\)!?)?:\s*(.+)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      issuePrefixes: ['^[A-Z]{1,4}-[0-9]{1,4}'],
    },
  },
  rules: {
    'type-enum': [
      2,
      'always',
      ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', ':'],
    ],
    'type-empty': [1, 'never'],
    'subject-case': [0],
    'subject-full-stop': [0],
  },
}
