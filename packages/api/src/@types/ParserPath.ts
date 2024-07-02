/*
on first level, adding params means more nesting (ex: ["a", "b"] targets data.a.b
on second level, several params means alternatives (caps, plural) (ex: [["a", "b"]] targets data.a and data.b (if data.a is undefined)
this means that ["a", ["b", "c"], "d"] tries targetting data.a.b.d then data.a.c.d
* */
export type ParserPath = (string | string[])[];
