# License Boundary

This workspace combines two upstream codebases with different licenses.

## `MiMo-Code/`

MiMo-Code is licensed under the MIT License.

See:

- `MiMo-Code/LICENSE`
- `MiMo-Code/README.md`
- `MiMo-Code/USE_RESTRICTIONS.md`, if present in the source tree

## `oh-my-openagent/`

Oh My OpenAgent / Oh My OpenCode is licensed under the Sustainable Use License 1.0 for its main source, with third-party components remaining under their original licenses.

See:

- `oh-my-openagent/LICENSE.md`
- `oh-my-openagent/package.json`
- `oh-my-openagent/packages/*/LICENSE`, where present

## Combined Workspace

No new blanket license is asserted over both subprojects from the repository root. Each file remains under the license of the subproject it belongs to unless that file states otherwise.

New root-level integration documentation, config templates, publishing notes, and helper scripts in this directory are covered by the root `LICENSE` unless a file states otherwise.

## Maintainer Notes

- Do not treat the root `LICENSE` as relicensing either source tree.
- Do not replace the whole workspace with a single MIT license unless `oh-my-openagent/` is excluded or relicensed by its owner.
- Do not publish generated archives such as `mimo-code.tar.gz` or `omo.tar.gz`.
- Keep upstream copyright and license notices intact.
