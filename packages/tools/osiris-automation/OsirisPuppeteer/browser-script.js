/* global SaveByteArray */

module.exports = year => {
    const holdSaveByteArray = SaveByteArray;
    window.SaveByteArray = (reportName, byte) => {
        // Use this because all files have the same name
        return holdSaveByteArray((window.currentExportName || "NO_CURRENT_EXPORT_NAME") + "-" + reportName, byte);
    };

    window.onFileDowloadEnded = () => {
        // Is call by node when dowload is ended
        if (window.waitingCallbackDownload) window.waitingCallbackDownload();
    };

    const domHelper = {
        emitChange: element => {
            if ("createEvent" in document) {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);
                element.dispatchEvent(evt);
            } else {
                element.fireEvent("onchange");
            }
        },
        onElementChange(element) {
            return new Promise(resolve => {
                const config = {
                    attributes: true,
                    childList: true,
                    subtree: true,
                };

                const callback = () => {
                    observer.disconnect();
                    resolve();
                };

                const observer = new MutationObserver(timeHelper.debounce(() => callback(), 2000));
                observer.observe(element, config);
            });
        },
        isInDepassement() {
            const depassementElement = document.getElementById("nbDepassement");
            if (depassementElement.style.display != "none") {
                depassementElement.style.display = "none"; // Reset to default value
                return true;
            }

            return false;
        },
        async submitForm(fileName) {
            document.getElementById("BtnRapportSignalr").click();
            await timeHelper.wait();
            console.log(fileName);
            window.currentExportName = fileName;
        },
    };

    const timeHelper = {
        wait(time = 1000) {
            return new Promise(r => {
                setTimeout(r, time);
            });
        },
        debounce(func, timeout = 300) {
            let timer;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    func.apply(this, args);
                }, timeout);
            };
        },
    };

    const downloadHelper = {
        async waitDownload() {
            return new Promise(r => {
                window.waitingCallbackDownload = r;
            });
        },
    };

    async function stepTypeFinancement() {
        const selector = document.getElementById("ProgrammeTypeFinancementId");
        const listTypeFinancement = [...selector.options];
        return listTypeFinancement.reduce(async (acc, typeElt) => {
            await acc;
            const financementType = typeElt.text;

            console.log("START " + financementType);

            typeElt.selected = true;
            await domHelper.emitChange(selector);

            await stepSubType(financementType);
        }, Promise.resolve());
    }

    async function stepSubType(name) {
        const sousTypeSelect = document.getElementById("SousTypeFinancementId");

        await domHelper.onElementChange(sousTypeSelect);
        const sousTypeOptions = [...sousTypeSelect.options];
        return sousTypeOptions.reduce(async (acc, optionElt) => {
            await acc;
            const subTypeText = optionElt.text;

            console.log("START " + subTypeText);

            optionElt.selected = true;
            await domHelper.emitChange(sousTypeSelect);

            await stepYear(`${name}-${subTypeText}`);
        }, Promise.resolve());
    }

    async function stepYear(name) {
        const yearsSelect = document.getElementById("Annee");

        const yearsOption = [...yearsSelect.options].find(element => element.value === year);

        if (!yearsOption) throw new Error("The year does not exist " + year);

        yearsOption.selected = true;

        await domHelper.emitChange(yearsSelect);

        await stepService(`${name}-${yearsOption.text}`);
    }

    async function stepService(name) {
        const serviceSelect = document.getElementById("ServiceId");

        const serviceOptions = [...serviceSelect.options];
        return serviceOptions.reduce(async (acc, optionElt) => {
            await acc;
            const serviceText = optionElt.text;

            console.log("START " + serviceText);

            optionElt.selected = true;
            await domHelper.emitChange(serviceSelect);

            await stepServiceTerritoriaux(`${name}-${serviceText}`);
        }, Promise.resolve());
    }

    async function stepServiceTerritoriaux(name) {
        const serviceTerritoriauxSelect = document.getElementById("IncludeSs");

        const option = [...serviceTerritoriauxSelect.options].find(element => element.value === "False");

        if (!option) throw new Error("The year does not exist " + year);

        option.selected = true;

        await domHelper.emitChange(serviceTerritoriauxSelect);

        await stepModaliteFinancement(`${name}-ServiceTerritoriaux_${option.text}`);
    }

    async function stepModaliteFinancement(name) {
        await domHelper.submitForm(name);
        if (domHelper.isInDepassement()) {
            // Big export so we cut
            const modaliteSelect = document.getElementById("IsPluriannuel");

            const options = [...modaliteSelect.options];
            return options.reduce(async (acc, optionElt) => {
                await acc;
                const optionText = optionElt.text;

                console.log("START " + optionText);

                optionElt.selected = true;
                await domHelper.emitChange(modaliteSelect);

                await stepTypeFederation(`${name}-${optionText}`);
            }, Promise.resolve());
        } else {
            await downloadHelper.waitDownload();
        }
    }

    async function stepTypeFederation(name) {
        const selectIsVisible = document.getElementById("Div_TypeFederationId").style.display !== "none";

        const download = async name => {
            await domHelper.submitForm(name);
            if (domHelper.isInDepassement()) {
                console.error("EXPORT too big");
                return; // Export too BIG
            }

            await downloadHelper.waitDownload();
        };

        if (selectIsVisible) {
            const typeFederationSelect = document.getElementById("TypeFederationId");

            const options = [...typeFederationSelect.options];
            return options.reduce(async (acc, optionElt) => {
                await acc;
                const optionText = optionElt.text;

                console.log("START " + optionText);

                optionElt.selected = true;
                await domHelper.emitChange(typeFederationSelect);

                return download(`${name}-${optionText}`);
            }, Promise.resolve());
        } else {
            return download(name);
        }
    }

    return stepTypeFinancement();
};
