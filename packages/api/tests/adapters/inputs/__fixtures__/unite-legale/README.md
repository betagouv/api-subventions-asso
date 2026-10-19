## OLD FILE

The old-unite-legale.parquet file contains :

- 1 (the first, 100000001) belong to a company (should not be persisted)
- 2 lines with rna defined (100000002 and 100000003)
- 1 line without rna (100000004)

All the lines belongs to the 2024 year (dateDernierTraitementUniteLegale = 2024)

## LATEST FILE

The latest-unite-legale.parquet file contains :

- 1 (the first, 100000001) belong to a company (should not be persisted)
- 4 lines with rna defined (100000002, 100000003, 100000004, 100000005)

The first 3 lines belongs to the 2024 year; the last two belongs to the 2025 year.
This is useful to test the updates from old to latest file on the last two lines.
