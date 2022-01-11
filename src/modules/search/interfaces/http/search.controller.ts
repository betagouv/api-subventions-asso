import express from "express";

import searchService from "../../search.service";

export const router = express.Router();
export const path = "/search";

router.get("/siret/:siret", async (req, res) => {
    if (typeof req.params.siret !== "string") {
        return res.status(422).send(JSON.stringify({ error: 422, message: "Please add a siret for search"})) // TODO Manage error
    }
    const result = await searchService.getBySiret(req.params.siret);
    res.json(result);
});


router.get("/rna/:rna", async (req, res) => {
    if (typeof req.params.rna !== "string") {
        return res.status(422).send(JSON.stringify({ error: 422, message: "Please add a rna for search"})) // TODO Manage error
    }
    const result = await searchService.getByRna(req.params.rna);
    res.json(result);
});