
export const getYMDFromISO = (timestamp: string) => timestamp.split(" ")[0];

// Winston seems to store ISO Timestamp in a specific format (replace T with space)
export const formatTimestamp = (timestamp: string) => {
    return timestamp.replace("T", " ");
};