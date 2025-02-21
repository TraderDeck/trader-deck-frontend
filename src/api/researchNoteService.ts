import apiClient from "./apiClient";

const USER_ID = "550e8400-e29b-41d4-a716-446655440000"; // Replace with actual user ID

export const fetchResearchNotesForTickers = async (tickerSymbols: string[]): Promise<Record<string, string>> => {
    try {
        const response = await apiClient.get(`/research-notes/${USER_ID}`, {
            params: { tickerSymbols: tickerSymbols.join(",") }
        });

        const notes: Record<string, string> = {};
        response.data.forEach((note: { tickerSymbol: string; content: string }) => {
            notes[note.tickerSymbol] = note.content;
        });

        return notes;
    } catch (error) {
        console.error("Error fetching research notes:", error);
        return {}; 
    }
};

export const fetchResearchNoteForTicker = async (tickerSymbol: string): Promise<string> => {
    try {
        const response = await apiClient.get(`/research-notes/${USER_ID}/${tickerSymbol}`);
        return response.data.content || "";
    } catch (error) {
        console.error(`Error fetching note for ${tickerSymbol}:`, error);
        return "";
    }
};

export const saveResearchNote = async (tickerSymbol: string, content: string): Promise<boolean> => {
    try {
        console.log("about to call api ")
        const response= await apiClient.post(`/research-notes`, {
            tickerSymbol,
            userId: USER_ID,
            content
        });
        return response.status === 200; 
    } catch (error) {
        console.error("Error saving research note:", error);
        return false; 
    }
};
