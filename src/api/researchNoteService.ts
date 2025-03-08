import apiClient from "./apiClient";

export const fetchResearchNotesForTickers = async (tickerSymbols: string[]): Promise<Record<string, string>> => {
    try {
        const response = await apiClient.get(`/research-notes`, {
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
        const response = await apiClient.get(`/research-notes/${tickerSymbol}`);
        return response.data.content || "";
    } catch (error) {
        console.error(`Error fetching note for ${tickerSymbol}:`, error);
        return "";
    }
};

export const saveResearchNote = async (tickerSymbol: string, content: string): Promise<boolean> => {
    try {
        const response= await apiClient.post(`/research-notes`, {
            tickerSymbol,
            content
        });
        return response.status === 200; 
    } catch (error) {
        console.error("Error saving research note:", error);
        return false; 
    }
};

export const deleteResearchNote = async (noteId: string) => {
    try {
      await apiClient.delete(`/research-notes/${noteId}`);
    } catch (error) {
      console.error(" Error deleting research note:", error);
      throw error;
    }
  };
