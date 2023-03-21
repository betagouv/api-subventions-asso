# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.24.2](https://github.com/betagouv/api-subventions-asso/compare/v0.24.1...v0.24.2) (2023-03-21)


### Bug Fixes

* **api,fron:** hotfix caisse depos and wrong merge ([6a7df46](https://github.com/betagouv/api-subventions-asso/commit/6a7df46999fd6fee2fa10e806b88860f3e0743ec))





## [0.24.1](https://github.com/betagouv/api-subventions-asso/compare/v0.24.0...v0.24.1) (2023-03-21)


### Bug Fixes

* **api:** fix reading error ([d46cc11](https://github.com/betagouv/api-subventions-asso/commit/d46cc1169cd5939fc74cf69a9bf9b98c41727873))





# [0.24.0](https://github.com/betagouv/api-subventions-asso/compare/v0.23.9...v0.24.0) (2023-03-21)


### Bug Fixes

* **api:** admin user creation success response ([bc116c9](https://github.com/betagouv/api-subventions-asso/commit/bc116c95d5c9e49386280817c91b362ad3b7240a))
* **api:** api asso fix error on document is not array on structure dont have identite ([f4364da](https://github.com/betagouv/api-subventions-asso/commit/f4364da0652a5ce3f10b71416deb33faafbadb70))
* **api:** call splited route for rna and siren in api asso ([737559d](https://github.com/betagouv/api-subventions-asso/commit/737559d35680b2655ceec01c89927bb4833cb84e))
* **api:** fix _merge entities and one tests ([1148570](https://github.com/betagouv/api-subventions-asso/commit/11485703e30dc6c02128efc53cbd25d1ffb203eb))
* **api:** fix TS error ([0e55260](https://github.com/betagouv/api-subventions-asso/commit/0e55260a6e8628f002e0438e1519fd845a708978))
* **api:** remove .only in tests and fix etablissement headcount url ([f44e3d0](https://github.com/betagouv/api-subventions-asso/commit/f44e3d0e3d158a231e44a8de9843719e8325617a))
* **api:** revert NotFoundError in getEtablissements() ([9badb82](https://github.com/betagouv/api-subventions-asso/commit/9badb82b3f325c5b377ba89a4745b6c409455ae4))
* **api:** update AssociationController test ([6d857f8](https://github.com/betagouv/api-subventions-asso/commit/6d857f83343c5127ebbb026a2d713761b2f1249b))


### Features

* **api, dto:** update error handling in UserController ([9b0c058](https://github.com/betagouv/api-subventions-asso/commit/9b0c0587e01c80f4f1940511ceddf8e0f9417d91))
* **api, front:** add # in password regex ([8e4915d](https://github.com/betagouv/api-subventions-asso/commit/8e4915db7351fbcfedf5f5e8afdbe7075e65c7b9))
* **api,dto:** update according to caisse dto spelling fixes ([bb7d2e6](https://github.com/betagouv/api-subventions-asso/commit/bb7d2e681bf51c45caef61ec7d9c96229708c578))
* **api,front:** wording ([ab2b0ad](https://github.com/betagouv/api-subventions-asso/commit/ab2b0ad7992bfab470b1b438348b33806ed251b5))
* **api:** adapter call in method with api call ([cf9c313](https://github.com/betagouv/api-subventions-asso/commit/cf9c31335f800b7ee1ed1bf7959604cf03956b28))
* **api:** add dbo to subvention dto adapter ([8c4d89a](https://github.com/betagouv/api-subventions-asso/commit/8c4d89a77364d35731df9221288836d358962142))
* **api:** add ds dto to dbo adapter ([49a9f80](https://github.com/betagouv/api-subventions-asso/commit/49a9f805508ba64f75b71bcc02ae98241e1e4871))
* **api:** add endpoint user by request ([ec8467a](https://github.com/betagouv/api-subventions-asso/commit/ec8467a13f91f6c0a2d41de42a0bf3630c166e8e))
* **api:** add joiner between user and association visits ([5b972e7](https://github.com/betagouv/api-subventions-asso/commit/5b972e7e161f46ea3b456473c547170a9e981702))
* **api:** add posibility to add schema and update/find ds data ([fe906d1](https://github.com/betagouv/api-subventions-asso/commit/fe906d1ad7d0d3f6a2977b8ffe52325db1544c5e))
* **api:** add real template ids ([be9dc5a](https://github.com/betagouv/api-subventions-asso/commit/be9dc5aa524534a0b318183deb77cef9736f0453))
* **api:** better use of data and its tests ([c0f9bc5](https://github.com/betagouv/api-subventions-asso/commit/c0f9bc5ba5a528bcbaab531178b0791d27c8efb1))
* **api:** caisse depots service and adapter ([2003014](https://github.com/betagouv/api-subventions-asso/commit/2003014f593b1d16448b9bdd0db015a44c84b3ad))
* **api:** caisse depots, fonjep and gispro adapters implements new dto ([6bd8fdd](https://github.com/betagouv/api-subventions-asso/commit/6bd8fdd9553fa805628b336ed0ff29a212c6450d))
* **api:** caisseDepots types ([5f3079d](https://github.com/betagouv/api-subventions-asso/commit/5f3079dfe7dd980e78bdc04102631cc4fd1cf256))
* **api:** change 422 to 404 HTTP error ([9f6dce3](https://github.com/betagouv/api-subventions-asso/commit/9f6dce362e5054064c55fb653a6f5a9f463e71d7))
* **api:** controller route to get emails of extractor users ([72b6c3b](https://github.com/betagouv/api-subventions-asso/commit/72b6c3b35a968961301a038c492e021c650810f2))
* **api:** create tokenHelper ([136b22f](https://github.com/betagouv/api-subventions-asso/commit/136b22f95f8530212c3a5a83fd0309cc24e4bca0))
* **api:** date helper sameDateNextYear ([3997f56](https://github.com/betagouv/api-subventions-asso/commit/3997f561f520780e0f0ba8032f908f70aa32a186))
* **api:** dauphin adapter implements new dto ([e710e9e](https://github.com/betagouv/api-subventions-asso/commit/e710e9e3a0034cc2d8416f364b4a1a0e242a2196))
* **api:** dedent password errors ([3c1304c](https://github.com/betagouv/api-subventions-asso/commit/3c1304cd2c1f6eb1b67b71eeb9a0b7a14ce78b1f))
* **api:** demarches simplifiees poc ([08b6838](https://github.com/betagouv/api-subventions-asso/commit/08b683886d4be0f533f292eb183cf3b6a935c8cb))
* **api:** demarches simplifiees poc cli ([0577e77](https://github.com/betagouv/api-subventions-asso/commit/0577e77c0173797762ec1f82ac0fa1193d444d56))
* **api:** error handling in search controller ([d653e84](https://github.com/betagouv/api-subventions-asso/commit/d653e8445eebabc114300cab5beadcb0f7bfb23b))
* **api:** get emails from logs about extracts ([975fb8b](https://github.com/betagouv/api-subventions-asso/commit/975fb8b022a2007fa832d6aa45ffd80fb83f9721))
* **api:** helper to convert status ([2c9468c](https://github.com/betagouv/api-subventions-asso/commit/2c9468c7ef4912826fdf14fe1df33453ee36fa78))
* **api:** include error code in Error interface ([4d5f46b](https://github.com/betagouv/api-subventions-asso/commit/4d5f46b1def5606997c5de2d9f39503fc292c479))
* **api:** integ test consumer controller ([00fe33b](https://github.com/betagouv/api-subventions-asso/commit/00fe33b85b918b8e8491d22ea8613243937e3e41))
* **api:** osiris adapter implements new dto ([32a107e](https://github.com/betagouv/api-subventions-asso/commit/32a107ec476f0373ea45bf7723fdfcd267862645))
* **api:** prepare use of sendinblue template emails ([960114e](https://github.com/betagouv/api-subventions-asso/commit/960114eda8955ad0520ec3729668ce6a5d3e93e0))
* **api:** register extract routes and tests ([21474dd](https://github.com/betagouv/api-subventions-asso/commit/21474ddbff909544361bd9d9cf5782a1ccb8e77b))
* **api:** register new provider ([bec0c9c](https://github.com/betagouv/api-subventions-asso/commit/bec0c9cc78a7232b44e5a8660e6ffed50711b717))
* **api:** remove success:true from refactored methods ([2c78f40](https://github.com/betagouv/api-subventions-asso/commit/2c78f4006429300f6bd4d4394783c956ff647a23))
* **api:** remove TODO comment ([3a39761](https://github.com/betagouv/api-subventions-asso/commit/3a39761173db8f38fa3bf5c1c8fdb19b05d2f34a))
* **api:** return 201 in createUser ([622c3c8](https://github.com/betagouv/api-subventions-asso/commit/622c3c8fadf2c4f851a0d4c0867df889d19548c7))
* **api:** return which role is not valid ([fabaeef](https://github.com/betagouv/api-subventions-asso/commit/fabaeef0f09ff477d0f7b35d68f6b9c7b16b7a61))
* **api:** save Object.values before loop ([4112202](https://github.com/betagouv/api-subventions-asso/commit/41122024db1e232a5c7d5329f6288985db040450))
* **api:** sort name by provider trust and fix mergable same asso ([c1c0d25](https://github.com/betagouv/api-subventions-asso/commit/c1c0d252b89224787772f92935981a37dddd179b))
* **api:** test cli command ([90947d4](https://github.com/betagouv/api-subventions-asso/commit/90947d48ff2f622b5ecd39fe6fad51917e172831))
* **api:** update tests ([e24d6c5](https://github.com/betagouv/api-subventions-asso/commit/e24d6c5245f95d750176afcc5cc3acbb25c0397f))
* **api:** use helper ([b0449ad](https://github.com/betagouv/api-subventions-asso/commit/b0449ad3135e0ad6ade39f3af323dc74f677f9e2))
* **api:** wip wip ([3d90dee](https://github.com/betagouv/api-subventions-asso/commit/3d90dee79d28764e9c8f2c5506d983e1293f4671))
* **front:** add ds on data provider and qwick fix on sizedTrim ([21b1adc](https://github.com/betagouv/api-subventions-asso/commit/21b1adcd90f58a5280c711bf7fc09b08b0e68873))
* **front:** helper tests if not an array given ([9e04988](https://github.com/betagouv/api-subventions-asso/commit/9e049889c6196af236b70cd4aed99b8828e189ea))
* **front:** wording and spelling ([ed47bca](https://github.com/betagouv/api-subventions-asso/commit/ed47bcaa6b4d4ca9d7863624399586764432a32d))





## [0.23.9](https://github.com/betagouv/api-subventions-asso/compare/v0.23.8...v0.23.9) (2023-03-10)

### Bug Fixes

-   **api:** add more check on use dauphin data ([f67f8c1](https://github.com/betagouv/api-subventions-asso/commit/f67f8c162380fcd1e7b3ef55b2682fee659ea02c))

## [0.23.8](https://github.com/betagouv/api-subventions-asso/compare/v0.23.7...v0.23.8) (2023-03-08)

### Bug Fixes

-   **api:** atomic update of association-name collection ([02099de](https://github.com/betagouv/api-subventions-asso/commit/02099de76d091f291a159a2e6e23e4536b676bb7))

## [0.23.6](https://github.com/betagouv/api-subventions-asso/compare/v0.23.5...v0.23.6) (2023-02-23)

### Bug Fixes

-   **api:** change provider name for etablishement data ([dbf2e94](https://github.com/betagouv/api-subventions-asso/commit/dbf2e94ed9c4b57441b8ab18ff78407a8728d74d))

## [0.23.3](https://github.com/betagouv/api-subventions-asso/compare/v0.23.2...v0.23.3) (2023-02-15)

### Bug Fixes

-   **api:** update calendly link ([8932342](https://github.com/betagouv/api-subventions-asso/commit/89323421e4ae8cec4741ea21f2c1b6a728ef0072))

# [0.23.0](https://github.com/betagouv/api-subventions-asso/compare/v0.22.0...v0.23.0) (2023-02-13)

### Features

-   **front:** stat api does not invent data in the future ([c0a17fe](https://github.com/betagouv/api-subventions-asso/commit/c0a17fe7044ab130c5707cee5e7b99c7960b4c55))

# [0.22.0](https://github.com/betagouv/api-subventions-asso/compare/v0.21.4...v0.22.0) (2023-01-27)

### Bug Fixes

-   **api,front:** review cleaning ([a0beda3](https://github.com/betagouv/api-subventions-asso/commit/a0beda35b3891f7a28fe852b341d0f11942b65ab))
-   **api:** keep just good request ([#897](https://github.com/betagouv/api-subventions-asso/issues/897)) ([5b51d9c](https://github.com/betagouv/api-subventions-asso/commit/5b51d9c4646b5010d1b6ef1e1a43338877a1fc55))

### Features

-   **api, dto:** add UserCountByStatus stats ressource ([#896](https://github.com/betagouv/api-subventions-asso/issues/896)) ([d4ee988](https://github.com/betagouv/api-subventions-asso/commit/d4ee988e1dfa62b904fcdb5921fe62a533f676a3))
-   **api, front:** add code convention to README ([#903](https://github.com/betagouv/api-subventions-asso/issues/903)) ([c6da308](https://github.com/betagouv/api-subventions-asso/commit/c6da308640a354dfe6b6ab42879d3f3925f667da))
-   **api:** change logout managements ([#885](https://github.com/betagouv/api-subventions-asso/issues/885)) ([505efba](https://github.com/betagouv/api-subventions-asso/commit/505efbaa013e3654a06156995a283f022eb4be64)), closes [#864](https://github.com/betagouv/api-subventions-asso/issues/864)
-   **api:** change management of api asso files ([223227e](https://github.com/betagouv/api-subventions-asso/commit/223227e6c563c020c4104ed329e49a6909f14480))
-   **api:** return nb_users_before_year on get monthly user stats ([21a01c1](https://github.com/betagouv/api-subventions-asso/commit/21a01c19d9aa1064b2d5568502675207775f7e67))

## [0.21.4](https://github.com/betagouv/api-subventions-asso/compare/v0.21.3...v0.21.4) (2023-01-26)

### Bug Fixes

-   **api:** use cursor instead of array ([b0a3d26](https://github.com/betagouv/api-subventions-asso/commit/b0a3d261d0e52aa73b377bc1afa97c9e88c8d6e1))

## [0.21.3](https://github.com/betagouv/api-subventions-asso/compare/v0.20.4...v0.21.3) (2023-01-26)

### Bug Fixes

-   **api:** is domain accepted ([#848](https://github.com/betagouv/api-subventions-asso/issues/848)) ([b72b3d1](https://github.com/betagouv/api-subventions-asso/commit/b72b3d10048f3d69983cca75e4a419ae014f3a8e))
-   **api:** use sirene siege ([f66ccb5](https://github.com/betagouv/api-subventions-asso/commit/f66ccb5d80f37b283df337eb5458892db27585af))

### Features

-   **api, front:** update README ([#816](https://github.com/betagouv/api-subventions-asso/issues/816)) ([9281700](https://github.com/betagouv/api-subventions-asso/commit/928170063f582f217464727a14898c4a4ccdcb58))
-   **api,dto,front:** add email domains in db and allow admin to update it ([#753](https://github.com/betagouv/api-subventions-asso/issues/753)) ([dab4a57](https://github.com/betagouv/api-subventions-asso/commit/dab4a57562ed9fc79f08bed449166b8bed532da2))
-   **api:** [#668](https://github.com/betagouv/api-subventions-asso/issues/668) [#771](https://github.com/betagouv/api-subventions-asso/issues/771) save and consult top associations ([#811](https://github.com/betagouv/api-subventions-asso/issues/811)) ([f1f7123](https://github.com/betagouv/api-subventions-asso/commit/f1f71230e7eb78b98ca50da13cdd2d0901dfe99c))
-   **api:** [#737](https://github.com/betagouv/api-subventions-asso/issues/737) cumulative nb users by month one year ([#806](https://github.com/betagouv/api-subventions-asso/issues/806)) ([47b69d0](https://github.com/betagouv/api-subventions-asso/commit/47b69d047b90e961b1f0d087ae2eff1abd4716aa))

## [0.21.1](https://github.com/betagouv/api-subventions-asso/compare/v0.21.0...v0.21.1) (2023-01-17)

**Note:** Version bump only for package api

# [0.21.0](https://github.com/betagouv/api-subventions-asso/compare/v0.20.2...v0.21.0) (2023-01-17)

### Bug Fixes

-   **api:** is domain accepted ([#848](https://github.com/betagouv/api-subventions-asso/issues/848)) ([de44620](https://github.com/betagouv/api-subventions-asso/commit/de446203f2774f86f1691a5da0ee19bd2f5f0cc7))

### Features

-   **api, front:** update README ([#816](https://github.com/betagouv/api-subventions-asso/issues/816)) ([12a0684](https://github.com/betagouv/api-subventions-asso/commit/12a0684c5ea1f9ae853c41073bdb5be1c818c071))
-   **api,dto,front:** add email domains in db and allow admin to update it ([#753](https://github.com/betagouv/api-subventions-asso/issues/753)) ([e349963](https://github.com/betagouv/api-subventions-asso/commit/e349963263a7199035178623fd6e497dd6eb68ba))
-   **api:** [#668](https://github.com/betagouv/api-subventions-asso/issues/668) [#771](https://github.com/betagouv/api-subventions-asso/issues/771) save and consult top associations ([#811](https://github.com/betagouv/api-subventions-asso/issues/811)) ([3f1f4b2](https://github.com/betagouv/api-subventions-asso/commit/3f1f4b2f98ec75e0dcc953473508c79667050771))
-   **api:** [#737](https://github.com/betagouv/api-subventions-asso/issues/737) cumulative nb users by month one year ([#806](https://github.com/betagouv/api-subventions-asso/issues/806)) ([bd2f061](https://github.com/betagouv/api-subventions-asso/commit/bd2f06153eef16b7eab58affaf2d41c9892180ee))

## [0.20.4](https://github.com/betagouv/api-subventions-asso/compare/v0.20.3...v0.20.4) (2023-01-23)

### Bug Fixes

-   **api:** fix documents in case of error ([f2238e3](https://github.com/betagouv/api-subventions-asso/commit/f2238e3df1de196d750c4f02e11f421fd68f4f41))

## [0.20.3](https://github.com/betagouv/api-subventions-asso/compare/v0.20.2...v0.20.3) (2023-01-20)

### Features

-   **api:** add message on api index route ([4d5f64f](https://github.com/betagouv/api-subventions-asso/commit/4d5f64fa4d020c26c30c6e8ee0763c74c12d91e8))

## [0.20.2](https://github.com/betagouv/api-subventions-asso/compare/v0.19.4...v0.20.2) (2023-01-05)

### Bug Fixes

-   **api:** remove throw in ecode api rna title migrations ([9c7b0da](https://github.com/betagouv/api-subventions-asso/commit/9c7b0dae3183a0f9aa7392f396e458b15bd85179))

### Features

-   **api:** 669 montly nb requests by year stat route ([#726](https://github.com/betagouv/api-subventions-asso/issues/726)) ([df4dce7](https://github.com/betagouv/api-subventions-asso/commit/df4dce7341ab1d15626365258fd6dd2cf0a2ee37))

## [0.20.1](https://github.com/betagouv/api-subventions-asso/compare/v0.20.0...v0.20.1) (2023-01-03)

### Bug Fixes

-   **api:** remove throw in ecode api rna title migrations ([0854550](https://github.com/betagouv/api-subventions-asso/commit/08545503548f23c9640fede3ebaa743f8a5799f7))

# [0.20.0](https://github.com/betagouv/api-subventions-asso/compare/v0.19.3...v0.20.0) (2023-01-03)

### Features

-   **api:** 669 montly nb requests by year stat route ([#726](https://github.com/betagouv/api-subventions-asso/issues/726)) ([391da49](https://github.com/betagouv/api-subventions-asso/commit/391da49f75cdbf289cf06daba55475318de16bcf))

## [0.19.4](https://github.com/betagouv/api-subventions-asso/compare/v0.19.3...v0.19.4) (2023-01-05)

### Bug Fixes

-   **api:** change sort order on api asso documents ([33c6c18](https://github.com/betagouv/api-subventions-asso/commit/33c6c1814de5672d6b71bb11d7fe509222a463b6))

## [0.19.2](https://github.com/betagouv/api-subventions-asso/compare/v0.18.7...v0.19.2) (2022-12-27)

### Bug Fixes

-   **api:** format data with array containing one element ([d445296](https://github.com/betagouv/api-subventions-asso/commit/d4452964ea6d3e63aa87b8eeb48bb6190f8f23ae))
-   **api:** sort getSubventions result to avoid race failure ([8d4df00](https://github.com/betagouv/api-subventions-asso/commit/8d4df00038a201e9f5ee8a1ab96f6996aff79a3f))
-   **api:** update snapshot ([562d651](https://github.com/betagouv/api-subventions-asso/commit/562d65106ce4b44ca5e8d3116ebe8d4dd7a8ea7f))
-   **api:** use async foreach instead of promise all ([1460340](https://github.com/betagouv/api-subventions-asso/commit/1460340e69f5a26558f341e78ed566488624cf28))
-   **api:** use real compare method to fix the test ([dd2c12a](https://github.com/betagouv/api-subventions-asso/commit/dd2c12a726645c95a385c1763096a336ff213188))

### Features

-   **api:** accept caissedesdepots.fr email domain ([b3a9199](https://github.com/betagouv/api-subventions-asso/commit/b3a919945b1590ea9863fdc2d32a4f6fc6536624))
-   **api:** add migration for osiris requests indexes ([#623](https://github.com/betagouv/api-subventions-asso/issues/623)) ([87d8338](https://github.com/betagouv/api-subventions-asso/commit/87d8338ca253c36b3ca4011ff5c29869227138af))
-   **front, api:** add etablissement dashboard ([#709](https://github.com/betagouv/api-subventions-asso/issues/709)) ([4e85991](https://github.com/betagouv/api-subventions-asso/commit/4e85991bfec399f44fea558004fa09ad53a3182a))
-   **front:** add etablissment tab bank data ([c8142d1](https://github.com/betagouv/api-subventions-asso/commit/c8142d1a35a25a217fc9f41e31d2dd472263f181))

## [0.19.1](https://github.com/betagouv/api-subventions-asso/compare/v0.18.3...v0.19.1) (2022-12-26)

### Bug Fixes

-   **api:** format data with array containing one element ([2c52324](https://github.com/betagouv/api-subventions-asso/commit/2c52324b0a22c639d5c67ce5d8b9285e96543515))
-   **api:** sort getSubventions result to avoid race failure ([e6439bb](https://github.com/betagouv/api-subventions-asso/commit/e6439bbdeb59cbe866942f5d6916922c18531db3))
-   **api:** update LCA document description text ([a5be48c](https://github.com/betagouv/api-subventions-asso/commit/a5be48c454249e2c6e1b7fa22efd476dd227b611))
-   **api:** update snapshot ([5e29d8a](https://github.com/betagouv/api-subventions-asso/commit/5e29d8a7abb7bf97d02a44f20cf7fc6881cc1ad8))
-   **api:** use real compare method to fix the test ([70b4554](https://github.com/betagouv/api-subventions-asso/commit/70b4554f74249518011f2e17a5ad87124239d0bf))

### Features

-   **api:** accept caissedesdepots.fr email domain ([ed9aaa5](https://github.com/betagouv/api-subventions-asso/commit/ed9aaa508a522eea8fffdf282c18cf3ba5fb5145))
-   **api:** add collectivite domain ([@rhone](https://github.com/rhone).fr) ([98d1bf3](https://github.com/betagouv/api-subventions-asso/commit/98d1bf31ec1bc070697672308bc4e7bd0b6f4ada))
-   **api:** add migration for osiris requests indexes ([#623](https://github.com/betagouv/api-subventions-asso/issues/623)) ([7de5708](https://github.com/betagouv/api-subventions-asso/commit/7de570817837945459a0af01aac1c49c84aa46b9))
-   **front, api:** add etablissement dashboard ([#709](https://github.com/betagouv/api-subventions-asso/issues/709)) ([b3c3cc3](https://github.com/betagouv/api-subventions-asso/commit/b3c3cc3b74259e0a1d5761002b98d32ff108fe34))
-   **front:** add etablissment tab bank data ([a74bd75](https://github.com/betagouv/api-subventions-asso/commit/a74bd75ac35e36f7695c6ada7f6e73bdf7ba645d))

# [0.19.0](https://github.com/betagouv/api-subventions-asso/compare/v0.18.3...v0.19.0) (2022-12-08)

## [0.18.7](https://github.com/betagouv/api-subventions-asso/compare/v0.18.6...v0.18.7) (2022-12-15)

### Bug Fixes

-   **api:** mock dauphin env var ([7e4667c](https://github.com/betagouv/api-subventions-asso/commit/7e4667cfe301a81f3817eec2356e1389988ad36e))

## [0.18.6](https://github.com/betagouv/api-subventions-asso/compare/v0.18.5...v0.18.6) (2022-12-15)

### Bug Fixes

-   **api:** update LCA document description text ([508e5c6](https://github.com/betagouv/api-subventions-asso/commit/508e5c62f76e73edf3444bce9abae1d505aff131))

## [0.18.5](https://github.com/betagouv/api-subventions-asso/compare/v0.18.3...v0.18.5) (2022-12-12)

### Features

-   **api:** add collectivite domain ([@rhone](https://github.com/rhone).fr) ([6cc7d7f](https://github.com/betagouv/api-subventions-asso/commit/6cc7d7f31133de3cdbbb0a5ce60ad2aa2863a353))

## [0.18.4](https://github.com/betagouv/api-subventions-asso/compare/v0.18.3...v0.18.4) (2022-12-12)

### Features

-   **api:** add collectivite domain ([@rhone](https://github.com/rhone).fr) ([6cc7d7f](https://github.com/betagouv/api-subventions-asso/commit/6cc7d7f31133de3cdbbb0a5ce60ad2aa2863a353))

## [0.18.2](https://github.com/betagouv/api-subventions-asso/compare/v0.18.1...v0.18.2) (2022-12-07)

### Bug Fixes

-   **api:** do not save user token within JWT on update ([#712](https://github.com/betagouv/api-subventions-asso/issues/712)) ([e8c4f47](https://github.com/betagouv/api-subventions-asso/commit/e8c4f47916cef3fcbfd4c2d7c8e9a73f770b961d))

## [0.18.1](https://github.com/betagouv/api-subventions-asso/compare/v0.18.0...v0.18.1) (2022-11-29)

### Bug Fixes

-   **api:** datagouv import tools ([349137d](https://github.com/betagouv/api-subventions-asso/commit/349137dc8682c4231d28000e97a348e3bd2f513b))

# [0.18.0](https://github.com/betagouv/api-subventions-asso/compare/v0.17.0...v0.18.0) (2022-11-22)

### Bug Fixes

-   **api:** consumer cli controller integ test ([f665f26](https://github.com/betagouv/api-subventions-asso/commit/f665f26be01204b7a61bae37f3d93bc1b3a6e6bc))
-   **front:** fix import js on ts ([f0a1c56](https://github.com/betagouv/api-subventions-asso/commit/f0a1c568d109d4572f2ac3a31481e07d9d0efa1b))

### Features

-   **api:** drop collection entreprise siren ([#559](https://github.com/betagouv/api-subventions-asso/issues/559)) ([e019b5b](https://github.com/betagouv/api-subventions-asso/commit/e019b5bd4d2d11cf6c6e40fa5e73b04ccc25f2a4))
-   **api:** move end point to etablissemnt services ([#579](https://github.com/betagouv/api-subventions-asso/issues/579)) ([521f1c2](https://github.com/betagouv/api-subventions-asso/commit/521f1c2076d0b8defbbf5f19c063a860f755d7b1))
-   **api:** save association and etablissement in datagouv CLI parsing ([#563](https://github.com/betagouv/api-subventions-asso/issues/563)) ([bbf01b6](https://github.com/betagouv/api-subventions-asso/commit/bbf01b6ce94f86440335dec802b7849e33d3d685))
-   **api:** update datagouv parser for reading history file ([#556](https://github.com/betagouv/api-subventions-asso/issues/556)) ([5258f19](https://github.com/betagouv/api-subventions-asso/commit/5258f19722af80eabf292f83d83faf6d4695399c))
-   **api:** update script parsage datagouv ([#560](https://github.com/betagouv/api-subventions-asso/issues/560)) ([9b9132d](https://github.com/betagouv/api-subventions-asso/commit/9b9132d061f9c0e3ed05711e0ab09f8e2be2cdfd))

## [0.17.3](https://github.com/betagouv/api-subventions-asso/compare/v0.18.0...v0.17.3) (2022-11-22)

### Bug Fixes

-   **api:** fix migration duplicate unique id ([031cd12](https://github.com/betagouv/api-subventions-asso/commit/031cd129d31411f86b7b135ad618f4b73b7a2d22))

### Bug Fixes

-   **api:** format data with array containing one element ([2c52324](https://github.com/betagouv/api-subventions-asso/commit/2c52324b0a22c639d5c67ce5d8b9285e96543515))
-   **api:** sort getSubventions result to avoid race failure ([e6439bb](https://github.com/betagouv/api-subventions-asso/commit/e6439bbdeb59cbe866942f5d6916922c18531db3))
-   **api:** update LCA document description text ([a5be48c](https://github.com/betagouv/api-subventions-asso/commit/a5be48c454249e2c6e1b7fa22efd476dd227b611))
-   **api:** update snapshot ([5e29d8a](https://github.com/betagouv/api-subventions-asso/commit/5e29d8a7abb7bf97d02a44f20cf7fc6881cc1ad8))
-   **api:** use real compare method to fix the test ([70b4554](https://github.com/betagouv/api-subventions-asso/commit/70b4554f74249518011f2e17a5ad87124239d0bf))

### Features

-   **api:** accept caissedesdepots.fr email domain ([ed9aaa5](https://github.com/betagouv/api-subventions-asso/commit/ed9aaa508a522eea8fffdf282c18cf3ba5fb5145))
-   **api:** add migration for osiris requests indexes ([#623](https://github.com/betagouv/api-subventions-asso/issues/623)) ([7de5708](https://github.com/betagouv/api-subventions-asso/commit/7de570817837945459a0af01aac1c49c84aa46b9))
-   **front, api:** add etablissement dashboard ([#709](https://github.com/betagouv/api-subventions-asso/issues/709)) ([b3c3cc3](https://github.com/betagouv/api-subventions-asso/commit/b3c3cc3b74259e0a1d5761002b98d32ff108fe34))
-   **front:** add etablissment tab bank data ([a74bd75](https://github.com/betagouv/api-subventions-asso/commit/a74bd75ac35e36f7695c6ada7f6e73bdf7ba645d))

## [0.17.2](https://github.com/betagouv/api-subventions-asso/compare/v0.17.0...v0.17.2) (2022-11-17)

### Bug Fixes

-   **api:** consumer cli controller integ test ([f665f26](https://github.com/betagouv/api-subventions-asso/commit/f665f26be01204b7a61bae37f3d93bc1b3a6e6bc))
-   **api:** create index on dauphin caches ([06487ad](https://github.com/betagouv/api-subventions-asso/commit/06487ada7e7ead8aed76c1b28a3bd995c5f82f07))
-   **api:** fix delete user ([1a95470](https://github.com/betagouv/api-subventions-asso/commit/1a95470332d8dd25df2c36c112468b8442dd9aaf))
-   **front:** fix import js on ts ([f0a1c56](https://github.com/betagouv/api-subventions-asso/commit/f0a1c568d109d4572f2ac3a31481e07d9d0efa1b))

## [0.17.1](https://github.com/betagouv/api-subventions-asso/compare/v0.17.0...v0.17.1) (2022-11-02)

### Bug Fixes

-   **api:** consumer cli controller integ test ([f665f26](https://github.com/betagouv/api-subventions-asso/commit/f665f26be01204b7a61bae37f3d93bc1b3a6e6bc))

# [0.17.0](https://github.com/betagouv/api-subventions-asso/compare/v0.15.5...v0.17.0) (2022-11-02)

### Bug Fixes

-   **api:** fix send wrong error on error in /auth/login ([#503](https://github.com/betagouv/api-subventions-asso/issues/503)) ([6a5ecc4](https://github.com/betagouv/api-subventions-asso/commit/6a5ecc42166618af549ba33a07a40981334105ce))
-   **api:** group associations names by rna or siren ([#504](https://github.com/betagouv/api-subventions-asso/issues/504)) ([7f8d501](https://github.com/betagouv/api-subventions-asso/commit/7f8d50118ccf4fa9f272ab89223f476a05404c47))
-   **api:** uniformize creation jwt token ([ea13507](https://github.com/betagouv/api-subventions-asso/commit/ea1350700cb8b927f9a96717447abf7b63c14d33))
-   **api:** update associationName ([dfc7c56](https://github.com/betagouv/api-subventions-asso/commit/dfc7c561b493e58c6691dd7fe5aeba712b1bc84a))
-   **front, api:** clean dauphin and subvention table ([#472](https://github.com/betagouv/api-subventions-asso/issues/472)) ([3c92975](https://github.com/betagouv/api-subventions-asso/commit/3c929753278cc575715b4e9b2f3088c834478fab))

### Features

-   **api, dto:** merge fonjep subvention raison with status ([957d627](https://github.com/betagouv/api-subventions-asso/commit/957d627d2db4ae2eaa63a49f53124c0780f973dd))
-   **api, front:** find asso documents from API ASSO ([#500](https://github.com/betagouv/api-subventions-asso/issues/500)) ([720eb8d](https://github.com/betagouv/api-subventions-asso/commit/720eb8dff34031e0196078d8b86aa0d5cfcc80af))
-   **api:** add authentication for consumer user [#512](https://github.com/betagouv/api-subventions-asso/issues/512) ([9e6d97b](https://github.com/betagouv/api-subventions-asso/commit/9e6d97be354f37e4394aac4acdfaf6bd3f37be2f))
-   **api:** add stats to user ([#470](https://github.com/betagouv/api-subventions-asso/issues/470)) ([884513a](https://github.com/betagouv/api-subventions-asso/commit/884513ae2aee670d637ca5c844132e0ee469ac41))
-   **api:** create consumer user ([1048339](https://github.com/betagouv/api-subventions-asso/commit/1048339c26abfc460b62a7f2df1d98645ad69524))
-   **api:** handle new FONJEP file with versements ([e9dead6](https://github.com/betagouv/api-subventions-asso/commit/e9dead6c40cdb4bdc58213df157d1ac47b4d63ff))
-   **api:** manage user in current request ([#468](https://github.com/betagouv/api-subventions-asso/issues/468)) ([47772b1](https://github.com/betagouv/api-subventions-asso/commit/47772b12c4c0f0b870fab712342ccd04d6454deb))
-   **api:** use UserDbo in UserRepository collection type ([#524](https://github.com/betagouv/api-subventions-asso/issues/524)) ([7d4f52d](https://github.com/betagouv/api-subventions-asso/commit/7d4f52d3bf53580ba65184cce773f5310b1c22bb))
-   **front,api:** add signup date to user ([#473](https://github.com/betagouv/api-subventions-asso/issues/473)) ([af97192](https://github.com/betagouv/api-subventions-asso/commit/af971926102b2c78b2685d93777a2ffad1e1bc32))

## [0.16.2](https://github.com/betagouv/api-subventions-asso/compare/v0.16.1...v0.16.2) (2022-10-14)

### Bug Fixes

-   **api:** fix send wrong error on error in /auth/login ([#503](https://github.com/betagouv/api-subventions-asso/issues/503)) ([20a3e0e](https://github.com/betagouv/api-subventions-asso/commit/20a3e0e71e457d8a3b76b0040da9f08efc5f68b9))
-   **api:** group associations names by rna or siren ([#504](https://github.com/betagouv/api-subventions-asso/issues/504)) ([faae9c5](https://github.com/betagouv/api-subventions-asso/commit/faae9c5e4a2177922d7e50ff06f875c39837a571))

## [0.16.1](https://github.com/betagouv/api-subventions-asso/compare/v0.16.0...v0.16.1) (2022-10-13)

### Features

-   **api, front:** find asso documents from API ASSO ([#500](https://github.com/betagouv/api-subventions-asso/issues/500)) ([6538650](https://github.com/betagouv/api-subventions-asso/commit/6538650041b2cbea78fec238e50ae6fabc751b7a))

# [0.16.0](https://github.com/betagouv/api-subventions-asso/compare/v0.15.4...v0.16.0) (2022-10-12)

### Bug Fixes

-   **front, api:** clean dauphin and subvention table ([#472](https://github.com/betagouv/api-subventions-asso/issues/472)) ([e2644fe](https://github.com/betagouv/api-subventions-asso/commit/e2644fe73749b893c72c588bc815a8083cb34fe9))

### Features

-   **api:** add stats to user ([#470](https://github.com/betagouv/api-subventions-asso/issues/470)) ([798b51e](https://github.com/betagouv/api-subventions-asso/commit/798b51ea90fe1df5b46c5387fc6f46e8ab87524b))
-   **api:** handle new FONJEP file with versements ([729d59f](https://github.com/betagouv/api-subventions-asso/commit/729d59f736a02ecec5fa013a30bc4f50a65ccf51))
-   **api:** manage user in current request ([#468](https://github.com/betagouv/api-subventions-asso/issues/468)) ([397cfcd](https://github.com/betagouv/api-subventions-asso/commit/397cfcd4fecba36725b85d6822905b9e2517fd35))
-   **front,api:** add signup date to user ([#473](https://github.com/betagouv/api-subventions-asso/issues/473)) ([180c855](https://github.com/betagouv/api-subventions-asso/commit/180c855cec6dd8500ba035cc7f9d8c3f9241d2ca))

## [0.16.2](https://github.com/betagouv/api-subventions-asso/compare/v0.16.1...v0.16.2) (2022-10-14)

### Bug Fixes

-   **api:** fix send wrong error on error in /auth/login ([#503](https://github.com/betagouv/api-subventions-asso/issues/503)) ([20a3e0e](https://github.com/betagouv/api-subventions-asso/commit/20a3e0e71e457d8a3b76b0040da9f08efc5f68b9))
-   **api:** group associations names by rna or siren ([#504](https://github.com/betagouv/api-subventions-asso/issues/504)) ([faae9c5](https://github.com/betagouv/api-subventions-asso/commit/faae9c5e4a2177922d7e50ff06f875c39837a571))

## [0.16.1](https://github.com/betagouv/api-subventions-asso/compare/v0.16.0...v0.16.1) (2022-10-13)

### Features

-   **api, front:** find asso documents from API ASSO ([#500](https://github.com/betagouv/api-subventions-asso/issues/500)) ([6538650](https://github.com/betagouv/api-subventions-asso/commit/6538650041b2cbea78fec238e50ae6fabc751b7a))

# [0.16.0](https://github.com/betagouv/api-subventions-asso/compare/v0.15.4...v0.16.0) (2022-10-12)

### Bug Fixes

-   **front, api:** clean dauphin and subvention table ([#472](https://github.com/betagouv/api-subventions-asso/issues/472)) ([e2644fe](https://github.com/betagouv/api-subventions-asso/commit/e2644fe73749b893c72c588bc815a8083cb34fe9))

### Features

-   **api:** add stats to user ([#470](https://github.com/betagouv/api-subventions-asso/issues/470)) ([798b51e](https://github.com/betagouv/api-subventions-asso/commit/798b51ea90fe1df5b46c5387fc6f46e8ab87524b))
-   **api:** handle new FONJEP file with versements ([729d59f](https://github.com/betagouv/api-subventions-asso/commit/729d59f736a02ecec5fa013a30bc4f50a65ccf51))
-   **api:** manage user in current request ([#468](https://github.com/betagouv/api-subventions-asso/issues/468)) ([397cfcd](https://github.com/betagouv/api-subventions-asso/commit/397cfcd4fecba36725b85d6822905b9e2517fd35))
-   **front,api:** add signup date to user ([#473](https://github.com/betagouv/api-subventions-asso/issues/473)) ([180c855](https://github.com/betagouv/api-subventions-asso/commit/180c855cec6dd8500ba035cc7f9d8c3f9241d2ca))

## [0.15.5](https://github.com/betagouv/api-subventions-asso/compare/v0.15.4...v0.15.5) (2022-10-17)

### Bug Fixes

-   **api:** error on dauphin is hs ([bf98860](https://github.com/betagouv/api-subventions-asso/commit/bf9886056d6fabe1d161e8959cbd2983c71355ee))

## [0.15.4](https://github.com/betagouv/api-subventions-asso/compare/v0.14.9...v0.15.4) (2022-10-11)

### Bug Fixes

-   **api:** fix chorus parser ([df1745a](https://github.com/betagouv/api-subventions-asso/commit/df1745a9e1b3d249d3e9ad2b9e3de1a7439bd8be))
-   **api:** fix import fonjep script ([#464](https://github.com/betagouv/api-subventions-asso/issues/464)) ([65118c7](https://github.com/betagouv/api-subventions-asso/commit/65118c7a921e84db81c11266eaf67fd74b99e6d3))
-   **api:** log log log ([#457](https://github.com/betagouv/api-subventions-asso/issues/457)) ([e73a10e](https://github.com/betagouv/api-subventions-asso/commit/e73a10ef8f24962633df56e05801654feb0aee5d))
-   **api:** tests ([#451](https://github.com/betagouv/api-subventions-asso/issues/451)) ([16f5320](https://github.com/betagouv/api-subventions-asso/commit/16f53201730cc5df36631499e846f04c1e706206))

### Features

-   **api, dto:** add rcs extract for associations ([7f9e286](https://github.com/betagouv/api-subventions-asso/commit/7f9e28688384212bc87f03201513007c24a00137))
-   **api, front, dto:** display rna-siren differences ([9f1b24b](https://github.com/betagouv/api-subventions-asso/commit/9f1b24bb9267102f85139c4d2ce9f045ea21c67c))
-   **api:** handle new FONJEP file with versements ([1f202c0](https://github.com/betagouv/api-subventions-asso/commit/1f202c0e46417f7c94d3ae10b9205797cacee427))
-   **api:** rename fonjep collection to fonjepSubvention ([#461](https://github.com/betagouv/api-subventions-asso/issues/461)) ([9231625](https://github.com/betagouv/api-subventions-asso/commit/92316252ea5ea0232860f180c2eec9827b54a1ea))
-   **api:** update parser for new data 2022 ([#423](https://github.com/betagouv/api-subventions-asso/issues/423)) ([c82b48c](https://github.com/betagouv/api-subventions-asso/commit/c82b48c37a3a8fc83c7ca9c076fb5458708041cd))
-   **front:** disable own account suppression ([c197511](https://github.com/betagouv/api-subventions-asso/commit/c1975112055bd2f2046a58a649a5091b73c33110))

## [0.15.2](https://github.com/betagouv/api-subventions-asso/compare/v0.15.1...v0.15.2) (2022-09-29)

### Bug Fixes

-   **api:** fix chorus parser ([df1745a](https://github.com/betagouv/api-subventions-asso/commit/df1745a9e1b3d249d3e9ad2b9e3de1a7439bd8be))
-   **api:** fix import fonjep script ([#464](https://github.com/betagouv/api-subventions-asso/issues/464)) ([39d1513](https://github.com/betagouv/api-subventions-asso/commit/39d15136b16d4adff1f3af3695df1a00e505393a))

## [0.15.1](https://github.com/betagouv/api-subventions-asso/compare/v0.15.0...v0.15.1) (2022-09-27)

### Bug Fixes

-   **api:** log log log ([#457](https://github.com/betagouv/api-subventions-asso/issues/457)) ([95f22ce](https://github.com/betagouv/api-subventions-asso/commit/95f22ce3dd529f7a84dc84055f6561286309b180))

# [0.15.0](https://github.com/betagouv/api-subventions-asso/compare/v0.14.8...v0.15.0) (2022-09-26)

### Bug Fixes

-   **api:** tests ([#451](https://github.com/betagouv/api-subventions-asso/issues/451)) ([b892855](https://github.com/betagouv/api-subventions-asso/commit/b8928552345839f5ede3b688a028cf061b195792))

### Features

-   **api, dto:** add rcs extract for associations ([ccd18fa](https://github.com/betagouv/api-subventions-asso/commit/ccd18fa2781b432636e354f2bd9dab0ab48ddcb9))
-   **api, front, dto:** display rna-siren differences ([3b6d6ba](https://github.com/betagouv/api-subventions-asso/commit/3b6d6ba99c51e18542eab033a79fb5611abb0a53))
-   **api:** handle new FONJEP file with versements ([5d5a762](https://github.com/betagouv/api-subventions-asso/commit/5d5a762eabcc0ff212c4b5454ee9d57d4a389044))
-   **api:** rename fonjep collection to fonjepSubvention ([#461](https://github.com/betagouv/api-subventions-asso/issues/461)) ([79bea66](https://github.com/betagouv/api-subventions-asso/commit/79bea6633a1fa40106436153ab91a1bc18a5e975))
-   **api:** update parser for new data 2022 ([#423](https://github.com/betagouv/api-subventions-asso/issues/423)) ([060ea1c](https://github.com/betagouv/api-subventions-asso/commit/060ea1c0d29887e3a2683c8af924703b19a7b406))
-   **front:** disable own account suppression ([46096c3](https://github.com/betagouv/api-subventions-asso/commit/46096c3e58abb3866cb754c29cc3c44eb0ef39cb))

## [0.14.8](https://github.com/betagouv/api-subventions-asso/compare/v0.14.7...v0.14.8) (2022-09-21)

### Bug Fixes

-   **api, front:** crash on search asso without siren ([9a14dfe](https://github.com/betagouv/api-subventions-asso/commit/9a14dfe9bb7b155081732f5c32b18a90b2d3b155))

## [0.14.5](https://github.com/betagouv/api-subventions-asso/compare/v0.14.4...v0.14.5) (2022-08-30)

### Bug Fixes

-   **api:** disable dauphin provider ([616d6e1](https://github.com/betagouv/api-subventions-asso/commit/616d6e126159998205ff6c774dc7b278d6ccfe8a))

## [0.14.4](https://github.com/betagouv/api-subventions-asso/compare/v0.14.3...v0.14.4) (2022-08-24)

### Bug Fixes

-   **api:** fix create fonjep entity in parser ([d3ead02](https://github.com/betagouv/api-subventions-asso/commit/d3ead02d27acadc19e83a79291af126c30be8e6c))

## [0.14.3](https://github.com/betagouv/api-subventions-asso/compare/v0.14.2...v0.14.3) (2022-08-23)

### Bug Fixes

-   **api:** fix migration ([c293bb6](https://github.com/betagouv/api-subventions-asso/commit/c293bb633fa4a3666a3a307fdb9d526b56af7dcc))

## [0.14.2](https://github.com/betagouv/api-subventions-asso/compare/v0.14.1...v0.14.2) (2022-08-23)

### Bug Fixes

-   **api:** add chorus index on siret ([#417](https://github.com/betagouv/api-subventions-asso/issues/417)) ([1c9f8cf](https://github.com/betagouv/api-subventions-asso/commit/1c9f8cff67aa5502f2b3883103270c5c5b6a0b71))

## [0.14.1](https://github.com/betagouv/api-subventions-asso/compare/v0.14.0...v0.14.1) (2022-08-22)

### Bug Fixes

-   **api:** fix error on search association ([#405](https://github.com/betagouv/api-subventions-asso/issues/405)) ([778a259](https://github.com/betagouv/api-subventions-asso/commit/778a25925192d5a524def9aae09afeae122fbb0c))

# [0.14.0](https://github.com/betagouv/api-subventions-asso/compare/v0.13.1...v0.14.0) (2022-08-18)

### Features

-   **api, dto, front:** store rna and siren values in Association ([#387](https://github.com/betagouv/api-subventions-asso/issues/387)) ([d55b547](https://github.com/betagouv/api-subventions-asso/commit/d55b547a73fa96122386dfa49798cf1c675802bd))
-   **api:** add date of last import for datagouv files ([#392](https://github.com/betagouv/api-subventions-asso/issues/392)) ([12a7cf1](https://github.com/betagouv/api-subventions-asso/commit/12a7cf1f2f60d1dc9f614e71a5f4bcdf99db3e4b))

## [0.13.1](https://github.com/betagouv/api-subventions-asso/compare/v0.13.0...v0.13.1) (2022-07-28)

### Bug Fixes

-   **api:** fix error in script ([bedf946](https://github.com/betagouv/api-subventions-asso/commit/bedf946ef7688b4a05e0d08a2fd3a9363c3389b8))

# [0.13.0](https://github.com/betagouv/api-subventions-asso/compare/v0.12.3...v0.13.0) (2022-07-28)

### Features

-   **api, dto:** retrieve API Entreprise etablissement headcount ([#367](https://github.com/betagouv/api-subventions-asso/issues/367)) ([82419e6](https://github.com/betagouv/api-subventions-asso/commit/82419e6a596d6a0922426c89cc6c5803205be0bf))
-   **api:** add compare command for FONJEP CLI ([7f1b82a](https://github.com/betagouv/api-subventions-asso/commit/7f1b82a2291c1a8a209f7d3832e28c2f4cd18d79))
-   **api:** add posibilities to remove user ([#364](https://github.com/betagouv/api-subventions-asso/issues/364)) ([cd562d3](https://github.com/betagouv/api-subventions-asso/commit/cd562d38bbd4d398fdab5fb8319a4f00365207aa))
-   **api:** add SendInBlue mail provider ([#370](https://github.com/betagouv/api-subventions-asso/issues/370)) ([4d15231](https://github.com/betagouv/api-subventions-asso/commit/4d15231486b748df06ff5876f8502da6565ba37e))
-   **front:** enable matomo with datasub id ([#368](https://github.com/betagouv/api-subventions-asso/issues/368)) ([e03aee0](https://github.com/betagouv/api-subventions-asso/commit/e03aee02b121a07d59a8a0339e60ce0d0018474e)), closes [#366](https://github.com/betagouv/api-subventions-asso/issues/366)

## [0.12.4](https://github.com/betagouv/api-subventions-asso/compare/v0.12.3...v0.12.4) (2022-07-21)

**Note:** Version bump only for package api

# [0.12.0](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.12.0) (2022-07-11)

### Bug Fixes

-   **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([b355edf](https://github.com/betagouv/api-subventions-asso/commit/b355edf74d39a0fa7bc588fd6c4a25df2780849f))
-   **api:** fix date modification ([35a0ade](https://github.com/betagouv/api-subventions-asso/commit/35a0aded8bdb71fd47d708f2cb0f344aabba2750))
-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))
-   **front:** fix error on capitalize string ([#339](https://github.com/betagouv/api-subventions-asso/issues/339)) ([3326a01](https://github.com/betagouv/api-subventions-asso/commit/3326a010247dcd4a356280326f78aa1de0e6a45d))

### Features

-   **api:** add route for getting documents ([#324](https://github.com/betagouv/api-subventions-asso/issues/324)) ([17acc6a](https://github.com/betagouv/api-subventions-asso/commit/17acc6a67992176908410b221264b87404a4c312))
-   **api:** add service for api entreprise ([#342](https://github.com/betagouv/api-subventions-asso/issues/342)) ([382bfba](https://github.com/betagouv/api-subventions-asso/commit/382bfba952ca7a24c5b0479eee21b652e71f826a))
-   **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([0a354f5](https://github.com/betagouv/api-subventions-asso/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))
-   **api:** apply new rules for api asso documents ([#336](https://github.com/betagouv/api-subventions-asso/issues/336)) ([145f1b4](https://github.com/betagouv/api-subventions-asso/commit/145f1b4823c7b876b75cbe2a990d0a424f221ee1))
-   **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([e15ce0c](https://github.com/betagouv/api-subventions-asso/commit/e15ce0c1f12582101870b9b6ef3769f82c931a66))

## [0.11.3](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.11.3) (2022-07-07)

### Bug Fixes

-   **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([b355edf](https://github.com/betagouv/api-subventions-asso/commit/b355edf74d39a0fa7bc588fd6c4a25df2780849f))
-   **api:** fix date modification ([35a0ade](https://github.com/betagouv/api-subventions-asso/commit/35a0aded8bdb71fd47d708f2cb0f344aabba2750))
-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))
-   **front:** fix error on capitalize string ([#339](https://github.com/betagouv/api-subventions-asso/issues/339)) ([3326a01](https://github.com/betagouv/api-subventions-asso/commit/3326a010247dcd4a356280326f78aa1de0e6a45d))

### Features

-   **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([0a354f5](https://github.com/betagouv/api-subventions-asso/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))
-   **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([e15ce0c](https://github.com/betagouv/api-subventions-asso/commit/e15ce0c1f12582101870b9b6ef3769f82c931a66))

## [0.11.2](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.11.2) (2022-07-01)

### Bug Fixes

-   **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([b355edf](https://github.com/betagouv/api-subventions-asso/commit/b355edf74d39a0fa7bc588fd6c4a25df2780849f))
-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))
-   **front:** fix error on capitalize string ([#339](https://github.com/betagouv/api-subventions-asso/issues/339)) ([3326a01](https://github.com/betagouv/api-subventions-asso/commit/3326a010247dcd4a356280326f78aa1de0e6a45d))

### Features

-   **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([0a354f5](https://github.com/betagouv/api-subventions-asso/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))
-   **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([e15ce0c](https://github.com/betagouv/api-subventions-asso/commit/e15ce0c1f12582101870b9b6ef3769f82c931a66))

## [0.11.1](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.11.1) (2022-06-30)

### Bug Fixes

-   **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([b355edf](https://github.com/betagouv/api-subventions-asso/commit/b355edf74d39a0fa7bc588fd6c4a25df2780849f))
-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))

### Features

-   **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([0a354f5](https://github.com/betagouv/api-subventions-asso/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))
-   **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([e15ce0c](https://github.com/betagouv/api-subventions-asso/commit/e15ce0c1f12582101870b9b6ef3769f82c931a66))

# [0.11.0](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.11.0) (2022-06-21)

### Bug Fixes

-   **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([4114b24](https://github.com/betagouv/api-subventions-asso/commit/4114b24923c55fa03e9758c169ddb505440d3e50))
-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))

### Features

-   **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([b43a1cf](https://github.com/betagouv/api-subventions-asso/commit/b43a1cfcdc068252eeef81dec59ea97c93c3b6c3))
-   **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([1e2bf9f](https://github.com/betagouv/api-subventions-asso/commit/1e2bf9feacfb4a448763409cc952b1d0fa7f1054))

## [0.10.8](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.8) (2022-06-24)

## [0.10.7](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.7) (2022-06-21)

### Bug Fixes

-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))

## [0.10.6](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.6) (2022-06-21)

### Bug Fixes

-   **api:** fix migration import ([bd13d3b](https://github.com/betagouv/api-subventions-asso/commit/bd13d3b564147de47d12de03a514d0a9ded0a1ae))
-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))

## [0.10.5](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.5) (2022-06-21)

### Bug Fixes

-   **api:** fix wrong year on osiris data ([d3290e7](https://github.com/betagouv/api-subventions-asso/commit/d3290e709074a5f8397bf4590969b257200606c1))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))

## [0.10.4](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.4) (2022-06-14)

**Note:** Version bump only for package api
