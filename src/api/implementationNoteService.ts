import apiClient from "./apiClient";

export const fetchImplementationNotesForTickers = async (tickerSymbols: string[]): Promise<Record<string, string>> => {
    try {
        const response = await apiClient.get(`/implementation-notes`, {
            params: { tickerSymbols: tickerSymbols.join(",") }
        });

        const notes: Record<string, string> = {};
        response.data.forEach((note: { tickerSymbol: string; content: string }) => {
            notes[note.tickerSymbol] = note.content;
        });

        return notes;
    } catch (error) {
        console.error("Error fetching implementation notes:", error);
        return {}; 
    }
};

export const fetchImplementationNoteForTicker = async (tickerSymbol: string): Promise<string> => {
    try {
        const response = await apiClient.get(`/implementation-notes/${tickerSymbol}`);
        return response.data.content || "";
    } catch (error) {
        console.error(`Error fetching note for ${tickerSymbol}:`, error);
        return "";
    }
};

export const saveImplementationNote = async (tickerSymbol: string, content: string): Promise<boolean> => {
    try {
        const response= await apiClient.post(`/implementation-notes`, {
            tickerSymbol,
            content
        });
        return response.status === 200; 
    } catch (error) {
        console.error("Error saving implementation note:", error);
        return false; 
    }
};

export const deleteImplementationNote = async (noteId: string) => {
    try {
      await apiClient.delete(`/implementation-notes/${noteId}`);
    } catch (error) {
      console.error(" Error deleting implementation note:", error);
      throw error;
    }
  };
