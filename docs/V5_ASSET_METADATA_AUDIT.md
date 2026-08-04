# V5 Asset metadata audit

This is a non-runtime review record for the V5 release candidate. Runtime Asset
objects remain intentionally small; the authoritative operational metadata is
stored in each `assets/images/<module>/manifest.json` file.

## Completed review

The audit resolves 58 records that previously used `license: "needs review"`:

- 29 Metropolitan Museum of Art object images were checked against the Met
  collection API and Open Access policy. Each reviewed object reports
  `isPublicDomain: true`; the manifest records these derivatives as `CC0`.
- 13 Wikimedia Commons uses were checked against their individual file pages.
  The manifest now records the file-specific creator and license rather than a
  generic Commons attribution.
- The Museo Egizio strike-papyrus image is recorded as `CC0` under the Museo
  Egizio / Turin Papyrus Online Platform image policy.
- The 1916 KBo 1.14 facsimile is recorded as public domain.
- Eleven project-generated images are now consistently marked
  `origin: "aiGenerated"`, with the generation role separated from the
  historical sources that informed the image.
- The National Museum of China image of the Guoji Zibai pan was replaced by a
  reviewed [Gary Todd full-object photograph](https://commons.wikimedia.org/wiki/File:Western_Zhou_Bronze_Pan_(9830469116).jpg),
  available under CC0.
- The Henan provincial aerial image of the Yinxu royal tombs was replaced,
  after explicit user approval, by an
  [xiquinhosilva exhibit photograph](https://commons.wikimedia.org/wiki/File:Yinxu_Royal_Tombs_(53565371094).jpg)
  available under CC BY 2.0.
- The Sanxingdui Museum collection image of the bronze sacred tree was
  replaced, after explicit user approval, by
  [Siyuwj's full-tree photograph](https://commons.wikimedia.org/wiki/File:三星堆出土青铜神树,_2017-09-17.jpg),
  available under CC BY-SA 4.0.

The one-time, explicit metadata migration is
`scripts/migrate-v5-asset-metadata-audit.js`. It refuses to finish if the
reviewed count or remaining unresolved set changes unexpectedly.

## Replacement review record

The final unresolved file had a useful provenance page but no confirmed
reusable image license. Its replacement decision is retained here so future
audits do not repeat or silently reverse the review:

| Asset | Previous source | Reviewed replacement candidates and outcome |
| --- | --- | --- |
| `asset-sxd-bronze-tree` | Sanxingdui Museum collection page | Gary Todd's CC0 detail photographs and Zerone's low-resolution public-domain full view were rejected during review. The approved replacement is [Siyuwj's full-tree photograph](https://commons.wikimedia.org/wiki/File:三星堆出土青铜神树,_2017-09-17.jpg), CC BY-SA 4.0, selected after comparison with Tyg728's wider full-tree view. It preserves the complete tree and base with fewer exhibition distractions. |

Replacement is complete: actual-image approval was recorded, runtime source
IDs and alt text were synchronized, the WebP derivative and digest were
regenerated, and desktop and mobile presentation were rechecked.
