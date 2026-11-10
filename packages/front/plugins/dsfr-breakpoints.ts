import { Breakpoints } from "@gouvfr/dsfr/src/dsfr/core/script/api/modules/register/breakpoints.js";

const dsfrMediaQueries = new Map<string, string>();
const breakpoints: Record<string, { id: string; minWidth: number }> = Breakpoints;

for (const { id, minWidth } of Object.values(breakpoints)) {
    dsfrMediaQueries.set(`--dsfr-min-width-${id}`, `(min-width: ${minWidth}em)`);
    dsfrMediaQueries.set(`--dsfr-max-width-${id}`, `(max-width: ${minWidth}em)`);
}

export const dsfrBreakpoints = {
    postcssPlugin: "dsfr-breakpoints",
    AtRule: {
        media(rule) {
            const alias = /^\(\s*(--dsfr-[\w-]+)\s*\)$/.exec(rule.params)?.[1];
            if (!alias) return;

            const query = dsfrMediaQueries.get(alias);
            if (!query) throw rule.error(`Unknown DSFR media alias: ${alias}`);

            rule.params = query;
        },
    },
};
