# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.29.0](https://github.com/betagouv/datasubvention/compare/v0.28.2...v0.29.0) (2023-05-26)


### Features

* **api:** generic grant service and its types ([5a31e3c](https://github.com/betagouv/datasubvention/commit/5a31e3cf9fc5ce48537fabdea8b227d69593860f))





# [0.28.0](https://github.com/betagouv/datasubvention/compare/v0.27.0...v0.28.0) (2023-05-15)


### Features

* **api, dto:** add /stats/user/requests route ([4dc4c61](https://github.com/betagouv/datasubvention/commit/4dc4c618041e38ded95496cdb3656647e551bcbd))
* **api, dto:** create user stats from associationVisits collection ([78d9940](https://github.com/betagouv/datasubvention/commit/78d99400125f638f7d3e60593e61f0b7894812f1))
* **api, dto:** remove old way to compute user.stats property ([a6d9a18](https://github.com/betagouv/datasubvention/commit/a6d9a18046f0bfb86783662bad0241039ae503e8))
* **api, dto:** remove stats/users/requests route ([989bd1a](https://github.com/betagouv/datasubvention/commit/989bd1a8f2e2fc72c5a21044869df30a369635cc))
* **front:** add bodacc tab ([71550aa](https://github.com/betagouv/datasubvention/commit/71550aaeac79b7b073234075dc35be3a2fa209c9))





# [0.27.0](https://github.com/betagouv/datasubvention/compare/v0.26.2...v0.27.0) (2023-05-03)


### Features

* **dto:** common grant dto ([1c77f65](https://github.com/betagouv/datasubvention/commit/1c77f654ec0e09ab69b67dca594e07942744a4ab))





# [0.26.0](https://github.com/betagouv/datasubvention/compare/v0.25.1...v0.26.0) (2023-04-17)

**Note:** Version bump only for package dto





## [0.25.1](https://github.com/betagouv/datasubvention/compare/v0.24.10...v0.25.1) (2023-04-17)


### Features

* **api:** sends bop ([ae51da1](https://github.com/betagouv/datasubvention/commit/ae51da12d46da1d285bcbf74d7cf330b6d75a0b3))
* **dto:** add BodaccRecordDto to AssociationDto ([e4e4941](https://github.com/betagouv/datasubvention/commit/e4e4941965ae13bd2a5fc7f7e2249dda1917745d))
* **dto:** make Association Bodacc optionnal ([99486cc](https://github.com/betagouv/datasubvention/commit/99486cc6ec291f2cce23b75e3858e7ced6a7d84f))
* **dto:** make Association bodacc prop a ProviderValues ([687cb75](https://github.com/betagouv/datasubvention/commit/687cb757d154a50847edceb0b4b82d37068f31df))





# [0.25.0](https://github.com/betagouv/datasubvention/compare/v0.24.7...v0.25.0) (2023-04-04)


### Features

* **api:** sends bop ([fa9d900](https://github.com/betagouv/datasubvention/commit/fa9d900a2898ba1cb5d14c7f7d831ab1f636a578))
* **dto:** add BodaccRecordDto to AssociationDto ([7a975a6](https://github.com/betagouv/datasubvention/commit/7a975a6cdcbcb095ea481fec22f67442b1a5b6d1))
* **dto:** make Association Bodacc optionnal ([0dd8447](https://github.com/betagouv/datasubvention/commit/0dd8447da230e8e1d8e701bdf615e27c2146b33b))
* **dto:** make Association bodacc prop a ProviderValues ([84af61b](https://github.com/betagouv/datasubvention/commit/84af61b2e9cb9bbec220c6436617dbfb88021cac))





# [0.24.0](https://github.com/betagouv/datasubvention/compare/v0.23.9...v0.24.0) (2023-03-21)


### Bug Fixes

* **dto:** revert deleted file ([f67bfcb](https://github.com/betagouv/datasubvention/commit/f67bfcb574202e2f8945f506a9d019d7f3284a63))
* **dto:** revert ResetPasswordErrorCodes removal ([eef731b](https://github.com/betagouv/datasubvention/commit/eef731bfdb2f388a7642bd015d8bcb46eb840850))


### Features

* **api, dto:** update error handling in UserController ([9b0c058](https://github.com/betagouv/datasubvention/commit/9b0c0587e01c80f4f1940511ceddf8e0f9417d91))
* **dto:** normalized application status enum ([0551fb7](https://github.com/betagouv/datasubvention/commit/0551fb757ba365e77cc14fd6acdd97a0a27a57fb))
* **dto:** update application dto with normalized status label ([37fa9a0](https://github.com/betagouv/datasubvention/commit/37fa9a08e0f0aad2d91faac7dd19ff025fd23de3))
* **dto:** update application status enum ([46ee7d6](https://github.com/betagouv/datasubvention/commit/46ee7d6c9e8fd7424ed0cffde653404254d65e3e))





# [0.23.0](https://github.com/betagouv/datasubvention/compare/v0.22.0...v0.23.0) (2023-02-13)

**Note:** Version bump only for package dto

# [0.22.0](https://github.com/betagouv/datasubvention/compare/v0.21.4...v0.22.0) (2023-01-27)

### Features

-   **api, dto:** add UserCountByStatus stats ressource ([#896](https://github.com/betagouv/datasubvention/issues/896)) ([d4ee988](https://github.com/betagouv/datasubvention/commit/d4ee988e1dfa62b904fcdb5921fe62a533f676a3))

## [0.21.3](https://github.com/betagouv/datasubvention/compare/v0.20.4...v0.21.3) (2023-01-26)

### Features

-   **api,dto,front:** add email domains in db and allow admin to update it ([#753](https://github.com/betagouv/datasubvention/issues/753)) ([dab4a57](https://github.com/betagouv/datasubvention/commit/dab4a57562ed9fc79f08bed449166b8bed532da2))
-   **api:** [#668](https://github.com/betagouv/datasubvention/issues/668) [#771](https://github.com/betagouv/datasubvention/issues/771) save and consult top associations ([#811](https://github.com/betagouv/datasubvention/issues/811)) ([f1f7123](https://github.com/betagouv/datasubvention/commit/f1f71230e7eb78b98ca50da13cdd2d0901dfe99c))

## [0.21.2](https://github.com/betagouv/datasubvention/compare/v0.21.1...v0.21.2) (2023-01-18)

**Note:** Version bump only for package dto

# [0.21.0](https://github.com/betagouv/datasubvention/compare/v0.20.2...v0.21.0) (2023-01-17)

### Features

-   **api,dto,front:** add email domains in db and allow admin to update it ([#753](https://github.com/betagouv/datasubvention/issues/753)) ([e349963](https://github.com/betagouv/datasubvention/commit/e349963263a7199035178623fd6e497dd6eb68ba))
-   **api:** [#668](https://github.com/betagouv/datasubvention/issues/668) [#771](https://github.com/betagouv/datasubvention/issues/771) save and consult top associations ([#811](https://github.com/betagouv/datasubvention/issues/811)) ([3f1f4b2](https://github.com/betagouv/datasubvention/commit/3f1f4b2f98ec75e0dcc953473508c79667050771))

## [0.20.3](https://github.com/betagouv/datasubvention/compare/v0.20.2...v0.20.3) (2023-01-20)

**Note:** Version bump only for package dto

## [0.20.2](https://github.com/betagouv/datasubvention/compare/v0.19.4...v0.20.2) (2023-01-05)

### Features

-   **api:** 669 montly nb requests by year stat route ([#726](https://github.com/betagouv/datasubvention/issues/726)) ([df4dce7](https://github.com/betagouv/datasubvention/commit/df4dce7341ab1d15626365258fd6dd2cf0a2ee37))

# [0.20.0](https://github.com/betagouv/datasubvention/compare/v0.19.3...v0.20.0) (2023-01-03)

### Features

-   **api:** 669 montly nb requests by year stat route ([#726](https://github.com/betagouv/datasubvention/issues/726)) ([391da49](https://github.com/betagouv/datasubvention/commit/391da49f75cdbf289cf06daba55475318de16bcf))

## [0.19.2](https://github.com/betagouv/datasubvention/compare/v0.18.7...v0.19.2) (2022-12-27)

**Note:** Version bump only for package dto

## [0.19.1](https://github.com/betagouv/datasubvention/compare/v0.18.3...v0.19.1) (2022-12-26)

**Note:** Version bump only for package dto

# [0.19.0](https://github.com/betagouv/datasubvention/compare/v0.18.3...v0.19.0) (2022-12-08)

**Note:** Version bump only for package dto

# [0.18.0](https://github.com/betagouv/datasubvention/compare/v0.17.0...v0.18.0) (2022-11-22)

**Note:** Version bump only for package dto

# [0.17.0](https://github.com/betagouv/datasubvention/compare/v0.15.5...v0.17.0) (2022-11-02)

# [0.16.0](https://github.com/betagouv/datasubvention/compare/v0.15.4...v0.16.0) (2022-10-12)

**Note:** Version bump only for package dto

# [0.16.0](https://github.com/betagouv/datasubvention/compare/v0.15.4...v0.16.0) (2022-10-12)

**Note:** Version bump only for package dto

## [0.15.4](https://github.com/betagouv/datasubvention/compare/v0.14.9...v0.15.4) (2022-10-11)

### Features

-   **api, dto:** add rcs extract for associations ([7f9e286](https://github.com/betagouv/datasubvention/commit/7f9e28688384212bc87f03201513007c24a00137))
-   **api, front, dto:** display rna-siren differences ([9f1b24b](https://github.com/betagouv/datasubvention/commit/9f1b24bb9267102f85139c4d2ce9f045ea21c67c))
-   **api:** handle new FONJEP file with versements ([1f202c0](https://github.com/betagouv/datasubvention/commit/1f202c0e46417f7c94d3ae10b9205797cacee427))
-   **front:** disable own account suppression ([c197511](https://github.com/betagouv/datasubvention/commit/c1975112055bd2f2046a58a649a5091b73c33110))

## [0.15.2](https://github.com/betagouv/datasubvention/compare/v0.15.1...v0.15.2) (2022-09-29)

**Note:** Version bump only for package dto

# [0.15.0](https://github.com/betagouv/datasubvention/compare/v0.14.8...v0.15.0) (2022-09-26)

### Features

-   **api, dto:** add rcs extract for associations ([ccd18fa](https://github.com/betagouv/datasubvention/commit/ccd18fa2781b432636e354f2bd9dab0ab48ddcb9))
-   **api, front, dto:** display rna-siren differences ([3b6d6ba](https://github.com/betagouv/datasubvention/commit/3b6d6ba99c51e18542eab033a79fb5611abb0a53))
-   **api:** handle new FONJEP file with versements ([5d5a762](https://github.com/betagouv/datasubvention/commit/5d5a762eabcc0ff212c4b5454ee9d57d4a389044))
-   **front:** disable own account suppression ([46096c3](https://github.com/betagouv/datasubvention/commit/46096c3e58abb3866cb754c29cc3c44eb0ef39cb))

## [0.14.1](https://github.com/betagouv/datasubvention/compare/v0.14.0...v0.14.1) (2022-08-22)

### Bug Fixes

-   **api:** fix error on search association ([#405](https://github.com/betagouv/datasubvention/issues/405)) ([778a259](https://github.com/betagouv/datasubvention/commit/778a25925192d5a524def9aae09afeae122fbb0c))

# [0.14.0](https://github.com/betagouv/datasubvention/compare/v0.13.1...v0.14.0) (2022-08-18)

### Features

-   **api, dto, front:** store rna and siren values in Association ([#387](https://github.com/betagouv/datasubvention/issues/387)) ([d55b547](https://github.com/betagouv/datasubvention/commit/d55b547a73fa96122386dfa49798cf1c675802bd))

# [0.13.0](https://github.com/betagouv/datasubvention/compare/v0.12.3...v0.13.0) (2022-07-28)

### Features

-   **api, dto:** retrieve API Entreprise etablissement headcount ([#367](https://github.com/betagouv/datasubvention/issues/367)) ([82419e6](https://github.com/betagouv/datasubvention/commit/82419e6a596d6a0922426c89cc6c5803205be0bf))

# [0.12.0](https://github.com/betagouv/datasubvention/compare/v0.10.3...v0.12.0) (2022-07-11)

### Bug Fixes

-   **api:** fix date modification ([35a0ade](https://github.com/betagouv/datasubvention/commit/35a0aded8bdb71fd47d708f2cb0f344aabba2750))
-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/datasubvention/issues/312)) ([293f36d](https://github.com/betagouv/datasubvention/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/datasubvention/issues/302)) ([776ff2d](https://github.com/betagouv/datasubvention/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))
-   **front:** fix error on capitalize string ([#339](https://github.com/betagouv/datasubvention/issues/339)) ([3326a01](https://github.com/betagouv/datasubvention/commit/3326a010247dcd4a356280326f78aa1de0e6a45d))

### Features

-   **api:** add versements routes ([#301](https://github.com/betagouv/datasubvention/issues/301)) ([0a354f5](https://github.com/betagouv/datasubvention/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))

## [0.11.3](https://github.com/betagouv/datasubvention/compare/v0.10.3...v0.11.3) (2022-07-07)

### Bug Fixes

-   **api:** fix date modification ([35a0ade](https://github.com/betagouv/datasubvention/commit/35a0aded8bdb71fd47d708f2cb0f344aabba2750))
-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/datasubvention/issues/312)) ([293f36d](https://github.com/betagouv/datasubvention/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/datasubvention/issues/302)) ([776ff2d](https://github.com/betagouv/datasubvention/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))
-   **front:** fix error on capitalize string ([#339](https://github.com/betagouv/datasubvention/issues/339)) ([3326a01](https://github.com/betagouv/datasubvention/commit/3326a010247dcd4a356280326f78aa1de0e6a45d))

### Features

-   **api:** add versements routes ([#301](https://github.com/betagouv/datasubvention/issues/301)) ([0a354f5](https://github.com/betagouv/datasubvention/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))

## [0.11.2](https://github.com/betagouv/datasubvention/compare/v0.10.3...v0.11.2) (2022-07-01)

### Bug Fixes

-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/datasubvention/issues/312)) ([293f36d](https://github.com/betagouv/datasubvention/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/datasubvention/issues/302)) ([776ff2d](https://github.com/betagouv/datasubvention/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))
-   **front:** fix error on capitalize string ([#339](https://github.com/betagouv/datasubvention/issues/339)) ([3326a01](https://github.com/betagouv/datasubvention/commit/3326a010247dcd4a356280326f78aa1de0e6a45d))

### Features

-   **api:** add versements routes ([#301](https://github.com/betagouv/datasubvention/issues/301)) ([0a354f5](https://github.com/betagouv/datasubvention/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))

## [0.11.1](https://github.com/betagouv/datasubvention/compare/v0.10.3...v0.11.1) (2022-06-30)

### Bug Fixes

-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/datasubvention/issues/312)) ([293f36d](https://github.com/betagouv/datasubvention/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/datasubvention/issues/302)) ([776ff2d](https://github.com/betagouv/datasubvention/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))

### Features

-   **api:** add versements routes ([#301](https://github.com/betagouv/datasubvention/issues/301)) ([0a354f5](https://github.com/betagouv/datasubvention/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))

# [0.11.0](https://github.com/betagouv/datasubvention/compare/v0.10.3...v0.11.0) (2022-06-21)

### Features

-   **api:** add versements routes ([#301](https://github.com/betagouv/datasubvention/issues/301)) ([b43a1cf](https://github.com/betagouv/datasubvention/commit/b43a1cfcdc068252eeef81dec59ea97c93c3b6c3))

## [0.10.8](https://github.com/betagouv/datasubvention/compare/v0.10.3...v0.10.8) (2022-06-24)

## [0.10.7](https://github.com/betagouv/datasubvention/compare/v0.10.3...v0.10.7) (2022-06-21)

### Bug Fixes

-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/datasubvention/issues/312)) ([293f36d](https://github.com/betagouv/datasubvention/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/datasubvention/issues/302)) ([776ff2d](https://github.com/betagouv/datasubvention/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))

## [0.10.6](https://github.com/betagouv/datasubvention/compare/v0.10.3...v0.10.6) (2022-06-21)

### Bug Fixes

-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/datasubvention/issues/312)) ([293f36d](https://github.com/betagouv/datasubvention/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/datasubvention/issues/302)) ([776ff2d](https://github.com/betagouv/datasubvention/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))

## [0.10.5](https://github.com/betagouv/datasubvention/compare/v0.10.3...v0.10.5) (2022-06-21)

### Bug Fixes

-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/datasubvention/issues/302)) ([776ff2d](https://github.com/betagouv/datasubvention/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))

## [0.10.4](https://github.com/betagouv/datasubvention/compare/v0.10.3...v0.10.4) (2022-06-14)

**Note:** Version bump only for package dto
