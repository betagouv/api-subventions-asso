const { default: axios } = require('axios');
const qs = require("qs")
require('dotenv/config')

const DAUPHIN_EMAIL = process.env.DAUPHIN_EMAIL;
const DAUPHIN_PASSWORD = process.env.DAUPHIN_PASSWORD;

const siren = process.argv[2];

function getAuthToken() {
    const data = qs.stringify({
        username: DAUPHIN_EMAIL,
        password: DAUPHIN_PASSWORD,
        redirectTo: "https://agent-dauphin.cget.gouv.fr/agents/#/cget/home?redirectTo=portal.home",
        captcha: undefined
    })
    
    return axios.post(
        "https://agent-dauphin.cget.gouv.fr/account-management/cget-agents/tokens",
        data,
        {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/x-www-form-urlencoded",
                "Referer": "https://agent-dauphin.cget.gouv.fr/account-management/cget-agents/ux/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            }
        }
    ).then(reslut => {
        return reslut.data;
    })
}

async function getTiers(siren, token) {
    const query = {
        "from": 0,
        "size": 1000,
        "type": "tiers",
        "aggregations": false,
        "query": siren,
        "facets": {
            "famille": ["Association"],
            "status": ["SUPPORTED"]
        }
    }
    const result = await axios.post(
        "https://agent-dauphin.cget.gouv.fr/referentiel-tiers/cget/tiers/search/fullText",
        query,
        {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": "Bearer " + token,
                "content-type": "application/json;charset=UTF-8",
                "mg-authentication": "true",
                "Referer": "https://agent-dauphin.cget.gouv.fr/agents/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
        }
    ).catch(e => {debugger});

    const data = result.data;

    const tiers = data.hits.hits.filter(hit => {
        return hit._source.SIREN === siren
    }).map(h => h._source)
    return tiers;
}

async function searchDemandeByTier(siren, token) {
    const result = await axios.post(
        //"https://agent-dauphin.cget.gouv.fr/request/api/cget/sources/aides/_search",
        "https://agent-dauphin.cget.gouv.fr/referentiel-financement/api/tenants/cget/demandes-financement/tables/_search",
        {
            "size": 2000,
            "query": {
                "filtered": {
                    "filter": {
                        "bool": {
                            "must": [
                                {
                                    "bool": {
                                        "should":[ {
                                            "nested": {
                                                "path": "beneficiaires",
                                                "filter": {
                                                    "bool": {
                                                        "should": [
                                                            {
                                                                "query": {
                                                                    "query_string": {
                                                                        "query": "beneficiaires.SIRET.SIREN:" + siren,
                                                                        "analyze_wildcard": true
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    ],
                                }
                            }
                        ]
                    }
                }
            }
        },
        "_source": [],
        "aggs": {}
    },
    {
        "headers": {
            "accept": "application/json, text/plain, */*,application/vnd.mgdis.tiers-3.19.0+json",
            "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
            "authorization": "Bearer " + token,
            "content-type": "application/json;charset=UTF-8",
            "mg-authentication": "true",
            "Referer": "https://agent-dauphin.cget.gouv.fr/referentiel-financement/public/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
    }
    )

    return result.data.hits.hits.map(h => h._source);
}


async function main() {
    if (!siren) throw new Error('siren argument is missing');
    
    console.log("GET token")
    const token = await getAuthToken();
    console.log("Token OK");
    
    const time = Date.now();
    // console.log("GET Tiers");
    // const tiers = await getTiers(siren, token);
    // console.log("Tiers ok (" + tiers.length + ")");

    console.log("Get demandes");
    const demandes = await searchDemandeByTier(siren, token); //await Promise.all(tiers.map(t => searchDemandeByTier(t, token)));

    const formatedDemandes = demandes.flat().map(demande => {
        const montantDemande = (demande?.avisPrivilegies || []).reduce((acc, avis) => {
            return acc + ( avis?.montant?.ht || 0 );
        }, 0) || 0

        const montantAccorde = (demande?.avisPrivilegies || []).reduce((acc, avis) => {
            if (avis.avisRecevabilite && avis.avisRecevabilite.montantPropose) return acc + avis.avisRecevabilite.montantPropose.ht
            return acc
        }, 0) || 0
        return {
            title: demande.intituleProjet,
            description: (demande.description || { value: demande.virtualStatusLabel }).value,
            date: new Date(demande.date),
            service: (demande?.financeursPrivilegies || [{title: ""}])[0].title || "",
            dispositif: demande?.dispositif?.title,
            montantDemande,
            montantAccorde,
            status: demande.status
        }
    });
    console.log(formatedDemandes, formatedDemandes.length);
    console.log(Date.now() - time);
    debugger;
}


main();

/**
 * SERVICE insctructeur
 * DATE
 * Dispositif *
 * nom du Project
 * MONTANT demande
 * Montant accorder
 * status
 */