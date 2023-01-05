# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.19.4](https://github.com/betagouv/api-subventions-asso/compare/v0.19.3...v0.19.4) (2023-01-05)

### Bug Fixes

-   **api:** change sort order on api asso documents ([33c6c18](https://github.com/betagouv/api-subventions-asso/commit/33c6c1814de5672d6b71bb11d7fe509222a463b6))

## [0.19.3](https://github.com/betagouv/api-subventions-asso/compare/v0.19.2...v0.19.3) (2022-12-29)

### Bug Fixes

-   **front:** add messages on home page ([2692b4e](https://github.com/betagouv/api-subventions-asso/commit/2692b4e8ef985d4ca8b14ca0953e36870a7300f2))

## [0.19.2](https://github.com/betagouv/api-subventions-asso/compare/v0.18.7...v0.19.2) (2022-12-27)

### Bug Fixes

-   **api:** format data with array containing one element ([d445296](https://github.com/betagouv/api-subventions-asso/commit/d4452964ea6d3e63aa87b8eeb48bb6190f8f23ae))
-   **api:** sort getSubventions result to avoid race failure ([8d4df00](https://github.com/betagouv/api-subventions-asso/commit/8d4df00038a201e9f5ee8a1ab96f6996aff79a3f))
-   **api:** update snapshot ([562d651](https://github.com/betagouv/api-subventions-asso/commit/562d65106ce4b44ca5e8d3116ebe8d4dd7a8ea7f))
-   **api:** use async foreach instead of promise all ([1460340](https://github.com/betagouv/api-subventions-asso/commit/1460340e69f5a26558f341e78ed566488624cf28))
-   **api:** use real compare method to fix the test ([dd2c12a](https://github.com/betagouv/api-subventions-asso/commit/dd2c12a726645c95a385c1763096a336ff213188))
-   **front:** realign login form ([ccc2913](https://github.com/betagouv/api-subventions-asso/commit/ccc2913a38eb391e05ef140ee6f653c941fda282))
-   **front:** run prettier ([2d21508](https://github.com/betagouv/api-subventions-asso/commit/2d21508b21dd8cd4c9ab14be939f4fefb2f8a719))
-   **front:** v0.19.0 bugs ([5e2589a](https://github.com/betagouv/api-subventions-asso/commit/5e2589a052911e9927b968417331f20ae7e1a682)), closes [#758](https://github.com/betagouv/api-subventions-asso/issues/758) [#757](https://github.com/betagouv/api-subventions-asso/issues/757) [#756](https://github.com/betagouv/api-subventions-asso/issues/756) [#755](https://github.com/betagouv/api-subventions-asso/issues/755)

### Features

-   **api:** accept caissedesdepots.fr email domain ([b3a9199](https://github.com/betagouv/api-subventions-asso/commit/b3a919945b1590ea9863fdc2d32a4f6fc6536624))
-   **api:** add migration for osiris requests indexes ([#623](https://github.com/betagouv/api-subventions-asso/issues/623)) ([87d8338](https://github.com/betagouv/api-subventions-asso/commit/87d8338ca253c36b3ca4011ff5c29869227138af))
-   **api:** apply PR review comments ([f159972](https://github.com/betagouv/api-subventions-asso/commit/f1599727659f320f35726cdac106054e7faf6373))
-   **front, api:** add etablissement dashboard ([#709](https://github.com/betagouv/api-subventions-asso/issues/709)) ([4e85991](https://github.com/betagouv/api-subventions-asso/commit/4e85991bfec399f44fea558004fa09ad53a3182a))
-   **front:** add etablissment tab bank data ([c8142d1](https://github.com/betagouv/api-subventions-asso/commit/c8142d1a35a25a217fc9f41e31d2dd472263f181))
-   **front:** align left tabs ([d571689](https://github.com/betagouv/api-subventions-asso/commit/d57168939ff38791701b952f32c427e6e34ad98f))
-   **front:** include dsfr icons ([#704](https://github.com/betagouv/api-subventions-asso/issues/704)) ([51640a6](https://github.com/betagouv/api-subventions-asso/commit/51640a680a035db0e5016a47fc231c7d40b7dea8))
-   **front:** migratate admin/user/create in Svelte ([#671](https://github.com/betagouv/api-subventions-asso/issues/671)) ([c2ccc66](https://github.com/betagouv/api-subventions-asso/commit/c2ccc660da3c203d61e2299d57cd77eb6d712cbc))
-   **front:** new etablissement page ([#626](https://github.com/betagouv/api-subventions-asso/issues/626)) ([f8cd049](https://github.com/betagouv/api-subventions-asso/commit/f8cd049ac9220009163cbf66ba12abbdf9fcee8a))
-   **front:** remplace ejs admin view in svelte view ([b894500](https://github.com/betagouv/api-subventions-asso/commit/b894500e37d74691c02d6def0f2e533e7df131d5))
-   **front:** remplace ejs domain admin view in svelte view ([#673](https://github.com/betagouv/api-subventions-asso/issues/673)) ([fe6f310](https://github.com/betagouv/api-subventions-asso/commit/fe6f31097a29ee7d8d407e6f201e1be4cb0a69b1))
-   **front:** restore cgu in svelte front ([51a5c60](https://github.com/betagouv/api-subventions-asso/commit/51a5c6008afc6d9c051282f3b36474ddfcbc0b08))
-   **front:** use Documents in etablissement page ([fa5c2e7](https://github.com/betagouv/api-subventions-asso/commit/fa5c2e7af011a9d15a0f7c95be9afc24e11a00c6))
-   **front:** use safe equality operand ([e9947bc](https://github.com/betagouv/api-subventions-asso/commit/e9947bc6075463d16fa503cb396d8ff8679bdf26))

## [0.19.1](https://github.com/betagouv/api-subventions-asso/compare/v0.18.3...v0.19.1) (2022-12-26)

### Bug Fixes

-   **api:** format data with array containing one element ([2c52324](https://github.com/betagouv/api-subventions-asso/commit/2c52324b0a22c639d5c67ce5d8b9285e96543515))
-   **api:** sort getSubventions result to avoid race failure ([e6439bb](https://github.com/betagouv/api-subventions-asso/commit/e6439bbdeb59cbe866942f5d6916922c18531db3))
-   **api:** update LCA document description text ([a5be48c](https://github.com/betagouv/api-subventions-asso/commit/a5be48c454249e2c6e1b7fa22efd476dd227b611))
-   **api:** update snapshot ([5e29d8a](https://github.com/betagouv/api-subventions-asso/commit/5e29d8a7abb7bf97d02a44f20cf7fc6881cc1ad8))
-   **api:** use real compare method to fix the test ([70b4554](https://github.com/betagouv/api-subventions-asso/commit/70b4554f74249518011f2e17a5ad87124239d0bf))
-   **front:** realign login form ([b1d69c9](https://github.com/betagouv/api-subventions-asso/commit/b1d69c927043647158d948c521e98ba2f64445d6))
-   **front:** run prettier ([8e1ce0b](https://github.com/betagouv/api-subventions-asso/commit/8e1ce0b75d5760b1d62e1de239e822c66620634e))
-   **front:** v0.19.0 bugs ([1542e62](https://github.com/betagouv/api-subventions-asso/commit/1542e62de7350c42cf4333ee1728865a0f9a1f9f)), closes [#758](https://github.com/betagouv/api-subventions-asso/issues/758) [#757](https://github.com/betagouv/api-subventions-asso/issues/757) [#756](https://github.com/betagouv/api-subventions-asso/issues/756) [#755](https://github.com/betagouv/api-subventions-asso/issues/755)

### Features

-   **api:** accept caissedesdepots.fr email domain ([ed9aaa5](https://github.com/betagouv/api-subventions-asso/commit/ed9aaa508a522eea8fffdf282c18cf3ba5fb5145))
-   **api:** add collectivite domain ([@rhone](https://github.com/rhone).fr) ([98d1bf3](https://github.com/betagouv/api-subventions-asso/commit/98d1bf31ec1bc070697672308bc4e7bd0b6f4ada))
-   **api:** add migration for osiris requests indexes ([#623](https://github.com/betagouv/api-subventions-asso/issues/623)) ([7de5708](https://github.com/betagouv/api-subventions-asso/commit/7de570817837945459a0af01aac1c49c84aa46b9))
-   **api:** apply PR review comments ([12c7bef](https://github.com/betagouv/api-subventions-asso/commit/12c7befd7c925a8ef1cd7e1bf395d0a93e53d270))
-   **front, api:** add etablissement dashboard ([#709](https://github.com/betagouv/api-subventions-asso/issues/709)) ([b3c3cc3](https://github.com/betagouv/api-subventions-asso/commit/b3c3cc3b74259e0a1d5761002b98d32ff108fe34))
-   **front:** add etablissment tab bank data ([a74bd75](https://github.com/betagouv/api-subventions-asso/commit/a74bd75ac35e36f7695c6ada7f6e73bdf7ba645d))
-   **front:** align left tabs ([418da43](https://github.com/betagouv/api-subventions-asso/commit/418da43415292801a6f3ad5816ccb370721e8566))
-   **front:** include dsfr icons ([#704](https://github.com/betagouv/api-subventions-asso/issues/704)) ([97fa87d](https://github.com/betagouv/api-subventions-asso/commit/97fa87d73b13923fc56ac817b855244568de6e11))
-   **front:** migratate admin/user/create in Svelte ([#671](https://github.com/betagouv/api-subventions-asso/issues/671)) ([2ca42b2](https://github.com/betagouv/api-subventions-asso/commit/2ca42b2e235c768d3136752473a1f61f06d5ba90))
-   **front:** new etablissement page ([#626](https://github.com/betagouv/api-subventions-asso/issues/626)) ([1c20193](https://github.com/betagouv/api-subventions-asso/commit/1c201935259fac247b47ae09d5d56ab6963249e8))
-   **front:** remplace ejs admin view in svelte view ([7b8e82d](https://github.com/betagouv/api-subventions-asso/commit/7b8e82d0ab5d2cc33821cd2aba3839f1f3a2b6f2))
-   **front:** remplace ejs domain admin view in svelte view ([#673](https://github.com/betagouv/api-subventions-asso/issues/673)) ([bc2f329](https://github.com/betagouv/api-subventions-asso/commit/bc2f329780b0673a4e75db22cde05842c7ed46fd))
-   **front:** restore cgu in svelte front ([d1cb769](https://github.com/betagouv/api-subventions-asso/commit/d1cb76911a5aacd2e021d8e0a958dd466c667fb6))
-   **front:** use Documents in etablissement page ([2e1a47d](https://github.com/betagouv/api-subventions-asso/commit/2e1a47d003430014eddf99043deca88bb33e9927))
-   **front:** use safe equality operand ([7bb0808](https://github.com/betagouv/api-subventions-asso/commit/7bb0808c4d06cc704596cf06034257bab6e9ff23))

# [0.19.0](https://github.com/betagouv/api-subventions-asso/compare/v0.18.3...v0.19.0) (2022-12-08)

### Bug Fixes

-   **api:** format data with array containing one element ([2c52324](https://github.com/betagouv/api-subventions-asso/commit/2c52324b0a22c639d5c67ce5d8b9285e96543515))
-   **api:** sort getSubventions result to avoid race failure ([e6439bb](https://github.com/betagouv/api-subventions-asso/commit/e6439bbdeb59cbe866942f5d6916922c18531db3))
-   **api:** update LCA document description text ([a5be48c](https://github.com/betagouv/api-subventions-asso/commit/a5be48c454249e2c6e1b7fa22efd476dd227b611))
-   **api:** update snapshot ([5e29d8a](https://github.com/betagouv/api-subventions-asso/commit/5e29d8a7abb7bf97d02a44f20cf7fc6881cc1ad8))
-   **api:** use real compare method to fix the test ([70b4554](https://github.com/betagouv/api-subventions-asso/commit/70b4554f74249518011f2e17a5ad87124239d0bf))
-   **front:** realign login form ([b1d69c9](https://github.com/betagouv/api-subventions-asso/commit/b1d69c927043647158d948c521e98ba2f64445d6))
-   **front:** run prettier ([8e1ce0b](https://github.com/betagouv/api-subventions-asso/commit/8e1ce0b75d5760b1d62e1de239e822c66620634e))

### Features

-   **api:** accept caissedesdepots.fr email domain ([ed9aaa5](https://github.com/betagouv/api-subventions-asso/commit/ed9aaa508a522eea8fffdf282c18cf3ba5fb5145))
-   **api:** add migration for osiris requests indexes ([#623](https://github.com/betagouv/api-subventions-asso/issues/623)) ([7de5708](https://github.com/betagouv/api-subventions-asso/commit/7de570817837945459a0af01aac1c49c84aa46b9))
-   **api:** apply PR review comments ([12c7bef](https://github.com/betagouv/api-subventions-asso/commit/12c7befd7c925a8ef1cd7e1bf395d0a93e53d270))
-   **front, api:** add etablissement dashboard ([#709](https://github.com/betagouv/api-subventions-asso/issues/709)) ([b3c3cc3](https://github.com/betagouv/api-subventions-asso/commit/b3c3cc3b74259e0a1d5761002b98d32ff108fe34))
-   **front:** add etablissment tab bank data ([a74bd75](https://github.com/betagouv/api-subventions-asso/commit/a74bd75ac35e36f7695c6ada7f6e73bdf7ba645d))
-   **front:** align left tabs ([418da43](https://github.com/betagouv/api-subventions-asso/commit/418da43415292801a6f3ad5816ccb370721e8566))
-   **front:** include dsfr icons ([#704](https://github.com/betagouv/api-subventions-asso/issues/704)) ([97fa87d](https://github.com/betagouv/api-subventions-asso/commit/97fa87d73b13923fc56ac817b855244568de6e11))
-   **front:** migratate admin/user/create in Svelte ([#671](https://github.com/betagouv/api-subventions-asso/issues/671)) ([2ca42b2](https://github.com/betagouv/api-subventions-asso/commit/2ca42b2e235c768d3136752473a1f61f06d5ba90))
-   **front:** new etablissement page ([#626](https://github.com/betagouv/api-subventions-asso/issues/626)) ([1c20193](https://github.com/betagouv/api-subventions-asso/commit/1c201935259fac247b47ae09d5d56ab6963249e8))
-   **front:** remplace ejs admin view in svelte view ([7b8e82d](https://github.com/betagouv/api-subventions-asso/commit/7b8e82d0ab5d2cc33821cd2aba3839f1f3a2b6f2))
-   **front:** remplace ejs domain admin view in svelte view ([#673](https://github.com/betagouv/api-subventions-asso/issues/673)) ([bc2f329](https://github.com/betagouv/api-subventions-asso/commit/bc2f329780b0673a4e75db22cde05842c7ed46fd))
-   **front:** restore cgu in svelte front ([d1cb769](https://github.com/betagouv/api-subventions-asso/commit/d1cb76911a5aacd2e021d8e0a958dd466c667fb6))
-   **front:** use Documents in etablissement page ([2e1a47d](https://github.com/betagouv/api-subventions-asso/commit/2e1a47d003430014eddf99043deca88bb33e9927))
-   **front:** use safe equality operand ([7bb0808](https://github.com/betagouv/api-subventions-asso/commit/7bb0808c4d06cc704596cf06034257bab6e9ff23))

## [0.18.3](https://github.com/betagouv/api-subventions-asso/compare/v0.18.2...v0.18.3) (2022-12-08)

### Bug Fixes

-   **api:** mock dauphin env var ([7e4667c](https://github.com/betagouv/api-subventions-asso/commit/7e4667cfe301a81f3817eec2356e1389988ad36e))

## [0.18.6](https://github.com/betagouv/api-subventions-asso/compare/v0.18.5...v0.18.6) (2022-12-15)

### Bug Fixes

-   **api:** update LCA document description text ([508e5c6](https://github.com/betagouv/api-subventions-asso/commit/508e5c62f76e73edf3444bce9abae1d505aff131))

## [0.18.5](https://github.com/betagouv/api-subventions-asso/compare/v0.18.3...v0.18.5) (2022-12-12)

### Features

-   **api:** add collectivite domain ([@rhone](https://github.com/rhone).fr) ([6cc7d7f](https://github.com/betagouv/api-subventions-asso/commit/6cc7d7f31133de3cdbbb0a5ce60ad2aa2863a353))

## [0.17.3](https://github.com/betagouv/api-subventions-asso/compare/v0.18.0...v0.17.3) (2022-11-22)

### Bug Fixes

-   **api:** fix migration duplicate unique id ([031cd12](https://github.com/betagouv/api-subventions-asso/commit/031cd129d31411f86b7b135ad618f4b73b7a2d22))

## [0.18.4](https://github.com/betagouv/api-subventions-asso/compare/v0.18.3...v0.18.4) (2022-12-12)

### Features

-   **api:** add collectivite domain ([@rhone](https://github.com/rhone).fr) ([6cc7d7f](https://github.com/betagouv/api-subventions-asso/commit/6cc7d7f31133de3cdbbb0a5ce60ad2aa2863a353))

## [0.17.3](https://github.com/betagouv/api-subventions-asso/compare/v0.18.0...v0.17.3) (2022-11-22)

### Bug Fixes

-   **api:** fix migration duplicate unique id ([031cd12](https://github.com/betagouv/api-subventions-asso/commit/031cd129d31411f86b7b135ad618f4b73b7a2d22))

## [0.18.3](https://github.com/betagouv/api-subventions-asso/compare/v0.18.2...v0.18.3) (2022-12-08)

### Bug Fixes

-   **front:** link chorus versements to requests ([68d4caa](https://github.com/betagouv/api-subventions-asso/commit/68d4caae00b764718a8b94beda2970ea7eeedf8a))

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
-   **front:** tsconfig error ([#564](https://github.com/betagouv/api-subventions-asso/issues/564)) ([07248a5](https://github.com/betagouv/api-subventions-asso/commit/07248a54bb05257ede63e23c743606365b4d1920))

### Features

-   **api:** drop collection entreprise siren ([#559](https://github.com/betagouv/api-subventions-asso/issues/559)) ([e019b5b](https://github.com/betagouv/api-subventions-asso/commit/e019b5bd4d2d11cf6c6e40fa5e73b04ccc25f2a4))
-   **api:** move end point to etablissemnt services ([#579](https://github.com/betagouv/api-subventions-asso/issues/579)) ([521f1c2](https://github.com/betagouv/api-subventions-asso/commit/521f1c2076d0b8defbbf5f19c063a860f755d7b1))
-   **api:** save association and etablissement in datagouv CLI parsing ([#563](https://github.com/betagouv/api-subventions-asso/issues/563)) ([bbf01b6](https://github.com/betagouv/api-subventions-asso/commit/bbf01b6ce94f86440335dec802b7849e33d3d685))
-   **api:** update datagouv parser for reading history file ([#556](https://github.com/betagouv/api-subventions-asso/issues/556)) ([5258f19](https://github.com/betagouv/api-subventions-asso/commit/5258f19722af80eabf292f83d83faf6d4695399c))
-   **api:** update script parsage datagouv ([#560](https://github.com/betagouv/api-subventions-asso/issues/560)) ([9b9132d](https://github.com/betagouv/api-subventions-asso/commit/9b9132d061f9c0e3ed05711e0ab09f8e2be2cdfd))
-   **front:** add management of user id to matomo ([#575](https://github.com/betagouv/api-subventions-asso/issues/575)) ([8de65cb](https://github.com/betagouv/api-subventions-asso/commit/8de65cb53cd7dc6100755d09839067edf7355410))
-   **front:** enhance Router with dynamics routes ([#612](https://github.com/betagouv/api-subventions-asso/issues/612)) ([e5745db](https://github.com/betagouv/api-subventions-asso/commit/e5745dbecaa6c7d89c19d2ca7dab69614383c2c4))
-   **front:** move Breadcrumbs uses in Router ([#608](https://github.com/betagouv/api-subventions-asso/issues/608)) ([25ee182](https://github.com/betagouv/api-subventions-asso/commit/25ee182899dfcc01c0d11e2927b4bdf4b17bb734))

## [0.17.2](https://github.com/betagouv/api-subventions-asso/compare/v0.17.0...v0.17.2) (2022-11-17)

### Bug Fixes

-   **api:** consumer cli controller integ test ([f665f26](https://github.com/betagouv/api-subventions-asso/commit/f665f26be01204b7a61bae37f3d93bc1b3a6e6bc))
-   **api:** create index on dauphin caches ([06487ad](https://github.com/betagouv/api-subventions-asso/commit/06487ada7e7ead8aed76c1b28a3bd995c5f82f07))
-   **api:** fix delete user ([1a95470](https://github.com/betagouv/api-subventions-asso/commit/1a95470332d8dd25df2c36c112468b8442dd9aaf))
-   **front:** fix import js on ts ([f0a1c56](https://github.com/betagouv/api-subventions-asso/commit/f0a1c568d109d4572f2ac3a31481e07d9d0efa1b))

## [0.17.1](https://github.com/betagouv/api-subventions-asso/compare/v0.17.0...v0.17.1) (2022-11-02)

### Bug Fixes

-   **api:** consumer cli controller integ test ([f665f26](https://github.com/betagouv/api-subventions-asso/commit/f665f26be01204b7a61bae37f3d93bc1b3a6e6bc))
-   **front:** fix import js on ts ([26d3e88](https://github.com/betagouv/api-subventions-asso/commit/26d3e8842033b15b515fd67ffe6f18edf6cb82ad))

# [0.17.0](https://github.com/betagouv/api-subventions-asso/compare/v0.15.5...v0.17.0) (2022-11-02)

### Bug Fixes

-   **api:** fix send wrong error on error in /auth/login ([#503](https://github.com/betagouv/api-subventions-asso/issues/503)) ([6a5ecc4](https://github.com/betagouv/api-subventions-asso/commit/6a5ecc42166618af549ba33a07a40981334105ce))
-   **api:** group associations names by rna or siren ([#504](https://github.com/betagouv/api-subventions-asso/issues/504)) ([7f8d501](https://github.com/betagouv/api-subventions-asso/commit/7f8d50118ccf4fa9f272ab89223f476a05404c47))
-   **api:** uniformize creation jwt token ([ea13507](https://github.com/betagouv/api-subventions-asso/commit/ea1350700cb8b927f9a96717447abf7b63c14d33))
-   **api:** update associationName ([dfc7c56](https://github.com/betagouv/api-subventions-asso/commit/dfc7c561b493e58c6691dd7fe5aeba712b1bc84a))
-   **front, api:** clean dauphin and subvention table ([#472](https://github.com/betagouv/api-subventions-asso/issues/472)) ([3c92975](https://github.com/betagouv/api-subventions-asso/commit/3c929753278cc575715b4e9b2f3088c834478fab))
-   **front:** fix breadcrumb ([#502](https://github.com/betagouv/api-subventions-asso/issues/502)) ([9166e28](https://github.com/betagouv/api-subventions-asso/commit/9166e2862c58870340c5682f45583c21c1f6c767))
-   **front:** fix search history display when no history ([58ec176](https://github.com/betagouv/api-subventions-asso/commit/58ec1768997bad26cffc7b449f2f1200dcf49a7c))
-   **front:** fix stack overflow on search ([fb01006](https://github.com/betagouv/api-subventions-asso/commit/fb01006d0e9227d71b48554ed59ba7600f70a550))
-   **front:** search by siret ([#505](https://github.com/betagouv/api-subventions-asso/issues/505)) ([4132de6](https://github.com/betagouv/api-subventions-asso/commit/4132de6840beb5fda5069b9360e62c676d2e6fa7))

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
-   **front:** add alert on document status ([#507](https://github.com/betagouv/api-subventions-asso/issues/507)) ([aec43a6](https://github.com/betagouv/api-subventions-asso/commit/aec43a65b6e4d31d56c5f25bf80e10e19f9f33df))
-   **front:** add contacts csv download ([#501](https://github.com/betagouv/api-subventions-asso/issues/501)) ([3850082](https://github.com/betagouv/api-subventions-asso/commit/3850082543111158d59d6f5196de751ebe967ec5))
-   **front:** disable matomo ([#469](https://github.com/betagouv/api-subventions-asso/issues/469)) ([44ebb9c](https://github.com/betagouv/api-subventions-asso/commit/44ebb9cfa0652418b42ec4c9b2e5f9fc38b0c6cf))
-   **front:** init front unit tests ([#508](https://github.com/betagouv/api-subventions-asso/issues/508)) ([8031677](https://github.com/betagouv/api-subventions-asso/commit/8031677944889048ed9f904f8e8d0b5fbcdd4e20))
-   **front:** make click on icon of CardDocument active ([#466](https://github.com/betagouv/api-subventions-asso/issues/466)) ([2714c91](https://github.com/betagouv/api-subventions-asso/commit/2714c91c0581a22e354265dbbe1a01d05babf80f))
-   **front:** update search placeholder ([#506](https://github.com/betagouv/api-subventions-asso/issues/506)) ([831785a](https://github.com/betagouv/api-subventions-asso/commit/831785a7ae26a04ba41d12f8944ac5f1dcea1736))

## [0.16.2](https://github.com/betagouv/api-subventions-asso/compare/v0.16.1...v0.16.2) (2022-10-14)

### Bug Fixes

-   **api:** fix send wrong error on error in /auth/login ([#503](https://github.com/betagouv/api-subventions-asso/issues/503)) ([20a3e0e](https://github.com/betagouv/api-subventions-asso/commit/20a3e0e71e457d8a3b76b0040da9f08efc5f68b9))
-   **api:** group associations names by rna or siren ([#504](https://github.com/betagouv/api-subventions-asso/issues/504)) ([faae9c5](https://github.com/betagouv/api-subventions-asso/commit/faae9c5e4a2177922d7e50ff06f875c39837a571))
-   **front:** fix breadcrumb ([#502](https://github.com/betagouv/api-subventions-asso/issues/502)) ([147b483](https://github.com/betagouv/api-subventions-asso/commit/147b4838a107cf065b9f099d02be14b6d28c43f0))
-   **front:** search by siret ([#505](https://github.com/betagouv/api-subventions-asso/issues/505)) ([5495181](https://github.com/betagouv/api-subventions-asso/commit/5495181992283d37dc63a1280f19359a37bdae63))

### Features

-   **front:** add alert on document status ([#507](https://github.com/betagouv/api-subventions-asso/issues/507)) ([f751555](https://github.com/betagouv/api-subventions-asso/commit/f75155574a63decd94073494aa173d8d899fd21a))
-   **front:** update search placeholder ([#506](https://github.com/betagouv/api-subventions-asso/issues/506)) ([843af17](https://github.com/betagouv/api-subventions-asso/commit/843af17aa1b7270ab1531f2d9aebc2b773a6ced9))

## [0.16.1](https://github.com/betagouv/api-subventions-asso/compare/v0.16.0...v0.16.1) (2022-10-13)

### Bug Fixes

-   **front:** fix stack overflow on search ([57e7e08](https://github.com/betagouv/api-subventions-asso/commit/57e7e08e89e36ea72fe3a1bfc0429a4e92054c57))

### Features

-   **api, front:** find asso documents from API ASSO ([#500](https://github.com/betagouv/api-subventions-asso/issues/500)) ([6538650](https://github.com/betagouv/api-subventions-asso/commit/6538650041b2cbea78fec238e50ae6fabc751b7a))

# [0.16.0](https://github.com/betagouv/api-subventions-asso/compare/v0.15.4...v0.16.0) (2022-10-12)

### Bug Fixes

-   **front, api:** clean dauphin and subvention table ([#472](https://github.com/betagouv/api-subventions-asso/issues/472)) ([e2644fe](https://github.com/betagouv/api-subventions-asso/commit/e2644fe73749b893c72c588bc815a8083cb34fe9))
-   **front:** fix search history display when no history ([315977e](https://github.com/betagouv/api-subventions-asso/commit/315977e334ec8d7f2db32d915380773b0373d8c0))

### Features

-   **api:** add stats to user ([#470](https://github.com/betagouv/api-subventions-asso/issues/470)) ([798b51e](https://github.com/betagouv/api-subventions-asso/commit/798b51ea90fe1df5b46c5387fc6f46e8ab87524b))
-   **api:** handle new FONJEP file with versements ([729d59f](https://github.com/betagouv/api-subventions-asso/commit/729d59f736a02ecec5fa013a30bc4f50a65ccf51))
-   **api:** manage user in current request ([#468](https://github.com/betagouv/api-subventions-asso/issues/468)) ([397cfcd](https://github.com/betagouv/api-subventions-asso/commit/397cfcd4fecba36725b85d6822905b9e2517fd35))
-   **front,api:** add signup date to user ([#473](https://github.com/betagouv/api-subventions-asso/issues/473)) ([180c855](https://github.com/betagouv/api-subventions-asso/commit/180c855cec6dd8500ba035cc7f9d8c3f9241d2ca))
-   **front:** disable matomo ([#469](https://github.com/betagouv/api-subventions-asso/issues/469)) ([e243201](https://github.com/betagouv/api-subventions-asso/commit/e2432011067e00e7b1a2a10e28993e4c17156da3))
-   **front:** make click on icon of CardDocument active ([#466](https://github.com/betagouv/api-subventions-asso/issues/466)) ([3949016](https://github.com/betagouv/api-subventions-asso/commit/3949016c9b0e6903520c8d75b55aad156e521c11))

## [0.16.2](https://github.com/betagouv/api-subventions-asso/compare/v0.16.1...v0.16.2) (2022-10-14)

### Bug Fixes

-   **api:** fix send wrong error on error in /auth/login ([#503](https://github.com/betagouv/api-subventions-asso/issues/503)) ([20a3e0e](https://github.com/betagouv/api-subventions-asso/commit/20a3e0e71e457d8a3b76b0040da9f08efc5f68b9))
-   **api:** group associations names by rna or siren ([#504](https://github.com/betagouv/api-subventions-asso/issues/504)) ([faae9c5](https://github.com/betagouv/api-subventions-asso/commit/faae9c5e4a2177922d7e50ff06f875c39837a571))
-   **front:** fix breadcrumb ([#502](https://github.com/betagouv/api-subventions-asso/issues/502)) ([147b483](https://github.com/betagouv/api-subventions-asso/commit/147b4838a107cf065b9f099d02be14b6d28c43f0))
-   **front:** search by siret ([#505](https://github.com/betagouv/api-subventions-asso/issues/505)) ([5495181](https://github.com/betagouv/api-subventions-asso/commit/5495181992283d37dc63a1280f19359a37bdae63))

### Features

-   **front:** add alert on document status ([#507](https://github.com/betagouv/api-subventions-asso/issues/507)) ([f751555](https://github.com/betagouv/api-subventions-asso/commit/f75155574a63decd94073494aa173d8d899fd21a))
-   **front:** update search placeholder ([#506](https://github.com/betagouv/api-subventions-asso/issues/506)) ([843af17](https://github.com/betagouv/api-subventions-asso/commit/843af17aa1b7270ab1531f2d9aebc2b773a6ced9))

## [0.16.1](https://github.com/betagouv/api-subventions-asso/compare/v0.16.0...v0.16.1) (2022-10-13)

### Bug Fixes

-   **front:** fix stack overflow on search ([57e7e08](https://github.com/betagouv/api-subventions-asso/commit/57e7e08e89e36ea72fe3a1bfc0429a4e92054c57))

### Features

-   **api, front:** find asso documents from API ASSO ([#500](https://github.com/betagouv/api-subventions-asso/issues/500)) ([6538650](https://github.com/betagouv/api-subventions-asso/commit/6538650041b2cbea78fec238e50ae6fabc751b7a))

# [0.16.0](https://github.com/betagouv/api-subventions-asso/compare/v0.15.4...v0.16.0) (2022-10-12)

### Bug Fixes

-   **front, api:** clean dauphin and subvention table ([#472](https://github.com/betagouv/api-subventions-asso/issues/472)) ([e2644fe](https://github.com/betagouv/api-subventions-asso/commit/e2644fe73749b893c72c588bc815a8083cb34fe9))
-   **front:** fix search history display when no history ([315977e](https://github.com/betagouv/api-subventions-asso/commit/315977e334ec8d7f2db32d915380773b0373d8c0))

### Features

-   **api:** add stats to user ([#470](https://github.com/betagouv/api-subventions-asso/issues/470)) ([798b51e](https://github.com/betagouv/api-subventions-asso/commit/798b51ea90fe1df5b46c5387fc6f46e8ab87524b))
-   **api:** handle new FONJEP file with versements ([729d59f](https://github.com/betagouv/api-subventions-asso/commit/729d59f736a02ecec5fa013a30bc4f50a65ccf51))
-   **api:** manage user in current request ([#468](https://github.com/betagouv/api-subventions-asso/issues/468)) ([397cfcd](https://github.com/betagouv/api-subventions-asso/commit/397cfcd4fecba36725b85d6822905b9e2517fd35))
-   **front,api:** add signup date to user ([#473](https://github.com/betagouv/api-subventions-asso/issues/473)) ([180c855](https://github.com/betagouv/api-subventions-asso/commit/180c855cec6dd8500ba035cc7f9d8c3f9241d2ca))
-   **front:** disable matomo ([#469](https://github.com/betagouv/api-subventions-asso/issues/469)) ([e243201](https://github.com/betagouv/api-subventions-asso/commit/e2432011067e00e7b1a2a10e28993e4c17156da3))
-   **front:** make click on icon of CardDocument active ([#466](https://github.com/betagouv/api-subventions-asso/issues/466)) ([3949016](https://github.com/betagouv/api-subventions-asso/commit/3949016c9b0e6903520c8d75b55aad156e521c11))

## [0.15.5](https://github.com/betagouv/api-subventions-asso/compare/v0.15.4...v0.15.5) (2022-10-17)

### Bug Fixes

-   **api:** error on dauphin is hs ([bf98860](https://github.com/betagouv/api-subventions-asso/commit/bf9886056d6fabe1d161e8959cbd2983c71355ee))

## [0.15.4](https://github.com/betagouv/api-subventions-asso/compare/v0.14.9...v0.15.4) (2022-10-11)

### Bug Fixes

-   **api:** fix chorus parser ([df1745a](https://github.com/betagouv/api-subventions-asso/commit/df1745a9e1b3d249d3e9ad2b9e3de1a7439bd8be))
-   **api:** fix import fonjep script ([#464](https://github.com/betagouv/api-subventions-asso/issues/464)) ([65118c7](https://github.com/betagouv/api-subventions-asso/commit/65118c7a921e84db81c11266eaf67fd74b99e6d3))
-   **api:** log log log ([#457](https://github.com/betagouv/api-subventions-asso/issues/457)) ([e73a10e](https://github.com/betagouv/api-subventions-asso/commit/e73a10ef8f24962633df56e05801654feb0aee5d))
-   **api:** tests ([#451](https://github.com/betagouv/api-subventions-asso/issues/451)) ([16f5320](https://github.com/betagouv/api-subventions-asso/commit/16f53201730cc5df36631499e846f04c1e706206))
-   **front:** add nojs for svelte ([#420](https://github.com/betagouv/api-subventions-asso/issues/420)) ([897d781](https://github.com/betagouv/api-subventions-asso/commit/897d781473c9f88e552850dca2c1c918ef5b12e4))
-   **front:** fix mail to contact for no js help ([#452](https://github.com/betagouv/api-subventions-asso/issues/452)) ([d50c323](https://github.com/betagouv/api-subventions-asso/commit/d50c3238fd137cd762d034f6a606a38fffbb75e8))
-   **front:** fix versement domaine foncitonel for fonjep versement ([ed12393](https://github.com/betagouv/api-subventions-asso/commit/ed1239373365c180d942c2fb492fb1edf30070f1))

### Features

-   **api, dto:** add rcs extract for associations ([7f9e286](https://github.com/betagouv/api-subventions-asso/commit/7f9e28688384212bc87f03201513007c24a00137))
-   **api, front, dto:** display rna-siren differences ([9f1b24b](https://github.com/betagouv/api-subventions-asso/commit/9f1b24bb9267102f85139c4d2ce9f045ea21c67c))
-   **api:** handle new FONJEP file with versements ([1f202c0](https://github.com/betagouv/api-subventions-asso/commit/1f202c0e46417f7c94d3ae10b9205797cacee427))
-   **api:** rename fonjep collection to fonjepSubvention ([#461](https://github.com/betagouv/api-subventions-asso/issues/461)) ([9231625](https://github.com/betagouv/api-subventions-asso/commit/92316252ea5ea0232860f180c2eec9827b54a1ea))
-   **api:** update parser for new data 2022 ([#423](https://github.com/betagouv/api-subventions-asso/issues/423)) ([c82b48c](https://github.com/betagouv/api-subventions-asso/commit/c82b48c37a3a8fc83c7ca9c076fb5458708041cd))
-   **front:** change pipedrive chat playbook ([a8d3f8d](https://github.com/betagouv/api-subventions-asso/commit/a8d3f8d422672ac6cd600877c83e535b1d6f6ca5))
-   **front:** disable own account suppression ([c197511](https://github.com/betagouv/api-subventions-asso/commit/c1975112055bd2f2046a58a649a5091b73c33110))
-   **front:** move home page to svelte ([#441](https://github.com/betagouv/api-subventions-asso/issues/441)) ([3764a58](https://github.com/betagouv/api-subventions-asso/commit/3764a58e18c77238434928b8623d455ab4178a3b))
-   **front:** use a unique GenericModal ([a82b002](https://github.com/betagouv/api-subventions-asso/commit/a82b002530a087f936ce1164d0159e588773f542))

## [0.15.3](https://github.com/betagouv/api-subventions-asso/compare/v0.15.2...v0.15.3) (2022-09-29)

### Bug Fixes

-   **api:** fix chorus parser ([df1745a](https://github.com/betagouv/api-subventions-asso/commit/df1745a9e1b3d249d3e9ad2b9e3de1a7439bd8be))
-   **front:** fix versement domaine foncitonel for fonjep versement ([5142146](https://github.com/betagouv/api-subventions-asso/commit/5142146a64511059fc56b6d171e22d4ab4856ab4))

## [0.14.9](https://github.com/betagouv/api-subventions-asso/compare/v0.14.8...v0.14.9) (2022-09-23)

### Bug Fixes

-   **front:** disable show provider modal on botton of subvention table ([0f07e8f](https://github.com/betagouv/api-subventions-asso/commit/0f07e8fdc46039b3702adc013ce30a9788fc1ec0))
-   **api:** tests ([#451](https://github.com/betagouv/api-subventions-asso/issues/451)) ([b892855](https://github.com/betagouv/api-subventions-asso/commit/b8928552345839f5ede3b688a028cf061b195792))
-   **front:** add nojs for svelte ([#420](https://github.com/betagouv/api-subventions-asso/issues/420)) ([06c4b65](https://github.com/betagouv/api-subventions-asso/commit/06c4b65c38e2f2c04cf2a45541a68e9705c1e0cd))
-   **front:** fix mail to contact for no js help ([#452](https://github.com/betagouv/api-subventions-asso/issues/452)) ([aa13a99](https://github.com/betagouv/api-subventions-asso/commit/aa13a99101c422272e7ce5437bc06b92ce5ed815))

### Features

-   **api, dto:** add rcs extract for associations ([ccd18fa](https://github.com/betagouv/api-subventions-asso/commit/ccd18fa2781b432636e354f2bd9dab0ab48ddcb9))
-   **api, front, dto:** display rna-siren differences ([3b6d6ba](https://github.com/betagouv/api-subventions-asso/commit/3b6d6ba99c51e18542eab033a79fb5611abb0a53))
-   **api:** handle new FONJEP file with versements ([5d5a762](https://github.com/betagouv/api-subventions-asso/commit/5d5a762eabcc0ff212c4b5454ee9d57d4a389044))
-   **api:** rename fonjep collection to fonjepSubvention ([#461](https://github.com/betagouv/api-subventions-asso/issues/461)) ([79bea66](https://github.com/betagouv/api-subventions-asso/commit/79bea6633a1fa40106436153ab91a1bc18a5e975))
-   **api:** update parser for new data 2022 ([#423](https://github.com/betagouv/api-subventions-asso/issues/423)) ([060ea1c](https://github.com/betagouv/api-subventions-asso/commit/060ea1c0d29887e3a2683c8af924703b19a7b406))
-   **front:** disable own account suppression ([46096c3](https://github.com/betagouv/api-subventions-asso/commit/46096c3e58abb3866cb754c29cc3c44eb0ef39cb))
-   **front:** move home page to svelte ([#441](https://github.com/betagouv/api-subventions-asso/issues/441)) ([be65658](https://github.com/betagouv/api-subventions-asso/commit/be65658c1e4831ab713b433b85d99eda6841d3b0))
-   **front:** use a unique GenericModal ([6351e5c](https://github.com/betagouv/api-subventions-asso/commit/6351e5c95c37ee1baf0ce884f0c340138c7a4ba4))

## [0.14.8](https://github.com/betagouv/api-subventions-asso/compare/v0.14.7...v0.14.8) (2022-09-21)

### Bug Fixes

-   **api, front:** crash on search asso without siren ([9a14dfe](https://github.com/betagouv/api-subventions-asso/commit/9a14dfe9bb7b155081732f5c32b18a90b2d3b155))

## [0.14.7](https://github.com/betagouv/api-subventions-asso/compare/v0.14.6...v0.14.7) (2022-09-06)

### Bug Fixes

-   **front:** remove Dauphin from provider list ([edcd979](https://github.com/betagouv/api-subventions-asso/commit/edcd979e217c1d228b329c95d91d06695ee792d0))

## [0.14.6](https://github.com/betagouv/api-subventions-asso/compare/v0.14.5...v0.14.6) (2022-08-30)

### Bug Fixes

-   **front:** fix subvention flux store refresh ([e7edc6c](https://github.com/betagouv/api-subventions-asso/commit/e7edc6c82fb51d0f45e78b871e2567b72d16ea05))

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
-   **front:** clean texts ([#416](https://github.com/betagouv/api-subventions-asso/issues/416)) ([b218198](https://github.com/betagouv/api-subventions-asso/commit/b21819870cdefbc2e54a9c1f9d6f4982a0c5a4bd))
-   **front:** disable breaking line for table cells ([#415](https://github.com/betagouv/api-subventions-asso/issues/415)) ([35738b0](https://github.com/betagouv/api-subventions-asso/commit/35738b012b021d0a86442baf9cbe0b2551a48fee))
-   **front:** fix bug filter on etablissements ([#418](https://github.com/betagouv/api-subventions-asso/issues/418)) ([6cf259a](https://github.com/betagouv/api-subventions-asso/commit/6cf259aa4fb84225feac7bd6afe878ae9431f024)), closes [#417](https://github.com/betagouv/api-subventions-asso/issues/417)

## [0.14.1](https://github.com/betagouv/api-subventions-asso/compare/v0.14.0...v0.14.1) (2022-08-22)

### Bug Fixes

-   **api:** fix error on search association ([#405](https://github.com/betagouv/api-subventions-asso/issues/405)) ([778a259](https://github.com/betagouv/api-subventions-asso/commit/778a25925192d5a524def9aae09afeae122fbb0c))
-   **front:** handle dark mode for tables ([#401](https://github.com/betagouv/api-subventions-asso/issues/401)) ([cd209fb](https://github.com/betagouv/api-subventions-asso/commit/cd209fb0f7a5bf7730cec3a8b125c52ee5ee2f65))

# [0.14.0](https://github.com/betagouv/api-subventions-asso/compare/v0.13.1...v0.14.0) (2022-08-18)

### Features

-   **api, dto, front:** store rna and siren values in Association ([#387](https://github.com/betagouv/api-subventions-asso/issues/387)) ([d55b547](https://github.com/betagouv/api-subventions-asso/commit/d55b547a73fa96122386dfa49798cf1c675802bd))
-   **api:** add date of last import for datagouv files ([#392](https://github.com/betagouv/api-subventions-asso/issues/392)) ([12a7cf1](https://github.com/betagouv/api-subventions-asso/commit/12a7cf1f2f60d1dc9f614e71a5f4bcdf99db3e4b))
-   **front:** update dashboard from bizdev comments ([#391](https://github.com/betagouv/api-subventions-asso/issues/391)) ([2dde3b3](https://github.com/betagouv/api-subventions-asso/commit/2dde3b3509707e32be29ed6885f0d719cc562f0a))

## [0.13.1](https://github.com/betagouv/api-subventions-asso/compare/v0.13.0...v0.13.1) (2022-07-28)

### Bug Fixes

-   **api:** fix error in script ([bedf946](https://github.com/betagouv/api-subventions-asso/commit/bedf946ef7688b4a05e0d08a2fd3a9363c3389b8))

# [0.13.0](https://github.com/betagouv/api-subventions-asso/compare/v0.12.3...v0.13.0) (2022-07-28)

### Bug Fixes

-   **front:** fix many little bugs ([d52ea3a](https://github.com/betagouv/api-subventions-asso/commit/d52ea3a0f7e3cfbfb2661af83e215824196558dd))

### Features

-   **api, dto:** retrieve API Entreprise etablissement headcount ([#367](https://github.com/betagouv/api-subventions-asso/issues/367)) ([82419e6](https://github.com/betagouv/api-subventions-asso/commit/82419e6a596d6a0922426c89cc6c5803205be0bf))
-   **api:** add compare command for FONJEP CLI ([7f1b82a](https://github.com/betagouv/api-subventions-asso/commit/7f1b82a2291c1a8a209f7d3832e28c2f4cd18d79))
-   **api:** add posibilities to remove user ([#364](https://github.com/betagouv/api-subventions-asso/issues/364)) ([cd562d3](https://github.com/betagouv/api-subventions-asso/commit/cd562d38bbd4d398fdab5fb8319a4f00365207aa))
-   **api:** add SendInBlue mail provider ([#370](https://github.com/betagouv/api-subventions-asso/issues/370)) ([4d15231](https://github.com/betagouv/api-subventions-asso/commit/4d15231486b748df06ff5876f8502da6565ba37e))
-   **front:** add modals providers ([#380](https://github.com/betagouv/api-subventions-asso/issues/380)) ([7f5e04a](https://github.com/betagouv/api-subventions-asso/commit/7f5e04a9bfca4aceffa25936f817e08ec7f143ed))
-   **front:** add sort in table ([#369](https://github.com/betagouv/api-subventions-asso/issues/369)) ([c2ae588](https://github.com/betagouv/api-subventions-asso/commit/c2ae5889194487a7364b0575a05bdd920d3783f9))
-   **front:** add versements and subvention modals ([#381](https://github.com/betagouv/api-subventions-asso/issues/381)) ([1624c6a](https://github.com/betagouv/api-subventions-asso/commit/1624c6ac698850c8f830113ec25e287518831d54))
-   **front:** change title of etablissements and target blank on download document ([#377](https://github.com/betagouv/api-subventions-asso/issues/377)) ([6b1bd8f](https://github.com/betagouv/api-subventions-asso/commit/6b1bd8f31cdf22a43bce9824490391ce59919cf7))
-   **front:** enable matomo with datasub id ([#368](https://github.com/betagouv/api-subventions-asso/issues/368)) ([e03aee0](https://github.com/betagouv/api-subventions-asso/commit/e03aee02b121a07d59a8a0339e60ce0d0018474e)), closes [#366](https://github.com/betagouv/api-subventions-asso/issues/366)

## [0.12.4](https://github.com/betagouv/api-subventions-asso/compare/v0.12.3...v0.12.4) (2022-07-21)

**Note:** Version bump only for package api-subventions-asso

## [0.12.3](https://github.com/betagouv/api-subventions-asso/compare/v0.12.2...v0.12.3) (2022-07-12)

### Bug Fixes

-   **front:** fix no data found if no sub found ([1e94beb](https://github.com/betagouv/api-subventions-asso/commit/1e94beb23648302ed20bcc1ab9332b2fff184977))

## [0.12.2](https://github.com/betagouv/api-subventions-asso/compare/v0.12.1...v0.12.2) (2022-07-12)

**Note:** Version bump only for package api-subventions-asso

## [0.12.1](https://github.com/betagouv/api-subventions-asso/compare/v0.12.0...v0.12.1) (2022-07-11)

### Bug Fixes

-   **front:** fix build svelte ([cd7aef9](https://github.com/betagouv/api-subventions-asso/commit/cd7aef93954c55f95ff207beb3a6666f5602f36b))

# [0.12.0](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.12.0) (2022-07-11)

### Bug Fixes

-   **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([b355edf](https://github.com/betagouv/api-subventions-asso/commit/b355edf74d39a0fa7bc588fd6c4a25df2780849f))
-   **api:** fix date modification ([35a0ade](https://github.com/betagouv/api-subventions-asso/commit/35a0aded8bdb71fd47d708f2cb0f344aabba2750))
-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))
-   **front:** fix error on capitalize string ([#339](https://github.com/betagouv/api-subventions-asso/issues/339)) ([3326a01](https://github.com/betagouv/api-subventions-asso/commit/3326a010247dcd4a356280326f78aa1de0e6a45d))
-   **front:** spelling correction ([#346](https://github.com/betagouv/api-subventions-asso/issues/346)) ([a26af0f](https://github.com/betagouv/api-subventions-asso/commit/a26af0f6d3689f3148994a41b913a4858fc31316))

### Features

-   **api:** add route for getting documents ([#324](https://github.com/betagouv/api-subventions-asso/issues/324)) ([17acc6a](https://github.com/betagouv/api-subventions-asso/commit/17acc6a67992176908410b221264b87404a4c312))
-   **api:** add service for api entreprise ([#342](https://github.com/betagouv/api-subventions-asso/issues/342)) ([382bfba](https://github.com/betagouv/api-subventions-asso/commit/382bfba952ca7a24c5b0479eee21b652e71f826a))
-   **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([0a354f5](https://github.com/betagouv/api-subventions-asso/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))
-   **api:** apply new rules for api asso documents ([#336](https://github.com/betagouv/api-subventions-asso/issues/336)) ([145f1b4](https://github.com/betagouv/api-subventions-asso/commit/145f1b4823c7b876b75cbe2a990d0a424f221ee1))
-   **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([e15ce0c](https://github.com/betagouv/api-subventions-asso/commit/e15ce0c1f12582101870b9b6ef3769f82c931a66))
-   **front:** add cgu page ([#313](https://github.com/betagouv/api-subventions-asso/issues/313)) ([69fd4d5](https://github.com/betagouv/api-subventions-asso/commit/69fd4d58d382e38302abfbe43257a090715eda9b))
-   **front:** add mailto activation mail not received ([#295](https://github.com/betagouv/api-subventions-asso/issues/295)) ([be2498a](https://github.com/betagouv/api-subventions-asso/commit/be2498a35f39e80950a41aa6a547094c1affb0b0)), closes [#292](https://github.com/betagouv/api-subventions-asso/issues/292) [#239](https://github.com/betagouv/api-subventions-asso/issues/239) [#207](https://github.com/betagouv/api-subventions-asso/issues/207) [#245](https://github.com/betagouv/api-subventions-asso/issues/245) [#242](https://github.com/betagouv/api-subventions-asso/issues/242) [#243](https://github.com/betagouv/api-subventions-asso/issues/243) [#249](https://github.com/betagouv/api-subventions-asso/issues/249) [#255](https://github.com/betagouv/api-subventions-asso/issues/255) [#253](https://github.com/betagouv/api-subventions-asso/issues/253) [#258](https://github.com/betagouv/api-subventions-asso/issues/258) [#263](https://github.com/betagouv/api-subventions-asso/issues/263) [#259](https://github.com/betagouv/api-subventions-asso/issues/259) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#270](https://github.com/betagouv/api-subventions-asso/issues/270) [#265](https://github.com/betagouv/api-subventions-asso/issues/265)
-   **front:** update app description ([#306](https://github.com/betagouv/api-subventions-asso/issues/306)) ([6fc26b5](https://github.com/betagouv/api-subventions-asso/commit/6fc26b5b1b7b28bf81623c1b995726d6b51b90c6))

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
-   **front:** add cgu page ([#313](https://github.com/betagouv/api-subventions-asso/issues/313)) ([69fd4d5](https://github.com/betagouv/api-subventions-asso/commit/69fd4d58d382e38302abfbe43257a090715eda9b))
-   **front:** add mailto activation mail not received ([#295](https://github.com/betagouv/api-subventions-asso/issues/295)) ([be2498a](https://github.com/betagouv/api-subventions-asso/commit/be2498a35f39e80950a41aa6a547094c1affb0b0)), closes [#292](https://github.com/betagouv/api-subventions-asso/issues/292) [#239](https://github.com/betagouv/api-subventions-asso/issues/239) [#207](https://github.com/betagouv/api-subventions-asso/issues/207) [#245](https://github.com/betagouv/api-subventions-asso/issues/245) [#242](https://github.com/betagouv/api-subventions-asso/issues/242) [#243](https://github.com/betagouv/api-subventions-asso/issues/243) [#249](https://github.com/betagouv/api-subventions-asso/issues/249) [#255](https://github.com/betagouv/api-subventions-asso/issues/255) [#253](https://github.com/betagouv/api-subventions-asso/issues/253) [#258](https://github.com/betagouv/api-subventions-asso/issues/258) [#263](https://github.com/betagouv/api-subventions-asso/issues/263) [#259](https://github.com/betagouv/api-subventions-asso/issues/259) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#270](https://github.com/betagouv/api-subventions-asso/issues/270) [#265](https://github.com/betagouv/api-subventions-asso/issues/265)
-   **front:** update app description ([#306](https://github.com/betagouv/api-subventions-asso/issues/306)) ([6fc26b5](https://github.com/betagouv/api-subventions-asso/commit/6fc26b5b1b7b28bf81623c1b995726d6b51b90c6))

## [0.11.2](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.11.2) (2022-07-01)

### Bug Fixes

-   **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([b355edf](https://github.com/betagouv/api-subventions-asso/commit/b355edf74d39a0fa7bc588fd6c4a25df2780849f))
-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))
-   **front:** fix error on capitalize string ([#339](https://github.com/betagouv/api-subventions-asso/issues/339)) ([3326a01](https://github.com/betagouv/api-subventions-asso/commit/3326a010247dcd4a356280326f78aa1de0e6a45d))

### Bug Fixes

-   **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([0a354f5](https://github.com/betagouv/api-subventions-asso/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))
-   **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([e15ce0c](https://github.com/betagouv/api-subventions-asso/commit/e15ce0c1f12582101870b9b6ef3769f82c931a66))
-   **front:** add cgu page ([#313](https://github.com/betagouv/api-subventions-asso/issues/313)) ([69fd4d5](https://github.com/betagouv/api-subventions-asso/commit/69fd4d58d382e38302abfbe43257a090715eda9b))
-   **front:** add mailto activation mail not received ([#295](https://github.com/betagouv/api-subventions-asso/issues/295)) ([be2498a](https://github.com/betagouv/api-subventions-asso/commit/be2498a35f39e80950a41aa6a547094c1affb0b0)), closes [#292](https://github.com/betagouv/api-subventions-asso/issues/292) [#239](https://github.com/betagouv/api-subventions-asso/issues/239) [#207](https://github.com/betagouv/api-subventions-asso/issues/207) [#245](https://github.com/betagouv/api-subventions-asso/issues/245) [#242](https://github.com/betagouv/api-subventions-asso/issues/242) [#243](https://github.com/betagouv/api-subventions-asso/issues/243) [#249](https://github.com/betagouv/api-subventions-asso/issues/249) [#255](https://github.com/betagouv/api-subventions-asso/issues/255) [#253](https://github.com/betagouv/api-subventions-asso/issues/253) [#258](https://github.com/betagouv/api-subventions-asso/issues/258) [#263](https://github.com/betagouv/api-subventions-asso/issues/263) [#259](https://github.com/betagouv/api-subventions-asso/issues/259) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#270](https://github.com/betagouv/api-subventions-asso/issues/270) [#265](https://github.com/betagouv/api-subventions-asso/issues/265)
-   **front:** update app description ([#306](https://github.com/betagouv/api-subventions-asso/issues/306)) ([6fc26b5](https://github.com/betagouv/api-subventions-asso/commit/6fc26b5b1b7b28bf81623c1b995726d6b51b90c6))

## [0.11.1](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.11.1) (2022-06-30)

### Bug Fixes

-   **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([b355edf](https://github.com/betagouv/api-subventions-asso/commit/b355edf74d39a0fa7bc588fd6c4a25df2780849f))
-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))
-   **front:** fix error on capitalize string ([c43b257](https://github.com/betagouv/api-subventions-asso/commit/c43b2573127c88360c838875130701b8698131c1))

### Features

-   **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([0a354f5](https://github.com/betagouv/api-subventions-asso/commit/0a354f59df88236bec1ed039abd9eb37ba43e3db))
-   **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([e15ce0c](https://github.com/betagouv/api-subventions-asso/commit/e15ce0c1f12582101870b9b6ef3769f82c931a66))
-   **front:** add cgu page ([#313](https://github.com/betagouv/api-subventions-asso/issues/313)) ([69fd4d5](https://github.com/betagouv/api-subventions-asso/commit/69fd4d58d382e38302abfbe43257a090715eda9b))
-   **front:** add mailto activation mail not received ([#295](https://github.com/betagouv/api-subventions-asso/issues/295)) ([be2498a](https://github.com/betagouv/api-subventions-asso/commit/be2498a35f39e80950a41aa6a547094c1affb0b0)), closes [#292](https://github.com/betagouv/api-subventions-asso/issues/292) [#239](https://github.com/betagouv/api-subventions-asso/issues/239) [#207](https://github.com/betagouv/api-subventions-asso/issues/207) [#245](https://github.com/betagouv/api-subventions-asso/issues/245) [#242](https://github.com/betagouv/api-subventions-asso/issues/242) [#243](https://github.com/betagouv/api-subventions-asso/issues/243) [#249](https://github.com/betagouv/api-subventions-asso/issues/249) [#255](https://github.com/betagouv/api-subventions-asso/issues/255) [#253](https://github.com/betagouv/api-subventions-asso/issues/253) [#258](https://github.com/betagouv/api-subventions-asso/issues/258) [#263](https://github.com/betagouv/api-subventions-asso/issues/263) [#259](https://github.com/betagouv/api-subventions-asso/issues/259) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#270](https://github.com/betagouv/api-subventions-asso/issues/270) [#265](https://github.com/betagouv/api-subventions-asso/issues/265)
-   **front:** update app description ([#306](https://github.com/betagouv/api-subventions-asso/issues/306)) ([6fc26b5](https://github.com/betagouv/api-subventions-asso/commit/6fc26b5b1b7b28bf81623c1b995726d6b51b90c6))

# [0.11.0](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.11.0) (2022-06-21)

### Bug Fixes

-   **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([4114b24](https://github.com/betagouv/api-subventions-asso/commit/4114b24923c55fa03e9758c169ddb505440d3e50))
-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))

### Features

-   **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([b43a1cf](https://github.com/betagouv/api-subventions-asso/commit/b43a1cfcdc068252eeef81dec59ea97c93c3b6c3))
-   **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([1e2bf9f](https://github.com/betagouv/api-subventions-asso/commit/1e2bf9feacfb4a448763409cc952b1d0fa7f1054))
-   **front:** add cgu page ([#313](https://github.com/betagouv/api-subventions-asso/issues/313)) ([51ca9c0](https://github.com/betagouv/api-subventions-asso/commit/51ca9c0439689e97bf2114f33708991bfdc10363))
-   **front:** add mailto activation mail not received ([#295](https://github.com/betagouv/api-subventions-asso/issues/295)) ([8905344](https://github.com/betagouv/api-subventions-asso/commit/89053446e3610e1f701058827297809c9d4c6831)), closes [#292](https://github.com/betagouv/api-subventions-asso/issues/292) [#239](https://github.com/betagouv/api-subventions-asso/issues/239) [#207](https://github.com/betagouv/api-subventions-asso/issues/207) [#245](https://github.com/betagouv/api-subventions-asso/issues/245) [#242](https://github.com/betagouv/api-subventions-asso/issues/242) [#243](https://github.com/betagouv/api-subventions-asso/issues/243) [#249](https://github.com/betagouv/api-subventions-asso/issues/249) [#255](https://github.com/betagouv/api-subventions-asso/issues/255) [#253](https://github.com/betagouv/api-subventions-asso/issues/253) [#258](https://github.com/betagouv/api-subventions-asso/issues/258) [#263](https://github.com/betagouv/api-subventions-asso/issues/263) [#259](https://github.com/betagouv/api-subventions-asso/issues/259) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#270](https://github.com/betagouv/api-subventions-asso/issues/270) [#265](https://github.com/betagouv/api-subventions-asso/issues/265)
-   **front:** update app description ([#306](https://github.com/betagouv/api-subventions-asso/issues/306)) ([dda81a3](https://github.com/betagouv/api-subventions-asso/commit/dda81a3ad9a0fb4187b53babfccd3421bd225e61))

## [0.10.7](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.7) (2022-06-21)

### Bug Fixes

-   **api:** add 'Etat dossier' in path for osirisRequestEntity status ([#294](https://github.com/betagouv/api-subventions-asso/issues/294)) ([4114b24](https://github.com/betagouv/api-subventions-asso/commit/4114b24923c55fa03e9758c169ddb505440d3e50))
-   **api:** fix wrong year on osiris data ([#312](https://github.com/betagouv/api-subventions-asso/issues/312)) ([293f36d](https://github.com/betagouv/api-subventions-asso/commit/293f36d5f9a951f64d9e93f5931d209858bd5692))
-   **front:** fix error errorcode is not defined ([#302](https://github.com/betagouv/api-subventions-asso/issues/302)) ([776ff2d](https://github.com/betagouv/api-subventions-asso/commit/776ff2d06681aebd582a16fbfbfceaf8078f0c2a))

### Features

-   **api:** add versements routes ([#301](https://github.com/betagouv/api-subventions-asso/issues/301)) ([b43a1cf](https://github.com/betagouv/api-subventions-asso/commit/b43a1cfcdc068252eeef81dec59ea97c93c3b6c3))
-   **api:** user email to lower case ([#298](https://github.com/betagouv/api-subventions-asso/issues/298)) ([1e2bf9f](https://github.com/betagouv/api-subventions-asso/commit/1e2bf9feacfb4a448763409cc952b1d0fa7f1054))
-   **front:** add cgu page ([#313](https://github.com/betagouv/api-subventions-asso/issues/313)) ([51ca9c0](https://github.com/betagouv/api-subventions-asso/commit/51ca9c0439689e97bf2114f33708991bfdc10363))
-   **front:** add mailto activation mail not received ([#295](https://github.com/betagouv/api-subventions-asso/issues/295)) ([8905344](https://github.com/betagouv/api-subventions-asso/commit/89053446e3610e1f701058827297809c9d4c6831)), closes [#292](https://github.com/betagouv/api-subventions-asso/issues/292) [#239](https://github.com/betagouv/api-subventions-asso/issues/239) [#207](https://github.com/betagouv/api-subventions-asso/issues/207) [#245](https://github.com/betagouv/api-subventions-asso/issues/245) [#242](https://github.com/betagouv/api-subventions-asso/issues/242) [#243](https://github.com/betagouv/api-subventions-asso/issues/243) [#249](https://github.com/betagouv/api-subventions-asso/issues/249) [#255](https://github.com/betagouv/api-subventions-asso/issues/255) [#253](https://github.com/betagouv/api-subventions-asso/issues/253) [#258](https://github.com/betagouv/api-subventions-asso/issues/258) [#263](https://github.com/betagouv/api-subventions-asso/issues/263) [#259](https://github.com/betagouv/api-subventions-asso/issues/259) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#256](https://github.com/betagouv/api-subventions-asso/issues/256) [#270](https://github.com/betagouv/api-subventions-asso/issues/270) [#265](https://github.com/betagouv/api-subventions-asso/issues/265)
-   **front:** update app description ([#306](https://github.com/betagouv/api-subventions-asso/issues/306)) ([dda81a3](https://github.com/betagouv/api-subventions-asso/commit/dda81a3ad9a0fb4187b53babfccd3421bd225e61))

## [0.10.8](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.8) (2022-06-24)

## [0.10.7](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.7) (2022-06-21)

## [0.10.6](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.6) (2022-06-21)

### Bug Fixes

-   **api:** fix migration import ([bd13d3b](https://github.com/betagouv/api-subventions-asso/commit/bd13d3b564147de47d12de03a514d0a9ded0a1ae))

## [0.10.5](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.5) (2022-06-21)

### Bug Fixes

-   **api:** fix wrong year on osiris data ([d3290e7](https://github.com/betagouv/api-subventions-asso/commit/d3290e709074a5f8397bf4590969b257200606c1))

## [0.10.4](https://github.com/betagouv/api-subventions-asso/compare/v0.10.3...v0.10.4) (2022-06-14)

### Bug Fixes

-   **front:** fix error errorcode is not defined ([8a2de34](https://github.com/betagouv/api-subventions-asso/commit/8a2de344e42702b2f28e45105c569b6c1c22c051))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.10.3](https://github.com/betagouv/api-subventions-asso/compare/v0.9.4...v0.10.3) (2022-06-09)

### Features

-   **api,front,dto:** error on login better manage ([de14c0b](https://github.com/betagouv/api-subventions-asso/commit/de14c0b18cb741e1f0e94bdefeb239a069116616))
-   **api:** add migration to fill association-name from osiris ([#259](https://github.com/betagouv/api-subventions-asso/issues/259)) ([7cb2c4c](https://github.com/betagouv/api-subventions-asso/commit/7cb2c4c1b831b8fecda390d54a90b05b12129cdb))
-   **api:** add route for getting list of etablissements ([36861f7](https://github.com/betagouv/api-subventions-asso/commit/36861f7b4b0fb36e465d1e67cb7ef1b63e3a09aa))
-   **api:** add route for getting one etablissement ([#255](https://github.com/betagouv/api-subventions-asso/issues/255)) ([d86a945](https://github.com/betagouv/api-subventions-asso/commit/d86a945fbe5aec1346ded037f78966dea21dec46))
-   **api:** add stats route, for compute median number of requests [#243](https://github.com/betagouv/api-subventions-asso/issues/243) ([4ca169c](https://github.com/betagouv/api-subventions-asso/commit/4ca169c295bd30385635ccd7057a3c609da67f59))
-   **api:** stats allow the exclusion of the admin ([381c84c](https://github.com/betagouv/api-subventions-asso/commit/381c84c6df28d8f486c43fc2818389fcacef48db))
-   **api:** update README ([#258](https://github.com/betagouv/api-subventions-asso/issues/258)) ([0362818](https://github.com/betagouv/api-subventions-asso/commit/03628183cdcb2e8ea7f5d5f608ff2d8425a745bf))
-   **front:** add € on amount ([069cbb5](https://github.com/betagouv/api-subventions-asso/commit/069cbb56200757fdac9b557076b55cc7e4cc2e78))
-   **front:** add pipe drive chat bot ([cfb0054](https://github.com/betagouv/api-subventions-asso/commit/cfb0054a977bea3de6ae34071f32d9f9d9488d3b))
-   **front:** add tiret - on value not found ([#249](https://github.com/betagouv/api-subventions-asso/issues/249)) ([e9febc6](https://github.com/betagouv/api-subventions-asso/commit/e9febc6d5725368cdfefdb91fae0fc168ba459ef))

### Bug Fixes

-   **api:** call getBySiren if found ([370a606](https://github.com/betagouv/api-subventions-asso/commit/370a6061c14ffb3d31d42f0660402d7036d72547))
-   **api:** fix association-name siret-to-siren migration ([#293](https://github.com/betagouv/api-subventions-asso/issues/293)) ([9ac3bc0](https://github.com/betagouv/api-subventions-asso/commit/9ac3bc0831b8c62172b00b32022304d95087608f))
-   **api:** fix mail extention (missing f) ([4e0e026](https://github.com/betagouv/api-subventions-asso/commit/4e0e0268a3ab376ec4854a5c497e21f7ec011677))
-   **api:** fix siret as siren in association-name ([#263](https://github.com/betagouv/api-subventions-asso/issues/263)) ([e954f22](https://github.com/betagouv/api-subventions-asso/commit/e954f223cbd5fbd8c799e98386217645a9b50579))
-   **api:** osiris service tests ([4ca6dcd](https://github.com/betagouv/api-subventions-asso/commit/4ca6dcdeb9f4bf18232e51f1eb1dd55486304438))
-   **api:** quick fix not uuse var date_modif_siren before checking if var exist ([598296f](https://github.com/betagouv/api-subventions-asso/commit/598296f6f50ba253365401fa697d390a28c735d1))
-   **front:** correction orthographe ([7039408](https://github.com/betagouv/api-subventions-asso/commit/7039408e104d8904356011997b180e4dc23acbed))
-   **front:** reload chat pipe drive between two page ([187885a](https://github.com/betagouv/api-subventions-asso/commit/187885aa93fc26deebd9f1a61bf0bf4c640ba5dc))

### [0.10.2](https://github.com/betagouv/api-subventions-asso/compare/v0.8.7...v0.10.2) (2022-06-08)

### Features

-   **api,front,dto:** error on login better manage ([de14c0b](https://github.com/betagouv/api-subventions-asso/commit/de14c0b18cb741e1f0e94bdefeb239a069116616))
-   **api:** add get subvention by mongo id ([f24ec3b](https://github.com/betagouv/api-subventions-asso/commit/f24ec3bdcc6a1caeaab0e8868a09558edc54b62f))
-   **api:** add migration to fill association-name from osiris ([#259](https://github.com/betagouv/api-subventions-asso/issues/259)) ([7cb2c4c](https://github.com/betagouv/api-subventions-asso/commit/7cb2c4c1b831b8fecda390d54a90b05b12129cdb))
-   **api:** add route for getting list of etablissements ([36861f7](https://github.com/betagouv/api-subventions-asso/commit/36861f7b4b0fb36e465d1e67cb7ef1b63e3a09aa))
-   **api:** add route for getting one etablissement ([#255](https://github.com/betagouv/api-subventions-asso/issues/255)) ([d86a945](https://github.com/betagouv/api-subventions-asso/commit/d86a945fbe5aec1346ded037f78966dea21dec46))
-   **api:** add stats route, for compute median number of requests [#243](https://github.com/betagouv/api-subventions-asso/issues/243) ([4ca169c](https://github.com/betagouv/api-subventions-asso/commit/4ca169c295bd30385635ccd7057a3c609da67f59))
-   **api:** code review ([0d3389f](https://github.com/betagouv/api-subventions-asso/commit/0d3389fb324e4e5041418d73fb2ce4a557128124))
-   **api:** stats allow the exclusion of the admin ([381c84c](https://github.com/betagouv/api-subventions-asso/commit/381c84c6df28d8f486c43fc2818389fcacef48db))
-   **api:** update README ([#258](https://github.com/betagouv/api-subventions-asso/issues/258)) ([0362818](https://github.com/betagouv/api-subventions-asso/commit/03628183cdcb2e8ea7f5d5f608ff2d8425a745bf))
-   **front:** add € on amount ([069cbb5](https://github.com/betagouv/api-subventions-asso/commit/069cbb56200757fdac9b557076b55cc7e4cc2e78))
-   **front:** add pipe drive chat bot ([cfb0054](https://github.com/betagouv/api-subventions-asso/commit/cfb0054a977bea3de6ae34071f32d9f9d9488d3b))
-   **front:** add spaces for currency amount in arrays ([#200](https://github.com/betagouv/api-subventions-asso/issues/200)) ([d27fa87](https://github.com/betagouv/api-subventions-asso/commit/d27fa8721dd714199e2d24f6ba4ce42655965ea8))
-   **front:** add tiret - on value not found ([#249](https://github.com/betagouv/api-subventions-asso/issues/249)) ([e9febc6](https://github.com/betagouv/api-subventions-asso/commit/e9febc6d5725368cdfefdb91fae0fc168ba459ef))
-   **front:** prefill nojs mailto ([#199](https://github.com/betagouv/api-subventions-asso/issues/199)) ([64c4f7d](https://github.com/betagouv/api-subventions-asso/commit/64c4f7d155fa691c6d86824e2436a9131bcfbb87))
-   **front:** remove li in demande sub details ([32add28](https://github.com/betagouv/api-subventions-asso/commit/32add286321e1d04accae9f75e44336e8b4b23f5))
-   **front:** remove totals array in subventions ([2b96a38](https://github.com/betagouv/api-subventions-asso/commit/2b96a380083c8b64d435d215b8d76bc3cd59f876))

### Bug Fixes

-   **api:** fix association-name siret-to-siren migration ([#293](https://github.com/betagouv/api-subventions-asso/issues/293)) ([9ac3bc0](https://github.com/betagouv/api-subventions-asso/commit/9ac3bc0831b8c62172b00b32022304d95087608f))
-   **api:** fix mail extention (missing f) ([4e0e026](https://github.com/betagouv/api-subventions-asso/commit/4e0e0268a3ab376ec4854a5c497e21f7ec011677))
-   **api:** fix siret as siren in association-name ([#263](https://github.com/betagouv/api-subventions-asso/issues/263)) ([e954f22](https://github.com/betagouv/api-subventions-asso/commit/e954f223cbd5fbd8c799e98386217645a9b50579))
-   **api:** osiris service tests ([4ca6dcd](https://github.com/betagouv/api-subventions-asso/commit/4ca6dcdeb9f4bf18232e51f1eb1dd55486304438))
-   **api:** quick fix not uuse var date_modif_siren before checking if var exist ([598296f](https://github.com/betagouv/api-subventions-asso/commit/598296f6f50ba253365401fa697d390a28c735d1))
-   **dto:** change package main file ([f6867eb](https://github.com/betagouv/api-subventions-asso/commit/f6867ebd8b0721c14ef26e66565c5316c0ca207e))
-   **front:** fix ortho ([4bb2504](https://github.com/betagouv/api-subventions-asso/commit/4bb25044200ea22a3256b6c43e40cbf24fae5fe4))

### [0.10.1](https://github.com/betagouv/api-subventions-asso/compare/v0.8.7...v0.10.1) (2022-05-31)

### Features

-   **api,front,dto:** error on login better manage ([d0bec45](https://github.com/betagouv/api-subventions-asso/commit/d0bec4500004f5aea9e3b06ba1688b1cdd40cd95))
-   **api:** add get subvention by mongo id ([f24ec3b](https://github.com/betagouv/api-subventions-asso/commit/f24ec3bdcc6a1caeaab0e8868a09558edc54b62f))
-   **api:** add migration to fill association-name from osiris ([#259](https://github.com/betagouv/api-subventions-asso/issues/259)) ([00d9d75](https://github.com/betagouv/api-subventions-asso/commit/00d9d75cf94e1bff3a93fdedfc121af84835411d))
-   **api:** add route for getting list of etablissements ([2bd138a](https://github.com/betagouv/api-subventions-asso/commit/2bd138aef212406beb225c47cd6636fa6d34fd3a))
-   **api:** add route for getting one etablissement ([#255](https://github.com/betagouv/api-subventions-asso/issues/255)) ([fd6697d](https://github.com/betagouv/api-subventions-asso/commit/fd6697d4755691880bf7400723920776fffe2d06))
-   **api:** add stats route, for compute median number of requests [#243](https://github.com/betagouv/api-subventions-asso/issues/243) ([a1b9925](https://github.com/betagouv/api-subventions-asso/commit/a1b9925e35abf626ad752b1ca75b7ee9be05c06c))
-   **api:** code review ([0d3389f](https://github.com/betagouv/api-subventions-asso/commit/0d3389fb324e4e5041418d73fb2ce4a557128124))
-   **api:** stats allow the exclusion of the admin ([abf5348](https://github.com/betagouv/api-subventions-asso/commit/abf5348b68922064ff1f37c4015baba5104a5044))
-   **api:** update README ([#258](https://github.com/betagouv/api-subventions-asso/issues/258)) ([d5fe983](https://github.com/betagouv/api-subventions-asso/commit/d5fe983926c401ce4a9df0e85a7ed17617300b33))
-   **front:** add € on amount ([3510490](https://github.com/betagouv/api-subventions-asso/commit/3510490b880a836bdd110bbfe9e349b9e267b652))
-   **front:** add pipe drive chat bot ([2ce6f6e](https://github.com/betagouv/api-subventions-asso/commit/2ce6f6ef067875a23046afcc6789666a306bad73))
-   **front:** add spaces for currency amount in arrays ([#200](https://github.com/betagouv/api-subventions-asso/issues/200)) ([d27fa87](https://github.com/betagouv/api-subventions-asso/commit/d27fa8721dd714199e2d24f6ba4ce42655965ea8))
-   **front:** add tiret - on value not found ([#249](https://github.com/betagouv/api-subventions-asso/issues/249)) ([7e55201](https://github.com/betagouv/api-subventions-asso/commit/7e55201bbc30053205159ffc3b98e870cf95ea3c))
-   **front:** prefill nojs mailto ([#199](https://github.com/betagouv/api-subventions-asso/issues/199)) ([64c4f7d](https://github.com/betagouv/api-subventions-asso/commit/64c4f7d155fa691c6d86824e2436a9131bcfbb87))
-   **front:** remove li in demande sub details ([32add28](https://github.com/betagouv/api-subventions-asso/commit/32add286321e1d04accae9f75e44336e8b4b23f5))
-   **front:** remove totals array in subventions ([2b96a38](https://github.com/betagouv/api-subventions-asso/commit/2b96a380083c8b64d435d215b8d76bc3cd59f876))

### Bug Fixes

-   **api:** fix siret as siren in association-name ([#263](https://github.com/betagouv/api-subventions-asso/issues/263)) ([6ec704f](https://github.com/betagouv/api-subventions-asso/commit/6ec704f3dc7208a28a873ba7798e77643604fb8e))
-   **api:** osiris service tests ([62f336c](https://github.com/betagouv/api-subventions-asso/commit/62f336c47bd23e4bdb01438495b8125c9449bc35))
-   **api:** quick fix not uuse var date_modif_siren before checking if var exist ([fe0e971](https://github.com/betagouv/api-subventions-asso/commit/fe0e971e804636ab0ca1ce7080eae8aaafe95a45))
-   **dto:** change package main file ([f6867eb](https://github.com/betagouv/api-subventions-asso/commit/f6867ebd8b0721c14ef26e66565c5316c0ca207e))
-   **front:** fix ortho ([4bb2504](https://github.com/betagouv/api-subventions-asso/commit/4bb25044200ea22a3256b6c43e40cbf24fae5fe4))

## [0.10.0](https://github.com/betagouv/api-subventions-asso/compare/v0.8.7...v0.10.0) (2022-05-31)

### Features

-   **api,front,dto:** error on login better manage ([d0bec45](https://github.com/betagouv/api-subventions-asso/commit/d0bec4500004f5aea9e3b06ba1688b1cdd40cd95))
-   **api:** add get subvention by mongo id ([f24ec3b](https://github.com/betagouv/api-subventions-asso/commit/f24ec3bdcc6a1caeaab0e8868a09558edc54b62f))
-   **api:** add migration to fill association-name from osiris ([#259](https://github.com/betagouv/api-subventions-asso/issues/259)) ([00d9d75](https://github.com/betagouv/api-subventions-asso/commit/00d9d75cf94e1bff3a93fdedfc121af84835411d))
-   **api:** add route for getting list of etablissements ([2bd138a](https://github.com/betagouv/api-subventions-asso/commit/2bd138aef212406beb225c47cd6636fa6d34fd3a))
-   **api:** add route for getting one etablissement ([#255](https://github.com/betagouv/api-subventions-asso/issues/255)) ([fd6697d](https://github.com/betagouv/api-subventions-asso/commit/fd6697d4755691880bf7400723920776fffe2d06))
-   **api:** add stats route, for compute median number of requests [#243](https://github.com/betagouv/api-subventions-asso/issues/243) ([a1b9925](https://github.com/betagouv/api-subventions-asso/commit/a1b9925e35abf626ad752b1ca75b7ee9be05c06c))
-   **api:** code review ([0d3389f](https://github.com/betagouv/api-subventions-asso/commit/0d3389fb324e4e5041418d73fb2ce4a557128124))
-   **api:** stats allow the exclusion of the admin ([abf5348](https://github.com/betagouv/api-subventions-asso/commit/abf5348b68922064ff1f37c4015baba5104a5044))
-   **api:** update README ([#258](https://github.com/betagouv/api-subventions-asso/issues/258)) ([d5fe983](https://github.com/betagouv/api-subventions-asso/commit/d5fe983926c401ce4a9df0e85a7ed17617300b33))
-   **front:** add € on amount ([3510490](https://github.com/betagouv/api-subventions-asso/commit/3510490b880a836bdd110bbfe9e349b9e267b652))
-   **front:** add pipe drive chat bot ([2ce6f6e](https://github.com/betagouv/api-subventions-asso/commit/2ce6f6ef067875a23046afcc6789666a306bad73))
-   **front:** add spaces for currency amount in arrays ([#200](https://github.com/betagouv/api-subventions-asso/issues/200)) ([d27fa87](https://github.com/betagouv/api-subventions-asso/commit/d27fa8721dd714199e2d24f6ba4ce42655965ea8))
-   **front:** add tiret - on value not found ([#249](https://github.com/betagouv/api-subventions-asso/issues/249)) ([7e55201](https://github.com/betagouv/api-subventions-asso/commit/7e55201bbc30053205159ffc3b98e870cf95ea3c))
-   **front:** prefill nojs mailto ([#199](https://github.com/betagouv/api-subventions-asso/issues/199)) ([64c4f7d](https://github.com/betagouv/api-subventions-asso/commit/64c4f7d155fa691c6d86824e2436a9131bcfbb87))
-   **front:** remove li in demande sub details ([32add28](https://github.com/betagouv/api-subventions-asso/commit/32add286321e1d04accae9f75e44336e8b4b23f5))
-   **front:** remove totals array in subventions ([2b96a38](https://github.com/betagouv/api-subventions-asso/commit/2b96a380083c8b64d435d215b8d76bc3cd59f876))

### Bug Fixes

-   **api:** fix siret as siren in association-name ([#263](https://github.com/betagouv/api-subventions-asso/issues/263)) ([6ec704f](https://github.com/betagouv/api-subventions-asso/commit/6ec704f3dc7208a28a873ba7798e77643604fb8e))
-   **api:** quick fix not uuse var date_modif_siren before checking if var exist ([fe0e971](https://github.com/betagouv/api-subventions-asso/commit/fe0e971e804636ab0ca1ce7080eae8aaafe95a45))
-   **dto:** change package main file ([f6867eb](https://github.com/betagouv/api-subventions-asso/commit/f6867ebd8b0721c14ef26e66565c5316c0ca207e))
-   **front:** fix ortho ([4bb2504](https://github.com/betagouv/api-subventions-asso/commit/4bb25044200ea22a3256b6c43e40cbf24fae5fe4))

### [0.9.7](https://github.com/betagouv/api-subventions-asso/compare/v0.9.4...v0.9.7) (2022-06-01)

### Bug Fixes

-   **api:** fix mail extention (missing f) ([b7d18a9](https://github.com/betagouv/api-subventions-asso/commit/b7d18a90657f22a4eb911647b88e08d6bb3fcc67))

### [0.9.6](https://github.com/betagouv/api-subventions-asso/compare/v0.9.4...v0.9.6) (2022-05-30)

### Bug Fixes

-   **api:** check if api asso send rna data before parse date of rna updadte ([dd27c33](https://github.com/betagouv/api-subventions-asso/commit/dd27c33acec94b923e7991bdeddd6143e8ec8f82))

### [0.9.5](https://github.com/betagouv/api-subventions-asso/compare/v0.9.4...v0.9.5) (2022-05-30)

### Features

-   **api:** add many extentions in mail accepted ([b80cadf](https://github.com/betagouv/api-subventions-asso/commit/b80cadf5d6b296b7eb03018b18bb8c33a0f2058b))

### [0.9.4](https://github.com/betagouv/api-subventions-asso/compare/v0.8.7...v0.9.4) (2022-05-19)

### Features

-   **api:** add get subvention by mongo id ([f24ec3b](https://github.com/betagouv/api-subventions-asso/commit/f24ec3bdcc6a1caeaab0e8868a09558edc54b62f))
-   **api:** code review ([0d3389f](https://github.com/betagouv/api-subventions-asso/commit/0d3389fb324e4e5041418d73fb2ce4a557128124))
-   **front:** add spaces for currency amount in arrays ([#200](https://github.com/betagouv/api-subventions-asso/issues/200)) ([d27fa87](https://github.com/betagouv/api-subventions-asso/commit/d27fa8721dd714199e2d24f6ba4ce42655965ea8))
-   **front:** prefill nojs mailto ([#199](https://github.com/betagouv/api-subventions-asso/issues/199)) ([64c4f7d](https://github.com/betagouv/api-subventions-asso/commit/64c4f7d155fa691c6d86824e2436a9131bcfbb87))
-   **front:** remove li in demande sub details ([32add28](https://github.com/betagouv/api-subventions-asso/commit/32add286321e1d04accae9f75e44336e8b4b23f5))
-   **front:** remove totals array in subventions ([2b96a38](https://github.com/betagouv/api-subventions-asso/commit/2b96a380083c8b64d435d215b8d76bc3cd59f876))

### Bug Fixes

-   **dto:** change package main file ([f6867eb](https://github.com/betagouv/api-subventions-asso/commit/f6867ebd8b0721c14ef26e66565c5316c0ca207e))
-   **front:** fix ortho ([4bb2504](https://github.com/betagouv/api-subventions-asso/commit/4bb25044200ea22a3256b6c43e40cbf24fae5fe4))

### [0.9.3](https://github.com/betagouv/api-subventions-asso/compare/v0.9.2...v0.9.3) (2022-05-16)

### [0.9.2](https://github.com/betagouv/api-subventions-asso/compare/v0.9.1...v0.9.2) (2022-05-16)

### [0.9.1](https://github.com/betagouv/api-subventions-asso/compare/v0.9.0...v0.9.1) (2022-05-16)

### Features

-   **api:** add get subvention by mongo id ([e1e7d71](https://github.com/betagouv/api-subventions-asso/commit/e1e7d71598a75d6abe44b3b8394c6158b09bbba4))
-   **api:** code review ([d3fcebc](https://github.com/betagouv/api-subventions-asso/commit/d3fcebc3e137f91f006520883ca43bc1f10e897b))

### Bug Fixes

-   **dto:** change package main file ([fe1cca9](https://github.com/betagouv/api-subventions-asso/commit/fe1cca9ad69d079f7578e2cb2831c870fedf0ddc))

## [0.9.0](https://github.com/betagouv/api-subventions-asso/compare/v0.8.6...v0.9.0) (2022-05-16)

### Features

-   **front:** add spaces for currency amount in arrays ([#200](https://github.com/betagouv/api-subventions-asso/issues/200)) ([22a4554](https://github.com/betagouv/api-subventions-asso/commit/22a4554597b9e4da65a387aedf31c9a220b0a8e7))
-   **front:** prefill nojs mailto ([#199](https://github.com/betagouv/api-subventions-asso/issues/199)) ([5d1ffd0](https://github.com/betagouv/api-subventions-asso/commit/5d1ffd01dad28adacfd662d7e1a6cfea33707601))
-   **front:** remove li in demande sub details ([d5786d8](https://github.com/betagouv/api-subventions-asso/commit/d5786d8fed8254adfd5e0f4a07cb20f2364eb173))
-   **front:** remove totals array in subventions ([3bc528c](https://github.com/betagouv/api-subventions-asso/commit/3bc528cf06459e0e0ba15e55c875541c21df15f3))

### [0.8.7](https://github.com/betagouv/api-subventions-asso/compare/v0.8.6...v0.8.7) (2022-05-18)

### Bug Fixes

-   **api:** add ac-toulouse ([793c62d](https://github.com/betagouv/api-subventions-asso/commit/793c62db482a9198b7f2019891e6f34c06fb1294))

### [0.8.6](https://github.com/betagouv/api-subventions-asso/compare/v0.8.5...v0.8.6) (2022-05-04)

### Bug Fixes

-   **api:** add valides domaines emails ([6bfc99e](https://github.com/betagouv/api-subventions-asso/commit/6bfc99e818c73c089a54dab972cddadf40d12bfa))

### [0.8.5](https://github.com/betagouv/api-subventions-asso/compare/v0.8.4...v0.8.5) (2022-04-29)

### Bug Fixes

-   **api:** hot fix wait association name hase been save before send an other ([a2fe0d3](https://github.com/betagouv/api-subventions-asso/commit/a2fe0d32dda072e5ef6a89562d571c34bba6f41c))

### [0.8.4](https://github.com/betagouv/api-subventions-asso/compare/v0.8.3...v0.8.4) (2022-04-29)

### Bug Fixes

-   crash on asso not found ([7b724ea](https://github.com/betagouv/api-subventions-asso/commit/7b724ea17bca15bcc4db4906f3534f81ec6eb68e))

### [0.8.3](https://github.com/betagouv/api-subventions-asso/compare/v0.8.2...v0.8.3) (2022-04-29)

### Bug Fixes

-   **api:** fix parsage siret gispro and chorus logs ([be2ca6c](https://github.com/betagouv/api-subventions-asso/commit/be2ca6ca5e26f6dad4598387e9874a5486ead195))

### [0.8.2](https://github.com/betagouv/api-subventions-asso/compare/v0.8.1...v0.8.2) (2022-04-29)

### [0.8.1](https://github.com/betagouv/api-subventions-asso/compare/v0.7.2...v0.8.1) (2022-04-29)

### Features

-   **api:** adapte format to dto ([deff50d](https://github.com/betagouv/api-subventions-asso/commit/deff50d45022231feffacfa6056c7e40f1b25224))
-   **api:** add route to get sub for association or establishment ([ec0fd76](https://github.com/betagouv/api-subventions-asso/commit/ec0fd767a3cfc76c9ad54b99ad3185adb15551d3))
-   **api:** add signup route ([d2b317b](https://github.com/betagouv/api-subventions-asso/commit/d2b317bd08b086bf3c02981b317c800b34b7ddd6))
-   **api:** add stats route from logs ([972bc94](https://github.com/betagouv/api-subventions-asso/commit/972bc948e46ad2333fe3ffaf15d6d7ddf73d0cfe))
-   **api:** integrate api asso ([5e90d1d](https://github.com/betagouv/api-subventions-asso/commit/5e90d1d2f253676c8a71b3955aa7dc33d3b8d30e))
-   **api:** legalInformation rna not required and quick fix on parser and validator ([31a4661](https://github.com/betagouv/api-subventions-asso/commit/31a4661924fde3a6eaf9e476cb75ba9e8d7b6db2))
-   **api:** parse gispro action and tiers pages ([cdc1ac1](https://github.com/betagouv/api-subventions-asso/commit/cdc1ac105147542a2c25e543a415c8a544954db1))
-   **api:** wip gispro parser ([0329ea5](https://github.com/betagouv/api-subventions-asso/commit/0329ea5ddf8cf95a8660c43068176c53d4bd1ae0))
-   **dto:** add reset password response ([9354d22](https://github.com/betagouv/api-subventions-asso/commit/9354d22632bf1313a36df5b3cee7ccd001038245))
-   **dto:** add signup dto response ([6d4f11d](https://github.com/betagouv/api-subventions-asso/commit/6d4f11d0aa6ac55c4287414f4ae05f6bf88d798b))
-   **front:** add signup page ([7859ac1](https://github.com/betagouv/api-subventions-asso/commit/7859ac1320b6bf919376a97a79da2857d96d4969))
-   **front:** display info when JS disabled ([5b3f3d6](https://github.com/betagouv/api-subventions-asso/commit/5b3f3d63938a54fcb4918824d24318087ca81b37))
-   **front:** remove white spaces in input ([0f5349b](https://github.com/betagouv/api-subventions-asso/commit/0f5349b9b7cf032459f0f119124fa5197b30c0f0))
-   **front:** show good errors on reset password wrong ([44a3dac](https://github.com/betagouv/api-subventions-asso/commit/44a3dacdf547eac4537faf3cebba977be312d2d1))
-   **front:** unifomize app name ([8a4c8bc](https://github.com/betagouv/api-subventions-asso/commit/8a4c8bc72d5c69ba860c096bcc026fc62793b658))
-   **tools:** add script for scrapping phone in annuaire service public ([8fdfa1f](https://github.com/betagouv/api-subventions-asso/commit/8fdfa1f389aff38d1b2e408327b830cbb26da4ac))
-   **tools:** init learna package ([7119c1d](https://github.com/betagouv/api-subventions-asso/commit/7119c1dfddd9ae0a1020fddfe0dfb0e8ec5b5735))

### Bug Fixes

-   **api:** fix osiris date exercice debut to utc date ([d35bc51](https://github.com/betagouv/api-subventions-asso/commit/d35bc51adcc60b876cce4aaeee10f054e5098189))
-   **api:** switch tests position to avoid unknown bug ([e1a06ee](https://github.com/betagouv/api-subventions-asso/commit/e1a06ee4cc2e30b51fceb37d59bbb4a8afda9ad1))
-   fix testing return ([2422aa7](https://github.com/betagouv/api-subventions-asso/commit/2422aa75ed84de497da07c1be9dcb214efa3b349))
-   **front:** dependabot[#11](https://github.com/betagouv/api-subventions-asso/issues/11) update ejs to upgrade corrupted dependency ([370d899](https://github.com/betagouv/api-subventions-asso/commit/370d8998021eaad24b6977e254ed51b6a1216227))
-   **front:** dependency vulnerability through ejs ([e9dba16](https://github.com/betagouv/api-subventions-asso/commit/e9dba1649bfd08828e6ed57dea44d573beed0eda))
-   **front:** http status 201 is not an error (disable promise reject when status is not 200) ([acf60bf](https://github.com/betagouv/api-subventions-asso/commit/acf60bf7601115dcfd7ac9349a8ee4361b318b49))

## [0.8.0](https://github.com/betagouv/api-subventions-asso/compare/v0.7.2...v0.8.0) (2022-04-29)

### Features

-   **api:** adapte format to dto ([deff50d](https://github.com/betagouv/api-subventions-asso/commit/deff50d45022231feffacfa6056c7e40f1b25224))
-   **api:** add route to get sub for association or establishment ([ec0fd76](https://github.com/betagouv/api-subventions-asso/commit/ec0fd767a3cfc76c9ad54b99ad3185adb15551d3))
-   **api:** add signup route ([d2b317b](https://github.com/betagouv/api-subventions-asso/commit/d2b317bd08b086bf3c02981b317c800b34b7ddd6))
-   **api:** add stats route from logs ([972bc94](https://github.com/betagouv/api-subventions-asso/commit/972bc948e46ad2333fe3ffaf15d6d7ddf73d0cfe))
-   **api:** integrate api asso ([5e90d1d](https://github.com/betagouv/api-subventions-asso/commit/5e90d1d2f253676c8a71b3955aa7dc33d3b8d30e))
-   **api:** legalInformation rna not required and quick fix on parser and validator ([31a4661](https://github.com/betagouv/api-subventions-asso/commit/31a4661924fde3a6eaf9e476cb75ba9e8d7b6db2))
-   **api:** parse gispro action and tiers pages ([cdc1ac1](https://github.com/betagouv/api-subventions-asso/commit/cdc1ac105147542a2c25e543a415c8a544954db1))
-   **api:** wip gispro parser ([0329ea5](https://github.com/betagouv/api-subventions-asso/commit/0329ea5ddf8cf95a8660c43068176c53d4bd1ae0))
-   **dto:** add reset password response ([9354d22](https://github.com/betagouv/api-subventions-asso/commit/9354d22632bf1313a36df5b3cee7ccd001038245))
-   **dto:** add signup dto response ([6d4f11d](https://github.com/betagouv/api-subventions-asso/commit/6d4f11d0aa6ac55c4287414f4ae05f6bf88d798b))
-   **front:** add signup page ([7859ac1](https://github.com/betagouv/api-subventions-asso/commit/7859ac1320b6bf919376a97a79da2857d96d4969))
-   **front:** display info when JS disabled ([5b3f3d6](https://github.com/betagouv/api-subventions-asso/commit/5b3f3d63938a54fcb4918824d24318087ca81b37))
-   **front:** remove white spaces in input ([0f5349b](https://github.com/betagouv/api-subventions-asso/commit/0f5349b9b7cf032459f0f119124fa5197b30c0f0))
-   **front:** show good errors on reset password wrong ([44a3dac](https://github.com/betagouv/api-subventions-asso/commit/44a3dacdf547eac4537faf3cebba977be312d2d1))
-   **front:** unifomize app name ([8a4c8bc](https://github.com/betagouv/api-subventions-asso/commit/8a4c8bc72d5c69ba860c096bcc026fc62793b658))
-   **tools:** add script for scrapping phone in annuaire service public ([8fdfa1f](https://github.com/betagouv/api-subventions-asso/commit/8fdfa1f389aff38d1b2e408327b830cbb26da4ac))
-   **tools:** init learna package ([7119c1d](https://github.com/betagouv/api-subventions-asso/commit/7119c1dfddd9ae0a1020fddfe0dfb0e8ec5b5735))

### Bug Fixes

-   **api:** fix osiris date exercice debut to utc date ([d35bc51](https://github.com/betagouv/api-subventions-asso/commit/d35bc51adcc60b876cce4aaeee10f054e5098189))
-   **api:** switch tests position to avoid unknown bug ([e1a06ee](https://github.com/betagouv/api-subventions-asso/commit/e1a06ee4cc2e30b51fceb37d59bbb4a8afda9ad1))
-   fix testing return ([6540320](https://github.com/betagouv/api-subventions-asso/commit/65403205d949adb3ad0eaa940d0a3f6a29cd8173))
-   **front:** dependabot[#11](https://github.com/betagouv/api-subventions-asso/issues/11) update ejs to upgrade corrupted dependency ([370d899](https://github.com/betagouv/api-subventions-asso/commit/370d8998021eaad24b6977e254ed51b6a1216227))
-   **front:** dependency vulnerability through ejs ([e9dba16](https://github.com/betagouv/api-subventions-asso/commit/e9dba1649bfd08828e6ed57dea44d573beed0eda))
-   **front:** http status 201 is not an error (disable promise reject when status is not 200) ([acf60bf](https://github.com/betagouv/api-subventions-asso/commit/acf60bf7601115dcfd7ac9349a8ee4361b318b49))

### [0.7.2](https://github.com/betagouv/api-subventions-asso/compare/v0.7.1...v0.7.2) (2022-04-06)

### Features

-   **api:** fonjep add data format helper and cast number ([8971a19](https://github.com/betagouv/api-subventions-asso/commit/8971a1998aebb2f068410275a606bb9807862886))
-   **api:** parse new fonjep data ([2854035](https://github.com/betagouv/api-subventions-asso/commit/285403528c7c621597cc8957bea1fc2a26458f6a))
-   **front:** add space to currency ([b618f13](https://github.com/betagouv/api-subventions-asso/commit/b618f13124ec031507ff867212cb200857976192))
-   **front:** show message when data not found in versement and demande_subvention ([d0b14b6](https://github.com/betagouv/api-subventions-asso/commit/d0b14b6015f5e6518574d8dcaa3692e6ff6d4e62))

### Bug Fixes

-   **front:** orthographe && remove log ([0c78ccd](https://github.com/betagouv/api-subventions-asso/commit/0c78ccd8e63c498dce5cd8315eedea83d93ed19e))

### [0.7.1](https://github.com/betagouv/api-subventions-asso/compare/v0.7.0...v0.7.1) (2022-04-01)

### Bug Fixes

-   **api:** fix error in migration ([22b3e11](https://github.com/betagouv/api-subventions-asso/commit/22b3e1189748638d258656142faea491d2f3ca48))

## [0.7.0](https://github.com/betagouv/api-subventions-asso/compare/v0.6.0...v0.7.0) (2022-04-01)

### Features

-   add admin page and list user and create usre ([69e94e4](https://github.com/betagouv/api-subventions-asso/commit/69e94e4ee72445f3dc274414c6691827e8e40e70))
-   **api:** order etablisements in association ([b9d18cb](https://github.com/betagouv/api-subventions-asso/commit/b9d18cbfe9b13fec2315856404b777cb6a228d17))

## [0.6.0](https://github.com/betagouv/api-subventions-asso/compare/v0.5.2...v0.6.0) (2022-03-30)

### Features

-   add tier demandePayment activitee ([9cd6d8f](https://github.com/betagouv/api-subventions-asso/commit/9cd6d8f9bc02a96ac5ba535cf2f879e3645a9afa))
-   **api:** add cmd for datagouv ([751fbd9](https://github.com/betagouv/api-subventions-asso/commit/751fbd99e633054d5caab34fa6bfd7d7d937eb72))
-   **api:** add datagouv parser ([084edde](https://github.com/betagouv/api-subventions-asso/commit/084edde4443de67b0781026ee8c1214b85bbd79f))
-   **api:** add Entreprise siren entity and types ([ebcc26b](https://github.com/betagouv/api-subventions-asso/commit/ebcc26bc446d065aea92a30763395fbd7b683e6b))
-   **api:** add osiris actions evaluation ([9214d51](https://github.com/betagouv/api-subventions-asso/commit/9214d51f9451643ee7ab861b1a195ce2dabbf396))
-   **api:** add parse datagouv unitelegal ([a6cbddd](https://github.com/betagouv/api-subventions-asso/commit/a6cbddd9663a363ddf69d91fdeb49281f4d50a53))
-   **api:** add repository for save siren in database ([4ed3cfe](https://github.com/betagouv/api-subventions-asso/commit/4ed3cfeeb2939e598916317c98d941862bff2ca1))
-   **api:** chorus date can be excel date ([5a2ce7a](https://github.com/betagouv/api-subventions-asso/commit/5a2ce7a53501e47df56ee2d72d885965ad8c3141))
-   **api:** insert many enitites in rna-siren and clean duplicate entities in collection ([68b9a53](https://github.com/betagouv/api-subventions-asso/commit/68b9a53acdade17310c30f0bb26ba4a121b67f68))
-   **api:** parse chorus xls file ([92f52eb](https://github.com/betagouv/api-subventions-asso/commit/92f52eb71864b101abce692471500606fbe8aaa7))
-   **api:** parse new file ([4eb1f7e](https://github.com/betagouv/api-subventions-asso/commit/4eb1f7e676d3570fab304aa7814133c3d1568a8f))
-   **api:** parse new format off chorus ([8cc1f83](https://github.com/betagouv/api-subventions-asso/commit/8cc1f8394e6069ecf1c5dd50fe17efad1574bfbe))
-   **front:** add contact view ([ac70911](https://github.com/betagouv/api-subventions-asso/commit/ac7091151217035badf7bd0eaffc3686dcffddec))
-   **front:** add legal notice view ([83ed57f](https://github.com/betagouv/api-subventions-asso/commit/83ed57f39a0f506d73ceb63553d165eb32cd0d0a))
-   **front:** add news collumn in versement ([923edac](https://github.com/betagouv/api-subventions-asso/commit/923edac646752125efac98981a773f363047217c))

### Bug Fixes

-   **api:** remove html in texte ([ccf95e9](https://github.com/betagouv/api-subventions-asso/commit/ccf95e9d511fb557f9e7f83925d27ea6e5d4e2be))
-   **front:** change payments by paiements ([0290751](https://github.com/betagouv/api-subventions-asso/commit/02907517a58604d74cd2849cde657919c77cce59))

### [0.5.2](https://github.com/betagouv/api-subventions-asso/compare/v0.5.1...v0.5.2) (2022-03-29)

### [0.5.1](https://github.com/betagouv/api-subventions-asso/compare/v0.5.0...v0.5.1) (2022-03-29)

### Features

-   **api, dto:** disable sort by subvention and update dtos ([7dd05ea](https://github.com/betagouv/api-subventions-asso/commit/7dd05ea4721b7d3deaad98d97e4a2279d05435de))
-   **api:** add branche and unique_id in chorus entity and versement inteface ([5a083fc](https://github.com/betagouv/api-subventions-asso/commit/5a083fc95bc1c912202f28fa3c062ee8c19d28c2))
-   **front:** add components module (global_components) ([1e281fc](https://github.com/betagouv/api-subventions-asso/commit/1e281fcd4240c29f9116b1ae3c31f75b50d477d9))
-   **front:** add versement components ([42671aa](https://github.com/betagouv/api-subventions-asso/commit/42671aaf6d92a0168aa7349022f53f6805597e17))
-   **front:** add versement in association view ([8983672](https://github.com/betagouv/api-subventions-asso/commit/89836720b47147a189906025587d0cb1632a4fa9))
-   **front:** add versement in etablisement view ([4bfc878](https://github.com/betagouv/api-subventions-asso/commit/4bfc8783dc0c473299bcb528677b37d3add84cfb))

## [0.5.0](https://github.com/betagouv/api-subventions-asso/compare/v0.4.2...v0.5.0) (2022-03-25)

### Features

-   **front:** add link to inscription form (farmaform) ([f226316](https://github.com/betagouv/api-subventions-asso/commit/f226316df873b23e3806932001dccfbac54f5223))

### Bug Fixes

-   **front:** fix coquillette ([5778ac3](https://github.com/betagouv/api-subventions-asso/commit/5778ac33f65364b6b5a7a1deebfe514d5b9a4622))

### [0.4.2](https://github.com/betagouv/api-subventions-asso/compare/v0.4.1...v0.4.2) (2022-03-22)

### Bug Fixes

-   **front:** reset-token with \/ ([d4857b0](https://github.com/betagouv/api-subventions-asso/commit/d4857b0f551e3b23bed02111da8cbf82051d5cb9))
-   reset password token with \ ([ea4c1a5](https://github.com/betagouv/api-subventions-asso/commit/ea4c1a5717f3a18bed95896a403aa27df779d8a9))

### [0.4.1](https://github.com/betagouv/api-subventions-asso/compare/v0.4.0...v0.4.1) (2022-03-22)

## [0.4.0](https://github.com/betagouv/api-subventions-asso/compare/v0.3.0...v0.4.0) (2022-03-15)

### Features

-   **api:** add cache systeme for data entreprise api ([01cac8a](https://github.com/betagouv/api-subventions-asso/commit/01cac8ab3e66a87982c7ae1d1220fbbaa127e0a8))
-   **api:** change mail for use front url ([8b387a0](https://github.com/betagouv/api-subventions-asso/commit/8b387a079f174cabb9e2936beb8cfff2b4b04f3a))
-   **api:** search asso by siren ([9353be6](https://github.com/betagouv/api-subventions-asso/commit/9353be6e2b512da2a8bf99636fb03a6d337068ac))
-   **dto:** add etablissement_dto_response ([237f14d](https://github.com/betagouv/api-subventions-asso/commit/237f14da97313c189f615fec6f80a84a856aba98))
-   **front:** add connection page ([5768907](https://github.com/betagouv/api-subventions-asso/commit/5768907af317ac948bc59932e226ebf2a1cac39a))
-   **front:** add disconect button ([5aab5c8](https://github.com/betagouv/api-subventions-asso/commit/5aab5c84bc53dad12780bf876ed17d012f08cf53))
-   **front:** add dowload controller and route for download association data ([c044177](https://github.com/betagouv/api-subventions-asso/commit/c044177b11f8ca3dcbdfc8ee854c4b10e0901979))
-   **front:** add etablisement page ([af17207](https://github.com/betagouv/api-subventions-asso/commit/af17207de0ddc2561442390413ed73e85bc48dd6))
-   **front:** add etablissement controller ([bb9f14d](https://github.com/betagouv/api-subventions-asso/commit/bb9f14db48706a8ae2937bff31606ca3d80c570f))
-   **front:** add forget-password view ([db9c246](https://github.com/betagouv/api-subventions-asso/commit/db9c246c57609113203eef9ceb5aa606965c5afb))
-   **front:** add loader between page when we use turbo ([12f88d1](https://github.com/betagouv/api-subventions-asso/commit/12f88d1035e8c01c90eb0aa3b92b1588dd9ee0ac))
-   **front:** add reset password part ([fbf44f5](https://github.com/betagouv/api-subventions-asso/commit/fbf44f5291d921d1fd89f4a649c4743effd1542d))
-   **front:** add search asso by siren ([72698c0](https://github.com/betagouv/api-subventions-asso/commit/72698c0e0226965e30d032cbe117cf42f3f15b5f))
-   **front:** add search part ([04327ad](https://github.com/betagouv/api-subventions-asso/commit/04327ad138a189964de6e79375abcb7d733a3d3a))
-   **front:** check password before send ([57317ce](https://github.com/betagouv/api-subventions-asso/commit/57317cef1c827c8d11a833e9d2a72326c290f008))
-   **front:** move login template page to folder auth ([d72fe63](https://github.com/betagouv/api-subventions-asso/commit/d72fe637e696e06c7d622232a2f572f7d257391d))
-   **front:** redirect to asso in search ([0bddafb](https://github.com/betagouv/api-subventions-asso/commit/0bddafb4068074fbfdf9d83a936be8bc98ac28da))
-   **front:** refacto archi backend of frontoffice ([5c22ba5](https://github.com/betagouv/api-subventions-asso/commit/5c22ba55eb0b216d859bf698c070b53079885020))
-   **front:** separates views into several components ([9326763](https://github.com/betagouv/api-subventions-asso/commit/93267637e079e845e80788806d199c97adc48747))
-   **front:** show request by asso ([d8dfad7](https://github.com/betagouv/api-subventions-asso/commit/d8dfad7029976b419035d05d1e47f40c0a656de9))

### Bug Fixes

-   **api:** fix map of undefined on cache class ([d3b9b1a](https://github.com/betagouv/api-subventions-asso/commit/d3b9b1affc5a4238e2af1bdb0d4e7e2af0bd65bf))
-   **api:** search asso with rna ([7747cf8](https://github.com/betagouv/api-subventions-asso/commit/7747cf8bfaa8b5e903b61f24239c6a50a66864ae))
-   **back:** fix test ([9402587](https://github.com/betagouv/api-subventions-asso/commit/9402587032bbaf6661f6ea76c9cb8433ce35d9de))
-   **front_back:** fix error on search rna not found ([06c9355](https://github.com/betagouv/api-subventions-asso/commit/06c93558091b2518c0d633e2819182dbdb679867))
-   **front:** fix front controller no detected ([78cc520](https://github.com/betagouv/api-subventions-asso/commit/78cc520f5c7976dfca2d73eaf98459b9c606ab04))

## [0.3.0](https://github.com/betagouv/api-subventions-asso/compare/v0.2.0...v0.3.0) (2022-03-03)

### Features

-   add migration manager ([1f62394](https://github.com/betagouv/api-subventions-asso/commit/1f62394a204efb898f69c7a63da5dc4ca9138fe6))
-   add versement module ([8b7bd95](https://github.com/betagouv/api-subventions-asso/commit/8b7bd954b0553a58b97e2bfab084bd7cbc888f27))
-   index opertation type ([0c17581](https://github.com/betagouv/api-subventions-asso/commit/0c17581d049629288bd61d447116877fd4db7af1))

### Bug Fixes

-   **mail-notifier:** suppressed tab no test is alright ([3f6313a](https://github.com/betagouv/api-subventions-asso/commit/3f6313a7ffd2da37b087499c7e465f2957164786))

## [0.2.0](https://github.com/betagouv/api-subventions-asso/compare/v0.1.0...v0.2.0) (2022-02-25)

### Features

-   add cmd parse to fonjep cli controller ([15ada26](https://github.com/betagouv/api-subventions-asso/commit/15ada26fc15bf97dd20ced3c64d280ac0223afaa))
-   add event manager ([0eea7f8](https://github.com/betagouv/api-subventions-asso/commit/0eea7f8000a83e41f66e569318982e8ccc66a3a6))
-   add fonjep cli controller ([1e1a311](https://github.com/betagouv/api-subventions-asso/commit/1e1a311f83a689a1ac8d5edc44927df78a069b4a))
-   add migration for chorusline ([7ed550f](https://github.com/betagouv/api-subventions-asso/commit/7ed550feb7ad72cba1b49785720c5d1db742a452))
-   add migration for rnaSiren ([6367bcc](https://github.com/betagouv/api-subventions-asso/commit/6367bcce2042b6264595fcf6d139965a3905a937))
-   add rnaSiren module ([21cc9c2](https://github.com/betagouv/api-subventions-asso/commit/21cc9c2c84aa62db02365456323f5539ed6cdf94))
-   add tests FONJEP ([c10ef2c](https://github.com/betagouv/api-subventions-asso/commit/c10ef2c056d7394738fa8b0fad945c3be8b394ce))
-   create fonjep parser and fonjep entity ([70f11a5](https://github.com/betagouv/api-subventions-asso/commit/70f11a53222cd8a6f62c324fa4458fc19c5f5426))
-   create fonjep repository ([3d953ef](https://github.com/betagouv/api-subventions-asso/commit/3d953ef85d6a2349423d699417626567f6ab42c4))
-   create fonjep service ([b2b0944](https://github.com/betagouv/api-subventions-asso/commit/b2b0944b119a78b21d0797ffd4872de421f919e0))
-   fonjep as provider to etablissement and demandesubvention ([b2492d3](https://github.com/betagouv/api-subventions-asso/commit/b2492d3bc58159602a41bca5953ccd30a32138fe))
-   move parse file in parse helpers ([43b5f57](https://github.com/betagouv/api-subventions-asso/commit/43b5f57f776d352e7d2531ad9c16d2b4f3ae18cb))
-   osiris and lca loader on parse ([1f60957](https://github.com/betagouv/api-subventions-asso/commit/1f609571cface4823ef4bb07ef3c6cce161b1272))
-   parse new format of chorus ([c0215d4](https://github.com/betagouv/api-subventions-asso/commit/c0215d4fd3b9e678aa2c6d66c7e8f85e12ad5608))
-   print progree check if stdout exist ([e282ba9](https://github.com/betagouv/api-subventions-asso/commit/e282ba9ea07a65c768f5438c21710f0f0e21a4b5))
-   use rna siren on providers ([dc7d810](https://github.com/betagouv/api-subventions-asso/commit/dc7d810c862394eba1d8bf1aa4dd6156218f255e))

### Bug Fixes

-   fix lca test with rna siret module ([f742e81](https://github.com/betagouv/api-subventions-asso/commit/f742e8175946360fa33f96d7b4a4b304a5e56dd3))
-   review clean ([61155ce](https://github.com/betagouv/api-subventions-asso/commit/61155cea11815b36b8be391f020b0e4314f902e9))
-   use good version ([bba0618](https://github.com/betagouv/api-subventions-asso/commit/bba0618ee18d2c1293529cf59ee89d6e163fb6fa))

## [0.1.0](https://github.com/betagouv/api-subventions-asso/compare/v0.0.1...v0.1.0) (2022-02-16)

### [0.0.2](https://github.com/betagouv/api-subventions-asso/compare/v0.0.1...v0.0.2) (2022-02-16)

### 0.0.1 (2022-02-16)

### Features

-   add Auth and user module ([db291a9](https://github.com/betagouv/api-subventions-asso/commit/db291a9c366e9a74245b15b0ebdf78019cf32dad))
-   add chorus cli controller ([263c29e](https://github.com/betagouv/api-subventions-asso/commit/263c29e375ffe351c85e5cecf309a3a4cafc4be9))
-   add chorus parser and entity ([1608b2e](https://github.com/betagouv/api-subventions-asso/commit/1608b2eefd3a8311383299ec5d7a1013ec53d8a0))
-   add chorus repository and service ([d7dc7c0](https://github.com/betagouv/api-subventions-asso/commit/d7dc7c07e0e475d8a93086e45b270fd7d758bf39))
-   add cli interface ([176bd97](https://github.com/betagouv/api-subventions-asso/commit/176bd97300dec52fea612c893646a20bc46d9435))
-   add code cov actions ([494646f](https://github.com/betagouv/api-subventions-asso/commit/494646f966dd266e7e041d495f48a74837b74c62))
-   add controller in tests ([518acca](https://github.com/betagouv/api-subventions-asso/commit/518acca2217fa7480e24861ac4eb0c544b811e90))
-   add engines version in package ([9f16d8b](https://github.com/betagouv/api-subventions-asso/commit/9f16d8b8d068272c119c0efc8d0ecafa433a0fc8))
-   add externals services ([8087649](https://github.com/betagouv/api-subventions-asso/commit/8087649aba7fd5c5bbc9ba53d50d244d3e7b5ab3))
-   add helpers ([5936f9b](https://github.com/betagouv/api-subventions-asso/commit/5936f9b64573ebfa353c534887db01daae9b480a))
-   add le compte asso module ([f2517e2](https://github.com/betagouv/api-subventions-asso/commit/f2517e2618079a0be128ae7f77ec49fb98d41f72))
-   add log options ([1c10a8f](https://github.com/betagouv/api-subventions-asso/commit/1c10a8f6d67a74584bb5d085dd9261723bff505e))
-   add logger ([e4a2e47](https://github.com/betagouv/api-subventions-asso/commit/e4a2e4783292cd167acfc13bc732a10926342e8f))
-   add logout route ([c9fefb7](https://github.com/betagouv/api-subventions-asso/commit/c9fefb7221933349b82c392c6e12de0614b69fc2))
-   add mail create and forget password ([9b74be9](https://github.com/betagouv/api-subventions-asso/commit/9b74be9ab5f1fdaebb729fa51a43e44345fb5b2b))
-   add mail notifier ([410fda8](https://github.com/betagouv/api-subventions-asso/commit/410fda8c3e3560b04dd86020d1a0c44419228d20))
-   add method to get data from Siren ([9c1cc79](https://github.com/betagouv/api-subventions-asso/commit/9c1cc79a22054c592fa24d2cb72e5ef71a43359b))
-   add mongodb to app ([18bf445](https://github.com/betagouv/api-subventions-asso/commit/18bf445bf003412186efc1fec13f350f46643b4e))
-   add new parser in osiris ([8cd4c23](https://github.com/betagouv/api-subventions-asso/commit/8cd4c236efa62465e75116b3d7452ec3fc754048))
-   add osiris module ([bfa54a6](https://github.com/betagouv/api-subventions-asso/commit/bfa54a663f64e29012653a28b2b0cc1f04c69c1e))
-   add pre hook to build and lint script ([806fa20](https://github.com/betagouv/api-subventions-asso/commit/806fa20de7706b647c2305ce60412a4b5691d39f))
-   add providerMatchingKeys in RequestEntities ([d0c099e](https://github.com/betagouv/api-subventions-asso/commit/d0c099ec5c6749ffe858f1a95ba4c369a09b0e1c))
-   add search module ([ae048b2](https://github.com/betagouv/api-subventions-asso/commit/ae048b215e777a2b05067a95e78df464a74bcaa0))
-   add swagger docs and TSOA ([86e9711](https://github.com/betagouv/api-subventions-asso/commit/86e9711b61729a7b1dd0f6360e766a7c3003802e))
-   add user change password ([ce07387](https://github.com/betagouv/api-subventions-asso/commit/ce07387a9262944b1d33b142d50a99eeef826f50))
-   add user cli controller ([8909a72](https://github.com/betagouv/api-subventions-asso/commit/8909a72b26271fea670eb905de340c1b354cf817))
-   add user http controller ([3e039ce](https://github.com/betagouv/api-subventions-asso/commit/3e039cec0e6bdc73c178af4869d11c4cb4748a9d))
-   add validators ([055cf68](https://github.com/betagouv/api-subventions-asso/commit/055cf68dd4b2d1143beec5f08ed8583d43659f3e))
-   change api name ([259ee58](https://github.com/betagouv/api-subventions-asso/commit/259ee58a319329a09f3f8b01b48957eab511b616))
-   change auth routes ([39f87f0](https://github.com/betagouv/api-subventions-asso/commit/39f87f0af97f744497094de35277100b4097f940))
-   change key msg by message ([c0dbafe](https://github.com/betagouv/api-subventions-asso/commit/c0dbafef37c7a8867b6fb92dfa332cddbe58ea2f))
-   change output format ([7add298](https://github.com/betagouv/api-subventions-asso/commit/7add2989bfc409163ebf24e491a722d871544e18))
-   change output format and add budgetline and Request match ([7d59b87](https://github.com/betagouv/api-subventions-asso/commit/7d59b87c9be93afbbe05ca716501dfee4f037ff0))
-   change output format for entrepriseAPI ([7b289d6](https://github.com/betagouv/api-subventions-asso/commit/7b289d6dce5d70d101081a5076be8abc847a1ed9))
-   change siret and rna api to entreprise api ([1cbc907](https://github.com/betagouv/api-subventions-asso/commit/1cbc907b6806d8f2e101fbd982788cc983736ceb))
-   clean and update README.md ([e65ac23](https://github.com/betagouv/api-subventions-asso/commit/e65ac23f3adebaf69689c22b7c9f2ad17d72b6aa))
-   move Rna and Siret interfaces ([8435969](https://github.com/betagouv/api-subventions-asso/commit/84359697d4c8c743db3bdfbbe1180c6533f41c29))
-   osiris mutli import and extract log file ([3c86de6](https://github.com/betagouv/api-subventions-asso/commit/3c86de6a35357fc1dcf5a04104baad626f9efb54))
-   parser can have an adapter ([17d0143](https://github.com/betagouv/api-subventions-asso/commit/17d0143cc91162236a4b24d78acd1afc51a6de26))
-   paser multi file in leCompteAsso ([8f60ff4](https://github.com/betagouv/api-subventions-asso/commit/8f60ff4c02dff4c0b26b25b1feae77707669eca5))
-   restart container after init ([d0e725f](https://github.com/betagouv/api-subventions-asso/commit/d0e725f7d327df5aeca560719bdc275087fb2f1e))
-   securize search controller ([b4621bf](https://github.com/betagouv/api-subventions-asso/commit/b4621bf1d8c1cec8f87aaf93f6a1ebb3d023aa31))
-   update legal categories ([2cfe652](https://github.com/betagouv/api-subventions-asso/commit/2cfe652ffc81144180fc814436bd85b0d3776408))
-   use Siret and Rna types ([8cc30bb](https://github.com/betagouv/api-subventions-asso/commit/8cc30bb0661920b9e24b92a062def8bdcafccc59))

### Bug Fixes

-   clean for review ([928bcf9](https://github.com/betagouv/api-subventions-asso/commit/928bcf9a048193e69bef93c471054c0808e9321d))
-   fix bug rna null on LCA ([570caeb](https://github.com/betagouv/api-subventions-asso/commit/570caeb6389e4adda6f999ff1c8e2592275747a1))
-   fix github actions ([afc7088](https://github.com/betagouv/api-subventions-asso/commit/afc7088130c25bef4ebb22c53b022bdc5f71d92c))
-   lint ([9526bbd](https://github.com/betagouv/api-subventions-asso/commit/9526bbdc05215b9a32108f9a42abc1df88d12ee2))
-   review clean ([b5182b7](https://github.com/betagouv/api-subventions-asso/commit/b5182b7ac0c93b701fbe125f031f6e8a269f2018))
-   use good version ([c3e6888](https://github.com/betagouv/api-subventions-asso/commit/c3e6888b66544b73fa1a830fbbace754f2201c82))

## 0.0.0 (2022-02-11)

### Features

-   add Auth and user module ([db291a9](https://github.com/betagouv/api-subventions-asso/commit/db291a9c366e9a74245b15b0ebdf78019cf32dad))
-   add chorus cli controller ([263c29e](https://github.com/betagouv/api-subventions-asso/commit/263c29e375ffe351c85e5cecf309a3a4cafc4be9))
-   add chorus parser and entity ([1608b2e](https://github.com/betagouv/api-subventions-asso/commit/1608b2eefd3a8311383299ec5d7a1013ec53d8a0))
-   add chorus repository and service ([d7dc7c0](https://github.com/betagouv/api-subventions-asso/commit/d7dc7c07e0e475d8a93086e45b270fd7d758bf39))
-   add cli interface ([176bd97](https://github.com/betagouv/api-subventions-asso/commit/176bd97300dec52fea612c893646a20bc46d9435))
-   add code cov actions ([494646f](https://github.com/betagouv/api-subventions-asso/commit/494646f966dd266e7e041d495f48a74837b74c62))
-   add controller in tests ([518acca](https://github.com/betagouv/api-subventions-asso/commit/518acca2217fa7480e24861ac4eb0c544b811e90))
-   add engines version in package ([9f16d8b](https://github.com/betagouv/api-subventions-asso/commit/9f16d8b8d068272c119c0efc8d0ecafa433a0fc8))
-   add externals services ([8087649](https://github.com/betagouv/api-subventions-asso/commit/8087649aba7fd5c5bbc9ba53d50d244d3e7b5ab3))
-   add helpers ([5936f9b](https://github.com/betagouv/api-subventions-asso/commit/5936f9b64573ebfa353c534887db01daae9b480a))
-   add le compte asso module ([f2517e2](https://github.com/betagouv/api-subventions-asso/commit/f2517e2618079a0be128ae7f77ec49fb98d41f72))
-   add log options ([1c10a8f](https://github.com/betagouv/api-subventions-asso/commit/1c10a8f6d67a74584bb5d085dd9261723bff505e))
-   add logger ([e4a2e47](https://github.com/betagouv/api-subventions-asso/commit/e4a2e4783292cd167acfc13bc732a10926342e8f))
-   add logout route ([c9fefb7](https://github.com/betagouv/api-subventions-asso/commit/c9fefb7221933349b82c392c6e12de0614b69fc2))
-   add mail create and forget password ([9b74be9](https://github.com/betagouv/api-subventions-asso/commit/9b74be9ab5f1fdaebb729fa51a43e44345fb5b2b))
-   add mail notifier ([410fda8](https://github.com/betagouv/api-subventions-asso/commit/410fda8c3e3560b04dd86020d1a0c44419228d20))
-   add method to get data from Siren ([9c1cc79](https://github.com/betagouv/api-subventions-asso/commit/9c1cc79a22054c592fa24d2cb72e5ef71a43359b))
-   add mongodb to app ([18bf445](https://github.com/betagouv/api-subventions-asso/commit/18bf445bf003412186efc1fec13f350f46643b4e))
-   add new parser in osiris ([8cd4c23](https://github.com/betagouv/api-subventions-asso/commit/8cd4c236efa62465e75116b3d7452ec3fc754048))
-   add osiris module ([bfa54a6](https://github.com/betagouv/api-subventions-asso/commit/bfa54a663f64e29012653a28b2b0cc1f04c69c1e))
-   add pre hook to build and lint script ([806fa20](https://github.com/betagouv/api-subventions-asso/commit/806fa20de7706b647c2305ce60412a4b5691d39f))
-   add providerMatchingKeys in RequestEntities ([d0c099e](https://github.com/betagouv/api-subventions-asso/commit/d0c099ec5c6749ffe858f1a95ba4c369a09b0e1c))
-   add search module ([ae048b2](https://github.com/betagouv/api-subventions-asso/commit/ae048b215e777a2b05067a95e78df464a74bcaa0))
-   add swagger docs and TSOA ([86e9711](https://github.com/betagouv/api-subventions-asso/commit/86e9711b61729a7b1dd0f6360e766a7c3003802e))
-   add user change password ([ce07387](https://github.com/betagouv/api-subventions-asso/commit/ce07387a9262944b1d33b142d50a99eeef826f50))
-   add user cli controller ([8909a72](https://github.com/betagouv/api-subventions-asso/commit/8909a72b26271fea670eb905de340c1b354cf817))
-   add user http controller ([3e039ce](https://github.com/betagouv/api-subventions-asso/commit/3e039cec0e6bdc73c178af4869d11c4cb4748a9d))
-   add validators ([055cf68](https://github.com/betagouv/api-subventions-asso/commit/055cf68dd4b2d1143beec5f08ed8583d43659f3e))
-   change api name ([259ee58](https://github.com/betagouv/api-subventions-asso/commit/259ee58a319329a09f3f8b01b48957eab511b616))
-   change auth routes ([39f87f0](https://github.com/betagouv/api-subventions-asso/commit/39f87f0af97f744497094de35277100b4097f940))
-   change key msg by message ([c0dbafe](https://github.com/betagouv/api-subventions-asso/commit/c0dbafef37c7a8867b6fb92dfa332cddbe58ea2f))
-   change output format and add budgetline and Request match ([7d59b87](https://github.com/betagouv/api-subventions-asso/commit/7d59b87c9be93afbbe05ca716501dfee4f037ff0))
-   change output format for entrepriseAPI ([7b289d6](https://github.com/betagouv/api-subventions-asso/commit/7b289d6dce5d70d101081a5076be8abc847a1ed9))
-   change siret and rna api to entreprise api ([1cbc907](https://github.com/betagouv/api-subventions-asso/commit/1cbc907b6806d8f2e101fbd982788cc983736ceb))
-   clean and update README.md ([e65ac23](https://github.com/betagouv/api-subventions-asso/commit/e65ac23f3adebaf69689c22b7c9f2ad17d72b6aa))
-   move Rna and Siret interfaces ([8435969](https://github.com/betagouv/api-subventions-asso/commit/84359697d4c8c743db3bdfbbe1180c6533f41c29))
-   osiris mutli import and extract log file ([3c86de6](https://github.com/betagouv/api-subventions-asso/commit/3c86de6a35357fc1dcf5a04104baad626f9efb54))
-   parser can have an adapter ([17d0143](https://github.com/betagouv/api-subventions-asso/commit/17d0143cc91162236a4b24d78acd1afc51a6de26))
-   paser multi file in leCompteAsso ([8f60ff4](https://github.com/betagouv/api-subventions-asso/commit/8f60ff4c02dff4c0b26b25b1feae77707669eca5))
-   restart container after init ([d0e725f](https://github.com/betagouv/api-subventions-asso/commit/d0e725f7d327df5aeca560719bdc275087fb2f1e))
-   securize search controller ([b4621bf](https://github.com/betagouv/api-subventions-asso/commit/b4621bf1d8c1cec8f87aaf93f6a1ebb3d023aa31))
-   update legal categories ([2cfe652](https://github.com/betagouv/api-subventions-asso/commit/2cfe652ffc81144180fc814436bd85b0d3776408))
-   use Siret and Rna types ([8cc30bb](https://github.com/betagouv/api-subventions-asso/commit/8cc30bb0661920b9e24b92a062def8bdcafccc59))

### Bug Fixes

-   clean for review ([928bcf9](https://github.com/betagouv/api-subventions-asso/commit/928bcf9a048193e69bef93c471054c0808e9321d))
-   fix bug rna null on LCA ([570caeb](https://github.com/betagouv/api-subventions-asso/commit/570caeb6389e4adda6f999ff1c8e2592275747a1))
-   fix github actions ([afc7088](https://github.com/betagouv/api-subventions-asso/commit/afc7088130c25bef4ebb22c53b022bdc5f71d92c))
-   lint ([9526bbd](https://github.com/betagouv/api-subventions-asso/commit/9526bbdc05215b9a32108f9a42abc1df88d12ee2))
-   review clean ([b5182b7](https://github.com/betagouv/api-subventions-asso/commit/b5182b7ac0c93b701fbe125f031f6e8a269f2018))
-   use good version ([5cbb995](https://github.com/betagouv/api-subventions-asso/commit/5cbb995502db3b5c999795f0dcc52829317844d0))
