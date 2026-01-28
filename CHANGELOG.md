# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.78.0](https://github.com/betagouv/api-subventions-asso/compare/v0.77.2...v0.78.0) (2026-01-28)

### Bug Fixes

- **api, front:** [#3773](https://github.com/betagouv/api-subventions-asso/issues/3773) fix migration ([54fbf0e](https://github.com/betagouv/api-subventions-asso/commit/54fbf0ee55f6d7a0b857480aae302a1de9768eb3))
- **api, front:** [#3773](https://github.com/betagouv/api-subventions-asso/issues/3773) truncate scdl error in deposit log ([#3778](https://github.com/betagouv/api-subventions-asso/issues/3778)) ([31eaec3](https://github.com/betagouv/api-subventions-asso/commit/31eaec3aee9100dd43b8ead9c0dd92167c111f55))
- **api:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) populate new ScdlParsedInfos structure ([965c96b](https://github.com/betagouv/api-subventions-asso/commit/965c96bb1cc4a01ae25ff54b3c861160d9ffe159))
- **api:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) use bulk write ops instead of aggregate merge ([#3780](https://github.com/betagouv/api-subventions-asso/issues/3780)) ([fe039f0](https://github.com/betagouv/api-subventions-asso/commit/fe039f02252421a03523052b4114aaf58bc41354))
- **api:** [#3773](https://github.com/betagouv/api-subventions-asso/issues/3773) error deposit log ([#3781](https://github.com/betagouv/api-subventions-asso/issues/3781)) ([a24bd4e](https://github.com/betagouv/api-subventions-asso/commit/a24bd4e86687d97da34f14c65c08e3f7a04541fe))
- **front:** make button sort in dashboard behave independently ([b9939cb](https://github.com/betagouv/api-subventions-asso/commit/b9939cb0229818ebca71bc950622d04b0598249a))
- **front:** remove console log ([25d3bc0](https://github.com/betagouv/api-subventions-asso/commit/25d3bc0f6e00555706ff068e6817d4107fd587e8))

### Features

- [#3775](https://github.com/betagouv/api-subventions-asso/issues/3775) replace rm -rf with rimraf in scripts ([#3776](https://github.com/betagouv/api-subventions-asso/issues/3776)) ([4b9c6b4](https://github.com/betagouv/api-subventions-asso/commit/4b9c6b458fd111ee1a795d4c4b0d8c21ecc68ee5))
- **api, front:** [#3777](https://github.com/betagouv/api-subventions-asso/issues/3777) prevent parse when mandatory headers ([#3786](https://github.com/betagouv/api-subventions-asso/issues/3786)) ([3954149](https://github.com/betagouv/api-subventions-asso/commit/3954149b6d998e1d9f46032bf88f666f6342feed))
- **api:** [#3732](https://github.com/betagouv/api-subventions-asso/issues/3732) download grants in scdl format ([#3794](https://github.com/betagouv/api-subventions-asso/issues/3794)) ([4822b08](https://github.com/betagouv/api-subventions-asso/commit/4822b08b0d44116580cad31f0c2c3a63e2347fcb))
- **api:** [#3766](https://github.com/betagouv/api-subventions-asso/issues/3766) add name to datalog collection ([#3771](https://github.com/betagouv/api-subventions-asso/issues/3771)) ([f0ec929](https://github.com/betagouv/api-subventions-asso/commit/f0ec929c42e2d700f4e80998269fa8ca05b554a9))
- **api:** [#3767](https://github.com/betagouv/api-subventions-asso/issues/3767) dump datalog in metabase ([#3796](https://github.com/betagouv/api-subventions-asso/issues/3796)) ([e72e838](https://github.com/betagouv/api-subventions-asso/commit/e72e83853d39669b14777ee147c22d8506a9e30a))
- **api:** [#3769](https://github.com/betagouv/api-subventions-asso/issues/3769) notify deposit scdl on mattermost ([#3793](https://github.com/betagouv/api-subventions-asso/issues/3793)) ([6b5dc85](https://github.com/betagouv/api-subventions-asso/commit/6b5dc850bb104884636954899aec0b2fd118df79))
- **api:** [#3772](https://github.com/betagouv/api-subventions-asso/issues/3772) add debouncing on notify lost connection ([#3810](https://github.com/betagouv/api-subventions-asso/issues/3810)) ([b13c822](https://github.com/betagouv/api-subventions-asso/commit/b13c822fc4d97d4501284a86c98cb521b9a1e949))
- **front:** [#3679](https://github.com/betagouv/api-subventions-asso/issues/3679) add tooltips to grant dashboard ([#3779](https://github.com/betagouv/api-subventions-asso/issues/3779)) ([bdc004b](https://github.com/betagouv/api-subventions-asso/commit/bdc004b086c8ddc200ac54416331132e275a8489))
- **front:** [#3730](https://github.com/betagouv/api-subventions-asso/issues/3730) add error alert if parse fail ([#3751](https://github.com/betagouv/api-subventions-asso/issues/3751)) ([282350f](https://github.com/betagouv/api-subventions-asso/commit/282350f98229f2a7fc89ef6e3f3eeb7ebb598ea6))
- **front:** [#3731](https://github.com/betagouv/api-subventions-asso/issues/3731) add global error alert ([#3762](https://github.com/betagouv/api-subventions-asso/issues/3762)) ([b1098ef](https://github.com/betagouv/api-subventions-asso/commit/b1098efdad8662d6b3f043d8c560b654c1369df9))
- **front:** [#3770](https://github.com/betagouv/api-subventions-asso/issues/3770) display grant without budgetary year ([#3792](https://github.com/betagouv/api-subventions-asso/issues/3792)) ([87c352c](https://github.com/betagouv/api-subventions-asso/commit/87c352c034b6ab963cfd908ef157e718ddb82220))
- **front:** [#3795](https://github.com/betagouv/api-subventions-asso/issues/3795) truncate multiple siret ([#3798](https://github.com/betagouv/api-subventions-asso/issues/3798)) ([027f6fc](https://github.com/betagouv/api-subventions-asso/commit/027f6fc55f2b5aa0128efa3246d2028ecc3d0778))

## [0.77.3](https://github.com/betagouv/api-subventions-asso/compare/v0.77.2...v0.77.3) (2026-01-13)

### Bug Fixes

- **api, front:** [#3773](https://github.com/betagouv/api-subventions-asso/issues/3773) truncate scdl error in deposit log ([b022bf8](https://github.com/betagouv/api-subventions-asso/commit/b022bf8d997ec7441b8eb098f590188a4f1ad281))
- **api, front:** [#3773](https://github.com/betagouv/api-subventions-asso/issues/3773) truncate scdl error in deposit log ([7bdfce3](https://github.com/betagouv/api-subventions-asso/commit/7bdfce3eaab5e09e473360457555ce5e000772cf))
- **api, front:** [#3773](https://github.com/betagouv/api-subventions-asso/issues/3773) truncate scdl error in deposit log ([0b8b496](https://github.com/betagouv/api-subventions-asso/commit/0b8b49682ec50dda923cd7f6ce9f044c1973fe69))

## [0.77.2](https://github.com/betagouv/api-subventions-asso/compare/v0.77.1...v0.77.2) (2026-01-06)

### Bug Fixes

- **front:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) parse error routing on step 4 ([ca841ea](https://github.com/betagouv/api-subventions-asso/commit/ca841eaa7538ad46c17197bfabd9ea2bf230ec0a))

## [0.77.1](https://github.com/betagouv/api-subventions-asso/compare/v0.77.0...v0.77.1) (2026-01-05)

### Bug Fixes

- **api:** [#3764](https://github.com/betagouv/api-subventions-asso/issues/3764) grant extract with subventia application ([#3763](https://github.com/betagouv/api-subventions-asso/issues/3763)) ([66211a6](https://github.com/betagouv/api-subventions-asso/commit/66211a6573a91b8fa598ffb61e88ccd6358fcbfd))

# [0.77.0](https://github.com/betagouv/api-subventions-asso/compare/v0.76.7...v0.77.0) (2025-12-18)

### Bug Fixes

- **api:** [#3664](https://github.com/betagouv/api-subventions-asso/issues/3664) fix cors problem at authentication ([#3753](https://github.com/betagouv/api-subventions-asso/issues/3753)) ([304dc4e](https://github.com/betagouv/api-subventions-asso/commit/304dc4e60005e95c2a144d823cb1a978c86373a2))
- **api:** eslint configuration ([ac5146f](https://github.com/betagouv/api-subventions-asso/commit/ac5146fe0542a2325c5d1b62900868cbb81ec689))
- **api:** eslint configuration ([8680383](https://github.com/betagouv/api-subventions-asso/commit/8680383a571b5d7fb1664cf53bdd8982dbcea453))

### Features

- **api:** [#3628](https://github.com/betagouv/api-subventions-asso/issues/3628) added deposit file saving in s3 storage and manage d… ([#3747](https://github.com/betagouv/api-subventions-asso/issues/3747)) ([5e6949a](https://github.com/betagouv/api-subventions-asso/commit/5e6949ab71e43ca4720040dc49881426906bf70c))
- **front:** [#3734](https://github.com/betagouv/api-subventions-asso/issues/3734) resume form with file storage ([#3749](https://github.com/betagouv/api-subventions-asso/issues/3749)) ([08c89f8](https://github.com/betagouv/api-subventions-asso/commit/08c89f86fd7365e7f55bb8cd7191619e53c018bd))
- **front:** [#3746](https://github.com/betagouv/api-subventions-asso/issues/3746) implement use s3 storage ([#3750](https://github.com/betagouv/api-subventions-asso/issues/3750)) ([600f20f](https://github.com/betagouv/api-subventions-asso/commit/600f20f629bb1838a0bc16f5f39d9aa6484bc641))

## [0.76.7](https://github.com/betagouv/api-subventions-asso/compare/v0.76.6...v0.76.7) (2025-12-18)

### Bug Fixes

- **front:** fix mm/dd/yy date formating ([13284ae](https://github.com/betagouv/api-subventions-asso/commit/13284ae54b90ca693888d2b363f5f00062611d7e))
- **front:** numberToEuro with null ([8965466](https://github.com/betagouv/api-subventions-asso/commit/89654660a8eb8770a19b0f30bbb55073fb21617f))

### Features

- **api:** add fonjep cli app flat initialization ([63b71cd](https://github.com/betagouv/api-subventions-asso/commit/63b71cda8a1c0fbdad95305c470cc4cdc0512cfc))

## [0.76.6](https://github.com/betagouv/api-subventions-asso/compare/v0.76.5...v0.76.6) (2025-12-17)

### Bug Fixes

- **api:** eslint configuration ([f4d4d4b](https://github.com/betagouv/api-subventions-asso/commit/f4d4d4b5300b493cd8cec5d66b1453145cd42924))
- **front:** display attribuant name in instructor column for scdl data ([6005491](https://github.com/betagouv/api-subventions-asso/commit/6005491f64c592c0e4cd5cdb4d28144efa842848))
- **front:** hide payment row if payments is an empty array ([a8a69a2](https://github.com/betagouv/api-subventions-asso/commit/a8a69a2e857fcedfbfda39e3aa2b7b7aba141c4f))

## [0.76.5](https://github.com/betagouv/api-subventions-asso/compare/v0.76.4...v0.76.5) (2025-12-11)

### Features

- **api:** enable deposit log ([843bb41](https://github.com/betagouv/api-subventions-asso/commit/843bb417a2d2cb10888faae8b77050ddefb16e2e))

## [0.76.4](https://github.com/betagouv/api-subventions-asso/compare/v0.76.3...v0.76.4) (2025-12-10)

### Bug Fixes

- **api:** cast fonjep old siret to string ([af75820](https://github.com/betagouv/api-subventions-asso/commit/af75820fd738db18ba55fe4cddfb1022be939c63))
- **api:** force commonjs module resolution ([9135117](https://github.com/betagouv/api-subventions-asso/commit/913511776551b99575efe46d96f081af57a14f37))

## [0.76.3](https://github.com/betagouv/api-subventions-asso/compare/v0.76.2...v0.76.3) (2025-12-10)

### Bug Fixes

- **api:** ts test issues and scdl app flat backup bulk ops ([6d9d433](https://github.com/betagouv/api-subventions-asso/commit/6d9d43315bbc4a851962323ee6b5f960747ddd45))

## [0.76.2](https://github.com/betagouv/api-subventions-asso/compare/v0.76.1...v0.76.2) (2025-12-10)

### Bug Fixes

- **api:** scdl batch import async for each ([cf7b09f](https://github.com/betagouv/api-subventions-asso/commit/cf7b09fd90c56e0ad4bdc3dde3567a8cdcaa66c6))

## [0.76.1](https://github.com/betagouv/api-subventions-asso/compare/v0.76.0...v0.76.1) (2025-12-09)

### Bug Fixes

- **api:** remove slug from producers and fix batch ([cd7a5da](https://github.com/betagouv/api-subventions-asso/commit/cd7a5da1269c1f807a2265919fe6e1fc810ca60f))

# [0.76.0](https://github.com/betagouv/api-subventions-asso/compare/v0.75.2...v0.76.0) (2025-12-09)

### Bug Fixes

- **front:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) fix invalid components props ([9a26848](https://github.com/betagouv/api-subventions-asso/commit/9a268487ccfd5704a33e05b34393e34fea4c0d19))

### Features

- **api:** [#3583](https://github.com/betagouv/api-subventions-asso/issues/3583) use flat as application and grant provider ([#3645](https://github.com/betagouv/api-subventions-asso/issues/3645)) ([3b74f3c](https://github.com/betagouv/api-subventions-asso/commit/3b74f3cfedf21133ce04f893edaea25a0c685ddb))
- **api:** [#3677](https://github.com/betagouv/api-subventions-asso/issues/3677) add new grant entrypoint with flats ([#3726](https://github.com/betagouv/api-subventions-asso/issues/3726)) ([f352eff](https://github.com/betagouv/api-subventions-asso/commit/f352effcd4e752394ce4fb9bbaf516ddf8d6f309))
- **api:** [#3678](https://github.com/betagouv/api-subventions-asso/issues/3678) use grants v2 dashboard ([#3735](https://github.com/betagouv/api-subventions-asso/issues/3735)) ([72e468b](https://github.com/betagouv/api-subventions-asso/commit/72e468bf176da905a12a6cc64672894aa6e77f0b))
- **front:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) open links in new tab ([#3727](https://github.com/betagouv/api-subventions-asso/issues/3727)) ([0464246](https://github.com/betagouv/api-subventions-asso/commit/046424642a07e4305aa7781aafba3eee0de8d4dd))

## [0.75.2](https://github.com/betagouv/api-subventions-asso/compare/v0.75.1...v0.75.2) (2025-11-20)

### Bug Fixes

- **api:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) prevent blocking errors and adding code coverage ([#3718](https://github.com/betagouv/api-subventions-asso/issues/3718)) ([b03c470](https://github.com/betagouv/api-subventions-asso/commit/b03c4707788014d21ec50f1b357ad7ed3fb79737))
- **front:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) add siret into input ([#3722](https://github.com/betagouv/api-subventions-asso/issues/3722)) ([22a390e](https://github.com/betagouv/api-subventions-asso/commit/22a390e6e1a0fabdf514da77e5b2689459192ddd))
- **front:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) encoding detection algo ([#3719](https://github.com/betagouv/api-subventions-asso/issues/3719)) ([f597793](https://github.com/betagouv/api-subventions-asso/commit/f597793d07039ca4f78ea05eb094160c56503530))

### Features

- **api:** [#3703](https://github.com/betagouv/api-subventions-asso/issues/3703) committee stats ([#3716](https://github.com/betagouv/api-subventions-asso/issues/3716)) ([bdf8998](https://github.com/betagouv/api-subventions-asso/commit/bdf89985ec2233d42b551d010f27ed37ac4ae30b))

## [0.75.1](https://github.com/betagouv/api-subventions-asso/compare/v0.75.0...v0.75.1) (2025-11-17)

### Bug Fixes

- **font:** spelling mistakes correction ([f542512](https://github.com/betagouv/api-subventions-asso/commit/f54251212d549f8f6b2647db2956861bc33e1685))

# [0.75.0](https://github.com/betagouv/api-subventions-asso/compare/v0.74.0...v0.75.0) (2025-11-17)

### Bug Fixes

- **api:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) fix multer not found in express namespace ([#3707](https://github.com/betagouv/api-subventions-asso/issues/3707)) ([1566f3c](https://github.com/betagouv/api-subventions-asso/commit/1566f3cc01d962aad8b3c64db3a4a436f85adc24))
- **api:** multer type config ([0605f74](https://github.com/betagouv/api-subventions-asso/commit/0605f7420c1b8f0fa39f26105d4b4dcbc4c6f6f3))
- **api:** reapply multer type with express fix ([09c46d4](https://github.com/betagouv/api-subventions-asso/commit/09c46d4328aca9874138c1cfe995fb3522cc40ca))
- **api:** update sirene stock unite legal url download ([cd4b852](https://github.com/betagouv/api-subventions-asso/commit/cd4b8520d8f78e2aeb852be27b1cb2bdd144fda2))
- **front:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) customize spinner message ([#3715](https://github.com/betagouv/api-subventions-asso/issues/3715)) ([d06a3df](https://github.com/betagouv/api-subventions-asso/commit/d06a3dfed0a5346a1ee93cb7fc8f4538b3423a76))

### Features

- **api:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) update mapper for beneficiary name and siret ([#3711](https://github.com/betagouv/api-subventions-asso/issues/3711)) ([cc0fa35](https://github.com/betagouv/api-subventions-asso/commit/cc0fa3558162333219d36d6f4d0857eacb661b31))
- **api:** [#3620](https://github.com/betagouv/api-subventions-asso/issues/3620) cron warn user after partial deposit ([#3681](https://github.com/betagouv/api-subventions-asso/issues/3681)) ([7657bc4](https://github.com/betagouv/api-subventions-asso/commit/7657bc488512f34a6eb03577fceb4934096ed636))
- **api:** [#3621](https://github.com/betagouv/api-subventions-asso/issues/3621) warn team on users unfinished deposit ([#3695](https://github.com/betagouv/api-subventions-asso/issues/3695)) ([35cfd88](https://github.com/betagouv/api-subventions-asso/commit/35cfd889698f49a9bce74c5cce45055dd274a282))
- **api:** [#3624](https://github.com/betagouv/api-subventions-asso/issues/3624) step 4 api: ([#3693](https://github.com/betagouv/api-subventions-asso/issues/3693)) ([4a7b75d](https://github.com/betagouv/api-subventions-asso/commit/4a7b75d09e5de490e1b088e0d8e3093da777a37a))
- **api:** [#3625](https://github.com/betagouv/api-subventions-asso/issues/3625) add userId-into-data-log ([#3714](https://github.com/betagouv/api-subventions-asso/issues/3714)) ([cc270c1](https://github.com/betagouv/api-subventions-asso/commit/cc270c1485b526109a36e9d7dbddb3e761e8982b))
- **api:** [#3652](https://github.com/betagouv/api-subventions-asso/issues/3652) [#3666](https://github.com/betagouv/api-subventions-asso/issues/3666) reconnect db after close and send message ([#3673](https://github.com/betagouv/api-subventions-asso/issues/3673)) ([f5de893](https://github.com/betagouv/api-subventions-asso/commit/f5de893fb1df08fe15711820ef2b69f00f5554b6))
- **api:** [#3670](https://github.com/betagouv/api-subventions-asso/issues/3670) shrink init flat to lower process time ([#3671](https://github.com/betagouv/api-subventions-asso/issues/3671)) ([b3fe737](https://github.com/betagouv/api-subventions-asso/commit/b3fe7378904119fc29fdefa42525fb2f62a31d19))
- **api:** [#3699](https://github.com/betagouv/api-subventions-asso/issues/3699) bis - create producer by siret ([#3706](https://github.com/betagouv/api-subventions-asso/issues/3706)) ([e744b75](https://github.com/betagouv/api-subventions-asso/commit/e744b75a17391110f121142ba1d237b44d995ae3))
- **api:** [#3701](https://github.com/betagouv/api-subventions-asso/issues/3701) notify after scdl import ([#3702](https://github.com/betagouv/api-subventions-asso/issues/3702)) ([ae1fe86](https://github.com/betagouv/api-subventions-asso/commit/ae1fe8675666ebedb6e9462f5024dd763053143c))
- **api:** [#3704](https://github.com/betagouv/api-subventions-asso/issues/3704) import batch scdl ([#3708](https://github.com/betagouv/api-subventions-asso/issues/3708)) ([f8fa6e1](https://github.com/betagouv/api-subventions-asso/commit/f8fa6e18d8e58d4040c0cdf80389385157e4310b))
- **api:** [#3712](https://github.com/betagouv/api-subventions-asso/issues/3712) persist deposit scdl file ([#3713](https://github.com/betagouv/api-subventions-asso/issues/3713)) ([36ce362](https://github.com/betagouv/api-subventions-asso/commit/36ce3624ff294dd9e0384bb98858593de65b3bb6))
- **back:** [#3655](https://github.com/betagouv/api-subventions-asso/issues/3655) deposit logs cron metabase ([#3675](https://github.com/betagouv/api-subventions-asso/issues/3675)) ([c2b1034](https://github.com/betagouv/api-subventions-asso/commit/c2b10342bf6aaf9e63dcfbad3b1fcc2fcf5a3cf6))
- **front, api:** [#3626](https://github.com/betagouv/api-subventions-asso/issues/3626) step 4 front ([#3709](https://github.com/betagouv/api-subventions-asso/issues/3709)) ([15c93fd](https://github.com/betagouv/api-subventions-asso/commit/15c93fd3c8f607c0edc4ed75c889fbaa753470e6))
- **front:** [#3623](https://github.com/betagouv/api-subventions-asso/issues/3623) deposit process step 3 ([#3690](https://github.com/betagouv/api-subventions-asso/issues/3690)) ([4efacde](https://github.com/betagouv/api-subventions-asso/commit/4efacdeaaeb6cbd90600c252c7b21634d90867cf))
- **front:** [#3634](https://github.com/betagouv/api-subventions-asso/issues/3634) step 5 front ([#3710](https://github.com/betagouv/api-subventions-asso/issues/3710)) ([1d71ef9](https://github.com/betagouv/api-subventions-asso/commit/1d71ef9602c77d673348e3b14d2b412a83ef3349))
- **front:** [#3636](https://github.com/betagouv/api-subventions-asso/issues/3636) refacto deposit form single page ([#3682](https://github.com/betagouv/api-subventions-asso/issues/3682)) ([5073cb1](https://github.com/betagouv/api-subventions-asso/commit/5073cb1b13d16a687610c46575f02503b7d00060))
- **front:** [#3651](https://github.com/betagouv/api-subventions-asso/issues/3651) update login page design ([#3676](https://github.com/betagouv/api-subventions-asso/issues/3676)) ([a0b46f6](https://github.com/betagouv/api-subventions-asso/commit/a0b46f6ae2732505bb089142b13648462782912d))

# [0.74.0](https://github.com/betagouv/api-subventions-asso/compare/v0.72.4...v0.74.0) (2025-10-08)

### Bug Fixes

- **api:** [#3392](https://github.com/betagouv/api-subventions-asso/issues/3392) replace cast by instance ([#3658](https://github.com/betagouv/api-subventions-asso/issues/3658)) ([bb77f68](https://github.com/betagouv/api-subventions-asso/commit/bb77f68f580f1762e31630fb411d3d7511c98f80))
- **api:** allow disk use for dauphin init application flat ([f616ee0](https://github.com/betagouv/api-subventions-asso/commit/f616ee017a077e6088f725baa9e7ebba343a3b44))
- **api:** increase API call rate limit ([4a35622](https://github.com/betagouv/api-subventions-asso/commit/4a3562251eb0e0fc56c7f518e2057dd0f4c5e866))

### Features

- **api,dto:** [#3275](https://github.com/betagouv/api-subventions-asso/issues/3275) [#3524](https://github.com/betagouv/api-subventions-asso/issues/3524) add http controllers to serve flat data ([#3615](https://github.com/betagouv/api-subventions-asso/issues/3615)) ([6ccd8c5](https://github.com/betagouv/api-subventions-asso/commit/6ccd8c50fb28f842efda0fa8f9eaa240a482df68))
- **api:** [#3507](https://github.com/betagouv/api-subventions-asso/issues/3507) add update date to payment flat ([#3644](https://github.com/betagouv/api-subventions-asso/issues/3644)) ([fcf706c](https://github.com/betagouv/api-subventions-asso/commit/fcf706ca683a638bf3718ee1bbabcd9aa90fb717))
- **api:** [#3583](https://github.com/betagouv/api-subventions-asso/issues/3583) use flat as application and grant provider ([#3645](https://github.com/betagouv/api-subventions-asso/issues/3645)) ([3677c42](https://github.com/betagouv/api-subventions-asso/commit/3677c426bace40c5d868ead16fb04a3acb9f4a74))
- **api:** [#3594](https://github.com/betagouv/api-subventions-asso/issues/3594) ds data to application flat ([#3599](https://github.com/betagouv/api-subventions-asso/issues/3599)) ([16d0ead](https://github.com/betagouv/api-subventions-asso/commit/16d0eadf80fb80205157d5625d7ae6d07fda0e1e))
- **api:** [#3612](https://github.com/betagouv/api-subventions-asso/issues/3612) added scdl exercice path ([#3649](https://github.com/betagouv/api-subventions-asso/issues/3649)) ([0351396](https://github.com/betagouv/api-subventions-asso/commit/0351396173e8d9f934705010f946cf72698eb023))
- **api:** [#3622](https://github.com/betagouv/api-subventions-asso/issues/3622) deposit process set up ([#3659](https://github.com/betagouv/api-subventions-asso/issues/3659)) ([67ba000](https://github.com/betagouv/api-subventions-asso/commit/67ba00048d8ce4e77014b7ef4321d8155565d374))
- **api:** [#3652](https://github.com/betagouv/api-subventions-asso/issues/3652) add CLI methods to test CRONs ([#3669](https://github.com/betagouv/api-subventions-asso/issues/3669)) ([7194d6c](https://github.com/betagouv/api-subventions-asso/commit/7194d6c73febba2114c386ac5a91549f13138955))
- **front:** [#3617](https://github.com/betagouv/api-subventions-asso/issues/3617) homepage deposit route ([#3650](https://github.com/betagouv/api-subventions-asso/issues/3650)) ([b65cafa](https://github.com/betagouv/api-subventions-asso/commit/b65cafaeedf7456ceb622ec981ab5082c7135dce))

# [0.73.0](https://github.com/betagouv/api-subventions-asso/compare/v0.72.1...v0.73.0) (2025-09-03)

### Features

- **api:** [#3594](https://github.com/betagouv/api-subventions-asso/issues/3594) ds data to application flat ([#3599](https://github.com/betagouv/api-subventions-asso/issues/3599)) ([ab30cd1](https://github.com/betagouv/api-subventions-asso/commit/ab30cd17d9b7ccae6024de82ac5a050923e985e9))

## [0.72.4](https://github.com/betagouv/api-subventions-asso/compare/v0.72.3...v0.72.4) (2025-10-01)

### Bug Fixes

- **api:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) payment-flat wrong index on identifier ([#3662](https://github.com/betagouv/api-subventions-asso/issues/3662)) ([589b742](https://github.com/betagouv/api-subventions-asso/commit/589b742f411454f78fefc030b6ed0dbc3685f158))

## [0.72.3](https://github.com/betagouv/api-subventions-asso/compare/v0.72.2...v0.72.3) (2025-09-20)

### Bug Fixes

- **api:** cast exercise to number ([02a5863](https://github.com/betagouv/api-subventions-asso/commit/02a58632c9d292e073d52cc5d89218f8396e8111))

## [0.72.2](https://github.com/betagouv/api-subventions-asso/compare/v0.72.1...v0.72.2) (2025-09-12)

### Bug Fixes

- **api:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) hotfix chorus unique id ([#3640](https://github.com/betagouv/api-subventions-asso/issues/3640)) ([b29d64c](https://github.com/betagouv/api-subventions-asso/commit/b29d64c2bd5f7d1bba3a0c192a74244883e0ee23))

## [0.72.1](https://github.com/betagouv/api-subventions-asso/compare/v0.72.0...v0.72.1) (2025-08-22)

### Bug Fixes

- **api:** make migrations more resilient ([ccd36fb](https://github.com/betagouv/api-subventions-asso/commit/ccd36fb6c68ddbbc4b5a0d9a0bbc4b0a8cbc7821))

# [0.72.0](https://github.com/betagouv/api-subventions-asso/compare/v0.71.0...v0.72.0) (2025-08-21)

### Bug Fixes

- **api:** scdl to flat adapter manages non string type ([baaa77a](https://github.com/betagouv/api-subventions-asso/commit/baaa77a3d5d4c08d7db806bac4e445f30ed15c12))

### Features

- **api:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) create provider data entity ([#3593](https://github.com/betagouv/api-subventions-asso/issues/3593)) ([dd2fc31](https://github.com/betagouv/api-subventions-asso/commit/dd2fc3117c3a0677dd71a5482cc47651acba1e45))
- **api:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) revert not applicable granted amount ([#3601](https://github.com/betagouv/api-subventions-asso/issues/3601)) ([53e0c66](https://github.com/betagouv/api-subventions-asso/commit/53e0c66251c984a920459f10446b73b6c5ed2751))
- **api:** [#2699](https://github.com/betagouv/api-subventions-asso/issues/2699) fonjep application flat ([#3582](https://github.com/betagouv/api-subventions-asso/issues/3582)) ([7d29de7](https://github.com/betagouv/api-subventions-asso/commit/7d29de74653ca594c028c6d1aff4cc082f486c5f))
- **api:** [#3573](https://github.com/betagouv/api-subventions-asso/issues/3573) [#3541](https://github.com/betagouv/api-subventions-asso/issues/3541) dauphin adaptation to application flat ([#3587](https://github.com/betagouv/api-subventions-asso/issues/3587)) ([c1f5400](https://github.com/betagouv/api-subventions-asso/commit/c1f540004254585d4b886d25f85ea33dca19a130))
- **api:** [#3574](https://github.com/betagouv/api-subventions-asso/issues/3574) add subventia to application flat ([#3588](https://github.com/betagouv/api-subventions-asso/issues/3588)) ([9ed2e07](https://github.com/betagouv/api-subventions-asso/commit/9ed2e07fa62de2cd2865f305e003a66a40ab5d66))
- **api:** [#3589](https://github.com/betagouv/api-subventions-asso/issues/3589) osiris to application flat ([#3592](https://github.com/betagouv/api-subventions-asso/issues/3592)) ([ccdd12b](https://github.com/betagouv/api-subventions-asso/commit/ccdd12b06f6ddec2a3c5744fde4bc562d09b3599))
- **api:** [#3602](https://github.com/betagouv/api-subventions-asso/issues/3602) detect and encode scdl files ([#3603](https://github.com/betagouv/api-subventions-asso/issues/3603)) ([f3cd704](https://github.com/betagouv/api-subventions-asso/commit/f3cd704ae7b61d61f83d67d6cd5f510687aac06b))
- **api:** update scdl validation CLI logs ([a77cecb](https://github.com/betagouv/api-subventions-asso/commit/a77cecb30b0fa8a1cd2a2c16292363dd9ed29f90))
- **front:** [#3570](https://github.com/betagouv/api-subventions-asso/issues/3570) redirect signup to home page when logged in ([#3578](https://github.com/betagouv/api-subventions-asso/issues/3578)) ([c850e2d](https://github.com/betagouv/api-subventions-asso/commit/c850e2dd4a7df42d904cef0d7ce15e030cbb3ae5))

# [0.71.0](https://github.com/betagouv/api-subventions-asso/compare/v0.70.6...v0.71.0) (2025-07-24)

### Bug Fixes

- **api:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) do not validate email domain for pro connect users ([#3580](https://github.com/betagouv/api-subventions-asso/issues/3580)) ([0d3146b](https://github.com/betagouv/api-subventions-asso/commit/0d3146b727151f20aae12a36d4906de2c024c816))
- **api:** [#3551](https://github.com/betagouv/api-subventions-asso/issues/3551) disable broken scdl backup ([#3552](https://github.com/betagouv/api-subventions-asso/issues/3552)) ([5887013](https://github.com/betagouv/api-subventions-asso/commit/5887013a91d38c42548d5bd654b7bcdf5fe073f8))
- **api:** [#3553](https://github.com/betagouv/api-subventions-asso/issues/3553) fix payment duplicate collection name and disable payment flat for fonjep ([#3555](https://github.com/betagouv/api-subventions-asso/issues/3555)) ([0eb26f9](https://github.com/betagouv/api-subventions-asso/commit/0eb26f9d43d04111dd549ceb77f805e35d07da66))
- **api:** scdl to flat mapping error ([b20d849](https://github.com/betagouv/api-subventions-asso/commit/b20d8495b947ebd9beac353bf07e1434b15fc831))

### Features

- **api:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) better case managment for finding headers ([#3532](https://github.com/betagouv/api-subventions-asso/issues/3532)) ([3c54c30](https://github.com/betagouv/api-subventions-asso/commit/3c54c3017598474d436b87f61366c5d2b6896663))
- **api:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) give value for application flat nature enum ([#3576](https://github.com/betagouv/api-subventions-asso/issues/3576)) ([ca5af33](https://github.com/betagouv/api-subventions-asso/commit/ca5af33c0f37b730eb9a2a56431c86a4a7bff9b0))
- **api:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) scdl mapper removes spaces in siret ([#3550](https://github.com/betagouv/api-subventions-asso/issues/3550)) ([95fb888](https://github.com/betagouv/api-subventions-asso/commit/95fb8889029d6a232e702cedb812fdd78bf4b274))
- **api:** [#3450](https://github.com/betagouv/api-subventions-asso/issues/3450) [#3538](https://github.com/betagouv/api-subventions-asso/issues/3538) scdl as aplicationFlat ([#3502](https://github.com/betagouv/api-subventions-asso/issues/3502)) ([40dd04e](https://github.com/betagouv/api-subventions-asso/commit/40dd04e52acf406236cf33502f38690ef5a37227))
- **api:** [#3505](https://github.com/betagouv/api-subventions-asso/issues/3505) flat provider calls flat service that persists data ([#3511](https://github.com/betagouv/api-subventions-asso/issues/3511)) ([e809521](https://github.com/betagouv/api-subventions-asso/commit/e80952189a7dcf114c58d3fa58909e335a58a710))
- **api:** [#3506](https://github.com/betagouv/api-subventions-asso/issues/3506) update date in ApplicationFlat ([#3529](https://github.com/betagouv/api-subventions-asso/issues/3529)) ([f174493](https://github.com/betagouv/api-subventions-asso/commit/f174493a82b176be7dda69f4b5dfd8f26b269f25))
- **api:** [#3533](https://github.com/betagouv/api-subventions-asso/issues/3533) handle excel date in scdl decisionReference adapter ([#3565](https://github.com/betagouv/api-subventions-asso/issues/3565)) ([5eca190](https://github.com/betagouv/api-subventions-asso/commit/5eca190e5c82c3c876371dff6fa93e1606dff095))

## [0.70.6](https://github.com/betagouv/api-subventions-asso/compare/v0.70.5...v0.70.6) (2025-07-02)

### Bug Fixes

- **api:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) v0.70.5 ([#3562](https://github.com/betagouv/api-subventions-asso/issues/3562)) ([65b0279](https://github.com/betagouv/api-subventions-asso/commit/65b027946f6b7b6111ee9afbd370469b52fd73f2))

## [0.70.5](https://github.com/betagouv/api-subventions-asso/compare/v0.70.4...v0.70.5) (2025-06-30)

### Bug Fixes

- **api:** fix fonjep joiner after renaming payment collection ([ad9f51f](https://github.com/betagouv/api-subventions-asso/commit/ad9f51f6bdcdb2cbc742c04904a693a33bf015e3))

## [0.70.4](https://github.com/betagouv/api-subventions-asso/compare/v0.70.3...v0.70.4) (2025-06-30)

### Bug Fixes

- **api:** [#3551](https://github.com/betagouv/api-subventions-asso/issues/3551) disable broken scdl backup ([#3552](https://github.com/betagouv/api-subventions-asso/issues/3552)) ([f16f390](https://github.com/betagouv/api-subventions-asso/commit/f16f390f26a5d30cf3840001f2a600b567e3557f))
- **api:** [#3553](https://github.com/betagouv/api-subventions-asso/issues/3553) fix payment duplicate collection name and disable payment flat for fonjep ([#3555](https://github.com/betagouv/api-subventions-asso/issues/3555)) ([668b890](https://github.com/betagouv/api-subventions-asso/commit/668b8902069dde03af856c2bf1fd6e658d179801))

## [0.70.3](https://github.com/betagouv/api-subventions-asso/compare/v0.70.2...v0.70.3) (2025-06-25)

### Bug Fixes

- **api:** add new api asso domain for document ([c22c560](https://github.com/betagouv/api-subventions-asso/commit/c22c5606af3bd23dd7b4c595897e9f05dfb84a6b))

## [0.70.2](https://github.com/betagouv/api-subventions-asso/compare/v0.70.1...v0.70.2) (2025-06-24)

### Bug Fixes

- **api:** [#3542](https://github.com/betagouv/api-subventions-asso/issues/3542) patch v0.70.1 ([#3544](https://github.com/betagouv/api-subventions-asso/issues/3544)) ([2bd9e95](https://github.com/betagouv/api-subventions-asso/commit/2bd9e95800cad7a62888fe5ae905e619ef475468))

## [0.70.1](https://github.com/betagouv/api-subventions-asso/compare/v0.70.0...v0.70.1) (2025-06-19)

### Bug Fixes

- **api:** [#3509](https://github.com/betagouv/api-subventions-asso/issues/3509) remove data from all imported exercices ([#3528](https://github.com/betagouv/api-subventions-asso/issues/3528)) ([3777a58](https://github.com/betagouv/api-subventions-asso/commit/3777a58fb050811558384f5412f6c1cd096e4105))

# [0.70.0](https://github.com/betagouv/api-subventions-asso/compare/v0.69.1...v0.70.0) (2025-06-18)

### Bug Fixes

- **api:** [#3451](https://github.com/betagouv/api-subventions-asso/issues/3451) do not convert cell value equal to 0 to null ([#3460](https://github.com/betagouv/api-subventions-asso/issues/3460)) ([c00cacd](https://github.com/betagouv/api-subventions-asso/commit/c00cacd450d118e9430d3a8fc246b073d7aa4e9a))
- **api:** [#3483](https://github.com/betagouv/api-subventions-asso/issues/3483) use right date in paymentId ([#3484](https://github.com/betagouv/api-subventions-asso/issues/3484)) ([b4af65d](https://github.com/betagouv/api-subventions-asso/commit/b4af65d3516caa4a7e498de89454d2a42cc54ed1))

### Features

- **api:** [#3224](https://github.com/betagouv/api-subventions-asso/issues/3224) import fonjep payment flat ([#3433](https://github.com/betagouv/api-subventions-asso/issues/3433)) ([5bdbdfe](https://github.com/betagouv/api-subventions-asso/commit/5bdbdfe586757a5cb0fa5aff28d9867e47c291d6))
- **api:** [#3395](https://github.com/betagouv/api-subventions-asso/issues/3395) update scdl validator with duplicates ([#3455](https://github.com/betagouv/api-subventions-asso/issues/3455)) ([4d7face](https://github.com/betagouv/api-subventions-asso/commit/4d7faceb16275cf40b7beef284d2efc970a0bd8e))
- **api:** [#3407](https://github.com/betagouv/api-subventions-asso/issues/3407) protect agentconnectid in logs ([#3446](https://github.com/betagouv/api-subventions-asso/issues/3446)) ([85df82e](https://github.com/betagouv/api-subventions-asso/commit/85df82e19c191a204a7c1b68b50e0558bc4db395))
- **api:** [#3428](https://github.com/betagouv/api-subventions-asso/issues/3428) validate scdl import and remove most recent exercise data ([#3452](https://github.com/betagouv/api-subventions-asso/issues/3452)) ([b33112d](https://github.com/betagouv/api-subventions-asso/commit/b33112dfe569a1d9ba610869852ccdb55a3636ea))

### Reverts

- Revert "chore(deps): #0000 bump multer from 2.0.0 to 2.0.1 (#3461)" ([885ced9](https://github.com/betagouv/api-subventions-asso/commit/885ced9fc26c579b58e70ef1ec922a3f840c7517)), closes [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) [#3461](https://github.com/betagouv/api-subventions-asso/issues/3461)

## [0.69.1](https://github.com/betagouv/api-subventions-asso/compare/v0.66.2...v0.69.1) (2025-06-18)

### Bug Fixes

- **api:** [#0000](https://github.com/betagouv/api-subventions-asso/issues/0000) misc fixes 0.69 ([#3445](https://github.com/betagouv/api-subventions-asso/issues/3445)) ([3da89bc](https://github.com/betagouv/api-subventions-asso/commit/3da89bc67118588c6fa764b079a32d86de8325b9)), closes [#3344](https://github.com/betagouv/api-subventions-asso/issues/3344) [#3456](https://github.com/betagouv/api-subventions-asso/issues/3456)

# [0.69.0](https://github.com/betagouv/api-subventions-asso/compare/v0.66.1...v0.69.0) (2025-05-22)

### Bug Fixes

- **api:** [#3304](https://github.com/betagouv/api-subventions-asso/issues/3304) sirene duplicate errors and nested siren ([#3409](https://github.com/betagouv/api-subventions-asso/issues/3409)) ([e5fc7f8](https://github.com/betagouv/api-subventions-asso/commit/e5fc7f83da132e8cb563cbe03ac2b0a72a3beaf2))

### Features

- **api:** [#3109](https://github.com/betagouv/api-subventions-asso/issues/3109) use paymentFlat instead of chorus ([#3398](https://github.com/betagouv/api-subventions-asso/issues/3398)) ([600afd1](https://github.com/betagouv/api-subventions-asso/commit/600afd184598378bc2838fce0882596fb464850e))
- **api:** [#3334](https://github.com/betagouv/api-subventions-asso/issues/3334) define schema seed to quicky add similar DS 'demarches' ([#3425](https://github.com/betagouv/api-subventions-asso/issues/3425)) ([03b360e](https://github.com/betagouv/api-subventions-asso/commit/03b360ea2d3d69fe5149b1200eb34dc0a13b29ee))
- **api:** [#3396](https://github.com/betagouv/api-subventions-asso/issues/3396) DS get active demarche, save last modified files ([#3423](https://github.com/betagouv/api-subventions-asso/issues/3423)) ([61af4e8](https://github.com/betagouv/api-subventions-asso/commit/61af4e840693c27abea07fa2d7f052f54b489083))
- **api:** [#3397](https://github.com/betagouv/api-subventions-asso/issues/3397) add producer slug to payment flat unique id ([#3429](https://github.com/betagouv/api-subventions-asso/issues/3429)) ([b1b2708](https://github.com/betagouv/api-subventions-asso/commit/b1b27088bda24ff6f50372e386ab764f9092ec7a))

## [0.68.1](https://github.com/betagouv/api-subventions-asso/compare/v0.68.0...v0.68.1) (2025-05-07)

### Bug Fixes

- **api:** handle no estab identifier in chorus line payment flat ([f8b27a6](https://github.com/betagouv/api-subventions-asso/commit/f8b27a65ec1336f069572bd4261b7516958bb17b))
- **api:** refresh async data in grant providers before fetching grants ([22b286f](https://github.com/betagouv/api-subventions-asso/commit/22b286f1a0c80a192ab726144e066246d8a21705))

### Features

- **api:** [#3386](https://github.com/betagouv/api-subventions-asso/issues/3386) update paymentFlat uniqueId build for both chorus and fonjep ([#3399](https://github.com/betagouv/api-subventions-asso/issues/3399)) ([994f9dc](https://github.com/betagouv/api-subventions-asso/commit/994f9dc5443dfb5db4f77abcf6132836fc79d050))

# [0.68.0](https://github.com/betagouv/api-subventions-asso/compare/v0.67.0...v0.68.0) (2025-05-05)

### Bug Fixes

- **api, front:** [#3380](https://github.com/betagouv/api-subventions-asso/issues/3380) remove warning on HTTP Header max-age ([#3379](https://github.com/betagouv/api-subventions-asso/issues/3379)) ([e7b0667](https://github.com/betagouv/api-subventions-asso/commit/e7b0667f9409dc999ed25718702424c4b03956c1))
- **api:** [#3348](https://github.com/betagouv/api-subventions-asso/issues/3348) interpret 0-1 notificationUE and add missing leading 0 in siret ([#3389](https://github.com/betagouv/api-subventions-asso/issues/3389)) ([2987a1c](https://github.com/betagouv/api-subventions-asso/commit/2987a1c520fa71c7a5e4ba28673e7f634992a9ab))

### Features

- **api:** [#3144](https://github.com/betagouv/api-subventions-asso/issues/3144) application-flat code structure ([#3326](https://github.com/betagouv/api-subventions-asso/issues/3326)) ([55e6c8e](https://github.com/betagouv/api-subventions-asso/commit/55e6c8e59120b1f40d5cf3d76942215bfd107c10))

# [0.67.0](https://github.com/betagouv/api-subventions-asso/compare/v0.66.0...v0.67.0) (2025-04-28)

### Bug Fixes

- **api:** [#3366](https://github.com/betagouv/api-subventions-asso/issues/3366) compensate weird api asso formats ([#3367](https://github.com/betagouv/api-subventions-asso/issues/3367)) ([4347a2c](https://github.com/betagouv/api-subventions-asso/commit/4347a2cceb5bcc2013d89ab6596e9c8efa79c172))

### Features

- **api:** [#3142](https://github.com/betagouv/api-subventions-asso/issues/3142) adapte fonjep to payment flat ([#3357](https://github.com/betagouv/api-subventions-asso/issues/3357)) ([15f92fb](https://github.com/betagouv/api-subventions-asso/commit/15f92fb4598bfa6cd52f6875ce3a7cc1dcbf639c))
- **api:** [#3302](https://github.com/betagouv/api-subventions-asso/issues/3302) handle fonjep payment flat ([#3352](https://github.com/betagouv/api-subventions-asso/issues/3352)) ([eb84a08](https://github.com/betagouv/api-subventions-asso/commit/eb84a08b62226359867304d296be548e603f1ad6))
- **api:** [#3342](https://github.com/betagouv/api-subventions-asso/issues/3342) handle ridet tahiti in chorus payment flat ([#3346](https://github.com/betagouv/api-subventions-asso/issues/3346)) ([32d1a67](https://github.com/betagouv/api-subventions-asso/commit/32d1a6780203607b4d14be775b58d6787f091518))
- **api:** remove self signup route ([db0bca0](https://github.com/betagouv/api-subventions-asso/commit/db0bca050b245cea579321e1b439404e4ac53599))
- **front, api):** [#3329](https://github.com/betagouv/api-subventions-asso/issues/3329) pro connect no reset pwd ([#3363](https://github.com/betagouv/api-subventions-asso/issues/3363)) ([a6dc2df](https://github.com/betagouv/api-subventions-asso/commit/a6dc2df3c6f0ccb6d47722f4f024e98ff6a2f57e))
- **front:** adapt login page ([4f425d3](https://github.com/betagouv/api-subventions-asso/commit/4f425d34783a51f25a7420508d21cba3d1be318e))
- **front:** remove signup page ([01d1d9a](https://github.com/betagouv/api-subventions-asso/commit/01d1d9afda7377ed286fe40895c795e8c90b0db1))

# [0.69.0](https://github.com/betagouv/api-subventions-asso/compare/v0.66.1...v0.69.0) (2025-05-22)

### Bug Fixes

- **api:** [#3304](https://github.com/betagouv/api-subventions-asso/issues/3304) sirene duplicate errors and nested siren ([#3409](https://github.com/betagouv/api-subventions-asso/issues/3409)) ([e5fc7f8](https://github.com/betagouv/api-subventions-asso/commit/e5fc7f83da132e8cb563cbe03ac2b0a72a3beaf2))

### Features

- **api:** [#3109](https://github.com/betagouv/api-subventions-asso/issues/3109) use paymentFlat instead of chorus ([#3398](https://github.com/betagouv/api-subventions-asso/issues/3398)) ([600afd1](https://github.com/betagouv/api-subventions-asso/commit/600afd184598378bc2838fce0882596fb464850e))
- **api:** [#3334](https://github.com/betagouv/api-subventions-asso/issues/3334) define schema seed to quicky add similar DS 'demarches' ([#3425](https://github.com/betagouv/api-subventions-asso/issues/3425)) ([03b360e](https://github.com/betagouv/api-subventions-asso/commit/03b360ea2d3d69fe5149b1200eb34dc0a13b29ee))
- **api:** [#3396](https://github.com/betagouv/api-subventions-asso/issues/3396) DS get active demarche, save last modified files ([#3423](https://github.com/betagouv/api-subventions-asso/issues/3423)) ([61af4e8](https://github.com/betagouv/api-subventions-asso/commit/61af4e840693c27abea07fa2d7f052f54b489083))
- **api:** [#3397](https://github.com/betagouv/api-subventions-asso/issues/3397) add producer slug to payment flat unique id ([#3429](https://github.com/betagouv/api-subventions-asso/issues/3429)) ([b1b2708](https://github.com/betagouv/api-subventions-asso/commit/b1b27088bda24ff6f50372e386ab764f9092ec7a))

## [0.68.1](https://github.com/betagouv/api-subventions-asso/compare/v0.68.0...v0.68.1) (2025-05-07)

### Bug Fixes

- **api:** handle no estab identifier in chorus line payment flat ([f8b27a6](https://github.com/betagouv/api-subventions-asso/commit/f8b27a65ec1336f069572bd4261b7516958bb17b))
- **api:** refresh async data in grant providers before fetching grants ([22b286f](https://github.com/betagouv/api-subventions-asso/commit/22b286f1a0c80a192ab726144e066246d8a21705))

### Features

- **api:** [#3386](https://github.com/betagouv/api-subventions-asso/issues/3386) update paymentFlat uniqueId build for both chorus and fonjep ([#3399](https://github.com/betagouv/api-subventions-asso/issues/3399)) ([994f9dc](https://github.com/betagouv/api-subventions-asso/commit/994f9dc5443dfb5db4f77abcf6132836fc79d050))

# [0.68.0](https://github.com/betagouv/api-subventions-asso/compare/v0.67.0...v0.68.0) (2025-05-05)

### Bug Fixes

- **api, front:** [#3380](https://github.com/betagouv/api-subventions-asso/issues/3380) remove warning on HTTP Header max-age ([#3379](https://github.com/betagouv/api-subventions-asso/issues/3379)) ([e7b0667](https://github.com/betagouv/api-subventions-asso/commit/e7b0667f9409dc999ed25718702424c4b03956c1))
- **api:** [#3348](https://github.com/betagouv/api-subventions-asso/issues/3348) interpret 0-1 notificationUE and add missing leading 0 in siret ([#3389](https://github.com/betagouv/api-subventions-asso/issues/3389)) ([2987a1c](https://github.com/betagouv/api-subventions-asso/commit/2987a1c520fa71c7a5e4ba28673e7f634992a9ab))

### Features

- **api:** [#3144](https://github.com/betagouv/api-subventions-asso/issues/3144) application-flat code structure ([#3326](https://github.com/betagouv/api-subventions-asso/issues/3326)) ([55e6c8e](https://github.com/betagouv/api-subventions-asso/commit/55e6c8e59120b1f40d5cf3d76942215bfd107c10))

# [0.67.0](https://github.com/betagouv/api-subventions-asso/compare/v0.66.0...v0.67.0) (2025-04-28)

### Bug Fixes

- **api:** [#3366](https://github.com/betagouv/api-subventions-asso/issues/3366) compensate weird api asso formats ([#3367](https://github.com/betagouv/api-subventions-asso/issues/3367)) ([4347a2c](https://github.com/betagouv/api-subventions-asso/commit/4347a2cceb5bcc2013d89ab6596e9c8efa79c172))

### Features

- **api:** [#3142](https://github.com/betagouv/api-subventions-asso/issues/3142) adapte fonjep to payment flat ([#3357](https://github.com/betagouv/api-subventions-asso/issues/3357)) ([15f92fb](https://github.com/betagouv/api-subventions-asso/commit/15f92fb4598bfa6cd52f6875ce3a7cc1dcbf639c))
- **api:** [#3302](https://github.com/betagouv/api-subventions-asso/issues/3302) handle fonjep payment flat ([#3352](https://github.com/betagouv/api-subventions-asso/issues/3352)) ([eb84a08](https://github.com/betagouv/api-subventions-asso/commit/eb84a08b62226359867304d296be548e603f1ad6))
- **api:** [#3342](https://github.com/betagouv/api-subventions-asso/issues/3342) handle ridet tahiti in chorus payment flat ([#3346](https://github.com/betagouv/api-subventions-asso/issues/3346)) ([32d1a67](https://github.com/betagouv/api-subventions-asso/commit/32d1a6780203607b4d14be775b58d6787f091518))
- **api:** remove self signup route ([db0bca0](https://github.com/betagouv/api-subventions-asso/commit/db0bca050b245cea579321e1b439404e4ac53599))
- **front, api):** [#3329](https://github.com/betagouv/api-subventions-asso/issues/3329) pro connect no reset pwd ([#3363](https://github.com/betagouv/api-subventions-asso/issues/3363)) ([a6dc2df](https://github.com/betagouv/api-subventions-asso/commit/a6dc2df3c6f0ccb6d47722f4f024e98ff6a2f57e))
- **front:** adapt login page ([4f425d3](https://github.com/betagouv/api-subventions-asso/commit/4f425d34783a51f25a7420508d21cba3d1be318e))
- **front:** remove signup page ([01d1d9a](https://github.com/betagouv/api-subventions-asso/commit/01d1d9afda7377ed286fe40895c795e8c90b0db1))

## [0.68.1](https://github.com/betagouv/api-subventions-asso/compare/v0.68.0...v0.68.1) (2025-05-07)

### Bug Fixes

- **api:** handle no estab identifier in chorus line payment flat ([f8b27a6](https://github.com/betagouv/api-subventions-asso/commit/f8b27a65ec1336f069572bd4261b7516958bb17b))
- **api:** refresh async data in grant providers before fetching grants ([22b286f](https://github.com/betagouv/api-subventions-asso/commit/22b286f1a0c80a192ab726144e066246d8a21705))

# [0.68.0](https://github.com/betagouv/api-subventions-asso/compare/v0.67.0...v0.68.0) (2025-05-05)

### Bug Fixes

- **api, front:** [#3380](https://github.com/betagouv/api-subventions-asso/issues/3380) remove warning on HTTP Header max-age ([#3379](https://github.com/betagouv/api-subventions-asso/issues/3379)) ([e7b0667](https://github.com/betagouv/api-subventions-asso/commit/e7b0667f9409dc999ed25718702424c4b03956c1))
- **api:** [#3348](https://github.com/betagouv/api-subventions-asso/issues/3348) interpret 0-1 notificationUE and add missing leading 0 in siret ([#3389](https://github.com/betagouv/api-subventions-asso/issues/3389)) ([2987a1c](https://github.com/betagouv/api-subventions-asso/commit/2987a1c520fa71c7a5e4ba28673e7f634992a9ab))

### Features

- **api:** [#3144](https://github.com/betagouv/api-subventions-asso/issues/3144) application-flat code structure ([#3326](https://github.com/betagouv/api-subventions-asso/issues/3326)) ([55e6c8e](https://github.com/betagouv/api-subventions-asso/commit/55e6c8e59120b1f40d5cf3d76942215bfd107c10))

# [0.67.0](https://github.com/betagouv/api-subventions-asso/compare/v0.66.0...v0.67.0) (2025-04-28)

### Bug Fixes

- **api:** [#3366](https://github.com/betagouv/api-subventions-asso/issues/3366) compensate weird api asso formats ([#3367](https://github.com/betagouv/api-subventions-asso/issues/3367)) ([4347a2c](https://github.com/betagouv/api-subventions-asso/commit/4347a2cceb5bcc2013d89ab6596e9c8efa79c172))

### Features

- **api:** [#3142](https://github.com/betagouv/api-subventions-asso/issues/3142) adapte fonjep to payment flat ([#3357](https://github.com/betagouv/api-subventions-asso/issues/3357)) ([15f92fb](https://github.com/betagouv/api-subventions-asso/commit/15f92fb4598bfa6cd52f6875ce3a7cc1dcbf639c))
- **api:** [#3302](https://github.com/betagouv/api-subventions-asso/issues/3302) handle fonjep payment flat ([#3352](https://github.com/betagouv/api-subventions-asso/issues/3352)) ([eb84a08](https://github.com/betagouv/api-subventions-asso/commit/eb84a08b62226359867304d296be548e603f1ad6))
- **api:** [#3342](https://github.com/betagouv/api-subventions-asso/issues/3342) handle ridet tahiti in chorus payment flat ([#3346](https://github.com/betagouv/api-subventions-asso/issues/3346)) ([32d1a67](https://github.com/betagouv/api-subventions-asso/commit/32d1a6780203607b4d14be775b58d6787f091518))
- **api:** remove self signup route ([db0bca0](https://github.com/betagouv/api-subventions-asso/commit/db0bca050b245cea579321e1b439404e4ac53599))
- **front, api):** [#3329](https://github.com/betagouv/api-subventions-asso/issues/3329) pro connect no reset pwd ([#3363](https://github.com/betagouv/api-subventions-asso/issues/3363)) ([a6dc2df](https://github.com/betagouv/api-subventions-asso/commit/a6dc2df3c6f0ccb6d47722f4f024e98ff6a2f57e))
- **front:** adapt login page ([4f425d3](https://github.com/betagouv/api-subventions-asso/commit/4f425d34783a51f25a7420508d21cba3d1be318e))
- **front:** remove signup page ([01d1d9a](https://github.com/betagouv/api-subventions-asso/commit/01d1d9afda7377ed286fe40895c795e8c90b0db1))

## [0.66.2](https://github.com/betagouv/api-subventions-asso/compare/v0.66.1...v0.66.2) (2025-06-04)

### Bug Fixes

- **front:** dataviz title synthax ([fc4708c](https://github.com/betagouv/api-subventions-asso/commit/fc4708c764e4f264e0209e6283158a73770eaa73))

## [0.66.1](https://github.com/betagouv/api-subventions-asso/compare/v0.66.0...v0.66.1) (2025-05-07)

### Bug Fixes

- **api:** quick & dirty prevent too many calls to api asso in search ([088c89d](https://github.com/betagouv/api-subventions-asso/commit/088c89dd52a1699d054d3e02e286f3da1b3b6057))

# [0.66.0](https://github.com/betagouv/api-subventions-asso/compare/v0.65.2...v0.66.0) (2025-04-08)

### Bug Fixes

- [#3268](https://github.com/betagouv/api-subventions-asso/issues/3268) error message from api when multiple results with asso identifier ([#3297](https://github.com/betagouv/api-subventions-asso/issues/3297)) ([52a3bd5](https://github.com/betagouv/api-subventions-asso/commit/52a3bd5f29ffee8e099bc1d3d69b3dfd115cd9a0))
- **front:** [#2753](https://github.com/betagouv/api-subventions-asso/issues/2753) display asso address in asso page header ([#3292](https://github.com/betagouv/api-subventions-asso/issues/3292)) ([46ae717](https://github.com/betagouv/api-subventions-asso/commit/46ae71750f20c90f72176189e4e4566f85b4ebfb))

### Features

- **api:** [#3269](https://github.com/betagouv/api-subventions-asso/issues/3269) specify ds forms exercises ([#3305](https://github.com/betagouv/api-subventions-asso/issues/3305)) ([3c34cbc](https://github.com/betagouv/api-subventions-asso/commit/3c34cbc6c15a77cab761fd0386d1cbec2f6b0494))
- **ci:** [#3243](https://github.com/betagouv/api-subventions-asso/issues/3243) upgrade ubuntu version ([#3290](https://github.com/betagouv/api-subventions-asso/issues/3290)) ([c647872](https://github.com/betagouv/api-subventions-asso/commit/c647872c4b29c63df510029d27edd632ed2d499a))

## [0.65.2](https://github.com/betagouv/api-subventions-asso/compare/v0.65.1...v0.65.2) (2025-04-08)

### Bug Fixes

- **api:** normalize proconnect email to lowercase ([749bbe5](https://github.com/betagouv/api-subventions-asso/commit/749bbe53bf16b3a5f1c09586755ed4f22fab7ab7))

## [0.65.1](https://github.com/betagouv/api-subventions-asso/compare/v0.65.0...v0.65.1) (2025-03-31)

### Bug Fixes

- [#3289](https://github.com/betagouv/api-subventions-asso/issues/3289) misc v0.65 [#3289](https://github.com/betagouv/api-subventions-asso/issues/3289) ([2de4d2d](https://github.com/betagouv/api-subventions-asso/commit/2de4d2d5398a268ff88211c82da9126704ddec56))

# [0.65.0](https://github.com/betagouv/api-subventions-asso/compare/v0.64.2...v0.65.0) (2025-03-25)

### Bug Fixes

- **api:** [#3266](https://github.com/betagouv/api-subventions-asso/issues/3266) use exercice to calculate annee_demande in demarches simplifees adapter ([#3267](https://github.com/betagouv/api-subventions-asso/issues/3267)) ([53ad155](https://github.com/betagouv/api-subventions-asso/commit/53ad15526984a40b13fb469769050b33eceac9c1))
- **api:** typo in 86113 ds schema ([3a01485](https://github.com/betagouv/api-subventions-asso/commit/3a0148538c7dd013554226ce98bd1b54cc006b8c))
- **front:** [#3209](https://github.com/betagouv/api-subventions-asso/issues/3209) use new header getter ([#3248](https://github.com/betagouv/api-subventions-asso/issues/3248)) ([d038dce](https://github.com/betagouv/api-subventions-asso/commit/d038dce9974961d9a6bbf12415d43fa06a0002ed))
- **front:** [#3212](https://github.com/betagouv/api-subventions-asso/issues/3212) don't display number of establishments in establishment page ([#3272](https://github.com/betagouv/api-subventions-asso/issues/3272)) ([79bfb6e](https://github.com/betagouv/api-subventions-asso/commit/79bfb6e420037a38e614e8e54c322f6c14a48b4a))
- **tools:** [#3215](https://github.com/betagouv/api-subventions-asso/issues/3215) mettre à jour routes osiris dans le script ([#3216](https://github.com/betagouv/api-subventions-asso/issues/3216)) ([1ae1f1a](https://github.com/betagouv/api-subventions-asso/commit/1ae1f1aefb58d52fa3fd62fe7cd39ccbaf24f8a4))

### Features

- [#1161](https://github.com/betagouv/api-subventions-asso/issues/1161) create package core ([#3250](https://github.com/betagouv/api-subventions-asso/issues/3250)) ([345c8a2](https://github.com/betagouv/api-subventions-asso/commit/345c8a23b71fb50cb144cd8b40487fc1938f9e7d))
- **api:** [#2785](https://github.com/betagouv/api-subventions-asso/issues/2785) new osiris data attributes ([#3197](https://github.com/betagouv/api-subventions-asso/issues/3197)) ([cc7f47f](https://github.com/betagouv/api-subventions-asso/commit/cc7f47fec4768b1b0c2b2ff67ca23786dac101a9))
- **api:** [#3090](https://github.com/betagouv/api-subventions-asso/issues/3090) osiris optimize imports with bulk ([#3218](https://github.com/betagouv/api-subventions-asso/issues/3218)) ([0b542b5](https://github.com/betagouv/api-subventions-asso/commit/0b542b56cb091a15b6e4c0c872e3f76f1f579af2))
- **api:** [#3225](https://github.com/betagouv/api-subventions-asso/issues/3225) [#3227](https://github.com/betagouv/api-subventions-asso/issues/3227) use siren unite legale to fill entreprise sirens and names ([#3246](https://github.com/betagouv/api-subventions-asso/issues/3246)) ([2fa1b84](https://github.com/betagouv/api-subventions-asso/commit/2fa1b845d249c4d3a0bf2c54665de4744f25c617))
- **api:** [#3237](https://github.com/betagouv/api-subventions-asso/issues/3237) hide confusing dauphin 2023 data ([#3265](https://github.com/betagouv/api-subventions-asso/issues/3265)) ([b99a1d5](https://github.com/betagouv/api-subventions-asso/commit/b99a1d58bf38917193b010d2b3d08bb9381b5c1c))
- **front:** [#3162](https://github.com/betagouv/api-subventions-asso/issues/3162) histo added to dataViz ([#3251](https://github.com/betagouv/api-subventions-asso/issues/3251)) ([d018fe0](https://github.com/betagouv/api-subventions-asso/commit/d018fe0aa1f4630aba7d19e752dc9ba1e46c57a4))

### Performance Improvements

- **api:** [#3219](https://github.com/betagouv/api-subventions-asso/issues/3219) optimize payment flat ([#3249](https://github.com/betagouv/api-subventions-asso/issues/3249)) ([4a92cb2](https://github.com/betagouv/api-subventions-asso/commit/4a92cb2cbe0138d3a54add453a5ed00012570696))

## [0.64.2](https://github.com/betagouv/api-subventions-asso/compare/v0.64.1...v0.64.2) (2025-03-17)

### Bug Fixes

- **api:** make producerName and producerSiret optionnal again ([e252c6d](https://github.com/betagouv/api-subventions-asso/commit/e252c6d12d975ac89f015f0828a551a6e9fdc8e5))

## [0.64.1](https://github.com/betagouv/api-subventions-asso/compare/v0.64.0...v0.64.1) (2025-03-17)

### Bug Fixes

- **api:** make exportDate optionnal in scdl file conf ([3571578](https://github.com/betagouv/api-subventions-asso/commit/357157803252d39a8f6137520ad391987320b11e))

# [0.64.0](https://github.com/betagouv/api-subventions-asso/compare/v0.63.1...v0.64.0) (2025-03-13)

### Bug Fixes

- **api:** [#3239](https://github.com/betagouv/api-subventions-asso/issues/3239) detect scdl issues returns text/csv ([#3234](https://github.com/betagouv/api-subventions-asso/issues/3234)) ([428d312](https://github.com/betagouv/api-subventions-asso/commit/428d3127445198b717aa4e07f5b8b65e1672e5ee))

### Features

- **api, dto, front:** [#3146](https://github.com/betagouv/api-subventions-asso/issues/3146) redirect proconnect ([#3223](https://github.com/betagouv/api-subventions-asso/issues/3223)) ([d142f3a](https://github.com/betagouv/api-subventions-asso/commit/d142f3aa1c8fdf5d50dbf9adabfefd63d10c8371))
- **api:** [#3163](https://github.com/betagouv/api-subventions-asso/issues/3163) add Oise specific mapping ([#3245](https://github.com/betagouv/api-subventions-asso/issues/3245)) ([f0e643a](https://github.com/betagouv/api-subventions-asso/commit/f0e643af8517927e234948228d2d316c10cd4b1f))
- **front:** [#3161](https://github.com/betagouv/api-subventions-asso/issues/3161) create graph Amount vs year ([#3228](https://github.com/betagouv/api-subventions-asso/issues/3228)) ([b619e5c](https://github.com/betagouv/api-subventions-asso/commit/b619e5c5d483e11eb102685c022e067f605f9156))

## [0.63.1](https://github.com/betagouv/api-subventions-asso/compare/v0.63.0...v0.63.1) (2025-03-03)

### Bug Fixes

- **front:** more info modal typo in code ([e051f0b](https://github.com/betagouv/api-subventions-asso/commit/e051f0ba3cf1b7302c7360c3b6fe86a6c4ccd861))

# [0.63.0](https://github.com/betagouv/api-subventions-asso/compare/v0.62.0...v0.63.0) (2025-02-25)

### Bug Fixes

- **api:** [#3207](https://github.com/betagouv/api-subventions-asso/issues/3207) - fix amountsVsProgramRegionTable ([#3208](https://github.com/betagouv/api-subventions-asso/issues/3208)) ([6755adf](https://github.com/betagouv/api-subventions-asso/commit/6755adfe5287d31b72c183d433913f97167926e7))
- **front:** typo 0 ([6799602](https://github.com/betagouv/api-subventions-asso/commit/6799602061f2359ccf325bc203e87d1fd6c5396a))

### Features

- **api, dto:** [#3107](https://github.com/betagouv/api-subventions-asso/issues/3107) implement paymentProvider in paymentFlat.service ([#3229](https://github.com/betagouv/api-subventions-asso/issues/3229)) ([98e4131](https://github.com/betagouv/api-subventions-asso/commit/98e4131d18f528a0d184ff0c09867d9a23ac7da2))
- **api:** [#3111](https://github.com/betagouv/api-subventions-asso/issues/3111) update users nb requests in brevo ([#3192](https://github.com/betagouv/api-subventions-asso/issues/3192)) ([a7bdd2e](https://github.com/betagouv/api-subventions-asso/commit/a7bdd2ee81fcab284e2f9ce2710b7a3b224aca7d))
- **api:** [#3149](https://github.com/betagouv/api-subventions-asso/issues/3149) http routes to get csv scdl errors ([#3221](https://github.com/betagouv/api-subventions-asso/issues/3221)) ([e364fa9](https://github.com/betagouv/api-subventions-asso/commit/e364fa94d0de16375d9ca169293dc290f94c3049))
- **front:** [#3214](https://github.com/betagouv/api-subventions-asso/issues/3214) add dataviz beta alert ([#3217](https://github.com/betagouv/api-subventions-asso/issues/3217)) ([7272863](https://github.com/betagouv/api-subventions-asso/commit/7272863984c2b997b2e9ed736eef3c35064c647a))

# [0.62.0](https://github.com/betagouv/api-subventions-asso/compare/v0.61.0...v0.62.0) (2025-02-17)

### Bug Fixes

- **api:** [#3047](https://github.com/betagouv/api-subventions-asso/issues/3047) ensure to not overload batch ([#3202](https://github.com/betagouv/api-subventions-asso/issues/3202)) ([9912be9](https://github.com/betagouv/api-subventions-asso/commit/9912be981e1f5684d82bbc89d82c5e114099e054))
- **api:** modified start server api ([#3181](https://github.com/betagouv/api-subventions-asso/issues/3181)) ([f89b9ed](https://github.com/betagouv/api-subventions-asso/commit/f89b9ed89b15d7d3f9b29cb7de470fbdb434994c))

### Features

- **api,front:** [#2349](https://github.com/betagouv/api-subventions-asso/issues/2349) check id comes from asso api-side ([#3188](https://github.com/betagouv/api-subventions-asso/issues/3188)) ([843641c](https://github.com/betagouv/api-subventions-asso/commit/843641ca3f968bb8bc83a76e64bd88eeb20aa0e0))
- **api:** [#2703](https://github.com/betagouv/api-subventions-asso/issues/2703) add first import for each raw provider ([#2718](https://github.com/betagouv/api-subventions-asso/issues/2718)) ([3ffd22a](https://github.com/betagouv/api-subventions-asso/commit/3ffd22a9c7c509592afa6f2f2137ba1aa66ddab6))
- **api:** [#3158](https://github.com/betagouv/api-subventions-asso/issues/3158) data viz AmountsVsProgramRegion create resource ([#3170](https://github.com/betagouv/api-subventions-asso/issues/3170)) ([46fa57c](https://github.com/betagouv/api-subventions-asso/commit/46fa57cb3c913d15d157c8aab1be8890dd80220a))
- **api:** [#3191](https://github.com/betagouv/api-subventions-asso/issues/3191) fonjep new format ([#3198](https://github.com/betagouv/api-subventions-asso/issues/3198)) ([2b62409](https://github.com/betagouv/api-subventions-asso/commit/2b624099e9b9d6e76eee7461c63505c351a8c0cc))
- **front:** [#3159](https://github.com/betagouv/api-subventions-asso/issues/3159) create-new-empty-page-for-dataviz ([#3193](https://github.com/betagouv/api-subventions-asso/issues/3193)) ([0a71dcf](https://github.com/betagouv/api-subventions-asso/commit/0a71dcf03893e743483f4a2f34a3b6c9869a9f2b))
- **front:** [#3160](https://github.com/betagouv/api-subventions-asso/issues/3160) wip add amountsVsProgramRegion table ([#3196](https://github.com/betagouv/api-subventions-asso/issues/3196)) ([6c3f61d](https://github.com/betagouv/api-subventions-asso/commit/6c3f61d942e7df594291efb552964e4b9b5c2437))

# [0.61.0](https://github.com/betagouv/api-subventions-asso/compare/v0.60.3...v0.61.0) (2025-02-03)

### Bug Fixes

- **api:** [#2733](https://github.com/betagouv/api-subventions-asso/issues/2733) no slash doc name on download ([#3054](https://github.com/betagouv/api-subventions-asso/issues/3054)) ([55cdf21](https://github.com/betagouv/api-subventions-asso/commit/55cdf2129392a48b6cd95165e50e3c5eedbcee7b))
- **api:** [#3122](https://github.com/betagouv/api-subventions-asso/issues/3122) get conf/info-main-banner not only for admin ([#3123](https://github.com/betagouv/api-subventions-asso/issues/3123)) ([5822eb9](https://github.com/betagouv/api-subventions-asso/commit/5822eb994775e95e14f72a70c895f7fa3bc149c4))
- **ci:** ci runs on same os as server ([567acdd](https://github.com/betagouv/api-subventions-asso/commit/567acddd8299f38720c03d2dfd93fbd51a187332))
- **front:** add 'dev.local' in script command 'dev' ([3725900](https://github.com/betagouv/api-subventions-asso/commit/37259005bce287c197e2b6210681ff7aa8b3eb9b))
- **front:** proper type given ([#3118](https://github.com/betagouv/api-subventions-asso/issues/3118)) ([2bbfec6](https://github.com/betagouv/api-subventions-asso/commit/2bbfec629d40537b6f18d1cf941122bdc44c372d))

### Features

- **api, dto:** [#3042](https://github.com/betagouv/api-subventions-asso/issues/3042) add field in user ([#3067](https://github.com/betagouv/api-subventions-asso/issues/3067)) ([1be9916](https://github.com/betagouv/api-subventions-asso/commit/1be9916bb11c4f845e1995595b3d647291a57add))
- **api:** [#2842](https://github.com/betagouv/api-subventions-asso/issues/2842) data integration ille-et-vilaine ([#3098](https://github.com/betagouv/api-subventions-asso/issues/3098)) ([6fd5c65](https://github.com/betagouv/api-subventions-asso/commit/6fd5c651c8fd185f24acc5aaa23e3900f6ce4446))
- **api:** [#2851](https://github.com/betagouv/api-subventions-asso/issues/2851) reset link in list-user admin root ([#3094](https://github.com/betagouv/api-subventions-asso/issues/3094)) ([6165d05](https://github.com/betagouv/api-subventions-asso/commit/6165d05dfbd8d6f40beaf114acb0690d4898e660))
- **api:** [#2956](https://github.com/betagouv/api-subventions-asso/issues/2956) data integration lot ([#3059](https://github.com/betagouv/api-subventions-asso/issues/3059)) ([6fb9b23](https://github.com/betagouv/api-subventions-asso/commit/6fb9b2317abde29258069117679cae64170edde4))
- **api:** [#3021](https://github.com/betagouv/api-subventions-asso/issues/3021) data integration lille ([#3074](https://github.com/betagouv/api-subventions-asso/issues/3074)) ([8f63ce4](https://github.com/betagouv/api-subventions-asso/commit/8f63ce4db09092aab0af262ec7b354e9d5351e3a))
- **api:** [#3032](https://github.com/betagouv/api-subventions-asso/issues/3032) data integration deux-sevres ([#3075](https://github.com/betagouv/api-subventions-asso/issues/3075)) ([333bfaa](https://github.com/betagouv/api-subventions-asso/commit/333bfaa4a99b05257e82af080410f071cf6f65d4))
- **api:** [#3045](https://github.com/betagouv/api-subventions-asso/issues/3045) no control on agent connect email domains ([#3076](https://github.com/betagouv/api-subventions-asso/issues/3076)) ([7f7fbbe](https://github.com/betagouv/api-subventions-asso/commit/7f7fbbe3e1671a68e3411bd5b4801dcc50dcf977))
- **api:** [#3073](https://github.com/betagouv/api-subventions-asso/issues/3073) data integration caisse des dépôts ([#3131](https://github.com/betagouv/api-subventions-asso/issues/3131)) ([c1d04e8](https://github.com/betagouv/api-subventions-asso/commit/c1d04e8f1fa65de63e4b89dd66b9f61c19132811))
- **api:** [#3102](https://github.com/betagouv/api-subventions-asso/issues/3102) data integration loire ([#3139](https://github.com/betagouv/api-subventions-asso/issues/3139)) ([ffc6b47](https://github.com/betagouv/api-subventions-asso/commit/ffc6b475fc06d28768cced1e46c00cee34c5ade9))
- **api:** [#3103](https://github.com/betagouv/api-subventions-asso/issues/3103) data integration occitanie ([#3129](https://github.com/betagouv/api-subventions-asso/issues/3129)) ([4974247](https://github.com/betagouv/api-subventions-asso/commit/497424717d4702eac2fc5f75c2053fd137ceb090))
- **api:** [#3110](https://github.com/betagouv/api-subventions-asso/issues/3110) create consomer via http route ([#3117](https://github.com/betagouv/api-subventions-asso/issues/3117)) ([c101fc8](https://github.com/betagouv/api-subventions-asso/commit/c101fc85042bc4183c95978cc0bf6760f32dcdd3))
- **api:** [#3121](https://github.com/betagouv/api-subventions-asso/issues/3121) scdl integration script ([#3124](https://github.com/betagouv/api-subventions-asso/issues/3124)) ([593deb4](https://github.com/betagouv/api-subventions-asso/commit/593deb4717b6d642bede5b4500b4dbbdee2d3986))
- **api:** [#3132](https://github.com/betagouv/api-subventions-asso/issues/3132) add registration source informations in brevo ([#3133](https://github.com/betagouv/api-subventions-asso/issues/3133)) ([535d8bd](https://github.com/betagouv/api-subventions-asso/commit/535d8bd357aa84926392a6659170ab7c3e525bf5))
- **front:** [#3043](https://github.com/betagouv/api-subventions-asso/issues/3043) add 'from' fields in user registration form ([#3119](https://github.com/betagouv/api-subventions-asso/issues/3119)) ([9e9a0b0](https://github.com/betagouv/api-subventions-asso/commit/9e9a0b0f4b392dc130af3167c88f54ddddde0873))
- **front:** [#3116](https://github.com/betagouv/api-subventions-asso/issues/3116) search on NIC instead of SIRET ([#3120](https://github.com/betagouv/api-subventions-asso/issues/3120)) ([c30d924](https://github.com/betagouv/api-subventions-asso/commit/c30d924c209379145d9202316708202e11e711c5))
- **front:** add security breach link in footer ([#3125](https://github.com/betagouv/api-subventions-asso/issues/3125)) ([e38465d](https://github.com/betagouv/api-subventions-asso/commit/e38465dbe1065c329216f2c1d679cccc44022481))

## [0.60.3](https://github.com/betagouv/api-subventions-asso/compare/v0.60.2...v0.60.3) (2025-01-06)

### Bug Fixes

- **api:** homogenize treatment csv xls single payment date ([#3069](https://github.com/betagouv/api-subventions-asso/issues/3069)) ([5db60ed](https://github.com/betagouv/api-subventions-asso/commit/5db60ed00f5e8124f475ed209cdade54ba398db1))

## [0.60.2](https://github.com/betagouv/api-subventions-asso/compare/v0.60.1...v0.60.2) (2025-01-06)

### Bug Fixes

- **api:** extract number with coma not point decimal separator ([f734242](https://github.com/betagouv/api-subventions-asso/commit/f734242692367ac872fbbcb30c0a5550ea149b9a))

## [0.60.1](https://github.com/betagouv/api-subventions-asso/compare/v0.60.0...v0.60.1) (2025-01-02)

### Bug Fixes

- **front:** [#2977](https://github.com/betagouv/api-subventions-asso/issues/2977) one or no establishment is not the same ([#3055](https://github.com/betagouv/api-subventions-asso/issues/3055)) ([8d00809](https://github.com/betagouv/api-subventions-asso/commit/8d00809579ed431e10cf7adbaa590e0c64bea5fc))
- **front:** [#3061](https://github.com/betagouv/api-subventions-asso/issues/3061) modale sort fix ([#3070](https://github.com/betagouv/api-subventions-asso/issues/3070)) ([06bf228](https://github.com/betagouv/api-subventions-asso/commit/06bf22873720da2cf1017a9947f1e608e7e7c364))
- **front:** [#3062](https://github.com/betagouv/api-subventions-asso/issues/3062) [#3064](https://github.com/betagouv/api-subventions-asso/issues/3064) payment modale ([#3071](https://github.com/betagouv/api-subventions-asso/issues/3071)) ([574aebf](https://github.com/betagouv/api-subventions-asso/commit/574aebfc06f2abcaa7a2a0480dd35cc77ee46430))
- **front:** [#3063](https://github.com/betagouv/api-subventions-asso/issues/3063) exercise label ([#3072](https://github.com/betagouv/api-subventions-asso/issues/3072)) ([9ee6b5a](https://github.com/betagouv/api-subventions-asso/commit/9ee6b5ae3651d0c357d8d3c9b3ea7eeb5734a6d7))

### Features

- **api:** [#2989](https://github.com/betagouv/api-subventions-asso/issues/2989) data integration finistere ([#3056](https://github.com/betagouv/api-subventions-asso/issues/3056)) ([7ff612b](https://github.com/betagouv/api-subventions-asso/commit/7ff612bec70c4ef4dfc7c8ab12daba379a49c5d4))

# [0.60.0](https://github.com/betagouv/api-subventions-asso/compare/v0.59.2...v0.60.0) (2024-12-26)

### Bug Fixes

- **api:** [#3037](https://github.com/betagouv/api-subventions-asso/issues/3037) registers missing crons ([911e71b](https://github.com/betagouv/api-subventions-asso/commit/911e71b5891c4684b3a73adf56af2cc8df41635f))
- **api:** comment out duplicate index creation ([904967d](https://github.com/betagouv/api-subventions-asso/commit/904967d7593df0b611abab29bd2c1e599eb8893a))
- **front:** [#2994](https://github.com/betagouv/api-subventions-asso/issues/2994) get estab data when no rna can be found ([#3008](https://github.com/betagouv/api-subventions-asso/issues/3008)) ([7e652ac](https://github.com/betagouv/api-subventions-asso/commit/7e652ac0e83b89fb3104ab7d29346846d102103d))
- **front:** [#2995](https://github.com/betagouv/api-subventions-asso/issues/2995) confusion between type and htmlType ([#3009](https://github.com/betagouv/api-subventions-asso/issues/3009)) ([95e17b4](https://github.com/betagouv/api-subventions-asso/commit/95e17b4fbab510d73d9c5aec326c36f0fa343f64))

### Features

- **api, dto, front:** [#2853](https://github.com/betagouv/api-subventions-asso/issues/2853) create resource to update home info banner ([#3034](https://github.com/betagouv/api-subventions-asso/issues/3034)) ([7c1ffcd](https://github.com/betagouv/api-subventions-asso/commit/7c1ffcd58419fb1e6af61e88ad47a94fc8ead179))
- **api:** [#2551](https://github.com/betagouv/api-subventions-asso/issues/2551) transforms api-asso localhost url to actual domain ([#3025](https://github.com/betagouv/api-subventions-asso/issues/3025)) ([49baa4a](https://github.com/betagouv/api-subventions-asso/commit/49baa4a9259fd8634e4a3eb22d409f52b9a27fa6))
- **api:** [#2984](https://github.com/betagouv/api-subventions-asso/issues/2984) data integration Bordeaux ([#3010](https://github.com/betagouv/api-subventions-asso/issues/3010)) ([44aefbd](https://github.com/betagouv/api-subventions-asso/commit/44aefbd9cd21409106178fbfc8bb5e7f463ed278))
- **api:** [#2988](https://github.com/betagouv/api-subventions-asso/issues/2988) data integration sarthe ([#3028](https://github.com/betagouv/api-subventions-asso/issues/3028)) ([5bd4238](https://github.com/betagouv/api-subventions-asso/commit/5bd423876dec7633303abd25b9be99a8778413bf))
- **api:** [#2990](https://github.com/betagouv/api-subventions-asso/issues/2990) data integration Hauts-De-Seine ([#3048](https://github.com/betagouv/api-subventions-asso/issues/3048)) ([5285cca](https://github.com/betagouv/api-subventions-asso/commit/5285cca80acc39d05ab4184b1602059bd3b6528b))
- **api:** [#3003](https://github.com/betagouv/api-subventions-asso/issues/3003) data integration IHEDN ([#3049](https://github.com/betagouv/api-subventions-asso/issues/3049)) ([9f67789](https://github.com/betagouv/api-subventions-asso/commit/9f67789b9d063622445bbb3d8e6ef2e48b32840c))
- **api:** [#3022](https://github.com/betagouv/api-subventions-asso/issues/3022) add scdl integration errors field ([#3023](https://github.com/betagouv/api-subventions-asso/issues/3023)) ([047c0df](https://github.com/betagouv/api-subventions-asso/commit/047c0df021e28cc891d8ff2e6e9c35b98c41e6e6))
- **front:** [#2684](https://github.com/betagouv/api-subventions-asso/issues/2684) grant dashboard with new api route ([#2959](https://github.com/betagouv/api-subventions-asso/issues/2959)) ([ea924e5](https://github.com/betagouv/api-subventions-asso/commit/ea924e53790d5a89136be13a0b6f27b26afb57af))
- **front:** [#2981](https://github.com/betagouv/api-subventions-asso/issues/2981) agent pro connect ([#3013](https://github.com/betagouv/api-subventions-asso/issues/3013)) ([17316de](https://github.com/betagouv/api-subventions-asso/commit/17316de9cdfcfa6451975f7232019c1b8cc42131))
- **front:** [#2993](https://github.com/betagouv/api-subventions-asso/issues/2993) if no granted amount display label ([#3052](https://github.com/betagouv/api-subventions-asso/issues/3052)) ([e6e979d](https://github.com/betagouv/api-subventions-asso/commit/e6e979de9141cf1b4439fac79cc4621baf6e009f))

## [0.59.2](https://github.com/betagouv/api-subventions-asso/compare/v0.59.1...v0.59.2) (2024-12-17)

### Bug Fixes

- **api:** rebuild req to log with string userId ([b09c7c6](https://github.com/betagouv/api-subventions-asso/commit/b09c7c6ab32652f8d7391f58f138418c2958bba5))

## [0.59.1](https://github.com/betagouv/api-subventions-asso/compare/v0.59.0...v0.59.1) (2024-12-16)

### Bug Fixes

- **api:** put userId elsewhere to not override req ([99c8dbf](https://github.com/betagouv/api-subventions-asso/commit/99c8dbffa56f6ff07f0f3a99772ea59497c02733))

# [0.59.0](https://github.com/betagouv/api-subventions-asso/compare/v0.58.2...v0.59.0) (2024-12-09)

### Bug Fixes

- **front:** clean ([ed0e844](https://github.com/betagouv/api-subventions-asso/commit/ed0e84495785938d30034caee17839a95df7cc04))
- **front:** disables the reset button when no document is selected + rename ([1ebf281](https://github.com/betagouv/api-subventions-asso/commit/1ebf281b54aed74c7bdf9d436f2e721c63a9bb17))

### Features

- **api,dto,front:** [#2852](https://github.com/betagouv/api-subventions-asso/issues/2852) save nb visits in user ([#2972](https://github.com/betagouv/api-subventions-asso/issues/2972)) ([a9d7089](https://github.com/betagouv/api-subventions-asso/commit/a9d7089db51c62147cff766603957e1b62947205))
- **api:** [#2917](https://github.com/betagouv/api-subventions-asso/issues/2917) data integration centre val de loire 2021 ([#2947](https://github.com/betagouv/api-subventions-asso/issues/2947)) ([566ed87](https://github.com/betagouv/api-subventions-asso/commit/566ed87874c3fa566b2dd762436e82ed10df4243))

## [0.58.2](https://github.com/betagouv/api-subventions-asso/compare/v0.58.1...v0.58.2) (2024-12-03)

### Bug Fixes

- **api:** delete too recent logs ([215ab30](https://github.com/betagouv/api-subventions-asso/commit/215ab30f656d295354c431093e42accc31d4683f))

## [0.58.1](https://github.com/betagouv/api-subventions-asso/compare/v0.58.0...v0.58.1) (2024-12-02)

### Features

- **api:** [#2856](https://github.com/betagouv/api-subventions-asso/issues/2856) data integration corse ([#2899](https://github.com/betagouv/api-subventions-asso/issues/2899)) ([e2d0b55](https://github.com/betagouv/api-subventions-asso/commit/e2d0b5585a1ab6f6567a8f37221d2be2bceae4a4))

## [0.57.2](https://github.com/betagouv/api-subventions-asso/compare/v0.57.1...v0.57.2) (2024-11-21)

### Bug Fixes

- **api:** wrong use of execFileSync args ([#2919](https://github.com/betagouv/api-subventions-asso/issues/2919)) ([1a5adeb](https://github.com/betagouv/api-subventions-asso/commit/1a5adeb15189cf1d592d1a2368601d478ec41294))

### Features

- **api:** sentry track brevo errors ([#2874](https://github.com/betagouv/api-subventions-asso/issues/2874)) ([d974c62](https://github.com/betagouv/api-subventions-asso/commit/d974c62446506bf9ec70151de7f4915a0b9dee20))

# [0.58.0](https://github.com/betagouv/api-subventions-asso/compare/v0.57.1...v0.58.0) (2024-11-28)

### Bug Fixes

- **api:** [#2872](https://github.com/betagouv/api-subventions-asso/issues/2872) userId as string only in logs ([#2942](https://github.com/betagouv/api-subventions-asso/issues/2942)) ([a8dacea](https://github.com/betagouv/api-subventions-asso/commit/a8daceaacddd3bbea2b9ed1d9e0572ca1a0cf6d1))
- **api:** normalize path according to OS ([#2893](https://github.com/betagouv/api-subventions-asso/issues/2893)) ([0a26ccc](https://github.com/betagouv/api-subventions-asso/commit/0a26cccb487ef7cf90bb484326cd26d37bebed7f))

### Features

- **api:** [#2917](https://github.com/betagouv/api-subventions-asso/issues/2917) data integration centre val de loire 2021 ([#2939](https://github.com/betagouv/api-subventions-asso/issues/2939)) ([18f79f4](https://github.com/betagouv/api-subventions-asso/commit/18f79f44511a98dfdbe5626dbc784cd0a13fd937))
- **api:** data integration centre val de loire ([#2897](https://github.com/betagouv/api-subventions-asso/issues/2897)) ([39a5de4](https://github.com/betagouv/api-subventions-asso/commit/39a5de4995602ee50cb0b6e60f0d830a0cdefea1)), closes [#2813](https://github.com/betagouv/api-subventions-asso/issues/2813) [#2885](https://github.com/betagouv/api-subventions-asso/issues/2885)

### Performance Improvements

- **front:** [#2850](https://github.com/betagouv/api-subventions-asso/issues/2850) clean domain list in admin ([#2941](https://github.com/betagouv/api-subventions-asso/issues/2941)) ([67b1bc5](https://github.com/betagouv/api-subventions-asso/commit/67b1bc551e5c307e0c74c94533db14b844f79927))
- **front:** [#2850](https://github.com/betagouv/api-subventions-asso/issues/2850) no dsfr table is much faster and not much uglier ([#2949](https://github.com/betagouv/api-subventions-asso/issues/2949)) ([93537de](https://github.com/betagouv/api-subventions-asso/commit/93537debf2fb3b40dbfc3acfde564bec45547b14))

### Reverts

- Revert "feat(api): #2917 data integration centre val de loire 2021" (#2946) ([ed73c54](https://github.com/betagouv/api-subventions-asso/commit/ed73c54bb732cd713163ad351146f0c05c168865)), closes [#2917](https://github.com/betagouv/api-subventions-asso/issues/2917) [#2946](https://github.com/betagouv/api-subventions-asso/issues/2946) [#2917](https://github.com/betagouv/api-subventions-asso/issues/2917) [#2939](https://github.com/betagouv/api-subventions-asso/issues/2939)

## [0.57.2](https://github.com/betagouv/api-subventions-asso/compare/v0.57.1...v0.57.2) (2024-11-21)

### Bug Fixes

- **api:** wrong use of execFileSync args ([#2919](https://github.com/betagouv/api-subventions-asso/issues/2919)) ([1a5adeb](https://github.com/betagouv/api-subventions-asso/commit/1a5adeb15189cf1d592d1a2368601d478ec41294))

### Features

- **api:** sentry track brevo errors ([#2874](https://github.com/betagouv/api-subventions-asso/issues/2874)) ([d974c62](https://github.com/betagouv/api-subventions-asso/commit/d974c62446506bf9ec70151de7f4915a0b9dee20))

## [0.57.1](https://github.com/betagouv/api-subventions-asso/compare/v0.56.1...v0.57.1) (2024-11-18)

### Bug Fixes

- **api,front:** [#2618](https://github.com/betagouv/api-subventions-asso/issues/2618) only company in search raises error ([#2674](https://github.com/betagouv/api-subventions-asso/issues/2674)) ([af34bb0](https://github.com/betagouv/api-subventions-asso/commit/af34bb0980be6baadd2870ddccb71e69a201892d))
- **api:** [#2128](https://github.com/betagouv/api-subventions-asso/issues/2128) only save actual assos ([#2691](https://github.com/betagouv/api-subventions-asso/issues/2691)) ([4276673](https://github.com/betagouv/api-subventions-asso/commit/427667346bd80f9c6672cc243905662015343053))
- **api:** [#2656](https://github.com/betagouv/api-subventions-asso/issues/2656) adapts amounts with spaces in string ([#2690](https://github.com/betagouv/api-subventions-asso/issues/2690)) ([26455a5](https://github.com/betagouv/api-subventions-asso/commit/26455a5afb1998ca0d408dd0e610b466d2e90495))
- **api:** [#2732](https://github.com/betagouv/api-subventions-asso/issues/2732) protect from path traversal ith execFileSync and sanitization ([#2845](https://github.com/betagouv/api-subventions-asso/issues/2845)) ([0a6e7f7](https://github.com/betagouv/api-subventions-asso/commit/0a6e7f78e982829884399929d63f009273f64b84))
- **api:** [#2740](https://github.com/betagouv/api-subventions-asso/issues/2740) fonjep parser sets joinKey ([#2825](https://github.com/betagouv/api-subventions-asso/issues/2825)) ([c15f0dd](https://github.com/betagouv/api-subventions-asso/commit/c15f0ddd765aa16cec3e2a57ba3eb37d2af05c31))
- **api:** [#2859](https://github.com/betagouv/api-subventions-asso/issues/2859) handle chorus payment with siret value equal to # ([#2879](https://github.com/betagouv/api-subventions-asso/issues/2879)) ([19b3e1c](https://github.com/betagouv/api-subventions-asso/commit/19b3e1c204f44588261604296098e777c2e84d9e))
- **api:** [#2886](https://github.com/betagouv/api-subventions-asso/issues/2886) add csv extension and add bom for utf8 ([#2887](https://github.com/betagouv/api-subventions-asso/issues/2887)) ([38e276d](https://github.com/betagouv/api-subventions-asso/commit/38e276db386cdef0a6fde8c309c2d9c19e309af2))
- **api:** allow content-disposition header for estab grant extract ([#2894](https://github.com/betagouv/api-subventions-asso/issues/2894)) ([070677a](https://github.com/betagouv/api-subventions-asso/commit/070677a197ee483d32ce907de36703f9646c1783))
- **api:** handle undefined exercise 🙄 ([03e37fb](https://github.com/betagouv/api-subventions-asso/commit/03e37fbc9eb84fc87b3c80ac857e353a9971cc1d))
- **front:** [#2882](https://github.com/betagouv/api-subventions-asso/issues/2882) redirect to estab page if identifier is a siret ([#2888](https://github.com/betagouv/api-subventions-asso/issues/2888)) ([f17147e](https://github.com/betagouv/api-subventions-asso/commit/f17147e56e58dea932c940fc37976e88bd84db15))
- **front:** missing default env vars ([5b0e5a1](https://github.com/betagouv/api-subventions-asso/commit/5b0e5a11e65714e86c1d7329c94b1180869bbf91))

### Features

- **api:** [#2322](https://github.com/betagouv/api-subventions-asso/issues/2322) get EJ from gispro data ([#2809](https://github.com/betagouv/api-subventions-asso/issues/2809)) ([3e338b1](https://github.com/betagouv/api-subventions-asso/commit/3e338b1c261766ac1bc91d52004f4489b3acf054))
- **api:** flatten payment by exercise year and order grant results ([#2793](https://github.com/betagouv/api-subventions-asso/issues/2793)) ([a2f62dd](https://github.com/betagouv/api-subventions-asso/commit/a2f62ddeaed29ad9317c6142ebb7723bb9e1cd5d))
- **front:** [#2788](https://github.com/betagouv/api-subventions-asso/issues/2788) changer main banner content ([#2815](https://github.com/betagouv/api-subventions-asso/issues/2815)) ([4535af4](https://github.com/betagouv/api-subventions-asso/commit/4535af491c40fecd36a3fa52486a77d2fe42930e))
- **front:** [#2791](https://github.com/betagouv/api-subventions-asso/issues/2791) extract api with front ([#2827](https://github.com/betagouv/api-subventions-asso/issues/2827)) ([778074d](https://github.com/betagouv/api-subventions-asso/commit/778074d33f89da1a90d00a8e4260653536d1c8e1))

# [0.57.0](https://github.com/betagouv/api-subventions-asso/compare/v0.56.1...v0.57.0) (2024-11-07)

### Bug Fixes

- **api,front:** [#2618](https://github.com/betagouv/api-subventions-asso/issues/2618) only company in search raises error ([#2674](https://github.com/betagouv/api-subventions-asso/issues/2674)) ([af34bb0](https://github.com/betagouv/api-subventions-asso/commit/af34bb0980be6baadd2870ddccb71e69a201892d))
- **api:** [#2128](https://github.com/betagouv/api-subventions-asso/issues/2128) only save actual assos ([#2691](https://github.com/betagouv/api-subventions-asso/issues/2691)) ([4276673](https://github.com/betagouv/api-subventions-asso/commit/427667346bd80f9c6672cc243905662015343053))
- **api:** [#2656](https://github.com/betagouv/api-subventions-asso/issues/2656) adapts amounts with spaces in string ([#2690](https://github.com/betagouv/api-subventions-asso/issues/2690)) ([26455a5](https://github.com/betagouv/api-subventions-asso/commit/26455a5afb1998ca0d408dd0e610b466d2e90495))
- **api:** [#2732](https://github.com/betagouv/api-subventions-asso/issues/2732) protect from path traversal ith execFileSync and sanitization ([#2845](https://github.com/betagouv/api-subventions-asso/issues/2845)) ([0a6e7f7](https://github.com/betagouv/api-subventions-asso/commit/0a6e7f78e982829884399929d63f009273f64b84))
- **api:** [#2740](https://github.com/betagouv/api-subventions-asso/issues/2740) fonjep parser sets joinKey ([#2825](https://github.com/betagouv/api-subventions-asso/issues/2825)) ([c15f0dd](https://github.com/betagouv/api-subventions-asso/commit/c15f0ddd765aa16cec3e2a57ba3eb37d2af05c31))
- **api:** handle undefined exercise 🙄 ([b621fc1](https://github.com/betagouv/api-subventions-asso/commit/b621fc1b1b92ab533bf2bd7d2d53ae679f49e4ac))
- **front:** missing default env vars ([5b0e5a1](https://github.com/betagouv/api-subventions-asso/commit/5b0e5a11e65714e86c1d7329c94b1180869bbf91))

### Features

- **api:** [#2322](https://github.com/betagouv/api-subventions-asso/issues/2322) get EJ from gispro data ([#2809](https://github.com/betagouv/api-subventions-asso/issues/2809)) ([3e338b1](https://github.com/betagouv/api-subventions-asso/commit/3e338b1c261766ac1bc91d52004f4489b3acf054))
- **api:** flatten payment by exercise year and order grant results ([#2793](https://github.com/betagouv/api-subventions-asso/issues/2793)) ([a2f62dd](https://github.com/betagouv/api-subventions-asso/commit/a2f62ddeaed29ad9317c6142ebb7723bb9e1cd5d))
- **front:** [#2788](https://github.com/betagouv/api-subventions-asso/issues/2788) changer main banner content ([#2815](https://github.com/betagouv/api-subventions-asso/issues/2815)) ([4535af4](https://github.com/betagouv/api-subventions-asso/commit/4535af491c40fecd36a3fa52486a77d2fe42930e))
- **front:** [#2791](https://github.com/betagouv/api-subventions-asso/issues/2791) extract api with front ([#2827](https://github.com/betagouv/api-subventions-asso/issues/2827)) ([778074d](https://github.com/betagouv/api-subventions-asso/commit/778074d33f89da1a90d00a8e4260653536d1c8e1))

## [0.56.1](https://github.com/betagouv/api-subventions-asso/compare/v0.56.0...v0.56.1) (2024-10-14)

### Bug Fixes

- **api:** comprehend new osiris paths ([#2754](https://github.com/betagouv/api-subventions-asso/issues/2754)) ([dcb3b91](https://github.com/betagouv/api-subventions-asso/commit/dcb3b913619ecc3fea872aca184dc4d27474875b))
- **front:** display payments if no application info ([#2739](https://github.com/betagouv/api-subventions-asso/issues/2739)) ([0e1ebc6](https://github.com/betagouv/api-subventions-asso/commit/0e1ebc6322246730d384acb6c7dc0d9fa13e83eb))

### Reverts

- Revert "feat(front, api): #2413 front extracts csv from api (#2613)" ([98ccfbe](https://github.com/betagouv/api-subventions-asso/commit/98ccfbe15f201114b6901e30209c9dca03e344bf)), closes [#2413](https://github.com/betagouv/api-subventions-asso/issues/2413) [#2613](https://github.com/betagouv/api-subventions-asso/issues/2613)

# [0.56.0](https://github.com/betagouv/api-subventions-asso/compare/v0.55.0...v0.56.0) (2024-10-07)

### Bug Fixes

- **api:** [#2653](https://github.com/betagouv/api-subventions-asso/issues/2653) cors config differentiates front and consumer calls ([#2683](https://github.com/betagouv/api-subventions-asso/issues/2683)) ([0ae034a](https://github.com/betagouv/api-subventions-asso/commit/0ae034a2fbc95596d62e8516e42c51ba9a7069e3))
- **api:** [#2655](https://github.com/betagouv/api-subventions-asso/issues/2655) keep user id in logs ([#2657](https://github.com/betagouv/api-subventions-asso/issues/2657)) ([b5f6758](https://github.com/betagouv/api-subventions-asso/commit/b5f6758a99e77594e9be4b1b6369d14c2826e9c7))
- **api:** [#2688](https://github.com/betagouv/api-subventions-asso/issues/2688) fix osiris status ([#2689](https://github.com/betagouv/api-subventions-asso/issues/2689)) ([4fdb100](https://github.com/betagouv/api-subventions-asso/commit/4fdb100155be1441007d2fa5bd0ecd9bb691175d))
- **api:** add samesite lax in dev mode ([#2685](https://github.com/betagouv/api-subventions-asso/issues/2685)) ([e6f6dc8](https://github.com/betagouv/api-subventions-asso/commit/e6f6dc8e33c41cc71e0064daa86a56db903747ce))
- **api:** check url of document behind call ([#2667](https://github.com/betagouv/api-subventions-asso/issues/2667)) ([9c7621e](https://github.com/betagouv/api-subventions-asso/commit/9c7621e509cc76a1d1cab9e327f3cf74a631b96d))
- **front:** [#2645](https://github.com/betagouv/api-subventions-asso/issues/2645) add svelte public prefix ([#2650](https://github.com/betagouv/api-subventions-asso/issues/2650)) ([50d4335](https://github.com/betagouv/api-subventions-asso/commit/50d4335e0e454cac7a9bd7a5f851213405ebce09))

### Features

- **api, dto:** add prefix and first integ date ([#2654](https://github.com/betagouv/api-subventions-asso/issues/2654)) ([2f8b21d](https://github.com/betagouv/api-subventions-asso/commit/2f8b21d873e7af2922ea38c7ad95edbfd5ec12b7))
- **api:** [#2671](https://github.com/betagouv/api-subventions-asso/issues/2671) map demarches simplifiees status ([#2675](https://github.com/betagouv/api-subventions-asso/issues/2675)) ([9b99e46](https://github.com/betagouv/api-subventions-asso/commit/9b99e4686def628e01d8a927d109cbc1f62c6989))
- **api:** rename CPA doc ([aeabab7](https://github.com/betagouv/api-subventions-asso/commit/aeabab7aef978fa1b2135479a09359fa3e46fe1c)), closes [#2668](https://github.com/betagouv/api-subventions-asso/issues/2668)
- **front, api:** [#2413](https://github.com/betagouv/api-subventions-asso/issues/2413) front extracts csv from api ([#2613](https://github.com/betagouv/api-subventions-asso/issues/2613)) ([e17023d](https://github.com/betagouv/api-subventions-asso/commit/e17023dab2db577b840de44f3b6e8c2ce0b067d7))
- **front:** display nothing on payment cell if sub is refused ([#2652](https://github.com/betagouv/api-subventions-asso/issues/2652)) ([c9a9083](https://github.com/betagouv/api-subventions-asso/commit/c9a90838d6fffd41dde1fada5dc1e32f99e56a14))

### Performance Improvements

- **api:** [#2548](https://github.com/betagouv/api-subventions-asso/issues/2548) better join key in fonjep ([#2658](https://github.com/betagouv/api-subventions-asso/issues/2658)) ([ba1d286](https://github.com/betagouv/api-subventions-asso/commit/ba1d28647c6c22965898726dd29e4bbd6d039032))

# [0.55.0](https://github.com/betagouv/api-subventions-asso/compare/v0.54.1...v0.55.0) (2024-09-09)

### Features

- **api,dto:** [#2589](https://github.com/betagouv/api-subventions-asso/issues/2589) data log route ([#2626](https://github.com/betagouv/api-subventions-asso/issues/2626)) ([5c24e43](https://github.com/betagouv/api-subventions-asso/commit/5c24e436c36385341b2c7f4c48ddb7898347a2cb))
- **api:** [#2384](https://github.com/betagouv/api-subventions-asso/issues/2384) scdl misc attributor data, producer as default ([#2629](https://github.com/betagouv/api-subventions-asso/issues/2629)) ([a4bf2ff](https://github.com/betagouv/api-subventions-asso/commit/a4bf2ff09f70f1e50ac24dddb09cc139e97b4111))
- **api:** [#2413](https://github.com/betagouv/api-subventions-asso/issues/2413) extract grants api-side ([#2595](https://github.com/betagouv/api-subventions-asso/issues/2595)) ([38d69d6](https://github.com/betagouv/api-subventions-asso/commit/38d69d69a6af93a8a25991c3085fead4283cd586))

## [0.54.1](https://github.com/betagouv/api-subventions-asso/compare/v0.54.0...v0.54.1) (2024-08-29)

### Bug Fixes

- misc v0.54 ([#2623](https://github.com/betagouv/api-subventions-asso/issues/2623)) ([5240cf3](https://github.com/betagouv/api-subventions-asso/commit/5240cf326669056253f6d79ce6abf660751d2aa7))

# [0.54.0](https://github.com/betagouv/api-subventions-asso/compare/v0.53.1...v0.54.0) (2024-08-26)

### Bug Fixes

- **front:** [#2171](https://github.com/betagouv/api-subventions-asso/issues/2171) [#2289](https://github.com/betagouv/api-subventions-asso/issues/2289) handle spaces in search ([#2597](https://github.com/betagouv/api-subventions-asso/issues/2597)) ([7edfa71](https://github.com/betagouv/api-subventions-asso/commit/7edfa7177c4b83e4b346ae8fd38c22b6dd90c499))
- **front:** [#2611](https://github.com/betagouv/api-subventions-asso/issues/2611) docs when no siren ([#2612](https://github.com/betagouv/api-subventions-asso/issues/2612)) ([76b915a](https://github.com/betagouv/api-subventions-asso/commit/76b915a6782bbced5c40266c48def386f048f122))

### Features

- **api:** [#2524](https://github.com/betagouv/api-subventions-asso/issues/2524) add paymentFlatPort ([#2575](https://github.com/betagouv/api-subventions-asso/issues/2575)) ([426fdb0](https://github.com/betagouv/api-subventions-asso/commit/426fdb0bea609c776cfb2c59e8a2c263006974f0))
- **api:** [#2526](https://github.com/betagouv/api-subventions-asso/issues/2526) add chorus findAll / getAll ([#2539](https://github.com/betagouv/api-subventions-asso/issues/2539)) ([cf21924](https://github.com/betagouv/api-subventions-asso/commit/cf219245a0739dc835cc3acc2e6a13e82b13e69b))
- **api:** [#2580](https://github.com/betagouv/api-subventions-asso/issues/2580) chorus columns ([#2592](https://github.com/betagouv/api-subventions-asso/issues/2592)) ([c9ba473](https://github.com/betagouv/api-subventions-asso/commit/c9ba4738f3d5d9ea6a21cb724b4d5d7c94f2d490))
- **api:** [#2588](https://github.com/betagouv/api-subventions-asso/issues/2588) rate limit ([#2593](https://github.com/betagouv/api-subventions-asso/issues/2593)) ([92c4b6c](https://github.com/betagouv/api-subventions-asso/commit/92c4b6c809be90e26263c245a09358a90e59771a))
- **api:** 2523 add payment flat service ([#2576](https://github.com/betagouv/api-subventions-asso/issues/2576)) ([45ee4e8](https://github.com/betagouv/api-subventions-asso/commit/45ee4e8d6b54787e54d053d6541e379358551cd4))
- **front:** [#2560](https://github.com/betagouv/api-subventions-asso/issues/2560) upgrade dsfr to 1.12 with tables ([#2596](https://github.com/betagouv/api-subventions-asso/issues/2596)) ([2e1d5d2](https://github.com/betagouv/api-subventions-asso/commit/2e1d5d2c7e6c01447d88ae0d6140f457633c9acc))
- **front:** add columns on extract csv and add name and date on file… ([#2601](https://github.com/betagouv/api-subventions-asso/issues/2601)) ([45f45ab](https://github.com/betagouv/api-subventions-asso/commit/45f45ab54ee89241f98f26dfae294a6c44e384b7))
- resolve sse wrong answer and unessary call to api ([#2614](https://github.com/betagouv/api-subventions-asso/issues/2614)) ([822bd36](https://github.com/betagouv/api-subventions-asso/commit/822bd364a6e410e38ad03f1f495504080d860823))

## [0.53.1](https://github.com/betagouv/api-subventions-asso/compare/v0.53.0...v0.53.1) (2024-08-21)

**Note:** Version bump only for package api-subventions-asso

# [0.53.0](https://github.com/betagouv/api-subventions-asso/compare/v0.52.1...v0.53.0) (2024-08-06)

### Bug Fixes

- **front:** [#2532](https://github.com/betagouv/api-subventions-asso/issues/2532) small mistake about doc selection ([#2547](https://github.com/betagouv/api-subventions-asso/issues/2547)) ([fc7fadc](https://github.com/betagouv/api-subventions-asso/commit/fc7fadc02345715fac037d06cb213e7afd3a836f))

### Features

- **api, tools:** [#2498](https://github.com/betagouv/api-subventions-asso/issues/2498) resilient doc import osiris ([382891e](https://github.com/betagouv/api-subventions-asso/commit/382891eea108964c31c5673ceebd72896ead7b63))
- **api:** [#2077](https://github.com/betagouv/api-subventions-asso/issues/2077) save imports log ([75e92e3](https://github.com/betagouv/api-subventions-asso/commit/75e92e3445dd44bafc8aaf45b3a25b477fc3cdf4))
- **api:** [#2525](https://github.com/betagouv/api-subventions-asso/issues/2525) add domaine-fonct, ref-programmation and ministry to route API data Bretagne ([#2538](https://github.com/betagouv/api-subventions-asso/issues/2538)) ([ad34928](https://github.com/betagouv/api-subventions-asso/commit/ad34928127eb3f8e14867b1ad5a957346e8658a0))
- **api:** configure quote management ([e5263bf](https://github.com/betagouv/api-subventions-asso/commit/e5263bf675c7e88355ae035b261000e21cb16272))
- **api:** more acceptable values notificationue ([5e805a6](https://github.com/betagouv/api-subventions-asso/commit/5e805a6ceb7327213334662ab5479f616f73ba82))
- **front:** [#2308](https://github.com/betagouv/api-subventions-asso/issues/2308) select docs to group download ([#2451](https://github.com/betagouv/api-subventions-asso/issues/2451)) ([262542a](https://github.com/betagouv/api-subventions-asso/commit/262542a125d380c1b7e4c88712ba65b851757f64))
- **front:** [#2311](https://github.com/betagouv/api-subventions-asso/issues/2311) show all docs button ([#2406](https://github.com/betagouv/api-subventions-asso/issues/2406)) ([e475545](https://github.com/betagouv/api-subventions-asso/commit/e475545719ad17c488dc3e127eceb6514b93108b)), closes [#2356](https://github.com/betagouv/api-subventions-asso/issues/2356) [#2390](https://github.com/betagouv/api-subventions-asso/issues/2390)
- **front:** [#2455](https://github.com/betagouv/api-subventions-asso/issues/2455) undo docs show more with new rules ([#2468](https://github.com/betagouv/api-subventions-asso/issues/2468)) ([991074d](https://github.com/betagouv/api-subventions-asso/commit/991074db0783bf1de13b8e081c554dd3888ebaee)), closes [#2311](https://github.com/betagouv/api-subventions-asso/issues/2311)
- **front:** [#2533](https://github.com/betagouv/api-subventions-asso/issues/2533) new docs categorization ([#2557](https://github.com/betagouv/api-subventions-asso/issues/2557)) ([ab32f79](https://github.com/betagouv/api-subventions-asso/commit/ab32f7974937e8876df8a003f868a20793327651))
- **front:** docs reset selection ([#2470](https://github.com/betagouv/api-subventions-asso/issues/2470)) ([42f2808](https://github.com/betagouv/api-subventions-asso/commit/42f28088831e427b69abf865d9dd47ab4bd8f510))

## [0.52.1](https://github.com/betagouv/api-subventions-asso/compare/v0.52.0...v0.52.1) (2024-07-19)

### Bug Fixes

- **api:** [#2552](https://github.com/betagouv/api-subventions-asso/issues/2552) scdl exercice adapter robust for number vs dates ([#2553](https://github.com/betagouv/api-subventions-asso/issues/2553)) ([8a5c8eb](https://github.com/betagouv/api-subventions-asso/commit/8a5c8eb296f141644d35f6824b63df2ca96b82b5))

# [0.52.0](https://github.com/betagouv/api-subventions-asso/compare/v0.51.3...v0.52.0) (2024-07-18)

## [0.49.3](https://github.com/betagouv/api-subventions-asso/compare/v0.51.2...v0.49.3) (2024-07-16)

### Features

- **api:** [#2456](https://github.com/betagouv/api-subventions-asso/issues/2456) scdl parser accepts excel files ([#2483](https://github.com/betagouv/api-subventions-asso/issues/2483)) ([23e3506](https://github.com/betagouv/api-subventions-asso/commit/23e3506b66e61da85ed80973625c1ad829cb7965)), closes [#2318](https://github.com/betagouv/api-subventions-asso/issues/2318)
- **api:** clearer type management ([e1925f1](https://github.com/betagouv/api-subventions-asso/commit/e1925f18dce9d8f7f5be1ff697841a519558f2b2))
- **api:** new module csv-stringify ([8e9106c](https://github.com/betagouv/api-subventions-asso/commit/8e9106cd87c74d9bda22a11f37a5e115cddaa963))
- **api:** scdl parser exports errors ([4df2b28](https://github.com/betagouv/api-subventions-asso/commit/4df2b28aa8d623d210b00c8e36aa25f4807bbead))
- **front:** custom consultation instead of profile notice ([5518d7f](https://github.com/betagouv/api-subventions-asso/commit/5518d7fad75f6a6cdc3e969e82b059b05ce6df42))

## [0.51.3](https://github.com/betagouv/api-subventions-asso/compare/v0.51.2...v0.51.3) (2024-07-18)

**Note:** Version bump only for package api-subventions-asso

## [0.51.2](https://github.com/betagouv/api-subventions-asso/compare/v0.51.1...v0.51.2) (2024-07-15)

### Features

- **api:** declare subventia service as provider ([26eaeb5](https://github.com/betagouv/api-subventions-asso/commit/26eaeb508691845d191f903db566fbe1afdf21b9))

## [0.51.1](https://github.com/betagouv/api-subventions-asso/compare/v0.51.0...v0.51.1) (2024-07-15)

### Bug Fixes

- **front:** revert docs features ([6fbc9cd](https://github.com/betagouv/api-subventions-asso/commit/6fbc9cdfcfed8c219947938c412607b3490ad6b3)), closes [#2311](https://github.com/betagouv/api-subventions-asso/issues/2311) [#2308](https://github.com/betagouv/api-subventions-asso/issues/2308) [#2455](https://github.com/betagouv/api-subventions-asso/issues/2455)
- **front:** update front csp for crisp help ([3a5b9e3](https://github.com/betagouv/api-subventions-asso/commit/3a5b9e39166a4985204105d2fddd549d200b045d))

# [0.51.0](https://github.com/betagouv/api-subventions-asso/compare/v0.50.0...v0.51.0) (2024-07-01)

### Bug Fixes

- **api:** ensure estab contacts' phone numbers are string ([b05a71d](https://github.com/betagouv/api-subventions-asso/commit/b05a71d210c896304cb25b3f46e8a12b82516598))
- **api:** telephone can be undefined ([a1c17aa](https://github.com/betagouv/api-subventions-asso/commit/a1c17aa7d08b5753a3e710e7162d8613e27bb5f7))
- **api:** use dbo on port and on domain part use entity ([#2469](https://github.com/betagouv/api-subventions-asso/issues/2469)) ([2eb8536](https://github.com/betagouv/api-subventions-asso/commit/2eb853665d7d77d826a4f1d992fd8e751eb29881))

### Features

- **front:** [#2308](https://github.com/betagouv/api-subventions-asso/issues/2308) select docs to group download ([#2451](https://github.com/betagouv/api-subventions-asso/issues/2451)) ([b095d92](https://github.com/betagouv/api-subventions-asso/commit/b095d923d2cac1c8b748e258244141c14d797962))
- **front:** [#2432](https://github.com/betagouv/api-subventions-asso/issues/2432) checkbox agent work ethic ([#2434](https://github.com/betagouv/api-subventions-asso/issues/2434)) ([1aa2eca](https://github.com/betagouv/api-subventions-asso/commit/1aa2eca129243e9c86b214ac4779735e996ea889))
- **front:** [#2455](https://github.com/betagouv/api-subventions-asso/issues/2455) undo docs show more with new rules ([#2468](https://github.com/betagouv/api-subventions-asso/issues/2468)) ([adfb9e6](https://github.com/betagouv/api-subventions-asso/commit/adfb9e6a6c8ff3e3af0b1e4177e9e48f22968595)), closes [#2311](https://github.com/betagouv/api-subventions-asso/issues/2311)
- **front:** change bop label ([#2453](https://github.com/betagouv/api-subventions-asso/issues/2453)) ([c78b5c9](https://github.com/betagouv/api-subventions-asso/commit/c78b5c982aaa59ec278b1f904b43027fd248fb79))
- **front:** docs reset selection ([#2470](https://github.com/betagouv/api-subventions-asso/issues/2470)) ([77293e9](https://github.com/betagouv/api-subventions-asso/commit/77293e990c991bc8c6ee457252bcbe1c5a88babb))

# [0.50.0](https://github.com/betagouv/api-subventions-asso/compare/v0.49.2...v0.50.0) (2024-06-03)

### Features

- **api,dto:** [#2309](https://github.com/betagouv/api-subventions-asso/issues/2309) download selected docs ([#2403](https://github.com/betagouv/api-subventions-asso/issues/2403)) ([a793a9e](https://github.com/betagouv/api-subventions-asso/commit/a793a9e149783c9371fe146e11ed83b5518330e2))
- **api:** [#2381](https://github.com/betagouv/api-subventions-asso/issues/2381) agent connect creation email ([#2394](https://github.com/betagouv/api-subventions-asso/issues/2394)) ([4575a59](https://github.com/betagouv/api-subventions-asso/commit/4575a597a136219080d9f5cb3b04cb265702bf0d))
- **front:** [#2311](https://github.com/betagouv/api-subventions-asso/issues/2311) show all docs button ([#2406](https://github.com/betagouv/api-subventions-asso/issues/2406)) ([90d1215](https://github.com/betagouv/api-subventions-asso/commit/90d1215be5de2f1d493d7a59c8ff6471484820d7)), closes [#2356](https://github.com/betagouv/api-subventions-asso/issues/2356) [#2390](https://github.com/betagouv/api-subventions-asso/issues/2390)

## [0.49.3](https://github.com/betagouv/api-subventions-asso/compare/v0.49.2...v0.49.3) (2024-07-16)

### Features

- **front:** custom consultation instead of profile notice ([5518d7f](https://github.com/betagouv/api-subventions-asso/commit/5518d7fad75f6a6cdc3e969e82b059b05ce6df42))

## [0.49.2](https://github.com/betagouv/api-subventions-asso/compare/v0.49.1...v0.49.2) (2024-05-29)

**Note:** Version bump only for package api-subventions-asso

## [0.49.1](https://github.com/betagouv/api-subventions-asso/compare/v0.49.0...v0.49.1) (2024-05-23)

### Bug Fixes

- **front:** v0.49 before mep ([#2401](https://github.com/betagouv/api-subventions-asso/issues/2401)) ([810594b](https://github.com/betagouv/api-subventions-asso/commit/810594b730a5bd180f637f8622b254e315d263a6)), closes [#2400](https://github.com/betagouv/api-subventions-asso/issues/2400)

# [0.49.0](https://github.com/betagouv/api-subventions-asso/compare/v0.47.3...v0.49.0) (2024-05-22)

### Bug Fixes

- **api:** [#2300](https://github.com/betagouv/api-subventions-asso/issues/2300) fix rgpd anonymization ([#2371](https://github.com/betagouv/api-subventions-asso/issues/2371)) ([ae93451](https://github.com/betagouv/api-subventions-asso/commit/ae93451f0a80907e7ccac02a5538db90bd2df1d5))
- **api:** adapt update to new mongo interface ([aa6fbcd](https://github.com/betagouv/api-subventions-asso/commit/aa6fbcd1708dc125de9fb869714e6ac763be5166))
- **api:** agentConnectUsers are active by default, not the reverse ([17ed2db](https://github.com/betagouv/api-subventions-asso/commit/17ed2db548f8c6aaf536b0e3b8ed8443fd8256e2))
- **api:** align hashPassword type ([11789eb](https://github.com/betagouv/api-subventions-asso/commit/11789eb8f64ba20f9658f95b9658ad0a906e0b6b))
- **api:** clean misc scdl grant indexes ([#2333](https://github.com/betagouv/api-subventions-asso/issues/2333)) ([a5accb7](https://github.com/betagouv/api-subventions-asso/commit/a5accb7658dfe6da87fbfd893f1c13452050f097))
- **api:** correctly setup openID passport strategy ([552e1a4](https://github.com/betagouv/api-subventions-asso/commit/552e1a483dd5356c33f47765688fc69e61f78d69))
- **api:** fix unset syntax in migration ([9bddff2](https://github.com/betagouv/api-subventions-asso/commit/9bddff25ce724b439ee8f41da9b75c75f7ec3b55))
- **api:** openid-client rather than passport-openidconnect ([7b18ac8](https://github.com/betagouv/api-subventions-asso/commit/7b18ac83c1933b0fc15a42dad9b804a53c40d9f1))
- **api:** remove finally unused passport strategy ([fedfab1](https://github.com/betagouv/api-subventions-asso/commit/fedfab1bee1e8db38bc1cc1ecd3488ddaaf7bc49))
- **api:** tests and mongo interface ([be644a4](https://github.com/betagouv/api-subventions-asso/commit/be644a48395fdad8437d92e40fadaf38653340ae))
- **api:** typing exception rules ([78a13be](https://github.com/betagouv/api-subventions-asso/commit/78a13bee0fe0286d9d80997a2fe107d040f2ff5a))
- **front,api:** adapt test to string-typed env var ([9228abd](https://github.com/betagouv/api-subventions-asso/commit/9228abd1160c73646b6ca66b32820df658e115d1))
- **front:** move component to relevant folder ([16e7bc4](https://github.com/betagouv/api-subventions-asso/commit/16e7bc4ce71ac725d4e34a477693c0288386b7b1))
- **front:** rna/siren wording ([997ad22](https://github.com/betagouv/api-subventions-asso/commit/997ad225c51383d9fe8ce594e900b3648d1521c4))
- no-breaking updates of dependencies with security issues ([32d8f96](https://github.com/betagouv/api-subventions-asso/commit/32d8f96d25f71a67292b7ec61abf7c417ed7a5e8))

### Features

- add new nx folder location in .gitignore ([#2395](https://github.com/betagouv/api-subventions-asso/issues/2395)) ([deab3e7](https://github.com/betagouv/api-subventions-asso/commit/deab3e778a30ec80564b815db470c95b3477111f))
- **api,dto:** first draft implementing agent connect routine ([ec1807b](https://github.com/betagouv/api-subventions-asso/commit/ec1807b07fa7674d3fd035c09cd296b2232adb34))
- **api,dto:** update mongo version to match mongo session store module ([2b651c3](https://github.com/betagouv/api-subventions-asso/commit/2b651c3ee01678b6411a07c8d23b7b9a9da56e79))
- **api:** [#2234](https://github.com/betagouv/api-subventions-asso/issues/2234) replace provider modal to blog redirection ([#2348](https://github.com/betagouv/api-subventions-asso/issues/2348)) ([0b0bfad](https://github.com/betagouv/api-subventions-asso/commit/0b0bfad3657bd1e0b4d00c857ac74d13d8a2d7b1))
- **api:** [#2265](https://github.com/betagouv/api-subventions-asso/issues/2265) persist api bretagne for bop label ([#2345](https://github.com/betagouv/api-subventions-asso/issues/2345)) ([bedeeea](https://github.com/betagouv/api-subventions-asso/commit/bedeeea5a34ef5bafe2f6150902855c946fe7327))
- **api:** [#2297](https://github.com/betagouv/api-subventions-asso/issues/2297) add exercice field if not exists ([#2298](https://github.com/betagouv/api-subventions-asso/issues/2298)) ([ec79de6](https://github.com/betagouv/api-subventions-asso/commit/ec79de677a9fa80a072efbbe2d650026e1840a4c))
- **api:** accept any domain from agent-connect ([eecf43e](https://github.com/betagouv/api-subventions-asso/commit/eecf43eda8aa5626d48712eb312f28b11517b0a5))
- **api:** actual session managment in db with secret ([89c3f61](https://github.com/betagouv/api-subventions-asso/commit/89c3f61f3edc8509bb2c46a8b7a9cfdfe4bbd2d5))
- **api:** agent connect login in XHR rather than redirect ([066abf8](https://github.com/betagouv/api-subventions-asso/commit/066abf8ea10333fcfcbaf52c76e88aa00947f73c))
- **api:** allow adding domain that already exists without throwing ([131136e](https://github.com/betagouv/api-subventions-asso/commit/131136e55bb8ddee5b62c8bbbc4a4ca416a14d49))
- **api:** basic setup sessions ([3614278](https://github.com/betagouv/api-subventions-asso/commit/36142782948a8352b90a8b1f782bed81baca079f))
- **api:** check agentConnect enabled from ENV var ([2a27b67](https://github.com/betagouv/api-subventions-asso/commit/2a27b67cb7eb85d2b7991f6115347626579aba05))
- **api:** clarify error message if login without password ([a4c0a98](https://github.com/betagouv/api-subventions-asso/commit/a4c0a983e3e855899c209a0c1a087998202fc900))
- **api:** expect localhost alias ([8465dd9](https://github.com/betagouv/api-subventions-asso/commit/8465dd952af4f0576b6c08d5e91d70752c7b46e0))
- **api:** handle agent connect logout ([4cf8a84](https://github.com/betagouv/api-subventions-asso/commit/4cf8a849061b6f0443904eaf348b51959d6832ae))
- **api:** keep agent connect user data up to date ([b770fdc](https://github.com/betagouv/api-subventions-asso/commit/b770fdcdfa5d0f1f63108b93743777e86b820511))
- **api:** no default password ([da4cedf](https://github.com/betagouv/api-subventions-asso/commit/da4cedf849bec46f9575b2521df40ea255321417))
- **api:** prevent agentConnectUsers to change name ([2a7152a](https://github.com/betagouv/api-subventions-asso/commit/2a7152a519e60c2f267a69bf001eb56ec538a21b))
- **api:** retrieve association public utility from api asso ([#2287](https://github.com/betagouv/api-subventions-asso/issues/2287)) ([e324bfc](https://github.com/betagouv/api-subventions-asso/commit/e324bfc33be1f20d8c85d72241526301e06cb5bd))
- **ci:** allow build with new env var ([105ab93](https://github.com/betagouv/api-subventions-asso/commit/105ab93b5d137a350c5cc6b1c8802ff50becbf9f))
- **front:** add estab status in structure page ([#2295](https://github.com/betagouv/api-subventions-asso/issues/2295)) ([28fa3bd](https://github.com/betagouv/api-subventions-asso/commit/28fa3bdc849c2e51c3c9770d38b492683fc76b92))
- **front:** [#2303](https://github.com/betagouv/api-subventions-asso/issues/2303) display amount if status is granted (PR [#2347](https://github.com/betagouv/api-subventions-asso/issues/2347)) ([927f807](https://github.com/betagouv/api-subventions-asso/commit/927f807d05cea0d10f5cc3caa3724f0edeb3739a))
- **front:** [#2307](https://github.com/betagouv/api-subventions-asso/issues/2307) new document design ([#2379](https://github.com/betagouv/api-subventions-asso/issues/2379)) ([ad4c136](https://github.com/betagouv/api-subventions-asso/commit/ad4c136ca0fb7b9523f5f17b9f6758e99e549c4f))
- **front:** [#2310](https://github.com/betagouv/api-subventions-asso/issues/2310) display nb estab in activity in estabs tab ([#2346](https://github.com/betagouv/api-subventions-asso/issues/2346)) ([9d9d87b](https://github.com/betagouv/api-subventions-asso/commit/9d9d87b87d2ba13cb1f366fb2de532e00aa4bc7a))
- **front:** [#2385](https://github.com/betagouv/api-subventions-asso/issues/2385) csv extract no beta ([dcbf3d5](https://github.com/betagouv/api-subventions-asso/commit/dcbf3d5cbff422cabe6d9a6cabb7371aced1e824))
- **front:** add agentConnect button ([a60ce88](https://github.com/betagouv/api-subventions-asso/commit/a60ce885f690072991c8aef0aef3e0c3c6474eb0))
- **front:** crisp event on visiting bodacc tab ([d6947d3](https://github.com/betagouv/api-subventions-asso/commit/d6947d3f31d4e5fa8a19de436295e1cc224407b0))
- **front:** crisp event on visiting bodacc tab ([1ffc9da](https://github.com/betagouv/api-subventions-asso/commit/1ffc9da542ab1b10ee4efc1f02e6be10b787f768))
- **front:** disable agent connect users to change name ([77e84b4](https://github.com/betagouv/api-subventions-asso/commit/77e84b494996b91a0f27dc75b2f56dcc9ce66e10))
- **front:** display asso is public utility ([#2290](https://github.com/betagouv/api-subventions-asso/issues/2290)) ([016c25d](https://github.com/betagouv/api-subventions-asso/commit/016c25d83e1bd110ff64b4fe40e8cb4609038035))
- **front:** display nb estabs in asso page ([#2293](https://github.com/betagouv/api-subventions-asso/issues/2293)) ([4fb2cdc](https://github.com/betagouv/api-subventions-asso/commit/4fb2cdc00fffb007ffe0281c5db2b6edf92aafb0))
- **front:** hide tables and display message in empty data tabs ([8a7825d](https://github.com/betagouv/api-subventions-asso/commit/8a7825d38ac24b95777386929b07bfe4da354dbf))
- **front:** pipedrive upserts itself ([2246fa2](https://github.com/betagouv/api-subventions-asso/commit/2246fa229facaf8732217ec073294cde318f8d8b))
- **front:** redirect for agent connect logout ([97cd058](https://github.com/betagouv/api-subventions-asso/commit/97cd058e0c1b51bc6febcba7920d04b90d5fa481))
- **front:** redirect to blog for CGU ([#2375](https://github.com/betagouv/api-subventions-asso/issues/2375)) ([64a0460](https://github.com/betagouv/api-subventions-asso/commit/64a0460c9d1b6671ae8368393099e9bc10c7dc15))

# [0.48.0](https://github.com/betagouv/api-subventions-asso/compare/v0.47.2...v0.48.0) (2024-04-03)

### Features

- **api:** [#2297](https://github.com/betagouv/api-subventions-asso/issues/2297) add exercice field if not exists ([#2298](https://github.com/betagouv/api-subventions-asso/issues/2298)) ([efb9f1f](https://github.com/betagouv/api-subventions-asso/commit/efb9f1fab6ba6494c75a7cc5be2770233d987b53))
- **api:** retrieve association public utility from api asso ([#2287](https://github.com/betagouv/api-subventions-asso/issues/2287)) ([958d515](https://github.com/betagouv/api-subventions-asso/commit/958d51528bc83f7465113251e5e800697349a71d))
- **front:** add estab status in structure page ([#2295](https://github.com/betagouv/api-subventions-asso/issues/2295)) ([2451acd](https://github.com/betagouv/api-subventions-asso/commit/2451acd2aad48ad30e94e1a98877a9df4fcf64a3))
- **front:** display asso is public utility ([#2290](https://github.com/betagouv/api-subventions-asso/issues/2290)) ([f74b3e7](https://github.com/betagouv/api-subventions-asso/commit/f74b3e72ceded5e976815b1e9951465a4439e950))
- **front:** display nb estabs in asso page ([#2293](https://github.com/betagouv/api-subventions-asso/issues/2293)) ([2d2616d](https://github.com/betagouv/api-subventions-asso/commit/2d2616d9e0ff1ae3bc3ba7ae0f86b4ba6f2304da))
- **front:** hide tables and display message in empty data tabs ([18d92c1](https://github.com/betagouv/api-subventions-asso/commit/18d92c1068829ccf89f75ab1466771cfb5c9d8ff))

## [0.48.1](https://github.com/betagouv/api-subventions-asso/compare/v0.48.0...v0.48.1) (2024-04-08)

### Features

- **front:** crisp event on visiting bodacc tab ([1ffc9da](https://github.com/betagouv/api-subventions-asso/commit/1ffc9da542ab1b10ee4efc1f02e6be10b787f768))

# [0.48.0](https://github.com/betagouv/api-subventions-asso/compare/v0.47.2...v0.48.0) (2024-04-03)

### Features

- **api:** [#2297](https://github.com/betagouv/api-subventions-asso/issues/2297) add exercice field if not exists ([#2298](https://github.com/betagouv/api-subventions-asso/issues/2298)) ([efb9f1f](https://github.com/betagouv/api-subventions-asso/commit/efb9f1fab6ba6494c75a7cc5be2770233d987b53))
- **api:** retrieve association public utility from api asso ([#2287](https://github.com/betagouv/api-subventions-asso/issues/2287)) ([958d515](https://github.com/betagouv/api-subventions-asso/commit/958d51528bc83f7465113251e5e800697349a71d))
- **front:** add estab status in structure page ([#2295](https://github.com/betagouv/api-subventions-asso/issues/2295)) ([2451acd](https://github.com/betagouv/api-subventions-asso/commit/2451acd2aad48ad30e94e1a98877a9df4fcf64a3))
- **front:** display asso is public utility ([#2290](https://github.com/betagouv/api-subventions-asso/issues/2290)) ([f74b3e7](https://github.com/betagouv/api-subventions-asso/commit/f74b3e72ceded5e976815b1e9951465a4439e950))
- **front:** display nb estabs in asso page ([#2293](https://github.com/betagouv/api-subventions-asso/issues/2293)) ([2d2616d](https://github.com/betagouv/api-subventions-asso/commit/2d2616d9e0ff1ae3bc3ba7ae0f86b4ba6f2304da))
- **front:** hide tables and display message in empty data tabs ([18d92c1](https://github.com/betagouv/api-subventions-asso/commit/18d92c1068829ccf89f75ab1466771cfb5c9d8ff))

## [0.47.3](https://github.com/betagouv/api-subventions-asso/compare/v0.47.2...v0.47.3) (2024-04-04)

### Bug Fixes

- **front:** check if user agent is defined in isProfileFullyCompleted ([11d67c7](https://github.com/betagouv/api-subventions-asso/commit/11d67c7b9328218ead1c80cc983b54075dcb9968))
- **front:** check is address is valid before rendering ([f1ab730](https://github.com/betagouv/api-subventions-asso/commit/f1ab730851c1d2a8f18f68b05459bc289a778325))

## [0.47.2](https://github.com/betagouv/api-subventions-asso/compare/v0.46.6...v0.47.2) (2024-03-18)

### Bug Fixes

- **api:** infer doc type in zip ([8749e50](https://github.com/betagouv/api-subventions-asso/commit/8749e5031bd88b4ed37e590791d5dcb381a90aa1))
- **api:** remove break loop from debug session ([#2273](https://github.com/betagouv/api-subventions-asso/issues/2273)) ([d923e1d](https://github.com/betagouv/api-subventions-asso/commit/d923e1dbce76efae8e0e3935e466a9d94690dd51))
- **front:** identifier spacing in association card ([65d70d1](https://github.com/betagouv/api-subventions-asso/commit/65d70d179dc4f6f0e83d3bf7919ea685ab20e226))
- multiples fixes on search page, download batch zip and profile banner ([#2269](https://github.com/betagouv/api-subventions-asso/issues/2269)) ([fd58b73](https://github.com/betagouv/api-subventions-asso/commit/fd58b73c9ef2fe62c59be45b5b3a81ca5afb8d47))

# [0.47.0](https://github.com/betagouv/api-subventions-asso/compare/v0.46.5...v0.47.0) (2024-03-14)

### Bug Fixes

- **front:** establishments do not display on first load ([#2254](https://github.com/betagouv/api-subventions-asso/issues/2254)) ([f31dd3e](https://github.com/betagouv/api-subventions-asso/commit/f31dd3e35295c48bf6a135b1fcf0edab65db2f66))
- **front:** identifier hint placed _after_ search bar ([fc26f99](https://github.com/betagouv/api-subventions-asso/commit/fc26f995ba25453efd88c28557fbcb872f84cbba))

### Features

- **api:** [#2186](https://github.com/betagouv/api-subventions-asso/issues/2186) more DS schemas ([#2253](https://github.com/betagouv/api-subventions-asso/issues/2253)) and no drafts ([12cf2de](https://github.com/betagouv/api-subventions-asso/commit/12cf2defba4f7f9a84fea804338f38828dfceedb))
- **api:** 1210 search pagination ([#2205](https://github.com/betagouv/api-subventions-asso/issues/2205)) ([ebc13b8](https://github.com/betagouv/api-subventions-asso/commit/ebc13b8e3d72735b15fb11d0245a0ee2176ab1e6))
- **api:** scdl tweaks to be more resilient ([a4ff86d](https://github.com/betagouv/api-subventions-asso/commit/a4ff86d0e9adc3cf3637144cd7f025e2f5e98b9b))
- **ci:** also run ci on PR to PROD ([#2243](https://github.com/betagouv/api-subventions-asso/issues/2243)) ([3581fa7](https://github.com/betagouv/api-subventions-asso/commit/3581fa7775f00d16e2af316d6d12eaa5799ad48b))
- **front:** [#2201](https://github.com/betagouv/api-subventions-asso/issues/2201) incomplete profile banner ([#2212](https://github.com/betagouv/api-subventions-asso/issues/2212)) ([752cec7](https://github.com/betagouv/api-subventions-asso/commit/752cec783774cf345a785dd1fe989b7eb88c9efe))
- **front:** [#2203](https://github.com/betagouv/api-subventions-asso/issues/2203) download docs front ([#2240](https://github.com/betagouv/api-subventions-asso/issues/2240)) ([308bb0d](https://github.com/betagouv/api-subventions-asso/commit/308bb0d5701827a7494f931af68f255df36e29c0))
- **front:** [#2222](https://github.com/betagouv/api-subventions-asso/issues/2222) [#2223](https://github.com/betagouv/api-subventions-asso/issues/2223) promote identifiers ([#2244](https://github.com/betagouv/api-subventions-asso/issues/2244)) ([063fcc4](https://github.com/betagouv/api-subventions-asso/commit/063fcc4c7368b0c4fb354f54edc9d8d816ba768a))
- **front:** [#2225](https://github.com/betagouv/api-subventions-asso/issues/2225) give min height to title card with ellipsis ([#2266](https://github.com/betagouv/api-subventions-asso/issues/2266)) ([4a2b01f](https://github.com/betagouv/api-subventions-asso/commit/4a2b01f735c1add920cccba7650b58c6bbad5e5d))
- **front:** [#2229](https://github.com/betagouv/api-subventions-asso/issues/2229) truncate pagination ([#2231](https://github.com/betagouv/api-subventions-asso/issues/2231)) ([1472ef4](https://github.com/betagouv/api-subventions-asso/commit/1472ef47e7d3b4b179cfe7f70fe7275f113b8545))
- **front:** 2065 search pagination front ([#2232](https://github.com/betagouv/api-subventions-asso/issues/2232)) ([a568a69](https://github.com/betagouv/api-subventions-asso/commit/a568a69494d95abd6aea0d030d4cc368d07941bc))
- **front:** display alert if search concerns a company ([#2261](https://github.com/betagouv/api-subventions-asso/issues/2261)) ([bcadd96](https://github.com/betagouv/api-subventions-asso/commit/bcadd962d624160aaec2423c7c1421992e5a3991))

## [0.47.1](https://github.com/betagouv/api-subventions-asso/compare/v0.47.0...v0.47.1) (2024-03-14)

### Bug Fixes

- **api:** set file extension in doc name in zip ([1dc4c02](https://github.com/betagouv/api-subventions-asso/commit/1dc4c0244ebed688683f38209cfbcd776e7ec0da))
- **front:** call docs to download same as to list ([7262516](https://github.com/betagouv/api-subventions-asso/commit/7262516689aaad1a4812ccd4996cf544a4e3e029))
- **front:** change search and page ([2d0ddaf](https://github.com/betagouv/api-subventions-asso/commit/2d0ddaf8e3f2c03849b25b3c78bb2be1815ef947))
- **front:** stop show profile banner on completion ([9ff5490](https://github.com/betagouv/api-subventions-asso/commit/9ff549074eee18fd8962e63981ae27fb2b4d112f))

# [0.47.0](https://github.com/betagouv/api-subventions-asso/compare/v0.46.5...v0.47.0) (2024-03-14)

### Bug Fixes

- **front:** establishments do not display on first load ([#2254](https://github.com/betagouv/api-subventions-asso/issues/2254)) ([f31dd3e](https://github.com/betagouv/api-subventions-asso/commit/f31dd3e35295c48bf6a135b1fcf0edab65db2f66))
- **front:** identifier hint placed _after_ search bar ([fc26f99](https://github.com/betagouv/api-subventions-asso/commit/fc26f995ba25453efd88c28557fbcb872f84cbba))

### Features

- **api:** [#2186](https://github.com/betagouv/api-subventions-asso/issues/2186) more DS schemas ([#2253](https://github.com/betagouv/api-subventions-asso/issues/2253)) and no drafts ([12cf2de](https://github.com/betagouv/api-subventions-asso/commit/12cf2defba4f7f9a84fea804338f38828dfceedb))
- **api:** 1210 search pagination ([#2205](https://github.com/betagouv/api-subventions-asso/issues/2205)) ([ebc13b8](https://github.com/betagouv/api-subventions-asso/commit/ebc13b8e3d72735b15fb11d0245a0ee2176ab1e6))
- **api:** scdl tweaks to be more resilient ([a4ff86d](https://github.com/betagouv/api-subventions-asso/commit/a4ff86d0e9adc3cf3637144cd7f025e2f5e98b9b))
- **ci:** also run ci on PR to PROD ([#2243](https://github.com/betagouv/api-subventions-asso/issues/2243)) ([3581fa7](https://github.com/betagouv/api-subventions-asso/commit/3581fa7775f00d16e2af316d6d12eaa5799ad48b))
- **front:** [#2201](https://github.com/betagouv/api-subventions-asso/issues/2201) incomplete profile banner ([#2212](https://github.com/betagouv/api-subventions-asso/issues/2212)) ([752cec7](https://github.com/betagouv/api-subventions-asso/commit/752cec783774cf345a785dd1fe989b7eb88c9efe))
- **front:** [#2203](https://github.com/betagouv/api-subventions-asso/issues/2203) download docs front ([#2240](https://github.com/betagouv/api-subventions-asso/issues/2240)) ([308bb0d](https://github.com/betagouv/api-subventions-asso/commit/308bb0d5701827a7494f931af68f255df36e29c0))
- **front:** [#2222](https://github.com/betagouv/api-subventions-asso/issues/2222) [#2223](https://github.com/betagouv/api-subventions-asso/issues/2223) promote identifiers ([#2244](https://github.com/betagouv/api-subventions-asso/issues/2244)) ([063fcc4](https://github.com/betagouv/api-subventions-asso/commit/063fcc4c7368b0c4fb354f54edc9d8d816ba768a))
- **front:** [#2225](https://github.com/betagouv/api-subventions-asso/issues/2225) give min height to title card with ellipsis ([#2266](https://github.com/betagouv/api-subventions-asso/issues/2266)) ([4a2b01f](https://github.com/betagouv/api-subventions-asso/commit/4a2b01f735c1add920cccba7650b58c6bbad5e5d))
- **front:** [#2229](https://github.com/betagouv/api-subventions-asso/issues/2229) truncate pagination ([#2231](https://github.com/betagouv/api-subventions-asso/issues/2231)) ([1472ef4](https://github.com/betagouv/api-subventions-asso/commit/1472ef47e7d3b4b179cfe7f70fe7275f113b8545))
- **front:** 2065 search pagination front ([#2232](https://github.com/betagouv/api-subventions-asso/issues/2232)) ([a568a69](https://github.com/betagouv/api-subventions-asso/commit/a568a69494d95abd6aea0d030d4cc368d07941bc))
- **front:** display alert if search concerns a company ([#2261](https://github.com/betagouv/api-subventions-asso/issues/2261)) ([bcadd96](https://github.com/betagouv/api-subventions-asso/commit/bcadd962d624160aaec2423c7c1421992e5a3991))

## [0.46.6](https://github.com/betagouv/api-subventions-asso/compare/v0.46.5...v0.46.6) (2024-03-18)

### Bug Fixes

- **api:** transmit content-disposition header ([8251274](https://github.com/betagouv/api-subventions-asso/commit/82512748f81ffde568288e08d1c4b56eb3cb7555))

## [0.46.5](https://github.com/betagouv/api-subventions-asso/compare/v0.46.4...v0.46.5) (2024-03-08)

### Bug Fixes

- **front:** adapt csp header for crisp ([cca8bdd](https://github.com/betagouv/api-subventions-asso/commit/cca8bdd592afc5d7c8d2291a564f3f5faa02b75f))

## [0.46.4](https://github.com/betagouv/api-subventions-asso/compare/v0.46.1...v0.46.4) (2024-03-06)

### Bug Fixes

- **api,dto:** structure fixture ([8d11e94](https://github.com/betagouv/api-subventions-asso/commit/8d11e94d442b55b2954235b3db3dbe55d379296f))
- **api:** adapts to api asso migration ([04575f9](https://github.com/betagouv/api-subventions-asso/commit/04575f9c0ae44837452121962be2b6bd61d33a54))
- **api:** parse documents from xml to json in api asso ([#2230](https://github.com/betagouv/api-subventions-asso/issues/2230)) ([ed0b3f2](https://github.com/betagouv/api-subventions-asso/commit/ed0b3f2e0db9c3331009891d08a36640546b8665))

### Features

- **api:** update chorus parser with new xlsx format ([#2242](https://github.com/betagouv/api-subventions-asso/issues/2242)) ([39fd3e0](https://github.com/betagouv/api-subventions-asso/commit/39fd3e0e12e0d728b71774c0a3801821051747e3))

## [0.46.3](https://github.com/betagouv/api-subventions-asso/compare/v0.46.1...v0.46.3) (2024-02-29)

### Bug Fixes

- **api,dto:** structure fixture ([8d11e94](https://github.com/betagouv/api-subventions-asso/commit/8d11e94d442b55b2954235b3db3dbe55d379296f))
- **api:** adapts to api asso migration ([04575f9](https://github.com/betagouv/api-subventions-asso/commit/04575f9c0ae44837452121962be2b6bd61d33a54))
- **api:** parse documents from xml to json in api asso ([#2230](https://github.com/betagouv/api-subventions-asso/issues/2230)) ([ed0b3f2](https://github.com/betagouv/api-subventions-asso/commit/ed0b3f2e0db9c3331009891d08a36640546b8665))

## [0.46.2](https://github.com/betagouv/api-subventions-asso/compare/v0.46.1...v0.46.2) (2024-02-28)

### Bug Fixes

- **api,dto:** structure fixture ([8d11e94](https://github.com/betagouv/api-subventions-asso/commit/8d11e94d442b55b2954235b3db3dbe55d379296f))
- **api:** adapts to api asso migration ([04575f9](https://github.com/betagouv/api-subventions-asso/commit/04575f9c0ae44837452121962be2b6bd61d33a54))

## [0.46.1](https://github.com/betagouv/api-subventions-asso/compare/v0.46.0...v0.46.1) (2024-02-19)

### Bug Fixes

- **api:** migration import ([fcd094c](https://github.com/betagouv/api-subventions-asso/commit/fcd094c357ca18d5df978a9d020e284c6f5fb55a))

# [0.46.0](https://github.com/betagouv/api-subventions-asso/compare/v0.45.4...v0.46.0) (2024-02-19)

### Bug Fixes

- **front:** handle plural for establishments tab title ([#2206](https://github.com/betagouv/api-subventions-asso/issues/2206)) ([aa249d1](https://github.com/betagouv/api-subventions-asso/commit/aa249d1027656d97d65b41427ff607a876425a51))

### Features

- 2114 new user field "region" synced with brevo and metabase ([#2194](https://github.com/betagouv/api-subventions-asso/issues/2194)) ([486e5dc](https://github.com/betagouv/api-subventions-asso/commit/486e5dc22b510e08f36a8811ebecd7efecaf4b31))
- **api:** [#2145](https://github.com/betagouv/api-subventions-asso/issues/2145) enhance scdl parsing ([#2155](https://github.com/betagouv/api-subventions-asso/issues/2155)) ([4a36d6a](https://github.com/betagouv/api-subventions-asso/commit/4a36d6a79d5bd7098b10dc73d821e1e6ef49f36d))
- **api:** 2071 send email on account first activation ([#2176](https://github.com/betagouv/api-subventions-asso/issues/2176)) ([b4e8fde](https://github.com/betagouv/api-subventions-asso/commit/b4e8fde0e2fb4d5a615861b9ad864aa21ea38ab5))
- **api:** specific mattermost channel ([888fe2f](https://github.com/betagouv/api-subventions-asso/commit/888fe2f4e5ccb7046facb48d726b1fd8c70fc1e5))
- **front:** [#2061](https://github.com/betagouv/api-subventions-asso/issues/2061) add filtering on establishments ([#2182](https://github.com/betagouv/api-subventions-asso/issues/2182)) ([3ddbae8](https://github.com/betagouv/api-subventions-asso/commit/3ddbae8a661b1e6436cf8646aba178c67d3ab7d8)), closes [#2060](https://github.com/betagouv/api-subventions-asso/issues/2060)
- **front:** add pagination on etablissements ([#2177](https://github.com/betagouv/api-subventions-asso/issues/2177)) ([57a41ce](https://github.com/betagouv/api-subventions-asso/commit/57a41ce2bf97164b7a35def9d4087931b06b1ae0))

## [0.45.4](https://github.com/betagouv/api-subventions-asso/compare/v0.45.3...v0.45.4) (2024-02-08)

### Bug Fixes

- **api:** brevo update resilient to undefined jobType ([d0a40bb](https://github.com/betagouv/api-subventions-asso/commit/d0a40bbde130c9f1888eaef7b72421e861188190))

## [0.45.3](https://github.com/betagouv/api-subventions-asso/compare/v0.45.1...v0.45.3) (2024-02-08)

### Bug Fixes

- **api:** connect db in migration ([e74f788](https://github.com/betagouv/api-subventions-asso/commit/e74f788bfe04046bc3591560fd9e2bd628bb6c28))
- **api:** do not actually disable users that would not have been warned ([a8462e0](https://github.com/betagouv/api-subventions-asso/commit/a8462e07a9431d893a133fbced170a479f08907b))

### Features

- **api:** final arrow colors ([1a51e40](https://github.com/betagouv/api-subventions-asso/commit/1a51e4095d3d38cf696d1f19b1aebf0c99978ccc))

## [0.45.2](https://github.com/betagouv/api-subventions-asso/compare/v0.45.1...v0.45.2) (2024-02-07)

### Bug Fixes

- **api:** connect db in migration ([283dff5](https://github.com/betagouv/api-subventions-asso/commit/283dff5dd97cdb54590053812e235faf3d6cf4ec))

## [0.45.1](https://github.com/betagouv/api-subventions-asso/compare/v0.45.0...v0.45.1) (2024-02-07)

### Bug Fixes

- **api:** better select users to delete or warn ([#2156](https://github.com/betagouv/api-subventions-asso/issues/2156)) ([e2baefa](https://github.com/betagouv/api-subventions-asso/commit/e2baefac14e19f60e06baece27ed97890c2b60d6))
- **api:** keep lastActivtyDate to date and sync brevo last connexion ([#2162](https://github.com/betagouv/api-subventions-asso/issues/2162)) ([71b309d](https://github.com/betagouv/api-subventions-asso/commit/71b309d9f88887ca2220b3aedff174401def93f5))

# [0.45.0](https://github.com/betagouv/api-subventions-asso/compare/v0.44.6...v0.45.0) (2024-02-02)

### Bug Fixes

- **api:** more api asso docs ([21a373a](https://github.com/betagouv/api-subventions-asso/commit/21a373a0fb0f5148b30ce5a5a1ceadcac27d7a04))
- **api:** set default date_modif_siren with a private method ([#2134](https://github.com/betagouv/api-subventions-asso/issues/2134)) ([351234f](https://github.com/betagouv/api-subventions-asso/commit/351234fdb303b4b64698a1c3e52dd8ef2ea0e082))
- disable secure and remove domain for auth cookie in dev mode ([#2103](https://github.com/betagouv/api-subventions-asso/issues/2103)) ([254b719](https://github.com/betagouv/api-subventions-asso/commit/254b719bc1c21fe89832fc0be6ed3dd9c6c0a229))
- fix api doc type ids ([1c77aab](https://github.com/betagouv/api-subventions-asso/commit/1c77aab8c4adc17d2d2b29be0009ae9b8a28ea2e))
- **front:** [#2030](https://github.com/betagouv/api-subventions-asso/issues/2030) do not update exercice if none is defined yet ([#2117](https://github.com/betagouv/api-subventions-asso/issues/2117)) ([61bd13d](https://github.com/betagouv/api-subventions-asso/commit/61bd13d6e968048e6efcbb552a11b40368ced4de))

### Features

- **api:** [#2083](https://github.com/betagouv/api-subventions-asso/issues/2083) add multiple download files in zip ([#2111](https://github.com/betagouv/api-subventions-asso/issues/2111)) ([42d6e51](https://github.com/betagouv/api-subventions-asso/commit/42d6e51a2b8afa37e5606bf678a6e85336185e76))
- **api:** parse pipedrive data and patch metebase users with it ([6fdc3f1](https://github.com/betagouv/api-subventions-asso/commit/6fdc3f15210e09c5a32d6eb0f9ef9f715d731ac6))
- **api:** reactivate rgpd cron to test irl ([8aed8fb](https://github.com/betagouv/api-subventions-asso/commit/8aed8fb95b1a8550e2da7ba85b79253475525bb5))
- **front:** check user connection before page load ([1286f4a](https://github.com/betagouv/api-subventions-asso/commit/1286f4ae8e58c19a52f15a1a89b0b0ac43049cec))
- more api asso docs ([a65acfe](https://github.com/betagouv/api-subventions-asso/commit/a65acfe5d3fc9a79190e5d7e125d839a10a55e34))

## [0.44.6](https://github.com/betagouv/api-subventions-asso/compare/v0.44.5...v0.44.6) (2024-01-30)

### Bug Fixes

- **api:** update build duplicate index error for use with single error ([48d1905](https://github.com/betagouv/api-subventions-asso/commit/48d1905efb66dfa63f7ab676bf834b8c21303517))

## [0.44.5](https://github.com/betagouv/api-subventions-asso/compare/v0.44.4...v0.44.5) (2024-01-26)

### Bug Fixes

- **front:** clear search duplicate alert ([de9091c](https://github.com/betagouv/api-subventions-asso/commit/de9091c7553b24d34d3ae42b98ee71a8f94153b5))
- **front:** don't send credentials to geo.api ([94f6de8](https://github.com/betagouv/api-subventions-asso/commit/94f6de89fcbba8b86935b3b59b0769e3349cc769))

## [0.44.4](https://github.com/betagouv/api-subventions-asso/compare/v0.43.2...v0.44.4) (2024-01-25)

### Bug Fixes

- **api:** ignore rna-siren duplicate error ([#2093](https://github.com/betagouv/api-subventions-asso/issues/2093)) ([09031b7](https://github.com/betagouv/api-subventions-asso/commit/09031b7306b404c767ed3934d062b86a9c5d811d))
- **api:** lastActivityDate migration ([#2097](https://github.com/betagouv/api-subventions-asso/issues/2097)) ([88f952b](https://github.com/betagouv/api-subventions-asso/commit/88f952b67be9cabc8e311e507262f210994735ae))
- **api:** remove duplicate rna siren on database ([#2087](https://github.com/betagouv/api-subventions-asso/issues/2087)) ([22f7d8b](https://github.com/betagouv/api-subventions-asso/commit/22f7d8bc6baa617c60f4727dea36e3ecca8dd153))
- ensure to use cookie everywhere with exact expiration ([#2098](https://github.com/betagouv/api-subventions-asso/issues/2098)) ([633cded](https://github.com/betagouv/api-subventions-asso/commit/633cdedb85d7345339127c893f334f53f9ed2aa1))
- **front:** ensure line separation in dashboard intro ([#2084](https://github.com/betagouv/api-subventions-asso/issues/2084)) ([9756ae7](https://github.com/betagouv/api-subventions-asso/commit/9756ae711fbf0a66fe4e4b4fbd3722d46756dbd5))

# [0.44.0](https://github.com/betagouv/api-subventions-asso/compare/v0.43.1...v0.44.0) (2024-01-22)

### Bug Fixes

- **api:** bad conflict merge resolution ([8496f2e](https://github.com/betagouv/api-subventions-asso/commit/8496f2ed8329bbae11e25ee46a68e176ce8da170))
- **api:** dac documents is not an array its object ([#2040](https://github.com/betagouv/api-subventions-asso/issues/2040)) ([062bd29](https://github.com/betagouv/api-subventions-asso/commit/062bd29014e0c3612602a875382451e53a656259))
- **api:** establishment can be undefined in api asso ([#2039](https://github.com/betagouv/api-subventions-asso/issues/2039)) ([db8ff22](https://github.com/betagouv/api-subventions-asso/commit/db8ff2266d4e3b7cc08a6aa7bdac256cb168f852))
- **api:** fix error when ds return a 200 http code but wrong auth ([#2037](https://github.com/betagouv/api-subventions-asso/issues/2037)) ([cd4b31f](https://github.com/betagouv/api-subventions-asso/commit/cd4b31f6d979cd25097f953810d9de2dd81de0d3))
- **api:** send to sentry real error when brevo update crash ([#2036](https://github.com/betagouv/api-subventions-asso/issues/2036)) ([c642b62](https://github.com/betagouv/api-subventions-asso/commit/c642b62eae04099b438ac1a83b0f1f8b1ca19b11))
- **api:** stringify body on sentry error in brevo contact ([#2035](https://github.com/betagouv/api-subventions-asso/issues/2035)) ([a2c175b](https://github.com/betagouv/api-subventions-asso/commit/a2c175b07b8a361e6d2ca38bb1b9acfdd99e8e79))
- **api:** update follow-redirect (vulnerability) ([d4f3eec](https://github.com/betagouv/api-subventions-asso/commit/d4f3eec187e25ce3854cabeb92ef229396664d2b))
- **front:** fix wrong error when user dont write email ([#2034](https://github.com/betagouv/api-subventions-asso/issues/2034)) ([8b80f6c](https://github.com/betagouv/api-subventions-asso/commit/8b80f6c6b75b5c615efdbec64abe111a4d438ff4))
- **front:** in error catcher an error maybe an native error or axios … ([#2038](https://github.com/betagouv/api-subventions-asso/issues/2038)) ([98424a6](https://github.com/betagouv/api-subventions-asso/commit/98424a642ddcd2fd6feb0831068ad58927c555be))

### Features

- [#1993](https://github.com/betagouv/api-subventions-asso/issues/1993) display rna-siren duplicates ([95fe7cc](https://github.com/betagouv/api-subventions-asso/commit/95fe7cc4b4877f9d9a6b188b5296743ccae74b31))
- **api:** [#1031](https://github.com/betagouv/api-subventions-asso/issues/1031) disable users never seen for 6 months and notify them ([#2073](https://github.com/betagouv/api-subventions-asso/issues/2073)) ([85b64b3](https://github.com/betagouv/api-subventions-asso/commit/85b64b35bf0acb49c67fcded5583ca45543942ce))
- **api:** [#1032](https://github.com/betagouv/api-subventions-asso/issues/1032) warn users before auto deletion because never seen ([#2074](https://github.com/betagouv/api-subventions-asso/issues/2074)) ([189d747](https://github.com/betagouv/api-subventions-asso/commit/189d7477843b90c30b3bf441e38855004f17bfd1))
- **api:** [#1977](https://github.com/betagouv/api-subventions-asso/issues/1977) disable inactive for two years ([#2021](https://github.com/betagouv/api-subventions-asso/issues/2021)) ([b6c49eb](https://github.com/betagouv/api-subventions-asso/commit/b6c49eb599987282767cf4bdc54a98119668595d))
- **api:** add last activity date on user ([#2052](https://github.com/betagouv/api-subventions-asso/issues/2052)) ([dc5e482](https://github.com/betagouv/api-subventions-asso/commit/dc5e482fbf2656d9054da0d475da80f49ae5e6ff))
- **api:** adds logs to mongo connection ([#2041](https://github.com/betagouv/api-subventions-asso/issues/2041)) ([bad833b](https://github.com/betagouv/api-subventions-asso/commit/bad833b4f30e4e4496c42eb5e2e38ccb2432114e))
- **api:** create and use isMongoDuplicateError helper ([cb06585](https://github.com/betagouv/api-subventions-asso/commit/cb06585b85c0c99b22b707ef8aee8d3dceed0780))
- **api:** enhance osiris deploy tool description ([b07bb2e](https://github.com/betagouv/api-subventions-asso/commit/b07bb2e45ac688358540df6ba6edebbc25ae9048))
- **api:** fix comment on scaling app name instead of url ([8139320](https://github.com/betagouv/api-subventions-asso/commit/813932046f8d1ecef81343742ce8fa5a1c1d95c3))
- **api:** update osiris types comment ([3752ba2](https://github.com/betagouv/api-subventions-asso/commit/3752ba29aea9a401ba6ccb9b2c9b8135ecac6990))
- **front:** wording and layout in subv dashboard ([#2075](https://github.com/betagouv/api-subventions-asso/issues/2075)) ([101f143](https://github.com/betagouv/api-subventions-asso/commit/101f143ba28d47accdb0d766c63283c9d5c94b85))
- use auth cookie on api transaction ([#2022](https://github.com/betagouv/api-subventions-asso/issues/2022)) ([5946414](https://github.com/betagouv/api-subventions-asso/commit/5946414db868cf4a586bc8d5bb143cdfcc80d9db))

## [0.44.3](https://github.com/betagouv/api-subventions-asso/compare/v0.43.2...v0.44.3) (2024-01-24)

### Bug Fixes

- **api:** disable rgpd cron ([8a738dc](https://github.com/betagouv/api-subventions-asso/commit/8a738dca511489c2102075905199c3c5e63f3e44))
- **api:** ignore rna-siren duplicate error ([#2093](https://github.com/betagouv/api-subventions-asso/issues/2093)) ([09031b7](https://github.com/betagouv/api-subventions-asso/commit/09031b7306b404c767ed3934d062b86a9c5d811d))
- **api:** remove duplicate rna siren on database ([#2087](https://github.com/betagouv/api-subventions-asso/issues/2087)) ([22f7d8b](https://github.com/betagouv/api-subventions-asso/commit/22f7d8bc6baa617c60f4727dea36e3ecca8dd153))

### Features

- **api:** only prod, preprod and special config runs crons ([f0ed624](https://github.com/betagouv/api-subventions-asso/commit/f0ed62413c6411592143a2c5dfdb17758cd1e8ca))

### Reverts

- Revert "feat(front): wording and layout in subv dashboard (#2075)" ([b87230b](https://github.com/betagouv/api-subventions-asso/commit/b87230bccec075e4d58569db453fa1819d7d6382)), closes [#2075](https://github.com/betagouv/api-subventions-asso/issues/2075)

# [0.44.0](https://github.com/betagouv/api-subventions-asso/compare/v0.43.1...v0.44.0) (2024-01-22)

### Bug Fixes

- **api:** bad conflict merge resolution ([8496f2e](https://github.com/betagouv/api-subventions-asso/commit/8496f2ed8329bbae11e25ee46a68e176ce8da170))
- **api:** dac documents is not an array its object ([#2040](https://github.com/betagouv/api-subventions-asso/issues/2040)) ([062bd29](https://github.com/betagouv/api-subventions-asso/commit/062bd29014e0c3612602a875382451e53a656259))
- **api:** establishment can be undefined in api asso ([#2039](https://github.com/betagouv/api-subventions-asso/issues/2039)) ([db8ff22](https://github.com/betagouv/api-subventions-asso/commit/db8ff2266d4e3b7cc08a6aa7bdac256cb168f852))
- **api:** fix error when ds return a 200 http code but wrong auth ([#2037](https://github.com/betagouv/api-subventions-asso/issues/2037)) ([cd4b31f](https://github.com/betagouv/api-subventions-asso/commit/cd4b31f6d979cd25097f953810d9de2dd81de0d3))
- **api:** send to sentry real error when brevo update crash ([#2036](https://github.com/betagouv/api-subventions-asso/issues/2036)) ([c642b62](https://github.com/betagouv/api-subventions-asso/commit/c642b62eae04099b438ac1a83b0f1f8b1ca19b11))
- **api:** stringify body on sentry error in brevo contact ([#2035](https://github.com/betagouv/api-subventions-asso/issues/2035)) ([a2c175b](https://github.com/betagouv/api-subventions-asso/commit/a2c175b07b8a361e6d2ca38bb1b9acfdd99e8e79))
- **api:** update follow-redirect (vulnerability) ([d4f3eec](https://github.com/betagouv/api-subventions-asso/commit/d4f3eec187e25ce3854cabeb92ef229396664d2b))
- **front:** fix wrong error when user dont write email ([#2034](https://github.com/betagouv/api-subventions-asso/issues/2034)) ([8b80f6c](https://github.com/betagouv/api-subventions-asso/commit/8b80f6c6b75b5c615efdbec64abe111a4d438ff4))
- **front:** in error catcher an error maybe an native error or axios … ([#2038](https://github.com/betagouv/api-subventions-asso/issues/2038)) ([98424a6](https://github.com/betagouv/api-subventions-asso/commit/98424a642ddcd2fd6feb0831068ad58927c555be))

### Features

- [#1993](https://github.com/betagouv/api-subventions-asso/issues/1993) display rna-siren duplicates ([95fe7cc](https://github.com/betagouv/api-subventions-asso/commit/95fe7cc4b4877f9d9a6b188b5296743ccae74b31))
- **api:** [#1031](https://github.com/betagouv/api-subventions-asso/issues/1031) disable users never seen for 6 months and notify them ([#2073](https://github.com/betagouv/api-subventions-asso/issues/2073)) ([85b64b3](https://github.com/betagouv/api-subventions-asso/commit/85b64b35bf0acb49c67fcded5583ca45543942ce))
- **api:** [#1032](https://github.com/betagouv/api-subventions-asso/issues/1032) warn users before auto deletion because never seen ([#2074](https://github.com/betagouv/api-subventions-asso/issues/2074)) ([189d747](https://github.com/betagouv/api-subventions-asso/commit/189d7477843b90c30b3bf441e38855004f17bfd1))
- **api:** [#1977](https://github.com/betagouv/api-subventions-asso/issues/1977) disable inactive for two years ([#2021](https://github.com/betagouv/api-subventions-asso/issues/2021)) ([b6c49eb](https://github.com/betagouv/api-subventions-asso/commit/b6c49eb599987282767cf4bdc54a98119668595d))
- **api:** add last activity date on user ([#2052](https://github.com/betagouv/api-subventions-asso/issues/2052)) ([dc5e482](https://github.com/betagouv/api-subventions-asso/commit/dc5e482fbf2656d9054da0d475da80f49ae5e6ff))
- **api:** adds logs to mongo connection ([#2041](https://github.com/betagouv/api-subventions-asso/issues/2041)) ([bad833b](https://github.com/betagouv/api-subventions-asso/commit/bad833b4f30e4e4496c42eb5e2e38ccb2432114e))
- **api:** create and use isMongoDuplicateError helper ([cb06585](https://github.com/betagouv/api-subventions-asso/commit/cb06585b85c0c99b22b707ef8aee8d3dceed0780))
- **api:** enhance osiris deploy tool description ([b07bb2e](https://github.com/betagouv/api-subventions-asso/commit/b07bb2e45ac688358540df6ba6edebbc25ae9048))
- **api:** fix comment on scaling app name instead of url ([8139320](https://github.com/betagouv/api-subventions-asso/commit/813932046f8d1ecef81343742ce8fa5a1c1d95c3))
- **api:** update osiris types comment ([3752ba2](https://github.com/betagouv/api-subventions-asso/commit/3752ba29aea9a401ba6ccb9b2c9b8135ecac6990))
- **front:** wording and layout in subv dashboard ([#2075](https://github.com/betagouv/api-subventions-asso/issues/2075)) ([101f143](https://github.com/betagouv/api-subventions-asso/commit/101f143ba28d47accdb0d766c63283c9d5c94b85))
- use auth cookie on api transaction ([#2022](https://github.com/betagouv/api-subventions-asso/issues/2022)) ([5946414](https://github.com/betagouv/api-subventions-asso/commit/5946414db868cf4a586bc8d5bb143cdfcc80d9db))

## [0.44.2](https://github.com/betagouv/api-subventions-asso/compare/v0.43.2...v0.44.2) (2024-01-23)

### Bug Fixes

- **api:** ignore rna-siren duplicate error ([f17a69e](https://github.com/betagouv/api-subventions-asso/commit/f17a69e94639a8360b548111cefeffe15775de11))
- **api:** remove duplicate rna siren on database ([#2087](https://github.com/betagouv/api-subventions-asso/issues/2087)) ([22f7d8b](https://github.com/betagouv/api-subventions-asso/commit/22f7d8bc6baa617c60f4727dea36e3ecca8dd153))
- **front:** ensure line separation in dashboard intro ([#2084](https://github.com/betagouv/api-subventions-asso/issues/2084)) ([9756ae7](https://github.com/betagouv/api-subventions-asso/commit/9756ae711fbf0a66fe4e4b4fbd3722d46756dbd5))

# [0.44.0](https://github.com/betagouv/api-subventions-asso/compare/v0.43.1...v0.44.0) (2024-01-22)

### Bug Fixes

- **api:** bad conflict merge resolution ([8496f2e](https://github.com/betagouv/api-subventions-asso/commit/8496f2ed8329bbae11e25ee46a68e176ce8da170))
- **api:** dac documents is not an array its object ([#2040](https://github.com/betagouv/api-subventions-asso/issues/2040)) ([062bd29](https://github.com/betagouv/api-subventions-asso/commit/062bd29014e0c3612602a875382451e53a656259))
- **api:** establishment can be undefined in api asso ([#2039](https://github.com/betagouv/api-subventions-asso/issues/2039)) ([db8ff22](https://github.com/betagouv/api-subventions-asso/commit/db8ff2266d4e3b7cc08a6aa7bdac256cb168f852))
- **api:** fix error when ds return a 200 http code but wrong auth ([#2037](https://github.com/betagouv/api-subventions-asso/issues/2037)) ([cd4b31f](https://github.com/betagouv/api-subventions-asso/commit/cd4b31f6d979cd25097f953810d9de2dd81de0d3))
- **api:** send to sentry real error when brevo update crash ([#2036](https://github.com/betagouv/api-subventions-asso/issues/2036)) ([c642b62](https://github.com/betagouv/api-subventions-asso/commit/c642b62eae04099b438ac1a83b0f1f8b1ca19b11))
- **api:** stringify body on sentry error in brevo contact ([#2035](https://github.com/betagouv/api-subventions-asso/issues/2035)) ([a2c175b](https://github.com/betagouv/api-subventions-asso/commit/a2c175b07b8a361e6d2ca38bb1b9acfdd99e8e79))
- **api:** update follow-redirect (vulnerability) ([d4f3eec](https://github.com/betagouv/api-subventions-asso/commit/d4f3eec187e25ce3854cabeb92ef229396664d2b))
- **front:** fix wrong error when user dont write email ([#2034](https://github.com/betagouv/api-subventions-asso/issues/2034)) ([8b80f6c](https://github.com/betagouv/api-subventions-asso/commit/8b80f6c6b75b5c615efdbec64abe111a4d438ff4))
- **front:** in error catcher an error maybe an native error or axios … ([#2038](https://github.com/betagouv/api-subventions-asso/issues/2038)) ([98424a6](https://github.com/betagouv/api-subventions-asso/commit/98424a642ddcd2fd6feb0831068ad58927c555be))

### Features

- [#1993](https://github.com/betagouv/api-subventions-asso/issues/1993) display rna-siren duplicates ([95fe7cc](https://github.com/betagouv/api-subventions-asso/commit/95fe7cc4b4877f9d9a6b188b5296743ccae74b31))
- **api:** [#1031](https://github.com/betagouv/api-subventions-asso/issues/1031) disable users never seen for 6 months and notify them ([#2073](https://github.com/betagouv/api-subventions-asso/issues/2073)) ([85b64b3](https://github.com/betagouv/api-subventions-asso/commit/85b64b35bf0acb49c67fcded5583ca45543942ce))
- **api:** [#1032](https://github.com/betagouv/api-subventions-asso/issues/1032) warn users before auto deletion because never seen ([#2074](https://github.com/betagouv/api-subventions-asso/issues/2074)) ([189d747](https://github.com/betagouv/api-subventions-asso/commit/189d7477843b90c30b3bf441e38855004f17bfd1))
- **api:** [#1977](https://github.com/betagouv/api-subventions-asso/issues/1977) disable inactive for two years ([#2021](https://github.com/betagouv/api-subventions-asso/issues/2021)) ([b6c49eb](https://github.com/betagouv/api-subventions-asso/commit/b6c49eb599987282767cf4bdc54a98119668595d))
- **api:** add last activity date on user ([#2052](https://github.com/betagouv/api-subventions-asso/issues/2052)) ([dc5e482](https://github.com/betagouv/api-subventions-asso/commit/dc5e482fbf2656d9054da0d475da80f49ae5e6ff))
- **api:** adds logs to mongo connection ([#2041](https://github.com/betagouv/api-subventions-asso/issues/2041)) ([bad833b](https://github.com/betagouv/api-subventions-asso/commit/bad833b4f30e4e4496c42eb5e2e38ccb2432114e))
- **api:** create and use isMongoDuplicateError helper ([cb06585](https://github.com/betagouv/api-subventions-asso/commit/cb06585b85c0c99b22b707ef8aee8d3dceed0780))
- **api:** enhance osiris deploy tool description ([b07bb2e](https://github.com/betagouv/api-subventions-asso/commit/b07bb2e45ac688358540df6ba6edebbc25ae9048))
- **api:** fix comment on scaling app name instead of url ([8139320](https://github.com/betagouv/api-subventions-asso/commit/813932046f8d1ecef81343742ce8fa5a1c1d95c3))
- **api:** update osiris types comment ([3752ba2](https://github.com/betagouv/api-subventions-asso/commit/3752ba29aea9a401ba6ccb9b2c9b8135ecac6990))
- **front:** wording and layout in subv dashboard ([#2075](https://github.com/betagouv/api-subventions-asso/issues/2075)) ([101f143](https://github.com/betagouv/api-subventions-asso/commit/101f143ba28d47accdb0d766c63283c9d5c94b85))
- use auth cookie on api transaction ([#2022](https://github.com/betagouv/api-subventions-asso/issues/2022)) ([5946414](https://github.com/betagouv/api-subventions-asso/commit/5946414db868cf4a586bc8d5bb143cdfcc80d9db))

## [0.43.3](https://github.com/betagouv/api-subventions-asso/compare/v0.43.2...v0.43.3) (2024-01-23)

### Bug Fixes

- **api:** remove duplicate rna siren on database ([91c669a](https://github.com/betagouv/api-subventions-asso/commit/91c669a7b702f02a5f13262e2bb2801fc7c20de8))

## [0.44.1](https://github.com/betagouv/api-subventions-asso/compare/v0.44.0...v0.44.1) (2024-01-23)

### Bug Fixes

# [0.44.0](https://github.com/betagouv/api-subventions-asso/compare/v0.43.1...v0.44.0) (2024-01-22)

### Bug Fixes

- **api:** bad conflict merge resolution ([8496f2e](https://github.com/betagouv/api-subventions-asso/commit/8496f2ed8329bbae11e25ee46a68e176ce8da170))
- **api:** dac documents is not an array its object ([#2040](https://github.com/betagouv/api-subventions-asso/issues/2040)) ([062bd29](https://github.com/betagouv/api-subventions-asso/commit/062bd29014e0c3612602a875382451e53a656259))
- **api:** establishment can be undefined in api asso ([#2039](https://github.com/betagouv/api-subventions-asso/issues/2039)) ([db8ff22](https://github.com/betagouv/api-subventions-asso/commit/db8ff2266d4e3b7cc08a6aa7bdac256cb168f852))
- **api:** fix error when ds return a 200 http code but wrong auth ([#2037](https://github.com/betagouv/api-subventions-asso/issues/2037)) ([cd4b31f](https://github.com/betagouv/api-subventions-asso/commit/cd4b31f6d979cd25097f953810d9de2dd81de0d3))
- **api:** send to sentry real error when brevo update crash ([#2036](https://github.com/betagouv/api-subventions-asso/issues/2036)) ([c642b62](https://github.com/betagouv/api-subventions-asso/commit/c642b62eae04099b438ac1a83b0f1f8b1ca19b11))
- **api:** stringify body on sentry error in brevo contact ([#2035](https://github.com/betagouv/api-subventions-asso/issues/2035)) ([a2c175b](https://github.com/betagouv/api-subventions-asso/commit/a2c175b07b8a361e6d2ca38bb1b9acfdd99e8e79))
- **api:** update follow-redirect (vulnerability) ([d4f3eec](https://github.com/betagouv/api-subventions-asso/commit/d4f3eec187e25ce3854cabeb92ef229396664d2b))
- **front:** fix wrong error when user dont write email ([#2034](https://github.com/betagouv/api-subventions-asso/issues/2034)) ([8b80f6c](https://github.com/betagouv/api-subventions-asso/commit/8b80f6c6b75b5c615efdbec64abe111a4d438ff4))
- **front:** in error catcher an error maybe an native error or axios … ([#2038](https://github.com/betagouv/api-subventions-asso/issues/2038)) ([98424a6](https://github.com/betagouv/api-subventions-asso/commit/98424a642ddcd2fd6feb0831068ad58927c555be))

### Features

- [#1993](https://github.com/betagouv/api-subventions-asso/issues/1993) display rna-siren duplicates ([95fe7cc](https://github.com/betagouv/api-subventions-asso/commit/95fe7cc4b4877f9d9a6b188b5296743ccae74b31))
- **api:** [#1031](https://github.com/betagouv/api-subventions-asso/issues/1031) disable users never seen for 6 months and notify them ([#2073](https://github.com/betagouv/api-subventions-asso/issues/2073)) ([85b64b3](https://github.com/betagouv/api-subventions-asso/commit/85b64b35bf0acb49c67fcded5583ca45543942ce))
- **api:** [#1032](https://github.com/betagouv/api-subventions-asso/issues/1032) warn users before auto deletion because never seen ([#2074](https://github.com/betagouv/api-subventions-asso/issues/2074)) ([189d747](https://github.com/betagouv/api-subventions-asso/commit/189d7477843b90c30b3bf441e38855004f17bfd1))
- **api:** [#1977](https://github.com/betagouv/api-subventions-asso/issues/1977) disable inactive for two years ([#2021](https://github.com/betagouv/api-subventions-asso/issues/2021)) ([b6c49eb](https://github.com/betagouv/api-subventions-asso/commit/b6c49eb599987282767cf4bdc54a98119668595d))
- **api:** add last activity date on user ([#2052](https://github.com/betagouv/api-subventions-asso/issues/2052)) ([dc5e482](https://github.com/betagouv/api-subventions-asso/commit/dc5e482fbf2656d9054da0d475da80f49ae5e6ff))
- **api:** adds logs to mongo connection ([#2041](https://github.com/betagouv/api-subventions-asso/issues/2041)) ([bad833b](https://github.com/betagouv/api-subventions-asso/commit/bad833b4f30e4e4496c42eb5e2e38ccb2432114e))
- **api:** create and use isMongoDuplicateError helper ([cb06585](https://github.com/betagouv/api-subventions-asso/commit/cb06585b85c0c99b22b707ef8aee8d3dceed0780))
- **api:** enhance osiris deploy tool description ([b07bb2e](https://github.com/betagouv/api-subventions-asso/commit/b07bb2e45ac688358540df6ba6edebbc25ae9048))
- **api:** fix comment on scaling app name instead of url ([8139320](https://github.com/betagouv/api-subventions-asso/commit/813932046f8d1ecef81343742ce8fa5a1c1d95c3))
- **api:** update osiris types comment ([3752ba2](https://github.com/betagouv/api-subventions-asso/commit/3752ba29aea9a401ba6ccb9b2c9b8135ecac6990))
- use auth cookie on api transaction ([#2022](https://github.com/betagouv/api-subventions-asso/issues/2022)) ([5946414](https://github.com/betagouv/api-subventions-asso/commit/5946414db868cf4a586bc8d5bb143cdfcc80d9db))

## [0.43.2](https://github.com/betagouv/api-subventions-asso/compare/v0.43.1...v0.43.2) (2024-01-22)

### Bug Fixes

- **api:** catch error on recherche entreprise api is hs ([91b1c8d](https://github.com/betagouv/api-subventions-asso/commit/91b1c8d817e852f8ef503a1e24d5a0a20555c5b4))

## [0.43.1](https://github.com/betagouv/api-subventions-asso/compare/v0.43.0...v0.43.1) (2024-01-10)

**Note:** Version bump only for package api-subventions-asso

# [0.43.0](https://github.com/betagouv/api-subventions-asso/compare/v0.42.3...v0.43.0) (2024-01-05)

### Bug Fixes

- **api:** conventionDate is mandatory not paymentStartDate ([186bc56](https://github.com/betagouv/api-subventions-asso/commit/186bc56c1d55956900680403aa578b9a06242008))
- **api:** get insee avis situation from secondary establishment ([8bf24d6](https://github.com/betagouv/api-subventions-asso/commit/8bf24d64b9609686deeed434054a48bb3bf2ef68))
- **api:** tweak mandatory and optional parameters scdl ([e4083e6](https://github.com/betagouv/api-subventions-asso/commit/e4083e671ff1e31a563566fa8ab6eeddee31fd1f))
- **front:** extract content in blob not uri ([e046574](https://github.com/betagouv/api-subventions-asso/commit/e046574f9c8763fbabd134c351f7b62665b1b165))
- **front:** hides LDC documents ([5c41c6f](https://github.com/betagouv/api-subventions-asso/commit/5c41c6f3600de6d0a7344f8d799bda4a1141bbf3))
- **front:** rename variable (review) ([59180ff](https://github.com/betagouv/api-subventions-asso/commit/59180ffaa34da0f497c4d03e818ad3462377a2e5))
- **front:** use browser version for csv stringify ([20875f7](https://github.com/betagouv/api-subventions-asso/commit/20875f7ea6eef9b00b6ac3379b8eddf04f60777f))

### Features

- **api:** any provider doc can be served by api ([beb817e](https://github.com/betagouv/api-subventions-asso/commit/beb817efc0514edf0e74b95f0d6533690897dc0b))
- **api:** joiner to get scdl grants with provider metadata ([e7caaa5](https://github.com/betagouv/api-subventions-asso/commit/e7caaa5e017efd06f3f8abef3fb44e15fb8e4e3d))
- **api:** misc scdl adapter ([7d9f2a0](https://github.com/betagouv/api-subventions-asso/commit/7d9f2a0cd55b3c2591a49147b98186b9cad27230))
- **api:** misc scdl grant provider ([1b2cda4](https://github.com/betagouv/api-subventions-asso/commit/1b2cda449bad49b45950aa3ac85247f1b078445f))
- **api:** proxied doc url in query ([299d179](https://github.com/betagouv/api-subventions-asso/commit/299d179410a1d14782f4d593de77355effaae375))
- **api:** send local url to proxied documents ([7109341](https://github.com/betagouv/api-subventions-asso/commit/71093417e48e4abb39a767817853ecbd52dc79b6))
- **front:** a11y 'nouvelle fenêtre' in title ([5928a0e](https://github.com/betagouv/api-subventions-asso/commit/5928a0e3a000d1692d6ddef5d00413cf76a237cf))
- **front:** change url matomo ([3c36caa](https://github.com/betagouv/api-subventions-asso/commit/3c36caa16df4c7f459888696dd70e1ef0c3ad451))
- **front:** document card is download card ([24f0a15](https://github.com/betagouv/api-subventions-asso/commit/24f0a15baacdd5b2969e8663a77d6369647dedda)), closes [#1565](https://github.com/betagouv/api-subventions-asso/issues/1565)
- **front:** front adds domain and token to all document links ([b2358b6](https://github.com/betagouv/api-subventions-asso/commit/b2358b610abbb901d4d341a313c479a6eecc98b1))
- **front:** neater csv generation ([50be925](https://github.com/betagouv/api-subventions-asso/commit/50be925d8c48e323e2bcca51d6363619dd2a564f))
- **front:** new document card ([e1b6dd9](https://github.com/betagouv/api-subventions-asso/commit/e1b6dd92ac79ab6ea2c61b6532fad3b768e1ba9f))
- **front:** separate docs by associated structure type ([b7d47d6](https://github.com/betagouv/api-subventions-asso/commit/b7d47d6299c6b7d2d4181a4d12b5fc898c473b3f))
- **front:** sort documents by type label then date ([717f8da](https://github.com/betagouv/api-subventions-asso/commit/717f8da193a66992c9e6c37bbc5cd2f4f12365d8))

## [0.42.3](https://github.com/betagouv/api-subventions-asso/compare/v0.42.2...v0.42.3) (2023-12-19)

### Bug Fixes

- **front:** add this context on get xxx subventions store ([166ea74](https://github.com/betagouv/api-subventions-asso/commit/166ea7436d6855248b71b29d1ed6277b93bce213))

## [0.42.2](https://github.com/betagouv/api-subventions-asso/compare/v0.42.1...v0.42.2) (2023-12-19)

### Bug Fixes

- **api:** brevo mail notify accepts USER_CONFLICT ([0fb7656](https://github.com/betagouv/api-subventions-asso/commit/0fb76561fb297fbc5d0ceea82a36a3a8674db2b1))
- **api:** no call to dauphin documents while we no longer have access ([a7ddd2f](https://github.com/betagouv/api-subventions-asso/commit/a7ddd2fbb95ed93cdf990ee0ba424ddde2920372))
- **front:** fix sort postal code on subvention versement dashboard ([8838a48](https://github.com/betagouv/api-subventions-asso/commit/8838a48b9fc6646e98495e570df769225520f5cb))
- **front:** get association from store in establishment page ([858936f](https://github.com/betagouv/api-subventions-asso/commit/858936f2eb1d1f5619dc6d545d49cb71067d8bc4))

## [0.42.1](https://github.com/betagouv/api-subventions-asso/compare/v0.42.0...v0.42.1) (2023-12-15)

### Bug Fixes

- **api:** fix misc scdl grand index name ([21d6d86](https://github.com/betagouv/api-subventions-asso/commit/21d6d8618aa055bc060aee01f9a0d61064c53424))

# [0.42.0](https://github.com/betagouv/api-subventions-asso/compare/v0.40.3...v0.42.0) (2023-12-15)

### Bug Fixes

- **api:** chorus filter before insert ([c46a88c](https://github.com/betagouv/api-subventions-asso/commit/c46a88c5a61c5be3f19029ebfaf8dff95e197fe3))
- **api:** don't compare promises ([6545533](https://github.com/betagouv/api-subventions-asso/commit/6545533be26a7b6798b7471b61a34f92b76cf817))
- **api:** mapper config error ([a3ef228](https://github.com/betagouv/api-subventions-asso/commit/a3ef2284fe1e2e491b913924a34e48014ec6817f))
- **api:** more precise edge cases ([2a24190](https://github.com/betagouv/api-subventions-asso/commit/2a24190fae797bc0c4e1a850e9cf743b6dffab97))
- **api:** parser log ([ea2a2eb](https://github.com/betagouv/api-subventions-asso/commit/ea2a2eb6d06be111ea2580522cd034266b32ac78))
- **api:** quick fix chorus line ([1940fcb](https://github.com/betagouv/api-subventions-asso/commit/1940fcbd9d280f22d7b3af66cae1f0ff117292c1))
- **api:** quick fix for apiAsso 404 error ([98a368c](https://github.com/betagouv/api-subventions-asso/commit/98a368c1a3402bc39dad6e6cdf4c029a15b7fa69))
- **api:** specify LCA parser delimiter \t ([ef67028](https://github.com/betagouv/api-subventions-asso/commit/ef6702831a16fc6f0d9d35cef5eb9c971ed57906))
- **api:** update filter call to make this accessible ([ae8b281](https://github.com/betagouv/api-subventions-asso/commit/ae8b281359a570aaa77cffe77dc9bf2d1a013b38))

### Features

- **api:** add api recherche entreprises ([800deff](https://github.com/betagouv/api-subventions-asso/commit/800deff166319e23116687c63a6fb9250c045f9b))
- **api:** add comment on writeErrors ([6497cca](https://github.com/betagouv/api-subventions-asso/commit/6497cca6a35eac498f71af3f951b5f5e3cd35592))
- **api:** broaden scdl adapters ([d2aaeb6](https://github.com/betagouv/api-subventions-asso/commit/d2aaeb65aa9bbbf93ed361cb3ec655cd35148dd4))
- **api:** build unique anonymized email for deleted users ([62b4347](https://github.com/betagouv/api-subventions-asso/commit/62b4347a9772a7c746cf37913a5e1997efc648f1))
- **api:** create recherche entreprise port and use this on association name ([3156e74](https://github.com/betagouv/api-subventions-asso/commit/3156e74a1f8d3214d4a8ae16378b39b8dfca1d44))
- **api:** custom delimeter caracter ([8bca6de](https://github.com/betagouv/api-subventions-asso/commit/8bca6de0702ed97f4f8b1c46064cedd8e86f25bd))
- **api:** expand scdl mapper ([8da5c09](https://github.com/betagouv/api-subventions-asso/commit/8da5c09b96e13ff5bcbd7308df721b95d1f28456))
- **api:** extend scdl mapper headers ([27db017](https://github.com/betagouv/api-subventions-asso/commit/27db0175f71ec1cb54d302983d172fc23f91db55))
- **api:** handle lower and upper case in SCDL file headers ([fff9b35](https://github.com/betagouv/api-subventions-asso/commit/fff9b35685be80dc9ac35b47879be4379f6864f6))
- **api:** init indexes before cli ([23d2540](https://github.com/betagouv/api-subventions-asso/commit/23d2540d44a4b68c36a122346a0bf4567c974cfa))
- **api:** notification type for user already subscribed ([e6300ad](https://github.com/betagouv/api-subventions-asso/commit/e6300ad51fe210d09388e1fc5972ff479bc649d9))
- **api:** only insert new chorus entities + parse refactoring ([a23e08d](https://github.com/betagouv/api-subventions-asso/commit/a23e08d7a89d01b1c4d64115c5383307181ae2c9))
- **api:** rebase and fix last commit revert ([805641d](https://github.com/betagouv/api-subventions-asso/commit/805641d32c661b780a985207cec717ade4e6bbd3))
- **api:** sanitize cell content in csv parsing ([023cc57](https://github.com/betagouv/api-subventions-asso/commit/023cc57ea5a3992f50fc217ea094132978648056))
- **api:** save entities with # as SIRET ([eb45d4a](https://github.com/betagouv/api-subventions-asso/commit/eb45d4ae2f240c7dd733f430f640288bdabfa31d))
- **api:** scdl cli manage duplicates ([e5dc3cb](https://github.com/betagouv/api-subventions-asso/commit/e5dc3cb408944f5336a40906647e558f32821829))
- **api:** scdl index unicity constraint ([179567a](https://github.com/betagouv/api-subventions-asso/commit/179567a743c6c32b500a961187f2cb8cbaf81ccc))
- **api:** send brevo email ([8caf5ff](https://github.com/betagouv/api-subventions-asso/commit/8caf5ffdefe96686e688606b60e6e80455105eba))
- **api:** throw and catch mongodb duplicates errors ([53243c9](https://github.com/betagouv/api-subventions-asso/commit/53243c974810ff55a8b70015510c31fbeec3a0ca))
- **api:** typing DuplicateIndexError ([9e1002a](https://github.com/betagouv/api-subventions-asso/commit/9e1002aa262458052b5280e8b35c4599dae5a585))
- **api:** update regexp to handle triple quotes in cell content ([d800139](https://github.com/betagouv/api-subventions-asso/commit/d800139b268571a79824899586a38d219f127a07))
- **api:** use csv lib ([180e344](https://github.com/betagouv/api-subventions-asso/commit/180e3447b459b2715930cc7521c16f2b5dfe9333))
- **api:** wip add scdl grant validator ([4d88d40](https://github.com/betagouv/api-subventions-asso/commit/4d88d4041637559c7c07583f354fc4f68a7eacd2))

# [0.41.0](https://github.com/betagouv/api-subventions-asso/compare/v0.40.1...v0.41.0) (2023-11-29)

### Bug Fixes

- **api:** fix some tests ([463eedc](https://github.com/betagouv/api-subventions-asso/commit/463eedcf9df4dc579893792537b7414880df5a6e))
- **front:** a11y title hierarchy ([3a69335](https://github.com/betagouv/api-subventions-asso/commit/3a6933507021af8828099c2529b4b4b75d49445b))
- **front:** alert about non-association pages ([b2ffc93](https://github.com/betagouv/api-subventions-asso/commit/b2ffc936dda9af2a7d93f4479532d1dd5ac7db1c))

### Features

- **api:** change searchingkey by searchkey ([82bb392](https://github.com/betagouv/api-subventions-asso/commit/82bb39242a5bf382bbc8379d5d61ea5791096c36))
- **front:** asso & etab front types ([06ef1a9](https://github.com/betagouv/api-subventions-asso/commit/06ef1a9939e0dfdda22aff592c1f406f1ec4585b))
- **front:** completely hid tabs if not asso ([8c1e6b3](https://github.com/betagouv/api-subventions-asso/commit/8c1e6b33aafa03e81e51ad0ee503af9548cc17ff))
- **front:** display cp instead of establishment ([a25fb78](https://github.com/betagouv/api-subventions-asso/commit/a25fb78e3d5b97cc023e761cf61e0fb53e0d646d))
- **front:** show search if duplicate rna siren ([e8ec04b](https://github.com/betagouv/api-subventions-asso/commit/e8ec04b129187dee3d021121d922b65db7c13c9e))

# [0.41.0](https://github.com/betagouv/api-subventions-asso/compare/v0.40.1...v0.41.0) (2023-11-29)

### Bug Fixes

- **api:** fix some tests ([463eedc](https://github.com/betagouv/api-subventions-asso/commit/463eedcf9df4dc579893792537b7414880df5a6e))
- **front:** a11y title hierarchy ([3a69335](https://github.com/betagouv/api-subventions-asso/commit/3a6933507021af8828099c2529b4b4b75d49445b))
- **front:** alert about non-association pages ([b2ffc93](https://github.com/betagouv/api-subventions-asso/commit/b2ffc936dda9af2a7d93f4479532d1dd5ac7db1c))

### Features

- **api:** change searchingkey by searchkey ([82bb392](https://github.com/betagouv/api-subventions-asso/commit/82bb39242a5bf382bbc8379d5d61ea5791096c36))
- **front:** asso & etab front types ([06ef1a9](https://github.com/betagouv/api-subventions-asso/commit/06ef1a9939e0dfdda22aff592c1f406f1ec4585b))
- **front:** completely hid tabs if not asso ([8c1e6b3](https://github.com/betagouv/api-subventions-asso/commit/8c1e6b33aafa03e81e51ad0ee503af9548cc17ff))
- **front:** display cp instead of establishment ([a25fb78](https://github.com/betagouv/api-subventions-asso/commit/a25fb78e3d5b97cc023e761cf61e0fb53e0d646d))
- **front:** show search if duplicate rna siren ([e8ec04b](https://github.com/betagouv/api-subventions-asso/commit/e8ec04b129187dee3d021121d922b65db7c13c9e))

## [0.40.3](https://github.com/betagouv/api-subventions-asso/compare/v0.40.2...v0.40.3) (2023-12-06)

### Bug Fixes

- search can accepted slash on input ([9795fe0](https://github.com/betagouv/api-subventions-asso/commit/9795fe042ea87db8e257b1a0cea4bde88ee6dcef))

## [0.40.2](https://github.com/betagouv/api-subventions-asso/compare/v0.40.1...v0.40.2) (2023-11-30)

### Bug Fixes

- association may not have a list of establishments ([fd90121](https://github.com/betagouv/api-subventions-asso/commit/fd9012116a17e57518a1683f221278a90127eb7c))

## [0.40.1](https://github.com/betagouv/api-subventions-asso/compare/v0.40.0...v0.40.1) (2023-11-29)

### Bug Fixes

- **api:** do not modify user for logs ([344ce51](https://github.com/betagouv/api-subventions-asso/commit/344ce51da868b6fb34b8e7b0abe5dd3d14cade80))

# [0.40.0](https://github.com/betagouv/api-subventions-asso/compare/v0.39.3...v0.40.0) (2023-11-27)

### Bug Fixes

- **api:** handle empty establishement in sirenStructureToAssociation ([218fa8c](https://github.com/betagouv/api-subventions-asso/commit/218fa8c3f544c203b38d36b9cc0039a675d7e5e1))
- **front:** a11y structure hierarchy ([fe7f6d6](https://github.com/betagouv/api-subventions-asso/commit/fe7f6d675fa369b4cbcb79736f5f5a5802b3a6df))
- **front:** association card title ellipsis ([7493e0c](https://github.com/betagouv/api-subventions-asso/commit/7493e0c68cef056c4009c47b9bef146310821089))

### Features

- **front:** a11y declaration page ([ba25f8a](https://github.com/betagouv/api-subventions-asso/commit/ba25f8a70f89d748dde073f0b9abc930da2b4bef))
- **front:** update default footer links ([e2cccb4](https://github.com/betagouv/api-subventions-asso/commit/e2cccb4d871d236ef49d7a17894914c04e94da10))

## [0.39.3](https://github.com/betagouv/api-subventions-asso/compare/v0.38.8...v0.39.3) (2023-11-20)

### Bug Fixes

- **front:** association card url with rna ([b6fcd4d](https://github.com/betagouv/api-subventions-asso/commit/b6fcd4d731decf378573af318576d5cc157f8cd7))
- **front:** disable search button if value is empty ([1474b69](https://github.com/betagouv/api-subventions-asso/commit/1474b6931391bcc41db3efce8fb0ce129f9cb5d7))
- **front:** display establishment address ([4cff825](https://github.com/betagouv/api-subventions-asso/commit/4cff825feaaadc1d2db64acc1cfb0d244c5e79e1))
- **front:** display input in SearchBar on search page first load ([a9265a8](https://github.com/betagouv/api-subventions-asso/commit/a9265a8680542dd9849480b68ef985c4143ffa8d))
- **front:** redirect to structure page if input is an identifier ([662b017](https://github.com/betagouv/api-subventions-asso/commit/662b017b12be9c518766ef3a42dc3b421600ce20))

## [0.39.2](https://github.com/betagouv/api-subventions-asso/compare/v0.39.1...v0.39.2) (2023-11-15)

### Bug Fixes

- **api:** updateLogUserId migration default import in commonjs ([4e3fbb8](https://github.com/betagouv/api-subventions-asso/commit/4e3fbb8f1b945d0c06bbdddb1a4336f36e1462c1))

## [0.39.1](https://github.com/betagouv/api-subventions-asso/compare/v0.39.0...v0.39.1) (2023-11-15)

### Bug Fixes

- **api:** updateLogUserId migration import path ([b8626e9](https://github.com/betagouv/api-subventions-asso/commit/b8626e964c4bc16ab8a08077252c77ce1a8630d6))

# [0.39.0](https://github.com/betagouv/api-subventions-asso/compare/v0.38.6...v0.39.0) (2023-11-15)

### Bug Fixes

- **api:** add forgottent failed_cron in accepted notification type ([50e8d7b](https://github.com/betagouv/api-subventions-asso/commit/50e8d7b9da88b141185686507f1bdd60f7ed8905))
- **api:** add numeroDemandePayment as part of chorus line uniqueId in parse methods ([89fef3e](https://github.com/betagouv/api-subventions-asso/commit/89fef3ea58f08bd8f17d644dc0e6c80cfbf3aac4))
- **api:** apiAsso return null if structure has empty properties ([b68ca92](https://github.com/betagouv/api-subventions-asso/commit/b68ca9239044d0c1815926ce3ad72385e9fb9544))
- **api:** check object has empty properties in apiAsso getters ([12415a0](https://github.com/betagouv/api-subventions-asso/commit/12415a05f65dee0a84055a80d73a0d0fdb88f854))
- **api:** chorus line broken snapshot ([2f3dc8f](https://github.com/betagouv/api-subventions-asso/commit/2f3dc8f598969ff2bba201323dee5d02d9ac4a6f))
- **api:** chorus line tests ([6f0b89b](https://github.com/betagouv/api-subventions-asso/commit/6f0b89bcae0bf6614fdff578be48401f26b061f8))
- **api:** chorus parser entity validator ([496b28a](https://github.com/betagouv/api-subventions-asso/commit/496b28a598611fdd44b50b9c835af57533d7a344))
- **api:** comment indexes that conflict with current db state ([9a0e947](https://github.com/betagouv/api-subventions-asso/commit/9a0e947bfb148d71ab38c00525d919530aa0cbdf))
- **api:** convert \_id to string in logs as to not loose data ([68c9dd8](https://github.com/betagouv/api-subventions-asso/commit/68c9dd854d3dfb05e71bc70a44f189e75fd4ae0b))
- **api:** convert log's userId back to ObjectId in metabase dump ([ae40e15](https://github.com/betagouv/api-subventions-asso/commit/ae40e15cf926d2a83f01286731e66dbfdcead9bd))
- **api:** don't transform user \_id to string ([787d6cf](https://github.com/betagouv/api-subventions-asso/commit/787d6cf26e88871ee0e2cd78cfd58558756d3969))
- **api:** mv fn to service to avoid scalingo timeout ([808a8e0](https://github.com/betagouv/api-subventions-asso/commit/808a8e005563607c9618d1890808f2c6bb9a58a3))
- **api:** remove chorus line duplicates ([aae50b6](https://github.com/betagouv/api-subventions-asso/commit/aae50b6a02fbb84da1e2a1e697172625a00cd9d6))
- **api:** remove duplicate error monitoring ([b82da48](https://github.com/betagouv/api-subventions-asso/commit/b82da48e1197aa7c6c5b13f75f81765188cc74dc))
- **front:** association card nb etab label ([cfcfc15](https://github.com/betagouv/api-subventions-asso/commit/cfcfc15b5fbe8c8727718848cc9df773a20e40e7))
- **front:** comment sanitizing for review ([8618965](https://github.com/betagouv/api-subventions-asso/commit/86189655dce2d74ad4bce202c5ddd9f46ab658ba))
- **front:** date documents ([726bc24](https://github.com/betagouv/api-subventions-asso/commit/726bc24aedc63ffeba9d99d415d9ef540f6677d5))
- **front:** fix blue banner when content is small ([df6521a](https://github.com/betagouv/api-subventions-asso/commit/df6521a51bc752081db335230e0f3e707a0c49d0))
- **front:** fix sanitizing ([9a9d784](https://github.com/betagouv/api-subventions-asso/commit/9a9d784f48c22971c8d1e2f5957f101366a37b3d))
- **front:** mock association adapter ([47aef02](https://github.com/betagouv/api-subventions-asso/commit/47aef02b1d71f0c5d6cd1ee36fce62c90eeb24c2))
- **front:** nb etab in association card ([dab413a](https://github.com/betagouv/api-subventions-asso/commit/dab413ae2459e76b0f69fa34a1823b5b907450e1))
- **front:** nb result found from search ([d2cf219](https://github.com/betagouv/api-subventions-asso/commit/d2cf21972b43e0cd9734026580de8c160c5e3c7a))
- **front:** sentry sourcemaps proper release ([17f26c2](https://github.com/betagouv/api-subventions-asso/commit/17f26c281b426916d6eb32a437f190489feb061c))
- **front:** stick footer to the end of content ([25701e8](https://github.com/betagouv/api-subventions-asso/commit/25701e8a72d6196aeeac8be3b6631d3d899a63c0))
- **front:** use onclick not [@click](https://github.com/click) ([3e64ba1](https://github.com/betagouv/api-subventions-asso/commit/3e64ba11cb4184a8b294bda0078248348b76ed73))

### Features

- **api:** add grants persistance ([6b7f47e](https://github.com/betagouv/api-subventions-asso/commit/6b7f47e05e76fb329d1bb7dca466ff102942a3da))
- **api:** add numeroDemandePaiement to chorusLineEntity uniqueId ([070503e](https://github.com/betagouv/api-subventions-asso/commit/070503e8dd6f10418e2d818a92c56fc7c83f056c))
- **api:** add productor persistance add producerId to parse ([50a2898](https://github.com/betagouv/api-subventions-asso/commit/50a2898accd838f584354802f47bf4641925dec0))
- **api:** add provider request service ([4bc9116](https://github.com/betagouv/api-subventions-asso/commit/4bc91167bb665610a0cb26efb10d6f46fcba4a64))
- **api:** add provider request service ([aa25e79](https://github.com/betagouv/api-subventions-asso/commit/aa25e7925535d7a6279de6db93b7ec250888c4b7))
- **api:** add use cases for download and parse history unite legal file ([2dcc346](https://github.com/betagouv/api-subventions-asso/commit/2dcc346593f6c6364e67d6f6a9b205ac14b3ff00))
- **api:** build uniqueId as hash and refactor tests ([b9361bb](https://github.com/betagouv/api-subventions-asso/commit/b9361bb4aacbe9718e9c4811d1e1d785f77fe426))
- **api:** check that identifier is from asso before sending subv data ([9449450](https://github.com/betagouv/api-subventions-asso/commit/9449450b73774d145d38f1bdf6b50a24e27276c6))
- **api:** collect full users for metabase ([bbfcf18](https://github.com/betagouv/api-subventions-asso/commit/bbfcf18c7df78855e91f1c9f21cf436a05c003cc)), closes [#1857](https://github.com/betagouv/api-subventions-asso/issues/1857)
- **api:** create indexes on association names ([1718aac](https://github.com/betagouv/api-subventions-asso/commit/1718aace0f93c012bc883a06c3930bc0dbe16aa0))
- **api:** create scdl service ([1c77ce4](https://github.com/betagouv/api-subventions-asso/commit/1c77ce4cbfd26bb21c1142e50127f63e28d27f81))
- **api:** cron for upate history unitee legal ([1a3cda8](https://github.com/betagouv/api-subventions-asso/commit/1a3cda8c71f7edb0e73d3f8641109e08c57b569d))
- **api:** define abstract createIndexes in MongoRepository ([a1e4aee](https://github.com/betagouv/api-subventions-asso/commit/a1e4aee34ed594e635e8d8bee75205ba388e6c62))
- **api:** delete MigrationManager and rename MigrationRepository to MongoRepository ([711a5dd](https://github.com/betagouv/api-subventions-asso/commit/711a5ddb9f04a787cc162825c771ffe07aca459e))
- **api:** fix circular deps ([b22099b](https://github.com/betagouv/api-subventions-asso/commit/b22099b28550b556c7c8309955b5771641f0b62e))
- **api:** migration to add user's object ids ([a0101e4](https://github.com/betagouv/api-subventions-asso/commit/a0101e459a17af76439592f00e4e08f458ce671f))
- **api:** new archi for history unite legal ([14a5d66](https://github.com/betagouv/api-subventions-asso/commit/14a5d66c1e6a750bd65aae356be2dfc749bef89c))
- **api:** remove comment ([356ab96](https://github.com/betagouv/api-subventions-asso/commit/356ab96a880887b7763459d6fcd7ba40dc071be8))
- **api:** remove dp migration ([f660819](https://github.com/betagouv/api-subventions-asso/commit/f66081985bc6e367b1597e1bcb6ff1e944c2c2a8))
- **api:** rework after rebase ([a5eefd9](https://github.com/betagouv/api-subventions-asso/commit/a5eefd9f5dd6bab20d53e54f605df8c42a6d3ea4))
- **api:** update producer after persisting grants ([a2c3242](https://github.com/betagouv/api-subventions-asso/commit/a2c3242f6d0b8c3eda6af2421f8eda4a6d7bbc55))
- **front:** add title ([d4322c1](https://github.com/betagouv/api-subventions-asso/commit/d4322c11d25d09dcf876d8b4a24cd1df888e9862))
- **front:** center search bar and add max-width ([e09f3ab](https://github.com/betagouv/api-subventions-asso/commit/e09f3abdc5784f75985ab13a2ec0c4480f948dc5))
- **front:** create AssociationCard and use it in search history ([4b6f6f8](https://github.com/betagouv/api-subventions-asso/commit/4b6f6f81dbd54c7108305f551e6959fb3a5551ff))
- **front:** create search name view ([2ce9e86](https://github.com/betagouv/api-subventions-asso/commit/2ce9e86ff92b11e10f7b526cf7eb46ec0a71a211))
- **front:** enrich document url with api domain and token ([e919b00](https://github.com/betagouv/api-subventions-asso/commit/e919b005261b7f010e42c31564daa8e3bd340b0d))
- **front:** extract search bar in a new component ([e745026](https://github.com/betagouv/api-subventions-asso/commit/e74502602673856e6ebbe265db33c5ab81277651))
- **front:** front sanitization ([a9a68d9](https://github.com/betagouv/api-subventions-asso/commit/a9a68d989ff6dbbe5269c1e078b01b046e6868d8))
- **front:** handle back navigation with new search input ([328c499](https://github.com/betagouv/api-subventions-asso/commit/328c499cc26bd3d1a8e2068b561f7e95842de45b))
- **front:** handle plural in nb etab ([1cd13bb](https://github.com/betagouv/api-subventions-asso/commit/1cd13bba546337cce10d606ae2f1e667641258c3))
- **front:** make card title a slot ([f2754c6](https://github.com/betagouv/api-subventions-asso/commit/f2754c639112cd2a15313b0cd4fa638c992e2ca5))
- **front:** mv toSearchHistory in a new adapter file ([8ef46d9](https://github.com/betagouv/api-subventions-asso/commit/8ef46d956428476193e81be9d92c90b84241a4d0))
- **front:** remove ResultCard and put sanitizing in SearchController ([5f736b4](https://github.com/betagouv/api-subventions-asso/commit/5f736b44f58cd771a62d6bc4531d77f1760997e6))
- **front:** remove searchbar search result ([5cb2c23](https://github.com/betagouv/api-subventions-asso/commit/5cb2c236e587be3449befd5645933140e3a0abee))
- **front:** track search history use ([17e3858](https://github.com/betagouv/api-subventions-asso/commit/17e3858c0dba87d1c915829f78a57652c86f44d6))
- **front:** update layout spacing ([6be958e](https://github.com/betagouv/api-subventions-asso/commit/6be958eac08a5636f8f97296a6c99be91ddc47bb))
- **front:** use svelte:fragment for slot ([97c62a6](https://github.com/betagouv/api-subventions-asso/commit/97c62a68d52b5c97a8b7bee99a17488dd5117a8f))

## [0.39.2](https://github.com/betagouv/api-subventions-asso/compare/v0.39.1...v0.39.2) (2023-11-15)

### Bug Fixes

- **api:** updateLogUserId migration default import in commonjs ([4e3fbb8](https://github.com/betagouv/api-subventions-asso/commit/4e3fbb8f1b945d0c06bbdddb1a4336f36e1462c1))

## [0.39.1](https://github.com/betagouv/api-subventions-asso/compare/v0.39.0...v0.39.1) (2023-11-15)

### Bug Fixes

- **api:** updateLogUserId migration import path ([b8626e9](https://github.com/betagouv/api-subventions-asso/commit/b8626e964c4bc16ab8a08077252c77ce1a8630d6))

# [0.39.0](https://github.com/betagouv/api-subventions-asso/compare/v0.38.6...v0.39.0) (2023-11-15)

### Bug Fixes

- **api:** add forgottent failed_cron in accepted notification type ([50e8d7b](https://github.com/betagouv/api-subventions-asso/commit/50e8d7b9da88b141185686507f1bdd60f7ed8905))
- **api:** add numeroDemandePayment as part of chorus line uniqueId in parse methods ([89fef3e](https://github.com/betagouv/api-subventions-asso/commit/89fef3ea58f08bd8f17d644dc0e6c80cfbf3aac4))
- **api:** apiAsso return null if structure has empty properties ([b68ca92](https://github.com/betagouv/api-subventions-asso/commit/b68ca9239044d0c1815926ce3ad72385e9fb9544))
- **api:** check object has empty properties in apiAsso getters ([12415a0](https://github.com/betagouv/api-subventions-asso/commit/12415a05f65dee0a84055a80d73a0d0fdb88f854))
- **api:** chorus line broken snapshot ([2f3dc8f](https://github.com/betagouv/api-subventions-asso/commit/2f3dc8f598969ff2bba201323dee5d02d9ac4a6f))
- **api:** chorus line tests ([6f0b89b](https://github.com/betagouv/api-subventions-asso/commit/6f0b89bcae0bf6614fdff578be48401f26b061f8))
- **api:** chorus parser entity validator ([496b28a](https://github.com/betagouv/api-subventions-asso/commit/496b28a598611fdd44b50b9c835af57533d7a344))
- **api:** comment indexes that conflict with current db state ([9a0e947](https://github.com/betagouv/api-subventions-asso/commit/9a0e947bfb148d71ab38c00525d919530aa0cbdf))
- **api:** convert \_id to string in logs as to not loose data ([68c9dd8](https://github.com/betagouv/api-subventions-asso/commit/68c9dd854d3dfb05e71bc70a44f189e75fd4ae0b))
- **api:** convert log's userId back to ObjectId in metabase dump ([ae40e15](https://github.com/betagouv/api-subventions-asso/commit/ae40e15cf926d2a83f01286731e66dbfdcead9bd))
- **api:** don't transform user \_id to string ([787d6cf](https://github.com/betagouv/api-subventions-asso/commit/787d6cf26e88871ee0e2cd78cfd58558756d3969))
- **api:** mv fn to service to avoid scalingo timeout ([808a8e0](https://github.com/betagouv/api-subventions-asso/commit/808a8e005563607c9618d1890808f2c6bb9a58a3))
- **api:** remove chorus line duplicates ([aae50b6](https://github.com/betagouv/api-subventions-asso/commit/aae50b6a02fbb84da1e2a1e697172625a00cd9d6))
- **api:** remove duplicate error monitoring ([b82da48](https://github.com/betagouv/api-subventions-asso/commit/b82da48e1197aa7c6c5b13f75f81765188cc74dc))
- **front:** association card nb etab label ([cfcfc15](https://github.com/betagouv/api-subventions-asso/commit/cfcfc15b5fbe8c8727718848cc9df773a20e40e7))
- **front:** comment sanitizing for review ([8618965](https://github.com/betagouv/api-subventions-asso/commit/86189655dce2d74ad4bce202c5ddd9f46ab658ba))
- **front:** date documents ([726bc24](https://github.com/betagouv/api-subventions-asso/commit/726bc24aedc63ffeba9d99d415d9ef540f6677d5))
- **front:** fix blue banner when content is small ([df6521a](https://github.com/betagouv/api-subventions-asso/commit/df6521a51bc752081db335230e0f3e707a0c49d0))
- **front:** fix sanitizing ([9a9d784](https://github.com/betagouv/api-subventions-asso/commit/9a9d784f48c22971c8d1e2f5957f101366a37b3d))
- **front:** mock association adapter ([47aef02](https://github.com/betagouv/api-subventions-asso/commit/47aef02b1d71f0c5d6cd1ee36fce62c90eeb24c2))
- **front:** nb etab in association card ([dab413a](https://github.com/betagouv/api-subventions-asso/commit/dab413ae2459e76b0f69fa34a1823b5b907450e1))
- **front:** nb result found from search ([d2cf219](https://github.com/betagouv/api-subventions-asso/commit/d2cf21972b43e0cd9734026580de8c160c5e3c7a))
- **front:** sentry sourcemaps proper release ([17f26c2](https://github.com/betagouv/api-subventions-asso/commit/17f26c281b426916d6eb32a437f190489feb061c))
- **front:** stick footer to the end of content ([25701e8](https://github.com/betagouv/api-subventions-asso/commit/25701e8a72d6196aeeac8be3b6631d3d899a63c0))
- **front:** use onclick not [@click](https://github.com/click) ([3e64ba1](https://github.com/betagouv/api-subventions-asso/commit/3e64ba11cb4184a8b294bda0078248348b76ed73))

### Features

- **api:** add grants persistance ([6b7f47e](https://github.com/betagouv/api-subventions-asso/commit/6b7f47e05e76fb329d1bb7dca466ff102942a3da))
- **api:** add numeroDemandePaiement to chorusLineEntity uniqueId ([070503e](https://github.com/betagouv/api-subventions-asso/commit/070503e8dd6f10418e2d818a92c56fc7c83f056c))
- **api:** add productor persistance add producerId to parse ([50a2898](https://github.com/betagouv/api-subventions-asso/commit/50a2898accd838f584354802f47bf4641925dec0))
- **api:** add provider request service ([4bc9116](https://github.com/betagouv/api-subventions-asso/commit/4bc91167bb665610a0cb26efb10d6f46fcba4a64))
- **api:** add provider request service ([aa25e79](https://github.com/betagouv/api-subventions-asso/commit/aa25e7925535d7a6279de6db93b7ec250888c4b7))
- **api:** add use cases for download and parse history unite legal file ([2dcc346](https://github.com/betagouv/api-subventions-asso/commit/2dcc346593f6c6364e67d6f6a9b205ac14b3ff00))
- **api:** build uniqueId as hash and refactor tests ([b9361bb](https://github.com/betagouv/api-subventions-asso/commit/b9361bb4aacbe9718e9c4811d1e1d785f77fe426))
- **api:** check that identifier is from asso before sending subv data ([9449450](https://github.com/betagouv/api-subventions-asso/commit/9449450b73774d145d38f1bdf6b50a24e27276c6))
- **api:** collect full users for metabase ([bbfcf18](https://github.com/betagouv/api-subventions-asso/commit/bbfcf18c7df78855e91f1c9f21cf436a05c003cc)), closes [#1857](https://github.com/betagouv/api-subventions-asso/issues/1857)
- **api:** create indexes on association names ([1718aac](https://github.com/betagouv/api-subventions-asso/commit/1718aace0f93c012bc883a06c3930bc0dbe16aa0))
- **api:** create scdl service ([1c77ce4](https://github.com/betagouv/api-subventions-asso/commit/1c77ce4cbfd26bb21c1142e50127f63e28d27f81))
- **api:** cron for upate history unitee legal ([1a3cda8](https://github.com/betagouv/api-subventions-asso/commit/1a3cda8c71f7edb0e73d3f8641109e08c57b569d))
- **api:** define abstract createIndexes in MongoRepository ([a1e4aee](https://github.com/betagouv/api-subventions-asso/commit/a1e4aee34ed594e635e8d8bee75205ba388e6c62))
- **api:** delete MigrationManager and rename MigrationRepository to MongoRepository ([711a5dd](https://github.com/betagouv/api-subventions-asso/commit/711a5ddb9f04a787cc162825c771ffe07aca459e))
- **api:** fix circular deps ([b22099b](https://github.com/betagouv/api-subventions-asso/commit/b22099b28550b556c7c8309955b5771641f0b62e))
- **api:** migration to add user's object ids ([a0101e4](https://github.com/betagouv/api-subventions-asso/commit/a0101e459a17af76439592f00e4e08f458ce671f))
- **api:** new archi for history unite legal ([14a5d66](https://github.com/betagouv/api-subventions-asso/commit/14a5d66c1e6a750bd65aae356be2dfc749bef89c))
- **api:** remove comment ([356ab96](https://github.com/betagouv/api-subventions-asso/commit/356ab96a880887b7763459d6fcd7ba40dc071be8))
- **api:** remove dp migration ([f660819](https://github.com/betagouv/api-subventions-asso/commit/f66081985bc6e367b1597e1bcb6ff1e944c2c2a8))
- **api:** rework after rebase ([a5eefd9](https://github.com/betagouv/api-subventions-asso/commit/a5eefd9f5dd6bab20d53e54f605df8c42a6d3ea4))
- **api:** update producer after persisting grants ([a2c3242](https://github.com/betagouv/api-subventions-asso/commit/a2c3242f6d0b8c3eda6af2421f8eda4a6d7bbc55))
- **front:** add title ([d4322c1](https://github.com/betagouv/api-subventions-asso/commit/d4322c11d25d09dcf876d8b4a24cd1df888e9862))
- **front:** center search bar and add max-width ([e09f3ab](https://github.com/betagouv/api-subventions-asso/commit/e09f3abdc5784f75985ab13a2ec0c4480f948dc5))
- **front:** create AssociationCard and use it in search history ([4b6f6f8](https://github.com/betagouv/api-subventions-asso/commit/4b6f6f81dbd54c7108305f551e6959fb3a5551ff))
- **front:** create search name view ([2ce9e86](https://github.com/betagouv/api-subventions-asso/commit/2ce9e86ff92b11e10f7b526cf7eb46ec0a71a211))
- **front:** enrich document url with api domain and token ([e919b00](https://github.com/betagouv/api-subventions-asso/commit/e919b005261b7f010e42c31564daa8e3bd340b0d))
- **front:** extract search bar in a new component ([e745026](https://github.com/betagouv/api-subventions-asso/commit/e74502602673856e6ebbe265db33c5ab81277651))
- **front:** front sanitization ([a9a68d9](https://github.com/betagouv/api-subventions-asso/commit/a9a68d989ff6dbbe5269c1e078b01b046e6868d8))
- **front:** handle back navigation with new search input ([328c499](https://github.com/betagouv/api-subventions-asso/commit/328c499cc26bd3d1a8e2068b561f7e95842de45b))
- **front:** handle plural in nb etab ([1cd13bb](https://github.com/betagouv/api-subventions-asso/commit/1cd13bba546337cce10d606ae2f1e667641258c3))
- **front:** make card title a slot ([f2754c6](https://github.com/betagouv/api-subventions-asso/commit/f2754c639112cd2a15313b0cd4fa638c992e2ca5))
- **front:** mv toSearchHistory in a new adapter file ([8ef46d9](https://github.com/betagouv/api-subventions-asso/commit/8ef46d956428476193e81be9d92c90b84241a4d0))
- **front:** remove ResultCard and put sanitizing in SearchController ([5f736b4](https://github.com/betagouv/api-subventions-asso/commit/5f736b44f58cd771a62d6bc4531d77f1760997e6))
- **front:** remove searchbar search result ([5cb2c23](https://github.com/betagouv/api-subventions-asso/commit/5cb2c236e587be3449befd5645933140e3a0abee))
- **front:** track search history use ([17e3858](https://github.com/betagouv/api-subventions-asso/commit/17e3858c0dba87d1c915829f78a57652c86f44d6))
- **front:** update layout spacing ([6be958e](https://github.com/betagouv/api-subventions-asso/commit/6be958eac08a5636f8f97296a6c99be91ddc47bb))
- **front:** use svelte:fragment for slot ([97c62a6](https://github.com/betagouv/api-subventions-asso/commit/97c62a68d52b5c97a8b7bee99a17488dd5117a8f))

## [0.38.8](https://github.com/betagouv/api-subventions-asso/compare/v0.38.7...v0.38.8) (2023-11-16)

### Bug Fixes

- **api:** disable deprecated apiEntreprise call ([bddd644](https://github.com/betagouv/api-subventions-asso/commit/bddd6445e430e4df1b96a17d17c8b4a9158596cb))
- **api:** more weird specs from new api asso types ([795736e](https://github.com/betagouv/api-subventions-asso/commit/795736e35cd57d7b31e047a717c5bcf134d9d357))

## [0.38.7](https://github.com/betagouv/api-subventions-asso/compare/v0.38.6...v0.38.7) (2023-11-15)

### Bug Fixes

- **api:** update adapters and fixture to new api asso formats ([f836ed6](https://github.com/betagouv/api-subventions-asso/commit/f836ed6dd289626ee436aed29eaaf2ac9a2d10dd))

## [0.38.6](https://github.com/betagouv/api-subventions-asso/compare/v0.38.5...v0.38.6) (2023-11-09)

### Bug Fixes

- **front:** combobox shows given value on init ([58e601f](https://github.com/betagouv/api-subventions-asso/commit/58e601fc1a163427e4d9e26f3bdbd44d0f310253))

## [0.38.5](https://github.com/betagouv/api-subventions-asso/compare/v0.38.4...v0.38.5) (2023-10-30)

### Bug Fixes

- **api:** remove chorus line duplicates ([2800519](https://github.com/betagouv/api-subventions-asso/commit/2800519d28bb25e118338fb32a4223d13df5c9a7))

## [0.38.4](https://github.com/betagouv/api-subventions-asso/compare/v0.38.3...v0.38.4) (2023-10-25)

### Bug Fixes

- **api:** dont send empty values and fix first and last name ([6aa079f](https://github.com/betagouv/api-subventions-asso/commit/6aa079fcd182ed58f050f6e3bb4d8f409998c407))
- **api:** send mattermost notification when user email is not accepted ([9546574](https://github.com/betagouv/api-subventions-asso/commit/95465746c96130b6a7111fae4d20c0bf591a85bd))
- **front:** classical modal to prevent and allow leaving unsasved profile ([445f206](https://github.com/betagouv/api-subventions-asso/commit/445f206f1c83fe56bbe21d051857f0ec8f8c64f8))
- **front:** hide resetPassword module from profile ([179ceff](https://github.com/betagouv/api-subventions-asso/commit/179ceffdaf4b93c6e55ebf9df29c655eaa807372))
- **front:** manually dispatch change event ([9724040](https://github.com/betagouv/api-subventions-asso/commit/97240402018028c4e80ccd64f251ed6ea8e1fc67))
- **front:** mark agentType required in profile ([c4d4bae](https://github.com/betagouv/api-subventions-asso/commit/c4d4bae508b3a616bf270ad749fead00d0e16c49))
- **front:** more logical modal buttons ([7984db8](https://github.com/betagouv/api-subventions-asso/commit/7984db810aec2c7827322f0ef5061c65a84c3511))
- **front:** to.url instead of to.route.url ([f70e9ac](https://github.com/betagouv/api-subventions-asso/commit/f70e9ac9a178c3474fbe2bbc253918e9da49d082))

### Features

- **front:** select required prop ([e1b3cfe](https://github.com/betagouv/api-subventions-asso/commit/e1b3cfed7a9ebc1eb380985ff9c9f742ab1e8b04))

## [0.38.3](https://github.com/betagouv/api-subventions-asso/compare/v0.38.2...v0.38.3) (2023-10-20)

### Bug Fixes

- **api:** prevent token inflation ([ffca28c](https://github.com/betagouv/api-subventions-asso/commit/ffca28c2eb2dd554c1669a4e7e7f5a8059859ab1))

## [0.38.2](https://github.com/betagouv/api-subventions-asso/compare/v0.38.1...v0.38.2) (2023-10-20)

### Bug Fixes

- **api:** allows front redirection to sentry ([ac9fa97](https://github.com/betagouv/api-subventions-asso/commit/ac9fa974f19a8b29bea12fb58fe399118d5a33fc))

## [0.38.1](https://github.com/betagouv/api-subventions-asso/compare/v0.38.0...v0.38.1) (2023-10-20)

### Bug Fixes

- **api:** add log to fonjep bop migration ([5d7c3b5](https://github.com/betagouv/api-subventions-asso/commit/5d7c3b5db190bbe1520285b2618e1d060fd6702a))
- **api:** if specified, exercice/annee_demande is used ([2de6c65](https://github.com/betagouv/api-subventions-asso/commit/2de6c6578df098ccb70c13cebda715f766db453e))
- **front:** activate and reset-password ports get user directly ([99b8ec3](https://github.com/betagouv/api-subventions-asso/commit/99b8ec3b8bb91b6a93c23123ab29de7e34db755a))
- **front:** ignore subv without 'annee_demande' ([e0d1c61](https://github.com/betagouv/api-subventions-asso/commit/e0d1c615f84bc7980b41e95470463dd89b9c5dd9))
- **front:** prevent & escape stringified undefined ([2d4e53e](https://github.com/betagouv/api-subventions-asso/commit/2d4e53e4e0028505978576742a4e439876b46ae8))

### Features

- **api:** interpret exercice in 72319 ([d7634ba](https://github.com/betagouv/api-subventions-asso/commit/d7634baf7a0ed292aab51b76d765e97026d8dab1))
- **api:** merci victor ([8cf63ae](https://github.com/betagouv/api-subventions-asso/commit/8cf63ae036ff93f6f86423cb8d3b0d613bc2af38))
- **api:** optimize fonjep bop migration ([2f12f2a](https://github.com/betagouv/api-subventions-asso/commit/2f12f2a1a088a6deeaf9b2bbfba3d1369d5226b4))

# [0.38.0](https://github.com/betagouv/api-subventions-asso/compare/v0.36.8...v0.38.0) (2023-10-16)

### Bug Fixes

- **api:** add fonjep bop in adapter ([59c9d29](https://github.com/betagouv/api-subventions-asso/commit/59c9d29d0113afd88471162be22945df288fd0d1))
- **api:** fix some test ([2e059d3](https://github.com/betagouv/api-subventions-asso/commit/2e059d3f46fb1a20d1eac1c09d90821930d3b2af))
- **api:** fix some test ([0a286cd](https://github.com/betagouv/api-subventions-asso/commit/0a286cda135adff05f095cf44fceeabb86a5ffea))
- **api:** fix when api not found structure by siren end point ([4b6a7d6](https://github.com/betagouv/api-subventions-asso/commit/4b6a7d67025355b1ccb36ef8f3373ee28ae37a6a))
- **api:** modal typing (review) ([90d34fa](https://github.com/betagouv/api-subventions-asso/commit/90d34fab73b42f20b3c0ec117029ce46fcfa87da))
- **front:** no longer clear at logout ([baf7c65](https://github.com/betagouv/api-subventions-asso/commit/baf7c656b8c46dcdd50ff9a100ecef8215829619))

### Features

- **api:** add custom schema to scdl parser and create dilrach mapper ([efd468f](https://github.com/betagouv/api-subventions-asso/commit/efd468faf488d81d2c50c088595cfbfbe2da3a58))
- **api:** add test on payment date ([c265091](https://github.com/betagouv/api-subventions-asso/commit/c2650919d6135d70992722dc67e32d99fca7aeda))
- **api:** both sentry cron and sentry events ([e127edb](https://github.com/betagouv/api-subventions-asso/commit/e127edb87170f7adcd4b0f574b741791571eafea))
- **api:** create and use ParserScheme type ([569c001](https://github.com/betagouv/api-subventions-asso/commit/569c0019ebe7d4af88c9943cd56e54f5d75975bf))
- **api:** create MiscScdlDataEntity and miscScdlDataRepository ([e02d391](https://github.com/betagouv/api-subventions-asso/commit/e02d391ad4388d0024052b59500793c2f59ec2d7))
- **api:** create miscScdlEditorsReposiotry and MiscScdlEditorEntity ([2b8787c](https://github.com/betagouv/api-subventions-asso/commit/2b8787cc9c67946ffb8b038e07a8285cf60c4fb1))
- **api:** ds form 72319 ([93d1864](https://github.com/betagouv/api-subventions-asso/commit/93d18645c4ba18e238f0b4966c323d1d908bfad2))
- **api:** ds form 73407 ([1786e53](https://github.com/betagouv/api-subventions-asso/commit/1786e53cd8b52a3d3172df746227c325067cae14))
- **api:** ds form 75747 ([78d43dd](https://github.com/betagouv/api-subventions-asso/commit/78d43ddf186ed6d05f35675fbffcd02f795bdb18))
- **api:** ds mappers accept static values ([ef1c297](https://github.com/betagouv/api-subventions-asso/commit/ef1c2972e5a83be7005a088058810690e3f811cd))
- **api:** fix payment start and end date ([99de307](https://github.com/betagouv/api-subventions-asso/commit/99de307ac4f7dfadcf5499c095f53b5e8c263947))
- **api:** include demarche's service in ds data ([e1675d3](https://github.com/betagouv/api-subventions-asso/commit/e1675d3c458f40210203fc3c832fa00837719c1a))
- **api:** init scdl provider ([955014c](https://github.com/betagouv/api-subventions-asso/commit/955014c582c3bad810b3e59a12ddd680f07091f9))
- **api:** more review with Alex services, contact and 75747 ([78e39f7](https://github.com/betagouv/api-subventions-asso/commit/78e39f79d1acc93f2d498aaaae5b7ca9c68b27f5))
- **api:** move and rename scdl unit test ([0f11fc5](https://github.com/betagouv/api-subventions-asso/commit/0f11fc59735c36e61c9bbad25e982a9063675355))
- **api:** rename data.gouv ids fields ([1a3539e](https://github.com/betagouv/api-subventions-asso/commit/1a3539ea7001d5d54d0f2b7d79c6278a02758298))
- **api:** rename editor to producer ([212148e](https://github.com/betagouv/api-subventions-asso/commit/212148eeab227694be7a3c9c58442d1312a500fb))
- **api:** review add channel enum mattermost ([0fcf824](https://github.com/betagouv/api-subventions-asso/commit/0fcf82489baeaa1c25cebfd59cc7c683ff2c7a07))
- **api:** review by Alex on 72319 & 73407 ([8e575b3](https://github.com/betagouv/api-subventions-asso/commit/8e575b3ea4bd9bf17273d170aa6f05574b18bf00))
- **api:** use shared scdl mapper ([8162d80](https://github.com/betagouv/api-subventions-asso/commit/8162d80e99158fb5b46353c93227cbe02377eeb9))
- **front:** allow to disable tracking multiStepForm submit ([ecd35cf](https://github.com/betagouv/api-subventions-asso/commit/ecd35cfb9aeb70f61053d95bcd69705f61ebe19c))
- **front:** more precise tracking according to submit success ([3138754](https://github.com/betagouv/api-subventions-asso/commit/313875441ba09a3a8205246028e7d2119dec1734))
- **front:** only clear history if different user logs in ([f814c96](https://github.com/betagouv/api-subventions-asso/commit/f814c96aa572c5410a8a34e0e153e51b56bb8b98))
- **front:** wording activation link ([1643f72](https://github.com/betagouv/api-subventions-asso/commit/1643f728a235c578286e797a3118678724375b10))

### Reverts

- Revert "feat(api): sentry checkIn instead of captureEvent" ([e2d9b09](https://github.com/betagouv/api-subventions-asso/commit/e2d9b09aa4f52051051a139360c39c546a09903c))

# [0.37.0](https://github.com/betagouv/api-subventions-asso/compare/v0.36.6...v0.37.0) (2023-10-02)

### Bug Fixes

- **api:** controller accepts partial update ([e8bdeec](https://github.com/betagouv/api-subventions-asso/commit/e8bdeec30b871f8aab1f95ac5ca7a302b7738271))
- **api:** recursive log censoring ([1e20dfd](https://github.com/betagouv/api-subventions-asso/commit/1e20dfde3f8aa0820b56d1a2bcb8d6b54e272acd))
- **api:** remove secrets inside repo update method and fix test ([cb80db0](https://github.com/betagouv/api-subventions-asso/commit/cb80db075cd57f7b1ad59351b8ae3cef3c8ca68a))
- **api:** sometimes user is defined but not a user ([5ecef7a](https://github.com/betagouv/api-subventions-asso/commit/5ecef7a58a048abd69ea03e27602945b0c089b4e))
- **api:** test profile/activate validation ([2789e98](https://github.com/betagouv/api-subventions-asso/commit/2789e98f3cdce2e048732d0216d2f41212cc7429))
- **api:** userRepo update and removeSecrets typing ([764ab49](https://github.com/betagouv/api-subventions-asso/commit/764ab49616377792185d9338c2a827ecbe5c2568))
- **api:** validate full user ont only update data ([4e05d7c](https://github.com/betagouv/api-subventions-asso/commit/4e05d7c40c222287c201d4df4ee3f7534a73e647))
- **ci:** transmit sentry auth from secrets in jobs ([1384ccc](https://github.com/betagouv/api-subventions-asso/commit/1384ccca996a63c96412d1e2a2433163e4094ed5))
- **front:** .env should not contain env=dev ([2def61e](https://github.com/betagouv/api-subventions-asso/commit/2def61e8b3304d9694ee88ea0d819038884bffe3))
- **front:** autocomplete label ([f610a09](https://github.com/betagouv/api-subventions-asso/commit/f610a0944fb1ed748ad7af85e62b65eccd479e5e))
- **front:** case first/last name ([fa367ef](https://github.com/betagouv/api-subventions-asso/commit/fa367ef41dde1047405ef18cb8e3d310c9e8751b))
- **front:** combobox style matches select style ([fe137b5](https://github.com/betagouv/api-subventions-asso/commit/fe137b53de1b70d5e0ac7f26aec9d6593145e72e))
- **front:** get all env vars in vite ([86e5345](https://github.com/betagouv/api-subventions-asso/commit/86e5345a9b5040d0b35d3c44d27ebc25859ab505))
- **front:** keep structure in initial load ([7cf38cb](https://github.com/betagouv/api-subventions-asso/commit/7cf38cb9b9681d9c7d31fc448fcdd18173d70707))
- **front:** layout title-alert order ([4896d36](https://github.com/betagouv/api-subventions-asso/commit/4896d3669c29ef46bc17750d9cd1f521a8cdddf4))
- **front:** misplaced component ([b6891c1](https://github.com/betagouv/api-subventions-asso/commit/b6891c1670d1d20672dfe132175941f04d63c749))
- **front:** regression ([be48578](https://github.com/betagouv/api-subventions-asso/commit/be4857817a180d74f6fdbcce05742a347261f067))
- **front:** setup options during init ([4de6040](https://github.com/betagouv/api-subventions-asso/commit/4de6040923abf1a20b08b183e73b8cc62b319874))
- **front:** substep consistent spacing ([5f09831](https://github.com/betagouv/api-subventions-asso/commit/5f09831f735ffd3ea2f478f63b2b1278ad72c9a5))
- **front:** types and mock ([af52f79](https://github.com/betagouv/api-subventions-asso/commit/af52f79dcb93e1b2a0d685bce67e2f5feb247016))
- **front:** weird auto import ([ac08372](https://github.com/betagouv/api-subventions-asso/commit/ac083728b3259d2018d227e005ca6234099ed59c))

### Features

- **api:** activate and reset give jwt \* ([d15bab2](https://github.com/betagouv/api-subventions-asso/commit/d15bab2e27e913bac5ac9fadc81968158b2ece1b))
- **api:** add fonjep bop mapper ([52aca33](https://github.com/betagouv/api-subventions-asso/commit/52aca3355076a2c1e2e23f104a61b1a485f003ad))
- **api:** add migration to add bop on old fonjepVersement ([4cc4a2b](https://github.com/betagouv/api-subventions-asso/commit/4cc4a2b708dd4a355d9ed40f05bccf2b65e7fd16))
- **api:** bad domain sends mattermost message ([7e42419](https://github.com/betagouv/api-subventions-asso/commit/7e42419e61fa76b4c5208af99cf3c097fac9af2c))
- **api:** cast bop in Number ([8613d1c](https://github.com/betagouv/api-subventions-asso/commit/8613d1c14746d1b7a2ce68abf1769778cda8ba66))
- **api:** clean migration ([9875231](https://github.com/betagouv/api-subventions-asso/commit/9875231e9c39615163e86c61f8ea39d8f16b7309))
- **api:** clearer wording ([1896ea2](https://github.com/betagouv/api-subventions-asso/commit/1896ea2c6a29a3a6370fdefa78f5f434713d1c9b))
- **api:** helper removes hash password only ([aaa14e6](https://github.com/betagouv/api-subventions-asso/commit/aaa14e68cf2bd5282b3e70db1f7a62f51f112c32))
- **api:** move bop in versement instead of subvention ([e9a9dfb](https://github.com/betagouv/api-subventions-asso/commit/e9a9dfb49f2eb60f20e5a9e3e9515b888c24bdb5))
- **api:** move bop mapping in FonjepSubventionEntity and add bop to it ([25b076b](https://github.com/betagouv/api-subventions-asso/commit/25b076b3fbb10907576ba9be6420513f2a4d839b))
- **api:** new Notification type bad domain ([d5a4cfb](https://github.com/betagouv/api-subventions-asso/commit/d5a4cfb32c143041b3f27e695656209390601534))
- **api:** profile update service & controller ([23e2e55](https://github.com/betagouv/api-subventions-asso/commit/23e2e5581a29b29c03483d1b8c192caddc31238e))
- **api:** profile validation does not add field ([d428a7c](https://github.com/betagouv/api-subventions-asso/commit/d428a7c28128e0f9c5eb0fc4c66f62db6e9afab2))
- **api:** profile validation optionally tests password ([29d8c88](https://github.com/betagouv/api-subventions-asso/commit/29d8c886cdd4ea9bda7d78016c48a8db29bf05a6))
- **api:** rename reusable validation and sanitization ([1f97f2d](https://github.com/betagouv/api-subventions-asso/commit/1f97f2df16eea8a2b77c62317a67aeb28f6826da))
- **api:** repo user update gives jwt or not ([2ba6e54](https://github.com/betagouv/api-subventions-asso/commit/2ba6e549ab3d00414f9306d2b870d6760ccbcc60))
- **api:** userService calls notify service if wrong mail domain ([00f05ff](https://github.com/betagouv/api-subventions-asso/commit/00f05ffcabd1a5eae98dd9407f36ff11b32b5f27))
- **dto:** interface to update user ([b234417](https://github.com/betagouv/api-subventions-asso/commit/b2344177b3c61d3b015971bb91f23a73ab404903))
- **front:** agent type field in profile ([fc8c66d](https://github.com/betagouv/api-subventions-asso/commit/fc8c66daa1f4a8f298685f18e353da726de2a89c))
- **front:** basic sentry setup ([f1b7d9f](https://github.com/betagouv/api-subventions-asso/commit/f1b7d9f81fd726f2ee092d0062d8b16db22c5144))
- **front:** block profile save about validation ([45e641a](https://github.com/betagouv/api-subventions-asso/commit/45e641a9ea8826785fbe0989949858047ceb2fa6))
- **front:** configure headers and token for sentry ([2906a44](https://github.com/betagouv/api-subventions-asso/commit/2906a442406fb73691b6cb92e17e02825eb4bbe3))
- **front:** disable save button if no modification ([13d4375](https://github.com/betagouv/api-subventions-asso/commit/13d437593a78315d43fe845de2d46d715104913c))
- **front:** get self user port & service ([d26853e](https://github.com/betagouv/api-subventions-asso/commit/d26853e87531faacb7d5ab1242dad7baddc45329))
- **front:** get user data ([0091377](https://github.com/betagouv/api-subventions-asso/commit/0091377163d3443a7bff787e0096a1ca06032053))
- **front:** input disabled state ([871947c](https://github.com/betagouv/api-subventions-asso/commit/871947cb0c18ea22e1a3be960285d3c7423cf17c))
- **front:** integrate password in layout ([8019db9](https://github.com/betagouv/api-subventions-asso/commit/8019db91786a23d4d0513d18883120799214fa2b))
- **front:** layout and logic for names and email ([d9ad9bb](https://github.com/betagouv/api-subventions-asso/commit/d9ad9bbe856cb6b2928a7fc543d2042b7b6945cf))
- **front:** prevent leaving page ([9a7cdfb](https://github.com/betagouv/api-subventions-asso/commit/9a7cdfbd91bb9e83b96cf848909fbf47f268ff5e))
- **front:** profile call user service ([ad2fba4](https://github.com/betagouv/api-subventions-asso/commit/ad2fba4125ded7c1ad1f90f36d0212e259a40f00))
- **front:** profile insert step 3 part ([7e82367](https://github.com/betagouv/api-subventions-asso/commit/7e8236745d0869d02fe4b7e95fd75b9843261db5))
- **front:** profile ResetPwdModule ([5c4c838](https://github.com/betagouv/api-subventions-asso/commit/5c4c8380d7ba26f91b24af9f10ccdeca1b6bc0af))
- **front:** profile separator ([f6f3a38](https://github.com/betagouv/api-subventions-asso/commit/f6f3a38c6ddac30553123890ff03677ffeeecf9b))
- **front:** refactor show alert ([0a8275e](https://github.com/betagouv/api-subventions-asso/commit/0a8275e6a06c3f57ecdae29a9763993536203375))
- **front:** requestsService patch ([1771dfe](https://github.com/betagouv/api-subventions-asso/commit/1771dfed8f6b42797d24f4a79358fb40bd980b28))
- **front:** reset pwd & activate logs user in ([e0a65a8](https://github.com/betagouv/api-subventions-asso/commit/e0a65a8d4be2d5e097b74633748a886c19953aa8))
- **front:** reset pwd & activate redirects to Home with success alert ([49b7b9a](https://github.com/betagouv/api-subventions-asso/commit/49b7b9a09c3c3128e648519b99717fa4d64c70aa))
- **front:** review ([9307980](https://github.com/betagouv/api-subventions-asso/commit/9307980522313d12e730f12ffccd5e701d986091))
- **front:** scroll to alert on save ([5bdb471](https://github.com/betagouv/api-subventions-asso/commit/5bdb471af78d1ff49e1d124e9d7e57029111f6ff))
- **front:** sentry track disabled in dev ([c21f1d6](https://github.com/betagouv/api-subventions-asso/commit/c21f1d66a665252a8d007557af92e4c377b83d6c))
- **front:** sentry track release and env ([7149839](https://github.com/betagouv/api-subventions-asso/commit/7149839e30b706b244d38daf22cc5caacc29e63c))
- **front:** transmit onChange event ([88ecd94](https://github.com/betagouv/api-subventions-asso/commit/88ecd94d7530fb58e67f2f97017f4fd875291f42))
- **front:** update profile port and service ([dda5172](https://github.com/betagouv/api-subventions-asso/commit/dda51729ffbd977b3aec1830771cc1d2306d21f8))

# [0.37.0](https://github.com/betagouv/api-subventions-asso/compare/v0.36.3...v0.37.0) (2023-10-02)

### Bug Fixes

- **api:** activate validation allows empty values ([00fefc1](https://github.com/betagouv/api-subventions-asso/commit/00fefc17f4058dfee4ec547fa2431bea4d3c4645))
- **api:** brevo structure mapping ([033921e](https://github.com/betagouv/api-subventions-asso/commit/033921ebd1c53c1f2b322a14512df026cc737101))
- **api:** controller accepts partial update ([e8bdeec](https://github.com/betagouv/api-subventions-asso/commit/e8bdeec30b871f8aab1f95ac5ca7a302b7738271))
- **api:** recursive log censoring ([1e20dfd](https://github.com/betagouv/api-subventions-asso/commit/1e20dfde3f8aa0820b56d1a2bcb8d6b54e272acd))
- **api:** remove secrets inside repo update method and fix test ([cb80db0](https://github.com/betagouv/api-subventions-asso/commit/cb80db075cd57f7b1ad59351b8ae3cef3c8ca68a))
- **api:** sometimes user is defined but not a user ([5ecef7a](https://github.com/betagouv/api-subventions-asso/commit/5ecef7a58a048abd69ea03e27602945b0c089b4e))
- **api:** test profile/activate validation ([2789e98](https://github.com/betagouv/api-subventions-asso/commit/2789e98f3cdce2e048732d0216d2f41212cc7429))
- **api:** userRepo update and removeSecrets typing ([764ab49](https://github.com/betagouv/api-subventions-asso/commit/764ab49616377792185d9338c2a827ecbe5c2568))
- **api:** validate full user ont only update data ([4e05d7c](https://github.com/betagouv/api-subventions-asso/commit/4e05d7c40c222287c201d4df4ee3f7534a73e647))
- **ci:** transmit sentry auth from secrets in jobs ([1384ccc](https://github.com/betagouv/api-subventions-asso/commit/1384ccca996a63c96412d1e2a2433163e4094ed5))
- **front:** .env should not contain env=dev ([2def61e](https://github.com/betagouv/api-subventions-asso/commit/2def61e8b3304d9694ee88ea0d819038884bffe3))
- **front:** autocomplete label ([f610a09](https://github.com/betagouv/api-subventions-asso/commit/f610a0944fb1ed748ad7af85e62b65eccd479e5e))
- **front:** case first/last name ([fa367ef](https://github.com/betagouv/api-subventions-asso/commit/fa367ef41dde1047405ef18cb8e3d310c9e8751b))
- **front:** combobox style matches select style ([fe137b5](https://github.com/betagouv/api-subventions-asso/commit/fe137b53de1b70d5e0ac7f26aec9d6593145e72e))
- **front:** get all env vars in vite ([86e5345](https://github.com/betagouv/api-subventions-asso/commit/86e5345a9b5040d0b35d3c44d27ebc25859ab505))
- **front:** keep structure in initial load ([7cf38cb](https://github.com/betagouv/api-subventions-asso/commit/7cf38cb9b9681d9c7d31fc448fcdd18173d70707))
- **front:** layout title-alert order ([4896d36](https://github.com/betagouv/api-subventions-asso/commit/4896d3669c29ef46bc17750d9cd1f521a8cdddf4))
- **front:** misplaced component ([b6891c1](https://github.com/betagouv/api-subventions-asso/commit/b6891c1670d1d20672dfe132175941f04d63c749))
- **front:** regression ([be48578](https://github.com/betagouv/api-subventions-asso/commit/be4857817a180d74f6fdbcce05742a347261f067))
- **front:** setup options during init ([4de6040](https://github.com/betagouv/api-subventions-asso/commit/4de6040923abf1a20b08b183e73b8cc62b319874))
- **front:** substep consistent spacing ([5f09831](https://github.com/betagouv/api-subventions-asso/commit/5f09831f735ffd3ea2f478f63b2b1278ad72c9a5))
- **front:** types and mock ([af52f79](https://github.com/betagouv/api-subventions-asso/commit/af52f79dcb93e1b2a0d685bce67e2f5feb247016))
- **front:** weird auto import ([ac08372](https://github.com/betagouv/api-subventions-asso/commit/ac083728b3259d2018d227e005ca6234099ed59c))
- **front:** wording ([632362b](https://github.com/betagouv/api-subventions-asso/commit/632362b84fd24c95c96ec0d9e2e0b4c09b3dcf07))

### Features

- **api,dto,front:** new job type ([1969dcf](https://github.com/betagouv/api-subventions-asso/commit/1969dcf7a9a7f82e235bea923f53aa5ee6e3d5fb))
- **api:** profile update service & controller ([23e2e55](https://github.com/betagouv/api-subventions-asso/commit/23e2e5581a29b29c03483d1b8c192caddc31238e))
- **api:** profile validation does not add field ([d428a7c](https://github.com/betagouv/api-subventions-asso/commit/d428a7c28128e0f9c5eb0fc4c66f62db6e9afab2))
- **api:** profile validation optionally tests password ([29d8c88](https://github.com/betagouv/api-subventions-asso/commit/29d8c886cdd4ea9bda7d78016c48a8db29bf05a6))
- **api:** rename reusable validation and sanitization ([1f97f2d](https://github.com/betagouv/api-subventions-asso/commit/1f97f2df16eea8a2b77c62317a67aeb28f6826da))
- **api:** route get own's user ([71a5e22](https://github.com/betagouv/api-subventions-asso/commit/71a5e22d59b35dec89e685c32a6297498ba4b3ee))
- **api:** service get user no secret ([a2c1c3e](https://github.com/betagouv/api-subventions-asso/commit/a2c1c3ed219fa12ec40891f828c7873bb765f10e))
- **dto:** interface to update user ([b234417](https://github.com/betagouv/api-subventions-asso/commit/b2344177b3c61d3b015971bb91f23a73ab404903))
- **front:** agent type field in profile ([fc8c66d](https://github.com/betagouv/api-subventions-asso/commit/fc8c66daa1f4a8f298685f18e353da726de2a89c))
- **front:** basic sentry setup ([f1b7d9f](https://github.com/betagouv/api-subventions-asso/commit/f1b7d9f81fd726f2ee092d0062d8b16db22c5144))
- **front:** block profile save about validation ([45e641a](https://github.com/betagouv/api-subventions-asso/commit/45e641a9ea8826785fbe0989949858047ceb2fa6))
- **front:** cgu in new tab ([c1198c9](https://github.com/betagouv/api-subventions-asso/commit/c1198c9e1cad5ae43be3b53aa51b41f4fa426065))
- **front:** configure headers and token for sentry ([2906a44](https://github.com/betagouv/api-subventions-asso/commit/2906a442406fb73691b6cb92e17e02825eb4bbe3))
- **front:** disable save button if no modification ([13d4375](https://github.com/betagouv/api-subventions-asso/commit/13d437593a78315d43fe845de2d46d715104913c))
- **front:** get self user port & service ([d26853e](https://github.com/betagouv/api-subventions-asso/commit/d26853e87531faacb7d5ab1242dad7baddc45329))
- **front:** get user data ([0091377](https://github.com/betagouv/api-subventions-asso/commit/0091377163d3443a7bff787e0096a1ca06032053))
- **front:** input disabled state ([871947c](https://github.com/betagouv/api-subventions-asso/commit/871947cb0c18ea22e1a3be960285d3c7423cf17c))
- **front:** integrate password in layout ([8019db9](https://github.com/betagouv/api-subventions-asso/commit/8019db91786a23d4d0513d18883120799214fa2b))
- **front:** layout and logic for names and email ([d9ad9bb](https://github.com/betagouv/api-subventions-asso/commit/d9ad9bbe856cb6b2928a7fc543d2042b7b6945cf))
- **front:** prevent leaving page ([9a7cdfb](https://github.com/betagouv/api-subventions-asso/commit/9a7cdfbd91bb9e83b96cf848909fbf47f268ff5e))
- **front:** profile call user service ([ad2fba4](https://github.com/betagouv/api-subventions-asso/commit/ad2fba4125ded7c1ad1f90f36d0212e259a40f00))
- **front:** profile insert step 3 part ([7e82367](https://github.com/betagouv/api-subventions-asso/commit/7e8236745d0869d02fe4b7e95fd75b9843261db5))
- **front:** profile ResetPwdModule ([5c4c838](https://github.com/betagouv/api-subventions-asso/commit/5c4c8380d7ba26f91b24af9f10ccdeca1b6bc0af))
- **front:** profile separator ([f6f3a38](https://github.com/betagouv/api-subventions-asso/commit/f6f3a38c6ddac30553123890ff03677ffeeecf9b))
- **front:** refactor show alert ([0a8275e](https://github.com/betagouv/api-subventions-asso/commit/0a8275e6a06c3f57ecdae29a9763993536203375))
- **front:** requestsService patch ([1771dfe](https://github.com/betagouv/api-subventions-asso/commit/1771dfed8f6b42797d24f4a79358fb40bd980b28))
- **front:** scroll to alert on save ([5bdb471](https://github.com/betagouv/api-subventions-asso/commit/5bdb471af78d1ff49e1d124e9d7e57029111f6ff))
- **front:** sentry track disabled in dev ([c21f1d6](https://github.com/betagouv/api-subventions-asso/commit/c21f1d66a665252a8d007557af92e4c377b83d6c))
- **front:** sentry track release and env ([7149839](https://github.com/betagouv/api-subventions-asso/commit/7149839e30b706b244d38daf22cc5caacc29e63c))
- **front:** sort regions ([713982e](https://github.com/betagouv/api-subventions-asso/commit/713982ef78446b4600ed869de13f982c7f5ec60c))
- **front:** transmit onChange event ([88ecd94](https://github.com/betagouv/api-subventions-asso/commit/88ecd94d7530fb58e67f2f97017f4fd875291f42))
- **front:** update profile port and service ([dda5172](https://github.com/betagouv/api-subventions-asso/commit/dda51729ffbd977b3aec1830771cc1d2306d21f8))

## [0.36.8](https://github.com/betagouv/api-subventions-asso/compare/v0.36.7...v0.36.8) (2023-10-10)

### Bug Fixes

- **api:** custom axios instance to avoid ETIMEDOUT error ([79049b5](https://github.com/betagouv/api-subventions-asso/commit/79049b5dbf7a1e9d69aea9ac045ae4df1e2e1fbf))
- **api:** fetch all DS result's pages ([ed4eb2f](https://github.com/betagouv/api-subventions-asso/commit/ed4eb2ffb5cf59167697c3cbce7d0552462a0a8a))
- **api:** types DS results ([e38b6d8](https://github.com/betagouv/api-subventions-asso/commit/e38b6d83275dc08bb130f4e02db35dab9382e8ed))

## [0.36.7](https://github.com/betagouv/api-subventions-asso/compare/v0.36.6...v0.36.7) (2023-10-03)

### Bug Fixes

- **api:** fix when api not found structure by siren end point ([c109a7c](https://github.com/betagouv/api-subventions-asso/commit/c109a7cab975f475b869bc5313817a22a62dde45))

## [0.36.6](https://github.com/betagouv/api-subventions-asso/compare/v0.36.5...v0.36.6) (2023-09-21)

### Bug Fixes

- **api:** recursive log censoring ([0ecea7e](https://github.com/betagouv/api-subventions-asso/commit/0ecea7efaefbd95ae211ac9db5464f288a1b0303))

## [0.36.5](https://github.com/betagouv/api-subventions-asso/compare/v0.36.3...v0.36.5) (2023-09-20)

### Bug Fixes

- **api:** activate validation allows empty values ([00fefc1](https://github.com/betagouv/api-subventions-asso/commit/00fefc17f4058dfee4ec547fa2431bea4d3c4645))
- **api:** brevo structure mapping ([033921e](https://github.com/betagouv/api-subventions-asso/commit/033921ebd1c53c1f2b322a14512df026cc737101))
- **api:** sometimes user is defined but not a user ([b3e1b8e](https://github.com/betagouv/api-subventions-asso/commit/b3e1b8e299b1b63be88089430f56e58990b1baf9))
- **front:** wording ([632362b](https://github.com/betagouv/api-subventions-asso/commit/632362b84fd24c95c96ec0d9e2e0b4c09b3dcf07))

### Features

- **api,dto,front:** new job type ([1969dcf](https://github.com/betagouv/api-subventions-asso/commit/1969dcf7a9a7f82e235bea923f53aa5ee6e3d5fb))
- **api:** route get own's user ([71a5e22](https://github.com/betagouv/api-subventions-asso/commit/71a5e22d59b35dec89e685c32a6297498ba4b3ee))
- **api:** service get user no secret ([a2c1c3e](https://github.com/betagouv/api-subventions-asso/commit/a2c1c3ed219fa12ec40891f828c7873bb765f10e))
- **front:** cgu in new tab ([c1198c9](https://github.com/betagouv/api-subventions-asso/commit/c1198c9e1cad5ae43be3b53aa51b41f4fa426065))
- **front:** sort regions ([713982e](https://github.com/betagouv/api-subventions-asso/commit/713982ef78446b4600ed869de13f982c7f5ec60c))

## [0.36.4](https://github.com/betagouv/api-subventions-asso/compare/v0.36.3...v0.36.4) (2023-09-19)

### Bug Fixes

- **api:** activate validation allows empty values ([3dbfb2f](https://github.com/betagouv/api-subventions-asso/commit/3dbfb2f4f2be5dcca87eb66ffb57d26998cd8215))
- **api:** brevo structure mapping ([b4b542e](https://github.com/betagouv/api-subventions-asso/commit/b4b542e1d82fc89135b3aad607a04663a372ce93))
- **front:** wording ([ad0087a](https://github.com/betagouv/api-subventions-asso/commit/ad0087a049cac982a2bac56cd3098cbdf5f48821))

### Features

- **api,dto,front:** new job type ([aa49f98](https://github.com/betagouv/api-subventions-asso/commit/aa49f983c28575d0ea3bf8cb71098a7d8d7e3571))
- **front:** cgu in new tab ([db65ecc](https://github.com/betagouv/api-subventions-asso/commit/db65eccca04381879afbd982fef8394acb0094c1))
- **front:** sort regions ([c1ff756](https://github.com/betagouv/api-subventions-asso/commit/c1ff7560cd0e6865c8c7b660c8bc3214ba83ab47))

## [0.36.3](https://github.com/betagouv/api-subventions-asso/compare/v0.36.2...v0.36.3) (2023-09-19)

### Bug Fixes

- **api:** sets profileToComplete and clean ([ad8612d](https://github.com/betagouv/api-subventions-asso/commit/ad8612d39ed3d4daa0e5fecec9c5da38086f8c7f))

## [0.36.2](https://github.com/betagouv/api-subventions-asso/compare/v0.36.1...v0.36.2) (2023-09-18)

### Bug Fixes

- **api:** activate actually activates user ([54d4026](https://github.com/betagouv/api-subventions-asso/commit/54d4026cdcaea9c2e35346739da560d8a213c321))

### Features

- **api:** update contact in brevo after activating account ([12c19f5](https://github.com/betagouv/api-subventions-asso/commit/12c19f5a2d30eb245ad5c41c38ca1ba29f8488a9))

## [0.36.1](https://github.com/betagouv/api-subventions-asso/compare/v0.36.0...v0.36.1) (2023-09-14)

### Bug Fixes

- **api:** update import env -> env.conf ([24bcee7](https://github.com/betagouv/api-subventions-asso/commit/24bcee795586feab2311c94e168f753931d9e85e))

# [0.36.0](https://github.com/betagouv/api-subventions-asso/compare/v0.35.3...v0.36.0) (2023-09-14)

### Bug Fixes

- **api:** accept undefined in column 2 ([1993b1e](https://github.com/betagouv/api-subventions-asso/commit/1993b1eb7717237a4ea5dc636bcc4a0f5c38f914))
- **api:** clean from review ([fe542eb](https://github.com/betagouv/api-subventions-asso/commit/fe542eb0203521359a80e410dc4690802afd1393))
- **api:** fix ts error on mongodb update ([6b2694a](https://github.com/betagouv/api-subventions-asso/commit/6b2694a0bb93096ec56347c1bc387732cdbf2c93))
- **api:** no auth to access admin structures ([e4da1cb](https://github.com/betagouv/api-subventions-asso/commit/e4da1cb7c1085034cf3358d5dec9f148eefd051a))
- **front:** autocomplete aria-label ([ac61713](https://github.com/betagouv/api-subventions-asso/commit/ac6171338f896eb0dea72326b9df65e42925f338))
- **front:** autoselect kept previous options ([4334eca](https://github.com/betagouv/api-subventions-asso/commit/4334eca38e965610013a00900d3e6613d8ab8be4))
- **front:** checkbox initializes to empty array ([2b0c032](https://github.com/betagouv/api-subventions-asso/commit/2b0c032bd8aca18d452f702e13f0031b866954e3))
- **front:** different value key ([138db7d](https://github.com/betagouv/api-subventions-asso/commit/138db7dd8a00c02ed34d7cd4ed60da43f31739b2))
- **front:** higher z-index ([ca8db32](https://github.com/betagouv/api-subventions-asso/commit/ca8db328ff2f416f7b5a6f4885e3fa0fce9c5e4f))
- **front:** more clever autocomplete reactivity ([ca715ee](https://github.com/betagouv/api-subventions-asso/commit/ca715ee67bddac469184f19a6e64835ce00e36c6))
- **front:** next button can also be blocked ([e5d0597](https://github.com/betagouv/api-subventions-asso/commit/e5d0597282dc2a08bc3a91d714c2828521e8f43f))
- **front:** no duplicate id ([9ab88b4](https://github.com/betagouv/api-subventions-asso/commit/9ab88b462b055d5c4b63f2b98a1c370394e380c0))
- **front:** no submit between steps ([f6e3f1d](https://github.com/betagouv/api-subventions-asso/commit/f6e3f1db17f2b8a7211e22e4572a980d4c943f3f))
- **front:** reactivity autocomplete ([e7497c5](https://github.com/betagouv/api-subventions-asso/commit/e7497c5c1a12e7c12f36a6695b859e94bed8ebb8))
- **front:** remove overseas territory ([c466075](https://github.com/betagouv/api-subventions-asso/commit/c4660756f3ee2c3ad3d780de6eade831180f10cf))
- **front:** remove password from values sent to activate ([0d11406](https://github.com/betagouv/api-subventions-asso/commit/0d11406a59e3836c450d45a2957bca6a1f78c263))
- **front:** review ([0fa01c5](https://github.com/betagouv/api-subventions-asso/commit/0fa01c511a5fdeba97e9696845187a96ffbdae79))
- **front:** show autocomplete label ([456740c](https://github.com/betagouv/api-subventions-asso/commit/456740c3cce4f7c3763ae702d3610653a08e59db))
- **front:** step 1 validation ([f2e2aba](https://github.com/betagouv/api-subventions-asso/commit/f2e2abacffbbff23e5a591968110a28a5d048051))
- **front:** steps 1 and 2 need validation ([3a1d879](https://github.com/betagouv/api-subventions-asso/commit/3a1d8793ec02abdac7ec538b83d69fcb84b7585c))
- **front:** typo ([6981b11](https://github.com/betagouv/api-subventions-asso/commit/6981b113ddea925c34312ed1a3d242bb1b790785))
- **front:** typo ([6311e68](https://github.com/betagouv/api-subventions-asso/commit/6311e68b70124562c8ca51f197a82e7df806fb8c))
- **front:** update csp to use geo api ([8e0e36b](https://github.com/betagouv/api-subventions-asso/commit/8e0e36baffb98486e8deea054ee78f37f7165377))
- **front:** variable name typo ([9898da8](https://github.com/betagouv/api-subventions-asso/commit/9898da882ff0067e2f9d363fa0267fbdf8860462))

### Features

- **api, dto:** create activate user route ([e6ee186](https://github.com/betagouv/api-subventions-asso/commit/e6ee186126786b82cd6548949479180a4ff6be73))
- **api:** add metabase dump ([cfecdfe](https://github.com/betagouv/api-subventions-asso/commit/cfecdfe7bb1939930d2f5d8ec75610620f88ad42))
- **api:** anonymize phoneNumber in metabase ([505d4c6](https://github.com/betagouv/api-subventions-asso/commit/505d4c63be64653920ab8bd2e7b6b4201c05136c))
- **api:** call notify on user deletion by admin ([842c5e5](https://github.com/betagouv/api-subventions-asso/commit/842c5e57120e0020c5019e8182096044d2560bc6))
- **api:** call notify on user self-deletion ([ac5c727](https://github.com/betagouv/api-subventions-asso/commit/ac5c727a842d154fb17a703e118df673943b4846))
- **api:** clean from review ([1c50352](https://github.com/betagouv/api-subventions-asso/commit/1c5035284060350346e152112e2a5035ed326b6d))
- **api:** clean from review 2 wip ([43dea7a](https://github.com/betagouv/api-subventions-asso/commit/43dea7a982185340afe6277889659f7c3691733c))
- **api:** delete brevo contact after account deletion ([f28d852](https://github.com/betagouv/api-subventions-asso/commit/f28d85232b6731d5a445d60a7ea881bb02a5b0b3))
- **api:** extract axios call and append env ([a421903](https://github.com/betagouv/api-subventions-asso/commit/a4219032d09f35c15f49f2a5941c40b478d99e22))
- **api:** fix typo ([a0121c3](https://github.com/betagouv/api-subventions-asso/commit/a0121c38169cb771ad707d1a908710d58d7321f9))
- **api:** init brevo in BrevoNotifyPipe class ([8218f3e](https://github.com/betagouv/api-subventions-asso/commit/8218f3ea5b00892eff84061899bf3b161d0e8a84))
- **api:** mattermost notify out pipe ([243b928](https://github.com/betagouv/api-subventions-asso/commit/243b928444af1ef62e6412c00ccfc7e349d1cbe1))
- **api:** notify deleted_user type has names ([c0e5c4b](https://github.com/betagouv/api-subventions-asso/commit/c0e5c4b4bd685fa6d58a7f3616a941db10663ebe))
- **api:** only sanitize unchecked user info ([01e1c98](https://github.com/betagouv/api-subventions-asso/commit/01e1c98279b4ae175eb331bcfa91a4bd4c9f8b8d))
- **api:** parse structures territory level with enum not initial string ([50302b7](https://github.com/betagouv/api-subventions-asso/commit/50302b7d8d6f0211544f3080ad1e28bba45dd627))
- **api:** remove console.log ([3bcd616](https://github.com/betagouv/api-subventions-asso/commit/3bcd616c8a4dc3eee6d1e7de3cf879e96e47ad8a))
- **api:** remove hashPassword from returned user ([d8be6bc](https://github.com/betagouv/api-subventions-asso/commit/d8be6bc35634a23b446b388c4f5c5e1656006e3c))
- **api:** remove optionnal first and last name in USER_DELETE notify pipe ([c86b8f2](https://github.com/betagouv/api-subventions-asso/commit/c86b8f25b82823eacf2db5d0dc8f28951da7ea35))
- **api:** remove useless TODO ([b7a0822](https://github.com/betagouv/api-subventions-asso/commit/b7a08225dc0438575af2ddb2c36ad2b9a9ed5e11))
- **api:** sentry checkIn instead of captureEvent ([ee39473](https://github.com/betagouv/api-subventions-asso/commit/ee39473eb3c7d597881dd0bd78c0a1d3f37dd38a))
- **api:** update todo comment messages ([c6a6a36](https://github.com/betagouv/api-subventions-asso/commit/c6a6a36d24e2bb464883fd4cd21aa981c3278d34))
- **api:** use 200 http code for success on activate ([9e444f6](https://github.com/betagouv/api-subventions-asso/commit/9e444f67a9ac865bdc8af51dd0f4216c5029db76))
- **dto,front:** better dto value DECONCENTRATED ([e7abc33](https://github.com/betagouv/api-subventions-asso/commit/e7abc332c26ec98b398dc9165f30b593e362745d))
- **dto:** admin structure dto ([1290ae3](https://github.com/betagouv/api-subventions-asso/commit/1290ae356ad09f2477e76e3565b81a5bf536874c))
- **dto:** admin territorial level ([c3823ac](https://github.com/betagouv/api-subventions-asso/commit/c3823ac22990e247dcfdd91b5e6c9f9951084c48))
- **dto:** territorial scope enum ([22e897e](https://github.com/betagouv/api-subventions-asso/commit/22e897e917268039268136cc2263b3ca596f85b4))
- **front:** activate route resource ([d9cb28d](https://github.com/betagouv/api-subventions-asso/commit/d9cb28dab28762e4ee5c7da387f5fb0545deb7f5))
- **front:** add geo api port ([90995d6](https://github.com/betagouv/api-subventions-asso/commit/90995d646e5d440f4494693e5714b69673c8d2fd))
- **front:** add geo api service ([4ee4e20](https://github.com/betagouv/api-subventions-asso/commit/4ee4e203af1b4e25472bde60bf0d5c11339801af))
- **front:** adjust placeholder ([c4374fc](https://github.com/betagouv/api-subventions-asso/commit/c4374fc6a7a362eeb8024b45dcd612c650cc33a0))
- **front:** autoselect not only beginning ([0b85cc0](https://github.com/betagouv/api-subventions-asso/commit/0b85cc084e12e9b447c618e4c2d56994febcb758))
- **front:** central substep ([b3504c1](https://github.com/betagouv/api-subventions-asso/commit/b3504c1a9d3023b44c4080a4e81639a07e1f2925))
- **front:** cleanup data from other substeps and call activate ([5a38fa8](https://github.com/betagouv/api-subventions-asso/commit/5a38fa86e405b77d4e0ef9f794bdc6a910b1698e))
- **front:** clear search history at logout ([19c8dae](https://github.com/betagouv/api-subventions-asso/commit/19c8dae7724f613325ae636f30f6bce1f3c9ccce))
- **front:** commande to clean vite cache ([cde0367](https://github.com/betagouv/api-subventions-asso/commit/cde03670c2c9bcadb4639e6503267bf799296559))
- **front:** configure need for validation (default to false) ([f2c7398](https://github.com/betagouv/api-subventions-asso/commit/f2c7398f3274a87d81064791ec7b8e6bf8ba9a1c))
- **front:** convert geo api to TypeScript ([54bc2c7](https://github.com/betagouv/api-subventions-asso/commit/54bc2c763f3b721ddcb3ea092d59c50458eb5269))
- **front:** don't prefix structure ([18b4606](https://github.com/betagouv/api-subventions-asso/commit/18b46064877fb5fdf090d59d0387b5493d5b9a3f))
- **front:** dsfr skiplink component ([f1dcd8e](https://github.com/betagouv/api-subventions-asso/commit/f1dcd8e44b0aea5fce30188b8de357f45dbd4511))
- **front:** example sub step ([7b6e340](https://github.com/betagouv/api-subventions-asso/commit/7b6e340651cf51745ec9d2ab436b31963defce97))
- **front:** form context given to steps ([bb5c28f](https://github.com/betagouv/api-subventions-asso/commit/bb5c28f15f4ecad0f03a5969a6d66b14ca511c89))
- **front:** format territory options ([9973d74](https://github.com/betagouv/api-subventions-asso/commit/9973d744007f5ff1f50d283991aebab85087c3e7))
- **front:** function to clear history ([6967c6f](https://github.com/betagouv/api-subventions-asso/commit/6967c6fda5e6f8c0174fd1f75ca14caa67828078))
- **front:** implement skiplinks ([fc5c0c7](https://github.com/betagouv/api-subventions-asso/commit/fc5c0c7a542d98e8d141b81c69224ee44624750f))
- **front:** move value substep cleaning to structureStep + tests ([f706d89](https://github.com/betagouv/api-subventions-asso/commit/f706d89b96ab86bd3b92d832910e9508091f67d5))
- **front:** no placeholder in service field ([50d7d2d](https://github.com/betagouv/api-subventions-asso/commit/50d7d2de5acfc12256c87dbb8d61a926aa52efbd))
- **front:** operator sub step ([db0e81a](https://github.com/betagouv/api-subventions-asso/commit/db0e81ae4c0e2a7e8f4fbf7f0148ed9ca68d9af8))
- **front:** pass agentType to substep ([68042ae](https://github.com/betagouv/api-subventions-asso/commit/68042ae768a0846967441d357d65096be69c2c17))
- **front:** placeholder in autocomplete select ([33e3127](https://github.com/betagouv/api-subventions-asso/commit/33e3127ddbf80efe5685e349ea228304e7412c11))
- **front:** placeholders ([bd3fdd8](https://github.com/betagouv/api-subventions-asso/commit/bd3fdd88c91bc2f8629556048fc68477e0b057b4))
- **front:** register decentralized substep ([6a9f7da](https://github.com/betagouv/api-subventions-asso/commit/6a9f7da49e0c3f60d197b6e938c3d649c6fa3464))
- **front:** spacing ([aa9ee5f](https://github.com/betagouv/api-subventions-asso/commit/aa9ee5ff5ccfff88a4c15df6037d7c0bc3a756f1))
- **front:** step 3 fields not required ([8bdf013](https://github.com/betagouv/api-subventions-asso/commit/8bdf013bcbe38b2010a8c496ea960f027329f0ec))
- **front:** store all steps validation state ([1c9c1d9](https://github.com/betagouv/api-subventions-asso/commit/1c9c1d905bd8e0edfecdec9a016e8ffdd192acfc))
- **front:** subscription form get structure resource ([f521043](https://github.com/betagouv/api-subventions-asso/commit/f521043889fedbc451af9eddf6463e94d36157e8))
- **front:** substep managmennt in step 3 ([3ec4215](https://github.com/betagouv/api-subventions-asso/commit/3ec421508af77741c96660f2a2e19f06cdbdcaaa))
- **front:** territorial sub step ([3bf380d](https://github.com/betagouv/api-subventions-asso/commit/3bf380d5a7f307e3fc7d26149c27dc48e1b6da70))
- **front:** unlock full subscription form ([ccc0eb3](https://github.com/betagouv/api-subventions-asso/commit/ccc0eb3e20557646a0a681258ead1abc6007dacc))
- **front:** wip step 3 decentralized ([0682119](https://github.com/betagouv/api-subventions-asso/commit/06821192fd5f8a15cfacdb28c83a460655d62290))

### Reverts

- **api:** make lastname and firstname optionnal again ([ffcaa70](https://github.com/betagouv/api-subventions-asso/commit/ffcaa7062eae984bde398d3ec04964aa61ea8558))

## [0.35.3](https://github.com/betagouv/api-subventions-asso/compare/v0.35.2...v0.35.3) (2023-09-05)

### Features

- **api:** add import type env in desploy osiris file tool ([26040ce](https://github.com/betagouv/api-subventions-asso/commit/26040ce2e5a49c1cb399cf66ca64cd08d9bb563c))

## [0.35.2](https://github.com/betagouv/api-subventions-asso/compare/v0.35.1...v0.35.2) (2023-08-30)

### Bug Fixes

- **front:** update test for last commit ([f74bc49](https://github.com/betagouv/api-subventions-asso/commit/f74bc49f4bbf2865e0a41a018173249dbe30094e))

### Reverts

- **front:** noscript tag deletion ([fa1987a](https://github.com/betagouv/api-subventions-asso/commit/fa1987a5e23311bde23ca5a775fbfe64e71f8d21))

## [0.35.1](https://github.com/betagouv/api-subventions-asso/compare/v0.35.0...v0.35.1) (2023-08-30)

### Bug Fixes

- **front:** remove step 2 and 3 from ActiveAccount until it is fully done ([de4f1ce](https://github.com/betagouv/api-subventions-asso/commit/de4f1cec664c3fd0cef2316eb79166902b713181))
- package lock ([2765e7b](https://github.com/betagouv/api-subventions-asso/commit/2765e7b7abc6fc5cc7d9369d61048df7b73c3d1c))

# [0.35.0](https://github.com/betagouv/api-subventions-asso/compare/v0.33.4...v0.35.0) (2023-08-29)

### Bug Fixes

- **api:** env ([4fd7196](https://github.com/betagouv/api-subventions-asso/commit/4fd7196606edce85b843ad5c6297e330bbc99fd0))
- **api:** fixes sentry DATA-SUBVENTION-API-1A ([085c977](https://github.com/betagouv/api-subventions-asso/commit/085c977c462127321561fd3f7650ed3a0a8b5cc8))
- **api:** review clean ([55f01bf](https://github.com/betagouv/api-subventions-asso/commit/55f01bf283263dc1baba3cbe641c85ae02769079))
- **api:** update tsoa version ([fdd29da](https://github.com/betagouv/api-subventions-asso/commit/fdd29dab90d6a62cb8874d312ba491ffc93efa82))
- **chore:** bash loop error ([a44ce8f](https://github.com/betagouv/api-subventions-asso/commit/a44ce8f3d5535fe5bd036a87ce2336791f84f0c4))
- **front:** call logout in user.service after account deletion ([533b796](https://github.com/betagouv/api-subventions-asso/commit/533b7961bac5bb2f0efefc762294dfc0f346dad5))
- **front:** do not redirect after UnauthorizedError if already on login page ([cd7915d](https://github.com/betagouv/api-subventions-asso/commit/cd7915d9a66a3102403e9124e225e124a47b9cd5))
- **front:** fix account deletion modal ([da5761e](https://github.com/betagouv/api-subventions-asso/commit/da5761e86d2f0786650242db13e8f116f4bf1b96))
- **front:** fix cgu height ([19c3ed7](https://github.com/betagouv/api-subventions-asso/commit/19c3ed744e31ab65edffccdeefa5c97973c9220e))
- **front:** hide history if empty ([c0b992a](https://github.com/betagouv/api-subventions-asso/commit/c0b992a1e9e90e3d69a8b9ecac7f4db233656d91))
- **front:** mv redirect to login page in user.service ([8f9eea9](https://github.com/betagouv/api-subventions-asso/commit/8f9eea9938896e260feb41a5da06d862dfb5ab39))
- **front:** options ([6c632ef](https://github.com/betagouv/api-subventions-asso/commit/6c632ef95ac4001a7a3d95bdad8f62d4b0c72bc3))
- **front:** put nativeError in StaticError constructor ([d29d267](https://github.com/betagouv/api-subventions-asso/commit/d29d267090ce94f3b4c3be6b713b0dc0ffbdf063))
- **front:** remove tabs etab centering ([5b86db9](https://github.com/betagouv/api-subventions-asso/commit/5b86db94c62b015be690c2efc75b5fca39d4b333))

### Features

- **api:** adminStructure replace not only insert ([70678a0](https://github.com/betagouv/api-subventions-asso/commit/70678a0cf686d4cca61cf5d56dc3dbe3adf26995))
- **api:** catch secures notify service ([10d7f51](https://github.com/betagouv/api-subventions-asso/commit/10d7f51b3560dcbf50df5f82e5f597d823bdac27))
- **api:** parsing and replacing admin-structure ([c96cb31](https://github.com/betagouv/api-subventions-asso/commit/c96cb31a76a332fde44e33ecb259adfa94c2bd0c))
- **dto:** job type enum ([0e8ba24](https://github.com/betagouv/api-subventions-asso/commit/0e8ba2435ee7681a30ff21e3d46a0b4688775c05))
- **dto:** user agent enum ([216f40a](https://github.com/betagouv/api-subventions-asso/commit/216f40ae2097d0f3b5c58a887a7739dc8621dd66))
- **front,dto:** other review adjustments ([be93bf5](https://github.com/betagouv/api-subventions-asso/commit/be93bf5bcbbb72346589dd413c35ceb7fc238c40))
- **front:** basis for step 3 ([f7d0eb9](https://github.com/betagouv/api-subventions-asso/commit/f7d0eb95ed73497eb20f4a2d51aaa10cca774c86))
- **front:** checkbox component ([ab701f2](https://github.com/betagouv/api-subventions-asso/commit/ab701f262677de2adb72ecd800711d4ca909f0a1))
- **front:** checkbox support error display ([27bb324](https://github.com/betagouv/api-subventions-asso/commit/27bb324b24ef29dff03c7b1cc14c8c1544df7697))
- **front:** dsfr radio component ([eb7e48c](https://github.com/betagouv/api-subventions-asso/commit/eb7e48c051ff2a2e8675e7d61a1feb4d9f5817e3))
- **front:** html error message in radio ([b924f63](https://github.com/betagouv/api-subventions-asso/commit/b924f6304a6639f862e6c65495bbd40795b7378b))
- **front:** move options and validators out of constructor ([fe5a09b](https://github.com/betagouv/api-subventions-asso/commit/fe5a09ba4c264d57428474f8c5d2eb0feb28fe8c))
- **front:** none hint -> error message ([202e95a](https://github.com/betagouv/api-subventions-asso/commit/202e95a9d2c9f7ac33f3033b0a9ee5a7d4c2a82d))
- **front:** phone number validator ([ecb0f76](https://github.com/betagouv/api-subventions-asso/commit/ecb0f76eb2a0dfbac141bf02db300f0e5aa77456))
- **front:** radio supports error message ([1c2223c](https://github.com/betagouv/api-subventions-asso/commit/1c2223c4a730285cb41d6a5ca5a4c2fb5cdacdfe))
- **front:** register step 2 ([2507bca](https://github.com/betagouv/api-subventions-asso/commit/2507bca2ab2d0347a00add96c9301c4710e64f2b))
- **front:** register step 3 ([a8653ca](https://github.com/betagouv/api-subventions-asso/commit/a8653cac6f117e4207ce3b9483345bff17d2b1d6))
- **front:** step 3 validates phone number ([65448e2](https://github.com/betagouv/api-subventions-asso/commit/65448e2a1853fb80561cfa707d6a97b8ee21b272))
- **front:** subscription form step 2 ([34adbaa](https://github.com/betagouv/api-subventions-asso/commit/34adbaa4378e7fe8f4d2d771a21ae9251da5c4f9))
- **front:** test phone number less strict ([044cecb](https://github.com/betagouv/api-subventions-asso/commit/044cecb8933cc828ea37f6746f49cf193b5b0376))
- **front:** tweak input component ([c5e8a60](https://github.com/betagouv/api-subventions-asso/commit/c5e8a60aa23d503cb74db15f5cd363e3be14d918))

## [0.34.1](https://github.com/betagouv/api-subventions-asso/compare/v0.33.2...v0.34.1) (2023-08-11)

### Bug Fixes

- **front:** breadcrumbs when 404 inside route ([37c649b](https://github.com/betagouv/api-subventions-asso/commit/37c649b595e2e88c65619976f3bbdf912e252646))
- **front:** local storage get with default value ([728b6a5](https://github.com/betagouv/api-subventions-asso/commit/728b6a572fa84773134a91a15060aa84a10a8d24))

### Features

- **api:** setup admin structure ([6dc94f8](https://github.com/betagouv/api-subventions-asso/commit/6dc94f803005dc309befc9637207d18a0c301ac0))
- **dto:** user agent enum ([6dfd568](https://github.com/betagouv/api-subventions-asso/commit/6dfd568fdae491782deed61f1ae1bd6bc7bb08d5))
- **front:** wip wip ([4b70312](https://github.com/betagouv/api-subventions-asso/commit/4b703129fdb050d48bcb6efcd1a6a1731fc35f6b))

# [0.34.0](https://github.com/betagouv/api-subventions-asso/compare/v0.32.4...v0.34.0) (2023-08-09)

### Bug Fixes

- **dto:** fix swagger doc on open data ([93cb0fc](https://github.com/betagouv/api-subventions-asso/commit/93cb0fc36dbd68773f3005922a94bcb8f45d1bf6))
- **front:** actual subscribe & bind ([55b38d3](https://github.com/betagouv/api-subventions-asso/commit/55b38d3435d9838ac6d0a07550bf386d38dca1c9))
- **front:** fix input link to label ([94fb534](https://github.com/betagouv/api-subventions-asso/commit/94fb534713d395ecb5b187f039d47c46b52bdf4b))
- **front:** fix ResetPwd error handling ([8ad999e](https://github.com/betagouv/api-subventions-asso/commit/8ad999eee66be6ca9e567fe856d779b921473e06))
- **front:** local storage on parsing undefined ([6c94a2d](https://github.com/betagouv/api-subventions-asso/commit/6c94a2ddd146ee907b8a9639f76edd71e519b062))
- **front:** store typing ([78ab61a](https://github.com/betagouv/api-subventions-asso/commit/78ab61a2c557e760be5b6a73cf1ac75185d135eb))

### Features

- **api:** add cli for update all users in brevo ([30a9617](https://github.com/betagouv/api-subventions-asso/commit/30a9617a1667096518b416630db508cd877af9b8))
- **api:** add route for check if token is valid ([dbe0845](https://github.com/betagouv/api-subventions-asso/commit/dbe08459ca630ed37087eb17b488048cc942f914))
- **api:** add token type information in validation token ([88408da](https://github.com/betagouv/api-subventions-asso/commit/88408da9465d9adfd79a3ff9757a2193e6afe599))
- **front:** adapt combobox to dsfr ([882e66c](https://github.com/betagouv/api-subventions-asso/commit/882e66c81feee0a780aeae2bd7e97a07f2eaeebc))
- **front:** adapt combobox to svelte ([9fd4683](https://github.com/betagouv/api-subventions-asso/commit/9fd46836a0be00f61ba48c18d58b15142af9c280))
- **front:** add error on confirm password ([7d7ddc9](https://github.com/betagouv/api-subventions-asso/commit/7d7ddc9f142b4173df113900e161c98dae771104))
- **front:** add MultiStepFormController ([39af847](https://github.com/betagouv/api-subventions-asso/commit/39af847560aa2b6c16cdc677544194bb758acd99))
- **front:** add real submit method to ActivateAccount ([9400268](https://github.com/betagouv/api-subventions-asso/commit/94002680aa28b474d0095dd60ee36acd7eba0f3b))
- **front:** add show password checkbox ([063888e](https://github.com/betagouv/api-subventions-asso/commit/063888ed41c8c026d31be33e24076567ea102b67))
- **front:** add stepper ([3ac1ad8](https://github.com/betagouv/api-subventions-asso/commit/3ac1ad85243d6ea220f23d648e460201f81a7dd8))
- **front:** add traking ([62d61f4](https://github.com/betagouv/api-subventions-asso/commit/62d61f442c73dca607f16204756d213df32a5541))
- **front:** add validation handling ([b7a14c5](https://github.com/betagouv/api-subventions-asso/commit/b7a14c568a9203103cc1987f4cd89bceb9ede571))
- **front:** autocomplete select uses options ([8adaf1a](https://github.com/betagouv/api-subventions-asso/commit/8adaf1a3249d2e1cf4f758a467ec859ecc20bea9))
- **front:** clean and add test ([c6af491](https://github.com/betagouv/api-subventions-asso/commit/c6af4913a37ad1b3ec2f7f2ebdb63b04061fde34))
- **front:** combobox from w3.org ([2b217dc](https://github.com/betagouv/api-subventions-asso/commit/2b217dc5551690527043071ce4b5aefe6608920f))
- **front:** create ActivateAccount and define route ([c01268d](https://github.com/betagouv/api-subventions-asso/commit/c01268d3c35d1491d646221c974e0fa8b3862945))
- **front:** make better use of DSFR in MultiStepForm ([c39fd1e](https://github.com/betagouv/api-subventions-asso/commit/c39fd1e0ac014590f7dbaa7b1776e515b689fbab))
- **front:** make the form dynamic ([3894feb](https://github.com/betagouv/api-subventions-asso/commit/3894feb2b63efe8cee508049eb16a6d6e85ef521))
- **front:** multi step form static ([32e7e99](https://github.com/betagouv/api-subventions-asso/commit/32e7e9996790ff922b1f96f8ea02c5d0547af01b))
- **front:** rename methods and stores in ResetPwd ([ebf5a09](https://github.com/betagouv/api-subventions-asso/commit/ebf5a0924dee1f4a95e44fba4fba4fda7e8c638a))
- **front:** rework forget password with new password components ([69ea3df](https://github.com/betagouv/api-subventions-asso/commit/69ea3df8c23924d80e5076dceae75a714b553eb7))
- **front:** text -> label ([073080f](https://github.com/betagouv/api-subventions-asso/commit/073080f430485655fe1d6bd589756b2dd1733e7a))
- **front:** update Input and PasswordInput accessiblity ([3227e02](https://github.com/betagouv/api-subventions-asso/commit/3227e020bd13402ccc1371b03e566fe5d1dd04fb))

## [0.34.1](https://github.com/betagouv/api-subventions-asso/compare/v0.33.2...v0.34.1) (2023-08-11)

### Bug Fixes

- **front:** breadcrumbs when 404 inside route ([37c649b](https://github.com/betagouv/api-subventions-asso/commit/37c649b595e2e88c65619976f3bbdf912e252646))
- **front:** local storage get with default value ([728b6a5](https://github.com/betagouv/api-subventions-asso/commit/728b6a572fa84773134a91a15060aa84a10a8d24))

# [0.34.0](https://github.com/betagouv/api-subventions-asso/compare/v0.32.4...v0.34.0) (2023-08-09)

### Bug Fixes

- **dto:** fix swagger doc on open data ([93cb0fc](https://github.com/betagouv/api-subventions-asso/commit/93cb0fc36dbd68773f3005922a94bcb8f45d1bf6))
- **front:** local storage on parsing undefined ([6c94a2d](https://github.com/betagouv/api-subventions-asso/commit/6c94a2ddd146ee907b8a9639f76edd71e519b062))

### Features

- **api:** add cli for update all users in brevo ([30a9617](https://github.com/betagouv/api-subventions-asso/commit/30a9617a1667096518b416630db508cd877af9b8))
- **api:** add route for check if token is valid ([dbe0845](https://github.com/betagouv/api-subventions-asso/commit/dbe08459ca630ed37087eb17b488048cc942f914))
- **api:** add token type information in validation token ([88408da](https://github.com/betagouv/api-subventions-asso/commit/88408da9465d9adfd79a3ff9757a2193e6afe599))
- **front:** add MultiStepFormController ([39af847](https://github.com/betagouv/api-subventions-asso/commit/39af847560aa2b6c16cdc677544194bb758acd99))
- **front:** add stepper ([3ac1ad8](https://github.com/betagouv/api-subventions-asso/commit/3ac1ad85243d6ea220f23d648e460201f81a7dd8))
- **front:** add traking ([62d61f4](https://github.com/betagouv/api-subventions-asso/commit/62d61f442c73dca607f16204756d213df32a5541))
- **front:** clean and add test ([c6af491](https://github.com/betagouv/api-subventions-asso/commit/c6af4913a37ad1b3ec2f7f2ebdb63b04061fde34))
- **front:** make the form dynamic ([3894feb](https://github.com/betagouv/api-subventions-asso/commit/3894feb2b63efe8cee508049eb16a6d6e85ef521))
- **front:** multi step form static ([32e7e99](https://github.com/betagouv/api-subventions-asso/commit/32e7e9996790ff922b1f96f8ea02c5d0547af01b))

# [0.34.0](https://github.com/betagouv/api-subventions-asso/compare/v0.32.4...v0.34.0) (2023-08-09)

### Bug Fixes

- **dto:** fix swagger doc on open data ([93cb0fc](https://github.com/betagouv/api-subventions-asso/commit/93cb0fc36dbd68773f3005922a94bcb8f45d1bf6))
- **front:** local storage on parsing undefined ([6c94a2d](https://github.com/betagouv/api-subventions-asso/commit/6c94a2ddd146ee907b8a9639f76edd71e519b062))

### Features

- **api:** add cli for update all users in brevo ([30a9617](https://github.com/betagouv/api-subventions-asso/commit/30a9617a1667096518b416630db508cd877af9b8))
- **api:** add route for check if token is valid ([dbe0845](https://github.com/betagouv/api-subventions-asso/commit/dbe08459ca630ed37087eb17b488048cc942f914))
- **api:** add token type information in validation token ([88408da](https://github.com/betagouv/api-subventions-asso/commit/88408da9465d9adfd79a3ff9757a2193e6afe599))
- **front:** add traking ([62d61f4](https://github.com/betagouv/api-subventions-asso/commit/62d61f442c73dca607f16204756d213df32a5541))

## [0.33.1](https://github.com/betagouv/api-subventions-asso/compare/v0.32.3...v0.33.1) (2023-07-27)

### Bug Fixes

- **api:** update user when he is already in brevo list ([ab24943](https://github.com/betagouv/api-subventions-asso/commit/ab2494325bc183fcb453a76c05c1f8bfe9204ec7))
- clean changelog ([15f19ba](https://github.com/betagouv/api-subventions-asso/commit/15f19ba852a25739b0fd5836156bfbcc1739f070))
- **front:** document dauphin are not a blob ([2cc7b30](https://github.com/betagouv/api-subventions-asso/commit/2cc7b308b5050dfacf66d92943558bc176ad55fe))
- review cleaning ([7ef7eb5](https://github.com/betagouv/api-subventions-asso/commit/7ef7eb5f38f4acaea8e37bb11295c422960154a2))

### Features

- **front:** switch last and first name ([ce10056](https://github.com/betagouv/api-subventions-asso/commit/ce100562ac4055daddba991cb44ef39a3f0a22f5))

# [0.33.0](https://github.com/betagouv/api-subventions-asso/compare/v0.32.2...v0.33.0) (2023-07-24)

### Bug Fixes

- **front:** fix html semantic ([208fe7f](https://github.com/betagouv/api-subventions-asso/commit/208fe7f5b21862807cb41dc90067e68559ab04c6))

### Features

- **front:** add checkbox to display password ([f4ea6ab](https://github.com/betagouv/api-subventions-asso/commit/f4ea6abf6e5a6a4fcd4686c6809ef9862aa791b8))
- **front:** add modal on user deleted action ([edf204d](https://github.com/betagouv/api-subventions-asso/commit/edf204d8657ca73184811d11dc7032690cebae43))
- **front:** add ModalFooter component and update ConfirmDeleteModal ([2e3a24a](https://github.com/betagouv/api-subventions-asso/commit/2e3a24a36ab1d83c89d37de83d183801556c701f))
- **front:** add MultiStepFormController ([39af847](https://github.com/betagouv/api-subventions-asso/commit/39af847560aa2b6c16cdc677544194bb758acd99))
- **front:** add stepper ([3ac1ad8](https://github.com/betagouv/api-subventions-asso/commit/3ac1ad85243d6ea220f23d648e460201f81a7dd8))
- **front:** clean and add test ([c6af491](https://github.com/betagouv/api-subventions-asso/commit/c6af4913a37ad1b3ec2f7f2ebdb63b04061fde34))
- **front:** generate default unique id in form inputs ([5534578](https://github.com/betagouv/api-subventions-asso/commit/5534578d8c2d1ab432dbd2f3179bf9a8865452ce))
- **front:** ignore static svg files ([9bff81d](https://github.com/betagouv/api-subventions-asso/commit/9bff81df41e5cbd3f0c7f8c9e85671f08c4f0f8e))
- **front:** increase margin top in signup and login ([8381a27](https://github.com/betagouv/api-subventions-asso/commit/8381a2708cb4c7cbe6bcc28effa7cd071c268224))
- **front:** install nanoid ([2465158](https://github.com/betagouv/api-subventions-asso/commit/2465158ef05cb3c016a3a459319fe6f19fd83b09))
- **front:** link to cgu ([f525855](https://github.com/betagouv/api-subventions-asso/commit/f5258553011e9b9121fc44fb0c9642b576a73c3f))
- **front:** make the form dynamic ([3894feb](https://github.com/betagouv/api-subventions-asso/commit/3894feb2b63efe8cee508049eb16a6d6e85ef521))
- **front:** multi step form static ([32e7e99](https://github.com/betagouv/api-subventions-asso/commit/32e7e9996790ff922b1f96f8ea02c5d0547af01b))
- **front:** remove h5 tag in legend ([87eade2](https://github.com/betagouv/api-subventions-asso/commit/87eade22cb999072553125e495cf7b309281c9b4))
- **front:** remove static svg ([d91d348](https://github.com/betagouv/api-subventions-asso/commit/d91d348faf8504325ed733ab06f8fea866a6d442))
- **front:** rework reset password view ([aa683f0](https://github.com/betagouv/api-subventions-asso/commit/aa683f0061221d53a68c4b3107cf7d06767b2c3a))
- **front:** style legend as h5 title ([28b2609](https://github.com/betagouv/api-subventions-asso/commit/28b2609d0c6866cf6146b59bbdc53827200cc2c0))
- **front:** update signup conditions style ([e3b16a8](https://github.com/betagouv/api-subventions-asso/commit/e3b16a880624744079278f84095eef03ad402a8b))
- **front:** use EmptySvg component to handle svg import in jest ([2f375b4](https://github.com/betagouv/api-subventions-asso/commit/2f375b47a704b7a9dedc297ee7f404e596cb9627))

## [0.33.2](https://github.com/betagouv/api-subventions-asso/compare/v0.32.4...v0.33.2) (2023-08-09)

### Bug Fixes

- **api:** insee avis situation changed api url ([857259d](https://github.com/betagouv/api-subventions-asso/commit/857259d2e65a2435da4425d53ea6081f50bd90a9))
- **front:** etablissement -> establishment ([631fb08](https://github.com/betagouv/api-subventions-asso/commit/631fb08781030590e0313810ca8032598dd6912e))

### Bug Fixes

- **api:** update user when he is already in brevo list ([ab24943](https://github.com/betagouv/api-subventions-asso/commit/ab2494325bc183fcb453a76c05c1f8bfe9204ec7))
- clean changelog ([15f19ba](https://github.com/betagouv/api-subventions-asso/commit/15f19ba852a25739b0fd5836156bfbcc1739f070))
- **front:** document dauphin are not a blob ([2cc7b30](https://github.com/betagouv/api-subventions-asso/commit/2cc7b308b5050dfacf66d92943558bc176ad55fe))
- review cleaning ([7ef7eb5](https://github.com/betagouv/api-subventions-asso/commit/7ef7eb5f38f4acaea8e37bb11295c422960154a2))

### Features

- **front:** switch last and first name ([ce10056](https://github.com/betagouv/api-subventions-asso/commit/ce100562ac4055daddba991cb44ef39a3f0a22f5))

# [0.33.0](https://github.com/betagouv/api-subventions-asso/compare/v0.32.2...v0.33.0) (2023-07-24)

### Bug Fixes

- **front:** fix html semantic ([208fe7f](https://github.com/betagouv/api-subventions-asso/commit/208fe7f5b21862807cb41dc90067e68559ab04c6))

### Features

- **front:** add checkbox to display password ([f4ea6ab](https://github.com/betagouv/api-subventions-asso/commit/f4ea6abf6e5a6a4fcd4686c6809ef9862aa791b8))
- **front:** add modal on user deleted action ([edf204d](https://github.com/betagouv/api-subventions-asso/commit/edf204d8657ca73184811d11dc7032690cebae43))
- **front:** add ModalFooter component and update ConfirmDeleteModal ([2e3a24a](https://github.com/betagouv/api-subventions-asso/commit/2e3a24a36ab1d83c89d37de83d183801556c701f))
- **front:** generate default unique id in form inputs ([5534578](https://github.com/betagouv/api-subventions-asso/commit/5534578d8c2d1ab432dbd2f3179bf9a8865452ce))
- **front:** ignore static svg files ([9bff81d](https://github.com/betagouv/api-subventions-asso/commit/9bff81df41e5cbd3f0c7f8c9e85671f08c4f0f8e))
- **front:** increase margin top in signup and login ([8381a27](https://github.com/betagouv/api-subventions-asso/commit/8381a2708cb4c7cbe6bcc28effa7cd071c268224))
- **front:** install nanoid ([2465158](https://github.com/betagouv/api-subventions-asso/commit/2465158ef05cb3c016a3a459319fe6f19fd83b09))
- **front:** link to cgu ([f525855](https://github.com/betagouv/api-subventions-asso/commit/f5258553011e9b9121fc44fb0c9642b576a73c3f))
- **front:** remove h5 tag in legend ([87eade2](https://github.com/betagouv/api-subventions-asso/commit/87eade22cb999072553125e495cf7b309281c9b4))
- **front:** remove static svg ([d91d348](https://github.com/betagouv/api-subventions-asso/commit/d91d348faf8504325ed733ab06f8fea866a6d442))
- **front:** rework reset password view ([aa683f0](https://github.com/betagouv/api-subventions-asso/commit/aa683f0061221d53a68c4b3107cf7d06767b2c3a))
- **front:** style legend as h5 title ([28b2609](https://github.com/betagouv/api-subventions-asso/commit/28b2609d0c6866cf6146b59bbdc53827200cc2c0))
- **front:** update signup conditions style ([e3b16a8](https://github.com/betagouv/api-subventions-asso/commit/e3b16a880624744079278f84095eef03ad402a8b))
- **front:** use EmptySvg component to handle svg import in jest ([2f375b4](https://github.com/betagouv/api-subventions-asso/commit/2f375b47a704b7a9dedc297ee7f404e596cb9627))

## [0.33.1](https://github.com/betagouv/api-subventions-asso/compare/v0.32.3...v0.33.1) (2023-07-27)

### Bug Fixes

- **api:** update user when he is already in brevo list ([ab24943](https://github.com/betagouv/api-subventions-asso/commit/ab2494325bc183fcb453a76c05c1f8bfe9204ec7))
- clean changelog ([15f19ba](https://github.com/betagouv/api-subventions-asso/commit/15f19ba852a25739b0fd5836156bfbcc1739f070))
- **front:** document dauphin are not a blob ([2cc7b30](https://github.com/betagouv/api-subventions-asso/commit/2cc7b308b5050dfacf66d92943558bc176ad55fe))
- review cleaning ([7ef7eb5](https://github.com/betagouv/api-subventions-asso/commit/7ef7eb5f38f4acaea8e37bb11295c422960154a2))

### Features

- **front:** switch last and first name ([ce10056](https://github.com/betagouv/api-subventions-asso/commit/ce100562ac4055daddba991cb44ef39a3f0a22f5))

# [0.33.0](https://github.com/betagouv/api-subventions-asso/compare/v0.32.2...v0.33.0) (2023-07-24)

### Bug Fixes

- **front:** fix html semantic ([208fe7f](https://github.com/betagouv/api-subventions-asso/commit/208fe7f5b21862807cb41dc90067e68559ab04c6))

### Features

- **front:** add checkbox to display password ([f4ea6ab](https://github.com/betagouv/api-subventions-asso/commit/f4ea6abf6e5a6a4fcd4686c6809ef9862aa791b8))
- **front:** add modal on user deleted action ([edf204d](https://github.com/betagouv/api-subventions-asso/commit/edf204d8657ca73184811d11dc7032690cebae43))
- **front:** add ModalFooter component and update ConfirmDeleteModal ([2e3a24a](https://github.com/betagouv/api-subventions-asso/commit/2e3a24a36ab1d83c89d37de83d183801556c701f))
- **front:** generate default unique id in form inputs ([5534578](https://github.com/betagouv/api-subventions-asso/commit/5534578d8c2d1ab432dbd2f3179bf9a8865452ce))
- **front:** ignore static svg files ([9bff81d](https://github.com/betagouv/api-subventions-asso/commit/9bff81df41e5cbd3f0c7f8c9e85671f08c4f0f8e))
- **front:** increase margin top in signup and login ([8381a27](https://github.com/betagouv/api-subventions-asso/commit/8381a2708cb4c7cbe6bcc28effa7cd071c268224))
- **front:** install nanoid ([2465158](https://github.com/betagouv/api-subventions-asso/commit/2465158ef05cb3c016a3a459319fe6f19fd83b09))
- **front:** link to cgu ([f525855](https://github.com/betagouv/api-subventions-asso/commit/f5258553011e9b9121fc44fb0c9642b576a73c3f))
- **front:** remove h5 tag in legend ([87eade2](https://github.com/betagouv/api-subventions-asso/commit/87eade22cb999072553125e495cf7b309281c9b4))
- **front:** remove static svg ([d91d348](https://github.com/betagouv/api-subventions-asso/commit/d91d348faf8504325ed733ab06f8fea866a6d442))
- **front:** rework reset password view ([aa683f0](https://github.com/betagouv/api-subventions-asso/commit/aa683f0061221d53a68c4b3107cf7d06767b2c3a))
- **front:** style legend as h5 title ([28b2609](https://github.com/betagouv/api-subventions-asso/commit/28b2609d0c6866cf6146b59bbdc53827200cc2c0))
- **front:** update signup conditions style ([e3b16a8](https://github.com/betagouv/api-subventions-asso/commit/e3b16a880624744079278f84095eef03ad402a8b))
- **front:** use EmptySvg component to handle svg import in jest ([2f375b4](https://github.com/betagouv/api-subventions-asso/commit/2f375b47a704b7a9dedc297ee7f404e596cb9627))

# [0.33.0](https://github.com/betagouv/api-subventions-asso/compare/v0.32.1...v0.33.0) (2023-07-24)

### Bug Fixes

- **front:** fix html semantic ([208fe7f](https://github.com/betagouv/api-subventions-asso/commit/208fe7f5b21862807cb41dc90067e68559ab04c6))

### Features

- **front:** add checkbox to display password ([f4ea6ab](https://github.com/betagouv/api-subventions-asso/commit/f4ea6abf6e5a6a4fcd4686c6809ef9862aa791b8))
- **front:** add ModalFooter component and update ConfirmDeleteModal ([2e3a24a](https://github.com/betagouv/api-subventions-asso/commit/2e3a24a36ab1d83c89d37de83d183801556c701f))
- **front:** generate default unique id in form inputs ([5534578](https://github.com/betagouv/api-subventions-asso/commit/5534578d8c2d1ab432dbd2f3179bf9a8865452ce))
- **front:** ignore static svg files ([9bff81d](https://github.com/betagouv/api-subventions-asso/commit/9bff81df41e5cbd3f0c7f8c9e85671f08c4f0f8e))
- **front:** increase margin top in signup and login ([8381a27](https://github.com/betagouv/api-subventions-asso/commit/8381a2708cb4c7cbe6bcc28effa7cd071c268224))
- **front:** install nanoid ([2465158](https://github.com/betagouv/api-subventions-asso/commit/2465158ef05cb3c016a3a459319fe6f19fd83b09))
- **front:** link to cgu ([f525855](https://github.com/betagouv/api-subventions-asso/commit/f5258553011e9b9121fc44fb0c9642b576a73c3f))
- **front:** remove h5 tag in legend ([87eade2](https://github.com/betagouv/api-subventions-asso/commit/87eade22cb999072553125e495cf7b309281c9b4))
- **front:** remove static svg ([d91d348](https://github.com/betagouv/api-subventions-asso/commit/d91d348faf8504325ed733ab06f8fea866a6d442))
- **front:** rework reset password view ([aa683f0](https://github.com/betagouv/api-subventions-asso/commit/aa683f0061221d53a68c4b3107cf7d06767b2c3a))
- **front:** style legend as h5 title ([28b2609](https://github.com/betagouv/api-subventions-asso/commit/28b2609d0c6866cf6146b59bbdc53827200cc2c0))
- **front:** update signup conditions style ([e3b16a8](https://github.com/betagouv/api-subventions-asso/commit/e3b16a880624744079278f84095eef03ad402a8b))
- **front:** use EmptySvg component to handle svg import in jest ([2f375b4](https://github.com/betagouv/api-subventions-asso/commit/2f375b47a704b7a9dedc297ee7f404e596cb9627))

## [0.32.4](https://github.com/betagouv/api-subventions-asso/compare/v0.32.3...v0.32.4) (2023-07-27)

### Bug Fixes

- **api:** csp allows calls to self from swagger ([749a5f6](https://github.com/betagouv/api-subventions-asso/commit/749a5f6943adf3806c71b6bf71862b058fa5c000))
- **api:** open-data show all fonjep even if same EJ ([0617a3d](https://github.com/betagouv/api-subventions-asso/commit/0617a3d2730321c1b205dd4286ac023539379025))

## [0.32.3](https://github.com/betagouv/api-subventions-asso/compare/v0.32.2...v0.32.3) (2023-07-26)

### Bug Fixes

- **front:** judgment may be null ([87221eb](https://github.com/betagouv/api-subventions-asso/commit/87221ebf1666b143972d8f4a81372e518e3adc9a))

## [0.32.2](https://github.com/betagouv/api-subventions-asso/compare/v0.32.1...v0.32.2) (2023-07-13)

### Bug Fixes

- **front:** add link to signup in login view ([528cfb1](https://github.com/betagouv/api-subventions-asso/commit/528cfb1a561c92909a86b0e264886a32ab7d478c))

## [0.31.5](https://github.com/betagouv/api-subventions-asso/compare/v0.32.0...v0.31.5) (2023-07-12)

### Bug Fixes

- **front:** change x frame option ([614bb9d](https://github.com/betagouv/api-subventions-asso/commit/614bb9dcaf7ae620a66bfe12753f9bdac5ec6eda))

## [0.32.1](https://github.com/betagouv/api-subventions-asso/compare/v0.32.0...v0.32.1) (2023-07-13)

### Bug Fixes

- fix v0.32 ([acdde25](https://github.com/betagouv/api-subventions-asso/commit/acdde252a0ec29382f7810e5fbaffbd00020e444))

## [0.31.4](https://github.com/betagouv/api-subventions-asso/compare/v0.31.3...v0.31.4) (2023-07-10)

### Bug Fixes

- **front:** add authorize for matomo script ([7560913](https://github.com/betagouv/api-subventions-asso/commit/7560913f7e348584d6a7280712a6582149007d78))

# [0.32.0](https://github.com/betagouv/api-subventions-asso/compare/v0.31.3...v0.32.0) (2023-07-11)

### Bug Fixes

- **api:** csp header back with specific for swagger ([0cb25f7](https://github.com/betagouv/api-subventions-asso/commit/0cb25f7b16e02e75873f9fbbf0c115e510c938ea))
- **api:** default value for names are null ([fd3de9d](https://github.com/betagouv/api-subventions-asso/commit/fd3de9ddae1aa8e3b9132275ea4fd657579491c0))
- **api:** disables also reset names ([d62c095](https://github.com/betagouv/api-subventions-asso/commit/d62c09594fd6c3bac9c5165c35add2157e188c33))
- **api:** realistic types ([c8bcf27](https://github.com/betagouv/api-subventions-asso/commit/c8bcf27f73230ad85d73cd681d784e95c3810d3f))
- **api:** review mistakes ([05a7aac](https://github.com/betagouv/api-subventions-asso/commit/05a7aac609faa9fe5e7d382264e811f591227d4d))
- **api:** signup forces roles ([9f81531](https://github.com/betagouv/api-subventions-asso/commit/9f81531f69b77330474520c951bb6ae2106a230a))
- **front:** add authorize for matomo script ([e8276ae](https://github.com/betagouv/api-subventions-asso/commit/e8276ae66d8af5d7b43cacc5d01694c54cbd9304))

### Features

- **api:** add endpoint for getting all user data ([488d0b2](https://github.com/betagouv/api-subventions-asso/commit/488d0b2db63b6c543c6469e63677209cd87d9519))
- **api:** add endpoint for getting all user data ([5780b3c](https://github.com/betagouv/api-subventions-asso/commit/5780b3c338fc901428e12a74fa8c9e698fb40e37))
- **api:** add notify service ([dbff346](https://github.com/betagouv/api-subventions-asso/commit/dbff346cc01ec0fe6a30999f84c4ee4a141fb124))
- **api:** add user activate notification ([a5889a0](https://github.com/betagouv/api-subventions-asso/commit/a5889a0a83c010cb42358aa5be5a5fa48a428e7c))
- **api:** add userActivated brevo notification ([f50c770](https://github.com/betagouv/api-subventions-asso/commit/f50c770bcbfd1a48f4bf55fc76e5dd008a8441b4))
- **api:** consider names ([3a30bb6](https://github.com/betagouv/api-subventions-asso/commit/3a30bb69eecee5392b7327e6c6f3ccec914faedf))
- **api:** mock userResetRepository at import stage ([6b21f3d](https://github.com/betagouv/api-subventions-asso/commit/6b21f3d8ddb833feaa6e3abaa8f29a65c3e64627))
- **api:** proper sanitization ([771de74](https://github.com/betagouv/api-subventions-asso/commit/771de74ed223eb0aa3e127c5299a54a2029deb89))
- **api:** remove await on notif trigger ([553c500](https://github.com/betagouv/api-subventions-asso/commit/553c50050968763182e2e3d650cd60ad71afbd0d))
- **api:** sanitizer string helper ([a7a3f65](https://github.com/betagouv/api-subventions-asso/commit/a7a3f651680b9eeebd89ab9a5afe5dec185c1eb2))
- **api:** update user last connection date in brevo after login ([c4260a7](https://github.com/betagouv/api-subventions-asso/commit/c4260a7faf4ad5dd8946632233d998024357cfa1))
- **front:** add input group to Input component ([2dcc62d](https://github.com/betagouv/api-subventions-asso/commit/2dcc62db4c43199664ac47b7a84bacbc595eccbd))
- **front:** add new signup page ([cb05cf2](https://github.com/betagouv/api-subventions-asso/commit/cb05cf2f02390680d5db7c3984dbdd6fac1d466f))
- **front:** add placeholder to input ([209010e](https://github.com/betagouv/api-subventions-asso/commit/209010eb49fcabbbe5b5bcc1ce39456fea090048))
- **front:** enable privacy policy link ([69bb72f](https://github.com/betagouv/api-subventions-asso/commit/69bb72f8b705c2f91586bba79f1db03c69533979))
- **front:** remove input group wrapper ([0a0bd42](https://github.com/betagouv/api-subventions-asso/commit/0a0bd42c4a94e9debd004175c82e22dc46deed6f))
- **front:** update nodemon config to not rebuild on test update ([f56a82d](https://github.com/betagouv/api-subventions-asso/commit/f56a82d4459fb3c98e0ced42aafedf563d423700))
- **front:** update signup with new API endpoint requirements ([aa82f49](https://github.com/betagouv/api-subventions-asso/commit/aa82f4915124234fa8eb087869dcf11fb4ba0314))

## [0.31.5](https://github.com/betagouv/api-subventions-asso/compare/v0.31.4...v0.31.5) (2023-07-12)

### Bug Fixes

- **front:** change x frame option ([614bb9d](https://github.com/betagouv/api-subventions-asso/commit/614bb9dcaf7ae620a66bfe12753f9bdac5ec6eda))

## [0.31.4](https://github.com/betagouv/api-subventions-asso/compare/v0.31.3...v0.31.4) (2023-07-10)

### Bug Fixes

- **front:** add authorize for matomo script ([7560913](https://github.com/betagouv/api-subventions-asso/commit/7560913f7e348584d6a7280712a6582149007d78))

## [0.31.3](https://github.com/betagouv/api-subventions-asso/compare/v0.31.2...v0.31.3) (2023-07-05)

### Bug Fixes

- **api:** hotfix csp header ([12d6353](https://github.com/betagouv/api-subventions-asso/commit/12d6353e8231097531f2a570115cf7f4af23571b))

## [0.31.2](https://github.com/betagouv/api-subventions-asso/compare/v0.31.1...v0.31.2) (2023-06-29)

### Bug Fixes

- **front:** manage documents for establischements ([fae5c65](https://github.com/betagouv/api-subventions-asso/commit/fae5c65032a1abca257f961079f0f34b116d2538))

## [0.31.1](https://github.com/betagouv/api-subventions-asso/compare/v0.31.0...v0.31.1) (2023-06-29)

### Bug Fixes

- **api:** check if response is string and if string containe error ([f8679ae](https://github.com/betagouv/api-subventions-asso/commit/f8679ae56a726f5250b59a51fcba939226be9dee))
- **front:** enhance promise naming in svelte file ([1aeafc2](https://github.com/betagouv/api-subventions-asso/commit/1aeafc252dad2fb2e5ddfcaa59424564d461fd88))
- **front:** wait for asso & estab to be download before rendering ([5f21200](https://github.com/betagouv/api-subventions-asso/commit/5f2120037f093850dbd42b41e35430ab4e600592))

# [0.31.0](https://github.com/betagouv/api-subventions-asso/compare/v0.30.2...v0.31.0) (2023-06-27)

### Bug Fixes

- **api:** api Asso toDate rejects falsy values ([274d07e](https://github.com/betagouv/api-subventions-asso/commit/274d07e8d8c7ebea79abe12e9304fbcafa4c92fd)), closes [#1430](https://github.com/betagouv/api-subventions-asso/issues/1430)
- **api:** apiAsso request rejects response with 200 and "error" message or without date ([b05f66f](https://github.com/betagouv/api-subventions-asso/commit/b05f66f5aa939bc61644e207b5ea46993255a820)), closes [#1432](https://github.com/betagouv/api-subventions-asso/issues/1432) [#1444](https://github.com/betagouv/api-subventions-asso/issues/1444)
- **api:** check if actual result ([8f97f76](https://github.com/betagouv/api-subventions-asso/commit/8f97f7699e3686794a2c3d7b2f7f59dae99368e1)), closes [#1429](https://github.com/betagouv/api-subventions-asso/issues/1429)
- **api:** dauphin document adapter ignores docs with errors ([dcd790a](https://github.com/betagouv/api-subventions-asso/commit/dcd790ad76a63fc4ab2323c5d7b2ff1375bfcc49)), closes [#1431](https://github.com/betagouv/api-subventions-asso/issues/1431)
- **api:** fix test after accepting git suggestion ([f7d9acd](https://github.com/betagouv/api-subventions-asso/commit/f7d9acd5e02d7bea896e7df5afdb7307483f9ff5))
- **front:** rename variable after git suggestion ([497f6e5](https://github.com/betagouv/api-subventions-asso/commit/497f6e595085c65341e53ed2b7ffef95c8e61476))
- **front:** use english variable name ([7a58cc8](https://github.com/betagouv/api-subventions-asso/commit/7a58cc86882131e261c588a162b78d45fb4fa315))

### Features

- **api,front:** 30 minutes cache header ([fd669c4](https://github.com/betagouv/api-subventions-asso/commit/fd669c416d41de4cc0d0f52b6ca14de8cfc5d662))
- **api,front:** header middleware ([112a12d](https://github.com/betagouv/api-subventions-asso/commit/112a12de7978ea1ba3e013aed47fbe7eb8f4f324))
- **api,front:** set header prevent sniffing ([9beae46](https://github.com/betagouv/api-subventions-asso/commit/9beae469842de8728555a3da4729b0a1dd66e2bd))
- **api,front:** set HSTS header force HTTPS ([92c64b4](https://github.com/betagouv/api-subventions-asso/commit/92c64b49fdabc712763825a231d6dbba7a8ebf9e))
- **api,front:** set XFO header prevent being in frame ([dc6966d](https://github.com/betagouv/api-subventions-asso/commit/dc6966db2d8daecd49e9156c15cef805bfc4a4cc))
- **api:** anonymize user instead of deleting it ([5b3d650](https://github.com/betagouv/api-subventions-asso/commit/5b3d65056e99c82eb01e78da5fccf810399fffdc))
- **api:** clean from review 2 ([2129c46](https://github.com/betagouv/api-subventions-asso/commit/2129c46aeb788ea1185064da147fbafd081133aa))
- **api:** cleaning from review ([72a9443](https://github.com/betagouv/api-subventions-asso/commit/72a944333fd7d0f777ad078559323e05736ee763))
- **api:** csp header ([574c21c](https://github.com/betagouv/api-subventions-asso/commit/574c21c92a9d48432115dba6aec85d203da68957))
- **api:** delete consumer token by userId and user reset token by userId ([5fb27f6](https://github.com/betagouv/api-subventions-asso/commit/5fb27f63efcdd057c250cdf67684e3c4b0b0dfcc))
- **api:** delete user's tokens at delete ([d8f958e](https://github.com/betagouv/api-subventions-asso/commit/d8f958e7c732e48ec176a551e8ff75e102b63285))
- **api:** etalab scdl csv parser ([c078909](https://github.com/betagouv/api-subventions-asso/commit/c078909627c566da9e51356a0ccb4ba62c1ff0cd))
- **api:** etalab scdl dbo ([e5c5047](https://github.com/betagouv/api-subventions-asso/commit/e5c50476cc73ed83f24f0ab1d7ea620750d8ead8))
- **api:** merge UserDisableDbo in UserDbo ([c76090b](https://github.com/betagouv/api-subventions-asso/commit/c76090b2504f071bc6567fd743d62f194b2e7c39))
- **api:** remove anonymise() and put code in disable() ([958926a](https://github.com/betagouv/api-subventions-asso/commit/958926a0020f9b07db565f82df3cc6581de82236))
- **api:** simpler scdl parser ([4850a09](https://github.com/betagouv/api-subventions-asso/commit/4850a09a074101db93924f607b5a936e96edb341))
- **api:** stats url in env var ([0b1af50](https://github.com/betagouv/api-subventions-asso/commit/0b1af506e956c65857c46cd8a0a80823beeab9bf))
- **api:** tries main deletion first ([aed71c3](https://github.com/betagouv/api-subventions-asso/commit/aed71c32d1a35c5fab7ba79f1a7223eb1ccc0343))
- **dto:** datagouv metadata dbo ([b36d329](https://github.com/betagouv/api-subventions-asso/commit/b36d3293791fe69d06386955cc90e22de5e8eec3))
- **dto:** etalab scdl dto ([0a01110](https://github.com/betagouv/api-subventions-asso/commit/0a0111066de4fdfe97f58226569dc7ef69f0be26))
- **front:** add delete user method and call it from Profile view ([bfb4ad3](https://github.com/betagouv/api-subventions-asso/commit/bfb4ad366257abf1f1a4b056c6f9502248a50ab7))
- **front:** add deleteUser and logout action ([42594b1](https://github.com/betagouv/api-subventions-asso/commit/42594b14fc210433d927d5a0b868670c715335bf))
- **front:** csp header ([671a301](https://github.com/betagouv/api-subventions-asso/commit/671a3019945ecd298b81386b743968e61a2af7c9))
- **front:** disable Alert when retry user deletion ([aff35d0](https://github.com/betagouv/api-subventions-asso/commit/aff35d06e22ba871246900fe0b8b64239f8b6b8a))
- **front:** init Profile view ([5b27827](https://github.com/betagouv/api-subventions-asso/commit/5b27827da8b4b14da1ec24115c0614fdb2461775))
- **front:** redirect stats to blog stats page ([63f5b32](https://github.com/betagouv/api-subventions-asso/commit/63f5b32ae5c68c1882ef11bbb4d15bd6b37c9ec8))
- **front:** remove double logout ([f2d7338](https://github.com/betagouv/api-subventions-asso/commit/f2d7338d098706764d1f524befb51d628d0d7cbd))
- **front:** renaming and cleaing from review ([cf5a287](https://github.com/betagouv/api-subventions-asso/commit/cf5a28796e4a00cf0cf1018515507018a5d8803f))
- **front:** replace logout with profile button ([0249289](https://github.com/betagouv/api-subventions-asso/commit/0249289f1c4290a6e4adcb69d65bd1cc0b9ac07c))

## [0.30.2](https://github.com/betagouv/api-subventions-asso/compare/v0.30.1...v0.30.2) (2023-06-15)

### Features

- **api:** french open-data grant routes' names ([8107086](https://github.com/betagouv/api-subventions-asso/commit/81070863672af28c3fd50f246b2ae22c685c241b))
- **api:** french open-data provider route ([965df97](https://github.com/betagouv/api-subventions-asso/commit/965df9751ffcbdacf55b3d6cf9db9dab0ea1eff5))
- **api:** french open-data rna-siren route arg name ([25d2bfe](https://github.com/betagouv/api-subventions-asso/commit/25d2bfef1b5fba110f598a363bca62ed31a208c6))

## [0.30.1](https://github.com/betagouv/api-subventions-asso/compare/v0.30.0...v0.30.1) (2023-06-15)

### Bug Fixes

- **api:** actually use publishable param for open data ([89f3b37](https://github.com/betagouv/api-subventions-asso/commit/89f3b375ef6b8bd11ff4004a98abfd82770dd81f))
- **api:** improve error message ([2b3e886](https://github.com/betagouv/api-subventions-asso/commit/2b3e886a9a38c2850bfb6a77c9c4b346b4cc4828))
- **api:** include admin on list users ([3f2529d](https://github.com/betagouv/api-subventions-asso/commit/3f2529dd6a13cb80675eb1c9ecd9e4f351c15aca))
- **api:** keep payments ([b041d48](https://github.com/betagouv/api-subventions-asso/commit/b041d4832090f13583c4708693be2e3d28d38369))
- **api:** user libelle for dauphin document if document has no name ([8c04f58](https://github.com/betagouv/api-subventions-asso/commit/8c04f5800fcc8c2893f5b0005f73b341d4febb83))
- **front:** change management of etabllishment getting data ([c5f599b](https://github.com/betagouv/api-subventions-asso/commit/c5f599b85ef240abe1a7e74a106e4bc65da49128))

### Features

- **api:** filter only assos before getting grants ([629a92d](https://github.com/betagouv/api-subventions-asso/commit/629a92dce168c4b7dd81e52a35ccea20ded5136d))
- **api:** method to check is siren is from asso ([817d389](https://github.com/betagouv/api-subventions-asso/commit/817d38906fb625ad2cf72376a0916076bdb78e09))
- **api:** publishable open data filter only granted grants ([5336ec5](https://github.com/betagouv/api-subventions-asso/commit/5336ec512e4fa5491cad19e655dce7bb47cf1012))

# [0.30.0](https://github.com/betagouv/api-subventions-asso/compare/v0.29.1...v0.30.0) (2023-06-08)

### Bug Fixes

- **api:** set default query ([749f093](https://github.com/betagouv/api-subventions-asso/commit/749f0930393e5885e45a686dfd7a2dce150ef773)), closes [#1227](https://github.com/betagouv/api-subventions-asso/issues/1227)
- **front:** help to download dauphin document ([84cf125](https://github.com/betagouv/api-subventions-asso/commit/84cf1250f22cf94e856474f6019f9bffee31eda9))
- **front:** lint error ([9641e48](https://github.com/betagouv/api-subventions-asso/commit/9641e4873a7e6ea51f8c5ab8efbf202c8662ba76))
- **front:** send query even if empty ([7232c8d](https://github.com/betagouv/api-subventions-asso/commit/7232c8df0960bc9e25bc54dff9cfaf804637421e))

### Features

- **api, dto:** update login error message ([4048e43](https://github.com/betagouv/api-subventions-asso/commit/4048e430fa387694183c918826948639f91655a6))
- **api:** add common dto schemas démarches simplifiées ([d7e82df](https://github.com/betagouv/api-subventions-asso/commit/d7e82dfd772799785986e2b4918c208d2443f977))
- **api:** add migration to create unique-association-visits-by-day ([e419325](https://github.com/betagouv/api-subventions-asso/commit/e4193250f59efae2df5abae7f67cea40c2462c6d))
- **api:** add optional id in provider's type ([b2ce3ad](https://github.com/betagouv/api-subventions-asso/commit/b2ce3ad0c17e029475cdf5a7670ad2f4dd2d2339))
- **api:** add unique index on identifier ([dacd994](https://github.com/betagouv/api-subventions-asso/commit/dacd994837cdf996304d5a679408f2627c015062))
- **api:** caisse depots adapter for common dto ([47ac185](https://github.com/betagouv/api-subventions-asso/commit/47ac18502aee36d423dbc0eb0c51d7722830e177))
- **api:** caisse depots service for common dto ([7e5ade0](https://github.com/betagouv/api-subventions-asso/commit/7e5ade01d81f760d251df48e93da6a0b0bf4a5d4))
- **api:** chorus adapter to grant common dto ([0f028e7](https://github.com/betagouv/api-subventions-asso/commit/0f028e7894b92776c058c6929e6f893d6bb4c742))
- **api:** chorus service method to adapt to common dto ([ebdc9e9](https://github.com/betagouv/api-subventions-asso/commit/ebdc9e948244a089da37a0c81213cb75554c1eed))
- **api:** common dto grant service ([3b885ec](https://github.com/betagouv/api-subventions-asso/commit/3b885ec95f0082ffc3d19be4dd137b2346a05f48))
- **api:** cron controller logs to sentry ([9055526](https://github.com/betagouv/api-subventions-asso/commit/9055526b47794329ad5791e85231b549c7795b84))
- **api:** dauphin service calls adapter to common ([5f5f0fd](https://github.com/betagouv/api-subventions-asso/commit/5f5f0fd4d462b7aaf33b10fbb7c749e93263d23d))
- **api:** dauphin toCommon adapter ([78b5e89](https://github.com/betagouv/api-subventions-asso/commit/78b5e8969fd178480faca9380d5d4bf935205cbd))
- **api:** demarches simplifiees common adapter ([cfeaf28](https://github.com/betagouv/api-subventions-asso/commit/cfeaf2874675a859a397ec27616d3679cd88eee5))
- **api:** flaten result and test migration ([c0fbb97](https://github.com/betagouv/api-subventions-asso/commit/c0fbb975c338dec41330a4f13bbd0ace94278832))
- **api:** fonjep join by year also to not have duplicate ([d125eb6](https://github.com/betagouv/api-subventions-asso/commit/d125eb6e7381a835d22005206a9a7199ef5f9838))
- **api:** general grantService.getGrants method ([46ca5c5](https://github.com/betagouv/api-subventions-asso/commit/46ca5c583c353c3a3aba074f596266ac65660c40))
- **api:** grantService function to get commonGrant format ([97ff60a](https://github.com/betagouv/api-subventions-asso/commit/97ff60a65a081cfa72f206d08f5683c3bbffde09))
- **api:** no sentry in dev environment ([337650c](https://github.com/betagouv/api-subventions-asso/commit/337650cc68a2702482c723dca97d85d463555898))
- **api:** open data grant routes ([9c6710b](https://github.com/betagouv/api-subventions-asso/commit/9c6710bc02816d6fc3dd8ddbb72077ae3af43ce3))
- **api:** osiris adapter to common dto ([54d8d8d](https://github.com/betagouv/api-subventions-asso/commit/54d8d8d5afa9f107e61a20a09d57d78fa0515790))
- **api:** osiris service method to adapt to common dto ([1164266](https://github.com/betagouv/api-subventions-asso/commit/1164266a618cea790e867d68862e00a7bafbd713))
- **api:** payment common dto includes exercice ([7183de0](https://github.com/betagouv/api-subventions-asso/commit/7183de0680b147a4112b2d58f5c54171960b3141))
- **api:** raw grant provider demarches simplifiees ([8b6b497](https://github.com/betagouv/api-subventions-asso/commit/8b6b497190321e598283f2ab22b30dec88a99483))
- **api:** route to delete one's own account ([6b9c9cb](https://github.com/betagouv/api-subventions-asso/commit/6b9c9cbfffb0701d3c7c7b8b63e5efea6566ad1b)), closes [#1346](https://github.com/betagouv/api-subventions-asso/issues/1346)
- **api:** sentry logs catched errors ([cea0787](https://github.com/betagouv/api-subventions-asso/commit/cea07877a2f020fb976e34610528027ddfaa7986))
- **api:** tweak module's name to put open-data routes on top of the swagger ([47ba574](https://github.com/betagouv/api-subventions-asso/commit/47ba574f9dcc0abb19f78961b2f6d140823de8d3)), closes [#1350](https://github.com/betagouv/api-subventions-asso/issues/1350)
- **front,api:** merge association services and establishment services ([5a4e933](https://github.com/betagouv/api-subventions-asso/commit/5a4e9334f9158752d33c9d6d9b0b7c2c68aace5b))
- **front:** add AssociationController tests ([7437a38](https://github.com/betagouv/api-subventions-asso/commit/7437a383385c555926e4c8b0ceb26314df8fb8d9))
- **front:** add store alise in eslint config ([b87a99f](https://github.com/betagouv/api-subventions-asso/commit/b87a99fddc4649c9c82202a8344279a432cf9f62))
- **front:** apply stash and updates ([7747943](https://github.com/betagouv/api-subventions-asso/commit/7747943c4ab1ba1dd7b2c2b26f6edae045d8f3ed))
- **front:** bodacc definition update ([3cf429e](https://github.com/betagouv/api-subventions-asso/commit/3cf429ea3233b3ac1083973a947ab804b830fa32)), closes [#1342](https://github.com/betagouv/api-subventions-asso/issues/1342)
- **front:** component establishmentCard ([0fc839a](https://github.com/betagouv/api-subventions-asso/commit/0fc839a41dd2840811dd5748629d513aef62bd34))
- **front:** dsfr badge and badgeGroup svelte component ([216ecd2](https://github.com/betagouv/api-subventions-asso/commit/216ecd29b9da4e9998ab90584b501bf091051cdc))
- **front:** dsfr card component has slot for card-start ([92d41c8](https://github.com/betagouv/api-subventions-asso/commit/92d41c8ca851956480c4350ab520f54ae65fec14))
- **front:** establishment preview state not about open/closed ([313125a](https://github.com/betagouv/api-subventions-asso/commit/313125abbb042335034fc8b741ce2b7b0b059e3f))
- **front:** make router query optionnal ([a405d91](https://github.com/betagouv/api-subventions-asso/commit/a405d9141b8477103b94fa6ccea436adabfe0952))
- **front:** merge association services and establishment services ([4899fed](https://github.com/betagouv/api-subventions-asso/commit/4899feddecf3f6cf62436b321c1dba34ac1da3eb))
- **front:** payment's bop is multi-modal if multiple bops to aggregate ([cb1a4a2](https://github.com/betagouv/api-subventions-asso/commit/cb1a4a2d4ae6f3880c6158c52a16ad2a0b85c0f4))
- **front:** rename flaten to flatten and fix tests ([3f1d75a](https://github.com/betagouv/api-subventions-asso/commit/3f1d75a8334facf0bd7e994da120ebd7560306e1))
- **front:** shop bop in payment details modal ([aa79337](https://github.com/betagouv/api-subventions-asso/commit/aa79337a825f2f9d6b3c90c95c16b6a34ce25d76))
- **front:** use new component establishment card ([3b00a72](https://github.com/betagouv/api-subventions-asso/commit/3b00a725fa707635f834fd5e7f5a7156371e0b80))
- homogenizes lint config ([90b43d1](https://github.com/betagouv/api-subventions-asso/commit/90b43d177873b3ad76c7c1da276340b82521c8f2))

## [0.29.1](https://github.com/betagouv/api-subventions-asso/compare/v0.29.0...v0.29.1) (2023-05-31)

### Bug Fixes

- **api:** actually use proper internal id ([1a519de](https://github.com/betagouv/api-subventions-asso/commit/1a519def1ecf0b220105977a33898c2e4b0aaca7))

# [0.29.0](https://github.com/betagouv/api-subventions-asso/compare/v0.28.2...v0.29.0) (2023-05-26)

### Bug Fixes

- **api:** don't try to insert empty batches ([3011bad](https://github.com/betagouv/api-subventions-asso/commit/3011bad26c31945b80637612a6807a1cb5e6e1f9))
- **api:** fix mongodb request ([e14b870](https://github.com/betagouv/api-subventions-asso/commit/e14b870cce2337759d64f240660e13bf94659e81))
- **api:** stats.spec tests ([8d22ce7](https://github.com/betagouv/api-subventions-asso/commit/8d22ce76877719eecda1c1ed8969a866cc029adf))
- **api:** workaround tsoa typing error ([1f0c492](https://github.com/betagouv/api-subventions-asso/commit/1f0c492a1ca9da679f975e20f24db14cda737aa3))
- run lerna lint sequentially to not loose work ([4900572](https://github.com/betagouv/api-subventions-asso/commit/4900572d5fa3839812a1597afc49a61658f8d39f))

### Features

- **api:** caisse des dépôts raw grant provider ([389551e](https://github.com/betagouv/api-subventions-asso/commit/389551e758b0d7e7698564ec7308f45dd0cba911))
- **api:** chorus raw grant provider ([bd1c22c](https://github.com/betagouv/api-subventions-asso/commit/bd1c22c9cac1168e4bd9a4a01ab4046d5c53eae2))
- **api:** dauphin adapter to document ([7e37883](https://github.com/betagouv/api-subventions-asso/commit/7e378837fa4fd14578959717137c5a2220475e79))
- **api:** dauphin document dto ([2e6c79b](https://github.com/betagouv/api-subventions-asso/commit/2e6c79b7433c9876bb2fea77a08656c8bb431771))
- **api:** dauphin raw grant provider ([a8b2fad](https://github.com/betagouv/api-subventions-asso/commit/a8b2fad5f593670a94313115d50e94ba8a04d80f))
- **api:** dauphin service implements document provider interface ([31b02f4](https://github.com/betagouv/api-subventions-asso/commit/31b02f4942a3dd2bca71531f297a608ac29249e6))
- **api:** fonjep joiner to build raw format ([c2ac2d4](https://github.com/betagouv/api-subventions-asso/commit/c2ac2d458e9837f5a612e79a45ac3760fbde1e5a))
- **api:** generic grant service and its types ([5a31e3c](https://github.com/betagouv/api-subventions-asso/commit/5a31e3cf9fc5ce48537fabdea8b227d69593860f))
- **api:** get dauphin document stream ([0c88700](https://github.com/betagouv/api-subventions-asso/commit/0c887006a59c7428f56df199be9ccf0c0fb8d205))
- **api:** http route to raw grant format ([544d8db](https://github.com/betagouv/api-subventions-asso/commit/544d8dbd16e2d483f6bc0ad7eff773d64154dc10))
- **api:** more general joinedGrants ([6a16d77](https://github.com/betagouv/api-subventions-asso/commit/6a16d77f19e433cbe99fbf75e5950a2166531f99))
- **api:** osiris raw grant provider ([962976e](https://github.com/betagouv/api-subventions-asso/commit/962976eb012a0fc345cf68a4498919c363bc237c))
- **api:** remove admins from stats computing ([f7ac26c](https://github.com/betagouv/api-subventions-asso/commit/f7ac26cfb76587cdc85208980cf05cac5819ad09))
- **api:** remove links from BodaccDto ([c7a76fc](https://github.com/betagouv/api-subventions-asso/commit/c7a76fc9da040d105b2d52cce1d763d2bb7283c0))
- **api:** remove old method countUsersByRequestNbOnPeriod ([518a12c](https://github.com/betagouv/api-subventions-asso/commit/518a12c187c7038d2cf70371804b794faaacd979))
- **api:** rename route ([c35ee99](https://github.com/betagouv/api-subventions-asso/commit/c35ee99372136417d59cd0a10f6017d6846416fc))
- **api:** use associationVisits in stats/requests ([242bb9b](https://github.com/betagouv/api-subventions-asso/commit/242bb9b32b13b199ef33b1aefbb6f37a3fdd8035))
- **api:** use homogenized system for provider id in raw grant service ([bb84c8c](https://github.com/betagouv/api-subventions-asso/commit/bb84c8c0a20149fea4d53c47c1bd1b82f34c9b19))
- **front:** card has onClick prop ([f07d15c](https://github.com/betagouv/api-subventions-asso/commit/f07d15c1b33a1feb7f84718188c8a12637455628))
- **front:** document card now handles stream download from api ([9f6f05c](https://github.com/betagouv/api-subventions-asso/commit/9f6f05c18eb73ead9d4cbf3010aa83e87272bbf0))
- **front:** document service can get dauphin doc from api ([9490dd0](https://github.com/betagouv/api-subventions-asso/commit/9490dd0c5269875f33368a941b5ce627737882c2))

### Performance Improvements

- **front:** revoke object url ([08c7cef](https://github.com/betagouv/api-subventions-asso/commit/08c7cef639978aa931f03569b278e6cfe6a0edd8))

## [0.26.3](https://github.com/betagouv/api-subventions-asso/compare/v0.27.0...v0.26.3) (2023-05-04)

## [0.28.2](https://github.com/betagouv/api-subventions-asso/compare/v0.28.1...v0.28.2) (2023-05-17)

### Bug Fixes

- **api:** 1334 use current budget in dauphin adapter ([dd2249d](https://github.com/betagouv/api-subventions-asso/commit/dd2249d1b164508c364dd574dc6bb09e3556ca4f))

## [0.28.1](https://github.com/betagouv/api-subventions-asso/compare/v0.28.0...v0.28.1) (2023-05-16)

### Bug Fixes

- **api:** handle null applicant ([136f27b](https://github.com/betagouv/api-subventions-asso/commit/136f27b28a622279dae705d8a5380b9621195067))

# [0.28.0](https://github.com/betagouv/api-subventions-asso/compare/v0.27.0...v0.28.0) (2023-05-15)

### Bug Fixes

- **api:** change api call ([efab260](https://github.com/betagouv/api-subventions-asso/commit/efab2608bc594d5469c5289bdfa4354b785beae6))
- **api:** handle null result is démarches-simplifiées ([be3ac4a](https://github.com/betagouv/api-subventions-asso/commit/be3ac4a85cef2fd101133dc1e245b63463c378ac))
- **api:** remove unused import ([b67aa10](https://github.com/betagouv/api-subventions-asso/commit/b67aa1028522a169d5a10a8d01335a38c2c0bd96))
- **api:** update RepositoryHelper test ([07ba01c](https://github.com/betagouv/api-subventions-asso/commit/07ba01cad70e6cbd139e4e9a28eeb1bd71fd650b))
- **front:** bodacc when no data ([a3a31b0](https://github.com/betagouv/api-subventions-asso/commit/a3a31b051cdf06120574353368e52731b5adf8d8))

### Features

- **api, dto:** add /stats/user/requests route ([4dc4c61](https://github.com/betagouv/api-subventions-asso/commit/4dc4c618041e38ded95496cdb3656647e551bcbd))
- **api, dto:** create user stats from associationVisits collection ([78d9940](https://github.com/betagouv/api-subventions-asso/commit/78d99400125f638f7d3e60593e61f0b7894812f1))
- **api, dto:** remove old way to compute user.stats property ([a6d9a18](https://github.com/betagouv/api-subventions-asso/commit/a6d9a18046f0bfb86783662bad0241039ae503e8))
- **api, dto:** remove stats/users/requests route ([989bd1a](https://github.com/betagouv/api-subventions-asso/commit/989bd1a8f2e2fc72c5a21044869df30a369635cc))
- **api:** add and fix tests ([7033af9](https://github.com/betagouv/api-subventions-asso/commit/7033af9b55b492eab5d9ccb674454f15d32ce673))
- **api:** add database management ([a4a18c1](https://github.com/betagouv/api-subventions-asso/commit/a4a18c1b7732dbc454bee65b3474740b1b1c7485))
- **api:** add database management ([20becc3](https://github.com/betagouv/api-subventions-asso/commit/20becc3165c61e80a625bb7f48eacd26d10e4f1b))
- **api:** add migration dauphin to dauphin gispro ([ea8a2c5](https://github.com/betagouv/api-subventions-asso/commit/ea8a2c567ccc2ea468e6bbb725f2f259628753c1))
- **api:** add migration to remove persisted user.stats ([d8d2622](https://github.com/betagouv/api-subventions-asso/commit/d8d2622e06e8ab334c4ed388ad0f155ca1dc7d04))
- **api:** add unit test on fonjepService.applyTemporyCollection ([f15448c](https://github.com/betagouv/api-subventions-asso/commit/f15448cd500634f0adf8bd22955cbd55e46d7803))
- **api:** make generic type extends mongo Document ([e756287](https://github.com/betagouv/api-subventions-asso/commit/e7562875cbeb20133fb3194647bdfa4fff7b2f37))
- **api:** remove duplicate method and add integ test ([39439a6](https://github.com/betagouv/api-subventions-asso/commit/39439a6b2975511ba7d92f05115959f5b8b59b22))
- **api:** remove users secrets ([6bf5367](https://github.com/betagouv/api-subventions-asso/commit/6bf53672a4048eed557b2b9b02ffadd7cfa61a26))
- **api:** rename publication to publicationFile ([47ed5a7](https://github.com/betagouv/api-subventions-asso/commit/47ed5a737eee7098ac9f076dcc80beab5bc2a44e))
- **api:** revert change ([41b0dcc](https://github.com/betagouv/api-subventions-asso/commit/41b0dcc64914b0865a989501b5dfae5589162550))
- **api:** update getMedianVisitsOnPeriod comment on median computing ([6d5040f](https://github.com/betagouv/api-subventions-asso/commit/6d5040f4a95a135f4aab82aa917d9e0a65a744b3))
- **api:** update stats integ test with new method name ([85c6eb5](https://github.com/betagouv/api-subventions-asso/commit/85c6eb5aca73ee3cad2d61a76a75b44857a2ca60))
- **api:** use controller in Announcement view ([8750199](https://github.com/betagouv/api-subventions-asso/commit/875019923f265fd6ca5f897469444e0592a70107))
- **api:** use service instead of repository in helper ([e20e324](https://github.com/betagouv/api-subventions-asso/commit/e20e324dd5e28d138abe65eba6aeb0387e9d9e91))
- **api:** use statsAssociationVisit in isUserActif ([d8a6c44](https://github.com/betagouv/api-subventions-asso/commit/d8a6c44af3876805c379aea75ee7224e65d28140))
- **api:** use visits for compute the stats ([d5aabb7](https://github.com/betagouv/api-subventions-asso/commit/d5aabb732300d77b4eb868cf54385fb251bd9142))
- **front:** add bodacc tab ([71550aa](https://github.com/betagouv/api-subventions-asso/commit/71550aaeac79b7b073234075dc35be3a2fa209c9))
- **front:** add console.error in flatenProviderValue ([5e6268b](https://github.com/betagouv/api-subventions-asso/commit/5e6268b57439a5957734305febeacb973f5f6760))
- **front:** add tests ([5e4f50d](https://github.com/betagouv/api-subventions-asso/commit/5e4f50ddbe0e8d1367dc34a33392057f9f6a02db))
- **front:** apply fr-text--bold to <b> tag ([17511fe](https://github.com/betagouv/api-subventions-asso/commit/17511fef381b74f6707271e8a89d7f84a84bc846))
- **front:** fix judgment getter test ([1083f77](https://github.com/betagouv/api-subventions-asso/commit/1083f77b59a171afff9b4763767dd68c242deeec))
- **front:** move announcement id split in method and add comment ([bea678a](https://github.com/betagouv/api-subventions-asso/commit/bea678a7ea8fcf643c6d33b89a0f0040d11b9e88))
- **front:** rename test ([5083aa7](https://github.com/betagouv/api-subventions-asso/commit/5083aa769880b7c956f70c8c917f6710eccd3dad))
- **front:** update callout comment on titleSize ([981667a](https://github.com/betagouv/api-subventions-asso/commit/981667a8253abb4ca67c6e289a1337d5aacc980f))
- **front:** use svelte:element in Callout ([f21e4ff](https://github.com/betagouv/api-subventions-asso/commit/f21e4ffbdf4f3beb180f01c95ce37e4236bf673e))
- **front:** wording ([2cb31e8](https://github.com/betagouv/api-subventions-asso/commit/2cb31e8f6a92eff81f5550e1ac6a65924b516f9a))
- **tool:** manage error on osiris extraction ([6f49ac2](https://github.com/betagouv/api-subventions-asso/commit/6f49ac2f391ccd388ab8601e707ed10c5f5fb26a))
- **tools:** add save current-posibilities ([e657f36](https://github.com/betagouv/api-subventions-asso/commit/e657f36c38ac09b4c2881e69b6cb5141e753b386))
- **tools:** better error management ([59f9ed8](https://github.com/betagouv/api-subventions-asso/commit/59f9ed824beacecfda2eec9b990dc674926b86b3))

# [0.27.0](https://github.com/betagouv/api-subventions-asso/compare/v0.26.2...v0.27.0) (2023-05-03)

### Bug Fixes

- **api:** catch error from establishment provider ([88cfe67](https://github.com/betagouv/api-subventions-asso/commit/88cfe6795e4be2f77862cfdc8e03a4a1f655b5d5))
- **api:** change dauphin service instructor ([b699bc4](https://github.com/betagouv/api-subventions-asso/commit/b699bc4e55092d97b1c5c9153891ba3f0968d184))
- **api:** undefined-safety when apiAsso structure is incomplete ([abfe22a](https://github.com/betagouv/api-subventions-asso/commit/abfe22ac1fca80974a44188e11b3211391969ce7))
- **front:** stabilizes trim when required length is too short ([0e0b99b](https://github.com/betagouv/api-subventions-asso/commit/0e0b99bfbd919b2829efc8facb0219fb5ddcaeb3))

### Features

- **api:** add establishment document rib route ([17ba547](https://github.com/betagouv/api-subventions-asso/commit/17ba547cf30a4adb763fbf127a0c8939df972856))
- **api:** add sort desc on date in query ([0d91899](https://github.com/betagouv/api-subventions-asso/commit/0d91899e218879ca6ceddac2d4fee1bcefbe79da))
- **api:** clean from review ([a562570](https://github.com/betagouv/api-subventions-asso/commit/a562570410c11d668de7b46ffd93c3921e05497a))
- **api:** create dauphin cron ([eb10896](https://github.com/betagouv/api-subventions-asso/commit/eb10896c0df3d107e4e255b63627359e7544a278))
- **api:** fetch and save dauphin data from date ([382cad7](https://github.com/betagouv/api-subventions-asso/commit/382cad70b710de476df005b3071c451eb1628595))
- **api:** make clear that dauphin cli is for test only ([4601a74](https://github.com/betagouv/api-subventions-asso/commit/4601a74a4887522ce1a1143ea6e8a38a4152e277))
- **api:** merge dauphin methods ([8196a6d](https://github.com/betagouv/api-subventions-asso/commit/8196a6d2d566dc0295f66f60efaab79fdb69a3ed))
- **api:** minor updates from review ([f00054c](https://github.com/betagouv/api-subventions-asso/commit/f00054c03eb595db5e7acf1ed00f11f2ebcda9d6))
- **api:** remove debug console log ([0fd30a1](https://github.com/betagouv/api-subventions-asso/commit/0fd30a12ecf59273ad67b1bf326e48d63b649456))
- **api:** rename cli test command ([b9a7ec8](https://github.com/betagouv/api-subventions-asso/commit/b9a7ec85798296655ee37c5355e5491469e06434))
- **api:** test formatAndReturnDto ([d6d5620](https://github.com/betagouv/api-subventions-asso/commit/d6d5620d6894505ff25c326072b6d5172d7c8327))
- **api:** update cache from last import date ([15d7bf0](https://github.com/betagouv/api-subventions-asso/commit/15d7bf0ee99ef8a4f0be87b830b5983909015950))
- **api:** update cron logs ([85cca70](https://github.com/betagouv/api-subventions-asso/commit/85cca702f72b79a62d55ecf986f64700e786aec5))
- **api:** use batch of data in import process ([dccea4a](https://github.com/betagouv/api-subventions-asso/commit/dccea4a3cf9bc721f7c3bb086a6339323b4a54ef))
- **dto:** common grant dto ([1c77f65](https://github.com/betagouv/api-subventions-asso/commit/1c77f654ec0e09ab69b67dca594e07942744a4ab))
- **front:** hide subv percentage (potentially inaccurate) ([6e8fb3b](https://github.com/betagouv/api-subventions-asso/commit/6e8fb3bc4157f662bb0ecfbe5ec36448c02c4bb7))
- **front:** return to intended url after login ([90e8c9a](https://github.com/betagouv/api-subventions-asso/commit/90e8c9ad96802dbb1df0e2b399645f2a2440d0a4))
- **front:** wording no data in table ([9fa4846](https://github.com/betagouv/api-subventions-asso/commit/9fa48461af129ce99ecd37a3531f89b0d6936242))

## [0.26.3](https://github.com/betagouv/api-subventions-asso/compare/v0.26.2...v0.26.3) (2023-05-04)

### Bug Fixes

- **api:** change api call ([efab260](https://github.com/betagouv/api-subventions-asso/commit/efab2608bc594d5469c5289bdfa4354b785beae6))
- **api:** change dauphin service instructor ([b699bc4](https://github.com/betagouv/api-subventions-asso/commit/b699bc4e55092d97b1c5c9153891ba3f0968d184))

## [0.26.2](https://github.com/betagouv/api-subventions-asso/compare/v0.26.1...v0.26.2) (2023-04-19)

### Bug Fixes

- **front:** handle errors without status ([a847020](https://github.com/betagouv/api-subventions-asso/commit/a847020742d145e908ec06c44e9feb813578e620))
- **front:** reload status badge ([1469c16](https://github.com/betagouv/api-subventions-asso/commit/1469c16cf8849e7d3109e09bee7f9557dc2f26f4))

### Features

- **api:** add two ds schemas ([119df79](https://github.com/betagouv/api-subventions-asso/commit/119df79ad3b991671e15aac9e34ce6eebe0fcb6e))
- **front:** add establishment siret to application table ([559272f](https://github.com/betagouv/api-subventions-asso/commit/559272f79d5a8c88382a9124da07ca44eb72fad4))

## [0.26.1](https://github.com/betagouv/api-subventions-asso/compare/v0.26.0...v0.26.1) (2023-04-18)

### Bug Fixes

- **api:** create manual migration ([5530912](https://github.com/betagouv/api-subventions-asso/commit/55309125236c339c602cf6d0f8669d9567f54cde))

# [0.26.0](https://github.com/betagouv/api-subventions-asso/compare/v0.25.1...v0.26.0) (2023-04-17)

### Bug Fixes

- **front:** disable auth on 404 page ([2627934](https://github.com/betagouv/api-subventions-asso/commit/2627934ce78e67378cc60238c11f6e2854affca6))
- **front:** display hyphen in total amount when no versements ([5aaf0fe](https://github.com/betagouv/api-subventions-asso/commit/5aaf0fea866ae4d48349f7e8b311f4b864fe6f10))
- **front:** remove all spaces not only the first one ([b0199b2](https://github.com/betagouv/api-subventions-asso/commit/b0199b2af47e6a225a1bd60b035922ee5e985bc2))

### Features

- **api:** add dependency to cron ([4ab0a07](https://github.com/betagouv/api-subventions-asso/commit/4ab0a079b84924f26cda21e7a79ae379004ef943))
- **api:** add ej and versementkey on dauphin dto ([e1c8f80](https://github.com/betagouv/api-subventions-asso/commit/e1c8f80be8fd8abd89ef58991d4846c9ad1f3f70))
- **api:** add gispro data one dauhpin data ([90a95b7](https://github.com/betagouv/api-subventions-asso/commit/90a95b715cb712dec661e32f29df1364b9696437))
- **api:** cron architecture ([18f37f0](https://github.com/betagouv/api-subventions-asso/commit/18f37f0792328df561741b2d9845a42e19fd0ac9))
- **api:** cron for demarches simplifiees ([0386e4b](https://github.com/betagouv/api-subventions-asso/commit/0386e4b57923edac0d3108d765183f713a2a952e))
- **api:** example cron controller ([449e9ed](https://github.com/betagouv/api-subventions-asso/commit/449e9ed2962d250740be4bfab0e4494c7d00b083))
- **api:** log cron tasks ([f4f132e](https://github.com/betagouv/api-subventions-asso/commit/f4f132ecf1f27fba37a61e60248025c53b1b0fbf))
- **api:** new cron scheduler example ([1f89eaa](https://github.com/betagouv/api-subventions-asso/commit/1f89eaa7033385bdbeeacb0012597967435e13a8))
- **api:** new cron scheduler format ([6b4f0f2](https://github.com/betagouv/api-subventions-asso/commit/6b4f0f2a255b2727e0ac2a9529c995f27b9edd12))
- **api:** user not found in login should be 401 ([c359738](https://github.com/betagouv/api-subventions-asso/commit/c359738f99d6e7580b2a69f5f401564b5d3c34aa))
- **front:** display bop in application table ([b519afc](https://github.com/betagouv/api-subventions-asso/commit/b519afc231c925ccb8ee8ab90baf571d81342692))
- **front:** hide extract csv button if no data ([2bc3679](https://github.com/betagouv/api-subventions-asso/commit/2bc3679e819f19bd7bc9147298ba00778864271b))
- **front:** use service/port architecture and proper error management ([10b9881](https://github.com/betagouv/api-subventions-asso/commit/10b9881ebbc39f0ab1cec4a4601079071d130f52))

## [0.25.1](https://github.com/betagouv/api-subventions-asso/compare/v0.24.10...v0.25.1) (2023-04-17)

### Bug Fixes

- **api:** change provider name of rib documents ([395ff4d](https://github.com/betagouv/api-subventions-asso/commit/395ff4d1a14d9f4b06bdfe57dda674549aba9ff1))
- **api:** delete consumer if could not create token ([5016a43](https://github.com/betagouv/api-subventions-asso/commit/5016a43757973255bce85a9ff1a6f4ed95e1bf0d))
- **api:** fix chorus service tests ([3a7bb8c](https://github.com/betagouv/api-subventions-asso/commit/3a7bb8cc1a4362665787075a0c6eeebfe75fcedb))
- **api:** mock new Date in bodacc adapter test ([ea153d5](https://github.com/betagouv/api-subventions-asso/commit/ea153d56e6ba66a971a4f3c7bbf63a0ccb3ce645))
- **api:** return null if bodacc anwser is empty ([c7e098d](https://github.com/betagouv/api-subventions-asso/commit/c7e098d29c7ca94d4c9cc3c67d8549963bf44feb))
- **api:** user.service activeUser test ([5c9b6c2](https://github.com/betagouv/api-subventions-asso/commit/5c9b6c2b543e53b64cc4d8e3b2af69782e1af9c4))
- **front:** minimum & maximum nb digits need to be consistent ([bedee74](https://github.com/betagouv/api-subventions-asso/commit/bedee74de75097de55c0f3d8f36fb582ad96af46))
- **front:** no modale on empty rows ([c14fe24](https://github.com/betagouv/api-subventions-asso/commit/c14fe24ebbebedb89c464da601f46dab23bdc4e6))
- **front:** open doc card in new tab ([69e25ee](https://github.com/betagouv/api-subventions-asso/commit/69e25ee80486ceeecb96882258829be722d1cf2e))
- **front:** polyfill at to be supported by old firefox ([b9519ef](https://github.com/betagouv/api-subventions-asso/commit/b9519ef7299d87d7a410c8ed15390e763408b93b))
- **front:** print of no action description ([4d96935](https://github.com/betagouv/api-subventions-asso/commit/4d96935a48e90b7973b4dcd6fc0c42a7350d8cf1))
- **front:** remove second icon in document card ([ee18b39](https://github.com/betagouv/api-subventions-asso/commit/ee18b3992bd53a192ed798906fb9015c5ebd67ee))
- **front:** use getLastVersementsDate from helper ([29b2a47](https://github.com/betagouv/api-subventions-asso/commit/29b2a477fe51cafa30a9d7d792b7aeb567545d72))
- **front:** when no action ([21fd0d4](https://github.com/betagouv/api-subventions-asso/commit/21fd0d41cfff2eb6d42e14ac9f5b578e0fd36156))

### Features

- **api:** add bodacc description ([49bdce3](https://github.com/betagouv/api-subventions-asso/commit/49bdce39d35b7e357c9a55a55115bb1ff4e54c48))
- **api:** add bodacc service and adapter ([7ac55e7](https://github.com/betagouv/api-subventions-asso/commit/7ac55e7c24c94ce0a35101f42d3de37ff3b264b5))
- **api:** add bodacc service in the provider list ([d4344a1](https://github.com/betagouv/api-subventions-asso/commit/d4344a1045cc55a71edf3ba2af4f6814b79f84c9))
- **api:** cli controller to test gispro parser ([3aa9b6c](https://github.com/betagouv/api-subventions-asso/commit/3aa9b6c2e22d8dee9228b386da422022dc211834))
- **api:** gispro join parser and types ([6264c03](https://github.com/betagouv/api-subventions-asso/commit/6264c03f25a3e20b2caab7c605997c0c111b252c))
- **api:** sends bop ([ae51da1](https://github.com/betagouv/api-subventions-asso/commit/ae51da12d46da1d285bcbf74d7cf330b6d75a0b3))
- **api:** tqdm to pretty print progress ([71f8c66](https://github.com/betagouv/api-subventions-asso/commit/71f8c6650ba8416c1f85e962c12d28d425e2a202))
- **api:** update http error code documentation ([6e675c5](https://github.com/betagouv/api-subventions-asso/commit/6e675c520b44cbf03c208dc6c476879354cb6d79))
- **dto:** add BodaccRecordDto to AssociationDto ([e4e4941](https://github.com/betagouv/api-subventions-asso/commit/e4e4941965ae13bd2a5fc7f7e2249dda1917745d))
- **dto:** make Association Bodacc optionnal ([99486cc](https://github.com/betagouv/api-subventions-asso/commit/99486cc6ec291f2cce23b75e3858e7ced6a7d84f))
- **dto:** make Association bodacc prop a ProviderValues ([687cb75](https://github.com/betagouv/api-subventions-asso/commit/687cb757d154a50847edceb0b4b82d37068f31df))
- **front:** 1113 data disclaimer + style ([066e066](https://github.com/betagouv/api-subventions-asso/commit/066e06625856591f9b7cd508d3544630bf01f97e)), closes [#1113](https://github.com/betagouv/api-subventions-asso/issues/1113)
- **front:** a11y and style using p tags ([2cb30ca](https://github.com/betagouv/api-subventions-asso/commit/2cb30ca115928b340da2bbb3d4d24a472cebd0a3))
- **front:** a11y sr-only tabbable button ([3b89049](https://github.com/betagouv/api-subventions-asso/commit/3b89049fe8f2fa214b7927eaae211c0c1534bde9))
- **front:** add all roles select option for contacts filtering ([60dfe29](https://github.com/betagouv/api-subventions-asso/commit/60dfe29b2be6371e95055257486903b9f459cb06))
- **front:** add requests service ([78c5baf](https://github.com/betagouv/api-subventions-asso/commit/78c5baf3b62eeaf6b7c6e4f67cd4139e91f9b0ab))
- **front:** back to always status ([73e7b80](https://github.com/betagouv/api-subventions-asso/commit/73e7b80d84c4847f9fab58e5b8fd8f15097c4dea))
- **front:** contact page breadcrumbs ([669fdbb](https://github.com/betagouv/api-subventions-asso/commit/669fdbb2c14ef0187024c06248273f832519b36c))
- **front:** contact page in svelte ([8d55b4c](https://github.com/betagouv/api-subventions-asso/commit/8d55b4cb033db31e1e90d9433fa8617c0a736a43))
- **front:** don't cut word ([fca9976](https://github.com/betagouv/api-subventions-asso/commit/fca9976a1eca759ad57265b6c6c9478c1311ae08))
- **front:** extract notFoundMessage from controller ([2e42636](https://github.com/betagouv/api-subventions-asso/commit/2e42636d39b050522e6046fd2b8b0cfe6c17e239))
- **front:** hide exercice filter ([8964bf2](https://github.com/betagouv/api-subventions-asso/commit/8964bf2a454fa6eb67f3ef415fd4a63e679fdbe5))
- **front:** link only on address ([5da624c](https://github.com/betagouv/api-subventions-asso/commit/5da624c05e49ee7faae015c234ed126c19886faa))
- **front:** new subvention info modale ([223237e](https://github.com/betagouv/api-subventions-asso/commit/223237e5225e4f374cf83fc39a349d63f05ecea2))
- **front:** prepare establishment preview style and click behavior ([8b47a31](https://github.com/betagouv/api-subventions-asso/commit/8b47a310f9bbc32fa76ad4d71e06dc883b5726f6))
- **front:** primary cell style ([f5a40e7](https://github.com/betagouv/api-subventions-asso/commit/f5a40e7318e47adecc0a966f1539cb8a128d9c5e))
- **front:** safe display of amount if some are unknown ([adfbe9c](https://github.com/betagouv/api-subventions-asso/commit/adfbe9c2e9161cddabbb87f4c00abce6cb05db57))
- **front:** subv modal on row click instead of specific column ([80fc7b7](https://github.com/betagouv/api-subventions-asso/commit/80fc7b7444a0f068d6224df83213fc0d4433d235))
- **front:** update contactEtab test ([3fff7ea](https://github.com/betagouv/api-subventions-asso/commit/3fff7ea93ad8dff2be94c8987da5cbdb67c26896))
- **front:** update external link ([e4607a5](https://github.com/betagouv/api-subventions-asso/commit/e4607a5c0436c3c6aec91c51a273bf60a5078936))
- **front:** update wording if no data on any exercices ([939e821](https://github.com/betagouv/api-subventions-asso/commit/939e821fce7ff0324bfd0bf12e549ef3943ecf17))
- **front:** use request service on auth and versement ports ([28fbb4e](https://github.com/betagouv/api-subventions-asso/commit/28fbb4e612f32fb1cc7dba34af60e443ca21d428))
- **front:** use svelte contact page ([f2fdd21](https://github.com/betagouv/api-subventions-asso/commit/f2fdd217ebba4e854d23b93b3bcc4056b64c2939))

# [0.25.0](https://github.com/betagouv/api-subventions-asso/compare/v0.24.7...v0.25.0) (2023-04-04)

### Bug Fixes

- **api:** change provider name of rib documents ([9cb1ebd](https://github.com/betagouv/api-subventions-asso/commit/9cb1ebd1e07f80fce3ee1a601d53f4144dd4b99f))
- **api:** delete consumer if could not create token ([a6204a9](https://github.com/betagouv/api-subventions-asso/commit/a6204a9d326fc5aab713fb5b249c6dbe5954da0e))
- **api:** fix chorus service tests ([faf11de](https://github.com/betagouv/api-subventions-asso/commit/faf11de22f794656b723fdc7f5c596eaa9067796))
- **api:** mock new Date in bodacc adapter test ([9b3d39f](https://github.com/betagouv/api-subventions-asso/commit/9b3d39f5a26d49610881529129c16536b5b9c5f1))
- **api:** return null if bodacc anwser is empty ([5f1d9ac](https://github.com/betagouv/api-subventions-asso/commit/5f1d9ac8523a7b9decdcb8b1731f6e64e30bdc5e))
- **api:** user.service activeUser test ([a43f27b](https://github.com/betagouv/api-subventions-asso/commit/a43f27bb910d8024d7d5f0f4b5f053babd8e579e))
- **front:** footer dsfr conformity ([50f916a](https://github.com/betagouv/api-subventions-asso/commit/50f916a86864553e994cde909481ed0271b85d4d))
- **front:** no modale on empty rows ([a297074](https://github.com/betagouv/api-subventions-asso/commit/a2970747cd5ce2bfa4009dc262c3ffb11e0fa603))
- **front:** open doc card in new tab ([e3de164](https://github.com/betagouv/api-subventions-asso/commit/e3de164fba6843faeac9d8de1ff2a2dd9d90c84e))
- **front:** print of no action description ([4922401](https://github.com/betagouv/api-subventions-asso/commit/49224015fac52296f4f8565513e9c44e72d7db62))
- **front:** remove second icon in document card ([3f64f9c](https://github.com/betagouv/api-subventions-asso/commit/3f64f9cc36805d0ccf7be2ca1839f33ce9fcf6a0))
- **front:** use getLastVersementsDate from helper ([02542e9](https://github.com/betagouv/api-subventions-asso/commit/02542e9abc22975cf239eb4844341396fbda4176))
- **front:** when no action ([8d636e0](https://github.com/betagouv/api-subventions-asso/commit/8d636e0cb15d654c58c458be0720dbc9433c1202))

### Features

- **api:** add bodacc description ([43f90d6](https://github.com/betagouv/api-subventions-asso/commit/43f90d68fd9307952759afe5173f38131547dcaa))
- **api:** add bodacc service and adapter ([f75b14a](https://github.com/betagouv/api-subventions-asso/commit/f75b14ae84dde45f124e501398d42ce5949bff45))
- **api:** add bodacc service in the provider list ([70d1343](https://github.com/betagouv/api-subventions-asso/commit/70d1343b772dc6d6b6c31dd7fdeb6a4421df1a24))
- **api:** cli controller to test gispro parser ([f4d70f0](https://github.com/betagouv/api-subventions-asso/commit/f4d70f07027372cae12d6cf063730c91254e1a96))
- **api:** gispro join parser and types ([5bd9eee](https://github.com/betagouv/api-subventions-asso/commit/5bd9eee3ae7fd915ebb612c7e262f26ad1fda6cc))
- **api:** sends bop ([fa9d900](https://github.com/betagouv/api-subventions-asso/commit/fa9d900a2898ba1cb5d14c7f7d831ab1f636a578))
- **api:** tqdm to pretty print progress ([ba888a0](https://github.com/betagouv/api-subventions-asso/commit/ba888a0bdaccd270861c35c477b8f8ddf9dec4e5))
- **api:** update http error code documentation ([b8d94fd](https://github.com/betagouv/api-subventions-asso/commit/b8d94fd71425311190d1fdda6800684e5dbf95d7))
- **dto:** add BodaccRecordDto to AssociationDto ([7a975a6](https://github.com/betagouv/api-subventions-asso/commit/7a975a6cdcbcb095ea481fec22f67442b1a5b6d1))
- **dto:** make Association Bodacc optionnal ([0dd8447](https://github.com/betagouv/api-subventions-asso/commit/0dd8447da230e8e1d8e701bdf615e27c2146b33b))
- **dto:** make Association bodacc prop a ProviderValues ([84af61b](https://github.com/betagouv/api-subventions-asso/commit/84af61b2e9cb9bbec220c6436617dbfb88021cac))
- **front:** 1113 data disclaimer + style ([8523a73](https://github.com/betagouv/api-subventions-asso/commit/8523a738ec0b50557184d62035d49288267e7a71)), closes [#1113](https://github.com/betagouv/api-subventions-asso/issues/1113)
- **front:** a11y and style using p tags ([7263026](https://github.com/betagouv/api-subventions-asso/commit/72630262c5f8f3923206220136fa151a48fbcd0a))
- **front:** a11y sr-only tabbable button ([22f22b7](https://github.com/betagouv/api-subventions-asso/commit/22f22b736949b8b367b8d14a0ebde48867705637))
- **front:** add all roles select option for contacts filtering ([59a72c4](https://github.com/betagouv/api-subventions-asso/commit/59a72c4550008cdb7981243ea15d01b71d270a63))
- **front:** add requests service ([2d8f58b](https://github.com/betagouv/api-subventions-asso/commit/2d8f58b6e15a150d2bfa944c40728518b0568ade))
- **front:** back to always status ([1eee52e](https://github.com/betagouv/api-subventions-asso/commit/1eee52e9b7df774b81e8472a80252f56df19a1a2))
- **front:** contact page breadcrumbs ([368b1df](https://github.com/betagouv/api-subventions-asso/commit/368b1df56d15ea643f61d5c03c6a05b617238cf5))
- **front:** contact page in svelte ([4c4cd83](https://github.com/betagouv/api-subventions-asso/commit/4c4cd83eed58f956f997bb99ed4db3f830045392))
- **front:** don't cut word ([63d4beb](https://github.com/betagouv/api-subventions-asso/commit/63d4beb262718c21d2773527cb9f6db791508dc6))
- **front:** extract notFoundMessage from controller ([2f5b6c5](https://github.com/betagouv/api-subventions-asso/commit/2f5b6c575eb57c068c1ed86392f77dad668d81d3))
- **front:** hide exercice filter ([14d510c](https://github.com/betagouv/api-subventions-asso/commit/14d510cbd9c2e9ed5b036eb01cedb1e5b256dd0c))
- **front:** link only on address ([0daf18e](https://github.com/betagouv/api-subventions-asso/commit/0daf18e713e6088842ce7f1e870338fa57b805d4))
- **front:** link to static stats ([ed48e84](https://github.com/betagouv/api-subventions-asso/commit/ed48e8445b65b829798a2f666c9dee65cd2e2e20))
- **front:** new subvention info modale ([2f99200](https://github.com/betagouv/api-subventions-asso/commit/2f992007cb70978f64ddc1299bf27f1bc3d0499c))
- **front:** prepare establishment preview style and click behavior ([35f39ff](https://github.com/betagouv/api-subventions-asso/commit/35f39ffe9463b2da10c38824951a3bc397f0d86d))
- **front:** primary cell style ([09e8132](https://github.com/betagouv/api-subventions-asso/commit/09e813235ec4ad629a107ea5b8dd322b776941bd))
- **front:** safe display of amount if some are unknown ([b9a288e](https://github.com/betagouv/api-subventions-asso/commit/b9a288ef2c7cc7ce0b79d563e9347a1d7cf14ab4))
- **front:** subv modal on row click instead of specific column ([55d33b0](https://github.com/betagouv/api-subventions-asso/commit/55d33b04569846d6cb86c755cce4f37ebeba69d5))
- **front:** update contactEtab test ([ac8abd3](https://github.com/betagouv/api-subventions-asso/commit/ac8abd3ada4acc15d552d6b2378fe5cca3bfaedc))
- **front:** update external link ([786c634](https://github.com/betagouv/api-subventions-asso/commit/786c634630f295bb1f670b8742be73d81d477747))
- **front:** update wording if no data on any exercices ([379c975](https://github.com/betagouv/api-subventions-asso/commit/379c975e7873f6e6c6e631995fc7c834a235dffb))
- **front:** use request service on auth and versement ports ([dade1ad](https://github.com/betagouv/api-subventions-asso/commit/dade1adc013a81c69628aa002740d4d659fa6814))
- **front:** use svelte contact page ([25c2dba](https://github.com/betagouv/api-subventions-asso/commit/25c2dbac78785bc9148e3323ad2429661711c03b))

## [0.24.10](https://github.com/betagouv/api-subventions-asso/compare/v0.24.9...v0.24.10) (2023-04-12)

### Bug Fixes

- **api:** fix create index osiris request ([4770a6e](https://github.com/betagouv/api-subventions-asso/commit/4770a6e77a0169cbf2710c45cdf3d303e45f11d2))

## [0.24.9](https://github.com/betagouv/api-subventions-asso/compare/v0.24.8...v0.24.9) (2023-04-12)

### Bug Fixes

- **api:** add osiris repositories indexes ([cdcb9f7](https://github.com/betagouv/api-subventions-asso/commit/cdcb9f7f6e58a1e098a6543790a19687c8791a08))

## [0.24.8](https://github.com/betagouv/api-subventions-asso/compare/v0.24.7...v0.24.8) (2023-03-28)

### Bug Fixes

- **front:** footer dsfr conformity ([b468de1](https://github.com/betagouv/api-subventions-asso/commit/b468de1e3e2dd856f3a3e8931db586fa9964be6e))

### Features

- **front:** link to static stats ([f0aace5](https://github.com/betagouv/api-subventions-asso/commit/f0aace50fb7a59589f4ada9ec8710c9bd9a9ac8b))

## [0.24.7](https://github.com/betagouv/api-subventions-asso/compare/v0.24.6...v0.24.7) (2023-03-27)

### Bug Fixes

- **api:** call \_mergeentities with good this ([caabbf9](https://github.com/betagouv/api-subventions-asso/commit/caabbf90d19e6ff8ebe316eda4def9974f672df9))

## [0.24.6](https://github.com/betagouv/api-subventions-asso/compare/v0.24.5...v0.24.6) (2023-03-27)

### Bug Fixes

- **api:** limit the circular dependencies ([e42dee1](https://github.com/betagouv/api-subventions-asso/commit/e42dee1f8c4f4d26634f87f473b261076d4277fa))
- **api:** probably fix duplicate error mongo ([4bae331](https://github.com/betagouv/api-subventions-asso/commit/4bae3318f5d386fe21a5a226d74790536c430b87))
- **api:** remove event manager in association name ([469162e](https://github.com/betagouv/api-subventions-asso/commit/469162e5448fea38b4f76b573e3cdb1163890d0f))

## [0.24.5](https://github.com/betagouv/api-subventions-asso/compare/v0.24.4...v0.24.5) (2023-03-21)

### Bug Fixes

- **api:** do not overinterpret dates nor numbers ([c45ca8e](https://github.com/betagouv/api-subventions-asso/commit/c45ca8e4db3638210d5265e3dcc944de3b838b3d))

## [0.24.4](https://github.com/betagouv/api-subventions-asso/compare/v0.24.3...v0.24.4) (2023-03-21)

### Bug Fixes

- **api:** back to string identifiers ([af0f896](https://github.com/betagouv/api-subventions-asso/commit/af0f8960da86303bd6dfa18eed11c55ebbe11e08))
- **api:** fix ds amounts and date parsing ([aaeeff6](https://github.com/betagouv/api-subventions-asso/commit/aaeeff653c8fb34d1fc2ccc8f10adfb70c8673eb))
- **api:** proper signup error code ([939424e](https://github.com/betagouv/api-subventions-asso/commit/939424eae2cacef6569ec9271446afafabef2ced))
- **api:** remove space from search by identifier ([ee216bb](https://github.com/betagouv/api-subventions-asso/commit/ee216bb7d50333ca1f1ac62ad531e11ddb1cff44))
- **front:** add best http error management ([fc4dece](https://github.com/betagouv/api-subventions-asso/commit/fc4dece64a25a87a573c18d0a93b36e3f636d637))
- **front:** add beta on label in extract csv download button ([9c5f29b](https://github.com/betagouv/api-subventions-asso/commit/9c5f29bba510618f30bd47575b7a2404234f6293))
- **front:** remove ds from list of providers ([280b2bd](https://github.com/betagouv/api-subventions-asso/commit/280b2bdf56954a3ade53531cf100c89017fb7cb3))
- **front:** update max char limit ([8e723b3](https://github.com/betagouv/api-subventions-asso/commit/8e723b3cd7dfe452a72e81def0b3d96c698d2629))

### Features

- **front:** wording ([4eb87be](https://github.com/betagouv/api-subventions-asso/commit/4eb87beff45ddeec8e45ad29aafad105c6555151))

## [0.24.3](https://github.com/betagouv/api-subventions-asso/compare/v0.24.2...v0.24.3) (2023-03-21)

### Bug Fixes

- **api:** fix test ([5bc5110](https://github.com/betagouv/api-subventions-asso/commit/5bc5110b7b200082b497f6a4a74466e3efdbe599))

## [0.24.2](https://github.com/betagouv/api-subventions-asso/compare/v0.24.1...v0.24.2) (2023-03-21)

### Bug Fixes

- **api,fron:** hotfix caisse depos and wrong merge ([6a7df46](https://github.com/betagouv/api-subventions-asso/commit/6a7df46999fd6fee2fa10e806b88860f3e0743ec))

## [0.24.1](https://github.com/betagouv/api-subventions-asso/compare/v0.24.0...v0.24.1) (2023-03-21)

### Bug Fixes

- **api:** fix reading error ([d46cc11](https://github.com/betagouv/api-subventions-asso/commit/d46cc1169cd5939fc74cf69a9bf9b98c41727873))

# [0.24.0](https://github.com/betagouv/api-subventions-asso/compare/v0.23.9...v0.24.0) (2023-03-21)

### Bug Fixes

- **api:** admin user creation success response ([bc116c9](https://github.com/betagouv/api-subventions-asso/commit/bc116c95d5c9e49386280817c91b362ad3b7240a))
- **api:** api asso fix error on document is not array on structure dont have identite ([f4364da](https://github.com/betagouv/api-subventions-asso/commit/f4364da0652a5ce3f10b71416deb33faafbadb70))
- **api:** call splited route for rna and siren in api asso ([737559d](https://github.com/betagouv/api-subventions-asso/commit/737559d35680b2655ceec01c89927bb4833cb84e))
- **api:** fix \_merge entities and one tests ([1148570](https://github.com/betagouv/api-subventions-asso/commit/11485703e30dc6c02128efc53cbd25d1ffb203eb))
- **api:** fix TS error ([0e55260](https://github.com/betagouv/api-subventions-asso/commit/0e55260a6e8628f002e0438e1519fd845a708978))
- **api:** remove .only in tests and fix etablissement headcount url ([f44e3d0](https://github.com/betagouv/api-subventions-asso/commit/f44e3d0e3d158a231e44a8de9843719e8325617a))
- **api:** revert NotFoundError in getEtablissements() ([9badb82](https://github.com/betagouv/api-subventions-asso/commit/9badb82b3f325c5b377ba89a4745b6c409455ae4))
- **api:** update AssociationController test ([6d857f8](https://github.com/betagouv/api-subventions-asso/commit/6d857f83343c5127ebbb026a2d713761b2f1249b))
- **dto:** revert deleted file ([f67bfcb](https://github.com/betagouv/api-subventions-asso/commit/f67bfcb574202e2f8945f506a9d019d7f3284a63))
- **dto:** revert ResetPasswordErrorCodes removal ([eef731b](https://github.com/betagouv/api-subventions-asso/commit/eef731bfdb2f388a7642bd015d8bcb46eb840850))
- **front:** add padding and margin ([5772e73](https://github.com/betagouv/api-subventions-asso/commit/5772e73a950c46c6c32ab95c394ff0c572ee0c42))
- **front:** fix from rebase ([96aca46](https://github.com/betagouv/api-subventions-asso/commit/96aca466523f6986ec7b84546cfad1aafd0bc39e))
- **front:** get projectName from \_extractTableDataFromElement ([cdd7500](https://github.com/betagouv/api-subventions-asso/commit/cdd75000d6096bfd97f43b4f20a29920a06e69aa))
- **front:** no undefined this ([9e76e92](https://github.com/betagouv/api-subventions-asso/commit/9e76e92c07b71a62896c3636f7a06ff8340aa16a))
- **front:** reset crisp session instead of trying to set null email ([12eac5b](https://github.com/betagouv/api-subventions-asso/commit/12eac5b06cbfa09070b6b5b3af1e1cfb1db32350))
- **front:** test downloadCsv in SubventionsVersementsDashboardController ([3ae6b61](https://github.com/betagouv/api-subventions-asso/commit/3ae6b612e2aa39d86784f8065397d94834bd2d0e))
- **front:** update comment ([551cdc6](https://github.com/betagouv/api-subventions-asso/commit/551cdc664931312750af37412f72368f7a3f5618))
- **front:** use trimValue instead of trim to avoid name collision ([7c177e4](https://github.com/betagouv/api-subventions-asso/commit/7c177e425631993215156bbda2e5338656aaba5d))

### Features

- **api, dto:** update error handling in UserController ([9b0c058](https://github.com/betagouv/api-subventions-asso/commit/9b0c0587e01c80f4f1940511ceddf8e0f9417d91))
- **api, front:** add # in password regex ([8e4915d](https://github.com/betagouv/api-subventions-asso/commit/8e4915db7351fbcfedf5f5e8afdbe7075e65c7b9))
- **api,dto:** update according to caisse dto spelling fixes ([bb7d2e6](https://github.com/betagouv/api-subventions-asso/commit/bb7d2e681bf51c45caef61ec7d9c96229708c578))
- **api,front:** wording ([ab2b0ad](https://github.com/betagouv/api-subventions-asso/commit/ab2b0ad7992bfab470b1b438348b33806ed251b5))
- **api:** adapter call in method with api call ([cf9c313](https://github.com/betagouv/api-subventions-asso/commit/cf9c31335f800b7ee1ed1bf7959604cf03956b28))
- **api:** add dbo to subvention dto adapter ([8c4d89a](https://github.com/betagouv/api-subventions-asso/commit/8c4d89a77364d35731df9221288836d358962142))
- **api:** add ds dto to dbo adapter ([49a9f80](https://github.com/betagouv/api-subventions-asso/commit/49a9f805508ba64f75b71bcc02ae98241e1e4871))
- **api:** add endpoint user by request ([ec8467a](https://github.com/betagouv/api-subventions-asso/commit/ec8467a13f91f6c0a2d41de42a0bf3630c166e8e))
- **api:** add joiner between user and association visits ([5b972e7](https://github.com/betagouv/api-subventions-asso/commit/5b972e7e161f46ea3b456473c547170a9e981702))
- **api:** add posibility to add schema and update/find ds data ([fe906d1](https://github.com/betagouv/api-subventions-asso/commit/fe906d1ad7d0d3f6a2977b8ffe52325db1544c5e))
- **api:** add real template ids ([be9dc5a](https://github.com/betagouv/api-subventions-asso/commit/be9dc5aa524534a0b318183deb77cef9736f0453))
- **api:** better use of data and its tests ([c0f9bc5](https://github.com/betagouv/api-subventions-asso/commit/c0f9bc5ba5a528bcbaab531178b0791d27c8efb1))
- **api:** caisse depots service and adapter ([2003014](https://github.com/betagouv/api-subventions-asso/commit/2003014f593b1d16448b9bdd0db015a44c84b3ad))
- **api:** caisse depots, fonjep and gispro adapters implements new dto ([6bd8fdd](https://github.com/betagouv/api-subventions-asso/commit/6bd8fdd9553fa805628b336ed0ff29a212c6450d))
- **api:** caisseDepots types ([5f3079d](https://github.com/betagouv/api-subventions-asso/commit/5f3079dfe7dd980e78bdc04102631cc4fd1cf256))
- **api:** change 422 to 404 HTTP error ([9f6dce3](https://github.com/betagouv/api-subventions-asso/commit/9f6dce362e5054064c55fb653a6f5a9f463e71d7))
- **api:** controller route to get emails of extractor users ([72b6c3b](https://github.com/betagouv/api-subventions-asso/commit/72b6c3b35a968961301a038c492e021c650810f2))
- **api:** create tokenHelper ([136b22f](https://github.com/betagouv/api-subventions-asso/commit/136b22f95f8530212c3a5a83fd0309cc24e4bca0))
- **api:** date helper sameDateNextYear ([3997f56](https://github.com/betagouv/api-subventions-asso/commit/3997f561f520780e0f0ba8032f908f70aa32a186))
- **api:** dauphin adapter implements new dto ([e710e9e](https://github.com/betagouv/api-subventions-asso/commit/e710e9e3a0034cc2d8416f364b4a1a0e242a2196))
- **api:** dedent password errors ([3c1304c](https://github.com/betagouv/api-subventions-asso/commit/3c1304cd2c1f6eb1b67b71eeb9a0b7a14ce78b1f))
- **api:** demarches simplifiees poc ([08b6838](https://github.com/betagouv/api-subventions-asso/commit/08b683886d4be0f533f292eb183cf3b6a935c8cb))
- **api:** demarches simplifiees poc cli ([0577e77](https://github.com/betagouv/api-subventions-asso/commit/0577e77c0173797762ec1f82ac0fa1193d444d56))
- **api:** error handling in search controller ([d653e84](https://github.com/betagouv/api-subventions-asso/commit/d653e8445eebabc114300cab5beadcb0f7bfb23b))
- **api:** get emails from logs about extracts ([975fb8b](https://github.com/betagouv/api-subventions-asso/commit/975fb8b022a2007fa832d6aa45ffd80fb83f9721))
- **api:** helper to convert status ([2c9468c](https://github.com/betagouv/api-subventions-asso/commit/2c9468c7ef4912826fdf14fe1df33453ee36fa78))
- **api:** include error code in Error interface ([4d5f46b](https://github.com/betagouv/api-subventions-asso/commit/4d5f46b1def5606997c5de2d9f39503fc292c479))
- **api:** integ test consumer controller ([00fe33b](https://github.com/betagouv/api-subventions-asso/commit/00fe33b85b918b8e8491d22ea8613243937e3e41))
- **api:** osiris adapter implements new dto ([32a107e](https://github.com/betagouv/api-subventions-asso/commit/32a107ec476f0373ea45bf7723fdfcd267862645))
- **api:** prepare use of sendinblue template emails ([960114e](https://github.com/betagouv/api-subventions-asso/commit/960114eda8955ad0520ec3729668ce6a5d3e93e0))
- **api:** register extract routes and tests ([21474dd](https://github.com/betagouv/api-subventions-asso/commit/21474ddbff909544361bd9d9cf5782a1ccb8e77b))
- **api:** register new provider ([bec0c9c](https://github.com/betagouv/api-subventions-asso/commit/bec0c9cc78a7232b44e5a8660e6ffed50711b717))
- **api:** remove success:true from refactored methods ([2c78f40](https://github.com/betagouv/api-subventions-asso/commit/2c78f4006429300f6bd4d4394783c956ff647a23))
- **api:** remove TODO comment ([3a39761](https://github.com/betagouv/api-subventions-asso/commit/3a39761173db8f38fa3bf5c1c8fdb19b05d2f34a))
- **api:** return 201 in createUser ([622c3c8](https://github.com/betagouv/api-subventions-asso/commit/622c3c8fadf2c4f851a0d4c0867df889d19548c7))
- **api:** return which role is not valid ([fabaeef](https://github.com/betagouv/api-subventions-asso/commit/fabaeef0f09ff477d0f7b35d68f6b9c7b16b7a61))
- **api:** save Object.values before loop ([4112202](https://github.com/betagouv/api-subventions-asso/commit/41122024db1e232a5c7d5329f6288985db040450))
- **api:** sort name by provider trust and fix mergable same asso ([c1c0d25](https://github.com/betagouv/api-subventions-asso/commit/c1c0d252b89224787772f92935981a37dddd179b))
- **api:** test cli command ([90947d4](https://github.com/betagouv/api-subventions-asso/commit/90947d48ff2f622b5ecd39fe6fad51917e172831))
- **api:** update tests ([e24d6c5](https://github.com/betagouv/api-subventions-asso/commit/e24d6c5245f95d750176afcc5cc3acbb25c0397f))
- **api:** use helper ([b0449ad](https://github.com/betagouv/api-subventions-asso/commit/b0449ad3135e0ad6ade39f3af323dc74f677f9e2))
- **api:** wip wip ([3d90dee](https://github.com/betagouv/api-subventions-asso/commit/3d90dee79d28764e9c8f2c5506d983e1293f4671))
- **api:** wording agents publics ([c8bb8e4](https://github.com/betagouv/api-subventions-asso/commit/c8bb8e4079d0d05587ecc785a4433c49fcdaf4ab))
- **dto:** normalized application status enum ([0551fb7](https://github.com/betagouv/api-subventions-asso/commit/0551fb757ba365e77cc14fd6acdd97a0a27a57fb))
- **dto:** update application dto with normalized status label ([37fa9a0](https://github.com/betagouv/api-subventions-asso/commit/37fa9a08e0f0aad2d91faac7dd19ff025fd23de3))
- **dto:** update application status enum ([46ee7d6](https://github.com/betagouv/api-subventions-asso/commit/46ee7d6c9e8fd7424ed0cffde653404254d65e3e))
- **front:** 1053 wording signup page ([a9cb688](https://github.com/betagouv/api-subventions-asso/commit/a9cb688c896bf9176e310aaa4983601ff53cc4c6))
- **front:** accessibility improvement and note for later ([c323153](https://github.com/betagouv/api-subventions-asso/commit/c323153971fde4db8eb892c64706aee9a335ddc7))
- **front:** add 404 view ([3e19ad6](https://github.com/betagouv/api-subventions-asso/commit/3e19ad6f1f7c3364226026a312e6e618eddd722e))
- **front:** add BOM to CSV to force Excel UTF-8 encoding ([a6a1e1b](https://github.com/betagouv/api-subventions-asso/commit/a6a1e1b2de874539c52f8a4941da8df928f4ac64))
- **front:** add breadcrumb ([0fe403f](https://github.com/betagouv/api-subventions-asso/commit/0fe403f47e245695fde0afdae41bc13a26dd5c89))
- **front:** add Caisse Dépôts in provider list ([4ae6e67](https://github.com/betagouv/api-subventions-asso/commit/4ae6e67ad08c2c5dcdcc3360d419b106091e6962))
- **front:** add datasub download button ([d955a4d](https://github.com/betagouv/api-subventions-asso/commit/d955a4d58ef0fffe6fe47abd50de3148b46fb839))
- **front:** add ds on data provider and qwick fix on sizedTrim ([21b1adc](https://github.com/betagouv/api-subventions-asso/commit/21b1adcd90f58a5280c711bf7fc09b08b0e68873))
- **front:** add icon to download datasub csv button ([9d5b5f9](https://github.com/betagouv/api-subventions-asso/commit/9d5b5f92bc824ec11fbbaa2a5126074c5201ef33))
- **front:** add isEtab getter in controller ([b5515d4](https://github.com/betagouv/api-subventions-asso/commit/b5515d4abbcf09404f80767412d76368d3cc9a78))
- **front:** add structure ports and call extractData on download ([8df55a5](https://github.com/betagouv/api-subventions-asso/commit/8df55a569ba9dc9c1ab7dfc8a8b018fea29c6830))
- **front:** build and download DataSub CSV ([0b5b6ac](https://github.com/betagouv/api-subventions-asso/commit/0b5b6acfdce0e238f06bbee303be0f9c142bbee6))
- **front:** change column head font size ([689397d](https://github.com/betagouv/api-subventions-asso/commit/689397dc94dc527644373c54538b66d656fb65bc))
- **front:** crisp reset session ([c349856](https://github.com/betagouv/api-subventions-asso/commit/c349856488a0a9fd3a22f330051e25dce0082bd1))
- **front:** crisp service sets user email ([6a1fc57](https://github.com/betagouv/api-subventions-asso/commit/6a1fc57ea5a1900cf61104447aa322927f4e3a68))
- **front:** disable csv button while loading data ([ef1b73a](https://github.com/betagouv/api-subventions-asso/commit/ef1b73a73633d66717ae45f4f9f0eea080647df4))
- **front:** draw line to help reading ([a014245](https://github.com/betagouv/api-subventions-asso/commit/a014245d0860f33918a40067d861a28114e1aa34))
- **front:** dsfr color mode in graph ([4d64ca2](https://github.com/betagouv/api-subventions-asso/commit/4d64ca2599ba4e462ff039a710604d3979ebc834))
- **front:** extract values in extractRows instead of using onlyValues boolean ([d562adf](https://github.com/betagouv/api-subventions-asso/commit/d562adfd88303a947c28e3c52f34fc56ec077d2e))
- **front:** helper tests if not an array given ([9e04988](https://github.com/betagouv/api-subventions-asso/commit/9e049889c6196af236b70cd4aed99b8828e189ea))
- **front:** hide unknown percent ([a589a0a](https://github.com/betagouv/api-subventions-asso/commit/a589a0aca2e59ed3f05c4bf4dc2518382d0fdcae))
- **front:** keep wrong url when redirecting to 404 view ([63d50b4](https://github.com/betagouv/api-subventions-asso/commit/63d50b4a71630dd1260bbcf4d840e2a194b1d435))
- **front:** make VersementTableController as default export ([7ba0907](https://github.com/betagouv/api-subventions-asso/commit/7ba09071b45bba6fc39450d8bd4c51bc20ef5094))
- **front:** mock axios ([f7906c5](https://github.com/betagouv/api-subventions-asso/commit/f7906c5166ca8655be53ece8590f13e8c7fed817))
- **front:** page setup and login saves email to crisp ([3ddda15](https://github.com/betagouv/api-subventions-asso/commit/3ddda15e19eac578ffd409e1ed7a906fb1edf9f1))
- **front:** redirect all calls to svelte ([ef21167](https://github.com/betagouv/api-subventions-asso/commit/ef21167724fa54f3b1ef1512b35978a70ca4bc68))
- **front:** replace 404 button with links ([66c8dd6](https://github.com/betagouv/api-subventions-asso/commit/66c8dd6d7dcb8ac79fa8aca6bbf045bbfedd64d6))
- **front:** replace button to link for go to association in etab view ([91ec963](https://github.com/betagouv/api-subventions-asso/commit/91ec9636d0fea5add6097d95839959b4993a23b2))
- **front:** resourceName prop in monthly graph component ([ac99d1a](https://github.com/betagouv/api-subventions-asso/commit/ac99d1a7565c22f140943f23927c1eaee262ebe7))
- **front:** show newer users first ([4390d8b](https://github.com/betagouv/api-subventions-asso/commit/4390d8bf29b7a59078c7ae3f1cad58b9b9474c7e))
- **front:** show tooltip even if not on the point ([d410e7b](https://github.com/betagouv/api-subventions-asso/commit/d410e7b4aac45e99118ae9d907dbe65e161d82c3))
- **front:** status column instead of granted amount ([74b2873](https://github.com/betagouv/api-subventions-asso/commit/74b28736fcf8b9e59fe0778e9732c3755981d9da))
- **front:** status label badge component & controller ([8c2174b](https://github.com/betagouv/api-subventions-asso/commit/8c2174b5e77db63644b7023c45ece4d27ccdc17e))
- **front:** switch button position ([f9a050e](https://github.com/betagouv/api-subventions-asso/commit/f9a050e29d8552a259f85a29771b8206a19e3c32))
- **front:** tooltip component for monthly graph ([055149c](https://github.com/betagouv/api-subventions-asso/commit/055149c1199f9f04bd68267ff2cfb8bb7e705db9))
- **front:** transparent background spinner ([d9c571f](https://github.com/betagouv/api-subventions-asso/commit/d9c571f06ec64940e5cd35148ebe1bec393aaac7))
- **front:** update 404 content ([fba8ffc](https://github.com/betagouv/api-subventions-asso/commit/fba8ffc4fadd1c9081a678dfb34132f97daa5d48))
- **front:** use link instead of button to send mail ([4441954](https://github.com/betagouv/api-subventions-asso/commit/4441954c917f6252190a04d54d5aee5a4e120b79))
- **front:** use services to call port in controller ([de553f2](https://github.com/betagouv/api-subventions-asso/commit/de553f2bf531820b129948d1303e0f6f67c904e8))
- **front:** use tooltip in monthly graph ([d74d3f0](https://github.com/betagouv/api-subventions-asso/commit/d74d3f0b42fdee07813c51f888fc8fd30fb5553d))
- **front:** wording and spelling ([ed47bca](https://github.com/betagouv/api-subventions-asso/commit/ed47bcaa6b4d4ca9d7863624399586764432a32d))

## [0.23.9](https://github.com/betagouv/api-subventions-asso/compare/v0.23.8...v0.23.9) (2023-03-10)

### Bug Fixes

- **api:** add more check on use dauphin data ([f67f8c1](https://github.com/betagouv/api-subventions-asso/commit/f67f8c162380fcd1e7b3ef55b2682fee659ea02c))

## [0.23.8](https://github.com/betagouv/api-subventions-asso/compare/v0.23.7...v0.23.8) (2023-03-08)

### Bug Fixes

- **api:** atomic update of association-name collection ([02099de](https://github.com/betagouv/api-subventions-asso/commit/02099de76d091f291a159a2e6e23e4536b676bb7))

## [0.23.7](https://github.com/betagouv/api-subventions-asso/compare/v0.23.6...v0.23.7) (2023-03-03)

### Bug Fixes

- **front:** redirect to home on 404 only if route ([8bdb548](https://github.com/betagouv/api-subventions-asso/commit/8bdb5487de767c5ce9c2d965483ec50b01bba33c))

## [0.23.6](https://github.com/betagouv/api-subventions-asso/compare/v0.23.5...v0.23.6) (2023-02-23)

### Bug Fixes

- **api:** change provider name for etablishement data ([dbf2e94](https://github.com/betagouv/api-subventions-asso/commit/dbf2e94ed9c4b57441b8ab18ff78407a8728d74d))

## [0.23.5](https://github.com/betagouv/api-subventions-asso/compare/v0.23.4...v0.23.5) (2023-02-16)

### Features

- **front:** disable association stats tabs ([513116c](https://github.com/betagouv/api-subventions-asso/commit/513116c446798d5e31228397e40be8e8b30d01ea))

## [0.23.4](https://github.com/betagouv/api-subventions-asso/compare/v0.23.3...v0.23.4) (2023-02-16)

### Bug Fixes

- **front:** when api return an 401 logout the user ([7002913](https://github.com/betagouv/api-subventions-asso/commit/7002913ba7b7852d2602b8bffe488850109ea668))

## [0.23.3](https://github.com/betagouv/api-subventions-asso/compare/v0.23.2...v0.23.3) (2023-02-15)

### Bug Fixes

- **api:** signup contact mailto ([169b77a](https://github.com/betagouv/api-subventions-asso/commit/169b77a2341bbfab744f997ce56225adfe1c29c0))
- **api:** update calendly link ([8932342](https://github.com/betagouv/api-subventions-asso/commit/89323421e4ae8cec4741ea21f2c1b6a728ef0072))

## [0.23.2](https://github.com/betagouv/api-subventions-asso/compare/v0.23.1...v0.23.2) (2023-02-15)

### Bug Fixes

- **front:** fix access on admin page ([237ac24](https://github.com/betagouv/api-subventions-asso/commit/237ac24ada509575de98910e62d9227ada167321))

## [0.23.1](https://github.com/betagouv/api-subventions-asso/compare/v0.23.0...v0.23.1) (2023-02-15)

### Bug Fixes

- **api:** signup page does not need authentication ([a357965](https://github.com/betagouv/api-subventions-asso/commit/a357965edbd990ffde4d9cbf32674917a3d160b4))

# [0.23.0](https://github.com/betagouv/api-subventions-asso/compare/v0.22.0...v0.23.0) (2023-02-13)

### Bug Fixes

- **front:** clean for review ([1d833af](https://github.com/betagouv/api-subventions-asso/commit/1d833af6f0bf12b5f502f22d4ec6d1a4bac33076))

### Features

- **front:** add chat crisp ([3fd35f7](https://github.com/betagouv/api-subventions-asso/commit/3fd35f7ad91b2213c3c2726f65ea6024f80657dc))
- **front:** add new widget in stats + layout ([495c043](https://github.com/betagouv/api-subventions-asso/commit/495c043452f6171a4db96daa8e08e265424841e8))
- **front:** add stats page on association ([c382c50](https://github.com/betagouv/api-subventions-asso/commit/c382c50c79e05730a1dd4d68a2c635f962667b3d))
- **front:** cleanup resetPassword service ([f53f445](https://github.com/betagouv/api-subventions-asso/commit/f53f445e1fff40039eac30547397345c6235abf6))
- **front:** compute labels from fresh in front ([d696f77](https://github.com/betagouv/api-subventions-asso/commit/d696f770f8fee6687f4bccacd665a4d3dc9c919d))
- **front:** configure legend : previous value or not ([afc1bf5](https://github.com/betagouv/api-subventions-asso/commit/afc1bf5e1e6a5ed451288054cdc2d111171388de))
- **front:** display value before start of year in graph ([a3e5998](https://github.com/betagouv/api-subventions-asso/commit/a3e5998f1245239e99d5db3289866b3fb39e06c4))
- **front:** dynamic Input type ([873e09b](https://github.com/betagouv/api-subventions-asso/commit/873e09b4d8c0202fc9b8dbef67b44b3f0f94313d))
- **front:** forget password oignon pipeline ([c5998c3](https://github.com/betagouv/api-subventions-asso/commit/c5998c369594b10c4192a00e74afb840d1901b6d))
- **front:** forget password svelte component ([3ee2013](https://github.com/betagouv/api-subventions-asso/commit/3ee201326afd96cd51aec0a73f43abb3f4990c87))
- **front:** generic monthly graph component ([34cfcf4](https://github.com/betagouv/api-subventions-asso/commit/34cfcf4c1a3cac00e5b3cdcf420764f5f6865d9d))
- **front:** manage user authentification in svelte part ([9fbe82f](https://github.com/betagouv/api-subventions-asso/commit/9fbe82f76eb4ce03a297df4c57a3572b08979424))
- **front:** misc review comments ([a114702](https://github.com/betagouv/api-subventions-asso/commit/a114702a94bb3ef0a962c55133f59e42539ab3c0))
- **front:** monthly request graph component ([7796423](https://github.com/betagouv/api-subventions-asso/commit/7796423ba5652579eb2e325c703505bb30646366))
- **front:** oignon pipeline to get request monthly count ([6ce01db](https://github.com/betagouv/api-subventions-asso/commit/6ce01dbf4a6b286c56d5a13665fe88d7ba281793))
- **front:** post reset pwd ([38515a8](https://github.com/betagouv/api-subventions-asso/commit/38515a804844be152a1b4d211d73be68b6febab2))
- **front:** reset pwd spinner ([eb5fae9](https://github.com/betagouv/api-subventions-asso/commit/eb5fae941312812539b4be8a8b07fa339d4bfbba))
- **front:** reset-pwd breadcrumbs ([eb8d1ed](https://github.com/betagouv/api-subventions-asso/commit/eb8d1ed967d55433bd33a73d203d107da6eb036a))
- **front:** select supports id ([9f2e49f](https://github.com/betagouv/api-subventions-asso/commit/9f2e49f3c0ac70e4cd958f88c9bbe3085636d512))
- **front:** stat api does not invent data in the future ([c0a17fe](https://github.com/betagouv/api-subventions-asso/commit/c0a17fe7044ab130c5707cee5e7b99c7960b4c55))
- **front:** switch forget-password routing to svelte ([bbf8375](https://github.com/betagouv/api-subventions-asso/commit/bbf83759c0f800a03b77b5e3ab9e53e06162d920))
- **front:** switch routing to svelte ([ae1b4d8](https://github.com/betagouv/api-subventions-asso/commit/ae1b4d82ee6c4e40b4a8a31cfb1dba3fec9cb037))
- **front:** update router service and add error service ([4a1a582](https://github.com/betagouv/api-subventions-asso/commit/4a1a58232798b336f4a59127f0b7e20604ba2ad1))
- **front:** wip structure of reset-password feature ([1813a3c](https://github.com/betagouv/api-subventions-asso/commit/1813a3c66f8120c795de17e5ba63204ea93f86b3))
- **front:** wip wip ([875132b](https://github.com/betagouv/api-subventions-asso/commit/875132b57eda3ce4d85f936153d5e98e1b509420))

# [0.22.0](https://github.com/betagouv/api-subventions-asso/compare/v0.21.4...v0.22.0) (2023-01-27)

### Bug Fixes

- **api,front:** review cleaning ([a0beda3](https://github.com/betagouv/api-subventions-asso/commit/a0beda35b3891f7a28fe852b341d0f11942b65ab))
- **api:** keep just good request ([#897](https://github.com/betagouv/api-subventions-asso/issues/897)) ([5b51d9c](https://github.com/betagouv/api-subventions-asso/commit/5b51d9c4646b5010d1b6ef1e1a43338877a1fc55))
- **front:** don't escape error message ([cc9a4f4](https://github.com/betagouv/api-subventions-asso/commit/cc9a4f4ebd4c59f23d95f352a9cf5de4b3c0f193))
- **front:** don't fail if user not connected ([298582b](https://github.com/betagouv/api-subventions-asso/commit/298582bd10b0206d5a95ac6b7545b0b56c93d5d0))
- **front:** fix breadcrumbs ([9608f2f](https://github.com/betagouv/api-subventions-asso/commit/9608f2fadf1349a4d7f706632b0099f6506dc2c0))
- **front:** homogenize service return (always int code) ([301ddb0](https://github.com/betagouv/api-subventions-asso/commit/301ddb0f712a7775476df4562df9c6b70c8ccfcc))
- **front:** no email is promise rejection ([7ce66fc](https://github.com/betagouv/api-subventions-asso/commit/7ce66fc8cc78bf88e3a0dbc38f7fc91f43932fb3))

### Features

- **api, dto:** add UserCountByStatus stats ressource ([#896](https://github.com/betagouv/api-subventions-asso/issues/896)) ([d4ee988](https://github.com/betagouv/api-subventions-asso/commit/d4ee988e1dfa62b904fcdb5921fe62a533f676a3))
- **api, front:** add code convention to README ([#903](https://github.com/betagouv/api-subventions-asso/issues/903)) ([c6da308](https://github.com/betagouv/api-subventions-asso/commit/c6da308640a354dfe6b6ab42879d3f3925f667da))
- **api:** change logout managements ([#885](https://github.com/betagouv/api-subventions-asso/issues/885)) ([505efba](https://github.com/betagouv/api-subventions-asso/commit/505efbaa013e3654a06156995a283f022eb4be64)), closes [#864](https://github.com/betagouv/api-subventions-asso/issues/864)
- **api:** change management of api asso files ([223227e](https://github.com/betagouv/api-subventions-asso/commit/223227e6c563c020c4104ed329e49a6909f14480))
- **api:** return nb_users_before_year on get monthly user stats ([21a01c1](https://github.com/betagouv/api-subventions-asso/commit/21a01c19d9aa1064b2d5568502675207775f7e67))
- **front:** [#661](https://github.com/betagouv/api-subventions-asso/issues/661) widget user nb ([#905](https://github.com/betagouv/api-subventions-asso/issues/905)) ([32760f1](https://github.com/betagouv/api-subventions-asso/commit/32760f168fa16c1b01e48c6aae438fd9b73ead90)), closes [#753](https://github.com/betagouv/api-subventions-asso/issues/753)
- **front:** add user distributions ([368a224](https://github.com/betagouv/api-subventions-asso/commit/368a2244eef73fd28880980d9cdd04f082e14cfc))
- **front:** month helper ([ccc06c8](https://github.com/betagouv/api-subventions-asso/commit/ccc06c838c218ff4cf16c36c07296a4673358e12))
- **front:** package lock ([8251f33](https://github.com/betagouv/api-subventions-asso/commit/8251f33606836ff25d969569b151a73a3605c749))
- **front:** package lock ([1cc16ed](https://github.com/betagouv/api-subventions-asso/commit/1cc16edb549cf64fd3867b84654972d4f7fa8137))
- **front:** port and service ([6b9912d](https://github.com/betagouv/api-subventions-asso/commit/6b9912ded82e3ec74b5067dd0638c9cd96b874ba))
- **front:** quick button type support ([c19dfeb](https://github.com/betagouv/api-subventions-asso/commit/c19dfeba56f474742d8ae1cc2efb10fbf0b7e374))
- **front:** quick input required on input ([a8c0eb0](https://github.com/betagouv/api-subventions-asso/commit/a8c0eb0d215628a3e5a6a17aa953c3201f2332c7))
- **front:** remove response success ([db2b30a](https://github.com/betagouv/api-subventions-asso/commit/db2b30a196e3012eaff9eefe1b4e0901d3d0fee1))
- **front:** signup component and controller ([0a6dcba](https://github.com/betagouv/api-subventions-asso/commit/0a6dcbafbf34e4ee7fa9f9ec54ae9fdeaaaea86c))
- **front:** spinner spacing ([b66eb0c](https://github.com/betagouv/api-subventions-asso/commit/b66eb0c312ce6355a630890ab25dc1f3cae6b738))
- **front:** stats port and service ([a5ddbc8](https://github.com/betagouv/api-subventions-asso/commit/a5ddbc82fce1d3af85a4b3a14728e620d3e3b4ab))
- **front:** style spacing and sizes ([3d98b3b](https://github.com/betagouv/api-subventions-asso/commit/3d98b3b702e2936f39c745d4e145bcca74bbe85c))
- **front:** switch router from ejs to svelte ([a68a9f8](https://github.com/betagouv/api-subventions-asso/commit/a68a9f8ccaded68768cc863ae769b7888b366e33))
- **front:** use nb_users_before_year ([8bee87d](https://github.com/betagouv/api-subventions-asso/commit/8bee87d015d6a195fad10c82f137e0d7820d0778))

## [0.21.4](https://github.com/betagouv/api-subventions-asso/compare/v0.21.3...v0.21.4) (2023-01-26)

### Bug Fixes

- **api:** use cursor instead of array ([b0a3d26](https://github.com/betagouv/api-subventions-asso/commit/b0a3d261d0e52aa73b377bc1afa97c9e88c8d6e1))

## [0.21.3](https://github.com/betagouv/api-subventions-asso/compare/v0.20.4...v0.21.3) (2023-01-26)

### Bug Fixes

- **api:** is domain accepted ([#848](https://github.com/betagouv/api-subventions-asso/issues/848)) ([b72b3d1](https://github.com/betagouv/api-subventions-asso/commit/b72b3d10048f3d69983cca75e4a419ae014f3a8e))
- **api:** use sirene siege ([f66ccb5](https://github.com/betagouv/api-subventions-asso/commit/f66ccb5d80f37b283df337eb5458892db27585af))
- **front:** add padding in modal ([06941f8](https://github.com/betagouv/api-subventions-asso/commit/06941f8cfd72f917a949428878a28651a14e9a62))
- **front:** add reactivity on new subvention ([9867cb3](https://github.com/betagouv/api-subventions-asso/commit/9867cb381a01a0378a3c4eec7fd7f3f9a710315c))
- **front:** clean info legal\* ([ebb8c4b](https://github.com/betagouv/api-subventions-asso/commit/ebb8c4b76999db011f3a3e4885d8070266176377))
- **front:** fix enddate off message ([38bd308](https://github.com/betagouv/api-subventions-asso/commit/38bd3081e0a97d230292b3fabf0a190fbd59d764))
- **front:** rename MMDDYYYDate to dateToDDMMYYYY ([#887](https://github.com/betagouv/api-subventions-asso/issues/887)) ([3a9a6b6](https://github.com/betagouv/api-subventions-asso/commit/3a9a6b680d451c5dede07b25993031f250188d82))
- **front:** search siret with space is posible ([0489c84](https://github.com/betagouv/api-subventions-asso/commit/0489c8413ce59f6040cde1483f7cf77585cdf7e8))
- **front:** search siret with space is posible ([906da32](https://github.com/betagouv/api-subventions-asso/commit/906da3292c467d411c5cba4bf9a3f0c6644c928d))
- **front:** use http if flux is hs ([c89d2c9](https://github.com/betagouv/api-subventions-asso/commit/c89d2c960fe5f8d348d168d8e0524cf77511bfd1))

### Features

- **api, front:** update README ([#816](https://github.com/betagouv/api-subventions-asso/issues/816)) ([9281700](https://github.com/betagouv/api-subventions-asso/commit/928170063f582f217464727a14898c4a4ccdcb58))
- **api,dto,front:** add email domains in db and allow admin to update it ([#753](https://github.com/betagouv/api-subventions-asso/issues/753)) ([dab4a57](https://github.com/betagouv/api-subventions-asso/commit/dab4a57562ed9fc79f08bed449166b8bed532da2))
- **api:** [#668](https://github.com/betagouv/api-subventions-asso/issues/668) [#771](https://github.com/betagouv/api-subventions-asso/issues/771) save and consult top associations ([#811](https://github.com/betagouv/api-subventions-asso/issues/811)) ([f1f7123](https://github.com/betagouv/api-subventions-asso/commit/f1f71230e7eb78b98ca50da13cdd2d0901dfe99c))
- **api:** [#737](https://github.com/betagouv/api-subventions-asso/issues/737) cumulative nb users by month one year ([#806](https://github.com/betagouv/api-subventions-asso/issues/806)) ([47b69d0](https://github.com/betagouv/api-subventions-asso/commit/47b69d047b90e961b1f0d087ae2eff1abd4716aa))
- **front:** [#800](https://github.com/betagouv/api-subventions-asso/issues/800) title and identifiers out of InfosLegales ([#861](https://github.com/betagouv/api-subventions-asso/issues/861)) ([18d4177](https://github.com/betagouv/api-subventions-asso/commit/18d4177ddec3b4e046370ca498761e6c36c59bd9))
- **front:** add blue banner for asso and etab view ([#841](https://github.com/betagouv/api-subventions-asso/issues/841)) ([08fe101](https://github.com/betagouv/api-subventions-asso/commit/08fe1019a0682fb82e9e7e0e038bcba23eb3072b))
- **front:** fix rebase ([#847](https://github.com/betagouv/api-subventions-asso/issues/847)) ([bfd4bf7](https://github.com/betagouv/api-subventions-asso/commit/bfd4bf7890bdc9d476f7c593e07c67a7f6e1c486))
- **front:** force document download in a new tab ([#842](https://github.com/betagouv/api-subventions-asso/issues/842)) ([145d4e6](https://github.com/betagouv/api-subventions-asso/commit/145d4e6d85327acca764e8d23286655e8c44edae))
- **front:** update asso etab card ([#839](https://github.com/betagouv/api-subventions-asso/issues/839)) ([a66cac8](https://github.com/betagouv/api-subventions-asso/commit/a66cac877ed11b87bed9b81faee6ffc00364a7b8))

## [0.21.2](https://github.com/betagouv/api-subventions-asso/compare/v0.21.1...v0.21.2) (2023-01-18)

**Note:** Version bump only for package api-subventions-asso

## [0.21.1](https://github.com/betagouv/api-subventions-asso/compare/v0.21.0...v0.21.1) (2023-01-17)

**Note:** Version bump only for package api-subventions-asso

# [0.21.0](https://github.com/betagouv/api-subventions-asso/compare/v0.20.2...v0.21.0) (2023-01-17)

### Bug Fixes

- **api:** is domain accepted ([#848](https://github.com/betagouv/api-subventions-asso/issues/848)) ([de44620](https://github.com/betagouv/api-subventions-asso/commit/de446203f2774f86f1691a5da0ee19bd2f5f0cc7))
- **front:** fix download list contact csv ([#828](https://github.com/betagouv/api-subventions-asso/issues/828)) ([cb378d4](https://github.com/betagouv/api-subventions-asso/commit/cb378d4b81e6fe4919d545f53854ca10659540db))
- **front:** rename MMDDYYYDate to dateToDDMMYYYY ([#887](https://github.com/betagouv/api-subventions-asso/issues/887)) ([60e2e15](https://github.com/betagouv/api-subventions-asso/commit/60e2e15e5580f6e6b7dc3fab67385ee9cdc06cd9))

### Features

- **api, front:** update README ([#816](https://github.com/betagouv/api-subventions-asso/issues/816)) ([12a0684](https://github.com/betagouv/api-subventions-asso/commit/12a0684c5ea1f9ae853c41073bdb5be1c818c071))
- **api,dto,front:** add email domains in db and allow admin to update it ([#753](https://github.com/betagouv/api-subventions-asso/issues/753)) ([e349963](https://github.com/betagouv/api-subventions-asso/commit/e349963263a7199035178623fd6e497dd6eb68ba))
- **api:** [#668](https://github.com/betagouv/api-subventions-asso/issues/668) [#771](https://github.com/betagouv/api-subventions-asso/issues/771) save and consult top associations ([#811](https://github.com/betagouv/api-subventions-asso/issues/811)) ([3f1f4b2](https://github.com/betagouv/api-subventions-asso/commit/3f1f4b2f98ec75e0dcc953473508c79667050771))
- **api:** [#737](https://github.com/betagouv/api-subventions-asso/issues/737) cumulative nb users by month one year ([#806](https://github.com/betagouv/api-subventions-asso/issues/806)) ([bd2f061](https://github.com/betagouv/api-subventions-asso/commit/bd2f06153eef16b7eab58affaf2d41c9892180ee))
- **front:** [#800](https://github.com/betagouv/api-subventions-asso/issues/800) title and identifiers out of InfosLegales ([#861](https://github.com/betagouv/api-subventions-asso/issues/861)) ([542206e](https://github.com/betagouv/api-subventions-asso/commit/542206eb94e60da62483cbaa2b005e870c485cbd))
- **front:** add blue banner for asso and etab view ([#841](https://github.com/betagouv/api-subventions-asso/issues/841)) ([a453a1c](https://github.com/betagouv/api-subventions-asso/commit/a453a1c343f494620119100a4fbdbf0cfc97b4c9))
- **front:** fix rebase ([#847](https://github.com/betagouv/api-subventions-asso/issues/847)) ([3f0ddd6](https://github.com/betagouv/api-subventions-asso/commit/3f0ddd6412e2732b6a7d0ee908592cd63fc2d7f3))
- **front:** force document download in a new tab ([#842](https://github.com/betagouv/api-subventions-asso/issues/842)) ([fe9980f](https://github.com/betagouv/api-subventions-asso/commit/fe9980f0ff4e01a1d631c66004e076f7b2a8891e))
- **front:** update asso etab card ([#839](https://github.com/betagouv/api-subventions-asso/issues/839)) ([1265c3c](https://github.com/betagouv/api-subventions-asso/commit/1265c3c6946f78302d4c8293e4f3b1e160d0e61e))

## [0.20.4](https://github.com/betagouv/api-subventions-asso/compare/v0.20.3...v0.20.4) (2023-01-23)

### Bug Fixes

- **api:** fix documents in case of error ([f2238e3](https://github.com/betagouv/api-subventions-asso/commit/f2238e3df1de196d750c4f02e11f421fd68f4f41))

## [0.20.3](https://github.com/betagouv/api-subventions-asso/compare/v0.20.2...v0.20.3) (2023-01-20)

### Bug Fixes

- **front:** fix download list contact csv ([#828](https://github.com/betagouv/api-subventions-asso/issues/828)) ([cb378d4](https://github.com/betagouv/api-subventions-asso/commit/cb378d4b81e6fe4919d545f53854ca10659540db))

### Features

- **api:** add message on api index route ([4d5f64f](https://github.com/betagouv/api-subventions-asso/commit/4d5f64fa4d020c26c30c6e8ee0763c74c12d91e8))

## [0.20.2](https://github.com/betagouv/api-subventions-asso/compare/v0.19.4...v0.20.2) (2023-01-05)

### Bug Fixes

- **api:** remove throw in ecode api rna title migrations ([9c7b0da](https://github.com/betagouv/api-subventions-asso/commit/9c7b0dae3183a0f9aa7392f396e458b15bd85179))
- **front:** fix download list contact csv ([9ab9505](https://github.com/betagouv/api-subventions-asso/commit/9ab9505063b5203828606bda006dd4c973c29441))

### Features

- **api:** 669 montly nb requests by year stat route ([#726](https://github.com/betagouv/api-subventions-asso/issues/726)) ([df4dce7](https://github.com/betagouv/api-subventions-asso/commit/df4dce7341ab1d15626365258fd6dd2cf0a2ee37))
- **front:** [#691](https://github.com/betagouv/api-subventions-asso/issues/691) update icon class names ([#739](https://github.com/betagouv/api-subventions-asso/issues/739)) ([87356f5](https://github.com/betagouv/api-subventions-asso/commit/87356f5bc1848cb3dce3ecabcd4efcd599b4d454))
- **front:** 656 base page for admin stats page ([#743](https://github.com/betagouv/api-subventions-asso/issues/743)) ([7066716](https://github.com/betagouv/api-subventions-asso/commit/7066716aaa3d053319603e996856cff4cbbad4cf))
- **front:** add method is user actif ([#782](https://github.com/betagouv/api-subventions-asso/issues/782)) ([f63156a](https://github.com/betagouv/api-subventions-asso/commit/f63156a03c777fe55dce4dbbcddf0caab94dd780))
- **front:** add user actif on admin view list ([#784](https://github.com/betagouv/api-subventions-asso/issues/784)) ([d7a54b6](https://github.com/betagouv/api-subventions-asso/commit/d7a54b6748c2c2b52c3ac7f936e0781086628ec4))

## [0.20.1](https://github.com/betagouv/api-subventions-asso/compare/v0.20.0...v0.20.1) (2023-01-03)

### Bug Fixes

- **api:** remove throw in ecode api rna title migrations ([0854550](https://github.com/betagouv/api-subventions-asso/commit/08545503548f23c9640fede3ebaa743f8a5799f7))

# [0.20.0](https://github.com/betagouv/api-subventions-asso/compare/v0.19.3...v0.20.0) (2023-01-03)

### Features

- **api:** 669 montly nb requests by year stat route ([#726](https://github.com/betagouv/api-subventions-asso/issues/726)) ([391da49](https://github.com/betagouv/api-subventions-asso/commit/391da49f75cdbf289cf06daba55475318de16bcf))
- **front:** [#691](https://github.com/betagouv/api-subventions-asso/issues/691) update icon class names ([#739](https://github.com/betagouv/api-subventions-asso/issues/739)) ([a2ebb34](https://github.com/betagouv/api-subventions-asso/commit/a2ebb349a03e346bdda4a948bbfb3a72f2136529))
- **front:** 656 base page for admin stats page ([#743](https://github.com/betagouv/api-subventions-asso/issues/743)) ([0fc5003](https://github.com/betagouv/api-subventions-asso/commit/0fc5003c707b3df6c770694e1937a2a1fb276a8a))
- **front:** add method is user actif ([#782](https://github.com/betagouv/api-subventions-asso/issues/782)) ([611a772](https://github.com/betagouv/api-subventions-asso/commit/611a772518806ff3c163072bf7d22071dd3a2d8d))
- **front:** add user actif on admin view list ([#784](https://github.com/betagouv/api-subventions-asso/issues/784)) ([b111c16](https://github.com/betagouv/api-subventions-asso/commit/b111c16bfbe86ad0108e0566ff2701021bf40249))

## [0.19.4](https://github.com/betagouv/api-subventions-asso/compare/v0.19.3...v0.19.4) (2023-01-05)

### Bug Fixes

- **api:** change sort order on api asso documents ([33c6c18](https://github.com/betagouv/api-subventions-asso/commit/33c6c1814de5672d6b71bb11d7fe509222a463b6))

## [0.19.3](https://github.com/betagouv/api-subventions-asso/compare/v0.19.2...v0.19.3) (2022-12-29)

### Bug Fixes

- **front:** add messages on home page ([2692b4e](https://github.com/betagouv/api-subventions-asso/commit/2692b4e8ef985d4ca8b14ca0953e36870a7300f2))

## [0.19.2](https://github.com/betagouv/api-subventions-asso/compare/v0.18.7...v0.19.2) (2022-12-27)

### Bug Fixes

- **api:** format data with array containing one element ([d445296](https://github.com/betagouv/api-subventions-asso/commit/d4452964ea6d3e63aa87b8eeb48bb6190f8f23ae))
- **api:** sort getSubventions result to avoid race failure ([8d4df00](https://github.com/betagouv/api-subventions-asso/commit/8d4df00038a201e9f5ee8a1ab96f6996aff79a3f))
- **api:** update snapshot ([562d651](https://github.com/betagouv/api-subventions-asso/commit/562d65106ce4b44ca5e8d3116ebe8d4dd7a8ea7f))
- **api:** use async foreach instead of promise all ([1460340](https://github.com/betagouv/api-subventions-asso/commit/1460340e69f5a26558f341e78ed566488624cf28))
- **api:** use real compare method to fix the test ([dd2c12a](https://github.com/betagouv/api-subventions-asso/commit/dd2c12a726645c95a385c1763096a336ff213188))
- **front:** realign login form ([ccc2913](https://github.com/betagouv/api-subventions-asso/commit/ccc2913a38eb391e05ef140ee6f653c941fda282))
- **front:** run prettier ([2d21508](https://github.com/betagouv/api-subventions-asso/commit/2d21508b21dd8cd4c9ab14be939f4fefb2f8a719))
- **front:** v0.19.0 bugs ([5e2589a](https://github.com/betagouv/api-subventions-asso/commit/5e2589a052911e9927b968417331f20ae7e1a682)), closes [#758](https://github.com/betagouv/api-subventions-asso/issues/758) [#757](https://github.com/betagouv/api-subventions-asso/issues/757) [#756](https://github.com/betagouv/api-subventions-asso/issues/756) [#755](https://github.com/betagouv/api-subventions-asso/issues/755)

### Features

- **api:** accept caissedesdepots.fr email domain ([b3a9199](https://github.com/betagouv/api-subventions-asso/commit/b3a919945b1590ea9863fdc2d32a4f6fc6536624))
- **api:** add migration for osiris requests indexes ([#623](https://github.com/betagouv/api-subventions-asso/issues/623)) ([87d8338](https://github.com/betagouv/api-subventions-asso/commit/87d8338ca253c36b3ca4011ff5c29869227138af))
- **api:** apply PR review comments ([f159972](https://github.com/betagouv/api-subventions-asso/commit/f1599727659f320f35726cdac106054e7faf6373))
- **front, api:** add etablissement dashboard ([#709](https://github.com/betagouv/api-subventions-asso/issues/709)) ([4e85991](https://github.com/betagouv/api-subventions-asso/commit/4e85991bfec399f44fea558004fa09ad53a3182a))
- **front:** add etablissment tab bank data ([c8142d1](https://github.com/betagouv/api-subventions-asso/commit/c8142d1a35a25a217fc9f41e31d2dd472263f181))
- **front:** align left tabs ([d571689](https://github.com/betagouv/api-subventions-asso/commit/d57168939ff38791701b952f32c427e6e34ad98f))
- **front:** include dsfr icons ([#704](https://github.com/betagouv/api-subventions-asso/issues/704)) ([51640a6](https://github.com/betagouv/api-subventions-asso/commit/51640a680a035db0e5016a47fc231c7d40b7dea8))
- **front:** migratate admin/user/create in Svelte ([#671](https://github.com/betagouv/api-subventions-asso/issues/671)) ([c2ccc66](https://github.com/betagouv/api-subventions-asso/commit/c2ccc660da3c203d61e2299d57cd77eb6d712cbc))
- **front:** new etablissement page ([#626](https://github.com/betagouv/api-subventions-asso/issues/626)) ([f8cd049](https://github.com/betagouv/api-subventions-asso/commit/f8cd049ac9220009163cbf66ba12abbdf9fcee8a))
- **front:** remplace ejs admin view in svelte view ([b894500](https://github.com/betagouv/api-subventions-asso/commit/b894500e37d74691c02d6def0f2e533e7df131d5))
- **front:** remplace ejs domain admin view in svelte view ([#673](https://github.com/betagouv/api-subventions-asso/issues/673)) ([fe6f310](https://github.com/betagouv/api-subventions-asso/commit/fe6f31097a29ee7d8d407e6f201e1be4cb0a69b1))
- **front:** restore cgu in svelte front ([51a5c60](https://github.com/betagouv/api-subventions-asso/commit/51a5c6008afc6d9c051282f3b36474ddfcbc0b08))
- **front:** use Documents in etablissement page ([fa5c2e7](https://github.com/betagouv/api-subventions-asso/commit/fa5c2e7af011a9d15a0f7c95be9afc24e11a00c6))
- **front:** use safe equality operand ([e9947bc](https://github.com/betagouv/api-subventions-asso/commit/e9947bc6075463d16fa503cb396d8ff8679bdf26))

## [0.19.1](https://github.com/betagouv/api-subventions-asso/compare/v0.18.3...v0.19.1) (2022-12-26)

### Bug Fixes

- **api:** format data with array containing one element ([2c52324](https://github.com/betagouv/api-subventions-asso/commit/2c52324b0a22c639d5c67ce5d8b9285e96543515))
- **api:** sort getSubventions result to avoid race failure ([e6439bb](https://github.com/betagouv/api-subventions-asso/commit/e6439bbdeb59cbe866942f5d6916922c18531db3))
- **api:** update LCA document description text ([a5be48c](https://github.com/betagouv/api-subventions-asso/commit/a5be48c454249e2c6e1b7fa22efd476dd227b611))
- **api:** update snapshot ([5e29d8a](https://github.com/betagouv/api-subventions-asso/commit/5e29d8a7abb7bf97d02a44f20cf7fc6881cc1ad8))
- **api:** use real compare method to fix the test ([70b4554](https://github.com/betagouv/api-subventions-asso/commit/70b4554f74249518011f2e17a5ad87124239d0bf))
- **front:** realign login form ([b1d69c9](https://github.com/betagouv/api-subventions-asso/commit/b1d69c927043647158d948c521e98ba2f64445d6))
- **front:** run prettier ([8e1ce0b](https://github.com/betagouv/api-subventions-asso/commit/8e1ce0b75d5760b1d62e1de239e822c66620634e))
- **front:** v0.19.0 bugs ([1542e62](https://github.com/betagouv/api-subventions-asso/commit/1542e62de7350c42cf4333ee1728865a0f9a1f9f)), closes [#758](https://github.com/betagouv/api-subventions-asso/issues/758) [#757](https://github.com/betagouv/api-subventions-asso/issues/757) [#756](https://github.com/betagouv/api-subventions-asso/issues/756) [#755](https://github.com/betagouv/api-subventions-asso/issues/755)

### Features

- **api:** accept caissedesdepots.fr email domain ([ed9aaa5](https://github.com/betagouv/api-subventions-asso/commit/ed9aaa508a522eea8fffdf282c18cf3ba5fb5145))
- **api:** add collectivite domain ([@rhone](https://github.com/rhone).fr) ([98d1bf3](https://github.com/betagouv/api-subventions-asso/commit/98d1bf31ec1bc070697672308bc4e7bd0b6f4ada))
- **api:** add migration for osiris requests indexes ([#623](https://github.com/betagouv/api-subventions-asso/issues/623)) ([7de5708](https://github.com/betagouv/api-subventions-asso/commit/7de570817837945459a0af01aac1c49c84aa46b9))
- **api:** apply PR review comments ([12c7bef](https://github.com/betagouv/api-subventions-asso/commit/12c7befd7c925a8ef1cd7e1bf395d0a93e53d270))
- **front, api:** add etablissement dashboard ([#709](https://github.com/betagouv/api-subventions-asso/issues/709)) ([b3c3cc3](https://github.com/betagouv/api-subventions-asso/commit/b3c3cc3b74259e0a1d5761002b98d32ff108fe34))
- **front:** add etablissment tab bank data ([a74bd75](https://github.com/betagouv/api-subventions-asso/commit/a74bd75ac35e36f7695c6ada7f6e73bdf7ba645d))
- **front:** align left tabs ([418da43](https://github.com/betagouv/api-subventions-asso/commit/418da43415292801a6f3ad5816ccb370721e8566))
- **front:** include dsfr icons ([#704](https://github.com/betagouv/api-subventions-asso/issues/704)) ([97fa87d](https://github.com/betagouv/api-subventions-asso/commit/97fa87d73b13923fc56ac817b855244568de6e11))
- **front:** migratate admin/user/create in Svelte ([#671](https://github.com/betagouv/api-subventions-asso/issues/671)) ([2ca42b2](https://github.com/betagouv/api-subventions-asso/commit/2ca42b2e235c768d3136752473a1f61f06d5ba90))
- **front:** new etablissement page ([#626](https://github.com/betagouv/api-subventions-asso/issues/626)) ([1c20193](https://github.com/betagouv/api-subventions-asso/commit/1c201935259fac247b47ae09d5d56ab6963249e8))
- **front:** remplace ejs admin view in svelte view ([7b8e82d](https://github.com/betagouv/api-subventions-asso/commit/7b8e82d0ab5d2cc33821cd2aba3839f1f3a2b6f2))
- **front:** remplace ejs domain admin view in svelte view ([#673](https://github.com/betagouv/api-subventions-asso/issues/673)) ([bc2f329](https://github.com/betagouv/api-subventions-asso/commit/bc2f329780b0673a4e75db22cde05842c7ed46fd))
- **front:** restore cgu in svelte front ([d1cb769](https://github.com/betagouv/api-subventions-asso/commit/d1cb76911a5aacd2e021d8e0a958dd466c667fb6))
- **front:** use Documents in etablissement page ([2e1a47d](https://github.com/betagouv/api-subventions-asso/commit/2e1a47d003430014eddf99043deca88bb33e9927))
- **front:** use safe equality operand ([7bb0808](https://github.com/betagouv/api-subventions-asso/commit/7bb0808c4d06cc704596cf06034257bab6e9ff23))

# [0.19.0](https://github.com/betagouv/api-subventions-asso/compare/v0.18.3...v0.19.0) (2022-12-08)

### Bug Fixes

- **api:** format data with array containing one element ([2c52324](https://github.com/betagouv/api-subventions-asso/commit/2c52324b0a22c639d5c67ce5d8b9285e96543515))
- **api:** sort getSubventions result to avoid race failure ([e6439bb](https://github.com/betagouv/api-subventions-asso/commit/e6439bbdeb59cbe866942f5d6916922c18531db3))
- **api:** update LCA document description text ([a5be48c](https://github.com/betagouv/api-subventions-asso/commit/a5be48c454249e2c6e1b7fa22efd476dd227b611))
- **api:** update snapshot ([5e29d8a](https://github.com/betagouv/api-subventions-asso/commit/5e29d8a7abb7bf97d02a44f20cf7fc6881cc1ad8))
- **api:** use real compare method to fix the test ([70b4554](https://github.com/betagouv/api-subventions-asso/commit/70b4554f74249518011f2e17a5ad87124239d0bf))
- **front:** realign login form ([b1d69c9](https://github.com/betagouv/api-subventions-asso/commit/b1d69c927043647158d948c521e98ba2f64445d6))
- **front:** run prettier ([8e1ce0b](https://github.com/betagouv/api-subventions-asso/commit/8e1ce0b75d5760b1d62e1de239e822c66620634e))

### Features

- **api:** accept caissedesdepots.fr email domain ([ed9aaa5](https://github.com/betagouv/api-subventions-asso/commit/ed9aaa508a522eea8fffdf282c18cf3ba5fb5145))
- **api:** add migration for osiris requests indexes ([#623](https://github.com/betagouv/api-subventions-asso/issues/623)) ([7de5708](https://github.com/betagouv/api-subventions-asso/commit/7de570817837945459a0af01aac1c49c84aa46b9))
- **api:** apply PR review comments ([12c7bef](https://github.com/betagouv/api-subventions-asso/commit/12c7befd7c925a8ef1cd7e1bf395d0a93e53d270))
- **front, api:** add etablissement dashboard ([#709](https://github.com/betagouv/api-subventions-asso/issues/709)) ([b3c3cc3](https://github.com/betagouv/api-subventions-asso/commit/b3c3cc3b74259e0a1d5761002b98d32ff108fe34))
- **front:** add etablissment tab bank data ([a74bd75](https://github.com/betagouv/api-subventions-asso/commit/a74bd75ac35e36f7695c6ada7f6e73bdf7ba645d))
- **front:** align left tabs ([418da43](https://github.com/betagouv/api-subventions-asso/commit/418da43415292801a6f3ad5816ccb370721e8566))
- **front:** include dsfr icons ([#704](https://github.com/betagouv/api-subventions-asso/issues/704)) ([97fa87d](https://github.com/betagouv/api-subventions-asso/commit/97fa87d73b13923fc56ac817b855244568de6e11))
- **front:** migratate admin/user/create in Svelte ([#671](https://github.com/betagouv/api-subventions-asso/issues/671)) ([2ca42b2](https://github.com/betagouv/api-subventions-asso/commit/2ca42b2e235c768d3136752473a1f61f06d5ba90))
- **front:** new etablissement page ([#626](https://github.com/betagouv/api-subventions-asso/issues/626)) ([1c20193](https://github.com/betagouv/api-subventions-asso/commit/1c201935259fac247b47ae09d5d56ab6963249e8))
- **front:** remplace ejs admin view in svelte view ([7b8e82d](https://github.com/betagouv/api-subventions-asso/commit/7b8e82d0ab5d2cc33821cd2aba3839f1f3a2b6f2))
- **front:** remplace ejs domain admin view in svelte view ([#673](https://github.com/betagouv/api-subventions-asso/issues/673)) ([bc2f329](https://github.com/betagouv/api-subventions-asso/commit/bc2f329780b0673a4e75db22cde05842c7ed46fd))
- **front:** restore cgu in svelte front ([d1cb769](https://github.com/betagouv/api-subventions-asso/commit/d1cb76911a5aacd2e021d8e0a958dd466c667fb6))
- **front:** use Documents in etablissement page ([2e1a47d](https://github.com/betagouv/api-subventions-asso/commit/2e1a47d003430014eddf99043deca88bb33e9927))
- **front:** use safe equality operand ([7bb0808](https://github.com/betagouv/api-subventions-asso/commit/7bb0808c4d06cc704596cf06034257bab6e9ff23))

## [0.18.3](https://github.com/betagouv/api-subventions-asso/compare/v0.18.2...v0.18.3) (2022-12-08)

### Bug Fixes

- **api:** mock dauphin env var ([7e4667c](https://github.com/betagouv/api-subventions-asso/commit/7e4667cfe301a81f3817eec2356e1389988ad36e))

## [0.18.6](https://github.com/betagouv/api-subventions-asso/compare/v0.18.5...v0.18.6) (2022-12-15)

### Bug Fixes

- **api:** update LCA document description text ([508e5c6](https://github.com/betagouv/api-subventions-asso/commit/508e5c62f76e73edf3444bce9abae1d505aff131))

## [0.18.5](https://github.com/betagouv/api-subventions-asso/compare/v0.18.3...v0.18.5) (2022-12-12)

### Features

- **api:** add collectivite domain ([@rhone](https://github.com/rhone).fr) ([6cc7d7f](https://github.com/betagouv/api-subventions-asso/commit/6cc7d7f31133de3cdbbb0a5ce60ad2aa2863a353))

## [0.17.3](https://github.com/betagouv/api-subventions-asso/compare/v0.18.0...v0.17.3) (2022-11-22)

### Bug Fixes

- **api:** fix migration duplicate unique id ([031cd12](https://github.com/betagouv/api-subventions-asso/commit/031cd129d31411f86b7b135ad618f4b73b7a2d22))

## [0.18.4](https://github.com/betagouv/api-subventions-asso/compare/v0.18.3...v0.18.4) (2022-12-12)

### Features

- **api:** add collectivite domain ([@rhone](https://github.com/rhone).fr) ([6cc7d7f](https://github.com/betagouv/api-subventions-asso/commit/6cc7d7f31133de3cdbbb0a5ce60ad2aa2863a353))

## [0.17.3](https://github.com/betagouv/api-subventions-asso/compare/v0.18.0...v0.17.3) (2022-11-22)

### Bug Fixes

- **api:** fix migration duplicate unique id ([031cd12](https://github.com/betagouv/api-subventions-asso/commit/031cd129d31411f86b7b135ad618f4b73b7a2d22))

## [0.18.3](https://github.com/betagouv/api-subventions-asso/compare/v0.18.2...v0.18.3) (2022-12-08)

### Bug Fixes

- **front:** link chorus versements to requests ([68d4caa](https://github.com/betagouv/api-subventions-asso/commit/68d4caae00b764718a8b94beda2970ea7eeedf8a))

## [0.18.2](https://github.com/betagouv/api-subventions-asso/compare/v0.18.1...v0.18.2) (2022-12-07)

### Bug Fixes

- **api:** do not save user token within JWT on update ([#712](https://github.com/betagouv/api-subventions-asso/issues/712)) ([e8c4f47](https://github.com/betagouv/api-subventions-asso/commit/e8c4f47916cef3fcbfd4c2d7c8e9a73f770b961d))

## [0.18.1](https://github.com/betagouv/api-subventions-asso/compare/v0.18.0...v0.18.1) (2022-11-29)

### Bug Fixes

- **api:** datagouv import tools ([349137d](https://github.com/betagouv/api-subventions-asso/commit/349137dc8682c4231d28000e97a348e3bd2f513b))

# [0.18.0](https://github.com/betagouv/api-subventions-asso/compare/v0.17.0...v0.18.0) (2022-11-22)

### Bug Fixes

- **api:** consumer cli controller integ test ([f665f26](https://github.com/betagouv/api-subventions-asso/commit/f665f26be01204b7a61bae37f3d93bc1b3a6e6bc))
- **front:** fix import js on ts ([f0a1c56](https://github.com/betagouv/api-subventions-asso/commit/f0a1c568d109d4572f2ac3a31481e07d9d0efa1b))
- **front:** tsconfig error ([#564](https://github.com/betagouv/api-subventions-asso/issues/564)) ([07248a5](https://github.com/betagouv/api-subventions-asso/commit/07248a54bb05257ede63e23c743606365b4d1920))

### Features

- **api:** drop collection entreprise siren ([#559](https://github.com/betagouv/api-subventions-asso/issues/559)) ([e019b5b](https://github.com/betagouv/api-subventions-asso/commit/e019b5bd4d2d11cf6c6e40fa5e73b04ccc25f2a4))
- **api:** move end point to etablissemnt services ([#579](https://github.com/betagouv/api-subventions-asso/issues/579)) ([521f1c2](https://github.com/betagouv/api-subventions-asso/commit/521f1c2076d0b8defbbf5f19c063a860f755d7b1))
- **api:** save association and etablissement in datagouv CLI parsing ([#563](https://github.com/betagouv/api-subventions-asso/issues/563)) ([bbf01b6](https://github.com/betagouv/api-subventions-asso/commit/bbf01b6ce94f86440335dec802b7849e33d3d685))
- **api:** update datagouv parser for reading history file ([#556](https://github.com/betagouv/api-subventions-asso/issues/556)) ([5258f19](https://github.com/betagouv/api-subventions-asso/commit/5258f19722af80eabf292f83d83faf6d4695399c))
- **api:** update script parsage datagouv ([#560](https://github.com/betagouv/api-subventions-asso/issues/560)) ([9b9132d](https://github.com/betagouv/api-subventions-asso/commit/9b9132d061f9c0e3ed05711e0ab09f8e2be2cdfd))
- **front:** add management of user id to matomo ([#575](https://github.com/betagouv/api-subventions-asso/issues/575)) ([8de65cb](https://github.com/betagouv/api-subventions-asso/commit/8de65cb53cd7dc6100755d09839067edf7355410))
- **front:** enhance Router with dynamics routes ([#612](https://github.com/betagouv/api-subventions-asso/issues/612)) ([e5745db](https://github.com/betagouv/api-subventions-asso/commit/e5745dbecaa6c7d89c19d2ca7dab69614383c2c4))
- **front:** move Breadcrumbs uses in Router ([#608](https://github.com/betagouv/api-subventions-asso/issues/608)) ([25ee182](https://github.com/betagouv/api-subventions-asso/commit/25ee182899dfcc01c0d11e2927b4bdf4b17bb734))

## [0.17.2](https://github.com/betagouv/api-subventions-asso/compare/v0.17.0...v0.17.2) (2022-11-17)

### Bug Fixes

- **api:** consumer cli controller integ test ([f665f26](https://github.com/betagouv/api-subventions-asso/commit/f665f26be01204b7a61bae37f3d93bc1b3a6e6bc))
- **api:** create index on dauphin caches ([06487ad](https://github.com/betagouv/api-subventions-asso/commit/06487ada7e7ead8aed76c1b28a3bd995c5f82f07))
- **api:** fix delete user ([1a95470](https://github.com/betagouv/api-subventions-asso/commit/1a95470332d8dd25df2c36c112468b8442dd9aaf))
- **front:** fix import js on ts ([f0a1c56](https://github.com/betagouv/api-subventions-asso/commit/f0a1c568d109d4572f2ac3a31481e07d9d0efa1b))

## [0.17.1](https://github.com/betagouv/api-subventions-asso/compare/v0.17.0...v0.17.1) (2022-11-02)

### Bug Fixes

- **api:** consumer cli controller integ test ([f665f26](https://github.com/betagouv/api-subventions-asso/commit/f665f26be01204b7a61bae37f3d93bc1b3a6e6bc))
- **front:** fix import js on ts ([26d3e88](https://github.com/betagouv/api-subventions-asso/commit/26d3e8842033b15b515fd67ffe6f18edf6cb82ad))

# [0.17.0](https://github.com/betagouv/api-subventions-asso/compare/v0.15.5...v0.17.0) (2022-11-02)

### Bug Fixes

- **api:** fix send wrong error on error in /auth/login ([#503](https://github.com/betagouv/api-subventions-asso/issues/503)) ([6a5ecc4](https://github.com/betagouv/api-subventions-asso/commit/6a5ecc42166618af549ba33a07a40981334105ce))
- **api:** group associations names by rna or siren ([#504](https://github.com/betagouv/api-subventions-asso/issues/504)) ([7f8d501](https://github.com/betagouv/api-subventions-asso/commit/7f8d50118ccf4fa9f272ab89223f476a05404c47))
- **api:** uniformize creation jwt token ([ea13507](https://github.com/betagouv/api-subventions-asso/commit/ea1350700cb8b927f9a96717447abf7b63c14d33))
- **api:** update associationName ([dfc7c56](https://github.com/betagouv/api-subventions-asso/commit/dfc7c561b493e58c6691dd7fe5aeba712b1bc84a))
- **front, api:** clean dauphin and subvention table ([#472](https://github.com/betagouv/api-subventions-asso/issues/472)) ([3c92975](https://github.com/betagouv/api-subventions-asso/commit/3c929753278cc575715b4e9b2f3088c834478fab))
- **front:** fix breadcrumb ([#502](https://github.com/betagouv/api-subventions-asso/issues/502)) ([9166e28](https://github.com/betagouv/api-subventions-asso/commit/9166e2862c58870340c5682f45583c21c1f6c767))
- **front:** fix search history display when no history ([58ec176](https://github.com/betagouv/api-subventions-asso/commit/58ec1768997bad26cffc7b449f2f1200dcf49a7c))
- **front:** fix stack overflow on search ([fb01006](https://github.com/betagouv/api-subventions-asso/commit/fb01006d0e9227d71b48554ed59ba7600f70a550))
- **front:** search by siret ([#505](https://github.com/betagouv/api-subventions-asso/issues/505)) ([4132de6](https://github.com/betagouv/api-subventions-asso/commit/4132de6840beb5fda5069b9360e62c676d2e6fa7))

### Features

- **api, dto:** merge fonjep subvention raison with status ([957d627](https://github.com/betagouv/api-subventions-asso/commit/957d627d2db4ae2eaa63a49f53124c0780f973dd))
- **api, front:** find asso documents from API ASSO ([#500](https://github.com/betagouv/api-subventions-asso/issues/500)) ([720eb8d](https://github.com/betagouv/api-subventions-asso/commit/720eb8dff34031e0196078d8b86aa0d5cfcc80af))
- **api:** add authentication for consumer user [#512](https://github.com/betagouv/api-subventions-asso/issues/512) ([9e6d97b](https://github.com/betagouv/api-subventions-asso/commit/9e6d97be354f37e4394aac4acdfaf6bd3f37be2f))
- **api:** add stats to user ([#470](https://github.com/betagouv/api-subventions-asso/issues/470)) ([884513a](https://github.com/betagouv/api-subventions-asso/commit/884513ae2aee670d637ca5c844132e0ee469ac41))
- **api:** create consumer user ([1048339](https://github.com/betagouv/api-subventions-asso/commit/1048339c26abfc460b62a7f2df1d98645ad69524))
- **api:** handle new FONJEP file with versements ([e9dead6](https://github.com/betagouv/api-subventions-asso/commit/e9dead6c40cdb4bdc58213df157d1ac47b4d63ff))
- **api:** manage user in current request ([#468](https://github.com/betagouv/api-subventions-asso/issues/468)) ([47772b1](https://github.com/betagouv/api-subventions-asso/commit/47772b12c4c0f0b870fab712342ccd04d6454deb))
- **api:** use UserDbo in UserRepository collection type ([#524](https://github.com/betagouv/api-subventions-asso/issues/524)) ([7d4f52d](https://github.com/betagouv/api-subventions-asso/commit/7d4f52d3bf53580ba65184cce773f5310b1c22bb))
- **front,api:** add signup date to user ([#473](https://github.com/betagouv/api-subventions-asso/issues/473)) ([af97192](https://github.com/betagouv/api-subventions-asso/commit/af971926102b2c78b2685d93777a2ffad1e1bc32))
- **front:** add alert on document status ([#507](https://github.com/betagouv/api-subventions-asso/issues/507)) ([aec43a6](https://github.com/betagouv/api-subventions-asso/commit/aec43a65b6e4d31d56c5f25bf80e10e19f9f33df))
- **front:** add contacts csv download ([#501](https://github.com/betagouv/api-subventions-asso/issues/501)) ([3850082](https://github.com/betagouv/api-subventions-asso/commit/3850082543111158d59d6f5196de751ebe967ec5))
- **front:** disable matomo ([#469](https://github.com/betagouv/api-subventions-asso/issues/469)) ([44ebb9c](https://github.com/betagouv/api-subventions-asso/commit/44ebb9cfa0652418b42ec4c9b2e5f9fc38b0c6cf))
- **front:** init front unit tests ([#508](https://github.com/betagouv/api-subventions-asso/issues/508)) ([8031677](https://github.com/betagouv/api-subventions-asso/commit/8031677944889048ed9f904f8e8d0b5fbcdd4e20))
- **front:** make click on icon of CardDocument active ([#466](https://github.com/betagouv/api-subventions-asso/issues/466)) ([2714c91](https://github.com/betagouv/api-subventions-asso/commit/2714c91c0581a22e354265dbbe1a01d05babf80f))
- **front:** update search placeholder ([#506](https://github.com/betagouv/api-subventions-asso/issues/506)) ([831785a](https://github.com/betagouv/api-subventions-asso/commit/831785a7ae26a04ba41d12f8944ac5f1dcea1736))

## [0.16.2](https://github.com/betagouv/api-subventions-asso/compare/v0.16.1...v0.16.2) (2022-10-14)

### Bug Fixes

- **api:** fix send wrong error on error in /auth/login ([#503](https://github.com/betagouv/api-subventions-asso/issues/503)) ([20a3e0e](https://github.com/betagouv/api-subventions-asso/commit/20a3e0e71e457d8a3b76b0040da9f08efc5f68b9))
- **api:** group associations names by rna or siren ([#504](https://github.com/betagouv/api-subventions-asso/issues/504)) ([faae9c5](https://github.com/betagouv/api-subventions-asso/commit/faae9c5e4a2177922d7e50ff06f875c39837a571))
- **front:** fix breadcrumb ([#502](https://github.com/betagouv/api-subventions-asso/issues/502)) ([147b483](https://github.com/betagouv/api-subventions-asso/commit/147b4838a107cf065b9f099d02be14b6d28c43f0))
- **front:** search by siret ([#505](https://github.com/betagouv/api-subventions-asso/issues/505)) ([5495181](https://github.com/betagouv/api-subventions-asso/commit/5495181992283d37dc63a1280f19359a37bdae63))

### Features

- **front:** add alert on document status ([#507](https://github.com/betagouv/api-subventions-asso/issues/507)) ([f751555](https://github.com/betagouv/api-subventions-asso/commit/f75155574a63decd94073494aa173d8d899fd21a))
- **front:** update search placeholder ([#506](https://github.com/betagouv/api-subventions-asso/issues/506)) ([843af17](https://github.com/betagouv/api-subventions-asso/commit/843af17aa1b7270ab1531f2d9aebc2b773a6ced9))

## [0.16.1](https://github.com/betagouv/api-subventions-asso/compare/v0.16.0...v0.16.1) (2022-10-13)

### Bug Fixes

- **front:** fix stack overflow on search ([57e7e08](https://github.com/betagouv/api-subventions-asso/commit/57e7e08e89e36ea72fe3a1bfc0429a4e92054c57))

### Features

- **api, front:** find asso documents from API ASSO ([#500](https://github.com/betagouv/api-subventions-asso/issues/500)) ([6538650](https://github.com/betagouv/api-subventions-asso/commit/6538650041b2cbea78fec238e50ae6fabc751b7a))

# [0.16.0](https://github.com/betagouv/api-subventions-asso/compare/v0.15.4...v0.16.0) (2022-10-12)

### Bug Fixes

- **front, api:** clean dauphin and subvention table ([#472](https://github.com/betagouv/api-subventions-asso/issues/472)) ([e2644fe](https://github.com/betagouv/api-subventions-asso/commit/e2644fe73749b893c72c588bc815a8083cb34fe9))
- **front:** fix search history display when no history ([315977e](https://github.com/betagouv/api-subventions-asso/commit/315977e334ec8d7f2db32d915380773b0373d8c0))

### Features

- **api:** add stats to user ([#470](https://github.com/betagouv/api-subventions-asso/issues/470)) ([798b51e](https://github.com/betagouv/api-subventions-asso/commit/798b51ea90fe1df5b46c5387fc6f46e8ab87524b))
- **api:** handle new FONJEP file with versements ([729d59f](https://github.com/betagouv/api-subventions-asso/commit/729d59f736a02ecec5fa013a30bc4f50a65ccf51))
- **api:** manage user in current request ([#468](https://github.com/betagouv/api-subventions-asso/issues/468)) ([397cfcd](https://github.com/betagouv/api-subventions-asso/commit/397cfcd4fecba36725b85d6822905b9e2517fd35))
- **front,api:** add signup date to user ([#473](https://github.com/betagouv/api-subventions-asso/issues/473)) ([180c855](https://github.com/betagouv/api-subventions-asso/commit/180c855cec6dd8500ba035cc7f9d8c3f9241d2ca))
- **front:** disable matomo ([#469](https://github.com/betagouv/api-subventions-asso/issues/469)) ([e243201](https://github.com/betagouv/api-subventions-asso/commit/e2432011067e00e7b1a2a10e28993e4c17156da3))
- **front:** make click on icon of CardDocument active ([#466](https://github.com/betagouv/api-subventions-asso/issues/466)) ([3949016](https://github.com/betagouv/api-subventions-asso/commit/3949016c9b0e6903520c8d75b55aad156e521c11))

## [0.16.2](https://github.com/betagouv/api-subventions-asso/compare/v0.16.1...v0.16.2) (2022-10-14)

### Bug Fixes

- **api:** fix send wrong error on error in /auth/login ([#503](https://github.com/betagouv/api-subventions-asso/issues/503)) ([20a3e0e](https://github.com/betagouv/api-subventions-asso/commit/20a3e0e71e457d8a3b76b0040da9f08efc5f68b9))
- **api:** group associations names by rna or siren ([#504](https://github.com/betagouv/api-subventions-asso/issues/504)) ([faae9c5](https://github.com/betagouv/api-subventions-asso/commit/faae9c5e4a2177922d7e50ff06f875c39837a571))
- **front:** fix breadcrumb ([#502](https://github.com/betagouv/api-subventions-asso/issues/502)) ([147b483](https://github.com/betagouv/api-subventions-asso/commit/147b4838a107cf065b9f099d02be14b6d28c43f0))
- **front:** search by siret ([#505](https://github.com/betagouv/api-subventions-asso/issues/505)) ([5495181](https://github.com/betagouv/api-subventions-asso/commit/5495181992283d37dc63a1280f19359a37bdae63))

### Features

- **front:** add alert on document status ([#507](https://github.com/betagouv/api-subventions-asso/issues/507)) ([f751555](https://github.com/betagouv/api-subventions-asso/commit/f75155574a63decd94073494aa173d8d899fd21a))
- **front:** update search placeholder ([#506](https://github.com/betagouv/api-subventions-asso/issues/506)) ([843af17](https://github.com/betagouv/api-subventions-asso/commit/843af17aa1b7270ab1531f2d9aebc2b773a6ced9))

## [0.16.1](https://github.com/betagouv/api-subventions-asso/compare/v0.16.0...v0.16.1) (2022-10-13)

### Bug Fixes

- **front:** fix stack overflow on search ([57e7e08](https://github.com/betagouv/api-subventions-asso/commit/57e7e08e89e36ea72fe3a1bfc0429a4e92054c57))

### Features

- **api, front:** find asso documents from API ASSO ([#500](https://github.com/betagouv/api-subventions-asso/issues/500)) ([6538650](https://github.com/betagouv/api-subventions-asso/commit/6538650041b2cbea78fec238e50ae6fabc751b7a))

# [0.16.0](https://github.com/betagouv/api-subventions-asso/compare/v0.15.4...v0.16.0) (2022-10-12)

### Bug Fixes

- **front, api:** clean dauphin and subvention table ([#472](https://github.com/betagouv/api-subventions-asso/issues/472)) ([e2644fe](https://github.com/betagouv/api-subventions-asso/commit/e2644fe73749b893c72c588bc815a8083cb34fe9))
- **front:** fix search history display when no history ([315977e](https://github.com/betagouv/api-subventions-asso/commit/315977e334ec8d7f2db32d915380773b0373d8c0))

### Features

- **api:** add stats to user ([#470](https://github.com/betagouv/api-subventions-asso/issues/470)) ([798b51e](https://github.com/betagouv/api-subventions-asso/commit/798b51ea90fe1df5b46c5387fc6f46e8ab87524b))
- **api:** handle new FONJEP file with versements ([729d59f](https://github.com/betagouv/api-subventions-asso/commit/729d59f736a02ecec5fa013a30bc4f50a65ccf51))
- **api:** manage user in current request ([#468](https://github.com/betagouv/api-subventions-asso/issues/468)) ([397cfcd](https://github.com/betagouv/api-subventions-asso/commit/397cfcd4fecba36725b85d6822905b9e2517fd35))
- **front,api:** add signup date to user ([#473](https://github.com/betagouv/api-subventions-asso/issues/473)) ([180c855](https://github.com/betagouv/api-subventions-asso/commit/180c855cec6dd8500ba035cc7f9d8c3f9241d2ca))
- **front:** disable matomo ([#469](https://github.com/betagouv/api-subventions-asso/issues/469)) ([e243201](https://github.com/betagouv/api-subventions-asso/commit/e2432011067e00e7b1a2a10e28993e4c17156da3))
- **front:** make click on icon of CardDocument active ([#466](https://github.com/betagouv/api-subventions-asso/issues/466)) ([3949016](https://github.com/betagouv/api-subventions-asso/commit/3949016c9b0e6903520c8d75b55aad156e521c11))

## [0.15.5](https://github.com/betagouv/api-subventions-asso/compare/v0.15.4...v0.15.5) (2022-10-17)

### Bug Fixes

- **api:** error on dauphin is hs ([bf98860](https://github.com/betagouv/api-subventions-asso/commit/bf9886056d6fabe1d161e8959cbd2983c71355ee))

## [0.15.4](https://github.com/betagouv/api-subventions-asso/compare/v0.14.9...v0.15.4) (2022-10-11)

### Bug Fixes

- **api:** fix chorus parser ([df1745a](https://github.com/betagouv/api-subventions-asso/commit/df1745a9e1b3d249d3e9ad2b9e3de1a7439bd8be))
- **api:** fix import fonjep script ([#464](https://github.com/betagouv/api-subventions-asso/issues/464)) ([65118c7](https://github.com/betagouv/api-subventions-asso/commit/65118c7a921e84db81c11266eaf67fd74b99e6d3))
- **api:** log log log ([#457](https://github.com/betagouv/api-subventions-asso/issues/457)) ([e73a10e](https://github.com/betagouv/api-subventions-asso/commit/e73a10ef8f24962633df56e05801654feb0aee5d))
- **api:** tests ([#451](https://github.com/betagouv/api-subventions-asso/issues/451)) ([16f5320](https://github.com/betagouv/api-subventions-asso/commit/16f53201730cc5df36631499e846f04c1e706206))
- **front:** add nojs for svelte ([#420](https://github.com/betagouv/api-subventions-asso/issues/420)) ([897d781](https://github.com/betagouv/api-subventions-asso/commit/897d781473c9f88e552850dca2c1c918ef5b12e4))
- **front:** fix mail to contact for no js help ([#452](https://github.com/betagouv/api-subventions-asso/issues/452)) ([d50c323](https://github.com/betagouv/api-subventions-asso/commit/d50c3238fd137cd762d034f6a606a38fffbb75e8))
- **front:** fix versement domaine foncitonel for fonjep versement ([ed12393](https://github.com/betagouv/api-subventions-asso/commit/ed1239373365c180d942c2fb492fb1edf30070f1))

### Features

- **api, dto:** add rcs extract for associations ([7f9e286](https://github.com/betagouv/api-subventions-asso/commit/7f9e28688384212bc87f03201513007c24a00137))
- **api, front, dto:** display rna-siren differences ([9f1b24b](https://github.com/betagouv/api-subventions-asso/commit/9f1b24bb9267102f85139c4d2ce9f045ea21c67c))
- **api:** handle new FONJEP file with versements ([1f202c0](https://github.com/betagouv/api-subventions-asso/commit/1f202c0e46417f7c94d3ae10b9205797cacee427))
- **api:** rename fonjep collection to fonjepSubvention ([#461](https://github.com/betagouv/api-subventions-asso/issues/461)) ([9231625](https://github.com/betagouv/api-subventions-asso/commit/92316252ea5ea0232860f180c2eec9827b54a1ea))
- **api:** update parser for new data 2022 ([#423](https://github.com/betagouv/api-subventions-asso/issues/423)) ([c82b48c](https://github.com/betagouv/api-subventions-asso/commit/c82b48c37a3a8fc83c7ca9c076fb5458708041cd))
- **front:** change pipedrive chat playbook ([a8d3f8d](https://github.com/betagouv/api-subventions-asso/commit/a8d3f8d422672ac6cd600877c83e535b1d6f6ca5))
- **front:** disable own account suppression ([c197511](https://github.com/betagouv/api-subventions-asso/commit/c1975112055bd2f2046a58a649a5091b73c33110))
- **front:** move home page to svelte ([#441](https://github.com/betagouv/api-subventions-asso/issues/441)) ([3764a58](https://github.com/betagouv/api-subventions-asso/commit/3764a58e18c77238434928b8623d455ab4178a3b))
- **front:** use a unique GenericModal ([a82b002](https://github.com/betagouv/api-subventions-asso/commit/a82b002530a087f936ce1164d0159e588773f542))

## [0.15.3](https://github.com/betagouv/api-subventions-asso/compare/v0.15.2...v0.15.3) (2022-09-29)

### Bug Fixes

- **api:** fix chorus parser ([df1745a](https://github.com/betagouv/api-subventions-asso/commit/df1745a9e1b3d249d3e9ad2b9e3de1a7439bd8be))
- **front:** fix versement domaine foncitonel for fonjep versement ([5142146](https://github.com/betagouv/api-subventions-asso/commit/5142146a64511059fc56b6d171e22d4ab4856ab4))

## [0.14.9](https://github.com/betagouv/api-subventions-asso/compare/v0.14.8...v0.14.9) (2022-09-23)

### Bug Fixes

- **front:** disable show provider modal on botton of subvention table ([0f07e8f](https://github.com/betagouv/api-subventions-asso/commit/0f07e8fdc46039b3702adc013ce30a9788fc1ec0))
- **api:** tests ([#451](https://github.com/betagouv/api-subventions-asso/issues/451)) ([b892855](https://github.com/betagouv/api-subventions-asso/commit/b8928552345839f5ede3b688a028cf061b195792))
- **front:** add nojs for svelte ([#420](https://github.com/betagouv/api-subventions-asso/issues/420)) ([06c4b65](https://github.com/betagouv/api-subventions-asso/commit/06c4b65c38e2f2c04cf2a45541a68e9705c1e0cd))
- **front:** fix mail to contact for no js help ([#452](https://github.com/betagouv/api-subventions-asso/issues/452)) ([aa13a99](https://github.com/betagouv/api-subventions-asso/commit/aa13a99101c422272e7ce5437bc06b92ce5ed815))

### Features

- **api, dto:** add rcs extract for associations ([ccd18fa](https://github.com/betagouv/api-subventions-asso/commit/ccd18fa2781b432636e354f2bd9dab0ab48ddcb9))
- **api, front, dto:** display rna-siren differences ([3b6d6ba](https://github.com/betagouv/api-subventions-asso/commit/3b6d6ba99c51e18542eab033a79fb5611abb0a53))
- **api:** handle new FONJEP file with versements ([5d5a762](https://github.com/betagouv/api-subventions-asso/commit/5d5a762eabcc0ff212c4b5454ee9d57d4a389044))
- **api:** rename fonjep collection to fonjepSubvention ([#461](https://github.com/betagouv/api-subventions-asso/issues/461)) ([79bea66](https://github.com/betagouv/api-subventions-asso/commit/79bea6633a1fa40106436153ab91a1bc18a5e975))
- **api:** update parser for new data 2022 ([#423](https://github.com/betagouv/api-subventions-asso/issues/423)) ([060ea1c](https://github.com/betagouv/api-subventions-asso/commit/060ea1c0d29887e3a2683c8af924703b19a7b406))
- **front:** disable own account suppression ([46096c3](https://github.com/betagouv/api-subventions-asso/commit/46096c3e58abb3866cb754c29cc3c44eb0ef39cb))
- **front:** move home page to svelte ([#441](https://github.com/betagouv/api-subventions-asso/issues/441)) ([be65658](https://github.com/betagouv/api-subventions-asso/commit/be65658c1e4831ab713b433b85d99eda6841d3b0))
- **front:** use a unique GenericModal ([6351e5c](https://github.com/betagouv/api-subventions-asso/commit/6351e5c95c37ee1baf0ce884f0c340138c7a4ba4))

## [0.14.8](https://github.com/betagouv/api-subventions-asso/compare/v0.14.7...v0.14.8) (2022-09-21)

### Bug Fixes

- **api, front:** crash on search asso without siren ([9a14dfe](https://github.com/betagouv/api-subventions-asso/commit/9a14dfe9bb7b155081732f5c32b18a90b2d3b155))

## [0.14.7](https://github.com/betagouv/api-subventions-asso/compare/v0.14.6...v0.14.7) (2022-09-06)

### Bug Fixes

- **front:** remove Dauphin from provider list ([edcd979](https://github.com/betagouv/api-subventions-asso/commit/edcd979e217c1d228b329c95d91d06695ee792d0))

## [0.14.6](https://github.com/betagouv/api-subventions-asso/compare/v0.14.5...v0.14.6) (2022-08-30)

### Bug Fixes

- **front:** fix subvention flux store refresh ([e7edc6c](https://github.com/betagouv/api-subventions-asso/commit/e7edc6c82fb51d0f45e78b871e2567b72d16ea05))

## [0.14.5](https://github.com/betagouv/api-subventions-asso/compare/v0.14.4...v0.14.5) (2022-08-30)

### Bug Fixes

- **api:** disable dauphin provider ([616d6e1](https://github.com/betagouv/api-subventions-asso/commit/616d6e126159998205ff6c774dc7b278d6ccfe8a))

## [0.14.4](https://github.com/betagouv/api-subventions-asso/compare/v0.14.3...v0.14.4) (2022-08-24)

### Bug Fixes

- **api:** fix create fonjep entity in parser ([d3ead02](https://github.com/betagouv/api-subventions-asso/commit/d3ead02d27acadc19e83a79291af126c30be8e6c))

## [0.14.3](https://github.com/betagouv/api-subventions-asso/compare/v0.14.2...v0.14.3) (2022-08-23)

### Bug Fixes

- **api:** fix migration ([c293bb6](https://github.com/betagouv/api-subventions-asso/commit/c293bb633fa4a3666a3a307fdb9d526b56af7dcc))

## [0.14.2](https://github.com/betagouv/api-subventions-asso/compare/v0.14.1...v0.14.2) (2022-08-23)

### Bug Fixes

- **api:** add chorus index on siret ([#417](https://github.com/betagouv/api-subventions-asso/issues/417)) ([1c9f8cf](https://github.com/betagouv/api-subventions-asso/commit/1c9f8cff67aa5502f2b3883103270c5c5b6a0b71))
- **front:** clean texts ([#416](https://github.com/betagouv/api-subventions-asso/issues/416)) ([b218198](https://github.com/betagouv/api-subventions-asso/commit/b21819870cdefbc2e54a9c1f9d6f4982a0c5a4bd))
- **front:** disable breaking line for table cells ([#415](https://github.com/betagouv/api-subventions-asso/issues/415)) ([35738b0](https://github.com/betagouv/api-subventions-asso/commit/35738b012b021d0a86442baf9cbe0b2551a48fee))
- **front:** fix bug filter on etablissements ([#418](https://github.com/betagouv/api-subventions-asso/issues/418)) ([6cf259a](https://github.com/betagouv/api-subventions-asso/commit/6cf259aa4fb84225feac7bd6afe878ae9431f024)), closes [#417](https://github.com/betagouv/api-subventions-asso/issues/417)

## [0.14.1](https://github.com/betagouv/api-subventions-asso/compare/v0.14.0...v0.14.1) (2022-08-22)

### Bug Fixes

- **api:** fix error on search association ([#405](https://github.com/betagouv/api-subventions-asso/issues/405)) ([778a259](https://github.com/betagouv/api-subventions-asso/commit/778a25925192d5a524def9aae09afeae122fbb0c))
- **front:** handle dark mode for tables ([#401](https://github.com/betagouv/api-subventions-asso/issues/401)) ([cd209fb](https://github.com/betagouv/api-subventions-asso/commit/cd209fb0f7a5bf7730cec3a8b125c52ee5ee2f65))

# [0.14.0](https://github.com/betagouv/api-subventions-asso/compare/v0.13.1...v0.14.0) (2022-08-18)

### Features

- **api, dto, front:** store rna and siren values in Association ([#387](https://github.com/betagouv/api-subventions-asso/issues/387)) ([d55b547](https://github.com/betagouv/api-subventions-asso/commit/d55b547a73fa96122386dfa49798cf1c675802bd))
- **api:** add date of last import for datagouv files ([#392](https://github.com/betagouv/api-subventions-asso/issues/392)) ([12a7cf1](https://github.com/betagouv/api-subventions-asso/commit/12a7cf1f2f60d1dc9f614e71a5f4bcdf99db3e4b))
- **front:** update dashboard from bizdev comments ([#391](https://github.com/betagouv/api-subventions-asso/issues/391)) ([2dde3b3](https://github.com/betagouv/api-subventions-asso/commit/2dde3b3509707e32be29ed6885f0d719cc562f0a))

## [0.13.1](https://github.com/betagouv/api-subventions-asso/compare/v0.13.0...v0.13.1) (2022-07-28)

### Bug Fixes

- **api:** fix error in script ([bedf946](https://github.com/betagouv/api-subventions-asso/commit/bedf946ef7688b4a05e0d08a2fd3a9363c3389b8))

# [0.13.0](https://github.com/betagouv/api-subventions-asso/compare/v0.12.3...v0.13.0) (2022-07-28)

### Bug Fixes

- **front:** fix many little bugs ([d52ea3a](https://github.com/betagouv/api-subventions-asso/commit/d52ea3a0f7e3cfbfb2661af83e215824196558dd))

### Features

- **api, dto:** retrieve API Entreprise etablissement headcount ([#367](https://github.com/betagouv/api-subventions-asso/issues/367)) ([82419e6](https://github.com/betagouv/api-subventions-asso/commit/82419e6a596d6a0922426c89cc6c5803205be0bf))
- **api:** add compare command for FONJEP CLI ([7f1b82a](https://github.com/betagouv/api-subventions-asso/commit/7f1b82a2291c1a8a209f7d3832e28c2f4cd18d79))
- **api:** add posibilities to remove user ([#364](https://github.com/betagouv/api-subventions-asso/issues/364)) ([cd562d3](https://github.com/betagouv/api-subventions-asso/commit/cd562d38bbd4d398fdab5fb8319a4f00365207aa))
- **api:** add SendInBlue mail provider ([#370](https://github.com/betagouv/api-subventions-asso/issues/370)) ([4d15231](https://github.com/betagouv/api-subventions-asso/commit/4d15231486b748df06ff5876f8502da6565ba37e))
- **front:** add modals providers ([#380](https://github.com/betagouv/api-subventions-asso/issues/380)) ([7f5e04a](https://github.com/betagouv/api-subventions-asso/commit/7f5e04a9bfca4aceffa25936f817e08ec7f143ed))
- **front:** add sort in table ([#369](https://github.com/betagouv/api-subventions-asso/issues/369)) ([c2ae588](https://github.com/betagouv/api-subventions-asso/commit/c2ae5889194487a7364b0575a05bdd920d3783f9))
- **front:** add versements and subvention modals ([#381](https://github.com/betagouv/api-subventions-asso/issues/381)) ([1624c6a](https://github.com/betagouv/api-subventions-asso/commit/1624c6ac698850c8f830113ec25e287518831d54))
- **front:** change title of etablissements and target blank on download document ([#377](https://github.com/betagouv/api-subventions-asso/issues/377)) ([6b1bd8f](https://github.com/betagouv/api-subventions-asso/commit/6b1bd8f31cdf22a43bce9824490391ce59919cf7))
- **front:** enable matomo with datasub id ([#368](https://github.com/betagouv/api-subventions-asso/issues/368)) ([e03aee0](https://github.com/betagouv/api-subventions-asso/commit/e03aee02b121a07d59a8a0339e60ce0d0018474e)), closes [#366](https://github.com/betagouv/api-subventions-asso/issues/366)

## [0.12.4](https://github.com/betagouv/api-subventions-asso/compare/v0.12.3...v0.12.4) (2022-07-21)

**Note:** Version bump only for package api-subventions-asso

## [0.12.3](https://github.com/betagouv/api-subventions-asso/compare/v0.12.2...v0.12.3) (2022-07-12)

### Bug Fixes

- **front:** fix no data found if no sub found ([1e94beb](https://github.com/betagouv/api-subventions-asso/commit/1e94beb23648302ed20bcc1ab9332b2fff184977))

## [0.12.2](https://github.com/betagouv/api-subventions-asso/compare/v0.12.1...v0.12.2) (2022-07-12)

**Note:** Version bump only for package api-subventions-asso

## [0.12.1](https://github.com/betagouv/api-subventions-asso/compare/v0.12.0...v0.12.1) (2022-07-11)

### Bug Fixes

- **front:** fix build svelte ([cd7aef9](https://github.com/betagouv/api-subventions-asso/commit/cd7aef93954c55f95ff207beb3a6666f5602f36b))

# [0.12.0](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.12.0) (2022-07-11)

### Bug Fixes

- **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([b355edf](https://github.com/betagouv/api-subventions-asso/commit/b355edf74d39a0fa7bc588fd6c4a25df2780849f))
- **api:** fix date modification ([35a0ade](https://github.com/betagouv/api-subventions-asso/commit/35a0aded8bdb71fd47d708f2cb0f344aabba2750))
- **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
- **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))
- **front:** fix error on capitalize string ([#339](https://github.com/betagouv/api-subventions-asso/issues/339)) ([3326a01](https://github.com/betagouv/api-subventions-asso/commit/3326a010247dcd4a356280326f78aa1de0e6a45d))
- **front:** spelling correction ([#346](https://github.com/betagouv/api-subventions-asso/issues/346)) ([a26af0f](https://github.com/betagouv/api-subventions-asso/commit/a26af0f6d3689f3148994a41b913a4858fc31316))

### Features

- **api:** add route for getting documents ([#324](https://github.com/betagouv/api-subventions-asso/issues/324)) ([17acc6a](https://github.com/betagouv/api-subventions-asso/commit/17acc6a67992176908410b221264b87404a4c312))
- **api:** add service for api entreprise ([#342](https://github.com/betagouv/api-subventions-asso/issues/342)) ([382bfba](https://github.com/betagouv/api-subventions-asso/commit/382bfba952ca7a24c5b0479eee21b652e71f826a))
- **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([0a354f5](https://github.com/betagouv/api-subventions-asso/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))
- **api:** apply new rules for api asso documents ([#336](https://github.com/betagouv/api-subventions-asso/issues/336)) ([145f1b4](https://github.com/betagouv/api-subventions-asso/commit/145f1b4823c7b876b75cbe2a990d0a424f221ee1))
- **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([e15ce0c](https://github.com/betagouv/api-subventions-asso/commit/e15ce0c1f12582101870b9b6ef3769f82c931a66))
- **front:** add cgu page ([#313](https://github.com/betagouv/api-subventions-asso/issues/313)) ([69fd4d5](https://github.com/betagouv/api-subventions-asso/commit/69fd4d58d382e38302abfbe43257a090715eda9b))
- **front:** add mailto activation mail not received ([#295](https://github.com/betagouv/api-subventions-asso/issues/295)) ([be2498a](https://github.com/betagouv/api-subventions-asso/commit/be2498a35f39e80950a41aa6a547094c1affb0b0)), closes [#292](https://github.com/betagouv/api-subventions-asso/issues/292) [#239](https://github.com/betagouv/api-subventions-asso/issues/239) [#207](https://github.com/betagouv/api-subventions-asso/issues/207) [#245](https://github.com/betagouv/api-subventions-asso/issues/245) [#242](https://github.com/betagouv/api-subventions-asso/issues/242) [#243](https://github.com/betagouv/api-subventions-asso/issues/243) [#249](https://github.com/betagouv/api-subventions-asso/issues/249) [#255](https://github.com/betagouv/api-subventions-asso/issues/255) [#253](https://github.com/betagouv/api-subventions-asso/issues/253) [#258](https://github.com/betagouv/api-subventions-asso/issues/258) [#263](https://github.com/betagouv/api-subventions-asso/issues/263) [#259](https://github.com/betagouv/api-subventions-asso/issues/259) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#270](https://github.com/betagouv/api-subventions-asso/issues/270) [#265](https://github.com/betagouv/api-subventions-asso/issues/265)
- **front:** update app description ([#306](https://github.com/betagouv/api-subventions-asso/issues/306)) ([6fc26b5](https://github.com/betagouv/api-subventions-asso/commit/6fc26b5b1b7b28bf81623c1b995726d6b51b90c6))

## [0.11.3](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.11.3) (2022-07-07)

### Bug Fixes

- **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([b355edf](https://github.com/betagouv/api-subventions-asso/commit/b355edf74d39a0fa7bc588fd6c4a25df2780849f))
- **api:** fix date modification ([35a0ade](https://github.com/betagouv/api-subventions-asso/commit/35a0aded8bdb71fd47d708f2cb0f344aabba2750))
- **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
- **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))
- **front:** fix error on capitalize string ([#339](https://github.com/betagouv/api-subventions-asso/issues/339)) ([3326a01](https://github.com/betagouv/api-subventions-asso/commit/3326a010247dcd4a356280326f78aa1de0e6a45d))

### Features

- **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([0a354f5](https://github.com/betagouv/api-subventions-asso/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))
- **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([e15ce0c](https://github.com/betagouv/api-subventions-asso/commit/e15ce0c1f12582101870b9b6ef3769f82c931a66))
- **front:** add cgu page ([#313](https://github.com/betagouv/api-subventions-asso/issues/313)) ([69fd4d5](https://github.com/betagouv/api-subventions-asso/commit/69fd4d58d382e38302abfbe43257a090715eda9b))
- **front:** add mailto activation mail not received ([#295](https://github.com/betagouv/api-subventions-asso/issues/295)) ([be2498a](https://github.com/betagouv/api-subventions-asso/commit/be2498a35f39e80950a41aa6a547094c1affb0b0)), closes [#292](https://github.com/betagouv/api-subventions-asso/issues/292) [#239](https://github.com/betagouv/api-subventions-asso/issues/239) [#207](https://github.com/betagouv/api-subventions-asso/issues/207) [#245](https://github.com/betagouv/api-subventions-asso/issues/245) [#242](https://github.com/betagouv/api-subventions-asso/issues/242) [#243](https://github.com/betagouv/api-subventions-asso/issues/243) [#249](https://github.com/betagouv/api-subventions-asso/issues/249) [#255](https://github.com/betagouv/api-subventions-asso/issues/255) [#253](https://github.com/betagouv/api-subventions-asso/issues/253) [#258](https://github.com/betagouv/api-subventions-asso/issues/258) [#263](https://github.com/betagouv/api-subventions-asso/issues/263) [#259](https://github.com/betagouv/api-subventions-asso/issues/259) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#270](https://github.com/betagouv/api-subventions-asso/issues/270) [#265](https://github.com/betagouv/api-subventions-asso/issues/265)
- **front:** update app description ([#306](https://github.com/betagouv/api-subventions-asso/issues/306)) ([6fc26b5](https://github.com/betagouv/api-subventions-asso/commit/6fc26b5b1b7b28bf81623c1b995726d6b51b90c6))

## [0.11.2](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.11.2) (2022-07-01)

### Bug Fixes

- **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([b355edf](https://github.com/betagouv/api-subventions-asso/commit/b355edf74d39a0fa7bc588fd6c4a25df2780849f))
- **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
- **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))
- **front:** fix error on capitalize string ([#339](https://github.com/betagouv/api-subventions-asso/issues/339)) ([3326a01](https://github.com/betagouv/api-subventions-asso/commit/3326a010247dcd4a356280326f78aa1de0e6a45d))

### Bug Fixes

- **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([0a354f5](https://github.com/betagouv/api-subventions-asso/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))
- **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([e15ce0c](https://github.com/betagouv/api-subventions-asso/commit/e15ce0c1f12582101870b9b6ef3769f82c931a66))
- **front:** add cgu page ([#313](https://github.com/betagouv/api-subventions-asso/issues/313)) ([69fd4d5](https://github.com/betagouv/api-subventions-asso/commit/69fd4d58d382e38302abfbe43257a090715eda9b))
- **front:** add mailto activation mail not received ([#295](https://github.com/betagouv/api-subventions-asso/issues/295)) ([be2498a](https://github.com/betagouv/api-subventions-asso/commit/be2498a35f39e80950a41aa6a547094c1affb0b0)), closes [#292](https://github.com/betagouv/api-subventions-asso/issues/292) [#239](https://github.com/betagouv/api-subventions-asso/issues/239) [#207](https://github.com/betagouv/api-subventions-asso/issues/207) [#245](https://github.com/betagouv/api-subventions-asso/issues/245) [#242](https://github.com/betagouv/api-subventions-asso/issues/242) [#243](https://github.com/betagouv/api-subventions-asso/issues/243) [#249](https://github.com/betagouv/api-subventions-asso/issues/249) [#255](https://github.com/betagouv/api-subventions-asso/issues/255) [#253](https://github.com/betagouv/api-subventions-asso/issues/253) [#258](https://github.com/betagouv/api-subventions-asso/issues/258) [#263](https://github.com/betagouv/api-subventions-asso/issues/263) [#259](https://github.com/betagouv/api-subventions-asso/issues/259) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#270](https://github.com/betagouv/api-subventions-asso/issues/270) [#265](https://github.com/betagouv/api-subventions-asso/issues/265)
- **front:** update app description ([#306](https://github.com/betagouv/api-subventions-asso/issues/306)) ([6fc26b5](https://github.com/betagouv/api-subventions-asso/commit/6fc26b5b1b7b28bf81623c1b995726d6b51b90c6))

## [0.11.1](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.11.1) (2022-06-30)

### Bug Fixes

- **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([b355edf](https://github.com/betagouv/api-subventions-asso/commit/b355edf74d39a0fa7bc588fd6c4a25df2780849f))
- **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
- **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))
- **front:** fix error on capitalize string ([c43b257](https://github.com/betagouv/api-subventions-asso/commit/c43b2573127c88360c838875130701b8698131c1))

### Features

- **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([0a354f5](https://github.com/betagouv/api-subventions-asso/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))
- **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([e15ce0c](https://github.com/betagouv/api-subventions-asso/commit/e15ce0c1f12582101870b9b6ef3769f82c931a66))
- **front:** add cgu page ([#313](https://github.com/betagouv/api-subventions-asso/issues/313)) ([69fd4d5](https://github.com/betagouv/api-subventions-asso/commit/69fd4d58d382e38302abfbe43257a090715eda9b))
- **front:** add mailto activation mail not received ([#295](https://github.com/betagouv/api-subventions-asso/issues/295)) ([be2498a](https://github.com/betagouv/api-subventions-asso/commit/be2498a35f39e80950a41aa6a547094c1affb0b0)), closes [#292](https://github.com/betagouv/api-subventions-asso/issues/292) [#239](https://github.com/betagouv/api-subventions-asso/issues/239) [#207](https://github.com/betagouv/api-subventions-asso/issues/207) [#245](https://github.com/betagouv/api-subventions-asso/issues/245) [#242](https://github.com/betagouv/api-subventions-asso/issues/242) [#243](https://github.com/betagouv/api-subventions-asso/issues/243) [#249](https://github.com/betagouv/api-subventions-asso/issues/249) [#255](https://github.com/betagouv/api-subventions-asso/issues/255) [#253](https://github.com/betagouv/api-subventions-asso/issues/253) [#258](https://github.com/betagouv/api-subventions-asso/issues/258) [#263](https://github.com/betagouv/api-subventions-asso/issues/263) [#259](https://github.com/betagouv/api-subventions-asso/issues/259) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#270](https://github.com/betagouv/api-subventions-asso/issues/270) [#265](https://github.com/betagouv/api-subventions-asso/issues/265)
- **front:** update app description ([#306](https://github.com/betagouv/api-subventions-asso/issues/306)) ([6fc26b5](https://github.com/betagouv/api-subventions-asso/commit/6fc26b5b1b7b28bf81623c1b995726d6b51b90c6))

# [0.11.0](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.11.0) (2022-06-21)

### Bug Fixes

- **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([4114b24](https://github.com/betagouv/api-subventions-asso/commit/4114b24923c55fa03e9758c169ddb505440d3e50))
- **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
- **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))

### Features

- **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([b43a1cf](https://github.com/betagouv/api-subventions-asso/commit/b43a1cfcdc068252eeef81dec59ea97c93c3b6c3))
- **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([1e2bf9f](https://github.com/betagouv/api-subventions-asso/commit/1e2bf9feacfb4a448763409cc952b1d0fa7f1054))
- **front:** add cgu page ([#313](https://github.com/betagouv/api-subventions-asso/issues/313)) ([51ca9c0](https://github.com/betagouv/api-subventions-asso/commit/51ca9c0439689e97bf2114f33708991bfdc10363))
- **front:** add mailto activation mail not received ([#295](https://github.com/betagouv/api-subventions-asso/issues/295)) ([8905344](https://github.com/betagouv/api-subventions-asso/commit/89053446e3610e1f701058827297809c9d4c6831)), closes [#292](https://github.com/betagouv/api-subventions-asso/issues/292) [#239](https://github.com/betagouv/api-subventions-asso/issues/239) [#207](https://github.com/betagouv/api-subventions-asso/issues/207) [#245](https://github.com/betagouv/api-subventions-asso/issues/245) [#242](https://github.com/betagouv/api-subventions-asso/issues/242) [#243](https://github.com/betagouv/api-subventions-asso/issues/243) [#249](https://github.com/betagouv/api-subventions-asso/issues/249) [#255](https://github.com/betagouv/api-subventions-asso/issues/255) [#253](https://github.com/betagouv/api-subventions-asso/issues/253) [#258](https://github.com/betagouv/api-subventions-asso/issues/258) [#263](https://github.com/betagouv/api-subventions-asso/issues/263) [#259](https://github.com/betagouv/api-subventions-asso/issues/259) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#270](https://github.com/betagouv/api-subventions-asso/issues/270) [#265](https://github.com/betagouv/api-subventions-asso/issues/265)
- **front:** update app description ([#306](https://github.com/betagouv/api-subventions-asso/issues/306)) ([dda81a3](https://github.com/betagouv/api-subventions-asso/commit/dda81a3ad9a0fb4187b53babfccd3421bd225e61))

## [0.10.7](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.7) (2022-06-21)

### Bug Fixes

- **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([4114b24](https://github.com/betagouv/api-subventions-asso/commit/4114b24923c55fa03e9758c169ddb505440d3e50))
- **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
- **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))

### Features

- **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([b43a1cf](https://github.com/betagouv/api-subventions-asso/commit/b43a1cfcdc068252eeef81dec59ea97c93c3b6c3))
- **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([1e2bf9f](https://github.com/betagouv/api-subventions-asso/commit/1e2bf9feacfb4a448763409cc952b1d0fa7f1054))
- **front:** add cgu page ([#313](https://github.com/betagouv/api-subventions-asso/issues/313)) ([51ca9c0](https://github.com/betagouv/api-subventions-asso/commit/51ca9c0439689e97bf2114f33708991bfdc10363))
- **front:** add mailto activation mail not received ([#295](https://github.com/betagouv/api-subventions-asso/issues/295)) ([8905344](https://github.com/betagouv/api-subventions-asso/commit/89053446e3610e1f701058827297809c9d4c6831)), closes [#292](https://github.com/betagouv/api-subventions-asso/issues/292) [#239](https://github.com/betagouv/api-subventions-asso/issues/239) [#207](https://github.com/betagouv/api-subventions-asso/issues/207) [#245](https://github.com/betagouv/api-subventions-asso/issues/245) [#242](https://github.com/betagouv/api-subventions-asso/issues/242) [#243](https://github.com/betagouv/api-subventions-asso/issues/243) [#249](https://github.com/betagouv/api-subventions-asso/issues/249) [#255](https://github.com/betagouv/api-subventions-asso/issues/255) [#253](https://github.com/betagouv/api-subventions-asso/issues/253) [#258](https://github.com/betagouv/api-subventions-asso/issues/258) [#263](https://github.com/betagouv/api-subventions-asso/issues/263) [#259](https://github.com/betagouv/api-subventions-asso/issues/259) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#270](https://github.com/betagouv/api-subventions-asso/issues/270) [#265](https://github.com/betagouv/api-subventions-asso/issues/265)
- **front:** update app description ([#306](https://github.com/betagouv/api-subventions-asso/issues/306)) ([dda81a3](https://github.com/betagouv/api-subventions-asso/commit/dda81a3ad9a0fb4187b53babfccd3421bd225e61))

## [0.10.8](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.8) (2022-06-24)

## [0.10.7](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.7) (2022-06-21)

## [0.10.6](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.6) (2022-06-21)

### Bug Fixes

- **api:** fix migration import ([bd13d3b](https://github.com/betagouv/api-subventions-asso/commit/bd13d3b564147de47d12de03a514d0a9ded0a1ae))

## [0.10.5](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.5) (2022-06-21)

### Bug Fixes

- **api:** fix wrong year on osiris data ([d3290e7](https://github.com/betagouv/api-subventions-asso/commit/d3290e709074a5f8397bf4590969b257200606c1))

## [0.10.4](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.4) (2022-06-14)

### Bug Fixes

- **front:** fix error errorcode is not defined ([8a2de34](https://github.com/betagouv/api-subventions-asso/commit/8a2de344e42702b2f28e45105c569b6c1c22c051))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.10.3](https://github.com/betagouv/api-subventions-asso/compare/v0.9.4...v0.10.3) (2022-06-09)

### Features

- **api,front,dto:** error on login better manage ([de14c0b](https://github.com/betagouv/api-subventions-asso/commit/de14c0b18cb741e1f0e94bdefeb239a069116616))
- **api:** add migration to fill association-name from osiris ([#259](https://github.com/betagouv/api-subventions-asso/issues/259)) ([7cb2c4c](https://github.com/betagouv/api-subventions-asso/commit/7cb2c4c1b831b8fecda390d54a90b05b12129cdb))
- **api:** add route for getting list of etablissements ([36861f7](https://github.com/betagouv/api-subventions-asso/commit/36861f7b4b0fb36e465d1e67cb7ef1b63e3a09aa))
- **api:** add route for getting one etablissement ([#255](https://github.com/betagouv/api-subventions-asso/issues/255)) ([d86a945](https://github.com/betagouv/api-subventions-asso/commit/d86a945fbe5aec1346ded037f78966dea21dec46))
- **api:** add stats route, for compute median number of requests [#243](https://github.com/betagouv/api-subventions-asso/issues/243) ([4ca169c](https://github.com/betagouv/api-subventions-asso/commit/4ca169c295bd30385635ccd7057a3c609da67f59))
- **api:** stats allow the exclusion of the admin ([381c84c](https://github.com/betagouv/api-subventions-asso/commit/381c84c6df28d8f486c43fc2818389fcacef48db))
- **api:** update README ([#258](https://github.com/betagouv/api-subventions-asso/issues/258)) ([0362818](https://github.com/betagouv/api-subventions-asso/commit/03628183cdcb2e8ea7f5d5f608ff2d8425a745bf))
- **front:** add € on amount ([069cbb5](https://github.com/betagouv/api-subventions-asso/commit/069cbb56200757fdac9b557076b55cc7e4cc2e78))
- **front:** add pipe drive chat bot ([cfb0054](https://github.com/betagouv/api-subventions-asso/commit/cfb0054a977bea3de6ae34071f32d9f9d9488d3b))
- **front:** add tiret - on value not found ([#249](https://github.com/betagouv/api-subventions-asso/issues/249)) ([e9febc6](https://github.com/betagouv/api-subventions-asso/commit/e9febc6d5725368cdfefdb91fae0fc168ba459ef))

### Bug Fixes

- **api:** call getBySiren if found ([370a606](https://github.com/betagouv/api-subventions-asso/commit/370a6061c14ffb3d31d42f0660402d7036d72547))
- **api:** fix association-name siret-to-siren migration ([#293](https://github.com/betagouv/api-subventions-asso/issues/293)) ([9ac3bc0](https://github.com/betagouv/api-subventions-asso/commit/9ac3bc0831b8c62172b00b32022304d95087608f))
- **api:** fix mail extention (missing f) ([4e0e026](https://github.com/betagouv/api-subventions-asso/commit/4e0e0268a3ab376ec4854a5c497e21f7ec011677))
- **api:** fix siret as siren in association-name ([#263](https://github.com/betagouv/api-subventions-asso/issues/263)) ([e954f22](https://github.com/betagouv/api-subventions-asso/commit/e954f223cbd5fbd8c799e98386217645a9b50579))
- **api:** osiris service tests ([4ca6dcd](https://github.com/betagouv/api-subventions-asso/commit/4ca6dcdeb9f4bf18232e51f1eb1dd55486304438))
- **api:** quick fix not uuse var date_modif_siren before checking if var exist ([598296f](https://github.com/betagouv/api-subventions-asso/commit/598296f6f50ba253365401fa697d390a28c735d1))
- **front:** correction orthographe ([7039408](https://github.com/betagouv/api-subventions-asso/commit/7039408e104d8904356011997b180e4dc23acbed))
- **front:** reload chat pipe drive between two page ([187885a](https://github.com/betagouv/api-subventions-asso/commit/187885aa93fc26deebd9f1a61bf0bf4c640ba5dc))

### [0.10.2](https://github.com/betagouv/api-subventions-asso/compare/v0.8.7...v0.10.2) (2022-06-08)

### Features

- **api,front,dto:** error on login better manage ([de14c0b](https://github.com/betagouv/api-subventions-asso/commit/de14c0b18cb741e1f0e94bdefeb239a069116616))
- **api:** add get subvention by mongo id ([f24ec3b](https://github.com/betagouv/api-subventions-asso/commit/f24ec3bdcc6a1caeaab0e8868a09558edc54b62f))
- **api:** add migration to fill association-name from osiris ([#259](https://github.com/betagouv/api-subventions-asso/issues/259)) ([7cb2c4c](https://github.com/betagouv/api-subventions-asso/commit/7cb2c4c1b831b8fecda390d54a90b05b12129cdb))
- **api:** add route for getting list of etablissements ([36861f7](https://github.com/betagouv/api-subventions-asso/commit/36861f7b4b0fb36e465d1e67cb7ef1b63e3a09aa))
- **api:** add route for getting one etablissement ([#255](https://github.com/betagouv/api-subventions-asso/issues/255)) ([d86a945](https://github.com/betagouv/api-subventions-asso/commit/d86a945fbe5aec1346ded037f78966dea21dec46))
- **api:** add stats route, for compute median number of requests [#243](https://github.com/betagouv/api-subventions-asso/issues/243) ([4ca169c](https://github.com/betagouv/api-subventions-asso/commit/4ca169c295bd30385635ccd7057a3c609da67f59))
- **api:** code review ([0d3389f](https://github.com/betagouv/api-subventions-asso/commit/0d3389fb324e4e5041418d73fb2ce4a557128124))
- **api:** stats allow the exclusion of the admin ([381c84c](https://github.com/betagouv/api-subventions-asso/commit/381c84c6df28d8f486c43fc2818389fcacef48db))
- **api:** update README ([#258](https://github.com/betagouv/api-subventions-asso/issues/258)) ([0362818](https://github.com/betagouv/api-subventions-asso/commit/03628183cdcb2e8ea7f5d5f608ff2d8425a745bf))
- **front:** add € on amount ([069cbb5](https://github.com/betagouv/api-subventions-asso/commit/069cbb56200757fdac9b557076b55cc7e4cc2e78))
- **front:** add pipe drive chat bot ([cfb0054](https://github.com/betagouv/api-subventions-asso/commit/cfb0054a977bea3de6ae34071f32d9f9d9488d3b))
- **front:** add spaces for currency amount in arrays ([#200](https://github.com/betagouv/api-subventions-asso/issues/200)) ([d27fa87](https://github.com/betagouv/api-subventions-asso/commit/d27fa8721dd714199e2d24f6ba4ce42655965ea8))
- **front:** add tiret - on value not found ([#249](https://github.com/betagouv/api-subventions-asso/issues/249)) ([e9febc6](https://github.com/betagouv/api-subventions-asso/commit/e9febc6d5725368cdfefdb91fae0fc168ba459ef))
- **front:** prefill nojs mailto ([#199](https://github.com/betagouv/api-subventions-asso/issues/199)) ([64c4f7d](https://github.com/betagouv/api-subventions-asso/commit/64c4f7d155fa691c6d86824e2436a9131bcfbb87))
- **front:** remove li in demande sub details ([32add28](https://github.com/betagouv/api-subventions-asso/commit/32add286321e1d04accae9f75e44336e8b4b23f5))
- **front:** remove totals array in subventions ([2b96a38](https://github.com/betagouv/api-subventions-asso/commit/2b96a380083c8b64d435d215b8d76bc3cd59f876))

### Bug Fixes

- **api:** fix association-name siret-to-siren migration ([#293](https://github.com/betagouv/api-subventions-asso/issues/293)) ([9ac3bc0](https://github.com/betagouv/api-subventions-asso/commit/9ac3bc0831b8c62172b00b32022304d95087608f))
- **api:** fix mail extention (missing f) ([4e0e026](https://github.com/betagouv/api-subventions-asso/commit/4e0e0268a3ab376ec4854a5c497e21f7ec011677))
- **api:** fix siret as siren in association-name ([#263](https://github.com/betagouv/api-subventions-asso/issues/263)) ([e954f22](https://github.com/betagouv/api-subventions-asso/commit/e954f223cbd5fbd8c799e98386217645a9b50579))
- **api:** osiris service tests ([4ca6dcd](https://github.com/betagouv/api-subventions-asso/commit/4ca6dcdeb9f4bf18232e51f1eb1dd55486304438))
- **api:** quick fix not uuse var date_modif_siren before checking if var exist ([598296f](https://github.com/betagouv/api-subventions-asso/commit/598296f6f50ba253365401fa697d390a28c735d1))
- **dto:** change package main file ([f6867eb](https://github.com/betagouv/api-subventions-asso/commit/f6867ebd8b0721c14ef26e66565c5316c0ca207e))
- **front:** fix ortho ([4bb2504](https://github.com/betagouv/api-subventions-asso/commit/4bb25044200ea22a3256b6c43e40cbf24fae5fe4))

### [0.10.1](https://github.com/betagouv/api-subventions-asso/compare/v0.8.7...v0.10.1) (2022-05-31)

### Features

- **api,front,dto:** error on login better manage ([d0bec45](https://github.com/betagouv/api-subventions-asso/commit/d0bec4500004f5aea9e3b06ba1688b1cdd40cd95))
- **api:** add get subvention by mongo id ([f24ec3b](https://github.com/betagouv/api-subventions-asso/commit/f24ec3bdcc6a1caeaab0e8868a09558edc54b62f))
- **api:** add migration to fill association-name from osiris ([#259](https://github.com/betagouv/api-subventions-asso/issues/259)) ([00d9d75](https://github.com/betagouv/api-subventions-asso/commit/00d9d75cf94e1bff3a93fdedfc121af84835411d))
- **api:** add route for getting list of etablissements ([2bd138a](https://github.com/betagouv/api-subventions-asso/commit/2bd138aef212406beb225c47cd6636fa6d34fd3a))
- **api:** add route for getting one etablissement ([#255](https://github.com/betagouv/api-subventions-asso/issues/255)) ([fd6697d](https://github.com/betagouv/api-subventions-asso/commit/fd6697d4755691880bf7400723920776fffe2d06))
- **api:** add stats route, for compute median number of requests [#243](https://github.com/betagouv/api-subventions-asso/issues/243) ([a1b9925](https://github.com/betagouv/api-subventions-asso/commit/a1b9925e35abf626ad752b1ca75b7ee9be05c06c))
- **api:** code review ([0d3389f](https://github.com/betagouv/api-subventions-asso/commit/0d3389fb324e4e5041418d73fb2ce4a557128124))
- **api:** stats allow the exclusion of the admin ([abf5348](https://github.com/betagouv/api-subventions-asso/commit/abf5348b68922064ff1f37c4015baba5104a5044))
- **api:** update README ([#258](https://github.com/betagouv/api-subventions-asso/issues/258)) ([d5fe983](https://github.com/betagouv/api-subventions-asso/commit/d5fe983926c401ce4a9df0e85a7ed17617300b33))
- **front:** add € on amount ([3510490](https://github.com/betagouv/api-subventions-asso/commit/3510490b880a836bdd110bbfe9e349b9e267b652))
- **front:** add pipe drive chat bot ([2ce6f6e](https://github.com/betagouv/api-subventions-asso/commit/2ce6f6ef067875a23046afcc6789666a306bad73))
- **front:** add spaces for currency amount in arrays ([#200](https://github.com/betagouv/api-subventions-asso/issues/200)) ([d27fa87](https://github.com/betagouv/api-subventions-asso/commit/d27fa8721dd714199e2d24f6ba4ce42655965ea8))
- **front:** add tiret - on value not found ([#249](https://github.com/betagouv/api-subventions-asso/issues/249)) ([7e55201](https://github.com/betagouv/api-subventions-asso/commit/7e55201bbc30053205159ffc3b98e870cf95ea3c))
- **front:** prefill nojs mailto ([#199](https://github.com/betagouv/api-subventions-asso/issues/199)) ([64c4f7d](https://github.com/betagouv/api-subventions-asso/commit/64c4f7d155fa691c6d86824e2436a9131bcfbb87))
- **front:** remove li in demande sub details ([32add28](https://github.com/betagouv/api-subventions-asso/commit/32add286321e1d04accae9f75e44336e8b4b23f5))
- **front:** remove totals array in subventions ([2b96a38](https://github.com/betagouv/api-subventions-asso/commit/2b96a380083c8b64d435d215b8d76bc3cd59f876))

### Bug Fixes

- **api:** fix siret as siren in association-name ([#263](https://github.com/betagouv/api-subventions-asso/issues/263)) ([6ec704f](https://github.com/betagouv/api-subventions-asso/commit/6ec704f3dc7208a28a873ba7798e77643604fb8e))
- **api:** osiris service tests ([62f336c](https://github.com/betagouv/api-subventions-asso/commit/62f336c47bd23e4bdb01438495b8125c9449bc35))
- **api:** quick fix not uuse var date_modif_siren before checking if var exist ([fe0e971](https://github.com/betagouv/api-subventions-asso/commit/fe0e971e804636ab0ca1ce7080eae8aaafe95a45))
- **dto:** change package main file ([f6867eb](https://github.com/betagouv/api-subventions-asso/commit/f6867ebd8b0721c14ef26e66565c5316c0ca207e))
- **front:** fix ortho ([4bb2504](https://github.com/betagouv/api-subventions-asso/commit/4bb25044200ea22a3256b6c43e40cbf24fae5fe4))

## [0.10.0](https://github.com/betagouv/api-subventions-asso/compare/v0.8.7...v0.10.0) (2022-05-31)

### Features

- **api,front,dto:** error on login better manage ([d0bec45](https://github.com/betagouv/api-subventions-asso/commit/d0bec4500004f5aea9e3b06ba1688b1cdd40cd95))
- **api:** add get subvention by mongo id ([f24ec3b](https://github.com/betagouv/api-subventions-asso/commit/f24ec3bdcc6a1caeaab0e8868a09558edc54b62f))
- **api:** add migration to fill association-name from osiris ([#259](https://github.com/betagouv/api-subventions-asso/issues/259)) ([00d9d75](https://github.com/betagouv/api-subventions-asso/commit/00d9d75cf94e1bff3a93fdedfc121af84835411d))
- **api:** add route for getting list of etablissements ([2bd138a](https://github.com/betagouv/api-subventions-asso/commit/2bd138aef212406beb225c47cd6636fa6d34fd3a))
- **api:** add route for getting one etablissement ([#255](https://github.com/betagouv/api-subventions-asso/issues/255)) ([fd6697d](https://github.com/betagouv/api-subventions-asso/commit/fd6697d4755691880bf7400723920776fffe2d06))
- **api:** add stats route, for compute median number of requests [#243](https://github.com/betagouv/api-subventions-asso/issues/243) ([a1b9925](https://github.com/betagouv/api-subventions-asso/commit/a1b9925e35abf626ad752b1ca75b7ee9be05c06c))
- **api:** code review ([0d3389f](https://github.com/betagouv/api-subventions-asso/commit/0d3389fb324e4e5041418d73fb2ce4a557128124))
- **api:** stats allow the exclusion of the admin ([abf5348](https://github.com/betagouv/api-subventions-asso/commit/abf5348b68922064ff1f37c4015baba5104a5044))
- **api:** update README ([#258](https://github.com/betagouv/api-subventions-asso/issues/258)) ([d5fe983](https://github.com/betagouv/api-subventions-asso/commit/d5fe983926c401ce4a9df0e85a7ed17617300b33))
- **front:** add € on amount ([3510490](https://github.com/betagouv/api-subventions-asso/commit/3510490b880a836bdd110bbfe9e349b9e267b652))
- **front:** add pipe drive chat bot ([2ce6f6e](https://github.com/betagouv/api-subventions-asso/commit/2ce6f6ef067875a23046afcc6789666a306bad73))
- **front:** add spaces for currency amount in arrays ([#200](https://github.com/betagouv/api-subventions-asso/issues/200)) ([d27fa87](https://github.com/betagouv/api-subventions-asso/commit/d27fa8721dd714199e2d24f6ba4ce42655965ea8))
- **front:** add tiret - on value not found ([#249](https://github.com/betagouv/api-subventions-asso/issues/249)) ([7e55201](https://github.com/betagouv/api-subventions-asso/commit/7e55201bbc30053205159ffc3b98e870cf95ea3c))
- **front:** prefill nojs mailto ([#199](https://github.com/betagouv/api-subventions-asso/issues/199)) ([64c4f7d](https://github.com/betagouv/api-subventions-asso/commit/64c4f7d155fa691c6d86824e2436a9131bcfbb87))
- **front:** remove li in demande sub details ([32add28](https://github.com/betagouv/api-subventions-asso/commit/32add286321e1d04accae9f75e44336e8b4b23f5))
- **front:** remove totals array in subventions ([2b96a38](https://github.com/betagouv/api-subventions-asso/commit/2b96a380083c8b64d435d215b8d76bc3cd59f876))

### Bug Fixes

- **api:** fix siret as siren in association-name ([#263](https://github.com/betagouv/api-subventions-asso/issues/263)) ([6ec704f](https://github.com/betagouv/api-subventions-asso/commit/6ec704f3dc7208a28a873ba7798e77643604fb8e))
- **api:** quick fix not uuse var date_modif_siren before checking if var exist ([fe0e971](https://github.com/betagouv/api-subventions-asso/commit/fe0e971e804636ab0ca1ce7080eae8aaafe95a45))
- **dto:** change package main file ([f6867eb](https://github.com/betagouv/api-subventions-asso/commit/f6867ebd8b0721c14ef26e66565c5316c0ca207e))
- **front:** fix ortho ([4bb2504](https://github.com/betagouv/api-subventions-asso/commit/4bb25044200ea22a3256b6c43e40cbf24fae5fe4))

### [0.9.7](https://github.com/betagouv/api-subventions-asso/compare/v0.9.4...v0.9.7) (2022-06-01)

### Bug Fixes

- **api:** fix mail extention (missing f) ([b7d18a9](https://github.com/betagouv/api-subventions-asso/commit/b7d18a90657f22a4eb911647b88e08d6bb3fcc67))

### [0.9.6](https://github.com/betagouv/api-subventions-asso/compare/v0.9.4...v0.9.6) (2022-05-30)

### Bug Fixes

- **api:** check if api asso send rna data before parse date of rna updadte ([dd27c33](https://github.com/betagouv/api-subventions-asso/commit/dd27c33acec94b923e7991bdeddd6143e8ec8f82))

### [0.9.5](https://github.com/betagouv/api-subventions-asso/compare/v0.9.4...v0.9.5) (2022-05-30)

### Features

- **api:** add many extentions in mail accepted ([b80cadf](https://github.com/betagouv/api-subventions-asso/commit/b80cadf5d6b296b7eb03018b18bb8c33a0f2058b))

### [0.9.4](https://github.com/betagouv/api-subventions-asso/compare/v0.8.7...v0.9.4) (2022-05-19)

### Features

- **api:** add get subvention by mongo id ([f24ec3b](https://github.com/betagouv/api-subventions-asso/commit/f24ec3bdcc6a1caeaab0e8868a09558edc54b62f))
- **api:** code review ([0d3389f](https://github.com/betagouv/api-subventions-asso/commit/0d3389fb324e4e5041418d73fb2ce4a557128124))
- **front:** add spaces for currency amount in arrays ([#200](https://github.com/betagouv/api-subventions-asso/issues/200)) ([d27fa87](https://github.com/betagouv/api-subventions-asso/commit/d27fa8721dd714199e2d24f6ba4ce42655965ea8))
- **front:** prefill nojs mailto ([#199](https://github.com/betagouv/api-subventions-asso/issues/199)) ([64c4f7d](https://github.com/betagouv/api-subventions-asso/commit/64c4f7d155fa691c6d86824e2436a9131bcfbb87))
- **front:** remove li in demande sub details ([32add28](https://github.com/betagouv/api-subventions-asso/commit/32add286321e1d04accae9f75e44336e8b4b23f5))
- **front:** remove totals array in subventions ([2b96a38](https://github.com/betagouv/api-subventions-asso/commit/2b96a380083c8b64d435d215b8d76bc3cd59f876))

### Bug Fixes

- **dto:** change package main file ([f6867eb](https://github.com/betagouv/api-subventions-asso/commit/f6867ebd8b0721c14ef26e66565c5316c0ca207e))
- **front:** fix ortho ([4bb2504](https://github.com/betagouv/api-subventions-asso/commit/4bb25044200ea22a3256b6c43e40cbf24fae5fe4))

### [0.9.3](https://github.com/betagouv/api-subventions-asso/compare/v0.9.2...v0.9.3) (2022-05-16)

### [0.9.2](https://github.com/betagouv/api-subventions-asso/compare/v0.9.1...v0.9.2) (2022-05-16)

### [0.9.1](https://github.com/betagouv/api-subventions-asso/compare/v0.9.0...v0.9.1) (2022-05-16)

### Features

- **api:** add get subvention by mongo id ([e1e7d71](https://github.com/betagouv/api-subventions-asso/commit/e1e7d71598a75d6abe44b3b8394c6158b09bbba4))
- **api:** code review ([d3fcebc](https://github.com/betagouv/api-subventions-asso/commit/d3fcebc3e137f91f006520883ca43bc1f10e897b))

### Bug Fixes

- **dto:** change package main file ([fe1cca9](https://github.com/betagouv/api-subventions-asso/commit/fe1cca9ad69d079f7578e2cb2831c870fedf0ddc))

## [0.9.0](https://github.com/betagouv/api-subventions-asso/compare/v0.8.6...v0.9.0) (2022-05-16)

### Features

- **front:** add spaces for currency amount in arrays ([#200](https://github.com/betagouv/api-subventions-asso/issues/200)) ([22a4554](https://github.com/betagouv/api-subventions-asso/commit/22a4554597b9e4da65a387aedf31c9a220b0a8e7))
- **front:** prefill nojs mailto ([#199](https://github.com/betagouv/api-subventions-asso/issues/199)) ([5d1ffd0](https://github.com/betagouv/api-subventions-asso/commit/5d1ffd01dad28adacfd662d7e1a6cfea33707601))
- **front:** remove li in demande sub details ([d5786d8](https://github.com/betagouv/api-subventions-asso/commit/d5786d8fed8254adfd5e0f4a07cb20f2364eb173))
- **front:** remove totals array in subventions ([3bc528c](https://github.com/betagouv/api-subventions-asso/commit/3bc528cf06459e0e0ba15e55c875541c21df15f3))

### [0.8.7](https://github.com/betagouv/api-subventions-asso/compare/v0.8.6...v0.8.7) (2022-05-18)

### Bug Fixes

- **api:** add ac-toulouse ([793c62d](https://github.com/betagouv/api-subventions-asso/commit/793c62db482a9198b7f2019891e6f34c06fb1294))

### [0.8.6](https://github.com/betagouv/api-subventions-asso/compare/v0.8.5...v0.8.6) (2022-05-04)

### Bug Fixes

- **api:** add valides domaines emails ([6bfc99e](https://github.com/betagouv/api-subventions-asso/commit/6bfc99e818c73c089a54dab972cddadf40d12bfa))

### [0.8.5](https://github.com/betagouv/api-subventions-asso/compare/v0.8.4...v0.8.5) (2022-04-29)

### Bug Fixes

- **api:** hot fix wait association name hase been save before send an other ([a2fe0d3](https://github.com/betagouv/api-subventions-asso/commit/a2fe0d32dda072e5ef6a89562d571c34bba6f41c))

### [0.8.4](https://github.com/betagouv/api-subventions-asso/compare/v0.8.3...v0.8.4) (2022-04-29)

### Bug Fixes

- crash on asso not found ([7b724ea](https://github.com/betagouv/api-subventions-asso/commit/7b724ea17bca15bcc4db4906f3534f81ec6eb68e))

### [0.8.3](https://github.com/betagouv/api-subventions-asso/compare/v0.8.2...v0.8.3) (2022-04-29)

### Bug Fixes

- **api:** fix parsage siret gispro and chorus logs ([be2ca6c](https://github.com/betagouv/api-subventions-asso/commit/be2ca6ca5e26f6dad4598387e9874a5486ead195))

### [0.8.2](https://github.com/betagouv/api-subventions-asso/compare/v0.8.1...v0.8.2) (2022-04-29)

### [0.8.1](https://github.com/betagouv/api-subventions-asso/compare/v0.7.2...v0.8.1) (2022-04-29)

### Features

- **api:** adapte format to dto ([deff50d](https://github.com/betagouv/api-subventions-asso/commit/deff50d45022231feffacfa6056c7e40f1b25224))
- **api:** add route to get sub for association or establishment ([ec0fd76](https://github.com/betagouv/api-subventions-asso/commit/ec0fd767a3cfc76c9ad54b99ad3185adb15551d3))
- **api:** add signup route ([d2b317b](https://github.com/betagouv/api-subventions-asso/commit/d2b317bd08b086bf3c02981b317c800b34b7ddd6))
- **api:** add stats route from logs ([972bc94](https://github.com/betagouv/api-subventions-asso/commit/972bc948e46ad2333fe3ffaf15d6d7ddf73d0cfe))
- **api:** integrate api asso ([5e90d1d](https://github.com/betagouv/api-subventions-asso/commit/5e90d1d2f253676c8a71b3955aa7dc33d3b8d30e))
- **api:** legalInformation rna not required and quick fix on parser and validator ([31a4661](https://github.com/betagouv/api-subventions-asso/commit/31a4661924fde3a6eaf9e476cb75ba9e8d7b6db2))
- **api:** parse gispro action and tiers pages ([cdc1ac1](https://github.com/betagouv/api-subventions-asso/commit/cdc1ac105147542a2c25e543a415c8a544954db1))
- **api:** wip gispro parser ([0329ea5](https://github.com/betagouv/api-subventions-asso/commit/0329ea5ddf8cf95a8660c43068176c53d4bd1ae0))
- **dto:** add reset password response ([9354d22](https://github.com/betagouv/api-subventions-asso/commit/9354d22632bf1313a36df5b3cee7ccd001038245))
- **dto:** add signup dto response ([6d4f11d](https://github.com/betagouv/api-subventions-asso/commit/6d4f11d0aa6ac55c4287414f4ae05f6bf88d798b))
- **front:** add signup page ([7859ac1](https://github.com/betagouv/api-subventions-asso/commit/7859ac1320b6bf919376a97a79da2857d96d4969))
- **front:** display info when JS disabled ([5b3f3d6](https://github.com/betagouv/api-subventions-asso/commit/5b3f3d63938a54fcb4918824d24318087ca81b37))
- **front:** remove white spaces in input ([0f5349b](https://github.com/betagouv/api-subventions-asso/commit/0f5349b9b7cf032459f0f119124fa5197b30c0f0))
- **front:** show good errors on reset password wrong ([44a3dac](https://github.com/betagouv/api-subventions-asso/commit/44a3dacdf547eac4537faf3cebba977be312d2d1))
- **front:** unifomize app name ([8a4c8bc](https://github.com/betagouv/api-subventions-asso/commit/8a4c8bc72d5c69ba860c096bcc026fc62793b658))
- **tools:** add script for scrapping phone in annuaire service public ([8fdfa1f](https://github.com/betagouv/api-subventions-asso/commit/8fdfa1f389aff38d1b2e408327b830cbb26da4ac))
- **tools:** init learna package ([7119c1d](https://github.com/betagouv/api-subventions-asso/commit/7119c1dfddd9ae0a1020fddfe0dfb0e8ec5b5735))

### Bug Fixes

- **api:** fix osiris date exercice debut to utc date ([d35bc51](https://github.com/betagouv/api-subventions-asso/commit/d35bc51adcc60b876cce4aaeee10f054e5098189))
- **api:** switch tests position to avoid unknown bug ([e1a06ee](https://github.com/betagouv/api-subventions-asso/commit/e1a06ee4cc2e30b51fceb37d59bbb4a8afda9ad1))
- fix testing return ([2422aa7](https://github.com/betagouv/api-subventions-asso/commit/2422aa75ed84de497da07c1be9dcb214efa3b349))
- **front:** dependabot[#11](https://github.com/betagouv/api-subventions-asso/issues/11) update ejs to upgrade corrupted dependency ([370d899](https://github.com/betagouv/api-subventions-asso/commit/370d8998021eaad24b6977e254ed51b6a1216227))
- **front:** dependency vulnerability through ejs ([e9dba16](https://github.com/betagouv/api-subventions-asso/commit/e9dba1649bfd08828e6ed57dea44d573beed0eda))
- **front:** http status 201 is not an error (disable promise reject when status is not 200) ([acf60bf](https://github.com/betagouv/api-subventions-asso/commit/acf60bf7601115dcfd7ac9349a8ee4361b318b49))

## [0.8.0](https://github.com/betagouv/api-subventions-asso/compare/v0.7.2...v0.8.0) (2022-04-29)

### Features

- **api:** adapte format to dto ([deff50d](https://github.com/betagouv/api-subventions-asso/commit/deff50d45022231feffacfa6056c7e40f1b25224))
- **api:** add route to get sub for association or establishment ([ec0fd76](https://github.com/betagouv/api-subventions-asso/commit/ec0fd767a3cfc76c9ad54b99ad3185adb15551d3))
- **api:** add signup route ([d2b317b](https://github.com/betagouv/api-subventions-asso/commit/d2b317bd08b086bf3c02981b317c800b34b7ddd6))
- **api:** add stats route from logs ([972bc94](https://github.com/betagouv/api-subventions-asso/commit/972bc948e46ad2333fe3ffaf15d6d7ddf73d0cfe))
- **api:** integrate api asso ([5e90d1d](https://github.com/betagouv/api-subventions-asso/commit/5e90d1d2f253676c8a71b3955aa7dc33d3b8d30e))
- **api:** legalInformation rna not required and quick fix on parser and validator ([31a4661](https://github.com/betagouv/api-subventions-asso/commit/31a4661924fde3a6eaf9e476cb75ba9e8d7b6db2))
- **api:** parse gispro action and tiers pages ([cdc1ac1](https://github.com/betagouv/api-subventions-asso/commit/cdc1ac105147542a2c25e543a415c8a544954db1))
- **api:** wip gispro parser ([0329ea5](https://github.com/betagouv/api-subventions-asso/commit/0329ea5ddf8cf95a8660c43068176c53d4bd1ae0))
- **dto:** add reset password response ([9354d22](https://github.com/betagouv/api-subventions-asso/commit/9354d22632bf1313a36df5b3cee7ccd001038245))
- **dto:** add signup dto response ([6d4f11d](https://github.com/betagouv/api-subventions-asso/commit/6d4f11d0aa6ac55c4287414f4ae05f6bf88d798b))
- **front:** add signup page ([7859ac1](https://github.com/betagouv/api-subventions-asso/commit/7859ac1320b6bf919376a97a79da2857d96d4969))
- **front:** display info when JS disabled ([5b3f3d6](https://github.com/betagouv/api-subventions-asso/commit/5b3f3d63938a54fcb4918824d24318087ca81b37))
- **front:** remove white spaces in input ([0f5349b](https://github.com/betagouv/api-subventions-asso/commit/0f5349b9b7cf032459f0f119124fa5197b30c0f0))
- **front:** show good errors on reset password wrong ([44a3dac](https://github.com/betagouv/api-subventions-asso/commit/44a3dacdf547eac4537faf3cebba977be312d2d1))
- **front:** unifomize app name ([8a4c8bc](https://github.com/betagouv/api-subventions-asso/commit/8a4c8bc72d5c69ba860c096bcc026fc62793b658))
- **tools:** add script for scrapping phone in annuaire service public ([8fdfa1f](https://github.com/betagouv/api-subventions-asso/commit/8fdfa1f389aff38d1b2e408327b830cbb26da4ac))
- **tools:** init learna package ([7119c1d](https://github.com/betagouv/api-subventions-asso/commit/7119c1dfddd9ae0a1020fddfe0dfb0e8ec5b5735))

### Bug Fixes

- **api:** fix osiris date exercice debut to utc date ([d35bc51](https://github.com/betagouv/api-subventions-asso/commit/d35bc51adcc60b876cce4aaeee10f054e5098189))
- **api:** switch tests position to avoid unknown bug ([e1a06ee](https://github.com/betagouv/api-subventions-asso/commit/e1a06ee4cc2e30b51fceb37d59bbb4a8afda9ad1))
- fix testing return ([6540320](https://github.com/betagouv/api-subventions-asso/commit/65403205d949adb3ad0eaa940d0a3f6a29cd8173))
- **front:** dependabot[#11](https://github.com/betagouv/api-subventions-asso/issues/11) update ejs to upgrade corrupted dependency ([370d899](https://github.com/betagouv/api-subventions-asso/commit/370d8998021eaad24b6977e254ed51b6a1216227))
- **front:** dependency vulnerability through ejs ([e9dba16](https://github.com/betagouv/api-subventions-asso/commit/e9dba1649bfd08828e6ed57dea44d573beed0eda))
- **front:** http status 201 is not an error (disable promise reject when status is not 200) ([acf60bf](https://github.com/betagouv/api-subventions-asso/commit/acf60bf7601115dcfd7ac9349a8ee4361b318b49))

### [0.7.2](https://github.com/betagouv/api-subventions-asso/compare/v0.7.1...v0.7.2) (2022-04-06)

### Features

- **api:** fonjep add data format helper and cast number ([8971a19](https://github.com/betagouv/api-subventions-asso/commit/8971a1998aebb2f068410275a606bb9807862886))
- **api:** parse new fonjep data ([2854035](https://github.com/betagouv/api-subventions-asso/commit/285403528c7c621597cc8957bea1fc2a26458f6a))
- **front:** add space to currency ([b618f13](https://github.com/betagouv/api-subventions-asso/commit/b618f13124ec031507ff867212cb200857976192))
- **front:** show message when data not found in versement and demande_subvention ([d0b14b6](https://github.com/betagouv/api-subventions-asso/commit/d0b14b6015f5e6518574d8dcaa3692e6ff6d4e62))

### Bug Fixes

- **front:** orthographe && remove log ([0c78ccd](https://github.com/betagouv/api-subventions-asso/commit/0c78ccd8e63c498dce5cd8315eedea83d93ed19e))

### [0.7.1](https://github.com/betagouv/api-subventions-asso/compare/v0.7.0...v0.7.1) (2022-04-01)

### Bug Fixes

- **api:** fix error in migration ([22b3e11](https://github.com/betagouv/api-subventions-asso/commit/22b3e1189748638d258656142faea491d2f3ca48))

## [0.7.0](https://github.com/betagouv/api-subventions-asso/compare/v0.6.0...v0.7.0) (2022-04-01)

### Features

- add admin page and list user and create usre ([69e94e4](https://github.com/betagouv/api-subventions-asso/commit/69e94e4ee72445f3dc274414c6691827e8e40e70))
- **api:** order etablisements in association ([b9d18cb](https://github.com/betagouv/api-subventions-asso/commit/b9d18cbfe9b13fec2315856404b777cb6a228d17))

## [0.6.0](https://github.com/betagouv/api-subventions-asso/compare/v0.5.2...v0.6.0) (2022-03-30)

### Features

- add tier demandePayment activitee ([9cd6d8f](https://github.com/betagouv/api-subventions-asso/commit/9cd6d8f9bc02a96ac5ba535cf2f879e3645a9afa))
- **api:** add cmd for datagouv ([751fbd9](https://github.com/betagouv/api-subventions-asso/commit/751fbd99e633054d5caab34fa6bfd7d7d937eb72))
- **api:** add datagouv parser ([084edde](https://github.com/betagouv/api-subventions-asso/commit/084edde4443de67b0781026ee8c1214b85bbd79f))
- **api:** add Entreprise siren entity and types ([ebcc26b](https://github.com/betagouv/api-subventions-asso/commit/ebcc26bc446d065aea92a30763395fbd7b683e6b))
- **api:** add osiris actions evaluation ([9214d51](https://github.com/betagouv/api-subventions-asso/commit/9214d51f9451643ee7ab861b1a195ce2dabbf396))
- **api:** add parse datagouv unitelegal ([a6cbddd](https://github.com/betagouv/api-subventions-asso/commit/a6cbddd9663a363ddf69d91fdeb49281f4d50a53))
- **api:** add repository for save siren in database ([4ed3cfe](https://github.com/betagouv/api-subventions-asso/commit/4ed3cfeeb2939e598916317c98d941862bff2ca1))
- **api:** chorus date can be excel date ([5a2ce7a](https://github.com/betagouv/api-subventions-asso/commit/5a2ce7a53501e47df56ee2d72d885965ad8c3141))
- **api:** insert many enitites in rna-siren and clean duplicate entities in collection ([68b9a53](https://github.com/betagouv/api-subventions-asso/commit/68b9a53acdade17310c30f0bb26ba4a121b67f68))
- **api:** parse chorus xls file ([92f52eb](https://github.com/betagouv/api-subventions-asso/commit/92f52eb71864b101abce692471500606fbe8aaa7))
- **api:** parse new file ([4eb1f7e](https://github.com/betagouv/api-subventions-asso/commit/4eb1f7e676d3570fab304aa7814133c3d1568a8f))
- **api:** parse new format off chorus ([8cc1f83](https://github.com/betagouv/api-subventions-asso/commit/8cc1f8394e6069ecf1c5dd50fe17efad1574bfbe))
- **front:** add contact view ([ac70911](https://github.com/betagouv/api-subventions-asso/commit/ac7091151217035badf7bd0eaffc3686dcffddec))
- **front:** add legal notice view ([83ed57f](https://github.com/betagouv/api-subventions-asso/commit/83ed57f39a0f506d73ceb63553d165eb32cd0d0a))
- **front:** add news collumn in versement ([923edac](https://github.com/betagouv/api-subventions-asso/commit/923edac646752125efac98981a773f363047217c))

### Bug Fixes

- **api:** remove html in texte ([ccf95e9](https://github.com/betagouv/api-subventions-asso/commit/ccf95e9d511fb557f9e7f83925d27ea6e5d4e2be))
- **front:** change payments by paiements ([0290751](https://github.com/betagouv/api-subventions-asso/commit/02907517a58604d74cd2849cde657919c77cce59))

### [0.5.2](https://github.com/betagouv/api-subventions-asso/compare/v0.5.1...v0.5.2) (2022-03-29)

### [0.5.1](https://github.com/betagouv/api-subventions-asso/compare/v0.5.0...v0.5.1) (2022-03-29)

### Features

- **api, dto:** disable sort by subvention and update dtos ([7dd05ea](https://github.com/betagouv/api-subventions-asso/commit/7dd05ea4721b7d3deaad98d97e4a2279d05435de))
- **api:** add branche and unique_id in chorus entity and versement inteface ([5a083fc](https://github.com/betagouv/api-subventions-asso/commit/5a083fc95bc1c912202f28fa3c062ee8c19d28c2))
- **front:** add components module (global_components) ([1e281fc](https://github.com/betagouv/api-subventions-asso/commit/1e281fcd4240c29f9116b1ae3c31f75b50d477d9))
- **front:** add versement components ([42671aa](https://github.com/betagouv/api-subventions-asso/commit/42671aaf6d92a0168aa7349022f53f6805597e17))
- **front:** add versement in association view ([8983672](https://github.com/betagouv/api-subventions-asso/commit/89836720b47147a189906025587d0cb1632a4fa9))
- **front:** add versement in etablisement view ([4bfc878](https://github.com/betagouv/api-subventions-asso/commit/4bfc8783dc0c473299bcb528677b37d3add84cfb))

## [0.5.0](https://github.com/betagouv/api-subventions-asso/compare/v0.4.2...v0.5.0) (2022-03-25)

### Features

- **front:** add link to inscription form (farmaform) ([f226316](https://github.com/betagouv/api-subventions-asso/commit/f226316df873b23e3806932001dccfbac54f5223))

### Bug Fixes

- **front:** fix coquillette ([5778ac3](https://github.com/betagouv/api-subventions-asso/commit/5778ac33f65364b6b5a7a1deebfe514d5b9a4622))

### [0.4.2](https://github.com/betagouv/api-subventions-asso/compare/v0.4.1...v0.4.2) (2022-03-22)

### Bug Fixes

- **front:** reset-token with \/ ([d4857b0](https://github.com/betagouv/api-subventions-asso/commit/d4857b0f551e3b23bed02111da8cbf82051d5cb9))
- reset password token with \ ([ea4c1a5](https://github.com/betagouv/api-subventions-asso/commit/ea4c1a5717f3a18bed95896a403aa27df779d8a9))

### [0.4.1](https://github.com/betagouv/api-subventions-asso/compare/v0.4.0...v0.4.1) (2022-03-22)

## [0.4.0](https://github.com/betagouv/api-subventions-asso/compare/v0.3.0...v0.4.0) (2022-03-15)

### Features

- **api:** add cache systeme for data entreprise api ([01cac8a](https://github.com/betagouv/api-subventions-asso/commit/01cac8ab3e66a87982c7ae1d1220fbbaa127e0a8))
- **api:** change mail for use front url ([8b387a0](https://github.com/betagouv/api-subventions-asso/commit/8b387a079f174cabb9e2936beb8cfff2b4b04f3a))
- **api:** search asso by siren ([9353be6](https://github.com/betagouv/api-subventions-asso/commit/9353be6e2b512da2a8bf99636fb03a6d337068ac))
- **dto:** add etablissement_dto_response ([237f14d](https://github.com/betagouv/api-subventions-asso/commit/237f14da97313c189f615fec6f80a84a856aba98))
- **front:** add connection page ([5768907](https://github.com/betagouv/api-subventions-asso/commit/5768907af317ac948bc59932e226ebf2a1cac39a))
- **front:** add disconect button ([5aab5c8](https://github.com/betagouv/api-subventions-asso/commit/5aab5c84bc53dad12780bf876ed17d012f08cf53))
- **front:** add dowload controller and route for download association data ([c044177](https://github.com/betagouv/api-subventions-asso/commit/c044177b11f8ca3dcbdfc8ee854c4b10e0901979))
- **front:** add etablisement page ([af17207](https://github.com/betagouv/api-subventions-asso/commit/af17207de0ddc2561442390413ed73e85bc48dd6))
- **front:** add etablissement controller ([bb9f14d](https://github.com/betagouv/api-subventions-asso/commit/bb9f14db48706a8ae2937bff31606ca3d80c570f))
- **front:** add forget-password view ([db9c246](https://github.com/betagouv/api-subventions-asso/commit/db9c246c57609113203eef9ceb5aa606965c5afb))
- **front:** add loader between page when we use turbo ([12f88d1](https://github.com/betagouv/api-subventions-asso/commit/12f88d1035e8c01c90eb0aa3b92b1588dd9ee0ac))
- **front:** add reset password part ([fbf44f5](https://github.com/betagouv/api-subventions-asso/commit/fbf44f5291d921d1fd89f4a649c4743effd1542d))
- **front:** add search asso by siren ([72698c0](https://github.com/betagouv/api-subventions-asso/commit/72698c0e0226965e30d032cbe117cf42f3f15b5f))
- **front:** add search part ([04327ad](https://github.com/betagouv/api-subventions-asso/commit/04327ad138a189964de6e79375abcb7d733a3d3a))
- **front:** check password before send ([57317ce](https://github.com/betagouv/api-subventions-asso/commit/57317cef1c827c8d11a833e9d2a72326c290f008))
- **front:** move login template page to folder auth ([d72fe63](https://github.com/betagouv/api-subventions-asso/commit/d72fe637e696e06c7d622232a2f572f7d257391d))
- **front:** redirect to asso in search ([0bddafb](https://github.com/betagouv/api-subventions-asso/commit/0bddafb4068074fbfdf9d83a936be8bc98ac28da))
- **front:** refacto archi backend of frontoffice ([5c22ba5](https://github.com/betagouv/api-subventions-asso/commit/5c22ba55eb0b216d859bf698c070b53079885020))
- **front:** separates views into several components ([9326763](https://github.com/betagouv/api-subventions-asso/commit/93267637e079e845e80788806d199c97adc48747))
- **front:** show request by asso ([d8dfad7](https://github.com/betagouv/api-subventions-asso/commit/d8dfad7029976b419035d05d1e47f40c0a656de9))

### Bug Fixes

- **api:** fix map of undefined on cache class ([d3b9b1a](https://github.com/betagouv/api-subventions-asso/commit/d3b9b1affc5a4238e2af1bdb0d4e7e2af0bd65bf))
- **api:** search asso with rna ([7747cf8](https://github.com/betagouv/api-subventions-asso/commit/7747cf8bfaa8b5e903b61f24239c6a50a66864ae))
- **back:** fix test ([9402587](https://github.com/betagouv/api-subventions-asso/commit/9402587032bbaf6661f6ea76c9cb8433ce35d9de))
- **front_back:** fix error on search rna not found ([06c9355](https://github.com/betagouv/api-subventions-asso/commit/06c93558091b2518c0d633e2819182dbdb679867))
- **front:** fix front controller no detected ([78cc520](https://github.com/betagouv/api-subventions-asso/commit/78cc520f5c7976dfca2d73eaf98459b9c606ab04))

## [0.3.0](https://github.com/betagouv/api-subventions-asso/compare/v0.2.0...v0.3.0) (2022-03-03)

### Features

- add migration manager ([1f62394](https://github.com/betagouv/api-subventions-asso/commit/1f62394a204efb898f69c7a63da5dc4ca9138fe6))
- add versement module ([8b7bd95](https://github.com/betagouv/api-subventions-asso/commit/8b7bd954b0553a58b97e2bfab084bd7cbc888f27))
- index opertation type ([0c17581](https://github.com/betagouv/api-subventions-asso/commit/0c17581d049629288bd61d447116877fd4db7af1))

### Bug Fixes

- **mail-notifier:** suppressed tab no test is alright ([3f6313a](https://github.com/betagouv/api-subventions-asso/commit/3f6313a7ffd2da37b087499c7e465f2957164786))

## [0.2.0](https://github.com/betagouv/api-subventions-asso/compare/v0.1.0...v0.2.0) (2022-02-25)

### Features

- add cmd parse to fonjep cli controller ([15ada26](https://github.com/betagouv/api-subventions-asso/commit/15ada26fc15bf97dd20ced3c64d280ac0223afaa))
- add event manager ([0eea7f8](https://github.com/betagouv/api-subventions-asso/commit/0eea7f8000a83e41f66e569318982e8ccc66a3a6))
- add fonjep cli controller ([1e1a311](https://github.com/betagouv/api-subventions-asso/commit/1e1a311f83a689a1ac8d5edc44927df78a069b4a))
- add migration for chorusline ([7ed550f](https://github.com/betagouv/api-subventions-asso/commit/7ed550feb7ad72cba1b49785720c5d1db742a452))
- add migration for rnaSiren ([6367bcc](https://github.com/betagouv/api-subventions-asso/commit/6367bcce2042b6264595fcf6d139965a3905a937))
- add rnaSiren module ([21cc9c2](https://github.com/betagouv/api-subventions-asso/commit/21cc9c2c84aa62db02365456323f5539ed6cdf94))
- add tests FONJEP ([c10ef2c](https://github.com/betagouv/api-subventions-asso/commit/c10ef2c056d7394738fa8b0fad945c3be8b394ce))
- create fonjep parser and fonjep entity ([70f11a5](https://github.com/betagouv/api-subventions-asso/commit/70f11a53222cd8a6f62c324fa4458fc19c5f5426))
- create fonjep repository ([3d953ef](https://github.com/betagouv/api-subventions-asso/commit/3d953ef85d6a2349423d699417626567f6ab42c4))
- create fonjep service ([b2b0944](https://github.com/betagouv/api-subventions-asso/commit/b2b0944b119a78b21d0797ffd4872de421f919e0))
- fonjep as provider to etablissement and demandesubvention ([b2492d3](https://github.com/betagouv/api-subventions-asso/commit/b2492d3bc58159602a41bca5953ccd30a32138fe))
- move parse file in parse helpers ([43b5f57](https://github.com/betagouv/api-subventions-asso/commit/43b5f57f776d352e7d2531ad9c16d2b4f3ae18cb))
- osiris and lca loader on parse ([1f60957](https://github.com/betagouv/api-subventions-asso/commit/1f609571cface4823ef4bb07ef3c6cce161b1272))
- parse new format of chorus ([c0215d4](https://github.com/betagouv/api-subventions-asso/commit/c0215d4fd3b9e678aa2c6d66c7e8f85e12ad5608))
- print progree check if stdout exist ([e282ba9](https://github.com/betagouv/api-subventions-asso/commit/e282ba9ea07a65c768f5438c21710f0f0e21a4b5))
- use rna siren on providers ([dc7d810](https://github.com/betagouv/api-subventions-asso/commit/dc7d810c862394eba1d8bf1aa4dd6156218f255e))

### Bug Fixes

- fix lca test with rna siret module ([f742e81](https://github.com/betagouv/api-subventions-asso/commit/f742e8175946360fa33f96d7b4a4b304a5e56dd3))
- review clean ([61155ce](https://github.com/betagouv/api-subventions-asso/commit/61155cea11815b36b8be391f020b0e4314f902e9))
- use good version ([bba0618](https://github.com/betagouv/api-subventions-asso/commit/bba0618ee18d2c1293529cf59ee89d6e163fb6fa))

## [0.1.0](https://github.com/betagouv/api-subventions-asso/compare/v0.0.1...v0.1.0) (2022-02-16)

### [0.0.2](https://github.com/betagouv/api-subventions-asso/compare/v0.0.1...v0.0.2) (2022-02-16)

### 0.0.1 (2022-02-16)

### Features

- add Auth and user module ([db291a9](https://github.com/betagouv/api-subventions-asso/commit/db291a9c366e9a74245b15b0ebdf78019cf32dad))
- add chorus cli controller ([263c29e](https://github.com/betagouv/api-subventions-asso/commit/263c29e375ffe351c85e5cecf309a3a4cafc4be9))
- add chorus parser and entity ([1608b2e](https://github.com/betagouv/api-subventions-asso/commit/1608b2eefd3a8311383299ec5d7a1013ec53d8a0))
- add chorus repository and service ([d7dc7c0](https://github.com/betagouv/api-subventions-asso/commit/d7dc7c07e0e475d8a93086e45b270fd7d758bf39))
- add cli interface ([176bd97](https://github.com/betagouv/api-subventions-asso/commit/176bd97300dec52fea612c893646a20bc46d9435))
- add code cov actions ([494646f](https://github.com/betagouv/api-subventions-asso/commit/494646f966dd266e7e041d495f48a74837b74c62))
- add controller in tests ([518acca](https://github.com/betagouv/api-subventions-asso/commit/518acca2217fa7480e24861ac4eb0c544b811e90))
- add engines version in package ([9f16d8b](https://github.com/betagouv/api-subventions-asso/commit/9f16d8b8d068272c119c0efc8d0ecafa433a0fc8))
- add externals services ([8087649](https://github.com/betagouv/api-subventions-asso/commit/8087649aba7fd5c5bbc9ba53d50d244d3e7b5ab3))
- add helpers ([5936f9b](https://github.com/betagouv/api-subventions-asso/commit/5936f9b64573ebfa353c534887db01daae9b480a))
- add le compte asso module ([f2517e2](https://github.com/betagouv/api-subventions-asso/commit/f2517e2618079a0be128ae7f77ec49fb98d41f72))
- add log options ([1c10a8f](https://github.com/betagouv/api-subventions-asso/commit/1c10a8f6d67a74584bb5d085dd9261723bff505e))
- add logger ([e4a2e47](https://github.com/betagouv/api-subventions-asso/commit/e4a2e4783292cd167acfc13bc732a10926342e8f))
- add logout route ([c9fefb7](https://github.com/betagouv/api-subventions-asso/commit/c9fefb7221933349b82c392c6e12de0614b69fc2))
- add mail create and forget password ([9b74be9](https://github.com/betagouv/api-subventions-asso/commit/9b74be9ab5f1fdaebb729fa51a43e44345fb5b2b))
- add mail notifier ([410fda8](https://github.com/betagouv/api-subventions-asso/commit/410fda8c3e3560b04dd86020d1a0c44419228d20))
- add method to get data from Siren ([9c1cc79](https://github.com/betagouv/api-subventions-asso/commit/9c1cc79a22054c592fa24d2cb72e5ef71a43359b))
- add mongodb to app ([18bf445](https://github.com/betagouv/api-subventions-asso/commit/18bf445bf003412186efc1fec13f350f46643b4e))
- add new parser in osiris ([8cd4c23](https://github.com/betagouv/api-subventions-asso/commit/8cd4c236efa62465e75116b3d7452ec3fc754048))
- add osiris module ([bfa54a6](https://github.com/betagouv/api-subventions-asso/commit/bfa54a663f64e29012653a28b2b0cc1f04c69c1e))
- add pre hook to build and lint script ([806fa20](https://github.com/betagouv/api-subventions-asso/commit/806fa20de7706b647c2305ce60412a4b5691d39f))
- add providerMatchingKeys in RequestEntities ([d0c099e](https://github.com/betagouv/api-subventions-asso/commit/d0c099ec5c6749ffe858f1a95ba4c369a09b0e1c))
- add search module ([ae048b2](https://github.com/betagouv/api-subventions-asso/commit/ae048b215e777a2b05067a95e78df464a74bcaa0))
- add swagger docs and TSOA ([86e9711](https://github.com/betagouv/api-subventions-asso/commit/86e9711b61729a7b1dd0f6360e766a7c3003802e))
- add user change password ([ce07387](https://github.com/betagouv/api-subventions-asso/commit/ce07387a9262944b1d33b142d50a99eeef826f50))
- add user cli controller ([8909a72](https://github.com/betagouv/api-subventions-asso/commit/8909a72b26271fea670eb905de340c1b354cf817))
- add user http controller ([3e039ce](https://github.com/betagouv/api-subventions-asso/commit/3e039cec0e6bdc73c178af4869d11c4cb4748a9d))
- add validators ([055cf68](https://github.com/betagouv/api-subventions-asso/commit/055cf68dd4b2d1143beec5f08ed8583d43659f3e))
- change api name ([259ee58](https://github.com/betagouv/api-subventions-asso/commit/259ee58a319329a09f3f8b01b48957eab511b616))
- change auth routes ([39f87f0](https://github.com/betagouv/api-subventions-asso/commit/39f87f0af97f744497094de35277100b4097f940))
- change key msg by message ([c0dbafe](https://github.com/betagouv/api-subventions-asso/commit/c0dbafef37c7a8867b6fb92dfa332cddbe58ea2f))
- change output format ([7add298](https://github.com/betagouv/api-subventions-asso/commit/7add2989bfc409163ebf24e491a722d871544e18))
- change output format and add budgetline and Request match ([7d59b87](https://github.com/betagouv/api-subventions-asso/commit/7d59b87c9be93afbbe05ca716501dfee4f037ff0))
- change output format for entrepriseAPI ([7b289d6](https://github.com/betagouv/api-subventions-asso/commit/7b289d6dce5d70d101081a5076be8abc847a1ed9))
- change siret and rna api to entreprise api ([1cbc907](https://github.com/betagouv/api-subventions-asso/commit/1cbc907b6806d8f2e101fbd982788cc983736ceb))
- clean and update README.md ([e65ac23](https://github.com/betagouv/api-subventions-asso/commit/e65ac23f3adebaf69689c22b7c9f2ad17d72b6aa))
- move Rna and Siret interfaces ([8435969](https://github.com/betagouv/api-subventions-asso/commit/84359697d4c8c743db3bdfbbe1180c6533f41c29))
- osiris mutli import and extract log file ([3c86de6](https://github.com/betagouv/api-subventions-asso/commit/3c86de6a35357fc1dcf5a04104baad626f9efb54))
- parser can have an adapter ([17d0143](https://github.com/betagouv/api-subventions-asso/commit/17d0143cc91162236a4b24d78acd1afc51a6de26))
- paser multi file in leCompteAsso ([8f60ff4](https://github.com/betagouv/api-subventions-asso/commit/8f60ff4c02dff4c0b26b25b1feae77707669eca5))
- restart container after init ([d0e725f](https://github.com/betagouv/api-subventions-asso/commit/d0e725f7d327df5aeca560719bdc275087fb2f1e))
- securize search controller ([b4621bf](https://github.com/betagouv/api-subventions-asso/commit/b4621bf1d8c1cec8f87aaf93f6a1ebb3d023aa31))
- update legal categories ([2cfe652](https://github.com/betagouv/api-subventions-asso/commit/2cfe652ffc81144180fc814436bd85b0d3776408))
- use Siret and Rna types ([8cc30bb](https://github.com/betagouv/api-subventions-asso/commit/8cc30bb0661920b9e24b92a062def8bdcafccc59))

### Bug Fixes

- clean for review ([928bcf9](https://github.com/betagouv/api-subventions-asso/commit/928bcf9a048193e69bef93c471054c0808e9321d))
- fix bug rna null on LCA ([570caeb](https://github.com/betagouv/api-subventions-asso/commit/570caeb6389e4adda6f999ff1c8e2592275747a1))
- fix github actions ([afc7088](https://github.com/betagouv/api-subventions-asso/commit/afc7088130c25bef4ebb22c53b022bdc5f71d92c))
- lint ([9526bbd](https://github.com/betagouv/api-subventions-asso/commit/9526bbdc05215b9a32108f9a42abc1df88d12ee2))
- review clean ([b5182b7](https://github.com/betagouv/api-subventions-asso/commit/b5182b7ac0c93b701fbe125f031f6e8a269f2018))
- use good version ([c3e6888](https://github.com/betagouv/api-subventions-asso/commit/c3e6888b66544b73fa1a830fbbace754f2201c82))

## 0.0.0 (2022-02-11)

### Features

- add Auth and user module ([db291a9](https://github.com/betagouv/api-subventions-asso/commit/db291a9c366e9a74245b15b0ebdf78019cf32dad))
- add chorus cli controller ([263c29e](https://github.com/betagouv/api-subventions-asso/commit/263c29e375ffe351c85e5cecf309a3a4cafc4be9))
- add chorus parser and entity ([1608b2e](https://github.com/betagouv/api-subventions-asso/commit/1608b2eefd3a8311383299ec5d7a1013ec53d8a0))
- add chorus repository and service ([d7dc7c0](https://github.com/betagouv/api-subventions-asso/commit/d7dc7c07e0e475d8a93086e45b270fd7d758bf39))
- add cli interface ([176bd97](https://github.com/betagouv/api-subventions-asso/commit/176bd97300dec52fea612c893646a20bc46d9435))
- add code cov actions ([494646f](https://github.com/betagouv/api-subventions-asso/commit/494646f966dd266e7e041d495f48a74837b74c62))
- add controller in tests ([518acca](https://github.com/betagouv/api-subventions-asso/commit/518acca2217fa7480e24861ac4eb0c544b811e90))
- add engines version in package ([9f16d8b](https://github.com/betagouv/api-subventions-asso/commit/9f16d8b8d068272c119c0efc8d0ecafa433a0fc8))
- add externals services ([8087649](https://github.com/betagouv/api-subventions-asso/commit/8087649aba7fd5c5bbc9ba53d50d244d3e7b5ab3))
- add helpers ([5936f9b](https://github.com/betagouv/api-subventions-asso/commit/5936f9b64573ebfa353c534887db01daae9b480a))
- add le compte asso module ([f2517e2](https://github.com/betagouv/api-subventions-asso/commit/f2517e2618079a0be128ae7f77ec49fb98d41f72))
- add log options ([1c10a8f](https://github.com/betagouv/api-subventions-asso/commit/1c10a8f6d67a74584bb5d085dd9261723bff505e))
- add logger ([e4a2e47](https://github.com/betagouv/api-subventions-asso/commit/e4a2e4783292cd167acfc13bc732a10926342e8f))
- add logout route ([c9fefb7](https://github.com/betagouv/api-subventions-asso/commit/c9fefb7221933349b82c392c6e12de0614b69fc2))
- add mail create and forget password ([9b74be9](https://github.com/betagouv/api-subventions-asso/commit/9b74be9ab5f1fdaebb729fa51a43e44345fb5b2b))
- add mail notifier ([410fda8](https://github.com/betagouv/api-subventions-asso/commit/410fda8c3e3560b04dd86020d1a0c44419228d20))
- add method to get data from Siren ([9c1cc79](https://github.com/betagouv/api-subventions-asso/commit/9c1cc79a22054c592fa24d2cb72e5ef71a43359b))
- add mongodb to app ([18bf445](https://github.com/betagouv/api-subventions-asso/commit/18bf445bf003412186efc1fec13f350f46643b4e))
- add new parser in osiris ([8cd4c23](https://github.com/betagouv/api-subventions-asso/commit/8cd4c236efa62465e75116b3d7452ec3fc754048))
- add osiris module ([bfa54a6](https://github.com/betagouv/api-subventions-asso/commit/bfa54a663f64e29012653a28b2b0cc1f04c69c1e))
- add pre hook to build and lint script ([806fa20](https://github.com/betagouv/api-subventions-asso/commit/806fa20de7706b647c2305ce60412a4b5691d39f))
- add providerMatchingKeys in RequestEntities ([d0c099e](https://github.com/betagouv/api-subventions-asso/commit/d0c099ec5c6749ffe858f1a95ba4c369a09b0e1c))
- add search module ([ae048b2](https://github.com/betagouv/api-subventions-asso/commit/ae048b215e777a2b05067a95e78df464a74bcaa0))
- add swagger docs and TSOA ([86e9711](https://github.com/betagouv/api-subventions-asso/commit/86e9711b61729a7b1dd0f6360e766a7c3003802e))
- add user change password ([ce07387](https://github.com/betagouv/api-subventions-asso/commit/ce07387a9262944b1d33b142d50a99eeef826f50))
- add user cli controller ([8909a72](https://github.com/betagouv/api-subventions-asso/commit/8909a72b26271fea670eb905de340c1b354cf817))
- add user http controller ([3e039ce](https://github.com/betagouv/api-subventions-asso/commit/3e039cec0e6bdc73c178af4869d11c4cb4748a9d))
- add validators ([055cf68](https://github.com/betagouv/api-subventions-asso/commit/055cf68dd4b2d1143beec5f08ed8583d43659f3e))
- change api name ([259ee58](https://github.com/betagouv/api-subventions-asso/commit/259ee58a319329a09f3f8b01b48957eab511b616))
- change auth routes ([39f87f0](https://github.com/betagouv/api-subventions-asso/commit/39f87f0af97f744497094de35277100b4097f940))
- change key msg by message ([c0dbafe](https://github.com/betagouv/api-subventions-asso/commit/c0dbafef37c7a8867b6fb92dfa332cddbe58ea2f))
- change output format and add budgetline and Request match ([7d59b87](https://github.com/betagouv/api-subventions-asso/commit/7d59b87c9be93afbbe05ca716501dfee4f037ff0))
- change output format for entrepriseAPI ([7b289d6](https://github.com/betagouv/api-subventions-asso/commit/7b289d6dce5d70d101081a5076be8abc847a1ed9))
- change siret and rna api to entreprise api ([1cbc907](https://github.com/betagouv/api-subventions-asso/commit/1cbc907b6806d8f2e101fbd982788cc983736ceb))
- clean and update README.md ([e65ac23](https://github.com/betagouv/api-subventions-asso/commit/e65ac23f3adebaf69689c22b7c9f2ad17d72b6aa))
- move Rna and Siret interfaces ([8435969](https://github.com/betagouv/api-subventions-asso/commit/84359697d4c8c743db3bdfbbe1180c6533f41c29))
- osiris mutli import and extract log file ([3c86de6](https://github.com/betagouv/api-subventions-asso/commit/3c86de6a35357fc1dcf5a04104baad626f9efb54))
- parser can have an adapter ([17d0143](https://github.com/betagouv/api-subventions-asso/commit/17d0143cc91162236a4b24d78acd1afc51a6de26))
- paser multi file in leCompteAsso ([8f60ff4](https://github.com/betagouv/api-subventions-asso/commit/8f60ff4c02dff4c0b26b25b1feae77707669eca5))
- restart container after init ([d0e725f](https://github.com/betagouv/api-subventions-asso/commit/d0e725f7d327df5aeca560719bdc275087fb2f1e))
- securize search controller ([b4621bf](https://github.com/betagouv/api-subventions-asso/commit/b4621bf1d8c1cec8f87aaf93f6a1ebb3d023aa31))
- update legal categories ([2cfe652](https://github.com/betagouv/api-subventions-asso/commit/2cfe652ffc81144180fc814436bd85b0d3776408))
- use Siret and Rna types ([8cc30bb](https://github.com/betagouv/api-subventions-asso/commit/8cc30bb0661920b9e24b92a062def8bdcafccc59))

### Bug Fixes

- clean for review ([928bcf9](https://github.com/betagouv/api-subventions-asso/commit/928bcf9a048193e69bef93c471054c0808e9321d))
- fix bug rna null on LCA ([570caeb](https://github.com/betagouv/api-subventions-asso/commit/570caeb6389e4adda6f999ff1c8e2592275747a1))
- fix github actions ([afc7088](https://github.com/betagouv/api-subventions-asso/commit/afc7088130c25bef4ebb22c53b022bdc5f71d92c))
- lint ([9526bbd](https://github.com/betagouv/api-subventions-asso/commit/9526bbdc05215b9a32108f9a42abc1df88d12ee2))
- review clean ([b5182b7](https://github.com/betagouv/api-subventions-asso/commit/b5182b7ac0c93b701fbe125f031f6e8a269f2018))
- use good version ([5cbb995](https://github.com/betagouv/api-subventions-asso/commit/5cbb995502db3b5c999795f0dcc52829317844d0))
