# Information à connaitre sur les données subventia

Plus de détails ici : https://docs.google.com/spreadsheets/d/14QlctaBexdPPvuHUXWXNJAAZj1T-FMj6/edit?usp=drive_link&ouid=114321093337136354876&rtpof=true&sd=true

- Une subvention est identifiée par la **Référence administrative - Demande**, il y a 12 lignes de dépense par subvention

- L'attribut **Financeur Principale** fait en realité réference au **service instructeur**

- L'attribut **Date-Décision** est nul lorsque la décision n'a pas été prise ou la subvention n'a pas été accordée

- **Montant voté TTC - Décision** : la valaeur est nulle si la demande a été refusée ou lorsque la décision n'a pas encore été prise

- **Status-Dossier de financement :** la valeur est nulle lorsque la subvention n'a pas été accordée

- **Dispositif - Dossier de financement :** la valeur est nulle lorsque la subventio n'as pas été accordée

# Données que on va exclure car qualité de données pas satisfaite

- date décision < annee_demande

# Vérification ultérieures qui pourraient être faites dans un deuxième temps

- corréction éventuelle du status de la demande si pas cohérent avec ce qui est observé sur Chorus
