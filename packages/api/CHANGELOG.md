# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.14.4](https://github.com/betagouv/api-subventions-asso/compare/v0.14.3...v0.14.4) (2022-08-24)


### Bug Fixes

* **api:** fix create fonjep entity in parser ([d3ead02](https://github.com/betagouv/api-subventions-asso/commit/d3ead02d27acadc19e83a79291af126c30be8e6c))





## [0.14.3](https://github.com/betagouv/api-subventions-asso/compare/v0.14.2...v0.14.3) (2022-08-23)


### Bug Fixes

* **api:** fix migration ([c293bb6](https://github.com/betagouv/api-subventions-asso/commit/c293bb633fa4a3666a3a307fdb9d526b56af7dcc))





## [0.14.2](https://github.com/betagouv/api-subventions-asso/compare/v0.14.1...v0.14.2) (2022-08-23)


### Bug Fixes

* **api:** add chorus index on siret ([#417](https://github.com/betagouv/api-subventions-asso/issues/417)) ([1c9f8cf](https://github.com/betagouv/api-subventions-asso/commit/1c9f8cff67aa5502f2b3883103270c5c5b6a0b71))





## [0.14.1](https://github.com/betagouv/api-subventions-asso/compare/v0.14.0...v0.14.1) (2022-08-22)


### Bug Fixes

* **api:** fix error on search association ([#405](https://github.com/betagouv/api-subventions-asso/issues/405)) ([778a259](https://github.com/betagouv/api-subventions-asso/commit/778a25925192d5a524def9aae09afeae122fbb0c))





# [0.14.0](https://github.com/betagouv/api-subventions-asso/compare/v0.13.1...v0.14.0) (2022-08-18)


### Features

* **api, dto, front:** store rna and siren values in Association ([#387](https://github.com/betagouv/api-subventions-asso/issues/387)) ([d55b547](https://github.com/betagouv/api-subventions-asso/commit/d55b547a73fa96122386dfa49798cf1c675802bd))
* **api:** add date of last import for datagouv files ([#392](https://github.com/betagouv/api-subventions-asso/issues/392)) ([12a7cf1](https://github.com/betagouv/api-subventions-asso/commit/12a7cf1f2f60d1dc9f614e71a5f4bcdf99db3e4b))





## [0.13.1](https://github.com/betagouv/api-subventions-asso/compare/v0.13.0...v0.13.1) (2022-07-28)


### Bug Fixes

* **api:** fix error in script ([bedf946](https://github.com/betagouv/api-subventions-asso/commit/bedf946ef7688b4a05e0d08a2fd3a9363c3389b8))





# [0.13.0](https://github.com/betagouv/api-subventions-asso/compare/v0.12.3...v0.13.0) (2022-07-28)


### Features

* **api, dto:** retrieve API Entreprise etablissement headcount ([#367](https://github.com/betagouv/api-subventions-asso/issues/367)) ([82419e6](https://github.com/betagouv/api-subventions-asso/commit/82419e6a596d6a0922426c89cc6c5803205be0bf))
* **api:** add compare command for FONJEP CLI ([7f1b82a](https://github.com/betagouv/api-subventions-asso/commit/7f1b82a2291c1a8a209f7d3832e28c2f4cd18d79))
* **api:** add posibilities to remove user ([#364](https://github.com/betagouv/api-subventions-asso/issues/364)) ([cd562d3](https://github.com/betagouv/api-subventions-asso/commit/cd562d38bbd4d398fdab5fb8319a4f00365207aa))
* **api:** add SendInBlue mail provider ([#370](https://github.com/betagouv/api-subventions-asso/issues/370)) ([4d15231](https://github.com/betagouv/api-subventions-asso/commit/4d15231486b748df06ff5876f8502da6565ba37e))
* **front:** enable matomo with datasub id ([#368](https://github.com/betagouv/api-subventions-asso/issues/368)) ([e03aee0](https://github.com/betagouv/api-subventions-asso/commit/e03aee02b121a07d59a8a0339e60ce0d0018474e)), closes [#366](https://github.com/betagouv/api-subventions-asso/issues/366)





## [0.12.4](https://github.com/betagouv/api-subventions-asso/compare/v0.12.3...v0.12.4) (2022-07-21)

**Note:** Version bump only for package api





# [0.12.0](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.12.0) (2022-07-11)


### Bug Fixes

* **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([b355edf](https://github.com/betagouv/api-subventions-asso/commit/b355edf74d39a0fa7bc588fd6c4a25df2780849f))
* **api:** fix date modification ([35a0ade](https://github.com/betagouv/api-subventions-asso/commit/35a0aded8bdb71fd47d708f2cb0f344aabba2750))
* **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
* **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))
* **front:** fix error on capitalize string ([#339](https://github.com/betagouv/api-subventions-asso/issues/339)) ([3326a01](https://github.com/betagouv/api-subventions-asso/commit/3326a010247dcd4a356280326f78aa1de0e6a45d))


### Features

* **api:** add route for getting documents ([#324](https://github.com/betagouv/api-subventions-asso/issues/324)) ([17acc6a](https://github.com/betagouv/api-subventions-asso/commit/17acc6a67992176908410b221264b87404a4c312))
* **api:** add service for api entreprise ([#342](https://github.com/betagouv/api-subventions-asso/issues/342)) ([382bfba](https://github.com/betagouv/api-subventions-asso/commit/382bfba952ca7a24c5b0479eee21b652e71f826a))
* **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([0a354f5](https://github.com/betagouv/api-subventions-asso/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))
* **api:** apply new rules for api asso documents ([#336](https://github.com/betagouv/api-subventions-asso/issues/336)) ([145f1b4](https://github.com/betagouv/api-subventions-asso/commit/145f1b4823c7b876b75cbe2a990d0a424f221ee1))
* **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([e15ce0c](https://github.com/betagouv/api-subventions-asso/commit/e15ce0c1f12582101870b9b6ef3769f82c931a66))





## [0.11.3](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.11.3) (2022-07-07)


### Bug Fixes

* **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([b355edf](https://github.com/betagouv/api-subventions-asso/commit/b355edf74d39a0fa7bc588fd6c4a25df2780849f))
* **api:** fix date modification ([35a0ade](https://github.com/betagouv/api-subventions-asso/commit/35a0aded8bdb71fd47d708f2cb0f344aabba2750))
* **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
* **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))
* **front:** fix error on capitalize string ([#339](https://github.com/betagouv/api-subventions-asso/issues/339)) ([3326a01](https://github.com/betagouv/api-subventions-asso/commit/3326a010247dcd4a356280326f78aa1de0e6a45d))


### Features

* **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([0a354f5](https://github.com/betagouv/api-subventions-asso/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))
* **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([e15ce0c](https://github.com/betagouv/api-subventions-asso/commit/e15ce0c1f12582101870b9b6ef3769f82c931a66))





## [0.11.2](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.11.2) (2022-07-01)


### Bug Fixes

* **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([b355edf](https://github.com/betagouv/api-subventions-asso/commit/b355edf74d39a0fa7bc588fd6c4a25df2780849f))
* **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
* **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))
* **front:** fix error on capitalize string ([#339](https://github.com/betagouv/api-subventions-asso/issues/339)) ([3326a01](https://github.com/betagouv/api-subventions-asso/commit/3326a010247dcd4a356280326f78aa1de0e6a45d))


### Features

* **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([0a354f5](https://github.com/betagouv/api-subventions-asso/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))
* **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([e15ce0c](https://github.com/betagouv/api-subventions-asso/commit/e15ce0c1f12582101870b9b6ef3769f82c931a66))





## [0.11.1](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.11.1) (2022-06-30)


### Bug Fixes

* **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([b355edf](https://github.com/betagouv/api-subventions-asso/commit/b355edf74d39a0fa7bc588fd6c4a25df2780849f))
* **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
* **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))


### Features

* **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([0a354f5](https://github.com/betagouv/api-subventions-asso/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))
* **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([e15ce0c](https://github.com/betagouv/api-subventions-asso/commit/e15ce0c1f12582101870b9b6ef3769f82c931a66))






# [0.11.0](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.11.0) (2022-06-21)


### Bug Fixes

* **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([4114b24](https://github.com/betagouv/api-subventions-asso/commit/4114b24923c55fa03e9758c169ddb505440d3e50))
* **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
* **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))


### Features

* **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([b43a1cf](https://github.com/betagouv/api-subventions-asso/commit/b43a1cfcdc068252eeef81dec59ea97c93c3b6c3))
* **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([1e2bf9f](https://github.com/betagouv/api-subventions-asso/commit/1e2bf9feacfb4a448763409cc952b1d0fa7f1054))


## [0.10.8](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.8) (2022-06-24)

## [0.10.7](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.7) (2022-06-21)


### Bug Fixes

* **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
* **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))





## [0.10.6](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.6) (2022-06-21)


### Bug Fixes

* **api:** fix migration import ([bd13d3b](https://github.com/betagouv/api-subventions-asso/commit/bd13d3b564147de47d12de03a514d0a9ded0a1ae))
* **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
* **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))





## [0.10.5](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.5) (2022-06-21)


### Bug Fixes

* **api:** fix wrong year on osiris data ([d3290e7](https://github.com/betagouv/api-subventions-asso/commit/d3290e709074a5f8397bf4590969b257200606c1))
* **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))





## [0.10.4](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.4) (2022-06-14)

**Note:** Version bump only for package api
