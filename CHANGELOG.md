# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.8.0](https://github.com/betagouv/api-subventions-asso/compare/v0.7.2...v0.8.0) (2022-04-29)


### Features

* **api:** adapte format to dto ([deff50d](https://github.com/betagouv/api-subventions-asso/commit/deff50d45022231feffacfa6056c7e40f1b25224))
* **api:** add route to get sub for association or establishment ([ec0fd76](https://github.com/betagouv/api-subventions-asso/commit/ec0fd767a3cfc76c9ad54b99ad3185adb15551d3))
* **api:** add signup route ([d2b317b](https://github.com/betagouv/api-subventions-asso/commit/d2b317bd08b086bf3c02981b317c800b34b7ddd6))
* **api:** add stats route from logs ([972bc94](https://github.com/betagouv/api-subventions-asso/commit/972bc948e46ad2333fe3ffaf15d6d7ddf73d0cfe))
* **api:** integrate api asso ([5e90d1d](https://github.com/betagouv/api-subventions-asso/commit/5e90d1d2f253676c8a71b3955aa7dc33d3b8d30e))
* **api:** legalInformation rna not required and quick fix on parser and validator ([31a4661](https://github.com/betagouv/api-subventions-asso/commit/31a4661924fde3a6eaf9e476cb75ba9e8d7b6db2))
* **api:** parse gispro action and tiers pages ([cdc1ac1](https://github.com/betagouv/api-subventions-asso/commit/cdc1ac105147542a2c25e543a415c8a544954db1))
* **api:** wip gispro parser ([0329ea5](https://github.com/betagouv/api-subventions-asso/commit/0329ea5ddf8cf95a8660c43068176c53d4bd1ae0))
* **dto:** add reset password response ([9354d22](https://github.com/betagouv/api-subventions-asso/commit/9354d22632bf1313a36df5b3cee7ccd001038245))
* **dto:** add signup dto response ([6d4f11d](https://github.com/betagouv/api-subventions-asso/commit/6d4f11d0aa6ac55c4287414f4ae05f6bf88d798b))
* **front:** add signup page ([7859ac1](https://github.com/betagouv/api-subventions-asso/commit/7859ac1320b6bf919376a97a79da2857d96d4969))
* **front:** display info when JS disabled ([5b3f3d6](https://github.com/betagouv/api-subventions-asso/commit/5b3f3d63938a54fcb4918824d24318087ca81b37))
* **front:** remove white spaces in input ([0f5349b](https://github.com/betagouv/api-subventions-asso/commit/0f5349b9b7cf032459f0f119124fa5197b30c0f0))
* **front:** show good errors on reset password wrong ([44a3dac](https://github.com/betagouv/api-subventions-asso/commit/44a3dacdf547eac4537faf3cebba977be312d2d1))
* **front:** unifomize app name ([8a4c8bc](https://github.com/betagouv/api-subventions-asso/commit/8a4c8bc72d5c69ba860c096bcc026fc62793b658))
* **tools:** add script for scrapping phone in annuaire service public ([8fdfa1f](https://github.com/betagouv/api-subventions-asso/commit/8fdfa1f389aff38d1b2e408327b830cbb26da4ac))
* **tools:** init learna package ([7119c1d](https://github.com/betagouv/api-subventions-asso/commit/7119c1dfddd9ae0a1020fddfe0dfb0e8ec5b5735))


### Bug Fixes

* **api:** fix osiris date exercice debut to utc date ([d35bc51](https://github.com/betagouv/api-subventions-asso/commit/d35bc51adcc60b876cce4aaeee10f054e5098189))
* **api:** switch tests position to avoid unknown bug ([e1a06ee](https://github.com/betagouv/api-subventions-asso/commit/e1a06ee4cc2e30b51fceb37d59bbb4a8afda9ad1))
* fix testing return ([6540320](https://github.com/betagouv/api-subventions-asso/commit/65403205d949adb3ad0eaa940d0a3f6a29cd8173))
* **front:** dependabot[#11](https://github.com/betagouv/api-subventions-asso/issues/11) update ejs to upgrade corrupted dependency ([370d899](https://github.com/betagouv/api-subventions-asso/commit/370d8998021eaad24b6977e254ed51b6a1216227))
* **front:** dependency vulnerability through ejs ([e9dba16](https://github.com/betagouv/api-subventions-asso/commit/e9dba1649bfd08828e6ed57dea44d573beed0eda))
* **front:** http status 201 is not an error (disable promise reject when status is not 200) ([acf60bf](https://github.com/betagouv/api-subventions-asso/commit/acf60bf7601115dcfd7ac9349a8ee4361b318b49))

### [0.7.2](https://github.com/betagouv/api-subventions-asso/compare/v0.7.1...v0.7.2) (2022-04-06)


### Features

* **api:** fonjep add data format helper and cast number ([8971a19](https://github.com/betagouv/api-subventions-asso/commit/8971a1998aebb2f068410275a606bb9807862886))
* **api:** parse new fonjep data ([2854035](https://github.com/betagouv/api-subventions-asso/commit/285403528c7c621597cc8957bea1fc2a26458f6a))
* **front:** add space to currency ([b618f13](https://github.com/betagouv/api-subventions-asso/commit/b618f13124ec031507ff867212cb200857976192))
* **front:** show message when data not found in versement and demande_subvention ([d0b14b6](https://github.com/betagouv/api-subventions-asso/commit/d0b14b6015f5e6518574d8dcaa3692e6ff6d4e62))


### Bug Fixes

* **front:** orthographe && remove log ([0c78ccd](https://github.com/betagouv/api-subventions-asso/commit/0c78ccd8e63c498dce5cd8315eedea83d93ed19e))

### [0.7.1](https://github.com/betagouv/api-subventions-asso/compare/v0.7.0...v0.7.1) (2022-04-01)


### Bug Fixes

* **api:** fix error in migration ([22b3e11](https://github.com/betagouv/api-subventions-asso/commit/22b3e1189748638d258656142faea491d2f3ca48))

## [0.7.0](https://github.com/betagouv/api-subventions-asso/compare/v0.6.0...v0.7.0) (2022-04-01)


### Features

* add admin page and list user and create usre ([69e94e4](https://github.com/betagouv/api-subventions-asso/commit/69e94e4ee72445f3dc274414c6691827e8e40e70))
* **api:** order etablisements in association ([b9d18cb](https://github.com/betagouv/api-subventions-asso/commit/b9d18cbfe9b13fec2315856404b777cb6a228d17))

## [0.6.0](https://github.com/betagouv/api-subventions-asso/compare/v0.5.2...v0.6.0) (2022-03-30)


### Features

* add tier demandePayment activitee ([9cd6d8f](https://github.com/betagouv/api-subventions-asso/commit/9cd6d8f9bc02a96ac5ba535cf2f879e3645a9afa))
* **api:** add cmd for datagouv ([751fbd9](https://github.com/betagouv/api-subventions-asso/commit/751fbd99e633054d5caab34fa6bfd7d7d937eb72))
* **api:** add datagouv parser ([084edde](https://github.com/betagouv/api-subventions-asso/commit/084edde4443de67b0781026ee8c1214b85bbd79f))
* **api:** add Entreprise siren entity and types ([ebcc26b](https://github.com/betagouv/api-subventions-asso/commit/ebcc26bc446d065aea92a30763395fbd7b683e6b))
* **api:** add osiris actions evaluation ([9214d51](https://github.com/betagouv/api-subventions-asso/commit/9214d51f9451643ee7ab861b1a195ce2dabbf396))
* **api:** add parse datagouv unitelegal ([a6cbddd](https://github.com/betagouv/api-subventions-asso/commit/a6cbddd9663a363ddf69d91fdeb49281f4d50a53))
* **api:** add repository for save siren in database ([4ed3cfe](https://github.com/betagouv/api-subventions-asso/commit/4ed3cfeeb2939e598916317c98d941862bff2ca1))
* **api:** chorus date can be excel date ([5a2ce7a](https://github.com/betagouv/api-subventions-asso/commit/5a2ce7a53501e47df56ee2d72d885965ad8c3141))
* **api:** insert many enitites in rna-siren and clean duplicate entities in collection ([68b9a53](https://github.com/betagouv/api-subventions-asso/commit/68b9a53acdade17310c30f0bb26ba4a121b67f68))
* **api:** parse chorus xls file ([92f52eb](https://github.com/betagouv/api-subventions-asso/commit/92f52eb71864b101abce692471500606fbe8aaa7))
* **api:** parse new file ([4eb1f7e](https://github.com/betagouv/api-subventions-asso/commit/4eb1f7e676d3570fab304aa7814133c3d1568a8f))
* **api:** parse new format off chorus ([8cc1f83](https://github.com/betagouv/api-subventions-asso/commit/8cc1f8394e6069ecf1c5dd50fe17efad1574bfbe))
* **front:** add contact view ([ac70911](https://github.com/betagouv/api-subventions-asso/commit/ac7091151217035badf7bd0eaffc3686dcffddec))
* **front:** add legal notice view ([83ed57f](https://github.com/betagouv/api-subventions-asso/commit/83ed57f39a0f506d73ceb63553d165eb32cd0d0a))
* **front:** add news collumn in versement ([923edac](https://github.com/betagouv/api-subventions-asso/commit/923edac646752125efac98981a773f363047217c))


### Bug Fixes

* **api:** remove html in texte ([ccf95e9](https://github.com/betagouv/api-subventions-asso/commit/ccf95e9d511fb557f9e7f83925d27ea6e5d4e2be))
* **front:** change payments by paiements ([0290751](https://github.com/betagouv/api-subventions-asso/commit/02907517a58604d74cd2849cde657919c77cce59))

### [0.5.2](https://github.com/betagouv/api-subventions-asso/compare/v0.5.1...v0.5.2) (2022-03-29)

### [0.5.1](https://github.com/betagouv/api-subventions-asso/compare/v0.5.0...v0.5.1) (2022-03-29)


### Features

* **api, dto:** disable sort by subvention and update dtos ([7dd05ea](https://github.com/betagouv/api-subventions-asso/commit/7dd05ea4721b7d3deaad98d97e4a2279d05435de))
* **api:** add branche and unique_id in chorus entity and versement inteface ([5a083fc](https://github.com/betagouv/api-subventions-asso/commit/5a083fc95bc1c912202f28fa3c062ee8c19d28c2))
* **front:** add components module (global_components) ([1e281fc](https://github.com/betagouv/api-subventions-asso/commit/1e281fcd4240c29f9116b1ae3c31f75b50d477d9))
* **front:** add versement components ([42671aa](https://github.com/betagouv/api-subventions-asso/commit/42671aaf6d92a0168aa7349022f53f6805597e17))
* **front:** add versement in association view ([8983672](https://github.com/betagouv/api-subventions-asso/commit/89836720b47147a189906025587d0cb1632a4fa9))
* **front:** add versement in etablisement view ([4bfc878](https://github.com/betagouv/api-subventions-asso/commit/4bfc8783dc0c473299bcb528677b37d3add84cfb))

## [0.5.0](https://github.com/betagouv/api-subventions-asso/compare/v0.4.2...v0.5.0) (2022-03-25)


### Features

* **front:** add link to inscription form (farmaform) ([f226316](https://github.com/betagouv/api-subventions-asso/commit/f226316df873b23e3806932001dccfbac54f5223))


### Bug Fixes

* **front:** fix coquillette ([5778ac3](https://github.com/betagouv/api-subventions-asso/commit/5778ac33f65364b6b5a7a1deebfe514d5b9a4622))

### [0.4.2](https://github.com/betagouv/api-subventions-asso/compare/v0.4.1...v0.4.2) (2022-03-22)


### Bug Fixes

* **front:** reset-token with \/ ([d4857b0](https://github.com/betagouv/api-subventions-asso/commit/d4857b0f551e3b23bed02111da8cbf82051d5cb9))
* reset password token with \ ([ea4c1a5](https://github.com/betagouv/api-subventions-asso/commit/ea4c1a5717f3a18bed95896a403aa27df779d8a9))

### [0.4.1](https://github.com/betagouv/api-subventions-asso/compare/v0.4.0...v0.4.1) (2022-03-22)

## [0.4.0](https://github.com/betagouv/api-subventions-asso/compare/v0.3.0...v0.4.0) (2022-03-15)


### Features

* **api:** add cache systeme for data entreprise api ([01cac8a](https://github.com/betagouv/api-subventions-asso/commit/01cac8ab3e66a87982c7ae1d1220fbbaa127e0a8))
* **api:** change mail for use front url ([8b387a0](https://github.com/betagouv/api-subventions-asso/commit/8b387a079f174cabb9e2936beb8cfff2b4b04f3a))
* **api:** search asso by siren ([9353be6](https://github.com/betagouv/api-subventions-asso/commit/9353be6e2b512da2a8bf99636fb03a6d337068ac))
* **dto:** add etablissement_dto_response ([237f14d](https://github.com/betagouv/api-subventions-asso/commit/237f14da97313c189f615fec6f80a84a856aba98))
* **front:** add connection page ([5768907](https://github.com/betagouv/api-subventions-asso/commit/5768907af317ac948bc59932e226ebf2a1cac39a))
* **front:** add disconect button ([5aab5c8](https://github.com/betagouv/api-subventions-asso/commit/5aab5c84bc53dad12780bf876ed17d012f08cf53))
* **front:** add dowload controller and route for download association data ([c044177](https://github.com/betagouv/api-subventions-asso/commit/c044177b11f8ca3dcbdfc8ee854c4b10e0901979))
* **front:** add etablisement page ([af17207](https://github.com/betagouv/api-subventions-asso/commit/af17207de0ddc2561442390413ed73e85bc48dd6))
* **front:** add etablissement controller ([bb9f14d](https://github.com/betagouv/api-subventions-asso/commit/bb9f14db48706a8ae2937bff31606ca3d80c570f))
* **front:** add forget-password view ([db9c246](https://github.com/betagouv/api-subventions-asso/commit/db9c246c57609113203eef9ceb5aa606965c5afb))
* **front:** add loader between page when we use turbo ([12f88d1](https://github.com/betagouv/api-subventions-asso/commit/12f88d1035e8c01c90eb0aa3b92b1588dd9ee0ac))
* **front:** add reset password part ([fbf44f5](https://github.com/betagouv/api-subventions-asso/commit/fbf44f5291d921d1fd89f4a649c4743effd1542d))
* **front:** add search asso by siren ([72698c0](https://github.com/betagouv/api-subventions-asso/commit/72698c0e0226965e30d032cbe117cf42f3f15b5f))
* **front:** add search part ([04327ad](https://github.com/betagouv/api-subventions-asso/commit/04327ad138a189964de6e79375abcb7d733a3d3a))
* **front:** check password before send ([57317ce](https://github.com/betagouv/api-subventions-asso/commit/57317cef1c827c8d11a833e9d2a72326c290f008))
* **front:** move login template page to folder auth ([d72fe63](https://github.com/betagouv/api-subventions-asso/commit/d72fe637e696e06c7d622232a2f572f7d257391d))
* **front:** redirect to asso in search ([0bddafb](https://github.com/betagouv/api-subventions-asso/commit/0bddafb4068074fbfdf9d83a936be8bc98ac28da))
* **front:** refacto archi backend of frontoffice ([5c22ba5](https://github.com/betagouv/api-subventions-asso/commit/5c22ba55eb0b216d859bf698c070b53079885020))
* **front:** separates views into several components ([9326763](https://github.com/betagouv/api-subventions-asso/commit/93267637e079e845e80788806d199c97adc48747))
* **front:** show request by asso ([d8dfad7](https://github.com/betagouv/api-subventions-asso/commit/d8dfad7029976b419035d05d1e47f40c0a656de9))


### Bug Fixes

* **api:** fix map of undefined on cache class ([d3b9b1a](https://github.com/betagouv/api-subventions-asso/commit/d3b9b1affc5a4238e2af1bdb0d4e7e2af0bd65bf))
* **api:** search asso with rna ([7747cf8](https://github.com/betagouv/api-subventions-asso/commit/7747cf8bfaa8b5e903b61f24239c6a50a66864ae))
* **back:** fix test ([9402587](https://github.com/betagouv/api-subventions-asso/commit/9402587032bbaf6661f6ea76c9cb8433ce35d9de))
* **front_back:** fix error on search rna not found ([06c9355](https://github.com/betagouv/api-subventions-asso/commit/06c93558091b2518c0d633e2819182dbdb679867))
* **front:** fix front controller no detected ([78cc520](https://github.com/betagouv/api-subventions-asso/commit/78cc520f5c7976dfca2d73eaf98459b9c606ab04))

## [0.3.0](https://github.com/betagouv/api-subventions-asso/compare/v0.2.0...v0.3.0) (2022-03-03)


### Features

* add migration manager ([1f62394](https://github.com/betagouv/api-subventions-asso/commit/1f62394a204efb898f69c7a63da5dc4ca9138fe6))
* add versement module ([8b7bd95](https://github.com/betagouv/api-subventions-asso/commit/8b7bd954b0553a58b97e2bfab084bd7cbc888f27))
* index opertation type ([0c17581](https://github.com/betagouv/api-subventions-asso/commit/0c17581d049629288bd61d447116877fd4db7af1))


### Bug Fixes

* **mail-notifier:** suppressed tab no test is alright ([3f6313a](https://github.com/betagouv/api-subventions-asso/commit/3f6313a7ffd2da37b087499c7e465f2957164786))

## [0.2.0](https://github.com/betagouv/api-subventions-asso/compare/v0.1.0...v0.2.0) (2022-02-25)


### Features

* add cmd parse to fonjep cli controller ([15ada26](https://github.com/betagouv/api-subventions-asso/commit/15ada26fc15bf97dd20ced3c64d280ac0223afaa))
* add event manager ([0eea7f8](https://github.com/betagouv/api-subventions-asso/commit/0eea7f8000a83e41f66e569318982e8ccc66a3a6))
* add fonjep cli controller ([1e1a311](https://github.com/betagouv/api-subventions-asso/commit/1e1a311f83a689a1ac8d5edc44927df78a069b4a))
* add migration for chorusline ([7ed550f](https://github.com/betagouv/api-subventions-asso/commit/7ed550feb7ad72cba1b49785720c5d1db742a452))
* add migration for rnaSiren ([6367bcc](https://github.com/betagouv/api-subventions-asso/commit/6367bcce2042b6264595fcf6d139965a3905a937))
* add rnaSiren module ([21cc9c2](https://github.com/betagouv/api-subventions-asso/commit/21cc9c2c84aa62db02365456323f5539ed6cdf94))
* add tests FONJEP ([c10ef2c](https://github.com/betagouv/api-subventions-asso/commit/c10ef2c056d7394738fa8b0fad945c3be8b394ce))
* create fonjep parser and fonjep entity ([70f11a5](https://github.com/betagouv/api-subventions-asso/commit/70f11a53222cd8a6f62c324fa4458fc19c5f5426))
* create fonjep repository ([3d953ef](https://github.com/betagouv/api-subventions-asso/commit/3d953ef85d6a2349423d699417626567f6ab42c4))
* create fonjep service ([b2b0944](https://github.com/betagouv/api-subventions-asso/commit/b2b0944b119a78b21d0797ffd4872de421f919e0))
* fonjep as provider to etablissement and demandesubvention ([b2492d3](https://github.com/betagouv/api-subventions-asso/commit/b2492d3bc58159602a41bca5953ccd30a32138fe))
* move parse file in parse helpers ([43b5f57](https://github.com/betagouv/api-subventions-asso/commit/43b5f57f776d352e7d2531ad9c16d2b4f3ae18cb))
* osiris and lca loader on parse ([1f60957](https://github.com/betagouv/api-subventions-asso/commit/1f609571cface4823ef4bb07ef3c6cce161b1272))
* parse new format of chorus ([c0215d4](https://github.com/betagouv/api-subventions-asso/commit/c0215d4fd3b9e678aa2c6d66c7e8f85e12ad5608))
* print progree check if stdout exist ([e282ba9](https://github.com/betagouv/api-subventions-asso/commit/e282ba9ea07a65c768f5438c21710f0f0e21a4b5))
* use rna siren on providers ([dc7d810](https://github.com/betagouv/api-subventions-asso/commit/dc7d810c862394eba1d8bf1aa4dd6156218f255e))


### Bug Fixes

* fix lca test with rna siret module ([f742e81](https://github.com/betagouv/api-subventions-asso/commit/f742e8175946360fa33f96d7b4a4b304a5e56dd3))
* review clean ([61155ce](https://github.com/betagouv/api-subventions-asso/commit/61155cea11815b36b8be391f020b0e4314f902e9))
* use good version ([bba0618](https://github.com/betagouv/api-subventions-asso/commit/bba0618ee18d2c1293529cf59ee89d6e163fb6fa))

## [0.1.0](https://github.com/betagouv/api-subventions-asso/compare/v0.0.1...v0.1.0) (2022-02-16)

### [0.0.2](https://github.com/betagouv/api-subventions-asso/compare/v0.0.1...v0.0.2) (2022-02-16)

### 0.0.1 (2022-02-16)


### Features

* add Auth and user module ([db291a9](https://github.com/betagouv/api-subventions-asso/commit/db291a9c366e9a74245b15b0ebdf78019cf32dad))
* add chorus cli controller ([263c29e](https://github.com/betagouv/api-subventions-asso/commit/263c29e375ffe351c85e5cecf309a3a4cafc4be9))
* add chorus parser and entity ([1608b2e](https://github.com/betagouv/api-subventions-asso/commit/1608b2eefd3a8311383299ec5d7a1013ec53d8a0))
* add chorus repository and service ([d7dc7c0](https://github.com/betagouv/api-subventions-asso/commit/d7dc7c07e0e475d8a93086e45b270fd7d758bf39))
* add cli interface ([176bd97](https://github.com/betagouv/api-subventions-asso/commit/176bd97300dec52fea612c893646a20bc46d9435))
* add code cov actions ([494646f](https://github.com/betagouv/api-subventions-asso/commit/494646f966dd266e7e041d495f48a74837b74c62))
* add controller in tests ([518acca](https://github.com/betagouv/api-subventions-asso/commit/518acca2217fa7480e24861ac4eb0c544b811e90))
* add engines version in package ([9f16d8b](https://github.com/betagouv/api-subventions-asso/commit/9f16d8b8d068272c119c0efc8d0ecafa433a0fc8))
* add externals services ([8087649](https://github.com/betagouv/api-subventions-asso/commit/8087649aba7fd5c5bbc9ba53d50d244d3e7b5ab3))
* add helpers ([5936f9b](https://github.com/betagouv/api-subventions-asso/commit/5936f9b64573ebfa353c534887db01daae9b480a))
* add le compte asso module ([f2517e2](https://github.com/betagouv/api-subventions-asso/commit/f2517e2618079a0be128ae7f77ec49fb98d41f72))
* add log options ([1c10a8f](https://github.com/betagouv/api-subventions-asso/commit/1c10a8f6d67a74584bb5d085dd9261723bff505e))
* add logger ([e4a2e47](https://github.com/betagouv/api-subventions-asso/commit/e4a2e4783292cd167acfc13bc732a10926342e8f))
* add logout route ([c9fefb7](https://github.com/betagouv/api-subventions-asso/commit/c9fefb7221933349b82c392c6e12de0614b69fc2))
* add mail create and forget password ([9b74be9](https://github.com/betagouv/api-subventions-asso/commit/9b74be9ab5f1fdaebb729fa51a43e44345fb5b2b))
* add mail notifier ([410fda8](https://github.com/betagouv/api-subventions-asso/commit/410fda8c3e3560b04dd86020d1a0c44419228d20))
* add method to get data from Siren ([9c1cc79](https://github.com/betagouv/api-subventions-asso/commit/9c1cc79a22054c592fa24d2cb72e5ef71a43359b))
* add mongodb to app ([18bf445](https://github.com/betagouv/api-subventions-asso/commit/18bf445bf003412186efc1fec13f350f46643b4e))
* add new parser in osiris ([8cd4c23](https://github.com/betagouv/api-subventions-asso/commit/8cd4c236efa62465e75116b3d7452ec3fc754048))
* add osiris module ([bfa54a6](https://github.com/betagouv/api-subventions-asso/commit/bfa54a663f64e29012653a28b2b0cc1f04c69c1e))
* add pre hook to build and lint script ([806fa20](https://github.com/betagouv/api-subventions-asso/commit/806fa20de7706b647c2305ce60412a4b5691d39f))
* add providerMatchingKeys in RequestEntities ([d0c099e](https://github.com/betagouv/api-subventions-asso/commit/d0c099ec5c6749ffe858f1a95ba4c369a09b0e1c))
* add search module ([ae048b2](https://github.com/betagouv/api-subventions-asso/commit/ae048b215e777a2b05067a95e78df464a74bcaa0))
* add swagger docs and TSOA ([86e9711](https://github.com/betagouv/api-subventions-asso/commit/86e9711b61729a7b1dd0f6360e766a7c3003802e))
* add user change password ([ce07387](https://github.com/betagouv/api-subventions-asso/commit/ce07387a9262944b1d33b142d50a99eeef826f50))
* add user cli controller ([8909a72](https://github.com/betagouv/api-subventions-asso/commit/8909a72b26271fea670eb905de340c1b354cf817))
* add user http controller ([3e039ce](https://github.com/betagouv/api-subventions-asso/commit/3e039cec0e6bdc73c178af4869d11c4cb4748a9d))
* add validators ([055cf68](https://github.com/betagouv/api-subventions-asso/commit/055cf68dd4b2d1143beec5f08ed8583d43659f3e))
* change api name ([259ee58](https://github.com/betagouv/api-subventions-asso/commit/259ee58a319329a09f3f8b01b48957eab511b616))
* change auth routes ([39f87f0](https://github.com/betagouv/api-subventions-asso/commit/39f87f0af97f744497094de35277100b4097f940))
* change key msg by message ([c0dbafe](https://github.com/betagouv/api-subventions-asso/commit/c0dbafef37c7a8867b6fb92dfa332cddbe58ea2f))
* change output format ([7add298](https://github.com/betagouv/api-subventions-asso/commit/7add2989bfc409163ebf24e491a722d871544e18))
* change output format and add budgetline and Request match ([7d59b87](https://github.com/betagouv/api-subventions-asso/commit/7d59b87c9be93afbbe05ca716501dfee4f037ff0))
* change output format for entrepriseAPI ([7b289d6](https://github.com/betagouv/api-subventions-asso/commit/7b289d6dce5d70d101081a5076be8abc847a1ed9))
* change siret and rna api to entreprise api ([1cbc907](https://github.com/betagouv/api-subventions-asso/commit/1cbc907b6806d8f2e101fbd982788cc983736ceb))
* clean and update README.md ([e65ac23](https://github.com/betagouv/api-subventions-asso/commit/e65ac23f3adebaf69689c22b7c9f2ad17d72b6aa))
* move Rna and Siret interfaces ([8435969](https://github.com/betagouv/api-subventions-asso/commit/84359697d4c8c743db3bdfbbe1180c6533f41c29))
* osiris mutli import and extract log file ([3c86de6](https://github.com/betagouv/api-subventions-asso/commit/3c86de6a35357fc1dcf5a04104baad626f9efb54))
* parser can have an adapter ([17d0143](https://github.com/betagouv/api-subventions-asso/commit/17d0143cc91162236a4b24d78acd1afc51a6de26))
* paser multi file in leCompteAsso ([8f60ff4](https://github.com/betagouv/api-subventions-asso/commit/8f60ff4c02dff4c0b26b25b1feae77707669eca5))
* restart container after init ([d0e725f](https://github.com/betagouv/api-subventions-asso/commit/d0e725f7d327df5aeca560719bdc275087fb2f1e))
* securize search controller ([b4621bf](https://github.com/betagouv/api-subventions-asso/commit/b4621bf1d8c1cec8f87aaf93f6a1ebb3d023aa31))
* update legal categories ([2cfe652](https://github.com/betagouv/api-subventions-asso/commit/2cfe652ffc81144180fc814436bd85b0d3776408))
* use Siret and Rna types ([8cc30bb](https://github.com/betagouv/api-subventions-asso/commit/8cc30bb0661920b9e24b92a062def8bdcafccc59))


### Bug Fixes

* clean for review ([928bcf9](https://github.com/betagouv/api-subventions-asso/commit/928bcf9a048193e69bef93c471054c0808e9321d))
* fix bug rna null on LCA ([570caeb](https://github.com/betagouv/api-subventions-asso/commit/570caeb6389e4adda6f999ff1c8e2592275747a1))
* fix github actions ([afc7088](https://github.com/betagouv/api-subventions-asso/commit/afc7088130c25bef4ebb22c53b022bdc5f71d92c))
* lint ([9526bbd](https://github.com/betagouv/api-subventions-asso/commit/9526bbdc05215b9a32108f9a42abc1df88d12ee2))
* review clean ([b5182b7](https://github.com/betagouv/api-subventions-asso/commit/b5182b7ac0c93b701fbe125f031f6e8a269f2018))
* use good version ([c3e6888](https://github.com/betagouv/api-subventions-asso/commit/c3e6888b66544b73fa1a830fbbace754f2201c82))

## 0.0.0 (2022-02-11)


### Features

* add Auth and user module ([db291a9](https://github.com/betagouv/api-subventions-asso/commit/db291a9c366e9a74245b15b0ebdf78019cf32dad))
* add chorus cli controller ([263c29e](https://github.com/betagouv/api-subventions-asso/commit/263c29e375ffe351c85e5cecf309a3a4cafc4be9))
* add chorus parser and entity ([1608b2e](https://github.com/betagouv/api-subventions-asso/commit/1608b2eefd3a8311383299ec5d7a1013ec53d8a0))
* add chorus repository and service ([d7dc7c0](https://github.com/betagouv/api-subventions-asso/commit/d7dc7c07e0e475d8a93086e45b270fd7d758bf39))
* add cli interface ([176bd97](https://github.com/betagouv/api-subventions-asso/commit/176bd97300dec52fea612c893646a20bc46d9435))
* add code cov actions ([494646f](https://github.com/betagouv/api-subventions-asso/commit/494646f966dd266e7e041d495f48a74837b74c62))
* add controller in tests ([518acca](https://github.com/betagouv/api-subventions-asso/commit/518acca2217fa7480e24861ac4eb0c544b811e90))
* add engines version in package ([9f16d8b](https://github.com/betagouv/api-subventions-asso/commit/9f16d8b8d068272c119c0efc8d0ecafa433a0fc8))
* add externals services ([8087649](https://github.com/betagouv/api-subventions-asso/commit/8087649aba7fd5c5bbc9ba53d50d244d3e7b5ab3))
* add helpers ([5936f9b](https://github.com/betagouv/api-subventions-asso/commit/5936f9b64573ebfa353c534887db01daae9b480a))
* add le compte asso module ([f2517e2](https://github.com/betagouv/api-subventions-asso/commit/f2517e2618079a0be128ae7f77ec49fb98d41f72))
* add log options ([1c10a8f](https://github.com/betagouv/api-subventions-asso/commit/1c10a8f6d67a74584bb5d085dd9261723bff505e))
* add logger ([e4a2e47](https://github.com/betagouv/api-subventions-asso/commit/e4a2e4783292cd167acfc13bc732a10926342e8f))
* add logout route ([c9fefb7](https://github.com/betagouv/api-subventions-asso/commit/c9fefb7221933349b82c392c6e12de0614b69fc2))
* add mail create and forget password ([9b74be9](https://github.com/betagouv/api-subventions-asso/commit/9b74be9ab5f1fdaebb729fa51a43e44345fb5b2b))
* add mail notifier ([410fda8](https://github.com/betagouv/api-subventions-asso/commit/410fda8c3e3560b04dd86020d1a0c44419228d20))
* add method to get data from Siren ([9c1cc79](https://github.com/betagouv/api-subventions-asso/commit/9c1cc79a22054c592fa24d2cb72e5ef71a43359b))
* add mongodb to app ([18bf445](https://github.com/betagouv/api-subventions-asso/commit/18bf445bf003412186efc1fec13f350f46643b4e))
* add new parser in osiris ([8cd4c23](https://github.com/betagouv/api-subventions-asso/commit/8cd4c236efa62465e75116b3d7452ec3fc754048))
* add osiris module ([bfa54a6](https://github.com/betagouv/api-subventions-asso/commit/bfa54a663f64e29012653a28b2b0cc1f04c69c1e))
* add pre hook to build and lint script ([806fa20](https://github.com/betagouv/api-subventions-asso/commit/806fa20de7706b647c2305ce60412a4b5691d39f))
* add providerMatchingKeys in RequestEntities ([d0c099e](https://github.com/betagouv/api-subventions-asso/commit/d0c099ec5c6749ffe858f1a95ba4c369a09b0e1c))
* add search module ([ae048b2](https://github.com/betagouv/api-subventions-asso/commit/ae048b215e777a2b05067a95e78df464a74bcaa0))
* add swagger docs and TSOA ([86e9711](https://github.com/betagouv/api-subventions-asso/commit/86e9711b61729a7b1dd0f6360e766a7c3003802e))
* add user change password ([ce07387](https://github.com/betagouv/api-subventions-asso/commit/ce07387a9262944b1d33b142d50a99eeef826f50))
* add user cli controller ([8909a72](https://github.com/betagouv/api-subventions-asso/commit/8909a72b26271fea670eb905de340c1b354cf817))
* add user http controller ([3e039ce](https://github.com/betagouv/api-subventions-asso/commit/3e039cec0e6bdc73c178af4869d11c4cb4748a9d))
* add validators ([055cf68](https://github.com/betagouv/api-subventions-asso/commit/055cf68dd4b2d1143beec5f08ed8583d43659f3e))
* change api name ([259ee58](https://github.com/betagouv/api-subventions-asso/commit/259ee58a319329a09f3f8b01b48957eab511b616))
* change auth routes ([39f87f0](https://github.com/betagouv/api-subventions-asso/commit/39f87f0af97f744497094de35277100b4097f940))
* change key msg by message ([c0dbafe](https://github.com/betagouv/api-subventions-asso/commit/c0dbafef37c7a8867b6fb92dfa332cddbe58ea2f))
* change output format and add budgetline and Request match ([7d59b87](https://github.com/betagouv/api-subventions-asso/commit/7d59b87c9be93afbbe05ca716501dfee4f037ff0))
* change output format for entrepriseAPI ([7b289d6](https://github.com/betagouv/api-subventions-asso/commit/7b289d6dce5d70d101081a5076be8abc847a1ed9))
* change siret and rna api to entreprise api ([1cbc907](https://github.com/betagouv/api-subventions-asso/commit/1cbc907b6806d8f2e101fbd982788cc983736ceb))
* clean and update README.md ([e65ac23](https://github.com/betagouv/api-subventions-asso/commit/e65ac23f3adebaf69689c22b7c9f2ad17d72b6aa))
* move Rna and Siret interfaces ([8435969](https://github.com/betagouv/api-subventions-asso/commit/84359697d4c8c743db3bdfbbe1180c6533f41c29))
* osiris mutli import and extract log file ([3c86de6](https://github.com/betagouv/api-subventions-asso/commit/3c86de6a35357fc1dcf5a04104baad626f9efb54))
* parser can have an adapter ([17d0143](https://github.com/betagouv/api-subventions-asso/commit/17d0143cc91162236a4b24d78acd1afc51a6de26))
* paser multi file in leCompteAsso ([8f60ff4](https://github.com/betagouv/api-subventions-asso/commit/8f60ff4c02dff4c0b26b25b1feae77707669eca5))
* restart container after init ([d0e725f](https://github.com/betagouv/api-subventions-asso/commit/d0e725f7d327df5aeca560719bdc275087fb2f1e))
* securize search controller ([b4621bf](https://github.com/betagouv/api-subventions-asso/commit/b4621bf1d8c1cec8f87aaf93f6a1ebb3d023aa31))
* update legal categories ([2cfe652](https://github.com/betagouv/api-subventions-asso/commit/2cfe652ffc81144180fc814436bd85b0d3776408))
* use Siret and Rna types ([8cc30bb](https://github.com/betagouv/api-subventions-asso/commit/8cc30bb0661920b9e24b92a062def8bdcafccc59))


### Bug Fixes

* clean for review ([928bcf9](https://github.com/betagouv/api-subventions-asso/commit/928bcf9a048193e69bef93c471054c0808e9321d))
* fix bug rna null on LCA ([570caeb](https://github.com/betagouv/api-subventions-asso/commit/570caeb6389e4adda6f999ff1c8e2592275747a1))
* fix github actions ([afc7088](https://github.com/betagouv/api-subventions-asso/commit/afc7088130c25bef4ebb22c53b022bdc5f71d92c))
* lint ([9526bbd](https://github.com/betagouv/api-subventions-asso/commit/9526bbdc05215b9a32108f9a42abc1df88d12ee2))
* review clean ([b5182b7](https://github.com/betagouv/api-subventions-asso/commit/b5182b7ac0c93b701fbe125f031f6e8a269f2018))
* use good version ([5cbb995](https://github.com/betagouv/api-subventions-asso/commit/5cbb995502db3b5c999795f0dcc52829317844d0))
