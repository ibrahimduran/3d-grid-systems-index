# 3d-grid-systems-index

Tracks search result counts for some popular grid systems across major 3D model sharing platforms as a rough indicator of community activity. Counts may vary due to platform-specific search limitations.

<!-- BEGIN RESULTS -->

| Source      | gridfinity                                                          | skadis                                                          | multiboard                                                          | opengrid                                                          |
| ----------- | ------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| printables  | [10,000](https://www.printables.com/search?q=gridfinity)            | [10,000](https://www.printables.com/search?q=skadis)            | [2,903](https://www.printables.com/search?q=multiboard)             | [465](https://www.printables.com/search?q=opengrid)               |
| makerworld  | [4,490](https://makerworld.com/en/search/models?keyword=gridfinity) | [4,337](https://makerworld.com/en/search/models?keyword=skadis) | [3,156](https://makerworld.com/en/search/models?keyword=multiboard) | [1,632](https://makerworld.com/en/search/models?keyword=opengrid) |
| thangs      | [3,601](https://thangs.com/search/gridfinity)                       | [351](https://thangs.com/search/skadis)                         | [7,271](https://thangs.com/search/multiboard)                       | [1](https://thangs.com/search/opengrid)                           |
| thingiverse | [2,037](https://www.thingiverse.com/search?q=gridfinity)            | [4,972](https://www.thingiverse.com/search?q=skadis)            | [395](https://www.thingiverse.com/search?q=multiboard)              | [21](https://www.thingiverse.com/search?q=opengrid)               |
| **Total**   | **20,128**                                                          | **19,660**                                                      | **13,725**                                                          | **2,119**                                                         |

<!-- END RESULTS -->

## How the pipeline works

1. `yarn refresh-data` runs each source search function for each configured query.
2. Results are persisted as array of `{ source, query, count }` records.
3. `yarn update-readme` reads `data.json` and renders the overview table above.

## License

This project is licensed under the terms in [LICENSE](LICENSE).
