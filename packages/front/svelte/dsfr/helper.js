export const getIconClass = icon => {
    if (!icon) return "";
    else return icon.startsWith("fr-icon-") ? icon : `fr-icon-${icon}`;
};
