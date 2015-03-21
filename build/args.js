var yargs = require('yargs');

var argv = yargs.argv,
    validBumpTypes = "major|minor|patch|prerelease".split("|"),
    bump = (argv.bump || 'patch').toLowerCase();

// semver bump
if(validBumpTypes.indexOf(bump) === -1) {
  throw new Error('Unrecognized semver bump "' + bump + '".');
}
exports.bump = bump;
